import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { Home, FileText, Image, Users, ImageIcon } from "lucide-react";

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-xl
        bg-[#070b13]/80
        border-b border-white/5
      "
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              w-9 h-9
              rounded-xl
              bg-cyan-500/5
              border border-cyan-500/15
              flex items-center justify-center
              transition-all duration-300
              group-hover:border-cyan-500/30
              group-hover:bg-cyan-500/10
            "
          >
            <ImageIcon size={18} className="text-cyan-300" />
          </div>

          <div className="text-xl font-semibold tracking-wide text-white">
            IMAGE
            <span className="text-cyan-300">SERVICE</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              text-white/60
              hover:text-cyan-200
              hover:bg-cyan-500/5
              transition-all duration-300
            "
          >
            <Home size={15} />
            Home
          </Link>

          <Link
            to="/docs"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              text-white/60
              hover:text-cyan-200
              hover:bg-cyan-500/5
              transition-all duration-300
            "
          >
            <FileText size={15} />
            Docs
          </Link>

          <Link
            to="/gallery"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              text-white/60
              hover:text-cyan-200
              hover:bg-cyan-500/5
              transition-all duration-300
            "
          >
            <Image size={15} />
            Gallery
          </Link>

          <Link
            to="/about"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              text-white/60
              hover:text-cyan-200
              hover:bg-cyan-500/5
              transition-all duration-300
            "
          >
            <Users size={15} />
            Connect
          </Link>

          {!user ? (
            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/login"
                className="
                  px-4 py-2
                  rounded-xl
                  bg-[#0f1722]
                  border border-white/5
                  text-white/70
                  hover:text-white
                  hover:border-cyan-500/20
                  hover:bg-cyan-500/5
                  transition-all duration-300
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  px-4 py-2
                  rounded-xl
                  bg-cyan-500/10
                  border border-cyan-500/20
                  text-cyan-300
                  font-medium
                  hover:bg-cyan-500/15
                  hover:border-cyan-500/30
                  transition-all duration-300
                "
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div
              className="
                flex items-center gap-2
                ml-4
                px-4 py-2
                rounded-xl
                bg-[#0f1722]
                border border-white/5
                text-white/80
                hover:border-cyan-500/20
                hover:bg-cyan-500/5
                cursor-pointer
                transition-all duration-300
              "
            >
              <FiUser />
              <span>Profile</span>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="
            md:hidden
            px-6
            pb-5
            pt-3
            bg-[#070b13]/95
            backdrop-blur-xl
            border-t border-white/5
          "
        >
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                text-white/70
                hover:bg-cyan-500/5
                hover:text-cyan-200
              "
            >
              <Home size={15} />
              Home
            </Link>

            <Link
              to="/docs"
              className="
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                text-white/70
                hover:bg-cyan-500/5
                hover:text-cyan-200
              "
            >
              <FileText size={15} />
              Docs
            </Link>

            <Link
              to="/gallery"
              className="
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                text-white/70
                hover:bg-cyan-500/5
                hover:text-cyan-200
              "
            >
              <Image size={15} />
              Gallery
            </Link>

            <Link
              to="/about"
              className="
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                text-white/70
                hover:bg-cyan-500/5
                hover:text-cyan-200
              "
            >
              <Users size={15} />
              Connect
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
