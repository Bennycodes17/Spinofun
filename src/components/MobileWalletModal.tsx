"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink, Zap, Smartphone, Sparkles, ShieldCheck } from "lucide-react";

interface MobileWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivy: () => void;
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isInAppBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return !!(
    (window as any).ethereum ||
    (window as any).web3 ||
    (window as any).isMetaMask ||
    /MetaMaskMobile|Trust|CoinbaseWallet|Rainbow|Phantom/i.test(navigator.userAgent)
  );
}

export function MobileWalletModal({ isOpen, onClose, onOpenPrivy }: MobileWalletModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getDappTargets = () => {
    if (typeof window === "undefined") {
      return {
        fullUrl: "https://spinofun.online",
        cleanHost: "spinofun.online",
      };
    }
    const host = window.location.host;
    const pathname = window.location.pathname;
    const search = window.location.search;

    // Use deployed production domain for deep-linking if running on localhost or IP
    const isLocal =
      host.includes("localhost") ||
      host.includes("127.0.0.1") ||
      /^\d+\.\d+\.\d+\.\d+/.test(host);

    const targetDomain = isLocal ? "spinofun.online" : host;
    const fullUrl = `https://${targetDomain}${pathname}${search}`;
    const cleanHost = `${targetDomain}${pathname}${search}`;

    return { fullUrl, cleanHost };
  };

  const { fullUrl, cleanHost } = getDappTargets();

  const handleWalletRedirect = (wallet: "metamask" | "trust" | "coinbase" | "rainbow" | "phantom") => {
    let deepLink = "";

    switch (wallet) {
      case "metamask":
        // MetaMask Universal Link - opens dApp browser
        deepLink = `https://metamask.app.link/dapp/${cleanHost}`;
        break;
      case "trust":
        // Trust Wallet Universal Link
        deepLink = `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(fullUrl)}`;
        break;
      case "coinbase":
        // Coinbase Wallet Universal Link
        deepLink = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(fullUrl)}`;
        break;
      case "rainbow":
        // Rainbow Universal Link
        deepLink = `https://rnbwapp.com/dapp?url=${encodeURIComponent(fullUrl)}`;
        break;
      case "phantom":
        // Phantom Universal Link
        deepLink = `https://phantom.app/ul/browse/${encodeURIComponent(fullUrl)}?ref=${encodeURIComponent(fullUrl)}`;
        break;
    }

    if (deepLink) {
      window.location.href = deepLink;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl border-[2.5px] border-[#14151A] shadow-[6px_8px_0px_#14151A] overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#FFD94A] p-4 border-b-2 border-[#14151A] flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full border-2 border-[#14151A] overflow-hidden bg-white shadow-[1px_1px_0px_#14151A]">
              <Image src="/spino-logo.jpg" alt="SPINO" fill className="object-cover" />
            </div>
            <div>
              <div className="font-display font-black text-sm tracking-wide text-[#14151A] uppercase">
                Connect Wallet
              </div>
              <div className="text-[10px] font-bold text-[#14151A]/70 uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-[#FF6B8A]" />
                Mobile Redirect
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#14151A] shadow-[2px_2px_0px_#14151A] flex items-center justify-center text-[#14151A] hover:bg-[#FF6B8A] hover:text-white transition-colors active:translate-x-0.5 active:translate-y-0.5"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Explainer Banner */}
          <div className="p-3 rounded-2xl bg-[#FAF0EE] border-2 border-[#14151A] text-xs text-[#14151A]/85 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug font-medium text-[11px]">
              Tap your mobile wallet to open <strong>SPINO.fun</strong> directly inside your wallet app with native Web3 connection.
            </div>
          </div>

          {/* Wallet List */}
          <div className="space-y-2">
            {/* MetaMask */}
            <button
              onClick={() => handleWalletRedirect("metamask")}
              className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-[#14151A] bg-white hover:bg-[#FFF8E7] active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_3px_0px_#14151A] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-[#14151A]/20 flex items-center justify-center text-xl flex-shrink-0">
                  🦊
                </div>
                <div className="text-left">
                  <div className="font-display font-black text-sm text-[#14151A] group-hover:text-[#FF6B8A] transition-colors">
                    MetaMask
                  </div>
                  <div className="text-[10px] text-[#14151A]/60 font-medium">
                    Open in MetaMask Mobile App
                  </div>
                </div>
              </div>
              <div className="sticker-badge bg-[#FFD94A] text-[#14151A] text-[9px] font-black uppercase px-2 py-0.5">
                OPEN APP
              </div>
            </button>

            {/* Trust Wallet */}
            <button
              onClick={() => handleWalletRedirect("trust")}
              className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-[#14151A] bg-white hover:bg-[#E8F8EE] active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_3px_0px_#14151A] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-[#14151A]/20 flex items-center justify-center text-xl flex-shrink-0">
                  🛡️
                </div>
                <div className="text-left">
                  <div className="font-display font-black text-sm text-[#14151A] group-hover:text-emerald-700 transition-colors">
                    Trust Wallet
                  </div>
                  <div className="text-[10px] text-[#14151A]/60 font-medium">
                    Open in Trust Wallet Mobile App
                  </div>
                </div>
              </div>
              <div className="sticker-badge bg-[#E8F8EE] text-emerald-900 text-[9px] font-black uppercase px-2 py-0.5">
                OPEN APP
              </div>
            </button>

            {/* Coinbase Wallet */}
            <button
              onClick={() => handleWalletRedirect("coinbase")}
              className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-[#14151A] bg-white hover:bg-[#C9EEF2]/30 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_3px_0px_#14151A] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-[#14151A]/20 flex items-center justify-center text-xl flex-shrink-0">
                  🔵
                </div>
                <div className="text-left">
                  <div className="font-display font-black text-sm text-[#14151A] group-hover:text-blue-600 transition-colors">
                    Coinbase Wallet
                  </div>
                  <div className="text-[10px] text-[#14151A]/60 font-medium">
                    Open in Coinbase Wallet App
                  </div>
                </div>
              </div>
              <div className="sticker-badge bg-[#C9EEF2] text-blue-900 text-[9px] font-black uppercase px-2 py-0.5">
                OPEN APP
              </div>
            </button>

            {/* Rainbow Wallet */}
            <button
              onClick={() => handleWalletRedirect("rainbow")}
              className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-[#14151A] bg-white hover:bg-[#FAF0EE] active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_3px_0px_#14151A] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-[#14151A]/20 flex items-center justify-center text-xl flex-shrink-0">
                  🌈
                </div>
                <div className="text-left">
                  <div className="font-display font-black text-sm text-[#14151A] group-hover:text-purple-600 transition-colors">
                    Rainbow Wallet
                  </div>
                  <div className="text-[10px] text-[#14151A]/60 font-medium">
                    Open in Rainbow App
                  </div>
                </div>
              </div>
              <div className="sticker-badge bg-[#C9B8FF] text-[#14151A] text-[9px] font-black uppercase px-2 py-0.5">
                OPEN APP
              </div>
            </button>

            {/* Phantom */}
            <button
              onClick={() => handleWalletRedirect("phantom")}
              className="w-full flex items-center justify-between p-3 rounded-2xl border-2 border-[#14151A] bg-white hover:bg-slate-50 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_3px_0px_#14151A] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 border border-[#14151A]/20 flex items-center justify-center text-xl flex-shrink-0">
                  👻
                </div>
                <div className="text-left">
                  <div className="font-display font-black text-sm text-[#14151A] group-hover:text-violet-700 transition-colors">
                    Phantom Wallet
                  </div>
                  <div className="text-[10px] text-[#14151A]/60 font-medium">
                    Open in Phantom App
                  </div>
                </div>
              </div>
              <div className="sticker-badge bg-white border border-[#14151A] text-[#14151A] text-[9px] font-black uppercase px-2 py-0.5">
                OPEN APP
              </div>
            </button>
          </div>

          {/* Alternative: Privy Social / Email / Embedded */}
          <div className="pt-2 border-t border-[#14151A]/10">
            <button
              onClick={onOpenPrivy}
              className="w-full p-3 rounded-2xl border-2 border-[#14151A] bg-[#FF6B8A] hover:bg-[#ff5577] text-white shadow-[2px_3px_0px_#14151A] flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
            >
              <Zap className="w-4 h-4 fill-white text-white" />
              <span className="font-display font-black text-xs uppercase tracking-wide">
                Log In with Email / Google / Privy
              </span>
            </button>
            <div className="text-center text-[10px] text-[#14151A]/60 font-medium mt-1.5">
              No crypto app required • Instant automated wallet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
