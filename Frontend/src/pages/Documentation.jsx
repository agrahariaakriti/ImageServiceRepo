import Navbar from "../components/Navbar";
import { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Upload,
  Wand2,
  Images,
} from "lucide-react";

function Documentation() {
  const [active, setActive] = useState("overview");
  // flag so clicking a nav item doesn't fight the scroll spy
  const clickingRef = useRef(false);

  const sections = {
    overview: useRef(null),
    start: useRef(null),
    auth: useRef(null),
    upload: useRef(null),
    transform: useRef(null),
    gallery: useRef(null),
  };

  const scrollTo = (key) => {
    setActive(key);
    clickingRef.current = true;
    sections[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // re-enable scroll spy after animation (~700ms)
    setTimeout(() => { clickingRef.current = false; }, 800);
  };

  // ── scroll spy ──────────────────────────────────────────────
  useEffect(() => {
    const OFFSET = 120; // px from top to count a section as "active"
    const keys = ["overview", "start", "auth", "upload", "transform", "gallery"];

    const onScroll = () => {
      if (clickingRef.current) return;

      // walk from bottom to top — first section whose top is above the offset wins
      let current = keys[0];
      for (const key of keys) {
        const el = sections[key].current;
        if (!el) continue;
        if (el.getBoundingClientRect().top <= OFFSET) {
          current = key;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabs = [
    { key: "overview",   label: "Overview",         icon: LayoutDashboard },
    { key: "start",      label: "Getting Started",  icon: Rocket          },
    { key: "auth",       label: "Auth",             icon: ShieldCheck     },
    { key: "upload",     label: "Upload",           icon: Upload          },
    { key: "transform",  label: "Transform",        icon: Wand2           },
    { key: "gallery",    label: "Gallery",          icon: Images          },
  ];

  /* code blocks data */
  const docs = {
    overview: {
      title: "Overview",
      badge: "v1.0",
      body: "ImageService is a lightweight REST API for uploading, transforming, and managing images using simple HTTP requests. Integrate in minutes — no SDKs required.",
      code: null,
    },
    start: {
      title: "Getting Started",
      badge: "Quick Start",
      body: null,
      steps: [
        { num: "01", text: "Create a free account at imageservice.com" },
        { num: "02", text: "Navigate to Settings → API Keys → Generate" },
        { num: "03", text: "Add the key to your request Authorization header" },
        { num: "04", text: "Make your first API call and start building" },
      ],
    },
    auth: {
      title: "Authentication",
      badge: "Required",
      body: "Every request must include your API key in the Authorization header. Keys are scoped per project and can be rotated at any time.",
      code: {
        lang: "HTTP HEADER",
        lines: [
          { type: "key",  text: "Authorization" },
          { type: "punc", text: ": " },
          { type: "str",  text: "Bearer " },
          { type: "val",  text: "YOUR_API_KEY" },
        ],
      },
    },
    upload: {
      title: "Upload API",
      badge: "POST",
      body: "Upload images via multipart form data. Returns a JSON object with the image ID, public URL, and metadata.",
      code: {
        lang: "ENDPOINT",
        raw: `POST /api/v1/upload
Content-Type: multipart/form-data

image        file     required
folder       string   optional
public       boolean  optional (default: true)`,
      },
      response: `{
  "id": "img_9xkT2Lp",
  "url": "https://cdn.imageservice.com/img_9xkT2Lp.webp",
  "width": 1920,
  "height": 1080,
  "size": "284 KB"
}`,
    },
    transform: {
      title: "Transform API",
      badge: "POST",
      body: "Resize, crop, convert format, or apply filters to any uploaded image. Transformations are applied non-destructively.",
      code: {
        lang: "ENDPOINT",
        raw: `POST /api/v1/transform

imageId      string   required
action       string   resize | crop | rotate | format
width        number   optional
height       number   optional
format       string   webp | jpeg | png | avif`,
      },
      response: `{
  "transformedUrl": "https://cdn.imageservice.com/img_9xkT2Lp_800x600.webp",
  "action": "resize",
  "originalId": "img_9xkT2Lp"
}`,
    },
    gallery: {
      title: "Gallery API",
      badge: "GET",
      body: "Fetch all uploaded images for the authenticated user. Supports pagination and folder filtering.",
      code: {
        lang: "ENDPOINT",
        raw: `GET /api/v1/gallery

page         number   optional (default: 1)
limit        number   optional (default: 20)
folder       string   optional`,
      },
      response: `{
  "images": [ { "id": "img_9xkT2Lp", "url": "...", ... } ],
  "total": 48,
  "page": 1,
  "pages": 3
}`,
    },
  };

  return (
    <div className="docs-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

        .docs-root {
          min-height: 100vh;
          background: #04060c;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
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

        /* ── layout ── */
        .docs-layout {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 220px 1fr;
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 24px 80px;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .docs-layout { grid-template-columns: 1fr; }
          .sidebar { display: none; }
        }

        /* ── SIDEBAR ── */
        .sidebar {
          position: sticky;
          top: 80px;
        }

        .sidebar-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: rgba(56,189,248,0.5);
          margin-bottom: 16px;
          padding-left: 12px;
        }

        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }

        .snav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 7px;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(232,234,240,0.4);
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
          position: relative;
        }
        .snav-item:hover { color: rgba(232,234,240,0.8); background: rgba(255,255,255,0.03); }
        .snav-item.active {
          color: #7dd3fc;
          background: rgba(56,189,248,0.07);
          border-color: rgba(56,189,248,0.18);
        }
        .snav-item.active::before {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 2px; border-radius: 2px;
          background: #38bdf8;
        }
        .snav-icon { flex-shrink: 0; }

        /* ── MOBILE TAB BAR ── */
        .tab-bar {
          position: sticky;
          top: 64px;
          z-index: 30;
          display: none;
          overflow-x: auto;
          padding: 12px 0;
          background: rgba(4,6,12,0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          scrollbar-width: none;
          margin-bottom: 24px;
        }
        .tab-bar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .tab-bar { display: flex; gap: 8px; padding: 12px 24px; } }

        .tab-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          color: rgba(232,234,240,0.4);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .tab-pill.active {
          background: rgba(56,189,248,0.1);
          border-color: rgba(56,189,248,0.3);
          color: #7dd3fc;
        }

        /* ── CONTENT ── */
        .docs-content { min-width: 0; }

        .page-header { margin-bottom: 36px; }
        .page-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #38bdf8;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .page-eyebrow::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: #38bdf8;
        }
        .page-title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }
        .page-sub {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: rgba(232,234,240,0.3);
          letter-spacing: 0.04em;
        }

        /* ── DOC CARD ── */
        .doc-section {
          margin-bottom: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.25s;
          scroll-margin-top: 90px;
        }
        .doc-section:hover { border-color: rgba(56,189,248,0.15); }
        .doc-section::before {
          display: none;
        }

        .sec-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .sec-title-row { display: flex; align-items: center; gap: 10px; }
        .sec-icon {
          width: 32px; height: 32px;
          border-radius: 7px;
          background: rgba(56,189,248,0.08);
          border: 1px solid rgba(56,189,248,0.15);
          display: flex; align-items: center; justify-content: center;
          color: #38bdf8;
          flex-shrink: 0;
        }
        .sec-title {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .sec-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          border-radius: 4px;
          border: 1px solid rgba(56,189,248,0.2);
          color: rgba(56,189,248,0.7);
          background: rgba(56,189,248,0.05);
        }
        .sec-badge.post { border-color: rgba(251,146,60,0.3); color: rgba(251,146,60,0.8); background: rgba(251,146,60,0.05); }
        .sec-badge.get  { border-color: rgba(34,197,94,0.3);  color: rgba(34,197,94,0.8);  background: rgba(34,197,94,0.05); }

        .sec-body { padding: 18px 24px 20px; }

        .sec-desc {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(232,234,240,0.45);
          margin-bottom: 16px;
        }

        /* steps */
        .steps { display: flex; flex-direction: column; gap: 10px; }
        .step-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
          transition: border-color 0.2s;
        }
        .step-row:hover { border-color: rgba(56,189,248,0.15); }
        .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          color: #38bdf8;
          letter-spacing: 0.06em;
          flex-shrink: 0;
          min-width: 24px;
        }
        .step-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 300;
          color: rgba(232,234,240,0.55);
        }

        /* code block */
        .code-block {
          background: #030508;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .code-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
        }
        .code-lang {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(56,189,248,0.5);
        }
        .code-dots { display: flex; gap: 5px; }
        .cdot { width: 8px; height: 8px; border-radius: 50%; }
        .cdot-r { background: rgba(239,68,68,0.45); }
        .cdot-y { background: rgba(234,179,8,0.45); }
        .cdot-g { background: rgba(34,197,94,0.45); }

        .code-pre {
          padding: 16px;
          overflow-x: auto;
          margin: 0;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 300;
          line-height: 1.85;
          color: rgba(232,234,240,0.5);
          white-space: pre;
        }
        .c-key  { color: #f472b6; }
        .c-str  { color: #a3e635; }
        .c-val  { color: #fb923c; }
        .c-punc { color: rgba(232,234,240,0.22); }

        /* response block */
        .res-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(34,197,94,0.6);
          margin-bottom: 6px;
        }

        /* divider */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent);
          margin: 32px 0;
        }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Navbar user={null} />

      {/* mobile tab bar */}
      <div className="tab-bar">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={`tab-pill ${active === t.key ? "active" : ""}`}
              onClick={() => scrollTo(t.key)}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="docs-layout">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <p className="sidebar-eyebrow">NAVIGATION</p>
          <nav className="sidebar-nav">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  className={`snav-item ${active === t.key ? "active" : ""}`}
                  onClick={() => scrollTo(t.key)}
                >
                  <Icon size={14} className="snav-icon" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="docs-content">

          {/* page header */}
          <div className="page-header">
            <p className="page-eyebrow">DEVELOPER REFERENCE</p>
            <h1 className="page-title">Documentation</h1>
            <p className="page-sub">REST API reference for ImageService · v1.0</p>
          </div>

          {/* ── OVERVIEW ── */}
          <section ref={sections.overview} className="doc-section">
            <div className="sec-head">
              <div className="sec-title-row">
                <div className="sec-icon"><LayoutDashboard size={14} /></div>
                <span className="sec-title">Overview</span>
              </div>
              <span className="sec-badge">v1.0</span>
            </div>
            <div className="sec-body">
              <p className="sec-desc">
                ImageService is a lightweight REST API for uploading, transforming, and managing images using
                simple HTTP requests. No SDKs required — integrate in minutes with any language or framework.
              </p>
            </div>
          </section>

          {/* ── GETTING STARTED ── */}
          <section ref={sections.start} className="doc-section">
            <div className="sec-head">
              <div className="sec-title-row">
                <div className="sec-icon"><Rocket size={14} /></div>
                <span className="sec-title">Getting Started</span>
              </div>
              <span className="sec-badge">Quick Start</span>
            </div>
            <div className="sec-body">
              <div className="steps">
                {[
                  "Create a free account at imageservice.com",
                  "Navigate to Settings → API Keys → Generate new key",
                  "Add the key to your request Authorization header",
                  "Make your first API call and start building",
                ].map((text, i) => (
                  <div key={i} className="step-row">
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="step-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── AUTH ── */}
          <section ref={sections.auth} className="doc-section">
            <div className="sec-head">
              <div className="sec-title-row">
                <div className="sec-icon"><ShieldCheck size={14} /></div>
                <span className="sec-title">Authentication</span>
              </div>
              <span className="sec-badge">Required</span>
            </div>
            <div className="sec-body">
              <p className="sec-desc">
                All requests require an API key passed as a Bearer token in the Authorization header.
                Keys are project-scoped and can be rotated anytime from the dashboard.
              </p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">HTTP HEADER</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">
                  <span className="c-key">Authorization</span>
                  <span className="c-punc">: </span>
                  <span className="c-str">Bearer </span>
                  <span className="c-val">YOUR_API_KEY</span>
                </pre>
              </div>
            </div>
          </section>

          {/* ── UPLOAD ── */}
          <section ref={sections.upload} className="doc-section">
            <div className="sec-head">
              <div className="sec-title-row">
                <div className="sec-icon"><Upload size={14} /></div>
                <span className="sec-title">Upload API</span>
              </div>
              <span className="sec-badge post">POST</span>
            </div>
            <div className="sec-body">
              <p className="sec-desc">
                Upload images via multipart form data. Returns a JSON object with the image ID, public CDN URL,
                and metadata. Supports JPEG, PNG, WebP, and AVIF formats up to 20MB.
              </p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">REQUEST</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">{`POST /api/v1/upload
Content-Type: multipart/form-data

image        file      required
folder       string    optional
public       boolean   optional  (default: true)`}</pre>
              </div>
              <p className="res-label">RESPONSE · 200 OK</p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">JSON</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">{`{
  "id":     "img_9xkT2Lp",
  "url":    "https://cdn.imageservice.com/img_9xkT2Lp.webp",
  "width":  1920,
  "height": 1080,
  "size":   "284 KB"
}`}</pre>
              </div>
            </div>
          </section>

          {/* ── TRANSFORM ── */}
          <section ref={sections.transform} className="doc-section">
            <div className="sec-head">
              <div className="sec-title-row">
                <div className="sec-icon"><Wand2 size={14} /></div>
                <span className="sec-title">Transform API</span>
              </div>
              <span className="sec-badge post">POST</span>
            </div>
            <div className="sec-body">
              <p className="sec-desc">
                Resize, crop, convert format, or apply filters to any uploaded image.
                Transformations are applied non-destructively — the original is always preserved.
              </p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">REQUEST</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">{`POST /api/v1/transform

imageId      string    required
action       string    resize | crop | rotate | format
width        number    optional
height       number    optional
format       string    webp | jpeg | png | avif`}</pre>
              </div>
              <p className="res-label">RESPONSE · 200 OK</p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">JSON</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">{`{
  "transformedUrl": "https://cdn.imageservice.com/img_9xkT2Lp_800x600.webp",
  "action":         "resize",
  "originalId":     "img_9xkT2Lp"
}`}</pre>
              </div>
            </div>
          </section>

          {/* ── GALLERY ── */}
          <section ref={sections.gallery} className="doc-section">
            <div className="sec-head">
              <div className="sec-title-row">
                <div className="sec-icon"><Images size={14} /></div>
                <span className="sec-title">Gallery API</span>
              </div>
              <span className="sec-badge get">GET</span>
            </div>
            <div className="sec-body">
              <p className="sec-desc">
                Fetch all uploaded images for the authenticated user.
                Supports pagination and optional folder filtering.
              </p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">REQUEST</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">{`GET /api/v1/gallery

page         number    optional  (default: 1)
limit        number    optional  (default: 20)
folder       string    optional`}</pre>
              </div>
              <p className="res-label">RESPONSE · 200 OK</p>
              <div className="code-block">
                <div className="code-topbar">
                  <div className="code-dots">
                    <div className="cdot cdot-r" /><div className="cdot cdot-y" /><div className="cdot cdot-g" />
                  </div>
                  <span className="code-lang">JSON</span>
                  <span style={{ width: 48 }} />
                </div>
                <pre className="code-pre">{`{
  "images": [ { "id": "img_9xkT2Lp", "url": "...", "width": 1920 } ],
  "total":  48,
  "page":   1,
  "pages":  3
}`}</pre>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Documentation;