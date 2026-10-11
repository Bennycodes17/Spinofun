"use client";

import React, { useState } from "react";
import { X, ExternalLink, Shield, Sparkles, Smartphone, ArrowRight } from "lucide-react";

interface MobileWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivy: () => void;
}

export function MobileWalletModal({ isOpen, onClose, onOpenPrivy }: MobileWalletModalProps) {
  const [redirectingWallet, setRedirectingWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCleanHost =
    typeof window !== "undefined"
      ? window.location.host + window.location.pathname
      : "spinofun.online";

  const currentFullUrl =
    typeof window !== "undefined" ? window.location.href : "https://spinofun.online";

  const encodedFullUrl = encodeURIComponent(currentFullUrl);

  const wallets = [
    {
      id: "metamask",
      name: "MetaMask",
      badge: "Most Popular",
      color: "bg-[#FFF4EB] border-[#F6851B] text-[#D96B00]",
      deepLink: `https://metamask.app.link/dapp/${currentCleanHost}`,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 318 318" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M274.1 35.5L174.6 109.4L193 65.8L274.1 35.5Z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M44.4 35.5L124.7 66.2L143.9 109.4L44.4 35.5Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M238.3 206.8L211.7 247.4L268.4 263L284.7 207.6L238.3 206.8Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M33.9 207.6L50.1 263L106.9 247.4L80.2 206.8L33.9 207.6Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M103.6 138.2L87.5 162.5L144.1 164.8L142.3 103.6L103.6 138.2Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M214.9 138.2L175.9 103.1L174.4 164.8L231 162.5L214.9 138.2Z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M106.9 247.4L139.7 231.5L111.4 208.1L106.9 247.4Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M178.8 231.5L211.7 247.4L207.1 208.1L178.8 231.5Z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M139.7 231.5L142.6 193.3L80.2 206.8L106.9 247.4L139.7 231.5Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M178.8 231.5L211.7 247.4L238.3 206.8L175.9 193.3L178.8 231.5Z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M159.2 191L159.5 73.5L193.5 66.2L174.4 164.8L159.2 191Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M159.2 191L144.1 164.8L125 66.2L159 73.5L159.2 191Z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      badge: "Direct EVM",
      color: "bg-[#EBF5FF] border-[#0500FF] text-[#0500FF]",
      deepLink: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedFullUrl}`,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z" fill="#0500FF"/>
          <path d="M12 4.1L5.9 6.7V11.4C5.9 15.3 8.5 18.9 12 19.8C15.5 18.9 18.1 15.3 18.1 11.4V6.7L12 4.1Z" fill="white"/>
          <path d="M12 5.5L7.5 7.5V11.3C7.5 14.3 9.4 17.1 12 18V5.5Z" fill="#0500FF"/>
        </svg>
      ),
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      badge: "Smart Wallet",
      color: "bg-[#EBF3FF] border-[#0052FF] text-[#0052FF]",
      deepLink: `https://go.cb-w.com/dapp?cb_url=${encodedFullUrl}`,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#0052FF"/>
          <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM10 10H14V14H10V10Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: "rainbow",
      name: "Rainbow Wallet",
      badge: "Fast & Clean",
      color: "bg-[#FFF0F5] border-[#FF4081] text-[#FF4081]",
      deepLink: `https://rainbow.me/open?url=${encodedFullUrl}`,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#14151A"/>
          <path d="M5 16C5 12.13 8.13 9 12 9C15.87 9 19 12.13 19 16" stroke="#FF4081" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M7.5 16C7.5 13.51 9.51 11.5 12 11.5C14.49 11.5 16.5 13.51 16.5 16" stroke="#FFD94A" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "phantom",
      name: "Phantom",
      badge: "Multi-Chain",
      color: "bg-[#F3EFFF] border-[#AB9FF2] text-[#6A4FEB]",
      deepLink: `https://phantom.app/ul/browse/${encodedFullUrl}?ref=${encodedFullUrl}`,
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#AB9FF2"/>
          <path d="M7 11.5C7 8.74 9.24 6.5 12 6.5C14.76 6.5 17 8.74 17 11.5V16.5C17 17.05 16.55 17.5 16 17.5C15.45 17.5 15 17.05 15 16.5V14.5H9V16.5C9 17.05 8.55 17.5 8 17.5C7.45 17.5 7 17.05 7 16.5V11.5Z" fill="white"/>
          <circle cx="10" cy="11" r="1" fill="#4B3B9B"/>
          <circle cx="14" cy="11" r="1" fill="#4B3B9B"/>
        </svg>
      ),
    },
  ];

  const handleWalletClick = (wallet: typeof wallets[0]) => {
    setRedirectingWallet(wallet.name);
    // Trigger deep link
    window.location.href = wallet.deepLink;

    // Reset indicator after 4 seconds if they switch back
    setTimeout(() => {
      setRedirectingWallet(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className="w-full sm:max-w-md bg-[#FFFDF5] border-t-[3px] sm:border-[3px] border-[#14151A] rounded-t-[32px] sm:rounded-[32px] shadow-[0px_-6px_0px_#14151A] sm:shadow-[6px_8px_0px_#14151A] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="bg-[#FFD94A] border-b-[2.5px] border-[#14151A] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-[#14151A] flex items-center justify-center shadow-[1px_1px_0px_#14151A]">
              <Smartphone className="w-4 h-4 text-[#14151A]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-[#14151A] uppercase tracking-wide">
                Connect Mobile Wallet
              </h3>
              <p className="text-[10px] font-bold text-[#14151A]/70 uppercase tracking-wider">
                Instant In-App Redirection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#14151A] shadow-[2px_2px_0px_#14151A] flex items-center justify-center hover:bg-rose-50 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-[#14151A]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {/* Helpful Helper Notice */}
          <div className="p-3 bg-[#E8F8EE] rounded-2xl border-2 border-[#14151A] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-[#14151A]/85 leading-snug">
              Tapping your wallet opens <strong>SPINO.fun</strong> inside your wallet's built-in Web3 browser with your address already connected!
            </p>
          </div>

          {/* Wallet List */}
          <div className="space-y-2 pt-1">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletClick(wallet)}
                className="w-full bg-white hover:bg-slate-50 border-2 border-[#14151A] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between shadow-[3px_3px_0px_#14151A] active:translate-x-0.5 active:translate-y-0.5 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-1 rounded-xl bg-slate-50 border border-[#14151A]/20">
                    {wallet.icon}
                  </div>
                  <div>
                    <div className="font-display font-black text-sm text-[#14151A] flex items-center gap-2">
                      <span>{wallet.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-current ${wallet.color}`}>
                        {wallet.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#14151A]/60 font-medium">
                      Open in {wallet.name} App
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#14151A]/50 group-hover:text-[#FF6B8A] transition-colors">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Redirecting Banner if clicked */}
          {redirectingWallet && (
            <div className="p-2.5 bg-[#FF6B8A]/10 border-2 border-[#FF6B8A] rounded-xl text-center animate-pulse">
              <span className="text-xs font-bold text-[#FF6B8A]">
                Launching {redirectingWallet}... Opening app now!
              </span>
            </div>
          )}

          {/* Alternative: Privy / Social / Desktop Login */}
          <div className="pt-2 border-t border-[#14151A]/10 text-center">
            <button
              onClick={onOpenPrivy}
              className="text-[11px] font-bold text-[#14151A]/80 hover:text-[#FF6B8A] underline decoration-2 transition-colors py-1 inline-flex items-center gap-1.5"
            >
              <span>Or sign in with Email / Google / Other Wallets</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
