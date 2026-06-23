import Navbar from "../components/Navbar";
import { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Upload,
  Wand2,
  Images,
  Zap,
  Trash2,
  RefreshCw,
} from "lucide-react";

function Documentation({ user, setUser, onLogOut, setOnLogOut }) {
  const [active, setActive] = useState("overview");
  const clickingRef = useRef(false);

  const sections = {
    overview: useRef(null),
    start: useRef(null),
    auth: useRef(null),
    upload: useRef(null),
    transform: useRef(null),
    gallery: useRef(null),
    delete: useRef(null),
  };

  const scrollTo = (key) => {
    setActive(key);
    clickingRef.current = true;
    sections[key].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => {
      clickingRef.current = false;
    }, 800);
  };

  useEffect(() => {
    const OFFSET = 120;
    const keys = [
      "overview",
      "start",
      "auth",
      "upload",
      "transform",
      "gallery",
      "delete",
    ];
    const onScroll = () => {
      if (clickingRef.current) return;
      let current = keys[0];
      for (const key of keys) {
        const el = sections[key].current;
        if (!el) continue;
        if (el.getBoundingClientRect().top <= OFFSET) current = key;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "start", label: "How It Works", icon: Rocket },
    { key: "auth", label: "Auth", icon: ShieldCheck },
    { key: "upload", label: "Upload", icon: Upload },
    { key: "transform", label: "Transform", icon: Wand2 },
    { key: "gallery", label: "Gallery", icon: Images },
    { key: "delete", label: "Delete", icon: Trash2 },
  ];

  const CodeBlock = ({ lang, children, badge }) => (
    <div className="code-block">
      <div className="code-topbar">
        <div className="code-dots">
          <div className="cdot cdot-r" />
          <div className="cdot cdot-y" />
          <div className="cdot cdot-g" />
        </div>
        <span className="code-lang">{lang}</span>
        {badge && <span className={`inline-badge ${badge}`}>{badge}</span>}
      </div>
      <pre className="code-pre">{children}</pre>
    </div>
  );

  const ResLabel = ({ children }) => <p className="res-label">{children}</p>;

  return (
    <div className="docs-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box;}

        .docs-root {
          min-height: 100vh;
          background: #060910;
          color: #dde1ec;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── grid bg ── */
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .orb { position: fixed; pointer-events: none; border-radius: 50%; filter: blur(160px); z-index: 0; }
        .orb-1 { width: 700px; height: 700px; background: rgba(99,102,241,0.06); top: -300px; right: -200px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(6,182,212,0.04); bottom: -200px; left: -100px; }

        /* ── navbar wrapper ── */
        .docs-navbar-wrap {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
        }

        /* ── page body (below navbar) ── */
        .docs-body {
          position: relative;
          z-index: 1;
          flex: 1;
        }

        /* ── layout ── */
        .docs-layout {
          display: grid;
          grid-template-columns: 230px 1fr;
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px 100px;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .docs-layout { grid-template-columns: 1fr; padding-top: 24px; }
          .sidebar { display: none; }
        }

        /* ── SIDEBAR ── */
        .sidebar { position: sticky; top: 24px; }

        .sidebar-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(99,102,241,0.45);
          margin-bottom: 14px;
          padding-left: 10px;
        }

        .sidebar-nav { display: flex; flex-direction: column; gap: 1px; }

        .snav-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(221,225,236,0.35);
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left; width: 100%;
          position: relative;
        }
        .snav-item:hover { color: rgba(221,225,236,0.75); background: rgba(255,255,255,0.025); }
        .snav-item.active {
          color: #a5b4fc;
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.2);
        }
        .snav-item.active::before {
          content: ''; position: absolute; left: 0; top: 22%; bottom: 22%;
          width: 2px; border-radius: 2px;
          background: linear-gradient(to bottom, #818cf8, #6366f1);
        }

        /* ── MOBILE TAB BAR ── */
        .tab-bar {
          position: sticky; top: 0; z-index: 30;
          display: none; overflow-x: auto;
          padding: 10px 0;
          background: rgba(6,9,16,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          scrollbar-width: none;
          margin-bottom: 24px;
        }
        .tab-bar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .tab-bar { display: flex; gap: 6px; padding: 10px 20px; } }

        .tab-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          color: rgba(221,225,236,0.4);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.03em;
          cursor: pointer; white-space: nowrap;
          transition: all 0.18s;
        }
        .tab-pill.active {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.3);
          color: #a5b4fc;
        }

        /* ── PAGE HEADER ── */
        .page-header { margin-bottom: 40px; }
        .page-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em;
          color: #6366f1;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .page-eyebrow::before {
          content: ''; display: block;
          width: 20px; height: 1px;
          background: linear-gradient(to right, #6366f1, #a5b4fc);
        }
        .page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.025em; margin-bottom: 8px; }
        .page-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 300;
          color: rgba(221,225,236,0.3); letter-spacing: 0.04em;
        }

        /* ── ARCH BANNER ── */
        .arch-banner {
          background: rgba(99,102,241,0.04);
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 10px;
          padding: 16px 20px;
          margin-bottom: 16px;
          display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
        }
        .arch-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.06em;
          padding: 4px 10px;
          border-radius: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(221,225,236,0.5);
        }
        .arch-arrow { color: rgba(99,102,241,0.4); font-size: 12px; }

        /* ── DOC SECTION ── */
        .doc-section {
          margin-bottom: 14px;
          background: rgba(255,255,255,0.018);
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.22s;
          scroll-margin-top: 90px;
        }
        .doc-section:hover { border-color: rgba(99,102,241,0.2); }

        .sec-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 22px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .sec-title-row { display: flex; align-items: center; gap: 10px; }
        .sec-icon {
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.16);
          display: flex; align-items: center; justify-content: center;
          color: #818cf8; flex-shrink: 0;
        }
        .sec-title { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }

        .sec-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em;
          padding: 3px 9px; border-radius: 4px;
          border: 1px solid rgba(99,102,241,0.2);
          color: rgba(99,102,241,0.7);
          background: rgba(99,102,241,0.05);
        }
        .sec-badge.post { border-color: rgba(251,146,60,0.3); color: rgba(251,146,60,0.8); background: rgba(251,146,60,0.05); }
        .sec-badge.get  { border-color: rgba(34,197,94,0.3);  color: rgba(34,197,94,0.8);  background: rgba(34,197,94,0.05); }
        .sec-badge.del  { border-color: rgba(239,68,68,0.3);  color: rgba(239,68,68,0.8);  background: rgba(239,68,68,0.05); }

        .sec-body { padding: 18px 22px 22px; }

        .sec-desc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px; font-weight: 300;
          line-height: 1.9; color: rgba(221,225,236,0.42);
          margin-bottom: 18px;
        }

        /* note box */
        .note-box {
          display: flex; gap: 10px; align-items: flex-start;
          background: rgba(6,182,212,0.04);
          border: 1px solid rgba(6,182,212,0.12);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 16px;
        }
        .note-icon { color: #22d3ee; flex-shrink: 0; margin-top: 1px; font-size: 13px; }
        .note-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 300;
          color: rgba(6,182,212,0.65); line-height: 1.75;
        }

        /* steps */
        .steps { display: flex; flex-direction: column; gap: 8px; }
        .step-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.045);
          border-radius: 8px;
          transition: border-color 0.18s;
        }
        .step-row:hover { border-color: rgba(99,102,241,0.18); }
        .step-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #6366f1;
          letter-spacing: 0.08em; flex-shrink: 0; min-width: 22px;
          margin-top: 1px;
        }
        .step-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px; font-weight: 300;
          color: rgba(221,225,236,0.5); line-height: 1.65;
        }
        .step-text strong { color: rgba(221,225,236,0.8); font-weight: 500; }

        /* param table */
        .param-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .param-table th {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          color: rgba(99,102,241,0.5);
          text-align: left; padding: 7px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .param-table td {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 300;
          color: rgba(221,225,236,0.45);
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          vertical-align: top;
        }
        .param-table tr:last-child td { border-bottom: none; }
        .param-name { color: #f472b6 !important; }
        .param-type { color: #fb923c !important; }
        .param-req  { color: #34d399 !important; font-size: 9px !important; letter-spacing: 0.08em; }
        .param-opt  { color: rgba(221,225,236,0.25) !important; font-size: 9px !important; }

        /* code block */
        .code-block {
          background: #03050a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 9px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .code-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 13px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
        }
        .code-lang {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          color: rgba(99,102,241,0.45);
        }
        .code-dots { display: flex; gap: 5px; }
        .cdot { width: 8px; height: 8px; border-radius: 50%; }
        .cdot-r { background: rgba(239,68,68,0.4); }
        .cdot-y { background: rgba(234,179,8,0.4); }
        .cdot-g { background: rgba(34,197,94,0.4); }
        .inline-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; letter-spacing: 0.1em;
          padding: 2px 7px; border-radius: 3px;
        }
        .inline-badge.POST { background: rgba(251,146,60,0.1); color: rgba(251,146,60,0.7); border: 1px solid rgba(251,146,60,0.2); }
        .inline-badge.GET  { background: rgba(34,197,94,0.1);  color: rgba(34,197,94,0.7);  border: 1px solid rgba(34,197,94,0.2); }
        .inline-badge.DEL  { background: rgba(239,68,68,0.1);  color: rgba(239,68,68,0.7);  border: 1px solid rgba(239,68,68,0.2); }
        .code-pre {
          padding: 14px 16px;
          overflow-x: auto;
          margin: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px; font-weight: 300;
          line-height: 1.85; color: rgba(221,225,236,0.45);
          white-space: pre;
        }

        .res-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          color: rgba(34,197,94,0.55);
          margin-bottom: 6px; margin-top: 4px;
        }

        /* async badge */
        .async-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em;
          padding: 4px 10px; border-radius: 4px;
          background: rgba(251,146,60,0.06);
          border: 1px solid rgba(251,146,60,0.18);
          color: rgba(251,146,60,0.65);
          margin-bottom: 14px;
        }
        .async-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #fb923c;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* flow diagram */
        .flow {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
          margin-bottom: 18px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
        }
        .flow-step {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 400;
          color: rgba(221,225,236,0.45);
          padding: 4px 10px; border-radius: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .flow-arrow { color: rgba(99,102,241,0.35); font-size: 11px; }

        .sec-sub {
          font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
          color: rgba(221,225,236,0.3);
          text-transform: uppercase;
          margin: 18px 0 10px;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="docs-navbar-wrap">
        <Navbar
          user={user}
          setUser={setUser}
          onLogOut={onLogOut}
          setOnLogOut={setOnLogOut}
        />
      </div>

      <div className="docs-body">
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
                <Icon size={11} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="docs-layout">
          {/* ── SIDEBAR ── */}
          <aside className="sidebar">
            <p className="sidebar-label">DOCUMENTATION</p>
            <nav className="sidebar-nav">
              {tabs.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    className={`snav-item ${active === t.key ? "active" : ""}`}
                    onClick={() => scrollTo(t.key)}
                  >
                    <Icon size={13} />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── CONTENT ── */}
          <div className="docs-content">
            <div className="page-header">
              <p className="page-eyebrow">REST API · v1.0</p>
              <h1 className="page-title">API Documentation</h1>
              <p className="page-sub">
                Upload, transform, and manage your images — no SDK required.
              </p>
            </div>

            {/* ── OVERVIEW ── */}
            <section ref={sections.overview} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <LayoutDashboard size={13} />
                  </div>
                  <span className="sec-title">Overview</span>
                </div>
                <span className="sec-badge">v1.0</span>
              </div>
              <div className="sec-body">
                <p className="sec-desc">
                  This is a self-hosted image service — think of it as your own
                  mini Cloudinary. You upload images, get back a short sharable
                  URL, then optionally apply transformations (resize, crop,
                  rotate, watermark, grayscale, flip, mirror). Transformed
                  images are processed asynchronously by a background worker and
                  stored permanently on Cloudinary's CDN.
                </p>
                <div className="arch-banner">
                  <span className="arch-chip">Your App</span>
                  <span className="arch-arrow">→</span>
                  <span className="arch-chip">Node.js API</span>
                  <span className="arch-arrow">→</span>
                  <span className="arch-chip">BullMQ Queue</span>
                  <span className="arch-arrow">→</span>
                  <span className="arch-chip">Python FastAPI</span>
                  <span className="arch-arrow">→</span>
                  <span className="arch-chip">Cloudinary CDN</span>
                </div>
                <p className="sec-desc" style={{ marginBottom: 0 }}>
                  Redis powers both the job queue and response caching. All
                  endpoints require a valid session — sign up, sign in, and
                  every subsequent request is authenticated via an HTTP-only
                  access token cookie.
                </p>
              </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section ref={sections.start} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <Rocket size={13} />
                  </div>
                  <span className="sec-title">How It Works</span>
                </div>
                <span className="sec-badge">Flow</span>
              </div>
              <div className="sec-body">
                <p className="sec-desc">
                  Getting started takes four steps. After that, every upload and
                  transform follows the same predictable pattern.
                </p>
                <div className="steps">
                  {[
                    {
                      t: "Create an account",
                      d: "POST /api/v1/users/signup with your username, email, fullname, and password. Passwords must be ≥ 6 characters and contain both letters and numbers.",
                    },
                    {
                      t: "Sign in",
                      d: "POST /api/v1/users/signin — your access token and refresh token are set as HTTP-only cookies automatically. No manual token handling needed.",
                    },
                    {
                      t: "Upload an image",
                      d: "POST /api/v1/image/upload with a multipart file. Supported formats: JPEG, PNG, WebP. You get back a short sharable URL like /fetch/{code}.",
                    },
                    {
                      t: "Transform it",
                      d: "POST /api/v1/image/transformimage/{imageCode} with your transform options (resize, crop, rotate, etc.). You get a jobId back immediately.",
                    },
                    {
                      t: "Poll for result",
                      d: "GET /api/v1/image/job-status/{jobId} — once state is 'completed', result.url contains your transformed image URL on Cloudinary's CDN.",
                    },
                  ].map((s, i) => (
                    <div key={i} className="step-row">
                      <span className="step-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="step-text">
                        <strong>{s.t} — </strong>
                        {s.d}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── AUTH ── */}
            <section ref={sections.auth} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <ShieldCheck size={13} />
                  </div>
                  <span className="sec-title">Authentication</span>
                </div>
                <span className="sec-badge">Required</span>
              </div>
              <div className="sec-body">
                <p className="sec-desc">
                  All protected routes read your access token from an HTTP-only
                  cookie — you never need to attach it manually. Sign in once
                  and you're set. If your access token expires, call the refresh
                  endpoint to get a new one using your long-lived refresh token.
                </p>

                <p className="sec-sub">Sign Up</p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="POST"
                >{`POST /api/v1/users/signup`}</CodeBlock>
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>FIELD</th>
                      <th>TYPE</th>
                      <th>NOTES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "username",
                        "string",
                        "REQUIRED",
                        "3–20 chars, letters / numbers / underscores only",
                      ],
                      [
                        "email",
                        "string",
                        "REQUIRED",
                        "Must be a valid email format",
                      ],
                      ["fullname", "string", "REQUIRED", "Display name"],
                      [
                        "password",
                        "string",
                        "REQUIRED",
                        "Min 6 chars, must include at least one letter and one number",
                      ],
                    ].map(([n, t, r, d]) => (
                      <tr key={n}>
                        <td className="param-name">{n}</td>
                        <td className="param-type">{t}</td>
                        <td
                          className={
                            r === "REQUIRED" ? "param-req" : "param-opt"
                          }
                        >
                          {r}
                        </td>
                        <td>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ResLabel>RESPONSE · 201 CREATED</ResLabel>
                <CodeBlock lang="JSON">{`{
  "message": "User created successfully",
  "user": {
    "id":       "683a...",
    "username": "agrahari",
    "email":    "you@example.com"
  }
}`}</CodeBlock>

                <p className="sec-sub">Sign In</p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="POST"
                >{`POST /api/v1/users/signin`}</CodeBlock>
                <p
                  className="sec-desc"
                  style={{ marginTop: 0, marginBottom: 10 }}
                >
                  On success, two HTTP-only cookies are set:{" "}
                  <code style={{ color: "#f472b6" }}>accessToken</code>{" "}
                  (short-lived) and{" "}
                  <code style={{ color: "#f472b6" }}>refreshToken</code>{" "}
                  (long-lived). Both are sent automatically with subsequent
                  requests.
                </p>
                <ResLabel>RESPONSE · 200 OK</ResLabel>
                <CodeBlock lang="JSON">{`{
  "message": "User login successfully",
  "user": {
    "username": "agrahari",
    "fullname": "Aakriti Agrahari",
    "email":    "you@example.com"
  }
}`}</CodeBlock>

                <p className="sec-sub">Refresh Access Token</p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="GET"
                >{`GET /api/v1/users/refresh`}</CodeBlock>
                <p
                  className="sec-desc"
                  style={{ marginTop: 0, marginBottom: 10 }}
                >
                  Uses the{" "}
                  <code style={{ color: "#f472b6" }}>refreshToken</code> cookie
                  to issue a new access token. Call this when any protected
                  route returns 401.
                </p>

                <p className="sec-sub">Sign Out</p>
                <CodeBlock lang="ENDPOINT" badge="GET">
                  {`GET /api/v1/users/logout`}
                </CodeBlock>
                <p
                  className="sec-desc"
                  style={{ marginTop: 0, marginBottom: 0 }}
                >
                  Clears both cookies and invalidates the refresh token in the
                  database. Requires a valid access token.
                </p>
              </div>
            </section>

            {/* ── UPLOAD ── */}
            <section ref={sections.upload} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <Upload size={13} />
                  </div>
                  <span className="sec-title">Upload Image</span>
                </div>
                <span className="sec-badge post">POST</span>
              </div>
              <div className="sec-body">
                <p className="sec-desc">
                  Upload a file as multipart form data. The file is saved to
                  temporary disk storage via Multer, then uploaded to
                  Cloudinary. A short unique code is generated (8 chars, via
                  nanoid) and stored in the database alongside the Cloudinary
                  URL, dimensions, and file size. You get back a short URL of
                  the form{" "}
                  <code style={{ color: "#a5b4fc" }}>/fetch/{"{code}"}</code> —
                  visiting that URL will redirect to the full Cloudinary CDN
                  link.
                </p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="POST"
                >{`POST /api/v1/image/upload
Content-Type: multipart/form-data`}</CodeBlock>
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>FIELD</th>
                      <th>TYPE</th>
                      <th></th>
                      <th>NOTES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "file",
                        "file (multipart)",
                        "REQUIRED",
                        "Field name must be file. JPEG, PNG, WebP, JPG only.",
                      ],
                    ].map(([n, t, r, d]) => (
                      <tr key={n}>
                        <td className="param-name">{n}</td>
                        <td className="param-type">{t}</td>
                        <td className="param-req">{r}</td>
                        <td>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ResLabel>RESPONSE · 200 OK</ResLabel>
                <CodeBlock lang="JSON">{`{
  "message": "File uploaded successfully",
  "response": {
    "url":      "https://yourdomain.com/fetch/aB3xKp9z",
    "publicId": "aB3xKp9z"
  }
}`}</CodeBlock>
                <div className="note-box">
                  <span className="note-icon">ℹ</span>
                  <span className="note-text">
                    Visiting <code>/fetch/{"{code}"}</code> redirects directly
                    to the Cloudinary CDN URL. You can embed it as an image src
                    anywhere.
                  </span>
                </div>
              </div>
            </section>

            {/* ── TRANSFORM ── */}
            <section ref={sections.transform} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <Wand2 size={13} />
                  </div>
                  <span className="sec-title">Transform Image</span>
                </div>
                <span className="sec-badge post">POST</span>
              </div>
              <div className="sec-body">
                <div className="async-badge">
                  <div className="async-dot" />
                  ASYNC — processed via BullMQ worker queue
                </div>
                <p className="sec-desc">
                  Transformations are processed asynchronously. When you POST a
                  transform request, the job is queued in Redis via BullMQ and a{" "}
                  <code style={{ color: "#fb923c" }}>jobId</code> is returned
                  immediately. A background worker picks up the job, sends the
                  image to the Python FastAPI microservice for processing
                  (resize, crop, rotate, grayscale, flip, mirror, watermark),
                  then uploads the result to Cloudinary. Poll the job-status
                  endpoint to retrieve the result URL.
                </p>

                <div className="flow">
                  <span className="flow-step">POST transform</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-step">Queue job</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-step">Worker picks up</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-step">Python processes image</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-step">Upload to Cloudinary</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-step">Job complete</span>
                </div>

                <CodeBlock
                  lang="ENDPOINT"
                  badge="POST"
                >{`POST /api/v1/image/transformimage/:imageCode`}</CodeBlock>
                <p
                  className="sec-desc"
                  style={{ marginTop: 0, marginBottom: 12 }}
                >
                  <code style={{ color: "#a5b4fc" }}>:imageCode</code> is the
                  8-character code returned when you uploaded the image.
                </p>
                <CodeBlock lang="REQUEST BODY (JSON)">{`{
  "resized":   { "width": 800, "height": 600 },
  "crop":      { "left": 0, "top": 0, "right": 800, "bottom": 600 },
  "rotate":    90,
  "grayscale": "L",
  "flip":      false,
  "mirror":    false,
  "watermark": "my watermark text",
  "quality":   85,
  "format":    "JPEG"
}`}</CodeBlock>

                <table className="param-table">
                  <thead>
                    <tr>
                      <th>PARAM</th>
                      <th>TYPE</th>
                      <th></th>
                      <th>NOTES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "resized",
                        "object",
                        "optional",
                        "{ width, height } — target dimensions in pixels",
                      ],
                      [
                        "crop",
                        "object",
                        "optional",
                        "{ left, top, right, bottom } — pixel coordinates (PIL box format)",
                      ],
                      [
                        "rotate",
                        "number",
                        "optional",
                        "Degrees clockwise (e.g. 90, 180, 270)",
                      ],
                      [
                        "grayscale",
                        "string",
                        "optional",
                        "PIL mode: 'L' (grayscale), 'RGB', 'RGBA', '1' (black & white)",
                      ],
                      ["flip", "boolean", "optional", "true = flip vertically"],
                      [
                        "mirror",
                        "boolean",
                        "optional",
                        "true = flip horizontally",
                      ],
                      [
                        "watermark",
                        "string",
                        "optional",
                        "Text overlaid at top-left of the image (uses Arial 50px)",
                      ],
                      [
                        "quality",
                        "number",
                        "optional",
                        "JPEG quality 1–95. Default is 85",
                      ],
                      [
                        "format",
                        "string",
                        "optional",
                        "Output format: JPEG · PNG · webp",
                      ],
                    ].map(([n, t, r, d]) => (
                      <tr key={n}>
                        <td className="param-name">{n}</td>
                        <td className="param-type">{t}</td>
                        <td className="param-opt">{r}</td>
                        <td>{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ResLabel>RESPONSE · 202 ACCEPTED</ResLabel>
                <CodeBlock lang="JSON">{`{
  "msg":   "Processing...",
  "jobId": "42"
}`}</CodeBlock>

                <p className="sec-sub">Poll Job Status</p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="GET"
                >{`GET /api/v1/image/job-status/:jobId`}</CodeBlock>
                <ResLabel>RESPONSE — while processing</ResLabel>
                <CodeBlock lang="JSON">{`{
  "msg":      "Job status retrieved",
  "jobId":    "42",
  "jobState": "active"
}`}</CodeBlock>
                <ResLabel>RESPONSE — when complete</ResLabel>
                <CodeBlock lang="JSON">{`{
  "msg": "Job completed",
  "result": {
    "url":    "https://yourdomain.com/fetch/xK9pQm2n",
    "code":   "xK9pQm2n",
    "height": 600,
    "width":  800,
    "format": "jpg"
  }
}`}</CodeBlock>
                <div className="note-box">
                  <span className="note-icon">ℹ</span>
                  <span className="note-text">
                    Poll every 1–2 seconds until <code>jobState</code> is{" "}
                    <code>"completed"</code> or <code>"failed"</code>. Jobs are
                    kept for 1 hour after completion and 24 hours after failure.
                  </span>
                </div>
              </div>
            </section>

            {/* ── GALLERY ── */}
            <section ref={sections.gallery} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <Images size={13} />
                  </div>
                  <span className="sec-title">Gallery</span>
                </div>
                <span className="sec-badge get">GET</span>
              </div>
              <div className="sec-body">
                <p className="sec-desc">
                  Returns all images uploaded by the authenticated user, fetched
                  from the database using your user ID from the access token.
                  Each item includes the Cloudinary URL, dimensions, file size
                  in bytes, MIME type, and the generated short code.
                </p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="GET"
                >{`GET /api/v1/image/getallimg`}</CodeBlock>
                <ResLabel>RESPONSE · 200 OK</ResLabel>
                <CodeBlock lang="JSON">{`{
  "msg": [
    {
      "_id":           "683a...",
      "originalUrl":   "https://res.cloudinary.com/...",
      "generatedCode": "aB3xKp9z",
      "publicId":      "images/aB3xKp9z",
      "userId":        "682f...",
      "mimeType":      "image/jpeg",
      "imageSize":     { "height": 1080, "width": 1920 },
      "bytes":         284672,
      "createdAt":     "2026-06-20T14:30:00.000Z"
    }
  ]
}`}</CodeBlock>
              </div>
            </section>

            {/* ── DELETE ── */}
            <section ref={sections.delete} className="doc-section">
              <div className="sec-head">
                <div className="sec-title-row">
                  <div className="sec-icon">
                    <Trash2 size={13} />
                  </div>
                  <span className="sec-title">Delete Image</span>
                </div>
                <span className="sec-badge del">POST</span>
              </div>
              <div className="sec-body">
                <p className="sec-desc">
                  Deletes an image by its short code. This removes the asset
                  from Cloudinary (with CDN cache invalidation), deletes the
                  database record, and clears the Redis cache entry for that
                  code.
                </p>
                <CodeBlock
                  lang="ENDPOINT"
                  badge="POST"
                >{`POST /api/v1/image/delete/:imageCode`}</CodeBlock>
                <p
                  className="sec-desc"
                  style={{ marginTop: 0, marginBottom: 0 }}
                >
                  <code style={{ color: "#a5b4fc" }}>:imageCode</code> is the
                  8-character short code of the image to delete.
                </p>
                <ResLabel style={{ marginTop: 14 }}>RESPONSE · 200 OK</ResLabel>
                <CodeBlock lang="JSON">{`{
  "msg": "DELETED SUCCESSFULLY 🎉"
}`}</CodeBlock>
                <div className="note-box">
                  <span className="note-icon">⚠</span>
                  <span className="note-text">
                    Deletion is permanent. The image is removed from
                    Cloudinary's CDN and all short URLs pointing to it will
                    break. This action cannot be undone.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* end docs-body */}
    </div>
  );
}

export default Documentation;
