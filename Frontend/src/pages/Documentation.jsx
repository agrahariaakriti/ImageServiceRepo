import Navbar from "../components/Navbar";
import { useRef, useState } from "react";

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
    sections[key].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "start", label: "Getting Started", icon: Rocket },
    { key: "auth", label: "Auth", icon: ShieldCheck },
    { key: "upload", label: "Upload", icon: Upload },
    { key: "transform", label: "Transform", icon: Wand2 },
    { key: "gallery", label: "Gallery", icon: Images },
  ];

  /* 🔥 DARK DEV-STYLE CARD (FINAL FIX) */
  const card =
    "relative rounded-2xl p-7 border border-white/5 bg-[#0b0f17] transition-all duration-300 hover:border-cyan-800/30 hover:shadow-[0_0_80px_rgba(34,211,250,0.09)] hover:-translate-y-5";

  return (
    <div className="min-h-screen bg-[#05070d]  text-white">
      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar user={null} />
      </div>

      {/* BACKGROUND GLOW (SUBTLE) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/5 blur-[200px] top-[-250px] left-[-250px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/5 blur-[200px] bottom-[-250px] right-[-250px]" />
      </div>

      {/* CONTENT */}
      <div className="py-18 max-w-5xl mx-auto px-6">
        {/* SECOND NAVBAR */}
        <div className="mb-8">
          <div className="flex gap-5 justify-center overflow-x-auto scrollbar-hide bg-[#0a0f1a] border border-white/10 rounded-xl p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;

              return (
                <button
                  key={t.key}
                  onClick={() => scrollTo(t.key)}
                  className={`flex items-center gap-2 px-4 py-2  rounded-lg text-sm transition whitespace-nowrap
                    ${
                      isActive
                        ? "bg-cyan-200/10 text-cyan-300 border border-cyan-500/20"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold">Developer Documentation</h1>
          <p className="text-white/40 mt-2 text-sm">
            Clean API reference for ImageService
          </p>
        </div>

        {/* OVERVIEW */}
        <section ref={sections.overview} className={`${card} mb-8`}>
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-white/50 mt-3 text-sm leading-relaxed">
            ImageService is a lightweight API for uploading, transforming, and
            managing images using simple HTTP requests.
          </p>
        </section>

        {/* START */}
        <section ref={sections.start} className={`${card} mb-8`}>
          <h2 className="text-lg font-semibold">Getting Started</h2>

          <ol className="mt-4 space-y-2 text-sm text-white/50 list-decimal list-inside">
            <li>Create account</li>
            <li>Generate API key</li>
            <li>Add API key in headers</li>
            <li>Start calling APIs</li>
          </ol>
        </section>

        {/* AUTH */}
        <section ref={sections.auth} className={`${card} mb-8`}>
          <h2 className="text-lg font-semibold">Authentication</h2>

          <p className="text-white/50 mt-3 text-sm">
            All requests require API authentication.
          </p>

          <div className="mt-4 bg-black/40 border border-white/10 rounded-lg p-4 text-cyan-300 text-sm">
            Authorization: Bearer YOUR_API_KEY
          </div>
        </section>

        {/* UPLOAD */}
        <section ref={sections.upload} className={`${card} mb-8`}>
          <h2 className="text-lg font-semibold">Upload API</h2>

          <p className="text-white/50 mt-3 text-sm">
            Upload images to your storage system.
          </p>

          <div className="mt-4 bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/60">
            POST /api/upload
            <br />
            image: file
          </div>
        </section>

        {/* TRANSFORM */}
        <section ref={sections.transform} className={`${card} mb-8`}>
          <h2 className="text-lg font-semibold">Transform API</h2>

          <p className="text-white/50 mt-3 text-sm">
            Resize, crop, or modify images.
          </p>

          <div className="mt-4 bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/60">
            POST /api/transform
            <br />
            {/* {`{ imageId, action, width, height }`} */}
          </div>
        </section>

        {/* GALLERY */}
        <section ref={sections.gallery} className={card}>
          <h2 className="text-lg font-semibold">Gallery API</h2>

          <p className="text-white/50 mt-3 text-sm">
            Fetch all uploaded images for a user.
          </p>

          <div className="mt-4 bg-black/40 border border-white/10 rounded-lg p-4 text-sm text-white/60">
            GET /api/gallery
          </div>
        </section>
      </div>
    </div>
  );
}

export default Documentation;
