"use client";

import { motion } from "framer-motion";

const float = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
};

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-[420px] select-none pointer-events-none">

      {/* Background grid faint lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 420">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="420" stroke="#FCFF52" strokeWidth="1"/>
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 52} x2="400" y2={i * 52} stroke="#FCFF52" strokeWidth="1"/>
        ))}
      </svg>

      {/* Central payment icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#FCFF52" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      </motion.div>

      {/* Float card 1 — Conditional Payment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, ...float.animate }}
        transition={{ ...float.transition, delay: 0.2 }}
        style={{ background: "var(--card)", border: "1px solid var(--border-strong)", top: "14%", left: "4%" }}
        className="absolute rounded-2xl px-4 py-3 w-48 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="label">Conditional Payment</span>
        </div>
        <div style={{ color: "var(--primary)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>
          Escrow + Auto-Execute
        </div>
        <div style={{ color: "var(--foreground-muted)", fontSize: 11, marginTop: 2 }}>
          Time-based, Manual, Recurring
        </div>
      </motion.div>

      {/* Float card 2 — Trustless */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, ...float.animate }}
        transition={{ ...float.transition, delay: 0.4 }}
        style={{ background: "var(--card)", border: "1px solid var(--border-strong)", top: "10%", right: "2%"  }}
        className="absolute rounded-2xl px-4 py-3 w-44 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="label">Trustless</span>
        </div>
        <div style={{ color: "var(--accent)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>
          No Middleman
        </div>
        <div style={{ color: "var(--foreground-muted)", fontSize: 11, marginTop: 2 }}>
          On-chain enforcement
        </div>
      </motion.div>

      {/* Float card 3 — Multi-chain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{ background: "var(--card)", border: "1px solid var(--border-strong)", bottom: "16%", left: "8%" }}
        className="absolute rounded-2xl px-4 py-3 w-52 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="label">Multi-Chain</span>
        </div>
        <div style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>
          Deploy on Celo and EVM chains
        </div>
      </motion.div>
    </div>
  );
}
