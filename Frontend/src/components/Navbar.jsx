import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <div className="text-white font-bold tracking-wide text-2xl flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]"></span>
          ImageService
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link className="hover:text-white transition" to="/">
            Home
          </Link>
          <Link className="hover:text-white transition" to="/docs">
            Docs
          </Link>
          <Link className="hover:text-white transition" to="/gallery">
            Gallery
          </Link>
          <Link className="hover:text-white transition" to="/about">
            Connect
          </Link>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-cyan-500 text-black font-medium hover:shadow-[0_0_20px_#22d3ee]"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative group cursor-pointer">
              <FiUser size={18} />

              <div className="absolute right-0 mt-3 hidden group-hover:block bg-black/90 border border-white/10 rounded-xl p-2 w-32">
                <button className="w-full text-left px-3 py-2 hover:bg-white/10 rounded">
                  Profile
                </button>
                <button className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/10 rounded">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </div>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-gray-300">
          <Link to="/">Home</Link>
          <Link to="/docs">Docs</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">Connect</Link>
        </div>
      )}
    </nav>
  );
}
