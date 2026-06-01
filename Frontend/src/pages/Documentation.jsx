import Navbar from "../components/Navbar";
import { useRef } from "react";

function Documentation() {
  const sections = {
    overview: useRef(null),
    start: useRef(null),
    auth: useRef(null),
    upload: useRef(null),
    transform: useRef(null),
    gallery: useRef(null),
  };

  const scrollTo = (key) => {
    sections[key].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const cardStyle = `
    relative
    bg-white/5
    border border-white/10
    p-6 rounded-2xl
    transition-all duration-300
    hover:scale-[1.02]
    hover:-translate-y-1
    hover:border-cyan-400/50
    hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]
    backdrop-blur-xl
    overflow-hidden
    group
  `;

  return (
    <div className="min-h-screen bg-[#05070d] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar user={null} />
      </div>

      {/* ✨ GLOW BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] bg-cyan-400/10 blur-[160px] top-[-250px] left-[-250px] animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-blue-500/10 blur-[160px] bottom-[-250px] right-[-250px] animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-white/5 blur-[120px] top-[40%] left-[50%] animate-ping" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="pt-24 flex">
        {/* SIDEBAR */}
        <aside className="w-64 fixed left-0 top-20 h-full border-r border-white/10 px-6 py-8 backdrop-blur-xl bg-white/5">
          <h2 className="text-lg font-semibold text-cyan-400 tracking-wide">
            Documentation
          </h2>

          <div className="mt-8 space-y-3 text-sm text-white/60">
            <button
              onClick={() => scrollTo("overview")}
              className="hover:text-cyan-400 transition"
            >
              Overview
            </button>

            <button
              onClick={() => scrollTo("start")}
              className="hover:text-cyan-400 transition"
            >
              Getting Started
            </button>

            <button
              onClick={() => scrollTo("auth")}
              className="hover:text-cyan-400 transition"
            >
              Authentication
            </button>

            <button
              onClick={() => scrollTo("upload")}
              className="hover:text-cyan-400 transition"
            >
              Upload API
            </button>

            <button
              onClick={() => scrollTo("transform")}
              className="hover:text-cyan-400 transition"
            >
              Transform API
            </button>

            <button
              onClick={() => scrollTo("gallery")}
              className="hover:text-cyan-400 transition"
            >
              Gallery API
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="ml-64 flex-1 px-10 pb-24 space-y-24">
          {/* TITLE */}
          <div className="pt-6">
            <h1 className="text-4xl font-semibold tracking-wide">
              Developer Documentation
            </h1>

            <p className="text-white/50 mt-2">
              Everything you need to integrate ImageService API
            </p>
          </div>

          {/* OVERVIEW */}
          <section ref={sections.overview}>
            <div className={cardStyle}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />

              <h2 className="text-xl text-cyan-300 group-hover:text-cyan-200 transition">
                Overview
              </h2>

              <p className="text-white/60 mt-3 leading-relaxed">
                ImageService is a modern image processing API built for
                developers. Upload, transform, compress, and manage images with
                simple REST APIs.
              </p>
            </div>
          </section>

          {/* START */}
          <section ref={sections.start}>
            <div className={cardStyle}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />

              <h2 className="text-xl text-cyan-300">Getting Started</h2>

              <ol className="mt-3 text-white/60 space-y-2 list-decimal list-inside">
                <li>Create account</li>
                <li>Get API key from dashboard</li>
                <li>Start calling APIs</li>
              </ol>
            </div>
          </section>

          {/* AUTH */}
          <section ref={sections.auth}>
            <div className={cardStyle}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />

              <h2 className="text-xl text-cyan-300">Authentication</h2>

              <p className="text-white/60 mt-3">
                Add API key in request headers:
              </p>

              <div className="mt-3 bg-black/40 p-4 rounded-lg border border-white/10 overflow-x-auto hover:border-cyan-400/40 transition">
                <code className="text-cyan-300">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>
          </section>

          {/* UPLOAD */}
          <section ref={sections.upload}>
            <div className={cardStyle}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />

              <h2 className="text-xl text-cyan-300">Upload API</h2>

              <div className="mt-4 bg-black/50 p-4 rounded-lg text-sm overflow-x-auto border border-white/10 hover:border-cyan-400/40 transition">
                {`POST /api/upload

Form-data:
image: file`}
              </div>
            </div>
          </section>

          {/* TRANSFORM */}
          <section ref={sections.transform}>
            <div className={cardStyle}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />

              <h2 className="text-xl text-cyan-300">Transform API</h2>

              <div className="mt-4 bg-black/50 p-4 rounded-lg text-sm overflow-x-auto border border-white/10 hover:border-cyan-400/40 transition">
                {`POST /api/transform

{
  "imageId": "123",
  "action": "resize",
  "width": 300,
  "height": 300
}`}
              </div>
            </div>
          </section>

          {/* GALLERY */}
          <section ref={sections.gallery}>
            <div className={cardStyle}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl" />

              <h2 className="text-xl text-cyan-300">Gallery API</h2>

              <p className="text-white/60 mt-3">
                Fetch all user uploaded images.
              </p>

              <div className="mt-3 bg-black/40 p-4 rounded-lg border border-white/10 hover:border-cyan-400/40 transition">
                <code>GET /api/gallery</code>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Documentation;
