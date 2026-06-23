// npm install react-image-crop
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { api } from "../stores/api.service.js";
import Navbar from "../components/Navbar";
import {
  RotateCw,
  Maximize2,
  Crop,
  Palette,
  Sliders,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  Image as ImageIcon,
  Download,
  Info,
  FlipHorizontal,
  FlipVertical,
  Type,
  AlertTriangle,
  LogIn,
  ArrowLeft,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

// PIL .convert() modes your backend accepts directly via img.convert(grayscale_data).
// Preview filters here are CSS approximations for the UI only — the real
// transformation happens server-side via Pillow, so previews won't be pixel-exact.
const COLOR_MODES = [
  {
    value: "RGB",
    label: "Original",
    desc: "Keep original colors",
    preview: "none",
  },
  {
    value: "L",
    label: "Grayscale",
    desc: "Black & white",
    preview: "grayscale(100%)",
  },
  {
    value: "1",
    label: "Binary",
    desc: "Pure black & white",
    preview: "grayscale(100%) contrast(1000%)",
  },
];

// Backend Literal: "JPEG" | "PNG" | "webp" | "jpeg" | "jpg" — values must match casing exactly.
const FORMATS = [
  { value: "JPEG", label: "JPEG" },
  { value: "PNG", label: "PNG" },
  { value: "webp", label: "WEBP" },
];

const TABS = [
  { id: "resize", label: "Resize", Icon: Maximize2 },
  { id: "rotate", label: "Rotate", Icon: RotateCw },
  { id: "crop", label: "Crop", Icon: Crop },
  { id: "color", label: "Color", Icon: Palette },
  { id: "export", label: "Export", Icon: Sliders },
];

const formatBytes = (b) =>
  !b
    ? "—"
    : b > 1024 * 1024
      ? `${(b / 1024 / 1024).toFixed(2)} MB`
      : `${(b / 1024).toFixed(1)} KB`;

const POLL_INTERVAL_MS = 1200;
const POLL_TIMEOUT_MS = 60_000; // give up after 60s so the UI never hangs forever

// Cross-origin <a download> is silently ignored by browsers — fetch the bytes
// ourselves and trigger the download from a same-origin blob URL instead.
async function downloadViaBlob(url, filename) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("Fetch failed");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // CORS or network failure — fall back to just opening the file.
    window.open(url, "_blank");
  }
}

// ─── component ───────────────────────────────────────────────────────────────
export function EditImage({ user, setUser, onLogOut, setOnLogOut }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const image = state?.image;

  const [tab, setTab] = useState("resize");

  // transform state
  const [width, setWidth] = useState(image?.width || 500);
  const [height, setHeight] = useState(image?.height || 500);
  const [rotation, setRotation] = useState(0);
  const [colorMode, setColorMode] = useState("RGB");

  // crop — real drag-rectangle selection via react-image-crop
  const [cropEnabled, setCropEnabled] = useState(false);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  // export options
  const [format, setFormat] = useState("JPEG");
  const [quality, setQuality] = useState(85);
  const [flip, setFlip] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [watermark, setWatermark] = useState("");

  // job state — POST returns a jobId, GET /job-status/:jobId is polled until done
  const [phase, setPhase] = useState("idle"); // idle | submitting | polling | done | error
  const [errMsg, setErrMsg] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [history, setHistory] = useState([]);

  const [copied, setCopied] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const pollRef = useRef(null);
  const pollStartRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // Clean up any in-flight polling if the component unmounts mid-job.
  useEffect(() => () => stopPolling(), []);

  const previewFilter =
    COLOR_MODES.find((m) => m.value === colorMode)?.preview || "none";
  const busy = phase === "submitting" || phase === "polling";

  const onImageLoad = (e) => {
    // start with a full-image selection box so users see the handles immediately
    const { width: w, height: h } = e.currentTarget;
    setCrop({
      unit: "px",
      x: w * 0.1,
      y: h * 0.1,
      width: w * 0.8,
      height: h * 0.8,
    });
  };

  // Handle 401s consistently in one place so "session expired" is never silently swallowed.
  const handleAuthOrOtherError = (err, fallbackMsg) => {
    if (err.response?.status === 401) {
      setSessionExpired(true);
      setPhase("error");
      return;
    }
    setErrMsg(err.response?.data?.message || err.message || fallbackMsg);
    setPhase("error");
  };

  const handleSave = async () => {
    try {
      setPhase("submitting");
      setErrMsg("");
      setSessionExpired(false);
      stopPolling();

      // Map the drag-selected crop box (in displayed pixel space) back to the
      // original image's real pixel space, since that's what crop_meth needs.
      let cropPayload = {
        left: 0,
        top: 0,
        right: image.width,
        bottom: image.height,
      };

      if (tab === "crop" && cropEnabled && completedCrop && imgRef.current) {
        const img = imgRef.current;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        cropPayload = {
          left: Math.round(completedCrop.x * scaleX),
          top: Math.round(completedCrop.y * scaleY),
          right: Math.round((completedCrop.x + completedCrop.width) * scaleX),
          bottom: Math.round((completedCrop.y + completedCrop.height) * scaleY),
        };
      }

      const selectedFormat =
        FORMATS.find((f) => f.value === format) || FORMATS[0];

      // Becomes req.body -> transformingparameter server-side. The worker pairs
      // it with imageInfo.originalUrl before calling FastAPI, so no imageurl here.
      const payload = {
        resized: { width: Number(width), height: Number(height) },
        crop: cropPayload,
        format: selectedFormat.value,
        flip,
        mirror,
        watermark,
        quality: Number(quality),
        grayscale: colorMode,
        rotate: Number(rotation),
      };

      const submitRes = await api.post(
        `/image/transformimage/${image.generatedCode}`,
        payload,
      );
      const jobId = submitRes.data?.jobId;

      if (!jobId) {
        throw new Error("Server did not return a jobId.");
      }

      setPhase("polling");
      pollStartRef.current = Date.now();

      pollRef.current = setInterval(async () => {
        try {
          if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) {
            stopPolling();
            setErrMsg("Processing took too long. Please try again.");
            setPhase("error");
            return;
          }

          const poll = await api.get(`/image/job-status/${jobId}`);
          const d = poll.data;

          if (d.msg === "Job completed") {
            stopPolling();

            const result = d.result;
            const img = result.image; // full Mongo doc: originalUrl, generatedCode, imageSize, bytes...

            const newResult = {
              id: Date.now(),
              previewUrl: img.originalUrl, // real Cloudinary file — safe to render directly
              shareUrl: result.url, // app's own shareable redirect link
              code: result.code,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: img.bytes,
              createdAt: img.createdAt || new Date().toISOString(),
            };

            setHistory((prev) => [newResult, ...prev]);
            setPhase("done");

            // reset tools
            setRotation(0);
            setCropEnabled(false);
            setCrop({ unit: "%", x: 10, y: 10, width: 80, height: 80 });
            setCompletedCrop(null);
          }

          if (d.msg === "Job failed") {
            stopPolling();
            setErrMsg(d.reason || "Processing failed. Try again.");
            setPhase("error");
          }
          // otherwise: still pending — keep polling
        } catch (pollErr) {
          stopPolling();
          handleAuthOrOtherError(
            pollErr,
            "Network error while checking job status.",
          );
        }
      }, POLL_INTERVAL_MS);
    } catch (err) {
      handleAuthOrOtherError(err, "Request failed.");
    }
  };

  const copyURL = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (r) => {
    setDownloadingId(r.id);
    const ext = r.format === "webp" ? "webp" : r.format?.toLowerCase() || "jpg";
    await downloadViaBlob(r.previewUrl, `edited-${r.code}.${ext}`);
    setDownloadingId(null);
  };

  const goToGallery = () => navigate("/gallery");
  const goToLogin = () => navigate("/login");

  const latest = history[0];

  if (!image)
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center text-white/40">
        No image selected.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#05070d] text-white font-mono">
      <Navbar
        user={user}
        setUser={setUser}
        onLogOut={onLogOut}
        setOnLogOut={setOnLogOut}
      />

      <div className="pt-20 px-6 pb-16 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 mb-6 text-xs text-white/30">
          <span
            className="hover:text-white/60 cursor-pointer transition"
            onClick={goToGallery}
          >
            Gallery
          </span>
          <ChevronRight size={12} />
          <span className="text-cyan-400">{image.generatedCode}</span>
        </div>

        {/* ── session expired banner — distinct from generic errors, never silently missed ── */}
        {sessionExpired && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-sm text-amber-200 font-semibold">
                  Your session has expired
                </p>
                <p className="text-xs text-amber-200/60">
                  Please sign in again to continue editing.
                </p>
              </div>
            </div>
            <button
              onClick={goToLogin}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition"
            >
              <LogIn size={13} />
              Sign In
            </button>
          </div>
        )}

        <div className="grid grid-cols-[1fr_360px] gap-5">
          {/* ── LEFT: image canvas ── */}
          <div
            className="rounded-2xl overflow-hidden border border-white/5 bg-[#080b12] relative"
            style={{ minHeight: 520 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0b0f1a]">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <ImageIcon size={12} />
                <span>{image.generatedCode}</span>
                <span className="text-white/20">·</span>
                <span>
                  {image.width}×{image.height}px
                </span>
              </div>
              <div className="flex gap-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${phase === "error" ? "bg-red-500/60" : "bg-white/10"}`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full ${phase === "polling" ? "bg-yellow-400/60" : "bg-white/10"}`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full ${phase === "done" ? "bg-cyan-400/70" : "bg-cyan-500/40"}`}
                />
              </div>
            </div>

            <div
              className="flex items-center justify-center p-8"
              style={{ minHeight: 450 }}
            >
              {tab === "crop" && cropEnabled ? (
                <div
                  className="w-full flex items-center justify-center"
                  style={{ height: 450 }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    keepSelection
                  >
                    <img
                      ref={imgRef}
                      src={image.image}
                      onLoad={onImageLoad}
                      alt=""
                      style={{
                        maxHeight: 430,
                        maxWidth: "100%",
                        display: "block",
                      }}
                    />
                  </ReactCrop>
                </div>
              ) : (
                <img
                  src={
                    latest && phase === "done" ? latest.previewUrl : image.image
                  }
                  alt=""
                  style={{
                    maxHeight: 430,
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: phase === "done" ? "none" : previewFilter,
                    transform:
                      phase === "done"
                        ? "none"
                        : `rotate(${rotation}deg) ${flip ? "scaleY(-1)" : ""} ${mirror ? "scaleX(-1)" : ""}`,
                    transition: "filter 0.3s, transform 0.3s",
                    borderRadius: 8,
                  }}
                />
              )}
            </div>

            {busy && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <Loader2 className="animate-spin text-cyan-400" size={32} />
                <p className="text-xs text-white/50 font-mono">
                  {phase === "submitting"
                    ? "Queuing job..."
                    : "Processing image..."}
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: toolbox ── */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-5 bg-[#0b0f1a] rounded-xl border border-white/5 p-1 gap-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-[11px] transition-all ${
                    tab === id
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-[#0b0f1a] rounded-xl border border-white/5 p-5 flex-1">
              {/* RESIZE */}
              {tab === "resize" && (
                <div className="space-y-5">
                  <SectionLabel>Dimensions</SectionLabel>
                  <FieldRow label="Width (px)">
                    <NumberInput
                      value={width}
                      onChange={setWidth}
                      min={10}
                      max={4000}
                    />
                  </FieldRow>
                  <FieldRow label="Height (px)">
                    <NumberInput
                      value={height}
                      onChange={setHeight}
                      min={10}
                      max={4000}
                    />
                  </FieldRow>
                  <div className="text-xs text-white/20 pt-1">
                    Aspect ratio: {(width / height).toFixed(2)}
                  </div>
                </div>
              )}

              {/* ROTATE */}
              {tab === "rotate" && (
                <div className="space-y-5">
                  <SectionLabel>Rotation</SectionLabel>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-cyan-300 tabular-nums">
                      {rotation}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg)}
                        className={`py-2 rounded-lg text-xs border transition ${
                          rotation === deg
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                            : "border-white/5 text-white/30 hover:text-white/60 hover:border-white/20"
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CROP */}
              {tab === "crop" && (
                <div className="space-y-5">
                  <SectionLabel>Crop</SectionLabel>
                  <p className="text-xs text-white/30">
                    Enable crop, then drag directly on the image to draw the
                    area you want to keep. Drag the edges or corners afterward
                    to adjust.
                  </p>
                  <button
                    onClick={() => setCropEnabled((v) => !v)}
                    className={`w-full py-2.5 rounded-lg text-sm border transition ${
                      cropEnabled
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                        : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                    }`}
                  >
                    {cropEnabled
                      ? "✓ Crop enabled — drag on image"
                      : "Enable crop overlay"}
                  </button>

                  {cropEnabled && completedCrop && (
                    <div className="text-xs text-white/30 bg-white/5 rounded-lg px-3 py-2">
                      Selection: {Math.round(completedCrop.width)} ×{" "}
                      {Math.round(completedCrop.height)} px (preview scale)
                    </div>
                  )}
                </div>
              )}

              {/* COLOR */}
              {tab === "color" && (
                <div className="space-y-4">
                  <SectionLabel>Color Mode</SectionLabel>
                  <div className="space-y-2">
                    {COLOR_MODES.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setColorMode(m.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition ${
                          colorMode === m.value
                            ? "bg-cyan-500/10 border-cyan-500/30"
                            : "border-white/5 hover:border-white/15 hover:bg-white/5"
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-md shrink-0 bg-gradient-to-br from-blue-400 to-purple-600"
                          style={{ filter: m.preview }}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${colorMode === m.value ? "text-cyan-300" : "text-white/70"}`}
                          >
                            {m.label}
                          </p>
                          <p className="text-xs text-white/30">{m.desc}</p>
                        </div>
                        {colorMode === m.value && (
                          <Check size={14} className="ml-auto text-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/15 pt-1">
                    CMYK and Posterized previews are approximate — actual output
                    is rendered server-side.
                  </p>
                </div>
              )}

              {/* EXPORT — format, quality, flip, mirror, watermark */}
              {tab === "export" && (
                <div className="space-y-5">
                  <SectionLabel>Output Format</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {FORMATS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setFormat(f.value)}
                        className={`py-2 rounded-lg text-xs border transition ${
                          format === f.value
                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                            : "border-white/5 text-white/30 hover:text-white/60 hover:border-white/20"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <FieldRow label={`Quality (${quality})`}>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      disabled={format === "PNG"}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className={`w-full accent-cyan-400 ${format === "PNG" ? "opacity-30" : ""}`}
                    />
                    {format === "PNG" && (
                      <p className="text-[10px] text-white/20 mt-1">
                        PNG is lossless — quality is ignored.
                      </p>
                    )}
                  </FieldRow>

                  <div className="h-px bg-white/5" />

                  <SectionLabel>Flip & Mirror</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleButton
                      active={flip}
                      onClick={() => setFlip((v) => !v)}
                      Icon={FlipVertical}
                      label="Flip"
                    />
                    <ToggleButton
                      active={mirror}
                      onClick={() => setMirror((v) => !v)}
                      Icon={FlipHorizontal}
                      label="Mirror"
                    />
                  </div>

                  <div className="h-px bg-white/5" />

                  <SectionLabel>Watermark</SectionLabel>
                  <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5">
                    <Type size={14} className="text-white/30 shrink-0" />
                    <input
                      type="text"
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      placeholder="Optional text overlay"
                      className="w-full bg-transparent text-sm text-white/80 focus:outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={busy}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide border transition ${
                busy
                  ? "border-white/5 text-white/20 bg-white/5 cursor-not-allowed"
                  : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40"
              }`}
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {phase === "submitting" ? "Submitting..." : "Processing..."}
                </span>
              ) : (
                "Apply Transformation"
              )}
            </button>

            {errMsg && !sessionExpired && (
              <div className="flex items-start gap-2 text-red-400 text-xs px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-lg break-words">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                <span>{errMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT PANEL ── */}
        {history.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3 text-xs text-white/30">
              <Info size={12} />
              <span>Transformation Output</span>
              {history.length > 1 && (
                <span className="ml-auto text-white/20">
                  {history.length} versions
                </span>
              )}
            </div>

            <div className="space-y-3">
              {history.map((r, i) => (
                <ResultCard
                  key={r.id}
                  r={r}
                  isLatest={i === 0}
                  onCopy={copyURL}
                  copied={copied}
                  onDownload={handleDownload}
                  downloading={downloadingId === r.id}
                />
              ))}
            </div>

            <button
              onClick={goToGallery}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-white/10 text-white/50 hover:text-white/80 hover:border-white/25 transition"
            >
              <ArrowLeft size={14} />
              Back to Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────────────

function ResultCard({ r, isLatest, onCopy, copied, onDownload, downloading }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden transition ${isLatest ? "border-cyan-500/20 bg-[#0b0f1a]" : "border-white/5 bg-[#08090f]"}`}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {isLatest && (
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
              LATEST
            </span>
          )}
          <span className="text-xs text-white/40 font-mono uppercase">
            {r.format}
          </span>
          <span className="text-xs text-white/20 font-mono">· {r.code}</span>
        </div>
        <span className="text-[10px] text-white/20">
          {new Date(r.createdAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex gap-5 p-5">
        <div className="shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-white/5 bg-black/30">
          <img
            src={r.previewUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-[10px] text-white/20 shrink-0">URL</span>
            <span className="text-xs text-white/60 font-mono truncate flex-1">
              {r.shareUrl}
            </span>
            <button
              onClick={() => onCopy(r.shareUrl)}
              className="shrink-0 text-white/30 hover:text-cyan-400 transition"
              title="Copy URL"
            >
              {copied ? (
                <Check size={13} className="text-cyan-400" />
              ) : (
                <Copy size={13} />
              )}
            </button>
            <a
              href={r.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-white/30 hover:text-cyan-400 transition"
              title="Open"
            >
              <ExternalLink size={13} />
            </a>
            <button
              onClick={() => onDownload(r)}
              disabled={downloading}
              className="shrink-0 text-white/30 hover:text-cyan-400 transition disabled:opacity-40"
              title="Download"
            >
              {downloading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Download size={13} />
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Stat label="Width" value={`${r.width}px`} />
            <Stat label="Height" value={`${r.height}px`} />
            <Stat label="Size" value={formatBytes(r.bytes)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-center">
      <p className="text-[10px] text-white/20 mb-0.5">{label}</p>
      <p className="text-xs text-white/70 font-mono">{value}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
      {children}
    </p>
  );
}

function FieldRow({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, min, max }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/80 font-mono focus:outline-none focus:border-cyan-500/40 transition"
    />
  );
}

function ToggleButton({ active, onClick, Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs border transition ${
        active
          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
          : "border-white/5 text-white/30 hover:text-white/60 hover:border-white/20"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
