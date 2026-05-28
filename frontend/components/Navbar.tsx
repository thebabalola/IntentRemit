"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum?.isMiniPay) {
      setIsMiniPay(true);
      if (!isConnected) {
        connect({ connector: injected() });
      }
    }
  }, [connect, isConnected]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center">
            <img 
              src="/intentremit-logo.svg" 
              alt="" 
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
          <Link href="#create" className="hover:text-celoyellow transition-colors">Create</Link>
          <Link href="#dashboard" className="hover:text-celoyellow transition-colors">Dashboard</Link>
          <a href="https://celoscan.io/address/0xf3850044Ee8d0498Cf07C5e820dd7Dd923fe869E" target="_blank" rel="noopener noreferrer" className="hover:text-celoyellow transition-colors">Protocol</a>
        </nav>



        <div className="flex items-center gap-4">
          {!isMiniPay && <appkit-button />}
          {isMiniPay && isConnected && (
            <div className="px-4 py-2 bg-celoyellow/10 border border-celoyellow/20 rounded-xl text-[10px] font-black uppercase text-celoyellow tracking-widest">
              MiniPay Active
            </div>
          )}
        </div>
      </motion.div>
    </header>
  );
}
