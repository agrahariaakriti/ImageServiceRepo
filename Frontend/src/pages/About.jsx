import Navbar from "../components/Navbar";
import { User, Mail, FolderGit2, ArrowUpRight, Target } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

function Connect() {
  const projects = [
    {
      name: "ImageService",
      desc: "Upload system with auth, compression, cloud storage, and optimized delivery pipeline.",
      tech: ["Node", "Cloudinary", "Auth"],
      num: "01",
    },
    {
      name: "Expense Tracker",
      desc: "Full-stack finance system with user auth, analytics, and persistent storage.",
      tech: ["React", "Node", "MongoDB"],
      num: "02",
    },
    {
      name: "Task Manager API",
      desc: "REST API with JWT auth, clean architecture, and scalable DB design.",
      tech: ["Express", "JWT", "MongoDB"],
      num: "03",
    },
  ];

  const socials = [
    { icon: FaLinkedin, label: "LinkedIn", sub: "Let's connect", href: "https://www.linkedin.com/in/aakriti-agrahari/" },
    { icon: FaGithub, label: "GitHub", sub: "See my code", href: "https://github.com/agrahariaakriti" },
    { icon: SiLeetcode, label: "LeetCode", sub: "DSA grind", href: "https://leetcode.com/u/aakriti_agrahari1/" },
    { icon: Mail, label: "Email", sub: "Say hello", href: "mailto:agrahariaakriti1@gmail.com" },
  ];

  return (
    <div className="connect-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

        .connect-root {
          min-height: 100vh;
          background: #04060c;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        /* ── grid overlay ── */
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

        /* ── orb glows ── */
        .orb {
          position: fixed;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
        }
        .orb-1 { width: 600px; height: 600px; background: rgba(14,165,233,0.08); top: -200px; left: -200px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(6,182,212,0.06); bottom: -150px; right: -150px; }
        .orb-3 { width: 350px; height: 350px; background: rgba(99,102,241,0.06); top: 40%; left: 50%; transform: translateX(-50%); }

        /* ── layout ── */
        .page {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 120px 24px 80px;
        }

        /* ── hero ── */
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: #38bdf8;
          margin-bottom: 20px;
        }
        .eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #38bdf8;
        }

        .hero-name {
          font-size: clamp(52px, 9vw, 88px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
          background: linear-gradient(135deg, #f0f4ff 0%, #38bdf8 60%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: clamp(52px, 9vw, 88px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin: 0 0 28px;
          color: rgba(255,255,255,0.08);
          -webkit-text-stroke: 1px rgba(56,189,248,0.2);
        }

        .hero-para {
          font-size: 16px;
          line-height: 1.75;
          color: rgba(232,234,240,0.5);
          max-width: 540px;
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          margin-bottom: 28px;
        }

        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 0;
        }

        .tag {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 5px 14px;
          border: 1px solid rgba(56,189,248,0.25);
          color: #7dd3fc;
          background: rgba(56,189,248,0.04);
          border-radius: 3px;
          transition: all 0.2s;
        }
        .tag:hover {
          border-color: rgba(56,189,248,0.6);
          background: rgba(56,189,248,0.1);
        }

        /* ── divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent);
          margin: 56px 0;
        }

        /* ── section header ── */
        .sec-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        .sec-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #38bdf8;
          letter-spacing: 0.1em;
        }
        .sec-title {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .sec-line {
          flex: 1;
          height: 1px;
          background: rgba(56,189,248,0.12);
        }

        /* ── about / focus grid ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        @media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } }

        .info-block {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        .info-block:first-child { border-radius: 12px 0 0 12px; }
        .info-block:last-child  { border-radius: 0 12px 12px 0; }
        @media (max-width: 640px) {
          .info-block:first-child { border-radius: 12px 12px 0 0; }
          .info-block:last-child  { border-radius: 0 0 12px 12px; }
        }
        .info-block::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .info-block:hover { background: rgba(56,189,248,0.03); border-color: rgba(56,189,248,0.2); }
        .info-block:hover::before { opacity: 1; }

        .block-icon {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(56,189,248,0.1);
          border: 1px solid rgba(56,189,248,0.2);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          color: #38bdf8;
        }

        .block-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(232,234,240,0.4);
          margin-bottom: 12px;
          font-family: 'DM Mono', monospace;
        }

        .block-body {
          font-size: 14px;
          line-height: 1.8;
          color: rgba(232,234,240,0.55);
          font-family: 'DM Mono', monospace;
          font-weight: 300;
        }

        .focus-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(232,234,240,0.55);
          font-family: 'DM Mono', monospace;
          padding: 7px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .focus-item:last-child { border-bottom: none; }
        .focus-dot {
          width: 5px; height: 5px;
          background: #38bdf8;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── projects ── */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr; } }

        .proj-card {
          background: #07090f;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
          cursor: pointer;
        }
        .proj-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.05) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .proj-card:hover { background: #090c14; }
        .proj-card:hover::after { opacity: 1; }

        .proj-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(56,189,248,0.4);
          letter-spacing: 0.1em;
          margin-bottom: 24px;
        }

        .proj-icon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .proj-icon {
          color: #38bdf8;
        }
        .proj-arrow {
          color: rgba(56,189,248,0.3);
          transition: color 0.2s, transform 0.2s;
        }
        .proj-card:hover .proj-arrow {
          color: #38bdf8;
          transform: translate(2px, -2px);
        }

        .proj-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }

        .proj-desc {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(232,234,240,0.4);
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          margin-bottom: 20px;
        }

        .proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .proj-tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border: 1px solid rgba(56,189,248,0.18);
          color: rgba(56,189,248,0.6);
          background: rgba(56,189,248,0.04);
          border-radius: 2px;
        }

        /* ── connect ── */
        .connect-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 640px) { .connect-grid { grid-template-columns: repeat(2, 1fr); } }

        .social-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 28px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .social-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          transform: scaleX(0);
          transition: transform 0.3s;
        }
        .social-card:hover {
          background: rgba(56,189,248,0.05);
          border-color: rgba(56,189,248,0.3);
          transform: translateY(-4px);
        }
        .social-card:hover::before { transform: scaleX(1); }

        .social-icon { color: #38bdf8; }

        .social-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .social-sub {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(232,234,240,0.3);
          letter-spacing: 0.05em;
        }

        /* ── footer line ── */
        .footer {
          margin-top: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-mono {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: rgba(232,234,240,0.2);
          letter-spacing: 0.06em;
        }
        .status-dot {
          display: inline-block;
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          margin-right: 6px;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar user={null} />

      <div className="page">

        {/* ── HERO ── */}
        <section style={{ marginBottom: "80px" }}>
          <p className="eyebrow">SOFTWARE ENGINEER · BACKEND FOCUS</p>

          <h1 className="hero-name">Hey, I'm A.A</h1>
          <h2 className="hero-sub">Builder.</h2>

          <p className="hero-para">
            I build backend systems, APIs, and full-stack apps with focus on performance,
            clean architecture, and real-world scalability. I learn by building — not watching.
          </p>

          <div className="tags-row">
            {["Node.js", "React", "MongoDB", "REST APIs", "DSA"].map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </section>

        {/* ── ABOUT + FOCUS ── */}
        <section>
          <div className="sec-header">
            <span className="sec-num">01</span>
            <h2 className="sec-title">Profile</h2>
            <div className="sec-line" />
          </div>

          <div className="two-col">
            <div className="info-block">
              <div className="block-icon"><User size={16} /></div>
              <p className="block-title">About</p>
              <p className="block-body">
                I don't focus on flashy apps. I focus on systems that actually work:
                authentication flows, API design, database structure, and performance under load.
              </p>
            </div>

            <div className="info-block">
              <div className="block-icon"><Target size={16} /></div>
              <p className="block-title">Current Focus</p>
              <div>
                {[
                  "System Design fundamentals",
                  "Advanced DSA patterns",
                  "Scalable backend architecture",
                  "Production-ready API development",
                ].map((f) => (
                  <div key={f} className="focus-item">
                    <div className="focus-dot" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── PROJECTS ── */}
        <section>
          <div className="sec-header">
            <span className="sec-num">02</span>
            <h2 className="sec-title">Featured Projects</h2>
            <div className="sec-line" />
          </div>

          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.name} className="proj-card">
                <p className="proj-num">{p.num}</p>
                <div className="proj-icon-row">
                  <FolderGit2 size={22} className="proj-icon" />
                  <ArrowUpRight size={16} className="proj-arrow" />
                </div>
                <h3 className="proj-name">{p.name}</h3>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.tech.map((t) => (
                    <span key={t} className="proj-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── CONNECT ── */}
        <section>
          <div className="sec-header">
            <span className="sec-num">03</span>
            <h2 className="sec-title">Connect</h2>
            <div className="sec-line" />
          </div>

          <div className="connect-grid">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-card"
                >
                  <Icon size={22} className="social-icon" />
                  <p className="social-label">{item.label}</p>
                  <p className="social-sub">{item.sub}</p>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="footer">
          <span className="footer-mono">A.A · PORTFOLIO</span>
          <span className="footer-mono">
            <span className="status-dot" />
            AVAILABLE FOR WORK
          </span>
        </div>

      </div>
    </div>
  );
}

export default Connect;