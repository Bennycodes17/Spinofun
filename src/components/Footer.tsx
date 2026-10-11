"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check, ExternalLink, Wallet, Sun, Moon } from "lucide-react";
import { SPINO_CONFIG } from "@/config/spino";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWalletSimulator, PRESET_SIMULATED_WALLETS } from "@/components/Web3Provider";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const [footerTheme, setFooterTheme] = useState<"yellow" | "dark">("yellow");
  const { authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();
  const { activeAddress, selectSimulatedWallet, connectWallet } = useWalletSimulator();

  const realAddress = user?.wallet?.address || wallets?.[0]?.address || null;
  const isWalletConnected = !!activeAddress || (authenticated && !!realAddress);

  const handleCopyCA = async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const textToCopy = SPINO_CONFIG.TOKEN_CONTRACT;
    let success = false;

    // 1. Try modern Clipboard API if supported and in secure context
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch {
        success = false;
      }
    }

    // 2. Fallback to execCommand (works universally on mobile HTTP / iOS Safari / Android)
    if (!success && typeof document !== "undefined") {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "-9999px";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.style.opacity = "0";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.warn("Fallback copy failed:", err);
      }
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    if (isWalletConnected) return;
    connectWallet();
  };

  const isYellow = footerTheme === "yellow";

  return (
    <footer className="w-full px-3 sm:px-6 md:px-8 py-8 md:py-12 mt-12 md:mt-16 relative z-10">
      {/* 
        Contained Framed Box: Exact Lunchbox Reference Structure 
        - Perfectly proportioned (not too long, not too wide)
        - Color matches the app (Yellow #FFD94A default like reference, with pure Deep Ink #111216 option)
        - Zero brown tones anywhere
        - Logo visible on BOTH desktop and mobile
      */}
      <div
        className={`max-w-5xl mx-auto rounded-[24px] md:rounded-[32px] border-[2.5px] border-[#14151A] shadow-[5px_7px_0px_#14151A] p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300 ${
          isYellow
            ? "bg-[#FFD94A] text-[#14151A]"
            : "bg-[#111216] text-[#FFFFFF]"
        }`}
      >
        {/* ROW 1: Top Nav Bar (thin, full-width, sits above main content) */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b text-[11px] font-bold tracking-widest uppercase ${
            isYellow ? "border-[#14151A]/15 text-[#14151A]" : "border-white/10 text-white"
          }`}
        >
          {/* Left: ABOUT · HOW IT WORKS */}
          <div className="flex items-center gap-3">
            <Link
              href="/how-it-works"
              className={`transition-colors ${
                isYellow ? "hover:text-[#FF6B8A]" : "hover:text-[#FFD94A]"
              }`}
            >
              ABOUT
            </Link>
            <span className={isYellow ? "text-[#14151A]/30" : "text-white/30"}>·</span>
            <Link
              href="/how-it-works"
              className={`transition-colors ${
                isYellow ? "hover:text-[#FF6B8A]" : "hover:text-[#FFD94A]"
              }`}
            >
              HOW IT WORKS
            </Link>
          </div>

          {/* Center: SPINO Wordmark */}
          <div className="font-display font-black text-sm tracking-widest uppercase">
            SPINO<span className="text-[#FF6B8A]">.FUN</span>
          </div>

          {/* Right: Login / Connect Wallet + Color Scheme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Color Scheme Switcher (Yellow Brand vs Pure Dark Ink) */}
            <button
              onClick={() => setFooterTheme(isYellow ? "dark" : "yellow")}
              title={isYellow ? "Switch to Dark Ink theme" : "Switch to Yellow Brand theme"}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all flex items-center gap-1.5 ${
                isYellow
                  ? "bg-white border-[#14151A] text-[#14151A] hover:bg-slate-100 shadow-[1px_1px_0px_#14151A]"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-[1px_1px_0px_rgba(255,255,255,0.2)]"
              }`}
            >
              {isYellow ? (
                <>
                  <Moon className="w-3 h-3 text-[#14151A]" />
                  <span>DARK INK</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-[#FFD94A]" />
                  <span>YELLOW BRAND</span>
                </>
              )}
            </button>

            {/* Connect Wallet Pill Button */}
            <button
              onClick={handleConnect}
              className="sticker-btn bg-[#FF6B8A] hover:bg-[#ff5577] text-white px-3.5 py-1.5 rounded-full text-xs font-display font-black tracking-wide border-2 border-[#14151A] shadow-[2px_2px_0px_#14151A] flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isWalletConnected ? "CONNECTED" : "CONNECT WALLET"}</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Link Columns + Logo Mascot (Visible on BOTH Mobile and Desktop) */}
        <div className="relative py-4 md:py-6">
          
          {/* Mobile Mascot Header (Visible on Mobile Only, prominently centered) */}
          <div className="flex md:hidden items-center justify-center mb-5">
            <div
              className={`relative w-16 h-16 rounded-full border-2 border-[#14151A] shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 transform hover:scale-105 transition-transform ${
                isYellow ? "bg-white" : "bg-[#FFD94A]"
              }`}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden border border-[#14151A]/20 bg-white">
                <Image
                  src="/spino-logo.jpg"
                  alt="SPINO Mascot Mark"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-[#FF6B8A] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#14151A] rotate-12">
                $SPIN
              </div>
            </div>
          </div>

          {/* Desktop Centered Mascot (Positioned like Lunchbox's tongue mascot between columns) */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
            <div
              className={`relative w-20 h-20 rounded-full border-[2.5px] border-[#14151A] shadow-[0_6px_16px_rgba(0,0,0,0.18)] flex items-center justify-center p-1.5 transform hover:scale-105 transition-transform pointer-events-auto ${
                isYellow ? "bg-white" : "bg-[#FFD94A]"
              }`}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden border border-[#14151A]/20 bg-white">
                <Image
                  src="/spino-logo.jpg"
                  alt="SPINO Mascot Mark"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-[#FF6B8A] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#14151A] rotate-12">
                $SPIN
              </div>
            </div>
          </div>

          {/* 3 Link Columns (Company links removed per instructions) */}
          {/* 2 Link Columns: PLATFORM and SOCIAL (Symmetrical with center mascot) */}
          <div className="grid grid-cols-2 gap-8 md:gap-24 text-xs relative z-0 max-w-2xl mx-auto">
            {/* Column 1: PLATFORM */}
            <div className="space-y-2 text-left">
              <h4
                className={`font-sans font-black text-[11px] tracking-widest uppercase ${
                  isYellow ? "text-[#14151A]" : "text-[#FFD94A]"
                }`}
              >
                PLATFORM
              </h4>
              <ul
                className={`space-y-1.5 font-medium ${
                  isYellow ? "text-[#14151A]/80" : "text-white/80"
                }`}
              >
                <li>
                  <Link href="/how-it-works" className="hover:underline hover:text-[#FF6B8A] transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#holder-wheel" className="hover:underline hover:text-[#FF6B8A] transition-colors">
                    Holder Spin
                  </Link>
                </li>
                <li>
                  <Link href="/#recent-wins" className="hover:underline hover:text-[#FF6B8A] transition-colors">
                    Rewards History
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: SOCIAL */}
            <div className="space-y-2 text-right">
              <h4
                className={`font-sans font-black text-[11px] tracking-widest uppercase ${
                  isYellow ? "text-[#14151A]" : "text-[#E8F8EE]"
                }`}
              >
                SOCIAL
              </h4>
              <ul
                className={`space-y-1.5 font-medium ${
                  isYellow ? "text-[#14151A]/80" : "text-white/80"
                }`}
              >
                <li>
                  <a
                    href="https://x.com/SpinoFun"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline hover:text-[#FF6B8A] transition-colors inline-flex items-center gap-1 justify-end"
                  >
                    <span>X (Twitter)</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ROW 3: The CA Banner (Replaces "BOOK A FREE CONSULTATION") */}
        <div className="my-3 sm:my-4">
          <div
            onClick={handleCopyCA}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCopyCA();
              }
            }}
            className={`w-full rounded-xl sm:rounded-2xl border-2 border-[#14151A] py-2.5 sm:py-3 px-3 sm:px-6 flex items-center justify-between gap-2.5 cursor-pointer group active:translate-x-0.5 active:translate-y-0.5 transition-all select-none ${
              isYellow
                ? "bg-white text-[#14151A] shadow-[3px_4px_0px_#14151A] hover:bg-slate-50"
                : "bg-white text-[#14151A] shadow-[3px_4px_0px_#FF6B8A] hover:bg-slate-100"
            }`}
          >
            <div className="flex-1 min-w-0 text-left sm:text-center font-display font-black text-[10px] sm:text-xs md:text-sm lg:text-base tracking-wide uppercase truncate">
              <span className="text-[#FF6B8A] mr-1 sm:mr-2">CONTRACT<span className="hidden sm:inline"> ADDRESS</span>:</span>
              <span className="font-mono text-[#14151A] tracking-normal select-all">{SPINO_CONFIG.TOKEN_CONTRACT}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCA}
              className={`sticker-btn px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] font-sans font-bold flex items-center gap-1 sm:gap-1.5 flex-shrink-0 transition-all ${
                copied
                  ? "bg-emerald-600 text-white shadow-[1px_1px_0px_#14151A]"
                  : "bg-[#14151A] text-white hover:bg-[#FF6B8A]"
              }`}
              title="Copy Contract Address"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-black text-[10px] sm:text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ROW 4: The Giant Wordmark (Replaces "LUNCHBOX") */}
        <div className="pt-2 pb-1 text-center overflow-hidden select-none">
          <h2
            className={`font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-[96px] leading-[0.88] tracking-tighter transition-colors duration-300 uppercase ${
              isYellow
                ? "text-[#14151A] hover:text-[#FF6B8A]"
                : "text-[#FF6B8A] hover:text-[#FFD94A]"
            }`}
          >
            SPINO
          </h2>
        </div>

        {/* ROW 5: Bottom Legal Strip (Three-part layout matching reference) */}
        <div
          className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${
            isYellow
              ? "border-[#14151A]/15 text-[#14151A]/70"
              : "border-white/10 text-white/60"
          }`}
        >
          <div>SPINO.FUN · HOLD. SPIN. WIN ETH.</div>
          <div>© 2026 SPINO TECHNOLOGIES</div>
          <div className="flex items-center gap-3">
            <Link
              href="/how-it-works"
              className={`transition-colors ${
                isYellow ? "hover:text-[#FF6B8A]" : "hover:text-white"
              }`}
            >
              PRIVACY
            </Link>
            <span>·</span>
            <Link
              href="/how-it-works"
              className={`transition-colors ${
                isYellow ? "hover:text-[#FF6B8A]" : "hover:text-white"
              }`}
            >
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
