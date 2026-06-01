import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Data:", form);
    // connect API here later
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] text-white px-4">
      {/* glow background */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[120px] bottom-[-150px] right-[-150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <p className="text-center text-white/50 text-sm mt-2">
          Join ImageService
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 text-black font-medium rounded-lg hover:scale-[1.02] transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-white/50 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
export default Register;
