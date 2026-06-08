import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import Navbar from "../components/Navbar";

function Login() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white overflow-hidden flex items-center justify-center px-6">
      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar user={null} />
      </div>
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[450px] h-[450px] bg-cyan-500/5 blur-[180px] top-[-200px] left-[-200px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/5 blur-[180px] bottom-[-200px] right-[-200px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          border border-white/5
          bg-[#0b0f17]
          p-8
          shadow-[0_0_80px_rgba(34,211,238,0.04)]
        "
      >
        {/* Header */}
        <div className="flex justify-center">
          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-cyan-500/10
              border border-cyan-500/20
              flex items-center justify-center
            "
          >
            <LogIn size={24} className="text-cyan-300" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center mt-5">
          Welcome Back
        </h1>

        <p className="text-center text-white/40 text-sm mt-2">
          Login to continue using ImageService
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              name="identifier"
              placeholder="Username or Email"
              value={form.identifier}
              onChange={handleChange}
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-xl
                bg-[#0a0f1a]
                border border-white/5
                text-white
                placeholder:text-white/30
                focus:border-cyan-500/20
                focus:outline-none
                transition-all
              "
            />
          </div>

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-xl
                bg-[#0a0f1a]
                border border-white/5
                text-white
                placeholder:text-white/30
                focus:border-cyan-500/20
                focus:outline-none
                transition-all
              "
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="
                text-sm
                text-white/40
                hover:text-cyan-300
                transition-colors
              "
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              bg-cyan-500/10
              border border-cyan-500/20
              text-cyan-300
              font-medium
              hover:bg-cyan-500/15
              hover:border-cyan-500/30
              transition-all
            "
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/40">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
              text-cyan-300
              hover:text-cyan-200
              transition-colors
            "
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
