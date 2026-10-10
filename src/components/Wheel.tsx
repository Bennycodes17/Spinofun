"use client";

import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { WheelSegment, SPINO_CONFIG } from "@/config/spino";
import { Sparkles, Trophy, Clock, CheckCircle, CheckCircle2, AlertCircle, ExternalLink, Zap, Wallet } from "lucide-react";
import Image from "next/image";
interface WheelProps {
  type: "holder" | "community";
  segments: WheelSegment[];
  tierTitle?: string;
  tierBadgeColor?: string;
  isEligible: boolean;
  cooldownSeconds: number;
  walletAddress: string | null;
  onSpinSuccess?: (payoutId: string, amount: number) => void;
  onConnectWallet?: () => void;
  disabledReason?: string;
}

export function Wheel({
  type,
  segments,
  tierTitle,
  tierBadgeColor = "#FFD94A",
  isEligible,
  cooldownSeconds,
  walletAddress,
  onSpinSuccess,
  onConnectWallet,
  disabledReason,
}: WheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [outcomeResult, setOutcomeResult] = useState<{
    amount: number;
    label: string;
    payoutId: string;
    payoutTxHash: string;
    message: string;
    ethAmount?: string;
    explorerUrl?: string | null;
    status?: "paid" | "pending_retry";
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentRotation, setCurrentRotation] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Synthesize realistic ticker tick sound via Web Audio API
  const playTickSound = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      if (audioContextRef.current) {
        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800 + Math.random() * 200, audioContextRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);
        osc.start();
        osc.stop(audioContextRef.current.currentTime + 0.04);
      }
    } catch (e) {
      // Audio autoplay may be disabled, fail silently
    }
  };

  const handleSpinClick = async () => {
    if (!walletAddress) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }
    if (!isEligible || cooldownSeconds > 0) return;
    if (isSpinning || isVerifying) return;

    setIsSpinning(true);
    setErrorMessage(null);
    setOutcomeResult(null);

    try {
      // 1. CALL SERVER FIRST: Server Authoritative Selection & Automatic Payout Dispatch
      const endpoint = type === "holder" ? "/api/spin/holder" : "/api/spin/community";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to trigger spin");
        setIsSpinning(false);
        return;
      }

      const { outcome, payoutId, payoutTxHash, message, ethAmount, explorerUrl, status } = data;
      const targetAngle = outcome.targetAngle;

      const spins = 5 + Math.floor(Math.random() * 2);
      const finalAngle = currentRotation + (spins * 360) + (360 - targetAngle);

      // Play interval ticks while spinning
      let tickInterval: NodeJS.Timeout | null = null;
      let tickRate = 50;
      tickInterval = setInterval(() => {
        playTickSound();
      }, tickRate);

      // 2. ANIMATE WHEEL WITH CSS HARDWARE ACCELERATION
      setCurrentRotation(finalAngle);
      await new Promise((resolve) => setTimeout(resolve, 4800));

      if (tickInterval) clearInterval(tickInterval);
      setIsSpinning(false);

      // Brief post-spin verification window
      setIsVerifying(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsVerifying(false);

      // 3. CELEBRATION EFFECTS
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#FF6B8A", "#FFD94A", "#C9B8FF", "#C9EEF2"],
      });

      setOutcomeResult({
        amount: outcome.amountWonUsd,
        label: outcome.label,
        payoutId,
        payoutTxHash,
        message,
        ethAmount,
        explorerUrl: explorerUrl || (payoutTxHash ? `${SPINO_CONFIG.EXPLORER_URL}/tx/${payoutTxHash}` : null),
        status: status || (payoutTxHash ? "paid" : "pending_retry"),
      });

      if (onSpinSuccess) {
        onSpinSuccess(payoutId, outcome.amountWonUsd);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error occurred during spin");
      setIsSpinning(false);
      setIsVerifying(false);
    }
  };

  // Build SVG Path for segments
  const numSegments = segments.length;
  const anglePerSegment = 360 / numSegments;
  const radius = 175;
  const center = 200;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">

      {/* Wheel Stage with Physical Chunky Border & Pointer */}
      <div className="relative w-[340px] h-[340px] md:w-[380px] md:h-[380px] flex items-center justify-center p-3">
        {/* Pointer / Needle at Top */}
        <div className="absolute -top-3 z-30 flex flex-col items-center">
          <div className="w-8 h-10 bg-[#FF6B8A] border-[2.5px] border-[#14151A] rounded-b-lg shadow-[2px_3px_0px_#14151A] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white border border-[#14151A]" />
          </div>
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-[#FF6B8A] -mt-0.5 filter drop-shadow-[0_2px_1px_rgba(20,21,26,0.3)]" />
        </div>

        {/* Outer Wheel Shadow & Rim */}
        <div className="relative w-full h-full rounded-full border-[5px] border-[#14151A] bg-[#14151A] shadow-[6px_9px_0px_rgba(20,21,26,0.25)] p-1 overflow-hidden">
          {/* Rotating Wheel Group */}
          <div
            className="w-full h-full rounded-full relative"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: isSpinning
                ? "transform 4.8s cubic-bezier(0.15, 0.9, 0.25, 1)"
                : "none",
            }}
          >
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full transform -rotate-90"
            >
              {segments.map((seg, i) => {
                const startAngle = (i * anglePerSegment * Math.PI) / 180;
                const endAngle = ((i + 1) * anglePerSegment * Math.PI) / 180;

                const x1 = center + radius * Math.cos(startAngle);
                const y1 = center + radius * Math.sin(startAngle);
                const x2 = center + radius * Math.cos(endAngle);
                const y2 = center + radius * Math.sin(endAngle);

                const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                const midAngle = startAngle + (endAngle - startAngle) / 2;
                const labelRadius = radius * 0.65;
                const labelX = center + labelRadius * Math.cos(midAngle);
                const labelY = center + labelRadius * Math.sin(midAngle);
                const degAngle = (midAngle * 180) / Math.PI + 90;

                return (
                  <g key={seg.id || i}>
                    <path
                      d={pathData}
                      fill={seg.color}
                      stroke="#14151A"
                      strokeWidth="3"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      fill={seg.textColor || "#14151A"}
                      fontSize={numSegments > 7 ? "15" : "18"}
                      fontWeight="900"
                      fontFamily="var(--font-display), Fredoka, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${degAngle}, ${labelX}, ${labelY})`}
                      className="select-none pointer-events-none drop-shadow-sm"
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Decorative Segment Boundary Pegs */}
            {segments.map((_, i) => {
              const pegAngle = (i * anglePerSegment * Math.PI) / 180 - Math.PI / 2;
              const pegX = 50 + 46 * Math.cos(pegAngle);
              const pegY = 50 + 46 * Math.sin(pegAngle);
              return (
                <div
                  key={`peg-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full bg-white border-[1.5px] border-[#14151A] shadow-sm transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${pegX}%`, top: `${pegY}%` }}
                />
              );
            })}
          </div>

          {/* Golden Center Hub / SPINO Medallion */}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full border-[3px] border-[#14151A] bg-[#FFD94A] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),2px_3px_0px_#14151A] flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#14151A] bg-white">
              <Image src="/spino-logo.jpg" alt="SPINO" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Notice Window */}
      {isVerifying && (
        <div className="mt-4 p-3 rounded-2xl bg-[#C9B8FF] border-2 border-[#14151A] shadow-[3px_3px_0px_#14151A] text-xs font-bold text-[#14151A] flex items-center gap-2 animate-pulse w-full justify-center">
          <Zap className="w-4 h-4 text-[#14151A] animate-bounce" />
          <span>Verifying your spin... your reward will be sent automatically to your wallet.</span>
        </div>
      )}

      {/* Spin CTA Button */}
      <div className="mt-5 w-full flex flex-col items-center">
        <button
          onClick={() => {
            if (!walletAddress) {
              if (onConnectWallet) onConnectWallet();
              return;
            }
            handleSpinClick();
          }}
          disabled={Boolean(walletAddress) && (!isEligible || cooldownSeconds > 0 || isSpinning || isVerifying)}
          className={`sticker-btn w-full py-3.5 px-6 text-base md:text-lg tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
            isSpinning || isVerifying
              ? "bg-[#C4B0FF] text-[#10121A] cursor-wait"
              : !walletAddress
              ? "bg-[#FF5C83] hover:bg-[#ff4772] text-white active:scale-95 cursor-pointer shadow-[3px_4px_0px_#10121A]"
              : isEligible && cooldownSeconds === 0
              ? "bg-[#FF5C83] hover:bg-[#ff4772] text-white active:scale-95 shadow-[3px_4px_0px_#10121A]"
              : "bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isSpinning ? (
            <>
              <div className="w-5 h-5 border-2 border-[#10121A] border-t-transparent rounded-full animate-spin" />
              <span>SPINNING WHEEL...</span>
            </>
          ) : isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-[#10121A] border-t-transparent rounded-full animate-spin" />
              <span>VERIFYING & PAYING...</span>
            </>
          ) : cooldownSeconds > 0 ? (
            <>
              <Clock className="w-5 h-5" />
              <span>
                NEXT SPIN IN {Math.floor(cooldownSeconds / 3600)}H {Math.floor((cooldownSeconds % 3600) / 60)}M
              </span>
            </>
          ) : !walletAddress ? (
            <>
              <Wallet className="w-5 h-5" />
              <span>CONNECT WALLET TO SPIN</span>
            </>
          ) : isEligible ? (
            <>
              <Sparkles className="w-5 h-5 text-[#FFD233]" />
              <span>SPIN FOR REWARDS</span>
            </>
          ) : (
            <span>{disabledReason || "HOLD 5M TO UNLOCK"}</span>
          )}
        </button>

        {errorMessage && (
          <div className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 w-full text-center">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Automatic Confirmation Modal with Transaction Hash */}
      {outcomeResult && (
        <div className={`mt-4 w-full p-4 rounded-2xl border-2 border-[#14151A] shadow-[3px_4px_0px_#14151A] animate-in fade-in zoom-in-95 ${
          outcomeResult.status === "paid" ? "bg-[#E8F8EE]" : "bg-[#FFF9E6]"
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 font-display font-black text-lg ${
              outcomeResult.status === "paid" ? "text-emerald-800" : "text-amber-900"
            }`}>
              <Trophy className="w-6 h-6 text-[#FF6B8A]" />
              YOU WON {outcomeResult.label}!
            </div>
            {outcomeResult.status === "paid" ? (
              <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                PAID AUTOMATICALLY
              </span>
            ) : (
              <span className="bg-amber-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Clock className="w-3 h-3" />
                WIN SAVED • QUEUED IN POOL
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-[#14151A] mt-1.5 leading-relaxed">
            {outcomeResult.message}
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#14151A]/20 flex flex-col gap-1.5 text-[11px]">
            <div className="flex items-center justify-between font-mono text-[#14151A]/70">
              <span>Payout ID:</span>
              <span className="font-bold">{outcomeResult.payoutId}</span>
            </div>
            {outcomeResult.ethAmount && (
              <div className="flex items-center justify-between font-mono text-[#14151A]/80">
                <span>ETH Payout:</span>
                <span className="font-bold text-emerald-800">{outcomeResult.ethAmount} ETH</span>
              </div>
            )}
            {outcomeResult.payoutTxHash ? (
              <div className="flex items-center justify-between font-mono text-[#14151A]">
                <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  On-Chain Tx:
                </span>
                <a
                  href={outcomeResult.explorerUrl || `${SPINO_CONFIG.EXPLORER_URL}/tx/${outcomeResult.payoutTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  {outcomeResult.payoutTxHash.slice(0, 10)}...{outcomeResult.payoutTxHash.slice(-8)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                Settlement queued. Server automated wallet requires funding to broadcast tx. Your win ID is locked in the verified protocol ledger.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
