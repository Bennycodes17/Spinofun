"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWalletSimulator, PRESET_SIMULATED_WALLETS } from "@/components/Web3Provider";
import { Navbar } from "@/components/Navbar";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { Footer } from "@/components/Footer";
import { SquiggleUnderline } from "@/components/SquiggleUnderline";
import { Wheel } from "@/components/Wheel";
import { HoldingCountdown } from "@/components/HoldingCountdown";
import { RecentWinsFeed } from "@/components/RecentWinsFeed";
import { SPINO_CONFIG } from "@/config/spino";
import { getSegmentsForTier } from "@/lib/spinEngine";
import {
  Wallet,
  Sparkles,
  Clock,
  Trophy,
  AlertTriangle,
  RefreshCw,
  Zap,
  Lock,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface WalletStatus {
  address: string;
  balanceTokens: number;
  balanceUsd: number;
  tokenPriceUsd: number;
  tokensForOneDollar: number;
  eligibilityStatus: "NOT_ELIGIBLE" | "PENDING" | "ELIGIBLE" | "TIER_LOCKED" | "COOLDOWN";
  tier: 1 | 2 | 3 | null;
  tierConfig: any;
  holdingMinutes: number;
  holdingRequiredMinutes: number;
  countdownSeconds: number;
  tierLocked: boolean;
  tierLockReason: string | null;
  tier3CooldownSeconds: number;
  isFullyEligibleForHolderSpin: boolean;
  isEligibleForCommunitySpin: boolean;
  ipAlreadyClaimedX: boolean;
  xStatus: {
    handle: string | null;
    verifiedFollow: boolean;
    verifiedRetweet: boolean;
  };
}

export default function HomePage() {
  const { authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();
  const {
    activeAddress,
    isSimulated,
    selectedPreset,
    selectSimulatedWallet,
    connectWallet,
  } = useWalletSimulator();

  const realAddress = user?.wallet?.address || wallets?.[0]?.address || null;
  const currentAddress = activeAddress || (authenticated ? realAddress : null);

  const [walletStatus, setWalletStatus] = useState<WalletStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const fetchWalletStatus = async () => {
    if (!currentAddress) {
      setWalletStatus(null);
      return;
    }
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/wallet/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: currentAddress,
          balanceTokens: selectedPreset ? selectedPreset.tokens : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWalletStatus(data);
      }
    } catch (e) {
      console.error("Status fetch failed:", e);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchWalletStatus();
  }, [currentAddress, selectedPreset]);

  const activeTier = walletStatus?.tier || 1;
  const currentSegments = getSegmentsForTier(activeTier);
  const isEligible = Boolean(walletStatus?.isFullyEligibleForHolderSpin);
  const tierName = SPINO_CONFIG.TIERS[`TIER_${activeTier}`]?.name || "Bronze";
  const tierBadgeColor = SPINO_CONFIG.TIERS[`TIER_${activeTier}`]?.badgeColor || "#C4B0FF";

  return (
    <main className="min-h-screen relative flex flex-col pt-24 sm:pt-26 md:pt-28">
      <Navbar />

      {/* Marquee Strip with Clean Spacing */}
      <div className="w-full mt-3.5 sm:mt-4 mb-3 sm:mb-4">
        <MarqueeStrip />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6 w-full relative z-10 flex-1 space-y-6 md:space-y-8">
        
        {/* =========================================================================
            HEADER BAR: Playful, High-Energy Brand Headline & Live Oracle Bar
           ========================================================================= */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {/* Pills / Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="sticker-badge bg-[#C4B0FF] text-[#10121A] -rotate-1">
              5-MIN HOLDING GATE
            </span>
            <span className="sticker-badge bg-[#E0F7E9] text-emerald-900 rotate-1 flex items-center gap-1 font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              AUTOMATED PAYOUTS
            </span>
            <span className="sticker-badge bg-[#FFD233] text-[#10121A] -rotate-2">
              $5.00 DYNAMIC GATE
            </span>
          </div>

          {/* Chunky Sticker Title */}
          <div>
            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-[#10121A] tracking-tight leading-[1.08]">
              Hold. Spin. <span className="text-[#FF5C83] inline-block">Win ETH.</span>
            </h1>
            <div className="w-40 sm:w-60 mx-auto mt-1">
              <SquiggleUnderline className="text-[#FF5C83]" strokeWidth={3.5} />
            </div>
          </div>

          <p className="text-xs sm:text-sm md:text-base font-semibold text-[#10121A]/80 max-w-xl mx-auto leading-relaxed">
            The rewards wheel protocol for genuine token holders. Hold at least $5 for 5 continuous minutes, spin, and receive instant payouts directly to your wallet.
          </p>

          {/* Quick Oracle Stats Strip */}
          <div className="inline-flex items-center justify-center pt-1 text-xs font-bold">
            <div className="bg-[#E0F7E9] border-2 border-[#10121A] rounded-xl px-4 py-1.5 shadow-[2px_2px_0px_#10121A] flex items-center gap-2 text-emerald-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ROBINHOOD CHAIN • INSTANT SETTLEMENT</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN WORKSTATION LAYOUT:
            Desktop: 2 Columns (Left Sidebar: 5 cols | Right Wheel Arena: 7 cols)
            Mobile: Stacked (Right Wheel Arena First, Left Sidebar Controls Second)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* =======================================================================
              LEFT CORNER SIDEBAR CONTAINER (Desktop: 5 cols, Mobile: Order 2)
              Contains all controls, wallet details, holding timers & card info
             ======================================================================= */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4 w-full">
            
            {/* 1. WALLET & CONTROL CONSOLE CARD */}
            <div className="sticker-card p-5 bg-white/95 backdrop-blur-md relative border-2 border-[#10121A] shadow-[4px_5px_0px_#10121A] space-y-4">
              <div className="washi-tape" />

              <div className="flex items-center justify-between">
                <span className="sticker-badge bg-[#FF5C83] text-white">
                  PLAYER CONSOLE
                </span>
                {currentAddress ? (
                  <span className="sticker-badge bg-[#E0F7E9] text-emerald-900 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                ) : (
                  <span className="sticker-badge bg-rose-100 text-rose-800">
                    DISCONNECTED
                  </span>
                )}
              </div>

              {currentAddress ? (
                <div className="space-y-3 pt-1">
                  {/* Address & Status Pill */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border-2 border-[#10121A]/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#C4B0FF] border-2 border-[#10121A] flex items-center justify-center font-display font-black text-sm shadow-[1.5px_1.5px_0px_#10121A] shrink-0">
                        💳
                      </div>
                      <div>
                        <div className="font-mono text-xs font-bold text-[#10121A]">
                          {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}
                        </div>
                        <div className="text-[10px] font-bold text-[#10121A]/60 uppercase">
                          Robinhood Chain
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={fetchWalletStatus}
                      disabled={loadingStatus}
                      className="sticker-btn bg-white hover:bg-slate-50 text-[#10121A] p-2 text-xs flex items-center gap-1"
                      title="Refresh Balance & Verification"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {/* Balance Display */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#10121A] shadow-[2px_2px_0px_#10121A]">
                      <div className="text-[10px] font-bold text-[#10121A]/60 uppercase">
                        Holding USD
                      </div>
                      <div className="font-display font-black text-xl text-[#10121A] mt-0.5">
                        ${walletStatus ? walletStatus.balanceUsd.toFixed(2) : "0.00"}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border-2 border-[#10121A] shadow-[2px_2px_0px_#10121A]">
                      <div className="text-[10px] font-bold text-[#10121A]/60 uppercase">
                        Tokens Held
                      </div>
                      <div className="font-mono font-bold text-xs sm:text-sm text-[#10121A] truncate mt-1">
                        {walletStatus ? walletStatus.balanceTokens.toLocaleString() : "0"} $SPIN
                      </div>
                    </div>
                  </div>

                  {/* Simulator Quick Switcher (If in simulation mode) */}
                  {isSimulated && (
                    <div className="pt-2 border-t border-[#10121A]/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-[#10121A]/60">
                        Scenario: {selectedPreset?.name || "Custom"}
                      </span>
                      <button
                        onClick={() => {
                          const nextIndex =
                            (PRESET_SIMULATED_WALLETS.findIndex((p) => p.id === selectedPreset?.id) + 1) %
                            PRESET_SIMULATED_WALLETS.length;
                          selectSimulatedWallet(PRESET_SIMULATED_WALLETS[nextIndex]);
                        }}
                        className="sticker-btn bg-[#FFD233] hover:bg-[#ffe066] text-[#10121A] px-3 py-1 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#10121A]" />
                        <span>Next Preset</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-[#10121A]/80 font-medium leading-relaxed">
                    Connect your Web3 wallet to read your continuous holding duration, check tier eligibility, and spin for instant rewards.
                  </p>
                  <button
                    onClick={() => connectWallet()}
                    className="sticker-btn w-full bg-[#FF5C83] hover:bg-[#ff4772] text-white py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-[3px_4px_0px_#10121A]"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet to Begin</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. HOLDING GATE & VERIFICATION CARD */}
            {currentAddress && walletStatus && (
              <div className="space-y-3">
                {/* A. Ineligible State (< $5 held) */}
                {walletStatus.eligibilityStatus === "NOT_ELIGIBLE" && (
                  <div className="sticker-card p-5 bg-white/95 backdrop-blur-md space-y-3 border-2 border-[#10121A] shadow-[4px_5px_0px_#10121A]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 border-2 border-[#10121A] text-rose-600 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#10121A]">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-lg text-[#10121A]">
                          Gate Threshold Not Met
                        </h4>
                        <div className="text-xs text-[#10121A]/70 font-semibold">
                          Requires ≥ $5.00 USD of $SPIN
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#10121A]/80 leading-relaxed font-medium">
                      Your balance is currently <strong>${walletStatus.balanceUsd.toFixed(2)} USD</strong>. Add at least{" "}
                      <strong>{Math.max(0, Math.round(walletStatus.tokensForOneDollar * 5 - walletStatus.balanceTokens)).toLocaleString()} $SPIN</strong> to activate the 5-minute holding timer.
                    </p>
                  </div>
                )}

                {/* B. 5-Minute Continuous Holding Countdown Active */}
                {walletStatus.eligibilityStatus === "PENDING" && (
                  <HoldingCountdown
                    initialSecondsRemaining={walletStatus.countdownSeconds}
                    holdingMinutesElapsed={walletStatus.holdingMinutes}
                    balanceUsd={walletStatus.balanceUsd}
                    firstSeenTimestamp={null}
                    onTimerComplete={fetchWalletStatus}
                    compact
                  />
                )}

                {/* C. Spin-Locked State (Tier Advancement Required) */}
                {walletStatus.tierLocked && (
                  <div className="sticker-card p-5 bg-[#FFD233]/25 border-2 border-[#10121A] shadow-[4px_5px_0px_#10121A] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFD233] border-2 border-[#10121A] text-[#10121A] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#10121A]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-lg text-[#10121A]">
                          Tier Spin Claimed!
                        </h4>
                        <div className="text-xs font-semibold text-[#10121A]/70">
                          Progression Lock Active
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#10121A]/80 leading-relaxed font-medium">
                      {walletStatus.tierLockReason}. Increase your tokens held to advance to the next tier and unlock your next reward.
                    </p>
                  </div>
                )}

                {/* D. Fully Eligible & Ready to Spin */}
                {walletStatus.isFullyEligibleForHolderSpin && (
                  <div className="sticker-card p-5 bg-[#E0F7E9] border-2 border-[#10121A] shadow-[4px_5px_0px_#10121A] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="sticker-badge bg-emerald-600 text-white font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        5-MIN HOLD VERIFIED
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-900">
                        Tier {activeTier} Active
                      </span>
                    </div>
                    <h4 className="font-display font-black text-xl text-emerald-950">
                      You are eligible to spin!
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Win <strong>{SPINO_CONFIG.TIERS[`TIER_${activeTier}`].rewardRange}</strong> sent automatically to your connected wallet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. TIER ROADMAP & MULTIPLIER CARD */}
            <div className="sticker-card p-5 bg-white/95 backdrop-blur-md relative border-2 border-[#10121A] shadow-[4px_5px_0px_#10121A] space-y-3.5">
              <div className="washi-tape" />

              <div className="flex items-center justify-between">
                <span className="sticker-badge bg-[#FF5C83] text-white">
                  REWARD TIERS
                </span>
                <span className="sticker-badge bg-[#E0F7E9] text-emerald-900 flex items-center gap-1 font-bold">
                  <Trophy className="w-3.5 h-3.5 text-emerald-700" />
                  3 TIERS
                </span>
              </div>

              <div>
                <h4 className="font-display font-black text-lg text-[#10121A]">
                  Holding Progression Matrix
                </h4>
                <p className="text-[11px] text-[#10121A]/70 font-medium">
                  Higher token balances unlock higher-value reward wheels.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {/* Tier 1 */}
                <div
                  className={`p-3.5 rounded-2xl border-2 transition-all ${
                    activeTier === 1 && currentAddress
                      ? "bg-[#C4B0FF]/35 border-[#10121A] shadow-[2px_2px_0px_#10121A]"
                      : "bg-[#F8FAFC] border-[#10121A]/20"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="flex items-center gap-1.5 text-[#10121A]">
                      <span>🥉 Tier 1: Bronze</span>
                      {activeTier === 1 && currentAddress && (
                        <span className="text-[9px] bg-[#10121A] text-white px-1.5 py-0.2 rounded-full font-sans">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[#FF5C83] font-display text-sm">$15 – $35 Win</span>
                  </div>
                  <div className="text-[10px] text-[#10121A]/70 mt-1 flex items-center justify-between font-medium">
                    <span>$5 – $49 USD Held</span>
                    <span>Advance to $50+ for Tier 2</span>
                  </div>
                </div>

                {/* Tier 2 */}
                <div
                  className={`p-3.5 rounded-2xl border-2 transition-all ${
                    activeTier === 2 && currentAddress
                      ? "bg-[#FFD233]/35 border-[#10121A] shadow-[2px_2px_0px_#10121A]"
                      : "bg-[#F8FAFC] border-[#10121A]/20"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="flex items-center gap-1.5 text-[#10121A]">
                      <span>🥈 Tier 2: Silver</span>
                      {activeTier === 2 && currentAddress && (
                        <span className="text-[9px] bg-[#10121A] text-white px-1.5 py-0.2 rounded-full font-sans">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[#FF5C83] font-display text-sm">$25 – $65 Win</span>
                  </div>
                  <div className="text-[10px] text-[#10121A]/70 mt-1 flex items-center justify-between font-medium">
                    <span>$50 – $499 USD Held</span>
                    <span>Advance to $500+ for Tier 3</span>
                  </div>
                </div>

                {/* Tier 3 */}
                <div
                  className={`p-3.5 rounded-2xl border-2 transition-all ${
                    activeTier === 3 && currentAddress
                      ? "bg-[#FF5C83]/25 border-[#10121A] shadow-[2px_2px_0px_#10121A]"
                      : "bg-[#F8FAFC] border-[#10121A]/20"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="flex items-center gap-1.5 text-[#10121A]">
                      <span>🥇 Tier 3: Gold Whale</span>
                      {activeTier === 3 && currentAddress && (
                        <span className="text-[9px] bg-[#10121A] text-white px-1.5 py-0.2 rounded-full font-sans">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[#FF5C83] font-display text-sm">$40 – $100 Win</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold mt-1 flex items-center justify-between">
                    <span>$500+ USD Held</span>
                    <span>★ 24H Cooldown Reset ★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================================================
              RIGHT ARENA CONTAINER (Desktop: 7 cols, Mobile: Order 1)
              Holds the Interactive Wheel, Spin Button & Outcome Celebration
             ======================================================================= */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center w-full">
            <div className="sticker-card p-5 sm:p-7 md:p-8 bg-white/95 backdrop-blur-md relative border-2 border-[#10121A] shadow-[5px_7px_0px_#10121A] w-full flex flex-col items-center">
              <div className="washi-tape" />

              {/* Clean Single Wheel Header */}
              <div className="flex items-center justify-center w-full mb-4">
                <h3 className="font-display font-black text-2xl text-[#10121A] tracking-tight">
                  {tierName} Rewards Wheel
                </h3>
              </div>

              {/* Interactive Wheel Component */}
              <Wheel
                type="holder"
                segments={currentSegments}
                tierTitle={`${tierName} Wheel`}
                tierBadgeColor={tierBadgeColor}
                isEligible={isEligible}
                cooldownSeconds={walletStatus?.tier3CooldownSeconds || 0}
                walletAddress={currentAddress}
                onSpinSuccess={fetchWalletStatus}
                onConnectWallet={connectWallet}
                disabledReason={
                  !currentAddress
                    ? "CONNECT WALLET TO SPIN"
                    : walletStatus?.eligibilityStatus === "NOT_ELIGIBLE"
                    ? "HOLD ≥ $5.00 TO UNLOCK"
                    : walletStatus?.eligibilityStatus === "PENDING"
                    ? `HOLDING GATE: ${Math.floor((walletStatus?.countdownSeconds || 0) / 60)}M REMAINING`
                    : walletStatus?.tierLocked
                    ? (walletStatus?.tierLockReason || "TIER ADVANCEMENT REQUIRED")
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: Full-Width Recent Verified Payouts Feed
           ========================================================================= */}
        <div id="recent-wins" className="pt-2">
          <RecentWinsFeed />
        </div>
      </div>

      <Footer />
    </main>
  );
}
