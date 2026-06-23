import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { Upload } from "lucide-react";
import { Home, FileText, Image, Users, ImageIcon } from "lucide-react";
import { api } from "../stores/api.service.js";

export default function Navbar({ user, setUser, onLogout, setOnLogOut }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnLogout = async (e) => {
    e.preventDefault();

    try {
      await api.get("/users/logout");

      setUser(null);
      setOnLogOut(true);
      if (onLogout) {
        onLogout();
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/documentation", label: "Docs", icon: FileText },
    { to: "/gallery", label: "Gallery", icon: Image },
    { to: "/uploadImage", label: "Upload", icon: Upload },
    { to: "/about", label: "Connect", icon: Users },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = isActive(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={`relative flex items-center gap-2.5 px-4 ${
              mobile ? "py-3.5" : "py-2.5"
            } rounded-xl text-sm font-medium transition-all duration-300 ${
              active
                ? "text-white"
                : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]"
            }`}
            style={
              active
                ? {
                    background:
                      "linear-gradient(120deg, rgba(129,140,248,0.22) 0%, rgba(192,132,252,0.22) 50%, rgba(232,121,249,0.18) 100%)",
                    boxShadow:
                      "0 0 0 1px rgba(192,132,252,0.35) inset, 0 4px 18px rgba(168,85,247,0.18)",
                  }
                : undefined
            }
          >
            <Icon size={15} className={active ? "text-fuchsia-200" : ""} />
            <span>{label}</span>
          </Link>
        );
      })}
    </>
  );

  const AuthButtons = ({ mobile = false }) =>
    !user ? (
      <div
        className={`flex ${mobile ? "flex-col" : "items-center"} ${
          mobile ? "gap-3 mt-2" : "gap-3 ml-6"
        }`}
      >
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className={`${mobile ? "text-center" : ""} px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-white hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300 text-sm font-medium`}
        >
          Login
        </Link>
        <Link
          to="/register"
          onClick={() => setOpen(false)}
          className={`${mobile ? "text-center" : ""} px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300`}
          style={{
            background:
              "linear-gradient(120deg, #818cf8 0%, #c084fc 55%, #e879f9 100%)",
            boxShadow: "0 4px 20px rgba(192,132,252,0.3)",
          }}
        >
          Get Started
        </Link>
      </div>
    ) : mobile ? (
      /* ── Mobile: inline user card ── */
      <div className="mt-5 border-t border-white/[0.06] pt-5">
        <div
          className="p-4 rounded-xl border"
          style={{
            background: "rgba(192,132,252,0.05)",
            borderColor: "rgba(192,132,252,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(129,140,248,0.25), rgba(232,121,249,0.25))",
                borderColor: "rgba(192,132,252,0.3)",
              }}
            >
              <FiUser className="text-fuchsia-200" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {user?.user?.fullname || "User"}
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                {user?.user?.email || "No Email"}
              </p>
            </div>
          </div>
          <button
            className="mt-4 w-full py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 text-sm font-medium"
            type="button"
            onClick={(e) => {
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
      <div className="relative ml-6">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-white/80 transition-all duration-300 text-sm font-medium"
          style={{
            background: profileOpen
              ? "rgba(192,132,252,0.1)"
              : "rgba(255,255,255,0.03)",
            borderColor: profileOpen
              ? "rgba(192,132,252,0.35)"
              : "rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center border"
            style={{
              background:
                "linear-gradient(135deg, rgba(129,140,248,0.3), rgba(232,121,249,0.3))",
              borderColor: "rgba(192,132,252,0.35)",
            }}
          >
            <FiUser size={12} className="text-fuchsia-200" />
          </div>
          <span>{user?.user?.fullname || "Profile"}</span>
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
            <div
              className="fixed inset-0 z-40"
              onClick={() => setProfileOpen(false)}
            />

            <div
              className="absolute right-0 top-14 w-64 rounded-xl overflow-hidden shadow-2xl z-50 border"
              style={{
                background: "#0c0814",
                borderColor: "rgba(192,132,252,0.15)",
              }}
            >
              <div
                className="p-4 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(129,140,248,0.3), rgba(232,121,249,0.3))",
                      borderColor: "rgba(192,132,252,0.35)",
                    }}
                  >
                    <FiUser className="text-fuchsia-200" />
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
                onClick={(e) => handleOnLogout(e)}
                className="w-full text-left px-4 py-3.5 text-red-400 hover:bg-red-500/10 transition-all duration-200 flex items-center gap-2.5 text-sm font-medium"
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
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b"
      style={{
        background: "rgba(7,8,16,0.85)",
        borderColor: "rgba(192,132,252,0.08)",
      }}
    >
      <style>{`
        @keyframes navPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(232,121,249,0.5); }
          50% { opacity: 0.55; box-shadow: 0 0 0 4px rgba(232,121,249,0); }
        }
        .nav-live-dot { animation: navPulse 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .nav-live-dot { animation: none; }
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-[72px] flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, rgba(129,140,248,0.12), rgba(232,121,249,0.12))",
              borderColor: "rgba(192,132,252,0.25)",
            }}
          >
            <ImageIcon size={18} className="text-fuchsia-200" />
            <span
              className="nav-live-dot absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
              style={{ background: "#e879f9" }}
            />
          </div>
          <div className="text-xl font-semibold tracking-wide text-white">
            IMAGE
            <span
              style={{
                background:
                  "linear-gradient(120deg, #818cf8, #c084fc, #e879f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SERVICE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1.5">
          <NavLinks />
          <AuthButtons />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu — only shows when open */}
      {open && (
        <div
          className="md:hidden px-6 pb-6 pt-4 backdrop-blur-xl border-t"
          style={{
            background: "rgba(7,8,16,0.97)",
            borderColor: "rgba(192,132,252,0.08)",
          }}
        >
          <div className="flex flex-col gap-1.5">
            <NavLinks mobile />
          </div>
          <AuthButtons mobile />
        </div>
      )}
    </nav>
  );
}
