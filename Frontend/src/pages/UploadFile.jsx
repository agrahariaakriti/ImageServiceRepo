import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/Navbar";
import { api } from "../stores/api.service.js";
import {
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Images,
  X,
  FileImage,
  Loader2,
  Check,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

// ─── accepted types ────────────────────────────────────────────────────────
const ACCEPTED = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

const ACCEPTED_LABEL = "JPG, PNG, WEBP, GIF";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const formatBytes = (b) =>
  b > 1024 * 1024
    ? `${(b / 1024 / 1024).toFixed(2)} MB`
    : `${(b / 1024).toFixed(1)} KB`;

// ─── component ─────────────────────────────────────────────────────────────
export function UploadImage({ user, setUser }) {
  const navigate = useNavigate();

  const [file, setFile] = useState(null); // File object
  const [preview, setPreview] = useState(null); // blob URL
  const [imgMeta, setImgMeta] = useState(null); // { w, h }
  const [phase, setPhase] = useState("idle"); // idle | uploading | done | error
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  // read image dimensions once file is chosen
  const loadMeta = (f, blobURL) => {
    const img = new window.Image();
    img.onload = () =>
      setImgMeta({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = blobURL;
  };

  const pickFile = (f) => {
    if (!f) return;
    const blob = URL.createObjectURL(f);
    setFile(f);
    setPreview(blob);
    setPhase("idle");
    setErrMsg("");
    setProgress(0);
    loadMeta(f, blob);
  };

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) {
      const reason = rejected[0]?.errors?.[0]?.code;
      if (reason === "file-too-large")
        setErrMsg(`File too large. Max size is ${MAX_SIZE_MB} MB.`);
      else if (reason === "file-invalid-type")
        setErrMsg(`Unsupported format. Use ${ACCEPTED_LABEL}.`);
      else setErrMsg("Invalid file.");
      return;
    }
    if (accepted?.[0]) pickFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
    noClick: !!file, // disable click on zone when file chosen (use button instead)
  });

  const handleUpload = async () => {
    if (!file) return;
    try {
      setPhase("uploading");
      setProgress(0);
      setErrMsg("");

      const form = new FormData();
      form.append("image", file);

      // const res = await api.post("/image/upload", form, {
      //   headers: { "Content-Type": "multipart/form-data" },
      //   onUploadProgress: (e) => {
      //     if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      //   },
      // });

      setProgress(100);
      setPhase("done");

      // short pause so user sees 100 % before redirect
      setTimeout(() => {
        navigate("/gallery");
      }, 1200);
    } catch (err) {
      console.log("Hyy ", err);

      setErrMsg(err.response?.data?.message || "Upload failed. Try again.");
      setPhase("error");
    }
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setImgMeta(null);
    setPhase("idle");
    setProgress(0);
    setErrMsg("");
  };

  const busy = phase === "uploading";

  return (
    <div className="min-h-screen bg-[#05070d] text-white font-mono">
      <Navbar user={user} setUser={setUser} />

      <div className="pt-20 px-6 pb-16 max-w-[1000px] mx-auto">
        {/* ── breadcrumb ── */}
        <div className="flex items-center gap-2 mb-6 text-xs text-white/30">
          <span
            className="hover:text-white/60 cursor-pointer transition"
            onClick={() => navigate("/gallery")}
          >
            Gallery
          </span>
          <ChevronRight size={12} />
          <span className="text-cyan-400">Upload</span>
        </div>

        {/* ── page header ── */}
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-white/80 tracking-tight">
            Upload Image
          </h1>
          <p className="text-xs text-white/30 mt-1">
            {ACCEPTED_LABEL} · max {MAX_SIZE_MB} MB · image is saved to your
            gallery
          </p>
        </div>

        {/* ── main card ── */}
        <div className="rounded-2xl border border-white/5 bg-[#0b0f1a] overflow-hidden">
          {/* card topbar (matches EditImage canvas bar) */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0b0f1a]">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <FileImage size={12} />
              <span>new file</span>
              {file && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-white/50">{file.name}</span>
                  <span className="text-white/20">·</span>
                  <span>{formatBytes(file.size)}</span>
                  {imgMeta && (
                    <>
                      <span className="text-white/20">·</span>
                      <span>
                        {imgMeta.w}×{imgMeta.h}px
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/40" />
            </div>
          </div>

          {/* ── drop zone / preview area ── */}
          <div className="p-6">
            {!file ? (
              /* empty drop zone */
              <div
                {...getRootProps()}
                className={`
                  relative flex flex-col items-center justify-center
                  rounded-xl border-2 border-dashed cursor-pointer
                  transition-all duration-200 py-20
                  ${
                    isDragActive
                      ? "border-cyan-500/60 bg-cyan-500/5"
                      : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                  }
                `}
              >
                <input {...getInputProps()} />

                {/* icon */}
                <div
                  className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition
                  ${isDragActive ? "bg-cyan-500/15 text-cyan-400" : "bg-white/5 text-white/20"}
                `}
                >
                  <Upload size={28} />
                </div>

                <p className="text-sm text-white/60 mb-1">
                  {isDragActive ? "Drop it here" : "Drag & drop your image"}
                </p>
                <p className="text-xs text-white/25 mb-6">or</p>

                <label
                  className="
                  px-5 py-2.5 rounded-lg text-xs font-medium
                  bg-cyan-500/10 border border-cyan-500/20 text-cyan-300
                  hover:bg-cyan-500/20 hover:border-cyan-400/40
                  cursor-pointer transition
                "
                >
                  Browse files
                  <input {...getInputProps()} className="hidden" />
                </label>

                <p className="text-[10px] text-white/20 mt-5">
                  {ACCEPTED_LABEL} · up to {MAX_SIZE_MB} MB
                </p>
              </div>
            ) : (
              /* file chosen — preview + meta */
              <div className="grid grid-cols-[1fr_280px] gap-5">
                {/* preview */}
                <div
                  className="relative bg-black/30 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden"
                  style={{ minHeight: 340 }}
                >
                  <img
                    src={preview}
                    alt=""
                    className="max-h-[340px] max-w-full object-contain rounded-lg"
                  />

                  {/* remove button */}
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/30 transition"
                  >
                    <X size={13} />
                  </button>

                  {/* uploading overlay */}
                  {busy && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl">
                      <Loader2
                        className="animate-spin text-cyan-400"
                        size={30}
                      />
                      <p className="text-xs text-white/50">{progress}%</p>
                    </div>
                  )}

                  {/* done overlay */}
                  {phase === "done" && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                        <Check size={22} className="text-cyan-400" />
                      </div>
                      <p className="text-xs text-white/50">
                        Redirecting to gallery...
                      </p>
                    </div>
                  )}
                </div>

                {/* right panel */}
                <div className="flex flex-col gap-4">
                  {/* file meta card */}
                  <div className="bg-black/30 rounded-xl border border-white/5 p-4 space-y-3">
                    <p className="text-[10px] text-white/25 uppercase tracking-widest">
                      File Info
                    </p>

                    <MetaRow label="Name" value={file.name} />
                    <MetaRow label="Size" value={formatBytes(file.size)} />
                    <MetaRow label="Type" value={file.type || "—"} />
                    {imgMeta && (
                      <MetaRow
                        label="Dimensions"
                        value={`${imgMeta.w} × ${imgMeta.h} px`}
                      />
                    )}
                  </div>

                  {/* progress bar (only while uploading) */}
                  {busy && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-white/30">
                        <span>Uploading</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* error */}
                  {phase === "error" && errMsg && (
                    <div className="flex items-start gap-2 text-red-400 text-xs bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2.5">
                      <AlertCircle size={12} className="mt-0.5 shrink-0" />
                      <span>{errMsg}</span>
                    </div>
                  )}

                  {/* spacer */}
                  <div className="flex-1" />

                  {/* actions */}
                  <div className="space-y-2">
                    <button
                      onClick={handleUpload}
                      disabled={busy || phase === "done"}
                      className={`
                        w-full py-3 rounded-xl text-sm font-semibold tracking-wide border transition
                        ${
                          busy || phase === "done"
                            ? "border-white/5 text-white/20 bg-white/5 cursor-not-allowed"
                            : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/40"
                        }
                      `}
                    >
                      {busy ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Uploading...
                        </span>
                      ) : phase === "done" ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check size={14} />
                          Uploaded
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Upload size={14} />
                          Upload to Gallery
                        </span>
                      )}
                    </button>

                    {/* replace file */}
                    {phase !== "done" && (
                      <label
                        className="
                        w-full py-2.5 rounded-xl text-xs border border-white/5
                        text-white/30 hover:text-white/60 hover:border-white/15
                        flex items-center justify-center gap-2 cursor-pointer transition
                      "
                      >
                        <FolderOpen size={13} />
                        Choose different file
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] && pickFile(e.target.files[0])
                          }
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* error when no file chosen yet */}
            {!file && errMsg && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-4 bg-red-500/5 border border-red-500/10 rounded-lg px-4 py-2.5">
                <AlertCircle size={12} className="shrink-0" />
                {errMsg}
              </div>
            )}
          </div>
        </div>

        {/* ── gallery shortcut ── */}
        <button
          onClick={() => navigate("/gallery")}
          className="mt-4 flex items-center gap-2 text-xs text-white/25 hover:text-white/50 transition"
        >
          <Images size={12} />
          Go to Gallery
        </button>
      </div>
    </div>
  );
}

// ─── sub-components ─────────────────────────────────────────────────────────
function MetaRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[10px] text-white/25 shrink-0 pt-0.5">{label}</span>
      <span className="text-xs text-white/60 font-mono text-right break-all">
        {value}
      </span>
    </div>
  );
}
