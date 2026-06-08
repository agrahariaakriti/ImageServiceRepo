import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Upload, Wand2, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const user = null;

  const card =
    "relative rounded-2xl p-6 border border-white/5 bg-[#0b0f17] transition-all duration-300 hover:border-cyan-800/30 hover:shadow-[0_0_60px_rgba(34,211,238,0.08)]";

  return (
    <div className="min-h-screen bg-[#05070d] text-white overflow-x-hidden">
      <Navbar user={user} />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 blur-[180px] top-[-250px] left-[-250px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/5 blur-[180px] bottom-[-200px] right-[-200px]" />
      </div>

      {/* HERO */}
      <section className="relative max-w-5xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs mb-6">
            Developer Image API
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
            Image APIs
            <br />
            <span className="text-cyan-300">Built For Developers</span>
          </h1>

          <p className="mt-6 text-white/50 text-lg leading-relaxed max-w-2xl">
            Upload, transform, optimize and serve images through a clean API.
            Fast integration, simple workflows, and developer-friendly tooling.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="
                px-6 py-3 rounded-xl
                bg-cyan-500/10
                border border-cyan-500/20
                text-cyan-300
                hover:bg-cyan-500/15
                transition-all
              "
            >
              Get Started
            </Link>

            <Link
              to="/docs"
              className="
                px-6 py-3 rounded-xl
                bg-[#0b0f17]
                border border-white/10
                text-white/80
                hover:border-cyan-500/20
                hover:bg-cyan-500/5
                transition-all
              "
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* API PREVIEW */}
      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className={card}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/40 text-sm">Example Request</span>

            <span className="text-cyan-300 text-xs">POST /api/upload</span>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-white/60">
              {`curl -X POST https://api.imageservice.com/upload \\
-H "Authorization: Bearer API_KEY" \\
-F "image=@photo.jpg"`}
            </pre>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold">Everything You Need</h2>

          <p className="text-white/40 mt-2">
            Built for modern image workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className={card}>
            <Upload size={22} className="text-cyan-300" />

            <h3 className="mt-4 text-lg font-medium">Image Uploads</h3>

            <p className="mt-2 text-white/50 text-sm">
              Upload images securely with a simple API endpoint.
            </p>
          </div>

          <div className={card}>
            <Wand2 size={22} className="text-cyan-300" />

            <h3 className="mt-4 text-lg font-medium">Transformations</h3>

            <p className="mt-2 text-white/50 text-sm">
              Resize, crop, optimize and process images instantly.
            </p>
          </div>

          <div className={card}>
            <ShieldCheck size={22} className="text-cyan-300" />

            <h3 className="mt-4 text-lg font-medium">Secure Storage</h3>

            <p className="mt-2 text-white/50 text-sm">
              Reliable storage and secure access for your assets.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/5 bg-[#0b0f17] p-10 text-center">
          <h2 className="text-3xl font-semibold">Start Building Today</h2>

          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Integrate image uploads, transformations and delivery into your
            applications with minimal setup.
          </p>

          <Link
            to="/register"
            className="
              mt-8 inline-flex items-center gap-2
              px-6 py-3 rounded-xl
              bg-cyan-500/10
              border border-cyan-500/20
              text-cyan-300
              hover:bg-cyan-500/15
              transition-all
            "
          >
            Create Account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">
        ImageService © 2026 — Built for developers
      </footer>
    </div>
  );
}
