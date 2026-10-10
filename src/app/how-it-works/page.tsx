"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { Footer } from "@/components/Footer";
import { SquiggleUnderline } from "@/components/SquiggleUnderline";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Trophy,
  Coins,
  Twitter,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { SPINO_CONFIG } from "@/config/spino";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen relative flex flex-col pt-20 md:pt-22">
      <Navbar />
      <div className="w-full mt-1.5 md:mt-2 mb-2">
        <MarqueeStrip />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full relative z-10 flex-1">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="sticker-badge bg-[#FFD94A] text-[#14151A] -rotate-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% TRANSPARENT RULES
            </span>
            <span className="sticker-badge bg-[#E8F8EE] text-emerald-900 rotate-1">
              AUTOMATIC WALLET PAYOUTS
            </span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-[#14151A] tracking-tight">
            How SPINO.fun <span className="text-[#FF6B8A] inline-block">Works</span>
          </h1>
          <div className="w-48 mx-auto">
            <SquiggleUnderline className="text-[#FF6B8A]" />
          </div>

          {/* Official Core Statement from Spec */}
          <div className="mt-6 p-6 rounded-3xl bg-white border-[2.5px] border-[#14151A] shadow-[4px_6px_0px_#14151A] max-w-2xl mx-auto text-base md:text-lg text-[#14151A] font-bold leading-relaxed">
            “Hold at least $5 of $SPIN for 5 minutes, then spin. Your reward depends on how much you hold. Once you've claimed a spin, hold more to unlock the next tier — or reach our top tier for unlimited spins every 24 hours. Winners are verified and paid automatically, straight to your wallet.”
          </div>
        </div>

        {/* The 4 Core Rules Collage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Rule 1 */}
          <div className="sticker-card p-6 bg-white relative">
            <div className="w-8 h-8 rounded-full bg-[#FFD94A] border-2 border-[#14151A] flex items-center justify-center font-display font-black text-base shadow-[2px_2px_0px_#14151A] mb-3">
              1
            </div>
            <h3 className="font-display font-black text-xl text-[#14151A] mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#FF6B8A]" />
              $5.00 USD Dynamic Gate
            </h3>
            <p className="text-sm text-[#14151A]/80 leading-relaxed">
              We never hardcode a fixed token quantity because $SPIN floats on DEXs. Our live oracle queries the pair price and calculates how many tokens equal <strong>$5.00 USD</strong> in real time.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="sticker-card p-6 bg-[#FAF0EE] relative">
            <div className="w-8 h-8 rounded-full bg-[#FF6B8A] text-white border-2 border-[#14151A] flex items-center justify-center font-display font-black text-base shadow-[2px_2px_0px_#14151A] mb-3">
              2
            </div>
            <h3 className="font-display font-black text-xl text-[#14151A] mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#14151A]" />
              5-Minute Continuous Hold
            </h3>
            <p className="text-sm text-[#14151A]/80 leading-relaxed">
              When your wallet crosses the $5.00 threshold, your timer begins. You must hold continuously for <strong>5 minutes</strong> to become eligible. If your balance drops below $5 at any time, the timer resets to zero.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="sticker-card p-6 bg-[#E8F8EE] relative">
            <div className="w-8 h-8 rounded-full bg-[#C9B8FF] text-[#14151A] border-2 border-[#14151A] flex items-center justify-center font-display font-black text-base shadow-[2px_2px_0px_#14151A] mb-3">
              3
            </div>
            <h3 className="font-display font-black text-xl text-[#14151A] mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
              Tiered Progression & Spin-Locks
            </h3>
            <p className="text-sm text-[#14151A]/80 leading-relaxed">
              Reward ranges scale with holding amount:
            </p>
            <ul className="text-xs font-bold text-[#14151A] mt-2 space-y-1.5">
              <li>• <strong>Tier 1 ($5 – $49 held):</strong> Win $15 – $35. After spinning, hold more to reach Tier 2 to unlock your next spin.</li>
              <li>• <strong>Tier 2 ($50 – $499 held):</strong> Win $25 – $65. After spinning, advance to Tier 3 to unlock your next spin.</li>
              <li>• <strong>Tier 3 ($500+ held):</strong> Win $40 – $100 with <strong>unlimited spins</strong> on a standard 24-hour cooldown reset!</li>
            </ul>
          </div>

          {/* Rule 4 */}
          <div className="sticker-card p-6 bg-[#C9EEF2]/40 relative">
            <div className="w-8 h-8 rounded-full bg-[#14151A] text-white border-2 border-[#14151A] flex items-center justify-center font-display font-black text-base shadow-[2px_2px_0px_#14151A] mb-3">
              4
            </div>
            <h3 className="font-display font-black text-xl text-[#14151A] mb-2 flex items-center gap-2">
              <Twitter className="w-5 h-5 text-[#14151A]" />
              X Community Spin ($5 Flat)
            </h3>
            <p className="text-sm text-[#14151A]/80 leading-relaxed">
              Don’t hold $SPIN yet? You can still participate in the Community Wheel! Follow {SPINO_CONFIG.X_TARGET_HANDLE} and retweet our pinned post to claim a single device reward of $5.
            </p>
          </div>
        </div>

        {/* Automatic Payout Transparency Card */}
        <div className="sticker-card p-6 md:p-8 bg-white mb-12 relative">
          <div className="washi-tape" />
          <div className="flex items-center gap-2 mb-2">
            <span className="sticker-badge bg-emerald-600 text-white">
              <Zap className="w-3.5 h-3.5" />
              AUTOMATED PAYOUT ENGINE
            </span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-[#14151A] mb-3">
            Instant Automatic Payouts to Your Wallet
          </h2>
          <div className="space-y-3 text-sm text-[#14151A]/85 leading-relaxed">
            <p>
              When you spin the wheel, the server determines your winning segment authoritatively. Once verified, the payout transaction is broadcast automatically to your wallet on Robinhood Chain (ETH).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF0EE] border-2 border-[#14151A]">
                <div className="font-display font-black text-lg text-[#14151A]">1. Spin & Verify</div>
                <div className="text-xs text-[#14151A]/70 mt-1">
                  Server verifies balance, 5-min hold, and tier status.
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#E8F8EE] border-2 border-[#14151A]">
                <div className="font-display font-black text-lg text-emerald-800">2. Instant Broadcast</div>
                <div className="text-xs text-[#14151A]/70 mt-1">
                  Transaction is dispatched automatically to your connected address.
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#C9EEF2] border-2 border-[#14151A]">
                <div className="font-display font-black text-lg text-[#14151A]">3. On-Chain Receipt</div>
                <div className="text-xs text-[#14151A]/70 mt-1">
                  Your live transaction hash is displayed with a Robinhood Chain explorer link.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Caps and Cooldowns */}
        <div className="sticker-card p-6 md:p-8 bg-[#FFD94A]/20 border-2 border-[#14151A] mb-12">
          <h3 className="font-display font-black text-2xl text-[#14151A] mb-4">
            Safety Rail & Cooldowns
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center items-stretch">
            <div className="bg-white p-4 rounded-2xl border-2 border-[#14151A] shadow-[2px_3px_0px_#14151A] flex flex-col justify-center items-center">
              <div className="font-display font-black text-2xl text-[#FF6B8A] tabular-nums">
                5 Mins
              </div>
              <div className="text-xs font-bold text-[#14151A]/70 uppercase mt-1">
                Holding Gate
              </div>
              <div className="text-[11px] text-[#14151A]/60 mt-1">
                Continuous hold above $1.00 USD
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-[#14151A] shadow-[2px_3px_0px_#14151A] flex flex-col justify-center items-center">
              <div className="font-display font-black text-2xl text-[#14151A] leading-tight">
                Daily Safety Rail
              </div>
              <div className="text-[11px] text-[#14151A]/60 mt-2">
                Daily treasury payout cap; resets every UTC midnight
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-[#14151A] shadow-[2px_3px_0px_#14151A] flex flex-col justify-center items-center">
              <div className="font-display font-black text-2xl text-[#FF6B8A] tabular-nums">
                24 Hours
              </div>
              <div className="text-xs font-bold text-[#14151A]/70 uppercase mt-1">
                Tier 3 Reset
              </div>
              <div className="text-[11px] text-[#14151A]/60 mt-1">
                Top tier enjoys unlimited spins with 24h reset
              </div>
            </div>
          </div>
        </div>

        {/* Return to Spin Button */}
        <div className="text-center">
          <Link
            href="/"
            className="sticker-btn inline-flex items-center gap-2 bg-[#FF6B8A] hover:bg-[#ff5577] text-white px-8 py-4 text-lg"
          >
            <span>Ready to Spin? Go to Wheel</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
