import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Upload, Wand2, ShieldCheck, ArrowRight, Terminal, Zap } from "lucide-react";

export default function Home() {
  const user = null;

  const features = [
    {
      icon: Upload,
      num: "01",
      title: "Image Uploads",
      desc: "Upload images securely with a single API call. Supports multipart, base64, and URL ingestion.",
    },
    {
      icon: Wand2,
      num: "02",
      title: "Transformations",
      desc: "Resize, crop, optimize and process images on-the-fly with URL-based transform params.",
    },
    {
      icon: ShieldCheck,
      num: "03",
      title: "Secure Storage",
      desc: "Reliable cloud storage with signed URLs, expiry control, and per-key access policies.",
    },
  ];

  const stats = [
    { value: "< 80ms", label: "Avg. response" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "10TB+", label: "Images served" },
    { value: "REST", label: "Clean API" },
  ];

  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        .home-root {
          min-height: 100vh;
          background: #04060c;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        /* ── dot grid ── */
        .grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── orbs ── */
        .orb { position: fixed; pointer-events: none; border-radius: 50%; filter: blur(130px); z-index: 0; }
        .orb-1 { width: 700px; height: 700px; background: rgba(14,165,233,0.07); top: -300px; left: -200px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(99,102,241,0.06); bottom: -200px; right: -150px; }
        .orb-3 { width: 300px; height: 300px; background: rgba(6,182,212,0.05); top: 55%; left: 60%; }

        /* ── page ── */
        .page { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 0 24px 80px; }

        /* ── HERO ── */
        .hero { padding: 130px 0 80px; }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #38bdf8;
          margin-bottom: 28px;
        }
        .eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #38bdf8;
        }

        .hero-h1 {
          font-size: clamp(52px, 9vw, 90px);
          font-weight: 800;
          line-height: 0.93;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
        }
        .hero-h1-solid { color: #e8eaf0; display: block; }
        .hero-h1-grad {
          display: block;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 70%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-para {
          margin: 28px 0 36px;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 300;
          line-height: 1.9;
          color: rgba(232,234,240,0.45);
          max-width: 520px;
        }

        .cta-row { display: flex; flex-wrap: wrap; gap: 12px; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 6px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-decoration: none;
          background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.12));
          border: 1px solid rgba(56,189,248,0.35);
          color: #7dd3fc;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.08));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .btn-primary:hover { border-color: rgba(56,189,248,0.6); transform: translateY(-2px); }
        .btn-primary:hover::after { opacity: 1; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-decoration: none;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(232,234,240,0.5);
          transition: all 0.25s;
        }
        .btn-ghost:hover {
          border-color: rgba(56,189,248,0.25);
          color: rgba(232,234,240,0.8);
          background: rgba(56,189,248,0.04);
        }

        /* ── divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.25), transparent);
          margin: 64px 0;
        }

        /* ── section header ── */
        .sec-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .sec-num { font-family: 'DM Mono', monospace; font-size: 11px; color: #38bdf8; letter-spacing: 0.1em; }
        .sec-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
        .sec-line { flex: 1; height: 1px; background: rgba(56,189,248,0.1); }

        /* ── stats strip ── */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(56,189,248,0.08);
          border: 1px solid rgba(56,189,248,0.1);
          border-radius: 12px;
          overflow: hidden;
          margin: 56px 0;
        }
        @media (max-width: 640px) { .stats-strip { grid-template-columns: repeat(2,1fr); } }

        .stat-cell {
          background: #06090f;
          padding: 28px 20px;
          text-align: center;
          transition: background 0.2s;
        }
        .stat-cell:hover { background: rgba(56,189,248,0.04); }

        .stat-val {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #e8eaf0, #7dd3fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(232,234,240,0.3);
          margin-top: 4px;
          text-transform: uppercase;
        }

        /* ── API preview ── */
        .api-panel {
          background: #06090f;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }

        .api-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
        }
        .api-dots { display: flex; gap: 6px; }
        .api-dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-r { background: rgba(239,68,68,0.5); }
        .dot-y { background: rgba(234,179,8,0.5); }
        .dot-g { background: rgba(34,197,94,0.5); }

        .api-route {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(56,189,248,0.6);
        }

        .api-body {
          padding: 24px;
          overflow-x: auto;
        }
        .api-body pre {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          line-height: 1.9;
          margin: 0;
          color: rgba(232,234,240,0.55);
        }
        .api-key   { color: #f472b6; }
        .api-str   { color: #a3e635; }
        .api-punct { color: rgba(232,234,240,0.25); }
        .api-meth  { color: #38bdf8; }
        .api-flag  { color: rgba(232,234,240,0.3); }

        /* ── features ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (max-width: 768px) { .features-grid { grid-template-columns: 1fr; } }

        .feat-card {
          background: #07090f;
          padding: 36px 28px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
        }
        .feat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 0%, rgba(56,189,248,0.06) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .feat-card:hover { background: #090c14; }
        .feat-card:hover::before, .feat-card:hover::after { opacity: 1; }

        .feat-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(56,189,248,0.35);
          letter-spacing: 0.1em;
          margin-bottom: 20px;
        }

        .feat-icon-wrap {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: rgba(56,189,248,0.08);
          border: 1px solid rgba(56,189,248,0.18);
          display: flex; align-items: center; justify-content: center;
          color: #38bdf8;
          margin-bottom: 20px;
          transition: background 0.2s, border-color 0.2s;
        }
        .feat-card:hover .feat-icon-wrap {
          background: rgba(56,189,248,0.14);
          border-color: rgba(56,189,248,0.35);
        }

        .feat-title { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 10px; }

        .feat-desc {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(232,234,240,0.4);
        }

        /* ── CTA ── */
        .cta-block {
          position: relative;
          border: 1px solid rgba(56,189,248,0.12);
          border-radius: 20px;
          overflow: hidden;
          padding: 64px 48px;
          text-align: center;
          background: #06090f;
        }
        .cta-block::before {
          content: '';
          position: absolute;
          top: -120px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-block::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(129,140,248,0.3), transparent);
        }

        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #38bdf8;
          border: 1px solid rgba(56,189,248,0.25);
          background: rgba(56,189,248,0.06);
          padding: 5px 14px;
          border-radius: 3px;
          margin-bottom: 24px;
        }
        .cta-badge-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 6px #22c55e; animation: pulse 2s ease-in-out infinite; }

        .cta-h2 {
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #e8eaf0 0%, #7dd3fc 60%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-para {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 300;
          color: rgba(232,234,240,0.4);
          line-height: 1.8;
          max-width: 440px;
          margin: 0 auto 36px;
        }

        /* ── footer ── */
        .footer {
          margin-top: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-mono { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(232,234,240,0.2); letter-spacing: 0.06em; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        /* ── fade-in on load ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { animation: fadeUp 0.6s ease both; }
        .fade-2 { animation: fadeUp 0.6s 0.12s ease both; }
        .fade-3 { animation: fadeUp 0.6s 0.24s ease both; }
        .fade-4 { animation: fadeUp 0.6s 0.36s ease both; }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar user={user} />

      <div className="page">

        {/* ── HERO ── */}
        <section className="hero">
          <p className="eyebrow fade-1">DEVELOPER IMAGE API</p>

          <h1 className="hero-h1 fade-2">
            <span className="hero-h1-solid">Image APIs</span>
            <span className="hero-h1-grad">Built For Devs</span>
          </h1>

          <p className="hero-para fade-3">
            Upload, transform, optimize and serve images through a clean REST API.
            Fast integration, simple workflows, developer-friendly tooling from day one.
          </p>

          <div className="cta-row fade-4">
            <Link to="/register" className="btn-primary">
              Get Started <ArrowRight size={14} />
            </Link>
            <Link to="/docs" className="btn-ghost">
              <Terminal size={13} /> View Docs
            </Link>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div className="stats-strip">
          {stats.map((s) => (
            <div key={s.label} className="stat-cell">
              <div className="stat-val">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* ── API PREVIEW ── */}
        <section>
          <div className="sec-header">
            <span className="sec-num">01</span>
            <h2 className="sec-title">Simple Integration</h2>
            <div className="sec-line" />
          </div>

          <div className="api-panel">
            <div className="api-topbar">
              <div className="api-dots">
                <div className="api-dot dot-r" />
                <div className="api-dot dot-y" />
                <div className="api-dot dot-g" />
              </div>
              <span className="api-route">POST /api/v1/upload</span>
              <span style={{ width: 60 }} />
            </div>
            <div className="api-body">
              <pre>
                <span className="api-meth">curl</span>
                <span className="api-flag"> -X </span>
                <span className="api-str">POST</span>
                {` https://api.imageservice.com/v1/upload \\\n`}
                <span className="api-flag">  -H </span>
                <span className="api-str">"Authorization: Bearer </span>
                <span className="api-key">YOUR_API_KEY</span>
                <span className="api-str">"</span>
                {` \\\n`}
                <span className="api-flag">  -H </span>
                <span className="api-str">"Content-Type: multipart/form-data"</span>
                {` \\\n`}
                <span className="api-flag">  -F </span>
                <span className="api-str">"image=@photo.jpg"</span>
                {` \\\n`}
                <span className="api-flag">  -F </span>
                <span className="api-str">"transform=resize:800x600,format:webp"</span>
              </pre>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── FEATURES ── */}
        <section>
          <div className="sec-header">
            <span className="sec-num">02</span>
            <h2 className="sec-title">Everything You Need</h2>
            <div className="sec-line" />
          </div>

          <div className="features-grid">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.num} className="feat-card">
                  <p className="feat-num">{f.num}</p>
                  <div className="feat-icon-wrap"><Icon size={18} /></div>
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="divider" />

        {/* ── CTA ── */}
        <section>
          <div className="cta-block">
            <div className="cta-badge">
              <span className="cta-badge-dot" />
              FREE TO START
            </div>
            <h2 className="cta-h2">Start Building<br />Today.</h2>
            <p className="cta-para">
              Integrate image uploads, transformations and CDN delivery into your
              app in under 10 minutes. No credit card required.
            </p>
            <Link to="/register" className="btn-primary" style={{ display: "inline-flex" }}>
              Create Free Account <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="footer">
          <span className="footer-mono">IMAGESERVICE © 2026</span>
          <span className="footer-mono">BUILT FOR DEVELOPERS</span>
        </div>

      </div>
    </div>
  );
}