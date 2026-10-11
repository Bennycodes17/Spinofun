"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWalletSimulator, PRESET_SIMULATED_WALLETS } from "@/components/Web3Provider";
import { Wallet, X, ChevronDown, Check, HelpCircle, Cpu, ExternalLink } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  // Privy hooks
  const { authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  // Simulated wallet context for local dev/testing
  const {
    activeAddress,
    isSimulated,
    selectedPreset,
    selectSimulatedWallet,
    disconnectAll,
    openConnectModal,
  } = useWalletSimulator();

  // Unified display address: simulated address takes precedence if set, otherwise real Privy address
  const realAddress = user?.wallet?.address || wallets?.[0]?.address || null;
  const currentAddress = activeAddress || (authenticated ? realAddress : null);

  const truncatedAddress = currentAddress
    ? `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}`
    : "";

  const handleConnectWallet = () => {
    openConnectModal();
  };

  const handleDisconnect = () => {
    logout();
    disconnectAll();
    setWalletDropdownOpen(false);
  };

  return (
    <>
      {/* Floating Pill Navbar with Margin From Top */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 max-w-6xl mx-auto">
        <nav className="bg-white/95 backdrop-blur-md border-[2.5px] border-[#14151A] rounded-full px-4 py-2.5 md:px-6 md:py-3 shadow-[4px_5px_0px_#14151A] flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-[#14151A] overflow-hidden shadow-[2px_2px_0px_#14151A] bg-[#C9EEF2] flex-shrink-0 group-hover:rotate-6 transition-transform">
              <Image
                src="/spino-logo.jpg"
                alt="SPINO Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl md:text-2xl tracking-tight text-[#14151A] leading-none">
                SPINO<span className="text-[#FF6B8A]">.fun</span>
              </span>
              <span className="text-[10px] font-bold text-[#14151A]/60 tracking-wider uppercase -mt-0.5">
                Hold. Spin. Win ETH.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 font-display font-bold text-sm tracking-wide text-[#14151A]">
            <Link
              href="/"
              className="px-3 py-1 rounded-full hover:bg-[#C9EEF2] transition-colors"
            >
              Spin Wheels
            </Link>
            <Link
              href="/how-it-works"
              className="px-3 py-1 rounded-full hover:bg-[#FFD94A] transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-[#14151A]" />
              How It Works
            </Link>
          </div>

          {/* Right Action: Real Connected Wallet */}
          <div className="hidden md:flex items-center gap-3">
            {currentAddress ? (
              <div className="relative">
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="sticker-btn bg-[#E8F8EE] text-[#14151A] px-4 py-2 text-xs md:text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-[#14151A]" />
                  <span className="font-bold tabular-nums">{truncatedAddress}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border-[2.5px] border-[#14151A] rounded-2xl shadow-[4px_6px_0px_#14151A] p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="text-xs font-bold text-[#14151A]/60 px-2 py-1 uppercase flex items-center justify-between">
                      <span>Connected Wallet</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ON-CHAIN
                      </span>
                    </div>
                    <div className="bg-[#F6F7F9] p-2.5 rounded-xl border border-[#14151A]/20 mb-3 text-xs break-all font-mono">
                      {currentAddress}
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <a
                        href={`https://testnet.explorer.chain.robinhood.com/address/${currentAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-xs p-2 rounded-xl border border-[#14151A]/10 hover:bg-[#C9EEF2]/50 transition-all flex items-center justify-between font-bold"
                      >
                        <span className="flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                          View on Explorer
                        </span>
                        <HelpCircle className="w-3.5 h-3.5 text-[#14151A]/60" />
                      </a>
                      <a
                        href={`https://testnet.explorer.chain.robinhood.com/token/0x4F8BA593C4DB90bdb52309A7C278889ACBE89C5B`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full text-xs p-2 rounded-xl border border-[#14151A]/10 hover:bg-[#FFD94A]/40 transition-all flex items-center justify-between font-bold"
                      >
                        <span>$SPIN Token Contract</span>
                        <HelpCircle className="w-3.5 h-3.5 text-[#14151A]/60" />
                      </a>
                    </div>

                    <button
                      onClick={handleDisconnect}
                      className="w-full text-center text-xs font-bold text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors border border-red-200"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="sticker-btn bg-[#FF6B8A] hover:bg-[#ff5779] text-white px-5 py-2 text-xs md:text-sm tracking-wide flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Chunky 3-Bar Rounded Hamburger Icon */}
          <div className="md:hidden flex items-center gap-2">
            {currentAddress && (
              <span className="bg-[#E8F8EE] text-[#14151A] border border-[#14151A] text-[10px] font-bold px-2 py-1 rounded-full tabular-nums">
                {truncatedAddress}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 rounded-xl border-2 border-[#14151A] bg-[#FFD94A] shadow-[2px_2px_0px_#14151A] active:translate-x-0.5 active:translate-y-0.5"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-1 bg-[#14151A] rounded-full" />
                <span className="w-4 h-1 bg-[#14151A] rounded-full" />
                <span className="w-full h-1 bg-[#14151A] rounded-full" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Pastel Takeover Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#C9EEF2] flex flex-col p-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-6 border-b-2 border-[#14151A]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-[#14151A] overflow-hidden bg-white">
                <Image src="/spino-logo.jpg" alt="SPINO" fill className="object-cover" />
              </div>
              <span className="font-display font-black text-2xl text-[#14151A]">SPINO.fun</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full border-2 border-[#14151A] bg-[#FF6B8A] text-white flex items-center justify-center shadow-[2px_2px_0px_#14151A]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4 py-8">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="sticker-card p-4 text-center text-xl font-display font-black bg-white hover:bg-[#FFD94A] transition-colors"
            >
              🎡 Spin Wheels
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="sticker-card p-4 text-center text-xl font-display font-black bg-white hover:bg-[#C9B8FF] transition-colors"
            >
              📖 How It Works
            </Link>

            <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-[#14151A] shadow-[3px_4px_0px_#14151A]">
              <div className="text-xs font-bold uppercase text-[#14151A]/60 mb-2">
                Wallet State
              </div>
              {currentAddress ? (
                <div>
                  <div className="font-mono text-xs font-bold text-[#14151A] mb-3">
                    Connected: {currentAddress}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full sticker-btn bg-[#FF6B8A] text-white py-2 text-xs"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleConnectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full sticker-btn bg-[#FF6B8A] text-white py-3 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-xs font-bold text-[#14151A]/60">
            5-Minute Holding Gate • Automated ETH Payouts
          </div>
        </div>
      )}
    </>
  );
}
