import { useState } from "react";
import Navbar from "../components/Navbar";
import { ImageIcon, Eye, Pencil, Trash2, Copy, X, Check, LayoutGrid, List } from "lucide-react";

function Gallery() {
  const [images, setImages] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `image-${String(i + 1).padStart(3, "0")}.jpg`,
      image: `https://picsum.photos/800/600?random=${i + 1}`,
      imageUrl: `https://picsum.photos/800/600?random=${i + 1}`,
    }))
  );

  const [selected, setSelected] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [view, setView] = useState("grid"); // grid | list

  const handleCopy = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {
      console.log("Copy failed");
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this image?")) return;
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleEdit = (img) => {
    console.log("Navigate to edit page:", img);
  };

  return (
    <div className="gallery-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

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
        .orb-2 { width: 500px; height: 500px; background: rgba(99,102,241,0.05); bottom: -200px; right: -150px; }

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
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.35), transparent);
        }

        .header-left {}
        .header-eyebrow {
          font-family: 'DM Mono', monospace;
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
          font-family: 'DM Mono', monospace;
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
          font-size: 22px;
          font-weight: 700;
          color: #7dd3fc;
          line-height: 1;
        }
        .count-label {
          font-family: 'DM Mono', monospace;
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
          gap: 2px;
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (max-width: 900px) { .img-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .img-grid { grid-template-columns: 1fr; } }

        .img-card {
          position: relative;
          background: #06090f;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 4/3;
        }
        .img-card img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease, filter 0.3s ease;
        }
        .img-card:hover img {
          transform: scale(1.06);
          filter: brightness(0.45);
        }

        /* index badge */
        .img-index {
          position: absolute;
          top: 10px; left: 12px;
          font-family: 'DM Mono', monospace;
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

        .overlay-top { display: flex; justify-content: flex-end; gap: 6px; }

        .ov-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.55);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(6px);
        }
        .ov-btn:hover { background: rgba(56,189,248,0.25); border-color: rgba(56,189,248,0.45); color: #fff; }
        .ov-btn.danger:hover { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.45); color: #fca5a5; }

        .overlay-bottom {}
        .img-name {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .overlay-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }

        .act-btn {
          padding: 6px 0;
          border-radius: 5px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.5);
          color: rgba(255,255,255,0.65);
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(6px);
          text-align: center;
        }
        .act-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .act-btn.copy-active { background: rgba(34,197,94,0.2); border-color: rgba(34,197,94,0.35); color: #86efac; }
        .act-btn.del { border-color: rgba(239,68,68,0.2); color: rgba(252,165,165,0.7); }
        .act-btn.del:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.4); color: #fca5a5; }

        /* ── LIST VIEW ── */
        .img-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          overflow: hidden;
        }

        .list-row {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #07090f;
          padding: 12px 16px;
          transition: background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .list-row::after {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: #38bdf8;
          transform: scaleY(0);
          transition: transform 0.2s;
        }
        .list-row:hover { background: rgba(56,189,248,0.04); }
        .list-row:hover::after { transform: scaleY(1); }

        .list-thumb {
          width: 56px; height: 42px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .list-info { flex: 1; min-width: 0; }
        .list-name {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .list-url {
          font-family: 'DM Mono', monospace;
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
        .lbtn:hover { background: rgba(56,189,248,0.12); border-color: rgba(56,189,248,0.3); color: #38bdf8; }
        .lbtn.del:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .lbtn.copied { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: #86efac; }

        /* ── EMPTY STATE ── */
        .empty {
          text-align: center;
          padding: 80px 24px;
        }
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
          font-family: 'DM Mono', monospace;
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

        .lightbox-inner {
          position: relative;
          max-width: 900px;
          width: 100%;
          animation: scaleIn 0.2s ease;
        }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .lightbox-img {
          width: 100%;
          border-radius: 12px;
          display: block;
          border: 1px solid rgba(255,255,255,0.07);
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
        }
        .lightbox-close:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.35); color: #fca5a5; }

        .lightbox-footer {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
        }
        .lb-name { font-size: 13px; font-weight: 600; }
        .lb-url {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(232,234,240,0.35);
          flex: 1;
          text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          padding: 0 12px;
        }
        .lb-copy {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          padding: 6px 14px;
          border-radius: 5px;
          border: 1px solid rgba(56,189,248,0.25);
          background: rgba(56,189,248,0.07);
          color: #7dd3fc;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .lb-copy:hover { background: rgba(56,189,248,0.15); border-color: rgba(56,189,248,0.45); }
        .lb-copy.copied { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); color: #86efac; }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Navbar user={null} />

      <div className="page">

        {/* ── HEADER ── */}
        <div className="header-bar">
          <div className="header-left">
            <p className="header-eyebrow">IMAGE SHARING SYSTEM</p>
            <h1 className="header-title">Gallery</h1>
            <p className="header-sub">Manage, preview and share your uploaded images</p>
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
            {images.map((img, i) => (
              <div key={img.id} className="img-card">
                <img src={img.image} alt={img.name} loading="lazy" />

                <span className="img-index">{String(i + 1).padStart(2, "0")}</span>

                <div className="img-overlay">
                  <div className="overlay-top">
                    <button className="ov-btn" onClick={() => setSelected(img)} title="Preview">
                      <Eye size={14} />
                    </button>
                    <button className="ov-btn" onClick={() => handleEdit(img)} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button className="ov-btn danger" onClick={() => handleDelete(img.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="overlay-bottom">
                    <p className="img-name">{img.name}</p>
                    <div className="overlay-actions">
                      <button
                        className={`act-btn ${copiedId === img.id ? "copy-active" : ""}`}
                        onClick={() => handleCopy(img.id, img.imageUrl)}
                      >
                        {copiedId === img.id ? "✓ copied" : "copy url"}
                      </button>
                      <button className="act-btn" onClick={() => handleEdit(img)}>
                        edit
                      </button>
                      <button className="act-btn del" onClick={() => handleDelete(img.id)}>
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "list" && images.length > 0 && (
          <div className="img-list">
            {images.map((img) => (
              <div key={img.id} className="list-row">
                <img className="list-thumb" src={img.image} alt={img.name} loading="lazy" />

                <div className="list-info">
                  <div className="list-name">{img.name}</div>
                  <div className="list-url">{img.imageUrl}</div>
                </div>

                <div className="list-actions">
                  <button className="lbtn" onClick={() => setSelected(img)} title="Preview">
                    <Eye size={13} />
                  </button>
                  <button
                    className={`lbtn ${copiedId === img.id ? "copied" : ""}`}
                    onClick={() => handleCopy(img.id, img.imageUrl)}
                    title="Copy URL"
                  >
                    {copiedId === img.id ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <button className="lbtn" onClick={() => handleEdit(img)} title="Edit">
                    <Pencil size={13} />
                  </button>
                  <button className="lbtn del" onClick={() => handleDelete(img.id)} title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {images.length === 0 && (
          <div className="empty">
            <div className="empty-icon"><ImageIcon size={24} /></div>
            <h2 className="empty-title">No Images Found</h2>
            <p className="empty-sub">Upload images to get started</p>
          </div>
        )}

      </div>

      {/* ── LIGHTBOX ── */}
      {selected && (
        <div className="lightbox-bg" onClick={() => setSelected(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>
              <X size={15} />
            </button>

            <img src={selected.image} className="lightbox-img" alt={selected.name} />

            <div className="lightbox-footer">
              <span className="lb-name">{selected.name}</span>
              <span className="lb-url">{selected.imageUrl}</span>
              <button
                className={`lb-copy ${copiedId === selected.id ? "copied" : ""}`}
                onClick={() => handleCopy(selected.id, selected.imageUrl)}
              >
                {copiedId === selected.id ? "✓ copied" : "copy url"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;