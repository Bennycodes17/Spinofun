"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Clock, Coins, Zap } from "lucide-react";

interface StatsData {
  totalPaidOutTodayUsd: number;
  totalClaimedTodayUsd: number;
  dailyCapUsd: number;
  remainingInCapUsd: number;
  resetInSeconds: number;
  tokenPriceUsd: number;
  tokensForOneDollar: number;
}

export function MarqueeStrip() {
  const [stats, setStats] = useState<StatsData>({
    totalPaidOutTodayUsd: 202,
    totalClaimedTodayUsd: 202,
    dailyCapUsd: 1000,
    remainingInCapUsd: 798,
    resetInSeconds: 14400,
    tokenPriceUsd: 0.00042,
    tokensForOneDollar: 2381,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch("/api/stats", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data && typeof data.totalPaidOutTodayUsd === "number") {
            setStats(data);
          }
        }
      } catch {
        // Silently retain cached stats on mobile network hiccups to avoid dev overlay popup
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const totalPaid = stats?.totalPaidOutTodayUsd ?? 0;
  const resetHours = stats ? Math.floor(stats.resetInSeconds / 3600) : 24;
  const resetMinutes = stats ? Math.floor((stats.resetInSeconds % 3600) / 60) : 0;
  const tokensForFiveDollars = stats?.tokensForOneDollar
    ? Math.round(stats.tokensForOneDollar * 5).toLocaleString()
    : null;

  const marqueeItem = (
    <div className="flex items-center gap-8 px-6 text-xs md:text-sm font-bold tracking-wide uppercase">
      <span className="flex items-center gap-1.5 text-[#14151A]">
        <Sparkles className="w-3.5 h-3.5 text-[#FF6B8A]" />
        {totalPaid > 0 ? (
          <>
            $SPINO PAID TODAY: <span className="tabular-nums font-black text-[#FF6B8A]">${totalPaid.toLocaleString()}</span>
          </>
        ) : (
          <span className="text-[#14151A] font-black">$SPINO REWARDS: <span className="text-[#FF6B8A]">LIVE ON ROBINHOOD CHAIN</span></span>
        )}
      </span>
      <span className="text-[#14151A]/40">•</span>
      <span className="flex items-center gap-1.5 text-[#14151A]">
        <Clock className="w-4 h-4 text-[#14151A]" />
        SAFETY RESET IN: <span className="tabular-nums font-black">{resetHours}H {resetMinutes}M</span>
      </span>
      <span className="text-[#14151A]/40">•</span>
      <span className="flex items-center gap-1.5 text-[#14151A]">
        <Clock className="w-4 h-4 text-[#14151A]" />
        5-MIN HOLDING GATE
      </span>
      <span className="text-[#14151A]/40">•</span>
      {tokensForFiveDollars && (
        <>
          <span className="flex items-center gap-1.5 text-[#14151A]">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            $5 THRESHOLD: <span className="tabular-nums font-black">{tokensForFiveDollars} $SPIN</span>
          </span>
          <span className="text-[#14151A]/40">•</span>
        </>
      )}
      <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-widest flex items-center gap-1 shadow-sm">
        <Zap className="w-3 h-3" />
        AUTOMATIC WALLET PAYOUTS
      </span>
      <span className="text-[#14151A]/40">•</span>
    </div>
  );

  return (
    <div className="w-full bg-[#FFD94A] border-y-2 border-[#14151A] py-2 overflow-hidden shadow-sm relative z-20">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {marqueeItem}
        {marqueeItem}
        {marqueeItem}
      </div>
    </div>
  );
}
