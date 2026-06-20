"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppKit } from "@reown/appkit/react";
import { Copy, Check, Wallet, HelpCircle } from "lucide-react";
import HelpDrawer from "./HelpDrawer";

export default function Navbar() {
  const { connect } = useConnect();
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum?.isMiniPay) {
      setIsMiniPay(true);
      if (!isConnected) {
        connect({ connector: injected() });
      }
    }
  }, [connect, isConnected]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 py-3 md:px-6 md:py-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 md:px-6 md:py-3 shadow-2xl"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
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
          <a href="https://celoscan.io/address/0xE662E6BDa0dB72cA992B0DDf2FC413467622CeE5" target="_blank" rel="noopener noreferrer" className="hover:text-celoyellow transition-colors">Protocol</a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 md:px-3 md:py-2 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-xl border border-white/10 text-white flex items-center gap-2 cursor-pointer"
            title="How does IntentRemit work?"
          >
            <HelpCircle size={15} />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Guide</span>
          </button>
          
          {!isMiniPay && (
            isConnected && address ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-celoyellow hover:bg-celoyellow/90 active:scale-95 transition-all rounded-xl text-xs font-black text-black font-mono select-none shadow-[0_0_20px_rgba(252,255,82,0.2)] cursor-pointer"
                  title="Copy wallet address"
                >
                  <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                  {copied ? (
                    <Check size={14} className="text-black" />
                  ) : (
                    <Copy size={14} className="text-black/80" />
                  )}
                </button>

                <button
                  onClick={() => open()}
                  className="p-2 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-xl border border-white/10 text-white flex items-center justify-center cursor-pointer"
                  title="Wallet options"
                >
                  <Wallet size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => open()}
                className="bg-celoyellow text-black font-bold py-2 px-4 rounded-xl text-xs sm:text-sm hover:bg-celoyellow/90 transition-colors shadow-[0_0_20px_rgba(252,255,82,0.2)] cursor-pointer"
              >
                CONNECT WALLET
              </button>
            )
          )}
          {isMiniPay && isConnected && (
            <div className="px-4 py-2 bg-celoyellow/10 border border-celoyellow/20 rounded-xl text-[10px] font-black uppercase text-celoyellow tracking-widest hidden sm:block">
              MiniPay Active
            </div>
          )}
        </div>
      </motion.div>

      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
}
