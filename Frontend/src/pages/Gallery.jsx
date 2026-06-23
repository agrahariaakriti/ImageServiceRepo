import { api } from "../stores/api.service.js";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  ImageIcon,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Download,
  X,
  Check,
  LayoutGrid,
  List,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Gallery({ user, setUser, onLogOut, setOnLogOut }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [view, setView] = useState("grid"); // grid | list

  // Only one delete can be in flight at a time — this id is the one being deleted.
  // While it's set, every delete button everywhere is disabled.
  const [deletingId, setDeletingId] = useState(null);
  // Image pending a confirm step before deletion actually fires.
  const [confirmTarget, setConfirmTarget] = useState(null);
  // Lightweight in-theme toast, replaces alert().
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }
  // Tracks which image is currently downloading, so we can show a spinner on that button only.
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await api.get("/image/getallimg");

        const formattedImages = response.data.msg.map((img) => ({
          id: img._id,
          name: img.generatedCode,
          image: img.originalUrl,
          imageUrl: img.originalUrl,
          generatedCode: img.generatedCode,
          width: img.imageSize?.width,
          height: img.imageSize?.height,
          createdAt: img.createdAt,
        }));

        setImages(formattedImages);
      } catch (error) {
        console.error(error);
        showToast(
          "error",
          "Couldn't load your images. Please sign in or refresh.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3200);
  };

  const handleCopy = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {
      showToast("error", "Couldn't copy the URL.");
    }
  };

  // Fetches the image as a blob and triggers a real file download (rather than
  // opening it in a new tab, which is what a plain <a href> would do for images).
  const handleDownload = async (img) => {
    if (downloadingId) return;
    setDownloadingId(img.id);
    try {
      const res = await fetch(img.imageUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const ext = blob.type?.split("/")?.[1] || "jpg";
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${img.name}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(error);
      showToast("error", "Couldn't download the image.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Opens the themed confirm modal instead of window.confirm().
  const requestDelete = (img) => {
    if (deletingId) return; // a deletion is already running — ignore clicks elsewhere
    setConfirmTarget(img);
  };

  const cancelDelete = () => setConfirmTarget(null);

  const confirmDelete = async () => {
    const img = confirmTarget;
    if (!img) return;
    setConfirmTarget(null);
    setDeletingId(img.generatedCode);

    try {
      await api.post(`/image/delete/${img.generatedCode}`);
      setImages((prev) =>
        prev.filter((i) => i.generatedCode !== img.generatedCode),
      );
      if (selected?.generatedCode === img.generatedCode) setSelected(null);
      showToast("success", `Deleted ${img.name}.`);
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Failed to delete image.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (img) => {
    if (deletingId) return; // avoid navigating away mid-delete
    navigate("/editimage", { state: { image: img } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04060c] flex items-center justify-center text-cyan-300">
        Loading Images...
      </div>
    );
  }

  return (
    <div className="gallery-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

        .gallery-root {
          min-height: 100vh;
          background: #04060c;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        /* ── grid bg ── */
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .orb { position: fixed; pointer-events: none; border-radius: 50%; filter: blur(130px); z-index: 0; }
        .orb-1 { width: 600px; height: 600px; background: rgba(14,165,233,0.07); top: -200px; left: -200px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(168,85,247,0.06); bottom: -200px; right: -150px; }

        /* ── page ── */
        .page { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 110px 24px 80px; }

        /* ── header bar ── */
        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          padding: 24px 28px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .header-bar::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(192,132,252,0.3), transparent);
        }

        .header-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #38bdf8;
          margin-bottom: 4px;
        }
        .header-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 2px;
        }
        .header-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: rgba(232,234,240,0.35);
        }

        .header-right { display: flex; align-items: center; gap: 12px; }

        .count-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid rgba(56,189,248,0.18);
          background: rgba(56,189,248,0.05);
        }
        .count-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 600;
          color: #7dd3fc;
          line-height: 1;
        }
        .count-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(232,234,240,0.35);
        }

        /* ── view toggle ── */
        .view-toggle {
          display: flex;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          overflow: hidden;
        }
        .vbtn {
          padding: 8px 12px;
          border: none;
          background: transparent;
          color: rgba(232,234,240,0.35);
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center;
        }
        .vbtn.active { background: rgba(56,189,248,0.12); color: #38bdf8; }
        .vbtn:hover:not(.active) { color: rgba(232,234,240,0.7); }

        /* ── IMAGE GRID ── */
        .img-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 900px) { .img-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .img-grid { grid-template-columns: 1fr; } }

        .img-card {
          position: relative;
          background: #06090f;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 4/3;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .img-card:hover {
          border-color: rgba(192,132,252,0.35);
          box-shadow: 0 10px 32px rgba(168,85,247,0.16), 0 0 0 1px rgba(56,189,248,0.12);
          transform: translateY(-2px);
        }
        .img-card img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease, filter 0.3s ease;
        }
        .img-card:hover img {
          transform: scale(1.06);
          filter: brightness(0.42);
        }
        .img-card.is-deleting img {
          transform: scale(1.02);
          filter: brightness(0.25) saturate(0.4);
        }

        /* index badge */
        .img-index {
          position: absolute;
          top: 10px; left: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.3);
          z-index: 2;
          transition: opacity 0.2s;
        }
        .img-card:hover .img-index { opacity: 0; }

        /* hover overlay */
        .img-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 14px;
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 3;
        }
        .img-card:hover .img-overlay { opacity: 1; }
        .img-card.is-deleting .img-overlay { opacity: 0; }

        /* top-right icon row: quick glance actions only — preview, download, delete */
        .overlay-top { display: flex; justify-content: flex-end; gap: 6px; }

        .ov-btn {
          width: 32px; height: 32px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.55);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(6px);
        }
        .ov-btn:hover { background: rgba(56,189,248,0.25); border-color: rgba(56,189,248,0.45); color: #fff; }
        .ov-btn.accent:hover { background: rgba(192,132,252,0.25); border-color: rgba(192,132,252,0.5); color: #f0d9fc; }
        .ov-btn.danger:hover { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.45); color: #fca5a5; }
        .ov-btn:disabled, .act-btn:disabled, .lbtn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        .img-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 8px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* bottom row: copy + edit, the labeled primary actions (download moved to icon row to avoid duplicating edit) */
        .overlay-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }

        .act-btn {
          padding: 7px 0;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.5);
          color: rgba(255,255,255,0.65);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(6px);
          text-align: center;
        }
        .act-btn:hover { background: rgba(192,132,252,0.18); border-color: rgba(192,132,252,0.35); color: #fff; }
        .act-btn.copy-active { background: rgba(34,197,94,0.2); border-color: rgba(34,197,94,0.35); color: #86efac; }

        /* deleting overlay — replaces the hover overlay entirely while active */
        .deleting-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px;
          background: rgba(4,6,12,0.72);
          backdrop-filter: blur(3px);
          z-index: 4;
          animation: fadeIn 0.15s ease;
          border-radius: 14px;
        }
        .deleting-overlay span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(252,165,165,0.85);
        }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── LIST VIEW ── */
        .img-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .list-row {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #07090f;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s, opacity 0.2s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }
        .list-row::after {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, #38bdf8, #c084fc);
          transform: scaleY(0);
          transition: transform 0.2s;
        }
        .list-row:hover { background: rgba(192,132,252,0.04); border-color: rgba(192,132,252,0.18); }
        .list-row:hover::after { transform: scaleY(1); }
        .list-row.is-deleting { background: rgba(239,68,68,0.05); opacity: 0.75; }
        .list-row.is-deleting::after { background: #f87171; transform: scaleY(1); }

        .list-thumb {
          width: 56px; height: 42px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .list-info { flex: 1; min-width: 0; }
        .list-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          display: flex; align-items: center; gap: 8px;
        }
        .list-deleting-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #f87171;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .list-url {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(232,234,240,0.3);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .list-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .lbtn {
          width: 30px; height: 30px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(232,234,240,0.45);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .lbtn:hover { background: rgba(192,132,252,0.12); border-color: rgba(192,132,252,0.3); color: #d8b4fe; }
        .lbtn.del:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .lbtn.copied { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: #86efac; }
        .lbtn.is-active-delete { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #f87171; }

        /* ── EMPTY STATE ── */
        .empty { text-align: center; padding: 80px 24px; }
        .empty-icon {
          width: 60px; height: 60px;
          margin: 0 auto 20px;
          border-radius: 14px;
          background: rgba(56,189,248,0.08);
          border: 1px solid rgba(56,189,248,0.18);
          display: flex; align-items: center; justify-content: center;
          color: #38bdf8;
        }
        .empty-title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .empty-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: rgba(232,234,240,0.35);
        }

        /* ── LIGHTBOX ── */
        .lightbox-bg {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.88);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          z-index: 50;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* sizes to the image instead of always stretching to a fixed max-width */
        .lightbox-inner {
          position: relative;
          max-width: min(640px, 90vw);
          width: fit-content;
          animation: scaleIn 0.2s ease;
        }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .lightbox-img {
          max-width: min(640px, 90vw);
          max-height: 70vh;
          width: auto;
          height: auto;
          border-radius: 12px;
          display: block;
          border: 1px solid rgba(192,132,252,0.15);
        }

        .lightbox-close {
          position: absolute;
          top: -44px; right: 0;
          width: 34px; height: 34px;
          border-radius: 8px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          z-index: 5;
        }
        .lightbox-close:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.35); color: #fca5a5; }

        .lightbox-footer {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(192,132,252,0.1);
          border-radius: 8px;
        }
        .lb-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .lb-url {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(232,234,240,0.35);
          flex: 1;
          text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          padding: 0 8px;
        }
        .lb-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          padding: 6px 13px;
          border-radius: 6px;
          border: 1px solid rgba(56,189,248,0.25);
          background: rgba(56,189,248,0.07);
          color: #7dd3fc;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .lb-btn:hover { background: rgba(56,189,248,0.15); border-color: rgba(56,189,248,0.45); }
        .lb-btn.copied { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: #86efac; }
        .lb-btn.download { border-color: rgba(192,132,252,0.3); background: rgba(192,132,252,0.08); color: #e9d5ff; }
        .lb-btn.download:hover { background: rgba(192,132,252,0.18); border-color: rgba(192,132,252,0.5); }
        .lb-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── CONFIRM MODAL ── */
        .confirm-bg {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          z-index: 60;
          animation: fadeIn 0.15s ease;
        }
        .confirm-card {
          width: 100%; max-width: 380px;
          background: #0a0d16;
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 14px;
          padding: 24px;
          animation: scaleIn 0.18s ease;
        }
        .confirm-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #f87171;
          margin-bottom: 14px;
        }
        .confirm-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
        .confirm-body {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: rgba(232,234,240,0.45);
          line-height: 1.6;
          margin-bottom: 20px;
          word-break: break-all;
        }
        .confirm-actions { display: flex; gap: 10px; }
        .confirm-btn {
          flex: 1;
          padding: 10px 0;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(232,234,240,0.6);
        }
        .confirm-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .confirm-btn.danger {
          border-color: rgba(239,68,68,0.35);
          background: rgba(239,68,68,0.12);
          color: #fca5a5;
        }
        .confirm-btn.danger:hover { background: rgba(239,68,68,0.22); border-color: rgba(239,68,68,0.5); }

        /* ── TOAST ── */
        .toast {
          position: fixed;
          bottom: 24px; right: 24px;
          z-index: 70;
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px;
          border-radius: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.02em;
          max-width: 360px;
          animation: toastIn 0.25s ease;
          backdrop-filter: blur(8px);
        }
        .toast.success { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
        .toast.error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
        @keyframes toastIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Navbar
        user={user}
        setUser={setUser}
        onLogOut={onLogOut}
        setOnLogOut={setOnLogOut}
      />

      <div className="page">
        {/* ── HEADER ── */}
        <div className="header-bar">
          <div className="header-left">
            <p className="header-eyebrow">IMAGE SHARING SYSTEM</p>
            <h1 className="header-title">Gallery</h1>
            <p className="header-sub">
              Manage, preview and share your uploaded images
            </p>
          </div>

          <div className="header-right">
            <div className="count-badge">
              <ImageIcon size={16} color="#38bdf8" />
              <div>
                <div className="count-num">{images.length}</div>
                <div className="count-label">IMAGES</div>
              </div>
            </div>

            <div className="view-toggle">
              <button
                className={`vbtn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`vbtn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── GRID VIEW ── */}
        {view === "grid" && images.length > 0 && (
          <div className="img-grid">
            {images.map((img, i) => {
              const isThisDeleting = deletingId === img.generatedCode;
              const deletingSomethingElse = !!deletingId && !isThisDeleting;
              const isThisDownloading = downloadingId === img.id;

              return (
                <div
                  key={img.id}
                  className={`img-card ${isThisDeleting ? "is-deleting" : ""}`}
                >
                  <img src={img.image} alt={img.name} loading="lazy" />

                  <span className="img-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {isThisDeleting && (
                    <div className="deleting-overlay">
                      <Loader2 size={22} className="spin" color="#f87171" />
                      <span>DELETING…</span>
                    </div>
                  )}

                  <div className="img-overlay">
                    <div className="overlay-top">
                      <button
                        className="ov-btn"
                        onClick={() => setSelected(img)}
                        title="Preview"
                        disabled={deletingSomethingElse}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="ov-btn accent"
                        onClick={() => handleDownload(img)}
                        title="Download"
                        disabled={deletingSomethingElse || isThisDownloading}
                      >
                        {isThisDownloading ? (
                          <Loader2 size={14} className="spin" />
                        ) : (
                          <Download size={14} />
                        )}
                      </button>
                      <button
                        className="ov-btn danger"
                        onClick={() => requestDelete(img)}
                        title="Delete"
                        disabled={!!deletingId}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="overlay-bottom">
                      <p className="img-name">{img.name}</p>
                      <div className="overlay-actions">
                        <button
                          className={`act-btn ${copiedId === img.id ? "copy-active" : ""}`}
                          onClick={() => handleCopy(img.id, img.imageUrl)}
                          disabled={deletingSomethingElse}
                        >
                          {copiedId === img.id ? "✓ copied" : "copy url"}
                        </button>
                        <button
                          className="act-btn"
                          onClick={() => handleEdit(img)}
                          disabled={!!deletingId}
                        >
                          edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "list" && images.length > 0 && (
          <div className="img-list">
            {images.map((img) => {
              const isThisDeleting = deletingId === img.generatedCode;
              const deletingSomethingElse = !!deletingId && !isThisDeleting;
              const isThisDownloading = downloadingId === img.id;

              return (
                <div
                  key={img.id}
                  className={`list-row ${isThisDeleting ? "is-deleting" : ""}`}
                >
                  <img
                    className="list-thumb"
                    src={img.image}
                    alt={img.name}
                    loading="lazy"
                  />

                  <div className="list-info">
                    <div className="list-name">
                      {img.name}
                      {isThisDeleting && (
                        <span className="list-deleting-tag">
                          <Loader2 size={11} className="spin" />
                          deleting…
                        </span>
                      )}
                    </div>
                    <div className="list-url">
                      http://localhost:8000/fetch/{img.generatedCode}
                    </div>
                  </div>

                  <div className="list-actions">
                    <button
                      className="lbtn"
                      onClick={() => setSelected(img)}
                      title="Preview"
                      disabled={deletingSomethingElse}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      className={`lbtn ${copiedId === img.id ? "copied" : ""}`}
                      onClick={() => handleCopy(img.id, img.imageUrl)}
                      title="Copy URL"
                      disabled={deletingSomethingElse}
                    >
                      {copiedId === img.id ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                    <button
                      className="lbtn"
                      onClick={() => handleDownload(img)}
                      title="Download"
                      disabled={deletingSomethingElse || isThisDownloading}
                    >
                      {isThisDownloading ? (
                        <Loader2 size={13} className="spin" />
                      ) : (
                        <Download size={13} />
                      )}
                    </button>
                    <button
                      className="lbtn"
                      onClick={() => handleEdit(img)}
                      title="Edit"
                      disabled={!!deletingId}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className={`lbtn del ${isThisDeleting ? "is-active-delete" : ""}`}
                      onClick={() => requestDelete(img)}
                      title="Delete"
                      disabled={!!deletingId}
                    >
                      {isThisDeleting ? (
                        <Loader2 size={13} className="spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {images.length === 0 && (
          <div className="empty">
            <div className="empty-icon">
              <ImageIcon size={24} />
            </div>
            <h2 className="empty-title">No Images Found</h2>
            <p className="empty-sub">Upload images to get started</p>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {selected && (
        <div className="lightbox-bg" onClick={() => setSelected(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelected(null)}
              title="Close"
            >
              <X size={15} />
            </button>

            <img
              src={selected.image}
              className="lightbox-img"
              alt={selected.name}
            />

            <div className="lightbox-footer">
              <span className="lb-name">{selected.name}</span>
              <span className="lb-url">{selected.imageUrl}</span>
              <button
                className="lb-btn download"
                onClick={() => handleDownload(selected)}
                disabled={downloadingId === selected.id}
                title="Download"
              >
                {downloadingId === selected.id ? (
                  <Loader2 size={12} className="spin" />
                ) : (
                  <Download size={12} />
                )}
                download
              </button>
              <button
                className={`lb-btn ${copiedId === selected.id ? "copied" : ""}`}
                onClick={() => handleCopy(selected.id, selected.imageUrl)}
              >
                {copiedId === selected.id ? (
                  <>
                    <Check size={12} /> copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> copy url
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE MODAL ── */}
      {confirmTarget && (
        <div className="confirm-bg" onClick={cancelDelete}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <AlertTriangle size={20} />
            </div>
            <h3 className="confirm-title">Delete this image?</h3>
            <p className="confirm-body">
              {confirmTarget.name} will be permanently removed. This can't be
              undone.
            </p>
            <div className="confirm-actions">
              <button className="confirm-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-btn danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? (
            <CheckCircle2 size={15} />
          ) : (
            <AlertTriangle size={15} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default Gallery;
