"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, CheckCircle2, Flame } from "lucide-react";
import { SPINO_CONFIG } from "@/config/spino";

interface HoldingCountdownProps {
  initialSecondsRemaining: number;
  holdingMinutesElapsed: number;
  balanceUsd: number;
  firstSeenTimestamp: string | null;
  onTimerComplete?: () => void;
  compact?: boolean;
}

export function HoldingCountdown({
  initialSecondsRemaining,
  holdingMinutesElapsed,
  balanceUsd,
  firstSeenTimestamp,
  onTimerComplete,
  compact = false,
}: HoldingCountdownProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSecondsRemaining);
  const totalRequiredMinutes = SPINO_CONFIG.HOLD_DURATION_MINUTES;
  const totalRequiredSeconds = totalRequiredMinutes * 60;
  const timerFiredRef = useRef(false);

  useEffect(() => {
    setSecondsRemaining(initialSecondsRemaining);
    timerFiredRef.current = false;
  }, [initialSecondsRemaining]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      if (!timerFiredRef.current && onTimerComplete) {
        timerFiredRef.current = true;
        // Schedule outside current React execution stack to prevent setState-during-render errors
        setTimeout(() => {
          onTimerComplete();
        }, 100);
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, onTimerComplete]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Real-time dynamic progress calculation synced with the ticking second
  const liveElapsedSeconds = Math.max(0, totalRequiredSeconds - secondsRemaining);
  const liveMinutesElapsed = Math.min(totalRequiredMinutes, +(liveElapsedSeconds / 60).toFixed(1));
  const progressPercent = Math.min(
    100,
    Math.max(0, (liveElapsedSeconds / totalRequiredSeconds) * 100)
  );

  return (
    <div className="sticker-card p-5 sm:p-6 bg-white/95 backdrop-blur-md relative overflow-hidden border-2 border-[#14151A] shadow-[4px_6px_0px_#14151A]">
      {/* Decorative Washi Tape */}
      <div className="washi-tape" />

      {/* Header Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sticker-badge bg-[#FFD94A] text-[#14151A] text-[10px] sm:text-xs">
            <Clock className="w-3 h-3" />
            HOLDING GATE ACTIVE
          </span>
          <span className="sticker-badge bg-[#E8F8EE] text-emerald-800 text-[10px] sm:text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ${balanceUsd.toFixed(2)} USD (≥ $5.00 GATE)
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-display font-black text-xl sm:text-2xl text-[#14151A] leading-tight">
          Eligible to spin in{" "}
          <span className="text-[#FF6B8A] tabular-nums underline decoration-wavy decoration-[#FF6B8A]">
            {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
          </span>
        </h3>
        <p className="text-xs text-[#14151A]/75 mt-1 font-medium">
          Hold at least $5 for <strong>{totalRequiredMinutes} continuous minutes</strong> to unlock your tier reward.
        </p>
      </div>

      {/* Live Countdown Digits Matrix */}
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto my-4 text-center">
        <div className="bg-white/90 border-2 border-[#14151A] rounded-2xl p-3 shadow-[2px_2px_0px_#14151A]">
          <div className="font-display font-black text-3xl sm:text-4xl text-[#14151A] tabular-nums">
            {minutes}
          </div>
          <div className="text-[10px] font-bold text-[#14151A]/60 uppercase tracking-wider mt-0.5">
            Minutes
          </div>
        </div>
        <div className="bg-white/90 border-2 border-[#14151A] rounded-2xl p-3 shadow-[2px_2px_0px_#14151A]">
          <div className="font-display font-black text-3xl sm:text-4xl text-[#FF6B8A] tabular-nums">
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="text-[10px] font-bold text-[#14151A]/60 uppercase tracking-wider mt-0.5">
            Seconds
          </div>
        </div>
      </div>

      {/* Live Progress Bar (Updates every second automatically) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-black text-[#14151A]">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#FF6B8A]" />
            Hold Time: {liveMinutesElapsed}m / {totalRequiredMinutes}m
          </span>
          <span className="tabular-nums font-mono text-emerald-800">{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 bg-slate-100 border-2 border-[#14151A] rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#FFD94A] via-[#FF6B8A] to-[#C9B8FF] rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
