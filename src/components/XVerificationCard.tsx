"use client";

import React, { useState } from "react";
import { Check, ExternalLink, ShieldCheck, Twitter, Sparkles, AlertCircle } from "lucide-react";
import { SPINO_CONFIG } from "@/config/spino";

interface XVerificationCardProps {
  walletAddress: string;
  isVerified: boolean;
  onVerifiedSuccess: () => void;
}

export function XVerificationCard({
  walletAddress,
  isVerified,
  onVerifiedSuccess,
}: XVerificationCardProps) {
  const [handle, setHandle] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      setErrorMsg("Please connect wallet first");
      return;
    }
    if (!handle) {
      setErrorMsg("Please enter your X username");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/x-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          handle,
          tweetUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Verification failed");
      } else {
        setStatusMsg(data.message);
        if (data.status === "verified") {
          onVerifiedSuccess();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticker-card p-5 md:p-6 bg-white relative">
      <div className="flex items-center justify-between mb-3">
        <span className="sticker-badge bg-[#14151A] text-white">
          <Twitter className="w-3.5 h-3.5 fill-white" />
          COMMUNITY GATE
        </span>
        {isVerified ? (
          <span className="sticker-badge bg-[#E8F8EE] text-emerald-800">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            UNLOCKED
          </span>
        ) : (
          <span className="sticker-badge bg-[#FFD94A] text-[#14151A]">
            FLAT $5 REWARD
          </span>
        )}
      </div>

      <h4 className="font-display font-black text-xl text-[#14151A] mb-1">
        Unlock X Community Spin
      </h4>
      <p className="text-xs text-[#14151A]/80 mb-4">
        Support the $SPIN movement on X to claim a 24h Community Spin reward!
      </p>

      {/* Step 1 & 2 Action Links */}
      <div className="space-y-2 mb-4">
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl border-2 border-[#14151A] bg-[#C9EEF2]/40 hover:bg-[#C9EEF2] transition-colors text-xs font-bold text-[#14151A]"
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#14151A] text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Follow {SPINO_CONFIG.X_TARGET_HANDLE} on X</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl border-2 border-[#14151A] bg-[#FFD94A]/40 hover:bg-[#FFD94A] transition-colors text-xs font-bold text-[#14151A]"
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#14151A] text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Retweet Pinned Announcement</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {isVerified ? (
        <div className="p-3 bg-[#E8F8EE] rounded-xl border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>X Verification complete! Community wheel is unlocked below.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-black uppercase text-[#14151A]/70 mb-1">
              Your X @Handle
            </label>
            <input
              type="text"
              placeholder="@username"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border-2 border-[#14151A] bg-[#FAF0EE] focus:bg-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !walletAddress}
            className="w-full sticker-btn bg-[#FF6B8A] hover:bg-[#ff5577] text-white py-2 text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            {isLoading ? "Verifying..." : "Verify & Unlock Wheel"}
          </button>

          {statusMsg && (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              {statusMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
              {errorMsg}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
