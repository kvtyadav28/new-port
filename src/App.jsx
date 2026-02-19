import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ============================================================
   DESIGN SYSTEM
   Black #080808 · Lime #CAFF33 · Bebas Neue + Syne
   ============================================================ */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap');

    :root {
      --black:   #080808;
      --white:   #F5F5F0;
      --lime:    #CAFF33;
      --dim:     #888880;
      --line:    #1E1E1E;
      --surface: #101010;

      --f-display: 'Bebas Neue', 'Arial Black', sans-serif;
      --f-body:    'Syne', sans-serif;

      --pad: clamp(20px, 5vw, 80px);
      --max: 1280px;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0; padding: 0;
    }

    html { scroll-behavior: smooth; background: var(--black); }

    body {
      background: var(--black);
      color: var(--white);
      font-family: var(--f-body);
      font-size: 16px;
      font-weight: 400;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    body.no-scroll { overflow: hidden; }

    ::selection { background: var(--lime); color: var(--black); }

    a { color: inherit; text-decoration: none; }

    .wrap {
      max-width: var(--max);
      margin: 0 auto;
      padding: 0 var(--pad);
    }

    /* Grain overlay */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--lime); }

    /* Tags */
    .tag {
      display: inline-block;
      font-family: var(--f-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--dim);
      border: 1px solid var(--line);
      padding: 4px 12px;
      transition: color 0.2s, border-color 0.2s;
    }
    .tag:hover { color: var(--lime); border-color: var(--lime); }
  `}</style>
);

/* ============================================================
   HELPERS
   ============================================================ */
const ease = [0.16, 1, 0.3, 1];

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: `-${Math.round(threshold * 100)}% 0px` });
  return [ref, inView];
}

/* Generic scroll-triggered block */
function FadeUp({ children, delay = 0, y = 40, style = {}, className = "" }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useReveal();
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : (reduced ? 0 : y) }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   LOADER
   ============================================================ */
function Loader({ onDone }) {
  const reduced = useReducedMotion();
  const dur = reduced ? 0.01 : 1.0;
  const hold = reduced ? 0.01 : 0.9;
  const total = (dur + hold + 0.6) * 1000;

  useEffect(() => {
    const t = setTimeout(onDone, total);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="loader"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#080808",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(24px, 5vw, 80px)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: dur + hold + 0.6,
        times: [0, (dur + hold) / (dur + hold + 0.6), 1],
        ease: "linear",
      }}
    >
      {/* Logo display */}
      <motion.img
        src="/Logo.png"
        alt="Kavit Yadav"
        style={{
          height: "clamp(120px, 35vw, 320px)",
          width: "auto",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: dur, ease, delay: 0.1 }}
      />

      {/* Bottom-right label - removed*/}
      
    </motion.div>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav({ ready }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  const links = ["Work", "What I Do", "Experience", "Let's Talk"];

  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 500;
          padding: 20px clamp(20px, 5vw, 80px);
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.4s ease, border-bottom 0.4s ease;
        }
        .nav.scrolled {
          background: rgba(8,8,8,0.95);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #1E1E1E;
        }
        .nav-logo {
          font-family: var(--f-display);
          font-size: 28px;
          letter-spacing: 0.06em;
          color: var(--white);
          cursor: pointer;
          background: none; border: none;
          transition: color 0.2s;
        }
        .nav-logo:hover { color: var(--lime); }
        .nav-links { display: none; gap: 36px; list-style: none; }
        .nav-links a {
          font-family: var(--f-body);
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--dim);
          transition: color 0.2s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute; bottom: -3px; left: 0;
          width: 0; height: 2px;
          background: var(--lime);
          transition: width 0.25s ease;
        }
        .nav-links a:hover { color: var(--white); }
        .nav-links a:hover::after { width: 100%; }
        .nav-btn {
          font-family: var(--f-body);
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--black); background: var(--lime);
          border: none; padding: 10px 20px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .nav-btn:hover { background: var(--white); }

        /* Overlay */
        .nav-overlay {
          position: fixed; inset: 0; z-index: 600;
          background: var(--black);
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 0 clamp(20px, 5vw, 80px);
        }
        .nav-overlay-close {
          position: absolute; top: 20px;
          right: clamp(20px, 5vw, 80px);
          font-family: var(--f-body);
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--dim); background: none; border: none;
          cursor: pointer; transition: color 0.2s;
        }
        .nav-overlay-close:hover { color: var(--lime); }
        .nav-overlay a {
          font-family: var(--f-display);
          font-size: clamp(56px, 12vw, 130px);
          letter-spacing: 0.04em;
          color: var(--white); line-height: 0.95;
          transition: color 0.2s;
          display: block;
        }
        .nav-overlay a:hover { color: var(--lime); }

        @media (min-width: 768px) {
          .nav-links { display: flex; }
          .nav-btn { display: none; }
        }
      `}</style>

      <motion.nav
        className={`nav${scrolled ? " scrolled" : ""}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -10 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <button className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <img src="/Logo.png" alt="Kavit Yadav" style={{ height: "auto", width: "100px" }} />
        </button>
        <ul className="nav-links">
          {links.map(l => {
            let id = l.toLowerCase();
            if (l === "Let's Talk") id = "contact";
            if (l === "What I Do") id = "capabilities";
            return <li key={l}><a href={`#${id}`}>{l}</a></li>;
          })}
        </ul>
        <button className="nav-btn" onClick={() => setOpen(true)} aria-label="Open menu">
          Menu
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div className="nav-overlay"
            role="dialog" aria-modal="true" aria-label="Navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease }}
          >
            <button className="nav-overlay-close"
              onClick={() => setOpen(false)} aria-label="Close menu">Close ✕</button>
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {links.map((l, i) => {
                let id = l.toLowerCase();
                if (l === "Let's Talk") id = "contact";
                if (l === "What I Do") id = "capabilities";
                return (
                  <motion.a key={l} href={`#${id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 + 0.15, ease }}>
                    {l}
                  </motion.a>
                );
              })}
            </nav>
            {/* Lime corner block */}
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: "clamp(80px, 14vw, 180px)",
              height: "clamp(80px, 14vw, 180px)",
              background: "var(--lime)",
            }} aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduced = useReducedMotion();
  const yText = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      <style>{`
        .hero {
          min-height: 100svh;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding-bottom: clamp(40px, 6vw, 80px);
          padding-top: 100px;
          position: relative; overflow: hidden;
        }
        .hero-bg-num {
          position: absolute;
          top: 50%; right: -2vw;
          transform: translateY(-50%);
          font-family: var(--f-display);
          font-size: clamp(180px, 35vw, 480px);
          color: #111;
          letter-spacing: -0.02em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          z-index: 0;
        }
        .hero-content { position: relative; z-index: 1; }
        .hero-eyebrow {
          font-family: var(--f-body);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--lime);
          margin-bottom: clamp(20px, 3vw, 36px);
          display: flex; align-items: center; gap: 14px;
        }
        .hero-eyebrow::before {
          content: '';
          display: block; width: 32px; height: 2px;
          background: var(--lime); flex-shrink: 0;
        }
        .hero-name {
          font-family: var(--f-display);
          font-size: clamp(80px, 16vw, 220px);
          line-height: 0.88;
          letter-spacing: 0.02em;
          color: var(--white);
          margin-bottom: clamp(32px, 4vw, 56px);
        }
        .hero-name span { display: block; }
        .hero-name span.lime { color: var(--lime); }
        .hero-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px; flex-wrap: wrap;
        }
        .hero-sub {
          font-family: var(--f-body);
          font-size: clamp(15px, 2vw, 20px);
          font-weight: 400;
          color: var(--dim);
          max-width: 420px;
          line-height: 1.65;
        }
        .hero-sub strong { color: var(--white); font-weight: 600; }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: var(--f-body);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--black); background: var(--lime);
          padding: 16px 32px;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .hero-cta:hover { background: var(--white); transform: translateY(-2px); }
        .hero-cta-arrow { font-size: 18px; }

        /* Vertical text */
        .hero-vertical {
          position: absolute;
          right: clamp(20px, 4vw, 60px);
          bottom: clamp(40px, 6vw, 80px);
          writing-mode: vertical-rl;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--line);
          display: flex; align-items: center; gap: 12px;
          z-index: 1;
        }
        .hero-vertical::after {
          content: '';
          display: block; width: 1px;
          height: clamp(40px, 6vw, 80px);
          background: var(--line);
        }
      `}</style>

      <section className="hero" ref={ref} id="home" aria-label="Introduction">
        {/* Ghost number */}
        <motion.div
          className="hero-bg-num"
          style={{ y: yText, opacity }}
          aria-hidden="true"
        >01</motion.div>

        <motion.div className="hero-content wrap" style={{ y: yText, opacity }}>
          {/* Eyebrow */}
          <motion.div className="hero-eyebrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -20 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}>
            Web Developer
          </motion.div>

          {/* Name */}
          <h1 className="hero-name" aria-label="Kavit Yadav">
            {[
              { text: "KAVIT", cls: "", delay: 0.3 },
              { text: "YADAV", cls: "lime", delay: 0.42 },
            ].map(({ text, cls, delay }) => (
              <div key={text} style={{ overflow: "hidden" }}>
                <motion.span
                  className={cls}
                  style={{ display: "block" }}
                  initial={{ y: "105%" }}
                  animate={{ y: ready ? "0%" : "105%" }}
                  transition={{ duration: 0.9, delay, ease }}
                >
                  {text}
                </motion.span>
              </div>
            ))}
          </h1>

          {/* Bottom row */}
          <div className="hero-bottom">
            <motion.p className="hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.65, ease }}>
              I focus on clarity, performance, and usability—because the best products are <strong>built to last.</strong>
            </motion.p>

            <motion.a href="#work" className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.82, ease }}>
              See the work
              <span className="hero-cta-arrow" aria-hidden="true">↓</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Vertical label */}
        <motion.div className="hero-vertical"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          aria-hidden="true">
          Scroll to explore
        </motion.div>
      </section>
    </>
  );
}

/* ============================================================
   ABOUT / STATEMENT
   ============================================================ */
function About() {
  const [ref, inView] = useReveal(0.1);

  return (
    <>
      <style>{`
        .about {
          padding: clamp(80px, 12vw, 160px) 0;
          background: var(--surface);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          position: relative; overflow: hidden;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(48px, 6vw, 80px);
        }
        .about-label {
          font-family: var(--f-body);
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--lime);
          margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
        }
        .about-label::before {
          content: '02';
          font-family: var(--f-display);
          font-size: 13px; letter-spacing: 0.06em;
          color: var(--line);
        }
        .about-statement {
          font-family: var(--f-display);
          font-size: clamp(40px, 7vw, 100px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          color: var(--white);
        }
        .about-statement .hi { color: var(--lime); }
        .about-right {
          display: flex; flex-direction: column;
          gap: 32px; justify-content: center;
        }
        .about-copy {
          font-size: 16px;
          color: var(--dim); line-height: 1.8;
        }
        .about-copy p + p { margin-top: 16px; }
        .about-copy strong { color: var(--white); font-weight: 600; }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
        }
        .stat {
          background: var(--black);
          padding: 24px 20px;
          text-align: center;
        }
        .stat-num {
          font-family: var(--f-display);
          font-size: clamp(36px, 5vw, 64px);
          color: var(--lime);
          letter-spacing: 0.04em;
          line-height: 1;
          display: block;
        }
        .stat-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--dim);
          margin-top: 6px; display: block;
        }
        .about-meta {
          display: flex; flex-direction: column; gap: 0;
        }
        .about-meta-row {
          display: flex; align-items: center; gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
        }
        .about-meta-row:first-child { border-top: 1px solid var(--line); }
        .amk {
          font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; font-size: 10px;
          color: var(--dim); min-width: 100px;
        }
        .amv { color: var(--white); font-weight: 500; }
        .status-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(202, 255, 51, 0.12);
          border: 1px solid var(--lime);
          padding: 3px 10px;
        }
        .status-dot {
          width: 6px; height: 6px;
          background: var(--lime); border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        @media (min-width: 900px) {
          .about-grid {
            grid-template-columns: 5fr 4fr;
            align-items: start;
          }
        }
        /* Background ghost */
        .about-ghost {
          position: absolute;
          bottom: -8%;
          left: -2%;
          font-family: var(--f-display);
          font-size: clamp(120px, 22vw, 320px);
          color: rgba(30,30,30,0.5);
          line-height: 1;
          user-select: none; pointer-events: none;
          letter-spacing: 0.02em;
        }
      `}</style>

      <section className="about" id="about" aria-label="About">
        <div className="about-ghost" aria-hidden="true">KY</div>
        <div className="wrap">
          <div className="about-grid">
            {/* Left */}
            <div>
              <div className="about-label">About</div>
              <div ref={ref}>
                <div style={{ overflow: "hidden" }}>
                  <motion.div
                    className="about-statement"
                    initial={{ y: "105%" }}
                    animate={{ y: inView ? "0%" : "105%" }}
                    transition={{ duration: 0.9, ease }}
                  >
                    <span>NOT</span><br />
                    <span>YOUR</span><br />
                    <span className="hi">AVERAGE</span><br />
                    <span>DEV.</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Right */}
            <FadeUp delay={0.2} className="about-right">
              <div className="about-copy">
                <p>
                  I build frontend interfaces that are clear, fast, and thoughtfully structured. 
                  My focus is React, modern CSS, and clean JavaScript, with an emphasis on <strong>maintainability and detail.</strong>
                </p>
                <p>
                  Early in my career, but disciplined in my approach. 
                  I value readable code, solid UI decisions, and doing the work properly the first time.
                </p>
              </div>

              <div className="about-stats" role="list">
                {[
                  { n: "0", l: "Unfinished projects." },
                  { n: "100%", l: "End-to-end builds" },
                  { n: "∞", l: "Attention to detail" },
                ].map(({ n, l }) => (
                  <div className="stat" key={l} role="listitem">
                    <span className="stat-num">{n}</span>
                    <span className="stat-label">{l}</span>
                  </div>
                ))}
              </div>

              <div className="about-meta" role="list">
                {[
                  { k: "Location", v: "India" },
                  { k: "Open to", v: "Freelance · Remote" },
                  
                ].map(({ k, v }) => (
                  <div className="about-meta-row" key={k} role="listitem">
                    <span className="amk">{k}</span>
                    <span className="amv">{v}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   CAPABILITIES
   ============================================================ */
const CAPS = [
  {
    n: "01",
    title: "WEB\nDEVELOPMENT",
    desc: "Builds sites and apps from scratch. Responsive, fast, maintainable code. The kind that doesn't fall apart when someone touches it.",
    tools: ["HTML", "CSS", "JavaScript", "React", "Tailwind", "Bootstrap"],
  },
  {
    n: "02",
    title: "CLOUD &\nINFRASTRUCTURE",
    desc: "AWS and Azure, hands-on. Deployed VMs, managed IAM, monitored live systems via Grafana. Not sandboxed — real environments.",
    tools: ["AWS", "Azure", "EC2", "S3", "IAM", "CloudWatch", "Grafana"],
  },
  {
    n: "03",
    title: "CREATIVE\nPRODUCTION",
    desc: "Video editing for YouTube, short-form, and branded content. Knows what makes people stay. Pacing, format, platform — all of it.",
    tools: ["Adobe Premiere", "Video Editing", "Content Strategy", "UI/UX"],
  },
];

function CapRow({ cap, i }) {
  const [ref, inView] = useReveal();
  const [hov, setHov] = useState(false);

  return (
    <>
      <style>{`
        .cap-row {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 24px;
          padding: clamp(32px, 4vw, 52px) 0;
          border-bottom: 1px solid var(--line);
          align-items: start;
          transition: background 0.3s;
          cursor: default;
        }
        .cap-row:hover { background: rgba(202,255,51,0.03); }
        .cap-row:first-child { border-top: 1px solid var(--line); }
        .cap-n {
          font-family: var(--f-display);
          font-size: clamp(48px, 7vw, 88px);
          color: var(--line);
          line-height: 1;
          letter-spacing: 0.02em;
          transition: color 0.3s;
        }
        .cap-n.hov { color: var(--lime); }
        .cap-inner {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cap-title {
          font-family: var(--f-display);
          font-size: clamp(28px, 4vw, 52px);
          letter-spacing: 0.04em;
          color: var(--white);
          line-height: 0.95;
          white-space: pre-line;
        }
        .cap-desc {
          font-size: 15px; color: var(--dim);
          line-height: 1.75; max-width: 520px;
        }
        .cap-tools { display: flex; flex-wrap: wrap; gap: 8px; }
        @media (min-width: 640px) {
          .cap-row { grid-template-columns: 120px 1fr; gap: 40px; }
        }
      `}</style>

      <motion.div
        ref={ref}
        className="cap-row"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 32 }}
        transition={{ duration: 0.75, delay: i * 0.12, ease }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        role="article"
      >
        <div className={`cap-n${hov ? " hov" : ""}`} aria-hidden="true">{cap.n}</div>
        <div className="cap-inner">
          <h3 className="cap-title">{cap.title}</h3>
          <p className="cap-desc">{cap.desc}</p>
          <div className="cap-tools">
            {cap.tools.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Capabilities() {
  return (
    <section style={{ padding: "clamp(80px,12vw,160px) 0" }} id="capabilities">
      <div className="wrap">
        <FadeUp>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(40px,5vw,64px)", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,5vw,64px)", letterSpacing: "0.04em", color: "var(--white)" }}>
              WHAT I DO
            </span>
            <span style={{ fontFamily: "var(--f-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dim)" }}>
              03 — Capabilities
            </span>
          </div>
        </FadeUp>
        {CAPS.map((c, i) => <CapRow key={c.n} cap={c} i={i} />)}
      </div>
    </section>
  );
}

/* ============================================================
   EXPERIENCE
   ============================================================ */
const EXP = [
  {
    role: "VIDEO EDITOR",
    co: "Abract Eyes Media",
    dur: null,
    desc: "Long-form YouTube, short reels, branded social. Educational institutes, influencer collabs. Good editing is invisible — kept that standard throughout.",
    tags: ["Video Editing", "Adobe Premiere", "YouTube", "Social Content"],
  },
  {
    role: "CLOUD ENGINEERING INTERN",
    co: " DEV IT Professionals",
    dur: "5 months",
    desc: "Deployed and managed VMs on AWS and Azure. IAM configuration, security permissions, live infrastructure monitoring via Grafana and CloudWatch. Real environments, real consequences.",
    tags: ["AWS", "Azure", "EC2", "IAM", "S3", "Grafana", "CloudWatch"],
  },
];

function ExpBlock({ e, i }) {
  const [ref, inView] = useReveal();

  return (
    <>
      <style>{`
        .exp-block {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          padding: clamp(36px, 5vw, 56px) 0;
          border-bottom: 1px solid var(--line);
          position: relative;
        }
        .exp-role {
          font-family: var(--f-display);
          font-size: clamp(24px, 3.5vw, 48px);
          letter-spacing: 0.04em;
          color: var(--white); line-height: 1;
        }
        .exp-meta {
          display: flex; gap: 16px; align-items: center;
          flex-wrap: wrap; margin-top: 6px;
        }
        .exp-co {
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--dim);
        }
        .exp-dur {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--line);
          border: 1px solid var(--line);
          padding: 2px 8px;
        }
        .exp-desc {
          font-size: 15px; color: var(--dim);
          line-height: 1.78; max-width: 560px;
          margin-bottom: 20px;
        }
        .exp-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .exp-num {
          position: absolute;
          top: clamp(36px, 5vw, 56px);
          right: 0;
          font-family: var(--f-display);
          font-size: clamp(60px, 10vw, 120px);
          color: #111; line-height: 1;
          user-select: none; pointer-events: none;
          letter-spacing: 0.02em;
        }
        @media (min-width: 768px) {
          .exp-block {
            grid-template-columns: 280px 1fr;
            gap: 48px; align-items: start;
          }
          .exp-num { display: block; }
        }
      `}</style>

      <motion.div
        ref={ref}
        className="exp-block"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 28 }}
        transition={{ duration: 0.75, delay: i * 0.1, ease }}
        role="article"
      >
        <div className="exp-num" aria-hidden="true">0{i + 1}</div>
        <div>
          <p className="exp-role">{e.role}</p>
          <div className="exp-meta">
            <span className="exp-co">{e.co}</span>
            {e.dur && <span className="exp-dur">{e.dur}</span>}
          </div>
        </div>
        <div>
          <p className="exp-desc">{e.desc}</p>
          <div className="exp-tags">
            {e.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Experience() {
  return (
    <section style={{ padding: "clamp(80px,12vw,160px) 0", borderTop: "1px solid var(--line)" }} id="experience">
      <div className="wrap">
        <FadeUp>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(40px,5vw,64px)", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,5vw,64px)", letterSpacing: "0.04em", color: "var(--white)" }}>
              EXPERIENCE
            </span>
            <span style={{ fontFamily: "var(--f-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dim)" }}>
              04 — Where it's been applied
            </span>
          </div>
        </FadeUp>
        {EXP.map((e, i) => <ExpBlock key={e.role} e={e} i={i} />)}
      </div>
    </section>
  );
}

/* ============================================================
   WORK
   ============================================================ */
const PROJECTS = [
  {
    idx: "001",
    name: "TRITON CAFE",
    type: "Restaurant Website",
    desc: "Full restaurant site with Kitchen Display System (KDS), Menu, Contact information and location of the restraunt. Built with semantic HTML, modern CSS, and vanilla JavaScript for interactivity.",
    stack: "HTML · CSS · JavaScript · Responsive",
    url: "https://kavit.info",
    color: "#1A1A12",
  },
  {
    idx: "002",
    name: "PHOTOGRAPHY PORTFOLIO",
    type: "Personal Portfolio",
    desc: "Side nav, bento grid, custom lightbox. More complex than it needed to be — that was the point.",
    stack: "HTML · CSS · JavaScript · Animation",
    url: "https://artist-port1.netlify.app/",
    color: "#12121A",
  },
  {
    idx: "003",
    name: "BOOTCAMP LANDING PAGE",
    type: "Course Landing Page",
    desc: "Dual pricing, payment flow, testimonials, FAQ accordion. Every element justified by function — not aesthetics.",
    stack: "HTML · CSS · JavaScript · Forms",
    url: "https://learnwebwithk.netlify.app",
    color: "#1A1412",
  },
];

function ProjectCard({ p, i }) {
  const [ref, inView] = useReveal();
  const [hov, setHov] = useState(false);

  return (
    <>
      <style>{`
        .proj-card {
          border: 1px solid var(--line);
          padding: clamp(28px, 4vw, 48px);
          display: flex; flex-direction: column; gap: 20px;
          transition: border-color 0.3s, transform 0.4s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .proj-card::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--lime);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
          z-index: 0;
        }
        .proj-card.hov::before { transform: scaleY(1); }
        .proj-card.hov { border-color: var(--lime); }
        .proj-card > * { position: relative; z-index: 1; }
        .proj-top {
          display: flex; justify-content: space-between;
          align-items: baseline; flex-wrap: wrap; gap: 8px;
        }
        .proj-idx {
          font-family: var(--f-display);
          font-size: 13px; letter-spacing: 0.1em;
          transition: color 0.2s;
        }
        .proj-card.hov .proj-idx { color: var(--black); }
        .proj-type {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .proj-card:not(.hov) .proj-type { color: var(--dim); }
        .proj-card.hov .proj-type { color: var(--black); }
        .proj-name {
          font-family: var(--f-display);
          font-size: clamp(28px, 4vw, 52px);
          letter-spacing: 0.04em; line-height: 0.95;
          transition: color 0.2s;
        }
        .proj-card:not(.hov) .proj-name { color: var(--white); }
        .proj-card.hov .proj-name { color: var(--black); }
        .proj-desc {
          font-size: 14px; line-height: 1.75;
          transition: color 0.2s;
        }
        .proj-card:not(.hov) .proj-desc { color: var(--dim); }
        .proj-card.hov .proj-desc { color: rgba(0,0,0,0.7); }
        .proj-stack {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .proj-card:not(.hov) .proj-stack { color: var(--line); }
        .proj-card.hov .proj-stack { color: rgba(0,0,0,0.5); }
        .proj-footer {
          display: flex; justify-content: flex-end;
        }
        .proj-link {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          transition: background 0.2s, color 0.2s;
        }
        .proj-card:not(.hov) .proj-link {
          color: var(--lime); border: 1px solid var(--lime);
        }
        .proj-card.hov .proj-link {
          background: var(--black); color: var(--lime); border: 1px solid var(--black);
        }
        .proj-link:hover { opacity: 0.85; }
      `}</style>

      <motion.article
        ref={ref}
        className={`proj-card${hov ? " hov" : ""}`}
        style={{ background: p.color }}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 36 }}
        transition={{ duration: 0.75, delay: i * 0.12, ease }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={`Project: ${p.name}`}
      >
        <div className="proj-top">
          <span className="proj-idx">{p.idx}</span>
          <span className="proj-type">{p.type}</span>
        </div>
        <h3 className="proj-name">{p.name}</h3>
        <p className="proj-desc">{p.desc}</p>
        <p className="proj-stack">{p.stack}</p>
        <div className="proj-footer">
          <a href={p.url} target="_blank" rel="noopener noreferrer"
            className="proj-link"
            aria-label={`View ${p.name} live`}
            onClick={e => e.stopPropagation()}>
            View Live ↗
          </a>
        </div>
      </motion.article>
    </>
  );
}

function Work() {
  return (
    <section style={{
      padding: "clamp(80px,12vw,160px) 0",
      background: "var(--surface)",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
    }} id="work">
      <div className="wrap">
        <FadeUp>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(40px,5vw,64px)", flexWrap: "wrap", gap: "16px" }}>
            <span style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,5vw,64px)", letterSpacing: "0.04em", color: "var(--white)" }}>
              SELECTED WORK
            </span>
            <span style={{ fontFamily: "var(--f-body)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dim)" }}>
              05 — Projects.
            </span>
          </div>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "1px", background: "var(--line)" }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.idx} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Let's Talk CTA SECTION
   ============================================================ */
function Contact() {
  const [ref, inView] = useReveal(0.05);

  return (
    <>
      <style>{`
        .contact { padding: clamp(80px,14vw,200px) 0; position: relative; overflow: hidden; }
        .contact-ghost {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--f-display);
          font-size: clamp(80px, 18vw, 260px);
          color: #111; letter-spacing: 0.02em;
          user-select: none; pointer-events: none;
          z-index: 0; white-space: nowrap;
        }
        .contact-inner { position: relative; z-index: 1; text-align: center; }
        .contact-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--lime);
          margin-bottom: 24px; display: block;
        }
        .contact-heading {
          font-family: var(--f-display);
          font-size: clamp(60px, 12vw, 160px);
          line-height: 0.88; letter-spacing: 0.02em;
          color: var(--white);
          margin-bottom: clamp(32px, 4vw, 56px);
        }
        .contact-heading span { display: block; }
        .contact-heading .lime { color: var(--lime); }
        .contact-sub {
          font-size: 16px; color: var(--dim);
          line-height: 1.75; max-width: 460px;
          margin: 0 auto clamp(40px,5vw,64px);
        }
        .contact-main-btn {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          font-family: var(--f-display);
          font-size: clamp(28px, 5vw, 56px);
          letter-spacing: 0.06em;
          color: var(--black);
          background: var(--lime);
          padding: clamp(18px,3vw,28px) clamp(32px,5vw,64px);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.3s ease, gap 0.3s ease;
          text-decoration: none;
        }
        .contact-main-btn:hover {
          background: var(--white);
          transform: translateY(-4px);
          gap: 24px;
        }
        .contact-main-btn .btn-arrow {
          font-size: 0.75em;
          transition: transform 0.3s ease;
        }
        .contact-main-btn:hover .btn-arrow {
          transform: translate(4px, -4px);
        }
        .contact-alt {
          margin-top: 28px;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--dim);
        }
        .contact-alt a {
          color: var(--white);
          border-bottom: 1px solid var(--line);
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }
        .contact-alt a:hover { color: var(--lime); border-color: var(--lime); }
      `}</style>

      <section className="contact" id="contact" aria-label="Contact">
        <div className="contact-ghost" aria-hidden="true">LET'S GO</div>
        <div className="wrap">
          <div className="contact-inner">
            <motion.span className="contact-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.6 }}>
              06 — Contact
            </motion.span>

            <h2 className="contact-heading" ref={ref} aria-label="Let's build something">
              {[
                { t: "LET'S", cls: "" },
                { t: "BUILD", cls: "" },
                { t: "SOMETHING.", cls: "lime" },
              ].map(({ t, cls }, i) => (
                <div key={t} style={{ overflow: "hidden" }}>
                  <motion.span
                    className={cls}
                    style={{ display: "block" }}
                    initial={{ y: "108%" }}
                    animate={{ y: inView ? "0%" : "108%" }}
                    transition={{ duration: 0.85, delay: i * 0.12, ease }}
                  >{t}</motion.span>
                </div>
              ))}
            </h2>

            <FadeUp delay={0.3}>
              <p className="contact-sub">
                Open to freelance and remote work. Got something in mind? <br />
                Hit the button
              </p>
            </FadeUp>

            <FadeUp delay={0.45}>
              <a href="/contact" className="contact-main-btn" aria-label="Go to contact page">
                CONTACT ME
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </a>
              <p className="contact-alt">
                Or email directly at{" "}
                <a href="mailto:ykavit38@gmail.com">ykavit38@gmail.com</a>
              </p>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--line)",
      padding: "28px var(--pad)",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
    }} role="contentinfo">
      
      <span style={{ fontFamily: "var(--f-body)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--dim)" }}>
        Kavit Yadav © 2026
      </span>

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
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  const handleDone = useCallback(() => {
    document.body.classList.remove("no-scroll");
    setLoaded(true);
  }, []);

  return (
    <>
      <G />
      <AnimatePresence>
        {!loaded && <Loader onDone={handleDone} />}
      </AnimatePresence>
      <Nav ready={loaded} />
      <main>
        <Hero ready={loaded} />
        <About />
        <Capabilities />
        <Experience />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}