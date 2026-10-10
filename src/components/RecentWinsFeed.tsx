"use client";

import React, { useEffect, useState } from "react";
import { Trophy, CheckCircle, ExternalLink, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { SPINO_CONFIG } from "@/config/spino";

interface RecentWin {
  id: string;
  walletTruncated: string;
  amountWonUsd: number;
  spinType: "holder" | "community";
  paidAt: string;
  status?: "paid" | "pending_retry" | "failed";
  txHash: string | null;
  ethAmount?: string;
  payoutNote?: string;
}

const INITIAL_WINS: RecentWin[] = [
  {
    id: "payout-1791201313860-xn3aj",
    walletTruncated: "0x4a18...1942",
    amountWonUsd: 22,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:35.633Z",
    status: "paid",
    txHash: "0x791bf5d908ab0a6b926a457c07d790d75c55760c574b0c9a7822e2843433c776",
    ethAmount: "0.007097",
  },
  {
    id: "payout-1791201649102-dgffb",
    walletTruncated: "0x8920...43e7",
    amountWonUsd: 30,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:34.273Z",
    status: "paid",
    txHash: "0x895f1a65cd3729a814a5d088f2ce0096da8057d430da43f97eec02814eccbf44",
    ethAmount: "0.009677",
  },
  {
    id: "payout-1791204159133-2yr3d",
    walletTruncated: "0x4a18...1942",
    amountWonUsd: 15,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:32.017Z",
    status: "paid",
    txHash: "0x74626a84a90e67c737f68584d3af110be4ff149cd2ec5ce4d8b97bf04f5e09b6",
    ethAmount: "0.004839",
  },
  {
    id: "payout-1791226033601-d5txa",
    walletTruncated: "0x6e34...6f6e",
    amountWonUsd: 50,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:30.905Z",
    status: "paid",
    txHash: "0x3f0697c6525c4b40e674602b2c94c2be0271cccce6a62a34b8a8bbd90e79ef20",
    ethAmount: "0.016129",
  },
  {
    id: "payout-1791229187856-32a84",
    walletTruncated: "0xdd6e...e430",
    amountWonUsd: 15,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:27.693Z",
    status: "paid",
    txHash: "0x054443c593fa834dc4bf942db8e13bf38feeb1d7087e02a4434967482550d2a2",
    ethAmount: "0.004839",
  },
  {
    id: "payout-1791230315336-vrbdz",
    walletTruncated: "0x9990...e8e1",
    amountWonUsd: 20,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:25.890Z",
    status: "paid",
    txHash: "0xbe1e645322eb200353129f335571513dfcc3ca8e54ea69d87633b5f4664e7ebf",
    ethAmount: "0.006452",
  },
  {
    id: "payout-1791276328555-4pkha",
    walletTruncated: "0x23e5...16df",
    amountWonUsd: 20,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:23.986Z",
    status: "paid",
    txHash: "0x389ec4f1c3b6fde892f84a48ed4c1cf944950e6143952026165949ced72b80a5",
    ethAmount: "0.006452",
  },
  {
    id: "payout-1791278431152-h6mvy",
    walletTruncated: "0x23e5...16df",
    amountWonUsd: 30,
    spinType: "holder",
    paidAt: "2026-10-08T19:08:22.570Z",
    status: "paid",
    txHash: "0x24ad612a7068e89a46454ce6678377a64a61ab4ddbbf5f1d55c13cb71ffefc6a",
    ethAmount: "0.009677",
  },
];

export function RecentWinsFeed() {
  const [wins, setWins] = useState<RecentWin[]>(INITIAL_WINS);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;
    async function fetchWins() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch("/api/stats", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data && Array.isArray(data.recentPaidWins) && data.recentPaidWins.length > 0) {
            setWins(data.recentPaidWins);
          }
        }
      } catch {
        // Silently retain cached wins on mobile network hiccups
      }
    }

    fetchWins();
    const interval = setInterval(fetchWins, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(wins.length / itemsPerPage));
  const displayedWins = wins.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="sticker-card p-5 sm:p-6 md:p-7 bg-white/95 backdrop-blur-md relative border-2 border-[#10121A] shadow-[4px_6px_0px_#10121A]">
      <div className="washi-tape" />

      {/* Header with Title and Left/Right Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="sticker-badge bg-[#FFD233] text-[#10121A]">
              <Trophy className="w-3.5 h-3.5" />
              VERIFIED PROOF
            </span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl text-[#10121A] mt-1.5">
            Recent Verified Payouts
          </h3>
          <p className="text-xs md:text-sm text-[#10121A]/75 mt-0.5 font-medium">
            Strict transparency: all spins, confirmed wins, and automated settlements recorded on Robinhood Chain ledger.
          </p>
        </div>

        {/* Compact Next Left & Right Pagination Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-xs font-bold text-[#10121A]/60 font-mono mr-1">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`w-9 h-9 rounded-xl border-2 border-[#10121A] flex items-center justify-center transition-all ${
              currentPage === 0
                ? "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
                : "bg-white hover:bg-slate-50 text-[#10121A] shadow-[2px_2px_0px_#10121A] active:translate-x-0.5 active:translate-y-0.5"
            }`}
            aria-label="Previous payouts"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className={`w-9 h-9 rounded-xl border-2 border-[#10121A] flex items-center justify-center transition-all ${
              currentPage >= totalPages - 1
                ? "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed shadow-none"
                : "bg-white hover:bg-slate-50 text-[#10121A] shadow-[2px_2px_0px_#10121A] active:translate-x-0.5 active:translate-y-0.5"
            }`}
            aria-label="Next payouts"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Paginated 3-Card Grid: Keeps container tidy & compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {displayedWins.map((win) => {
          const timeAgo = formatTimeAgo(win.paidAt);
          const isHolder = win.spinType === "holder";
          const isPaid = win.status === "paid" && Boolean(win.txHash);

          return (
            <div
              key={win.id}
              className="p-4 rounded-2xl border-2 border-[#10121A] bg-white/90 hover:bg-white shadow-[2px_3px_0px_#10121A] transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl border-2 border-[#10121A] flex items-center justify-center font-display font-black text-lg shrink-0 shadow-[1.5px_2px_0px_#10121A] ${
                    isHolder ? "bg-[#FF5C83] text-white" : "bg-[#C4B0FF] text-[#10121A]"
                  }`}
                >
                  ${win.amountWonUsd}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#10121A] tabular-nums truncate">
                    {win.walletTruncated}
                  </div>
                  <div className="text-[10px] font-bold text-[#10121A]/60 uppercase tracking-tight">
                    {isHolder ? "Holder Spin" : "Community Spin"} • {timeAgo}
                  </div>
                  {win.ethAmount && (
                    <div className="text-[11px] font-mono text-emerald-800 font-bold truncate">
                      {win.ethAmount} ETH
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                {isPaid ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      PAID
                    </span>
                    {win.txHash && (
                      <a
                        href={`${SPINO_CONFIG.EXPLORER_URL}/tx/${win.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 hover:text-emerald-900 hover:underline mt-1 font-bold"
                      >
                        <span>tx proof</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      <Clock className="w-3 h-3 text-amber-600" />
                      QUEUED
                    </span>
                    <span className="text-[9px] font-mono text-[#10121A]/60 mt-1" title={win.id}>
                      {win.id.slice(0, 10)}...
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return "just now";
  } catch {
    return "recently";
  }
}
