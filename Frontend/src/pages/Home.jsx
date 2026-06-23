import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  Wand2,
  ShieldCheck,
  ArrowRight,
  Zap,
  Layers,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function Home({ user, setUser, onLogOut, setOnLogOut }) {
  const [termStep, setTermStep] = useState(0);
  const [imgState, setImgState] = useState("original"); // original | processing | transformed
  const timerRef = useRef(null);

  // Terminal typing animation — cycles through upload → transform → result
  const termLines = [
    {
      prefix: "$ ",
      text: "curl -X POST /api/v1/users/signin",
      color: "#a5b4fc",
    },
    {
      prefix: "  ",
      text: "✓ cookies set  accessToken · refreshToken",
      color: "#34d399",
    },
    {
      prefix: "$ ",
      text: "curl -X POST /api/v1/image/upload -F file=@photo.jpg",
      color: "#a5b4fc",
    },
    {
      prefix: "  ",
      text: '✓ { "url": "/fetch/aB3xKp9z", "publicId": "aB3xKp9z" }',
      color: "#34d399",
    },
    {
      prefix: "$ ",
      text: "curl -X POST /api/v1/image/transformimage/aB3xKp9z \\",
      color: "#a5b4fc",
    },
    {
      prefix: "  ",
      text: '     -d \'{"resized":{"width":800,"height":600},"grayscale":"L"}\'',
      color: "#94a3b8",
    },
    {
      prefix: "  ",
      text: '✓ { "msg": "Processing...", "jobId": "42" }',
      color: "#34d399",
    },
    {
      prefix: "$ ",
      text: "curl /api/v1/image/job-status/42",
      color: "#a5b4fc",
    },
    {
      prefix: "  ",
      text: '✓ { "msg": "Job completed", "result": { "url": "/fetch/xK9m2n" } }',
      color: "#34d399",
    },
  ];

  useEffect(() => {
    if (termStep >= termLines.length) return;
    const delay = termStep === 0 ? 600 : termStep % 2 === 0 ? 900 : 400;
    timerRef.current = setTimeout(() => setTermStep((s) => s + 1), delay);
    return () => clearTimeout(timerRef.current);
  }, [termStep]);

  // Image demo toggle
  useEffect(() => {
    const t1 = setTimeout(() => {
      setImgState("processing");
    }, 3000);
    const t2 = setTimeout(() => {
      setImgState("transformed");
    }, 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const pipeline = [
    {
      label: "Upload",
      sub: "POST /image/upload",
      icon: Upload,
      color: "#818cf8",
    },
    { label: "Queue", sub: "BullMQ + Redis", icon: Layers, color: "#a78bfa" },
    { label: "Process", sub: "Python FastAPI", icon: Wand2, color: "#c084fc" },
    { label: "Deliver", sub: "Cloudinary CDN", icon: Zap, color: "#e879f9" },
  ];

  const transforms = [
    { name: "Resize", ex: '{"resized":{"width":800,"height":600}}' },
    {
      name: "Crop",
      ex: '{"crop":{"left":0,"top":0,"right":400,"bottom":400}}',
    },
    { name: "Grayscale", ex: '{"grayscale":"L"}' },
    { name: "Rotate", ex: '{"rotate":90}' },
    { name: "Flip", ex: '{"flip":true}' },
    { name: "Mirror", ex: '{"mirror":true}' },
    { name: "Watermark", ex: '{"watermark":"© myapp"}' },
    { name: "Format", ex: '{"format":"webp","quality":85}' },
  ];

  return (
    <div className="hr">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box;}

        .hr {
          min-height: 100vh;
          background: #05070f;
          color: #e2e6f3;
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ─── background ─── */
        .hr-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(99,102,241,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(168,85,247,0.06) 0%, transparent 60%);
        }
        .hr-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 100% 100% at 50% 0%, black 30%, transparent 80%);
        }

        /* ─── navbar wrap ─── */
        .hr-nav { position: sticky; top: 0; z-index: 50; }

        /* ─── page ─── */
        .hr-page { position: relative; z-index: 1; max-width: 1040px; margin: 0 auto; padding: 0 24px 100px; flex: 1; }

        /* ─── HERO ─── */
        .hero { padding: 90px 0 72px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        @media (max-width: 768px) { .hero { grid-template-columns: 1fr; padding: 56px 0 40px; } }

        .hero-left {}
        .hero-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em;
          color: #818cf8;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-kicker::before { content:''; width: 24px; height: 1px; background: #818cf8; }

        .hero-h1 {
          font-size: clamp(38px, 6vw, 64px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .hero-h1 em {
          font-style: normal;
          background: linear-gradient(120deg, #818cf8 0%, #c084fc 50%, #e879f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px; font-weight: 300;
          line-height: 1.9;
          color: rgba(226,230,243,0.4);
          max-width: 420px;
          margin-bottom: 36px;
        }

        .hero-btns { display: flex; flex-wrap: wrap; gap: 12px; }

        .btn-p {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px;
          border-radius: 7px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.02em;
          text-decoration: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          transition: all 0.2s;
          box-shadow: 0 0 0 0 rgba(99,102,241,0.4);
        }
        .btn-p:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }

        .btn-g {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px;
          border-radius: 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.06em;
          text-decoration: none;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(226,230,243,0.55);
          transition: all 0.2s;
        }
        .btn-g:hover {
          background: rgba(99,102,241,0.07);
          border-color: rgba(99,102,241,0.3);
          color: #a5b4fc;
        }

        /* ─── terminal card ─── */
        .hero-right {}
        .term-card {
          background: #080b14;
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08);
        }
        .term-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.015);
        }
        .tdot { width: 9px; height: 9px; border-radius: 50%; }
        .tdot-r { background: rgba(239,68,68,0.5); }
        .tdot-y { background: rgba(234,179,8,0.5); }
        .tdot-g { background: rgba(34,197,94,0.5); }
        .term-title {
          margin-left: auto; margin-right: auto;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          color: rgba(226,230,243,0.2);
        }
        .term-body {
          padding: 18px 20px;
          min-height: 220px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; line-height: 1.9; font-weight: 300;
        }
        .tline { display: flex; gap: 4px; }
        .tpre { color: rgba(226,230,243,0.25); flex-shrink: 0; }
        .tcursor {
          display: inline-block; width: 7px; height: 13px;
          background: #818cf8; margin-left: 2px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ─── divider ─── */
        .hr-div {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent);
          margin: 64px 0;
        }

        /* ─── section label ─── */
        .sec-lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.22em;
          color: rgba(99,102,241,0.5);
          margin-bottom: 12px;
        }
        .sec-h2 {
          font-size: 28px; font-weight: 700; letter-spacing: -0.025em;
          margin-bottom: 8px;
        }
        .sec-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11.5px; font-weight: 300;
          color: rgba(226,230,243,0.35);
          line-height: 1.7;
          margin-bottom: 40px;
        }

        /* ─── PIPELINE ─── */
        .pipeline {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 14px;
          overflow: hidden;
        }
        @media (max-width: 640px) { .pipeline { grid-template-columns: repeat(2,1fr); } }

        .pip-cell {
          background: #07090f;
          padding: 28px 22px;
          display: flex; flex-direction: column; gap: 12px;
          transition: background 0.2s;
          position: relative;
        }
        .pip-cell:hover { background: rgba(99,102,241,0.05); }
        .pip-cell:not(:last-child)::after {
          content: '→';
          position: absolute; right: -8px; top: 50%; transform: translateY(-50%);
          font-size: 14px; color: rgba(99,102,241,0.3);
          z-index: 2;
        }
        @media (max-width: 640px) { .pip-cell::after { display: none; } }

        .pip-icon {
          width: 38px; height: 38px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.15);
        }
        .pip-label { font-size: 14px; font-weight: 600; }
        .pip-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 300;
          color: rgba(226,230,243,0.3);
        }

        /* ─── IMAGE DEMO ─── */
        .demo-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 0;
        }
        @media (max-width: 640px) { .demo-wrap { grid-template-columns: 1fr; } }

        .demo-card {
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          background: #07090f;
        }
        .demo-card-top {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .demo-card-lbl {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.14em;
          color: rgba(226,230,243,0.25);
        }
        .demo-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em;
          padding: 2px 8px; border-radius: 3px;
        }
        .demo-status.ok  { background: rgba(34,197,94,0.08);  color: rgba(34,197,94,0.7);  border: 1px solid rgba(34,197,94,0.15); }
        .demo-status.run { background: rgba(251,146,60,0.08); color: rgba(251,146,60,0.7); border: 1px solid rgba(251,146,60,0.15); }

        /* SVG image stand-ins */
        .demo-img-wrap { padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 180px; }

        /* ─── TRANSFORM GRID ─── */
        .tf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        @media (max-width: 768px) { .tf-grid { grid-template-columns: repeat(2,1fr); } }

        .tf-chip {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 9px;
          padding: 14px 16px;
          transition: all 0.2s;
          cursor: default;
        }
        .tf-chip:hover {
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.2);
        }
        .tf-name {
          font-size: 13px; font-weight: 600; margin-bottom: 6px;
          color: rgba(226,230,243,0.8);
        }
        .tf-ex {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; font-weight: 300;
          color: rgba(226,230,243,0.25);
          word-break: break-all;
          line-height: 1.5;
        }

        /* ─── HOW IT FLOWS ─── */
        .flow-steps { display: flex; flex-direction: column; gap: 0; }
        .flow-row {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 16px;
          align-items: flex-start;
        }
        .flow-left {
          display: flex; flex-direction: column; align-items: center; gap: 0;
          padding-top: 4px;
        }
        .flow-circle {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #818cf8;
          flex-shrink: 0;
        }
        .flow-line { width: 1px; flex: 1; min-height: 32px; background: rgba(99,102,241,0.12); }
        .flow-right { padding: 4px 0 32px; }
        .flow-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .flow-desc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 300;
          color: rgba(226,230,243,0.35);
          line-height: 1.75;
        }
        .flow-tag {
          display: inline-block;
          margin-top: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em;
          padding: 2px 8px; border-radius: 3px;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.18);
          color: #a5b4fc;
        }

        /* ─── CTA ─── */
        .cta {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          padding: 72px 48px;
          text-align: center;
          background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.05) 100%);
          border: 1px solid rgba(99,102,241,0.14);
        }
        .cta::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #818cf8, #c084fc, transparent);
        }
        .cta-kicker {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em;
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.06);
          padding: 5px 14px; border-radius: 4px;
          margin-bottom: 24px;
        }
        .cta-dot { width: 5px; height: 5px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399; animation: blink 2s ease-in-out infinite; }

        .cta-h2 {
          font-size: clamp(30px, 5vw, 52px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin-bottom: 16px;
          background: linear-gradient(120deg, #e2e6f3 0%, #a5b4fc 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-para {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; font-weight: 300;
          color: rgba(226,230,243,0.35);
          line-height: 1.8;
          max-width: 400px;
          margin: 0 auto 36px;
        }

        /* ─── footer ─── */
        .foot {
          margin-top: 80px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .foot-m {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          color: rgba(226,230,243,0.18);
        }

        /* ─── fade animations ─── */
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .f1 { animation: fadeUp 0.55s ease both; }
        .f2 { animation: fadeUp 0.55s 0.1s ease both; }
        .f3 { animation: fadeUp 0.55s 0.2s ease both; }
        .f4 { animation: fadeUp 0.55s 0.3s ease both; }
        .f5 { animation: fadeUp 0.55s 0.4s ease both; }
      `}</style>

      <div className="hr-bg" />
      <div className="hr-grid" />

      {/* ── NAVBAR ── */}
      <div className="hr-nav">
        <Navbar
          user={user}
          setUser={setUser}
          onLogOut={onLogOut}
          setOnLogOut={setOnLogOut}
        />
      </div>

      <div className="hr-page">
        {/* ══════════ HERO ══════════ */}
        <section className="hero">
          <div className="hero-left">
            <p className="hero-kicker f1">SELF-HOSTED IMAGE API</p>
            <h1 className="hero-h1 f2">
              Upload, Transform
              <br />
              <em>Ship Faster.</em>
            </h1>
            <p className="hero-sub f3">
              Your own image service — upload files, apply transformations, and
              serve via CDN. No third-party SDK, no lock-in. Just clean REST
              endpoints your app already understands.
            </p>
            <div className="hero-btns f4">
              {user ? (
                <>
                  <Link to="/upload" className="btn-p">
                    Upload an Image <ArrowRight size={14} />
                  </Link>
                  <Link to="/gallery" className="btn-g">
                    View Gallery
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-p">
                    Get Started Free <ArrowRight size={14} />
                  </Link>
                  <Link to="/login" className="btn-g">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── Terminal ── */}
          <div className="hero-right f5">
            <div className="term-card">
              <div className="term-bar">
                <div className="tdot tdot-r" />
                <div className="tdot tdot-y" />
                <div className="tdot tdot-g" />
                <span className="term-title">imageservice — REST API</span>
              </div>
              <div className="term-body">
                {termLines.slice(0, termStep).map((l, i) => (
                  <div className="tline" key={i}>
                    <span className="tpre">{l.prefix}</span>
                    <span style={{ color: l.color }}>{l.text}</span>
                  </div>
                ))}
                {termStep < termLines.length && <span className="tcursor" />}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ PIPELINE ══════════ */}
        <div className="hr-div" />
        <section>
          <p className="sec-lbl">ARCHITECTURE</p>
          <h2 className="sec-h2">Four-stage pipeline</h2>
          <p className="sec-sub">
            Every image you upload travels through the same predictable flow —
            queued, processed by Python, stored on Cloudinary.
          </p>

          <div className="pipeline">
            {pipeline.map((p, i) => {
              const Icon = p.icon;
              return (
                <div className="pip-cell" key={i}>
                  <div
                    className="pip-icon"
                    style={{
                      borderColor: p.color + "33",
                      background: p.color + "11",
                    }}
                  >
                    <Icon size={16} style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="pip-label">{p.label}</div>
                    <div className="pip-sub">{p.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════ IMAGE DEMO ══════════ */}
        <div className="hr-div" />
        <section>
          <p className="sec-lbl">LIVE EXAMPLE</p>
          <h2 className="sec-h2">Original → Transformed</h2>
          <p className="sec-sub">
            POST a transform job, get a{" "}
            <code
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 11,
                color: "#a5b4fc",
              }}
            >
              jobId
            </code>{" "}
            back, poll until complete. The result is a new Cloudinary-hosted
            image.
          </p>

          <div className="demo-wrap">
            {/* original */}
            <div className="demo-card">
              <div className="demo-card-top">
                <span className="demo-card-lbl">
                  ORIGINAL · /fetch/aB3xKp9z
                </span>
                <span className="demo-status ok">200 OK</span>
              </div>
              <div className="demo-img-wrap">
                <svg
                  viewBox="0 0 260 160"
                  width="260"
                  height="160"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a5f" />
                      <stop offset="100%" stopColor="#4a7fcb" />
                    </linearGradient>
                    <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2d4a6a" />
                      <stop offset="100%" stopColor="#1a2e45" />
                    </linearGradient>
                  </defs>
                  <rect width="260" height="160" fill="url(#sky)" rx="6" />
                  {/* sun */}
                  <circle
                    cx="200"
                    cy="35"
                    r="22"
                    fill="#f59e0b"
                    opacity="0.9"
                  />
                  <circle
                    cx="200"
                    cy="35"
                    r="28"
                    fill="#f59e0b"
                    opacity="0.15"
                  />
                  {/* mountains */}
                  <polygon points="0,160 60,60 120,160" fill="url(#mtn)" />
                  <polygon points="80,160 150,50 220,160" fill="#253d57" />
                  <polygon points="160,160 220,80 280,160" fill="url(#mtn)" />
                  {/* water */}
                  <rect
                    x="0"
                    y="120"
                    width="260"
                    height="40"
                    fill="#1a3a5c"
                    opacity="0.8"
                    rx="0"
                  />
                  <ellipse
                    cx="200"
                    cy="132"
                    rx="30"
                    ry="6"
                    fill="#f59e0b"
                    opacity="0.25"
                  />
                  {/* clouds */}
                  <ellipse
                    cx="60"
                    cy="25"
                    rx="30"
                    ry="10"
                    fill="white"
                    opacity="0.12"
                  />
                  <ellipse
                    cx="75"
                    cy="22"
                    rx="20"
                    ry="8"
                    fill="white"
                    opacity="0.1"
                  />
                  {/* label */}
                  <rect
                    x="6"
                    y="6"
                    width="60"
                    height="14"
                    rx="3"
                    fill="rgba(0,0,0,0.4)"
                  />
                  <text
                    x="10"
                    y="17"
                    fill="#a5b4fc"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    1920 × 1080
                  </text>
                </svg>
              </div>
            </div>

            {/* transformed */}
            <div className="demo-card">
              <div className="demo-card-top">
                <span className="demo-card-lbl">
                  TRANSFORMED · grayscale + resize
                </span>
                <span
                  className={`demo-status ${imgState === "processing" ? "run" : "ok"}`}
                >
                  {imgState === "original"
                    ? "PENDING"
                    : imgState === "processing"
                      ? "ACTIVE"
                      : "200 OK"}
                </span>
              </div>
              <div className="demo-img-wrap">
                {imgState === "processing" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        stroke="rgba(99,102,241,0.15)"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        stroke="#818cf8"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="22 66"
                        strokeLinecap="round"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 18 18"
                          to="360 18 18"
                          dur="0.9s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 10,
                        color: "rgba(226,230,243,0.3)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      WORKER PROCESSING...
                    </span>
                  </div>
                ) : imgState === "transformed" ? (
                  <svg
                    viewBox="0 0 260 160"
                    width="260"
                    height="160"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2a2a2a" />
                        <stop offset="100%" stopColor="#555" />
                      </linearGradient>
                    </defs>
                    <rect width="260" height="160" fill="url(#gsky)" rx="6" />
                    <circle
                      cx="200"
                      cy="35"
                      r="22"
                      fill="#c0c0c0"
                      opacity="0.9"
                    />
                    <circle
                      cx="200"
                      cy="35"
                      r="28"
                      fill="#c0c0c0"
                      opacity="0.12"
                    />
                    <polygon points="0,160 60,60 120,160" fill="#1a1a1a" />
                    <polygon points="80,160 150,50 220,160" fill="#2a2a2a" />
                    <polygon points="160,160 220,80 280,160" fill="#1a1a1a" />
                    <rect
                      x="0"
                      y="120"
                      width="260"
                      height="40"
                      fill="#111"
                      opacity="0.8"
                    />
                    <ellipse
                      cx="200"
                      cy="132"
                      rx="30"
                      ry="6"
                      fill="#888"
                      opacity="0.25"
                    />
                    <ellipse
                      cx="60"
                      cy="25"
                      rx="30"
                      ry="10"
                      fill="white"
                      opacity="0.08"
                    />
                    <rect
                      x="6"
                      y="6"
                      width="60"
                      height="14"
                      rx="3"
                      fill="rgba(0,0,0,0.5)"
                    />
                    <text
                      x="10"
                      y="17"
                      fill="#a5b4fc"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      800 × 600
                    </text>
                    {/* grayscale badge */}
                    <rect
                      x="180"
                      y="6"
                      width="74"
                      height="14"
                      rx="3"
                      fill="rgba(0,0,0,0.5)"
                    />
                    <text
                      x="184"
                      y="17"
                      fill="#34d399"
                      fontSize="7"
                      fontFamily="monospace"
                    >
                      grayscale: L
                    </text>
                  </svg>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="rgba(99,102,241,0.15)"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 16l5 5 11-11"
                        stroke="#818cf8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 10,
                        color: "rgba(226,230,243,0.25)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      AWAITING JOB...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* payload — kept in sync with the actual transform option names used in the chips below */}
          <div
            style={{
              marginTop: 16,
              background: "#080b14",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "14px 18px",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11.5,
              lineHeight: 1.8,
              color: "rgba(226,230,243,0.4)",
              overflowX: "auto",
            }}
          >
            <span
              style={{
                color: "rgba(226,230,243,0.2)",
                fontSize: 9,
                letterSpacing: "0.14em",
              }}
            >
              REQUEST BODY
            </span>
            <br />
            {"{"}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"resized"</span>
            {": {"}
            <br />
            {"    "}
            <span style={{ color: "#f472b6" }}>"width"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>800</span>
            {","}
            <br />
            {"    "}
            <span style={{ color: "#f472b6" }}>"height"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>600</span>
            <br />
            {"  "}
            {"}"}
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"crop"</span>
            {": {"}
            <br />
            {"    "}
            <span style={{ color: "#f472b6" }}>"left"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>0</span>
            {","}
            <br />
            {"    "}
            <span style={{ color: "#f472b6" }}>"top"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>0</span>
            {","}
            <br />
            {"    "}
            <span style={{ color: "#f472b6" }}>"right"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>400</span>
            {","}
            <br />
            {"    "}
            <span style={{ color: "#f472b6" }}>"bottom"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>400</span>
            <br />
            {"  "}
            {"}"}
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"rotate"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>90</span>
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"grayscale"</span>
            {": "}
            <span style={{ color: "#a3e635" }}>"L"</span>
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"flip"</span>
            {": "}
            <span style={{ color: "#60a5fa" }}>true</span>
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"mirror"</span>
            {": "}
            <span style={{ color: "#60a5fa" }}>false</span>
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"watermark"</span>
            {": "}
            <span style={{ color: "#a3e635" }}>"© myapp"</span>
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"quality"</span>
            {": "}
            <span style={{ color: "#fb923c" }}>85</span>
            {","}
            <br />
            {"  "}
            <span style={{ color: "#f472b6" }}>"format"</span>
            {": "}
            <span style={{ color: "#a3e635" }}>"webp"</span>
            <br />
            {"}"}{" "}
          </div>
        </section>

        {/* ══════════ ALL TRANSFORMS ══════════ */}
        <div className="hr-div" />
        <section>
          <p className="sec-lbl">TRANSFORM OPTIONS</p>
          <h2 className="sec-h2">Eight ways to transform</h2>
          <p className="sec-sub">
            All transforms run on your Python FastAPI microservice and can be
            combined in a single request.
          </p>

          <div className="tf-grid">
            {transforms.map((t) => (
              <div className="tf-chip" key={t.name}>
                <div className="tf-name">{t.name}</div>
                <div className="tf-ex">{t.ex}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ HOW IT FLOWS ══════════ */}
        <div className="hr-div" />
        <section>
          <p className="sec-lbl">HOW IT WORKS</p>
          <h2 className="sec-h2">From upload to CDN in seconds</h2>
          <p className="sec-sub">
            The full request cycle — from your app to a hosted transformed
            image.
          </p>

          <div className="flow-steps">
            {[
              {
                n: "1",
                t: "Sign up and sign in",
                d: "Create an account, sign in — two HTTP-only cookies are set automatically. No manual token management.",
                tag: "POST /api/v1/users/signup  ·  POST /api/v1/users/signin",
              },
              {
                n: "2",
                t: "Upload your image",
                d: "Send a multipart POST with your file. It's saved, uploaded to Cloudinary, and you get back a short 8-character code.",
                tag: "POST /api/v1/image/upload",
              },
              {
                n: "3",
                t: "Request a transformation",
                d: "POST your transform options (resize, crop, grayscale, watermark…) to the transform endpoint. A job is queued in Redis via BullMQ and a jobId is returned immediately.",
                tag: "POST /api/v1/image/transformimage/:imageCode",
              },
              {
                n: "4",
                t: "Background worker processes",
                d: "A Node.js BullMQ worker picks up the job, calls your Python FastAPI service with the image URL and parameters. Pillow processes it in-memory.",
                tag: "BullMQ Worker → Python FastAPI → Pillow",
              },
              {
                n: "5",
                t: "Poll until complete",
                d: "Check job status — once it returns 'completed', the result contains your new Cloudinary CDN URL, ready to embed anywhere.",
                tag: "GET /api/v1/image/job-status/:jobId",
              },
            ].map((s, i, arr) => (
              <div className="flow-row" key={i}>
                <div className="flow-left">
                  <div className="flow-circle">{s.n}</div>
                  {i < arr.length - 1 && <div className="flow-line" />}
                </div>
                <div className="flow-right">
                  <div className="flow-title">{s.t}</div>
                  <div className="flow-desc">{s.d}</div>
                  <span className="flow-tag">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <div className="hr-div" />
        <section>
          <div className="cta">
            <div className="cta-kicker">
              <span className="cta-dot" />
              FREE TO START
            </div>
            <h2 className="cta-h2">
              {user
                ? `Welcome back, ${user.username || "there"}.`
                : "Start building today."}
            </h2>
            <p className="cta-para">
              {user
                ? "Head to your gallery to manage uploads, or transform a new image right now."
                : "Create a free account, upload your first image, and have a transformed CDN URL in under two minutes."}
            </p>
            {user ? (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/upload"
                  className="btn-p"
                  style={{ display: "inline-flex" }}
                >
                  Upload Image <ArrowRight size={14} />
                </Link>
                <Link
                  to="/gallery"
                  className="btn-g"
                  style={{ display: "inline-flex" }}
                >
                  My Gallery
                </Link>
              </div>
            ) : (
              <Link
                to="/register"
                className="btn-p"
                style={{ display: "inline-flex" }}
              >
                Create Free Account <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="foot">
          <span className="foot-m">IMAGESERVICE © 2026</span>
          <span className="foot-m">Node · Python · Redis · Cloudinary</span>
          <span className="foot-m">BUILT FOR DEVELOPERS</span>
        </div>
      </div>
    </div>
  );
}
