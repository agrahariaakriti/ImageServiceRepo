import { api } from "../stores/api.service.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

function Register() {
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.username.trim() ||
      !form.fullname.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/signup", form);

      console.log("Success:", response.data);

      navigate("/login");
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", type: "text", placeholder: "Username", icon: AtSign },
    { name: "fullname", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email Address", icon: Mail },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
    },
  ];

  return (
    <div className="reg-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .reg-root {
          min-height: 100vh;
          background: #04060c;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 24px 48px;
        }

        /* ── grid bg ── */
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .orb { position: fixed; pointer-events: none; border-radius: 50%; filter: blur(130px); z-index: 0; }
        .orb-1 { width: 600px; height: 600px; background: rgba(14,165,233,0.08); top: -250px; left: -200px; }
        .orb-2 { width: 500px; height: 500px; background: rgba(99,102,241,0.06); bottom: -200px; right: -150px; }
        /* subtle pink orb */
        .orb-3 { width: 400px; height: 400px; background: rgba(236,72,153,0.06); top: 30%; right: -100px; }

        /* ── card ── */
        .reg-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
        }

        /* top accent line — now includes a pink stop */
        .card-inner {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }
        .card-inner::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(236,72,153,0.4), rgba(129,140,248,0.35), transparent);
        }

        /* ── header ── */
        .card-header {
          padding: 32px 32px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          text-align: center;
        }

        .icon-wrap {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: rgba(236,72,153,0.08);
          border: 1px solid rgba(236,72,153,0.22);
          display: flex; align-items: center; justify-content: center;
          color: #f472b6;
          margin: 0 auto 18px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 5px;
        }

        .card-sub {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: rgba(232,234,240,0.35);
          letter-spacing: 0.04em;
        }

        /* ── form body ── */
        .card-body { padding: 24px 32px 28px; }

        .fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }

        /* ── field ── */
        .field-wrap {
          position: relative;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: #030508;
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .field-wrap::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, #38bdf8, #f472b6);
          transform: scaleY(0);
          transition: transform 0.2s;
          border-radius: 2px 0 0 2px;
        }
        .field-wrap.is-focused {
          border-color: rgba(244,114,182,0.28);
          box-shadow: 0 0 0 3px rgba(244,114,182,0.06);
        }
        .field-wrap.is-focused::before { transform: scaleY(1); }
        .field-wrap.has-value { border-color: rgba(244,114,182,0.14); }

        /* password field needs room for the eye toggle */
        .field-wrap.has-toggle .field-input {
          padding-right: 40px;
        }

        .field-icon {
          position: absolute;
          left: 13px; top: 50%; transform: translateY(-50%);
          color: rgba(232,234,240,0.25);
          transition: color 0.2s;
          pointer-events: none;
          display: flex; align-items: center;
        }
        .field-wrap.is-focused .field-icon { color: #f472b6; }

        .field-input {
          width: 100%;
          padding: 12px 14px 12px 38px;
          background: transparent;
          border: none;
          outline: none;
          color: #e8eaf0;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.02em;
        }
        .field-input::placeholder {
          color: rgba(232,234,240,0.2);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
        }
        .field-input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #030508 inset;
          -webkit-text-fill-color: #e8eaf0;
        }

        /* ── password toggle btn ── */
        .toggle-btn {
          position: absolute;
          right: 11px; top: 50%; transform: translateY(-50%);
          background: none;
          border: none;
          padding: 3px;
          cursor: pointer;
          color: rgba(232,234,240,0.25);
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
          border-radius: 4px;
        }
        .toggle-btn:hover { color: #f472b6; }
        .field-wrap.is-focused .toggle-btn { color: rgba(232,234,240,0.45); }
        .field-wrap.is-focused .toggle-btn:hover { color: #f472b6; }

        /* ── row labels ── */
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* ── submit btn — pink-tinted gradient ── */
        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(236,72,153,0.1), rgba(129,140,248,0.08));
          border: 1px solid rgba(236,72,153,0.28);
          color: #f9a8d4;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(56,189,248,0.06), rgba(236,72,153,0.08));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .submit-btn:hover {
          border-color: rgba(236,72,153,0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(236,72,153,0.12);
        }
        .submit-btn:hover::after { opacity: 1; }
        .submit-btn:active { transform: translateY(0); }

        /* ── footer ── */
        .card-footer {
          padding: 16px 32px 20px;
          border-top: 1px solid rgba(255,255,255,0.04);
          text-align: center;
        }
        .footer-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: rgba(232,234,240,0.3);
          letter-spacing: 0.03em;
        }
        .footer-link {
          color: #f472b6;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #fbcfe8; }

        /* ── divider ── */
        .or-row {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 14px;
        }
        .or-line { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }
        .or-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(232,234,240,0.2);
          letter-spacing: 0.1em;
        }

        /* ── perks strip ── */
        .perks {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        .perk {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: rgba(232,234,240,0.3);
          letter-spacing: 0.05em;
          display: flex; align-items: center; gap: 5px;
        }
        .perk-dot { width: 4px; height: 4px; border-radius: 50%; background: #f472b6; opacity: 0.6; }
      `}</style>

      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar user={null} />

      <motion.div
        className="reg-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="card-inner">
          {/* ── HEADER ── */}
          <div className="card-header">
            <div className="icon-wrap">
              <UserPlus size={18} />
            </div>
            <h1 className="card-title">Create Account</h1>
            <p className="card-sub">Join ImageService and start building</p>
          </div>

          {error && (
            <div
              style={{
                margin: "0 32px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
                fontSize: "13px",
                textAlign: "center",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {error}
            </div>
          )}

          {/* ── FORM ── */}
          <div className="card-body">
            {/* perks */}
            <div className="perks">
              {["Free forever", "No card needed", "API access"].map((p) => (
                <span key={p} className="perk">
                  <span className="perk-dot" />
                  {p}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fields">
                {/* username + name on same row */}
                <div className="field-row">
                  {fields
                    .slice(0, 2)
                    .map(({ name, type, placeholder, icon: Icon }) => (
                      <div
                        key={name}
                        className={`field-wrap ${focused === name ? "is-focused" : ""} ${form[name] ? "has-value" : ""}`}
                      >
                        <span className="field-icon">
                          <Icon size={13} />
                        </span>
                        <input
                          className="field-input"
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          value={form[name]}
                          onChange={handleChange}
                          onFocus={() => setFocused(name)}
                          onBlur={() => setFocused("")}
                          autoComplete="off"
                        />
                      </div>
                    ))}
                </div>

                {/* email — full width */}
                {(() => {
                  const { name, type, placeholder, icon: Icon } = fields[2];
                  return (
                    <div
                      key={name}
                      className={`field-wrap ${focused === name ? "is-focused" : ""} ${form[name] ? "has-value" : ""}`}
                    >
                      <span className="field-icon">
                        <Icon size={13} />
                      </span>
                      <input
                        className="field-input"
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={handleChange}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused("")}
                        autoComplete="off"
                      />
                    </div>
                  );
                })()}

                {/* password — full width with toggle */}
                {(() => {
                  const { name, placeholder, icon: Icon } = fields[3];
                  return (
                    <div
                      key={name}
                      className={`field-wrap has-toggle ${focused === name ? "is-focused" : ""} ${form[name] ? "has-value" : ""}`}
                    >
                      <span className="field-icon">
                        <Icon size={13} />
                      </span>
                      <input
                        className="field-input"
                        type={showPassword ? "text" : "password"}
                        name={name}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={handleChange}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused("")}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── FOOTER ── */}
          <div className="card-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/login" className="footer-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
