"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Download,
  RefreshCw,
  Search,
  Lock,
  ExternalLink,
  Cpu,
  Zap,
  CheckCircle,
  Coins,
} from "lucide-react";
import { SPINO_CONFIG } from "@/config/spino";
import { PRESET_SIMULATED_WALLETS, useWalletSimulator } from "@/components/Web3Provider";

interface PayoutLog {
  id: string;
  wallet_address: string;
  spin_type: "holder" | "community";
  amount_won_usd: number;
  segment_label: string;
  holding_tier: 1 | 2 | 3 | null;
  balance_usd_at_spin: number;
  created_at: string;
  status: "paid" | "failed";
  paid_at: string;
  payout_tx_hash: string;
  payout_note: string;
}

interface PoolStats {
  date: string;
  totalPaidToday: number;
  dailyCap: number;
  isCapReached: boolean;
  remainingInCap: number;
  resetInSeconds: number;
}

export default function OpsPanelPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [claims, setClaims] = useState<PayoutLog[]>([]);
  const [pool, setPool] = useState<PoolStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"payouts" | "simulator">("payouts");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("spino_admin_auth");
    if (saved === SPINO_CONFIG.ADMIN_PASSCODE) {
      setPasscode(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === SPINO_CONFIG.ADMIN_PASSCODE) {
      sessionStorage.setItem("spino_admin_auth", passcode);
      setIsAuthenticated(true);
    } else {
      alert("Invalid Passcode");
    }
  };

  const fetchOpsData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/claims", {
        headers: { "x-admin-secret": passcode },
      });
      if (res.ok) {
        const data = await res.json();
        setClaims(data.claims || []);
        setPool(data.pool);
      }
    } catch (e) {
      console.error("Ops fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOpsData();
    }
  }, [isAuthenticated]);

  const handleDownloadCsv = () => {
    window.open(`/api/admin/export-csv?secret=${encodeURIComponent(passcode)}`, "_blank");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold mb-1">SPINO Operations Monitor</h2>
          <p className="text-xs text-slate-400 mb-6">
            Unlisted internal dashboard for viewing automated payout logs and treasury health.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Default: <code>spino-admin-2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Access Monitoring Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white underline">
              ← Return to public site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredLogs = claims.filter(
    (c) =>
      c.wallet_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.payout_tx_hash && c.payout_tx_hash.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                AUTOMATED PAYOUT ENGINE
              </span>
              <span className="text-xs text-slate-400">
                Treasury & Activity Monitoring
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              SPINO Operations & Audit Log
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={fetchOpsData}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold border border-slate-800 text-slate-300 transition-colors"
            >
              Public Site →
            </Link>
          </div>
        </div>

        {/* Global Pool Cap & Safety Rail Tracker */}
        {pool && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Daily Treasury Cap</div>
              <div className="text-2xl font-black text-white mt-1 tabular-nums">
                ${pool.dailyCap.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Global circuit breaker
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Automatically Paid Today</div>
              <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
                ${pool.totalPaidToday.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {((pool.totalPaidToday / pool.dailyCap) * 100).toFixed(1)}% of daily cap
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Remaining In Daily Cap</div>
              <div className="text-2xl font-black text-amber-400 mt-1 tabular-nums">
                ${pool.remainingInCap.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {pool.isCapReached ? "CAP REACHED - SPINS BLOCKED" : "Safety rail normal"}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Next UTC Midnight Reset</div>
              <div className="text-2xl font-black text-indigo-400 mt-1 tabular-nums">
                {Math.floor(pool.resetInSeconds / 3600)}h {Math.floor((pool.resetInSeconds % 3600) / 60)}m
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                UTC day: {pool.date}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-800 pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab("payouts")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "payouts"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Automated Payout Logs ({claims.length})
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === "simulator"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Test State Simulator
            </button>
          </div>

          {activeTab === "payouts" && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search wallet or tx hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 w-full sm:w-64"
              />
            </div>
          )}
        </div>

        {/* TAB 1: Automated Payout Logs */}
        {activeTab === "payouts" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {filteredLogs.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                No payout logs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase font-semibold text-[11px]">
                      <th className="p-4">Payout ID</th>
                      <th className="p-4">Recipient Wallet</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Balance at Spin</th>
                      <th className="p-4">Robinhood Chain Tx</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 text-slate-400 font-bold">{log.id}</td>
                        <td className="p-4">
                          <span className="text-white font-bold">{log.wallet_address}</span>
                        </td>
                        <td className="p-4 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              log.spin_type === "holder"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            }`}
                          >
                            {log.spin_type} {log.holding_tier ? `(T${log.holding_tier})` : ""}
                          </span>
                        </td>
                        <td className="p-4 font-sans font-black text-sm text-emerald-400">
                          ${log.amount_won_usd}
                        </td>
                        <td className="p-4 font-sans text-slate-300">
                          ${log.balance_usd_at_spin.toFixed(2)}
                        </td>
                        <td className="p-4 text-slate-300">
                          {log.payout_tx_hash ? (
                            <a
                              href={`${SPINO_CONFIG.EXPLORER_URL}/tx/${log.payout_tx_hash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <span>{log.payout_tx_hash.slice(0, 10)}...{log.payout_tx_hash.slice(-8)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-600">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-400 font-sans text-[11px]">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="p-4 text-right font-sans">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            AUTOMATED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Testing Simulator Controls */}
        {activeTab === "simulator" && <SimulatorPanel onUpdated={fetchOpsData} />}
      </div>
    </div>
  );
}

function SimulatorPanel({ onUpdated }: { onUpdated: () => void }) {
  const { selectSimulatedWallet } = useWalletSimulator();
  const [customAddress, setCustomAddress] = useState("0x4a189f3a52d9b23184cf281a9418e24185ad1942");
  const [balance, setBalance] = useState("120");
  const [holdingMinutes, setHoldingMinutes] = useState("45");
  const [tierLockChoice, setTierLockChoice] = useState<"none" | "1" | "2">("none");
  const [msg, setMsg] = useState<string | null>(null);

  const applyCustomSimulation = async () => {
    setMsg(null);
    try {
      const res = await fetch("/api/admin/simulate-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: customAddress,
          balanceUsd: parseFloat(balance),
          holdingMinutes: parseFloat(holdingMinutes),
          previousSpinTier: tierLockChoice === "none" ? null : parseInt(tierLockChoice),
          resetCooldowns: tierLockChoice === "none",
          verifyX: true,
        }),
      });
      if (res.ok) {
        setMsg("Wallet state updated in database. You can test spinning now!");
        onUpdated();
      }
    } catch (e: any) {
      setMsg("Error: " + e.message);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Rapid Test State Simulator
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Instantly set any wallet into Tier 1, Tier 2, Tier 3, 30-min holding countdown, or tier-locked state to test every single edge case without waiting 30 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presets */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase">
            1-Click Test Presets
          </div>
          <div className="space-y-2">
            {PRESET_SIMULATED_WALLETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  selectSimulatedWallet(p);
                  onUpdated();
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">{p.name}</div>
                  <div className="text-[11px] text-slate-400">{p.description}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase">
            Custom Parameter Tuning
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Wallet Address</label>
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Balance ($ USD)</label>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Holding (Minutes)</label>
              <input
                type="number"
                value={holdingMinutes}
                onChange={(e) => setHoldingMinutes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Simulate Prior Claim (Spin-Lock)</label>
            <select
              value={tierLockChoice}
              onChange={(e: any) => setTierLockChoice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="none">No prior spin (Eligible)</option>
              <option value="1">Claimed Tier 1 (Locked until Tier 2 / $50+)</option>
              <option value="2">Claimed Tier 2 (Locked until Tier 3 / $500+)</option>
            </select>
          </div>

          <button
            onClick={applyCustomSimulation}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-xs transition-colors"
          >
            Apply Custom State
          </button>

          {msg && (
            <div className="p-2 rounded bg-indigo-900/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
