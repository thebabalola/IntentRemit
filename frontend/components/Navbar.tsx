"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="IntentRemit Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            IntentRemit
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link href="/" className="hover:text-green-400 transition-colors">Create</Link>
          <Link href="/" className="hover:text-green-400 transition-colors">Dashboard</Link>
          <Link href="/" className="hover:text-green-400 transition-colors">Protocol</Link>
        </nav>

        <div className="flex items-center gap-4">
          <appkit-button />
        </div>
      </motion.div>
    </header>
  );
}
