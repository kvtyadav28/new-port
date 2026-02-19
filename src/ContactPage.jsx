import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ============================================================
   CONTACT PAGE — kavit.site/contact
   Matches main portfolio: #080808 · #CAFF33 · Bebas Neue + Syne
   ============================================================ */

const ease = [0.16, 1, 0.3, 1];

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black:   #080808;
      --white:   #F5F5F0;
      --lime:    #CAFF33;
      --dim:     #888880;
      --line:    #1E1E1E;
      --surface: #101010;
      --red:     #FF3B3B;
      --f-display: 'Bebas Neue', 'Arial Black', sans-serif;
      --f-body:    'Syne', sans-serif;
      --pad: clamp(20px, 5vw, 80px);
    }

    html { background: var(--black); }

    body {
      background: var(--black);
      color: var(--white);
      font-family: var(--f-body);
      font-size: 16px;
      font-weight: 400;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::selection { background: var(--lime); color: var(--black); }
    a { color: inherit; text-decoration: none; }

    /* Grain */
    body::after {
      content: '';
      position: fixed; inset: 0;
      z-index: 9000; pointer-events: none; opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--lime); }

    /* ── Form elements reset ── */
    input, textarea, select, button {
      font-family: var(--f-body);
      font-size: 16px;
      outline: none;
      border: none;
      background: none;
    }

    /* ── Field base ── */
    .field-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .field-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--dim);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .field-label .req {
      color: var(--lime);
      font-size: 14px;
      line-height: 1;
    }

    .field-input {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--line);
      color: var(--white);
      font-family: var(--f-body);
      font-size: 16px;
      font-weight: 500;
      padding: 16px 20px;
      transition: border-color 0.2s ease, background 0.2s ease;
      appearance: none;
      -webkit-appearance: none;
    }

    .field-input:focus {
      border-color: var(--lime);
      background: #0E0E0E;
    }

    .field-input.error {
      border-color: var(--red);
    }

    .field-input::placeholder {
      color: #333;
      font-weight: 400;
    }

    textarea.field-input {
      resize: none;
      min-height: 160px;
      line-height: 1.65;
    }

    .field-error {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--red);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ── Submit button ── */
    .submit-btn {
      width: 100%;
      font-family: var(--f-display);
      font-size: clamp(24px, 4vw, 40px);
      letter-spacing: 0.06em;
      color: var(--black);
      background: var(--lime);
      padding: 20px 32px;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      transition: background 0.2s, transform 0.2s, gap 0.25s;
      position: relative;
      overflow: hidden;
    }

    .submit-btn:hover:not(:disabled) {
      background: var(--white);
      transform: translateY(-2px);
      gap: 24px;
    }

    .submit-btn:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .submit-btn.sending {
      background: #BFBDB6;
    }

    .submit-btn.sent {
      background: var(--lime);
    }

    .submit-btn.failed {
      background: var(--red);
      color: var(--white);
    }

    /* ── Back link ── */
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--dim);
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--lime); }
    .back-link svg { transition: transform 0.2s; }
    .back-link:hover svg { transform: translateX(-4px); }
  `}</style>
);

/* ── Field component ── */
function Field({ id, label, type = "text", placeholder, value, onChange, error, required, rows }) {
  const isTextarea = type === "textarea";
  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={id}>
        {label}
        {required && <span className="req" aria-label="required">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          className={`field-input${error ? " error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows || 6}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={`field-input${error ? " error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          required={required}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            className="field-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <span aria-hidden="true">✕</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Success screen ── */
function SuccessScreen({ name }) {
  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "var(--black)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "clamp(24px,5vw,80px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Lime check block */}
      <motion.div
        style={{
          width: "clamp(64px,10vw,100px)",
          height: "clamp(64px,10vw,100px)",
          background: "var(--lime)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "32px",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M7 18L15 26L29 10" stroke="#080808" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      <div style={{ overflow: "hidden" }}>
        <motion.h2
          style={{
            fontFamily: "var(--f-display)",
            fontSize: "clamp(52px,10vw,120px)",
            letterSpacing: "0.04em",
            lineHeight: 0.9,
            color: "var(--white)",
          }}
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          MESSAGE
        </motion.h2>
      </div>
      <div style={{ overflow: "hidden" }}>
        <motion.h2
          style={{
            fontFamily: "var(--f-display)",
            fontSize: "clamp(52px,10vw,120px)",
            letterSpacing: "0.04em",
            lineHeight: 0.9,
            color: "var(--lime)",
          }}
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.7, delay: 0.32, ease }}
        >
          SENT.
        </motion.h2>
      </div>

      <motion.p
        style={{
          fontFamily: "var(--f-body)",
          fontSize: "16px",
          color: "var(--dim)",
          marginTop: "28px",
          maxWidth: "360px",
          lineHeight: 1.7,
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease }}
      >
        Got it{name ? `, ${name}` : ""}. I'll be back within a day.
      </motion.p>

      <motion.a
        href="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: "12px",
          marginTop: "40px",
          fontFamily: "var(--f-body)",
          fontSize: "11px", fontWeight: 700,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--black)", background: "var(--lime)",
          padding: "14px 28px",
          transition: "background 0.2s",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        ← Back to Portfolio
      </motion.a>
    </motion.div>
  );
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", budget: "", message: ""
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const [submitted, setSubmitted] = useState(false);

  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-5% 0px" });

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  /* Validation */
  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = "Name is required";
    if (!form.email.trim())
      e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.message.trim())
      e.message = "Tell me what you need";
    else if (form.message.trim().length < 20)
      e.message = "Please give a bit more detail (20+ chars)";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Scroll to first error
      const firstErrEl = document.querySelector(".field-input.error");
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/mbdakbze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("sent");
        setSubmitted(true);
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("failed");
    }
  };

  const btnLabel = {
    idle:    "SEND MESSAGE",
    sending: "SENDING...",
    sent:    "SENT ✓",
    failed:  "FAILED — TRY AGAIN",
  }[status];

  if (submitted) return (
    <>
      <GlobalStyles />
      <SuccessScreen name={form.name.split(" ")[0]} />
    </>
  );

  return (
    <>
      <GlobalStyles />

      {/* ── NAV ── */}
      <motion.header
        style={{
          position: "sticky", top: 0, zIndex: 500,
          padding: "18px var(--pad)",
          background: "rgba(8,8,8,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--line)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit", transition: "color 0.2s" }} aria-label="Back to portfolio"
            onMouseEnter={e => e.currentTarget.style.color = "var(--lime)"}
            onMouseLeave={e => e.currentTarget.style.color = "inherit"}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 3L5 9L11 15" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </a>
          <img src="/Logo.png" alt="Kavit Yadav" style={{ height: "auto", width: "100px" }} />
        </div>

        

        
      </motion.header>

      {/* ── MAIN ── */}
      <main>
        {/* ── Hero strip ── */}
        <section style={{
          padding: "clamp(60px,10vw,120px) var(--pad) clamp(40px,6vw,72px)",
          borderBottom: "1px solid var(--line)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Ghost background text */}
          <div aria-hidden="true" style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--f-display)",
            fontSize: "clamp(100px,22vw,300px)",
            color: "#111", letterSpacing: "0.02em",
            whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none",
            lineHeight: 1,
          }}>CONTACT</div>

          <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <motion.span
              style={{
                fontFamily: "var(--f-body)",
                fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--lime)",
                display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "24px",
              }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span style={{ display: "block", width: "28px", height: "2px", background: "var(--lime)", flexShrink: 0 }} />
              Get In Touch
            </motion.span>

            <div ref={titleRef}>
              {["LET'S", "WORK", "TOGETHER."].map((word, i) => (
                <div key={word} style={{ overflow: "hidden", lineHeight: 0.88 }}>
                  <motion.h1
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: "clamp(64px,14vw,180px)",
                      letterSpacing: "0.02em",
                      color: i === 2 ? "var(--lime)" : "var(--white)",
                      display: "block",
                    }}
                    initial={{ y: "108%" }}
                    animate={{ y: titleInView ? "0%" : "108%" }}
                    transition={{ duration: 0.85, delay: i * 0.11, ease }}
                  >
                    {word}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Info row */}
            <motion.div
              style={{
                display: "flex", flexWrap: "wrap", gap: "32px",
                marginTop: "clamp(32px,4vw,56px)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: titleInView ? 1 : 0, y: titleInView ? 0 : 16 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {[
                { label: "Response time", val: "Within 24 hours" },
                { label: "Open to",       val: "Freelance · Remote" },
                { label: "Location",      val: "India" },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p style={{
                    fontFamily: "var(--f-body)",
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--dim)", marginBottom: "4px",
                  }}>{label}</p>
                  <p style={{
                    fontFamily: "var(--f-body)",
                    fontSize: "14px", fontWeight: 600,
                    color: "var(--white)",
                  }}>{val}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Form + sidebar ── */}
        <section style={{
          padding: "clamp(60px,8vw,120px) var(--pad)",
          maxWidth: "1280px", margin: "0 auto",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(48px,6vw,80px)",
          }}>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              style={{ display: "flex", flexDirection: "column", gap: "28px" }}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              {/* Row: Name + Email */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                gap: "20px",
              }}>
                <Field
                  id="name" label="Your Name" required
                  placeholder="John Doe"
                  value={form.name} onChange={set("name")} error={errors.name}
                />
                <Field
                  id="email" label="Email Address" type="email" required
                  placeholder="johndoe@studio.com"
                  value={form.email} onChange={set("email")} error={errors.email}
                />
              </div>

              {/* Row: Subject + Budget */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                gap: "20px",
              }}>
                <Field
                  id="subject" label="Subject"
                  placeholder="Website redesign / Freelance project"
                  value={form.subject} onChange={set("subject")} error={errors.subject}
                />
                {/* Budget select — custom styled - removed */}
                
              </div>

              {/* Message */}
              <Field
                id="message" label="Your Message" type="textarea" required
                placeholder="Tell me what you're building, what you need, and any relevant details..."
                value={form.message} onChange={set("message")} error={errors.message}
                rows={7}
              />

              {/* Character count */}
              <div style={{
                fontFamily: "var(--f-body)",
                fontSize: "10px", fontWeight: 600,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: form.message.length >= 20 ? "var(--lime)" : "var(--dim)",
                textAlign: "right",
                marginTop: "-16px",
                transition: "color 0.3s",
              }}>
                {form.message.length} chars {form.message.length >= 20 ? "✓" : `— ${20 - form.message.length} more to go`}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "var(--line)" }} />

              {/* Submit */}
              <button
                type="submit"
                className={`submit-btn${status !== "idle" ? ` ${status}` : ""}`}
                disabled={status === "sending" || status === "sent"}
                aria-label="Submit contact form"
              >
                <span>{btnLabel}</span>
                {status === "idle" && (
                  <span aria-hidden="true" style={{ fontSize: "0.7em" }}>↗</span>
                )}
                {status === "sending" && (
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ display: "inline-block", fontSize: "0.65em" }}
                  >⟳</motion.span>
                )}
              </button>

              <p style={{
                fontFamily: "var(--f-body)",
                fontSize: "11px", fontWeight: 500,
                letterSpacing: "0.08em",
                color: "var(--dim)", textAlign: "center",
              }}>
                * Required fields.
              </p>
            </motion.form>

            {/* Sidebar */}
            <motion.aside
              aria-label="Direct contact information"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              style={{ display: "flex", flexDirection: "column", gap: "0" }}
            >
              {/* Section label */}
              <p style={{
                fontFamily: "var(--f-body)",
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--dim)",
                marginBottom: "24px",
              }}>Or reach directly</p>

              {/* Direct contacts */}
              {[
                {
                  label: "Email",
                  val: "ykavit38@gmail.com",
                  href: "mailto:ykavit38@gmail.com",
                  sub: "Preferred — fastest response",
                },
                {
                  label: "Phone",
                  val: "+91 9510605053",
                  href: "tel:+919510605053",
                  sub: "Calls & WhatsApp",
                },
              ].map(({ label, val, href, sub }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    display: "block",
                    padding: "24px 0",
                    borderBottom: "1px solid var(--line)",
                    borderTop: "none",
                    transition: "background 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(202,255,51,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{
                    fontFamily: "var(--f-body)",
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "var(--lime)", display: "block", marginBottom: "6px",
                  }}>{label}</span>
                  <span style={{
                    fontFamily: "var(--f-body)",
                    fontSize: "16px", fontWeight: 600,
                    color: "var(--white)", display: "block",
                    marginBottom: "4px",
                  }}>{val}</span>
                  <span style={{
                    fontFamily: "var(--f-body)",
                    fontSize: "12px", color: "var(--dim)",
                  }}>{sub}</span>
                </a>
              ))}

              {/* What to expect */}
              <div style={{
                marginTop: "40px",
                padding: "28px",
                border: "1px solid var(--line)",
                background: "var(--surface)",
              }}>
                <p style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "22px", letterSpacing: "0.04em",
                  color: "var(--white)", marginBottom: "16px",
                }}>WHAT TO EXPECT</p>
                {[
                  "I read every message in full",
                  "I reply within 24 hours",
                  "No automated responses",
                  "Straight answers, no sales pitch",
                ].map((item, i) => (
                  <div key={item} style={{
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "10px 0",
                    borderBottom: i < 3 ? "1px solid var(--line)" : "none",
                  }}>
                    <span style={{
                      color: "var(--lime)", fontSize: "14px",
                      fontWeight: 700, flexShrink: 0, marginTop: "1px",
                    }}>→</span>
                    <span style={{
                      fontFamily: "var(--f-body)",
                      fontSize: "13px", color: "var(--dim)",
                      fontWeight: 500, lineHeight: 1.5,
                    }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Availability badge */}
              
            </motion.aside>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--line)",
        padding: "24px var(--pad)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
      }}>
        
        <span style={{
          fontFamily: "var(--f-body)",
          fontSize: "10px", fontWeight: 600,
          letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dim)",
        }}>Kavit Yadav © 2026</span>

        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <a href="https://github.com/kvtyadav28" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: "var(--dim)", transition: "color 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={e => e.currentTarget.style.color = "var(--lime)"} onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V21"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/kavit-yadav/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: "var(--dim)", transition: "color 0.2s", display: "flex", alignItems: "center" }} onMouseEnter={e => e.currentTarget.style.color = "var(--lime)"} onMouseLeave={e => e.currentTarget.style.color = "var(--dim)"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
}
