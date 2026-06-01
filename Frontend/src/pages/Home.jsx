import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  const user = null;

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">
      <Navbar user={user} />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[160px] opacity-30" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[160px] opacity-20" />
      </div>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <p className="text-indigo-400 tracking-widest text-xs uppercase">
            Developer Image API
          </p>

          <h1 className="text-5xl md:text-6xl font-semibold leading-tight mt-3">
            Image Processing
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Without Limits
            </span>
          </h1>

          <p className="mt-5 text-white/60 text-lg leading-relaxed">
            Upload, transform, optimize, and serve images at scale. Built for
            developers who want speed, control, and simplicity.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-600 shadow-[0_0_30px_#6366f1] transition"
            >
              Get Started
            </Link>

            <Link
              to="/docs"
              className="px-6 py-3 rounded-full border border-white/20 hover:border-cyan-400 transition"
            >
              View Docs
            </Link>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between text-xs text-white/50 mb-4">
              <span>Before</span>
              <span>After</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900" />
              <div className="h-44 rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20" />
            </div>

            <div className="mt-4 text-xs text-white/40">
              Live transformation preview
            </div>
          </div>

          {/* glow ring */}
          <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-3xl -z-10" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Lightning Fast",
            desc: "Optimized pipelines for instant image processing",
          },
          {
            title: "Developer API",
            desc: "Simple endpoints for real-world integration",
          },
          {
            title: "Secure Storage",
            desc: "Your images are encrypted and protected",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500 transition"
          >
            <h3 className="text-lg font-semibold text-white">{f.title}</h3>
            <p className="text-white/60 mt-2 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="relative text-center py-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold">
            Build your image backend like a product
          </h2>

          <p className="text-white/60 mt-3">
            Stop treating it like a project. Turn it into a service.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_40px_#6366f1] hover:scale-105 transition"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-white/30 text-sm border-t border-white/10">
        ImageService © 2026 — Built for developers
      </footer>
    </div>
  );
}
