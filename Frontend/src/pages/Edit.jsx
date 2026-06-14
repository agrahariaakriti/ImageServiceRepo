import { useLocation, useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { api } from "../stores/api.service.js";
import Navbar from "../components/Navbar";
import {
  RotateCw,
  Maximize2,
  Crop,
  Palette,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  Image as ImageIcon,
  RefreshCw,
  Download,
  Info,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────
const getCroppedPixels = (p) => ({
  left: Math.round(p.x),
  top: Math.round(p.y),
  right: Math.round(p.x + p.width),
  bottom: Math.round(p.y + p.height),
});

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
    value: "SEPIA",
    label: "Sepia",
    desc: "Warm vintage tone",
    preview: "sepia(80%)",
  },
  {
    value: "1",
    label: "Binary",
    desc: "Pure black & white",
    preview: "grayscale(100%) contrast(1000%)",
  },
];

const TABS = [
  { id: "resize", label: "Resize", Icon: Maximize2 },
  { id: "rotate", label: "Rotate", Icon: RotateCw },
  { id: "crop", label: "Crop", Icon: Crop },
  { id: "color", label: "Color", Icon: Palette },
];

const formatBytes = (b) =>
  b > 1024 * 1024
    ? `${(b / 1024 / 1024).toFixed(2)} MB`
    : `${(b / 1024).toFixed(1)} KB`;

// ─── component ───────────────────────────────────────────────────────────────
export function EditImage({ user, setUser }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const image = state?.image;

  // tabs
  const [tab, setTab] = useState("resize");

  // transform state
  const [width, setWidth] = useState(image?.width || 500);
  const [height, setHeight] = useState(image?.height || 500);
  const [rotation, setRotation] = useState(0);
  const [colorMode, setColorMode] = useState("RGB");

  // crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropEnabled, setCropEnabled] = useState(false);

  // job state
  const [phase, setPhase] = useState("idle"); // idle | submitting | polling | done | error
  const [errMsg, setErrMsg] = useState("");
  const [result, setResult] = useState(null); // latest result
  const [history, setHistory] = useState([]); // all results

  // copy feedback
  const [copied, setCopied] = useState(false);

  const intervalRef = useRef(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const stopPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const previewFilter =
    COLOR_MODES.find((m) => m.value === colorMode)?.preview || "none";
  const busy = phase === "submitting" || phase === "polling";

  const handleSave = async () => {
    try {
      setPhase("submitting");
      setErrMsg("");

      const cropPayload =
        tab === "crop" && cropEnabled && croppedAreaPixels
          ? getCroppedPixels(croppedAreaPixels)
          : { left: 0, top: 0, right: 0, bottom: 0 };

      const backendColor = colorMode === "SEPIA" ? "RGB" : colorMode;

      const payload = {
        resized: { width: Number(width), height: Number(height) },
        grayscale: backendColor,
        crop: cropPayload,
        rotate: Number(rotation),
      };

      const res = await api.post(
        `/image/transformimage/${image.generatedCode}`,
        payload,
      );
      const jobId = res.data.jobId;
      setPhase("polling");

      intervalRef.current = setInterval(async () => {
        try {
          const poll = await api.get(`/image/job-status/${jobId}`);
          const d = poll.data;

          if (d.msg === "Job completed") {
            stopPolling();
            const newResult = {
              id: Date.now(),
              url: d.result.url,
              image: d.result.image,
            };
            setResult(newResult);
            setHistory((prev) => [newResult, ...prev]);
            setPhase("done");

            // reset tools
            setRotation(0);
            setCropEnabled(false);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
          }

          if (d.msg === "Job failed") {
            stopPolling();
            setErrMsg("Processing failed. Try again.");
            setPhase("error");
          }
        } catch {
          stopPolling();
          setErrMsg("Network error while polling.");
          setPhase("error");
        }
      }, 1200);
    } catch (err) {
      setErrMsg("Request failed. Check connection.");
      setPhase("error");
    }
  };

  const copyURL = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!image)
    return (
      <div className="min-h-screen bg-[#05070d] text-white flex items-center justify-center text-white/40">
        No image selected.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#05070d] text-white font-mono">
      <Navbar user={user} setUser={setUser} />

      <div className="pt-20 px-6 pb-16 max-w-[1400px] mx-auto">
        {/* ── page header ── */}
        <div className="flex items-center gap-2 mb-6 text-xs text-white/30">
          <span
            className="hover:text-white/60 cursor-pointer transition"
            onClick={() => navigate(-1)}
          >
            Gallery
          </span>
          <ChevronRight size={12} />
          <span className="text-cyan-400">{image.generatedCode}</span>
        </div>

        {/* ── main grid ── */}
        <div className="grid grid-cols-[1fr_360px] gap-5">
          {/* ── LEFT: image canvas ── */}
          <div
            className="rounded-2xl overflow-hidden border border-white/5 bg-[#080b12] relative"
            style={{ minHeight: 520 }}
          >
            {/* top bar */}
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
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/40" />
              </div>
            </div>

            {/* canvas area */}
            <div
              className="flex items-center justify-center p-8"
              style={{ minHeight: 450 }}
            >
              {tab === "crop" && cropEnabled ? (
                <div className="relative w-full" style={{ height: 450 }}>
                  <Cropper
                    image={image.image}
                    crop={crop}
                    zoom={zoom}
                    aspect={width / height}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              ) : (
                <img
                  src={
                    result && phase === "done"
                      ? result.image.originalUrl
                      : image.image
                  }
                  alt=""
                  style={{
                    maxHeight: 430,
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: previewFilter,
                    transform: `rotate(${rotation}deg)`,
                    transition: "filter 0.3s, transform 0.3s",
                    borderRadius: 8,
                  }}
                />
              )}
            </div>

            {/* busy overlay */}
            {busy && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <Loader2 className="animate-spin text-cyan-400" size={32} />
                <p className="text-xs text-white/50 font-mono">
                  {phase === "submitting"
                    ? "Sending job..."
                    : "Processing image..."}
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: toolbox ── */}
          <div className="flex flex-col gap-4">
            {/* tab bar */}
            <div className="grid grid-cols-4 bg-[#0b0f1a] rounded-xl border border-white/5 p-1 gap-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs transition-all ${
                    tab === id
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* tab content */}
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
                    Enable crop to drag-select the area you want to keep.
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

                  {cropEnabled && (
                    <div className="space-y-3">
                      <FieldRow label="Zoom">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                          >
                            <ZoomOut size={14} className="text-white/40" />
                          </button>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 accent-cyan-400"
                          />
                          <button
                            onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                          >
                            <ZoomIn size={14} className="text-white/40" />
                          </button>
                        </div>
                      </FieldRow>
                      {croppedAreaPixels && (
                        <div className="text-xs text-white/30 bg-white/5 rounded-lg px-3 py-2">
                          Selection: {Math.round(croppedAreaPixels.width)} ×{" "}
                          {Math.round(croppedAreaPixels.height)} px
                        </div>
                      )}
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
                        {/* swatch */}
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
                </div>
              )}
            </div>

            {/* apply button */}
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

            {errMsg && (
              <div className="text-red-400 text-xs px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                {errMsg}
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT PANEL (appears after processing) ── */}
        {(phase === "done" || history.length > 0) && (
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
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────────────

function ResultCard({ r, isLatest, onCopy, copied }) {
  const img = r.image;
  return (
    <div
      className={`rounded-2xl border overflow-hidden transition ${
        isLatest
          ? "border-cyan-500/20 bg-[#0b0f1a]"
          : "border-white/5 bg-[#08090f]"
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          {isLatest && (
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
              LATEST
            </span>
          )}
          <span className="text-xs text-white/40 font-mono">
            {img.generatedCode}
          </span>
        </div>
        <span className="text-[10px] text-white/20">
          {new Date(img.createdAt).toLocaleTimeString()}
        </span>
      </div>

      {/* body */}
      <div className="flex gap-5 p-5">
        {/* preview */}
        <div className="shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-white/5 bg-black/30">
          <img
            src={img.originalUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* metadata */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* url row */}
          <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-[10px] text-white/20 shrink-0">URL</span>
            <span className="text-xs text-white/60 font-mono truncate flex-1">
              {r.url}
            </span>
            <button
              onClick={() => onCopy(r.url)}
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
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-white/30 hover:text-cyan-400 transition"
              title="Open"
            >
              <ExternalLink size={13} />
            </a>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Width" value={`${img.imageSize.width}px`} />
            <Stat label="Height" value={`${img.imageSize.height}px`} />
            <Stat label="Size" value={formatBytes(img.bytes)} />
          </div>

          {/* cloud url */}
          <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="text-[10px] text-white/20 shrink-0">CDN</span>
            <span className="text-xs text-white/40 font-mono truncate flex-1">
              {img.originalUrl}
            </span>
            <button
              onClick={() => onCopy(img.originalUrl)}
              className="shrink-0 text-white/30 hover:text-cyan-400 transition"
            >
              <Copy size={13} />
            </button>
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
