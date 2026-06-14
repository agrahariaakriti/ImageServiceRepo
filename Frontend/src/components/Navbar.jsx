import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Home, FileText, Image, Users, ImageIcon } from "lucide-react";
import { api } from "../stores/api.service.js";
export default function Navbar({ user, onLogout, setUser }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  console.log(user);
  const handleOnLogout = async (e) => {
    e.preventDefault();

    try {
      await api.get("/users/logout");

      setUser(null);

      if (onLogout) {
        onLogout();
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const NavLinks = ({ mobile = false }) => (
    <>
      <Link
        to="/"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2 px-4 ${mobile ? "py-3" : "py-2"} rounded-xl text-white/60 hover:text-cyan-200 hover:bg-cyan-500/5 transition-all duration-300`}
      >
        <Home size={15} />
        Home
      </Link>
      <Link
        to="/documentation"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2 px-4 ${mobile ? "py-3" : "py-2"} rounded-xl text-white/60 hover:text-cyan-200 hover:bg-cyan-500/5 transition-all duration-300`}
      >
        <FileText size={15} />
        Docs
      </Link>
      <Link
        to="/gallery"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2 px-4 ${mobile ? "py-3" : "py-2"} rounded-xl text-white/60 hover:text-cyan-200 hover:bg-cyan-500/5 transition-all duration-300`}
      >
        <Image size={15} />
        Gallery
      </Link>
      <Link
        to="/uploadImage"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2 px-4 ${mobile ? "py-3" : "py-2"} rounded-xl text-white/60 hover:text-cyan-200 hover:bg-cyan-500/5 transition-all duration-300`}
      >
        <Upload size={15} />
        Upload
      </Link>
      <Link
        to="/about"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2 px-4 ${mobile ? "py-3" : "py-2"} rounded-xl text-white/60 hover:text-cyan-200 hover:bg-cyan-500/5 transition-all duration-300`}
      >
        <Users size={15} />
        Connect
      </Link>
    </>
  );

  const AuthButtons = ({ mobile = false }) =>
    !user ? (
      <div
        className={`flex ${mobile ? "flex-col" : "items-center"} gap-3 ${mobile ? "" : "ml-4"}`}
      >
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className={`${mobile ? "text-center" : ""} px-4 py-2 rounded-xl bg-[#0f1722] border border-white/5 text-white/70 hover:text-white transition-all duration-300`}
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={() => setOpen(false)}
          className={`${mobile ? "text-center" : ""} px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300`}
        >
          Get Started
        </Link>
      </div>
    ) : mobile ? (
      /* ── Mobile: inline user card ── */
      <div className="mt-4 border-t border-white/5 pt-4">
        <div className="p-4 rounded-xl bg-[#0f1722] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FiUser className="text-cyan-300" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {user?.user?.fullname || "User"}
              </p>
              <p className="text-white/40 text-xs">
                {user?.user?.email || "No Email"}
              </p>
            </div>
          </div>
          <button
            className="mt-4 w-full py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
            type="button"
            onClick={(e) => {
              console.log("kljsghdasgvd");
              onLogout?.();
              setOpen(false);
              return handleOnLogout(e);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    ) : (
      /* ── Desktop: profile dropdown ── */
      <div className="relative ml-4">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f1722] border border-white/5 text-white/80 hover:border-white/10 transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FiUser size={12} className="text-cyan-300" />
          </div>
          <span>{user?.user?.fullname || "Profile"}</span>
          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-white/40 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {profileOpen && (
          <>
            {/* Backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setProfileOpen(false)}
            />

            <div className="absolute right-0 top-12 w-64 rounded-xl bg-[#0f1722] border border-white/5 overflow-hidden shadow-2xl z-50">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <FiUser className="text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {user?.user?.fullname || "User"}
                    </p>
                    <p className="text-sm text-white/40 mt-0.5">
                      {user?.user?.email || "No Email"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  console.log("Hyy in the logout button 🤧");

                  // onLogout?.();
                  // setProfileOpen(false);
                  return handleOnLogout(e);
                }}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#070b13]/80 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/5 border border-cyan-500/15 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10">
            <ImageIcon size={18} className="text-cyan-300" />
          </div>
          <div className="text-xl font-semibold tracking-wide text-white">
            IMAGE<span className="text-cyan-300">SERVICE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLinks />
          <AuthButtons />
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu — only shows when open */}
      {open && (
        <div className="md:hidden px-6 pb-5 pt-3 bg-[#070b13]/95 backdrop-blur-xl border-t border-white/5">
          <div className="flex flex-col gap-2">
            <NavLinks mobile />
          </div>
          <AuthButtons mobile />
        </div>
      )}
    </nav>
  );
}
