import Navbar from "../components/Navbar";
import { User, Mail, FolderGit2, ArrowUpRight, Target } from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

import { SiLeetcode } from "react-icons/si";
function Connect() {
  const card =
    "rounded-2xl border border-white/5 bg-[#0b0f17] transition-all duration-300 hover:border-cyan-800/30 hover:shadow-[0_0_60px_rgba(34,211,238,0.08)]";

  return (
    <div className="min-h-screen bg-[#05070d] text-white overflow-x-hidden">
      <Navbar user={null} />

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 blur-[180px] top-[-250px] left-[-250px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/5 blur-[180px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* HERO */}
        <section className={`${card} p-8 md:p-10`}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div
              className="
                w-28 h-28
                rounded-3xl
                bg-cyan-500/10
                border border-cyan-500/20
                flex items-center justify-center
              "
            >
              <User size={42} className="text-cyan-300" />
            </div>

            {/* Intro */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-cyan-300 text-sm mb-2">Software Developer</p>

              <h1 className="text-4xl font-semibold">Hey, I'm A.A 👋</h1>

              <p className="mt-4 text-white/50 leading-relaxed max-w-2xl">
                I enjoy building practical applications, exploring backend
                systems, and improving through projects and problem solving.
                This platform is one of those projects — a place to learn,
                experiment, and build better software.
              </p>

              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <a
                  href="#"
                  className="
                    px-5 py-3 rounded-xl
                    bg-cyan-500/10
                    border border-cyan-500/20
                    text-cyan-300
                    hover:bg-cyan-500/15
                    transition-all
                  "
                >
                  LinkedIn
                </a>

                <a
                  href="#"
                  className="
                    px-5 py-3 rounded-xl
                    bg-[#0a0f1a]
                    border border-white/5
                    text-white/80
                    hover:border-cyan-500/20
                    transition-all
                  "
                >
                  GitHub
                </a>

                <a
                  href="#"
                  className="
                    px-5 py-3 rounded-xl
                    bg-[#0a0f1a]
                    border border-white/5
                    text-white/80
                    hover:border-cyan-500/20
                    transition-all
                  "
                >
                  Resume
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT + FOCUS */}
        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className={`${card} p-7`}>
            <h2 className="text-xl font-semibold mb-4">About Me</h2>

            <p className="text-white/50 leading-relaxed">
              I enjoy creating applications that solve real problems and help me
              understand how modern software systems work behind the scenes.
            </p>
          </div>

          <div className={`${card} p-7`}>
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} className="text-cyan-300" />

              <h2 className="text-xl font-semibold">Current Focus</h2>
            </div>

            <div className="space-y-3 text-white/60">
              <p>• Backend Development</p>
              <p>• Full Stack Projects</p>
              <p>• Data Structures & Algorithms</p>
              <p>• System Design Fundamentals</p>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold mb-6">Featured Projects</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {["ImageService", "Expense Tracker", "Task Manager"].map(
              (project) => (
                <div
                  key={project}
                  className={`${card} p-6 hover:-translate-y-2`}
                >
                  <FolderGit2 size={22} className="text-cyan-300" />

                  <h3 className="mt-4 text-lg font-medium">{project}</h3>

                  <p className="mt-2 text-sm text-white/50">
                    Personal project focused on learning architecture, APIs and
                    real-world development.
                  </p>

                  <button
                    className="
                    mt-5
                    flex items-center gap-2
                    text-cyan-300
                    text-sm
                  "
                  >
                    View Project
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              ),
            )}
          </div>
        </section>

        {/* CONNECT */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold mb-6">Connect With Me</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: FaLinkedin,
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/aakriti-agrahari/",
              },
              {
                icon: FaGithub,
                label: "GitHub",
                href: "https://github.com/agrahariaakriti",
              },
              {
                icon: SiLeetcode,
                label: "LeetCode",
                href: "https://leetcode.com/u/aakriti_agrahari1/",
              },
              {
                icon: Mail,
                label: "Email",
                href: "mailto:agrahariaakriti1@gmail.com",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${card} p-5 text-center cursor-pointer hover:-translate-y-1`}
                >
                  <Icon size={22} className="mx-auto text-cyan-300" />

                  <p className="mt-3 text-white/80">{item.label}</p>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Connect;
