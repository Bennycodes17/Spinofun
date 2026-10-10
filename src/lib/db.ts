import fs from "fs";
import path from "path";
import { SPINO_CONFIG } from "@/config/spino";

export interface WalletRecord {
  address: string; // Lowercase
  first_seen_above_threshold: string | null; // ISO timestamp when continuous hold >= $1 began
  last_balance_usd: number;
  last_balance_tokens: number;
  last_checked_at: string;
  holder_last_spin_at: string | null;
  holder_last_spin_tier: 1 | 2 | 3 | null; // To enforce tier advancement spin-lock
  holder_last_spin_balance_usd: number | null;
  community_last_spin_at: string | null;
  x_handle: string | null;
  x_verified_follow: boolean;
  x_verified_retweet: boolean;
  created_at: string;
}

export interface SpinClaim {
  id: string;
  wallet_address: string;
  spin_type: "holder" | "community";
  amount_won_usd: number;
  segment_label: string;
  segment_index: number;
  holding_tier: 1 | 2 | 3 | null;
  balance_usd_at_spin: number;
  created_at: string;
  status: "paid" | "pending_retry" | "failed";
  paid_at: string;
  payout_tx_hash: string;
  payout_note: string;
  payout_method: "automated_onchain" | "automated_simulated";
  eth_amount?: string;
  eth_price_usd?: number;
}

export interface DatabaseSchema {
  wallets: Record<string, WalletRecord>;
  claims: SpinClaim[];
  x_claims: Record<string, { claimed_at: string; wallet_address: string; x_handle: string }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "spino_database.json");

let dbCache: DatabaseSchema | null = null;

function ensureDbDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  // Production initial state: Empty clean ledger without fabricated wins
  return {
    wallets: {},
    claims: [],
    x_claims: {},
  };
}

export function loadDatabase(): DatabaseSchema {
  if (dbCache) return dbCache;

  ensureDbDirectory();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
    dbCache = initial;
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    dbCache = JSON.parse(raw) as DatabaseSchema;
    if (!dbCache.x_claims) {
      dbCache.x_claims = {};
    }
    if (!Array.isArray(dbCache.claims)) {
      dbCache.claims = [];
    }
    return dbCache;
  } catch (err) {
    console.error("Error reading database file, using clean fallback:", err);
    dbCache = getInitialData();
    return dbCache;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  dbCache = data;
  ensureDbDirectory();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

export function normalizeAddress(address: string): string {
  return (address || "").trim().toLowerCase();
}

export function getOrCreateWallet(rawAddress: string): WalletRecord {
  const address = normalizeAddress(rawAddress);
  const db = loadDatabase();

  if (db.wallets[address]) {
    return db.wallets[address];
  }

  const newWallet: WalletRecord = {
    address,
    first_seen_above_threshold: null,
    last_balance_usd: 0,
    last_balance_tokens: 0,
    last_checked_at: new Date().toISOString(),
    holder_last_spin_at: null,
    holder_last_spin_tier: null,
    holder_last_spin_balance_usd: null,
    community_last_spin_at: null,
    x_handle: null,
    x_verified_follow: false,
    x_verified_retweet: false,
    created_at: new Date().toISOString(),
  };

  db.wallets[address] = newWallet;
  saveDatabase(db);
  return newWallet;
}

/**
 * 1. Check live $SPIN balance -> convert to USD
 * 2. balance < $1 -> NOT_ELIGIBLE (reset continuous hold start timestamp to null)
 * 3. balance >= $1:
 *    - Track continuous-hold start timestamp
 *    - elapsed < 30 minutes -> PENDING, show live countdown ("Eligible in Xm Ys")
 *    - elapsed >= 30 minutes -> ELIGIBLE, proceed to tier check
 * 4. Determine tier:
 *    - Tier 1: $1 - $49.99
 *    - Tier 2: $50 - $499.99
 *    - Tier 3: $500+ (unlimited spins, 24h cooldown reset)
 * 5. Spin-lock rule (Tier 1 & 2 only):
 *    - After a claimed spin, wallet cannot spin again until balance exceeds CURRENT tier's upper bound (must move up a tier).
 *    - Tier 3 gets standard 24h cooldown per spin.
 */
export function updateWalletBalance(
  rawAddress: string,
  balanceTokens: number,
  priceUsd: number
): {
  wallet: WalletRecord;
  balanceUsd: number;
  eligibilityStatus: "NOT_ELIGIBLE" | "PENDING" | "ELIGIBLE" | "TIER_LOCKED" | "COOLDOWN";
  tier: 1 | 2 | 3 | null;
  holdingMinutes: number;
  holdingRequiredMinutes: number;
  countdownSeconds: number;
  tierLocked: boolean;
  tierLockReason: string | null;
  tier3CooldownSeconds: number;
  isFullyEligibleForHolderSpin: boolean;
} {
  const address = normalizeAddress(rawAddress);
  const db = loadDatabase();
  const wallet = db.wallets[address] || getOrCreateWallet(address);

  const balanceUsd = balanceTokens * priceUsd;
  const isAboveThreshold = balanceUsd >= SPINO_CONFIG.HOLD_USD_THRESHOLD;
  const now = new Date();
  const nowMs = now.getTime();

  // Continuous hold tracking: reset to null if balance drops below $1
  if (isAboveThreshold) {
    if (!wallet.first_seen_above_threshold) {
      wallet.first_seen_above_threshold = now.toISOString();
    }
  } else {
    wallet.first_seen_above_threshold = null;
  }

  wallet.last_balance_tokens = balanceTokens;
  wallet.last_balance_usd = balanceUsd;
  wallet.last_checked_at = now.toISOString();
  db.wallets[address] = wallet;
  saveDatabase(db);

  // 1. Balance < $1 check
  if (!isAboveThreshold) {
    return {
      wallet,
      balanceUsd,
      eligibilityStatus: "NOT_ELIGIBLE",
      tier: null,
      holdingMinutes: 0,
      holdingRequiredMinutes: SPINO_CONFIG.HOLD_DURATION_MINUTES,
      countdownSeconds: SPINO_CONFIG.HOLD_DURATION_MINUTES * 60,
      tierLocked: false,
      tierLockReason: null,
      tier3CooldownSeconds: 0,
      isFullyEligibleForHolderSpin: false,
    };
  }

  // 2. 10-Minute Hold Check
  const firstSeenMs = new Date(wallet.first_seen_above_threshold!).getTime();
  const elapsedMs = nowMs - firstSeenMs;
  const elapsedMinutes = Math.max(0, elapsedMs / (1000 * 60));
  const requiredMs = SPINO_CONFIG.HOLD_DURATION_MINUTES * 60 * 1000;

  if (elapsedMs < requiredMs) {
    const countdownSeconds = Math.ceil((requiredMs - elapsedMs) / 1000);
    return {
      wallet,
      balanceUsd,
      eligibilityStatus: "PENDING",
      tier: null,
      holdingMinutes: +elapsedMinutes.toFixed(1),
      holdingRequiredMinutes: SPINO_CONFIG.HOLD_DURATION_MINUTES,
      countdownSeconds,
      tierLocked: false,
      tierLockReason: null,
      tier3CooldownSeconds: 0,
      isFullyEligibleForHolderSpin: false,
    };
  }

  // 3. Determine Tier from current balance
  let tier: 1 | 2 | 3 = 1;
  if (balanceUsd >= SPINO_CONFIG.TIERS.TIER_3.minUsd) {
    tier = 3;
  } else if (balanceUsd >= SPINO_CONFIG.TIERS.TIER_2.minUsd) {
    tier = 2;
  } else {
    tier = 1;
  }

  // 4. Spin-lock rule check
  let tierLocked = false;
  let tierLockReason: string | null = null;
  let tier3CooldownSeconds = 0;

  if (wallet.holder_last_spin_tier === 1) {
    // Must move up a tier: balance must exceed Tier 1 upper bound ($50+)
    if (balanceUsd < SPINO_CONFIG.TIERS.TIER_2.minUsd) {
      tierLocked = true;
      tierLockReason = "Tier 1 spin claimed. Advance to Tier 2 ($50+) to unlock next spin!";
    }
  } else if (wallet.holder_last_spin_tier === 2) {
    // Must move up a tier: balance must exceed Tier 2 upper bound ($500+)
    if (balanceUsd < SPINO_CONFIG.TIERS.TIER_3.minUsd) {
      tierLocked = true;
      tierLockReason = "Tier 2 spin claimed. Advance to Tier 3 ($500+) to unlock next spin!";
    }
  }

  // Tier 3 Cooldown rule: 24h cooldown reset, unlimited spins
  if (tier === 3 && wallet.holder_last_spin_at) {
    const cooldownMs = SPINO_CONFIG.TIER3_COOLDOWN_HOURS * 3600 * 1000;
    const lastSpinMs = new Date(wallet.holder_last_spin_at).getTime();
    const diff = nowMs - lastSpinMs;
    if (diff < cooldownMs) {
      tier3CooldownSeconds = Math.ceil((cooldownMs - diff) / 1000);
    }
  }

  const isEligible = !tierLocked && tier3CooldownSeconds === 0;

  return {
    wallet,
    balanceUsd,
    eligibilityStatus: tierLocked
      ? "TIER_LOCKED"
      : tier3CooldownSeconds > 0
      ? "COOLDOWN"
      : "ELIGIBLE",
    tier,
    holdingMinutes: +elapsedMinutes.toFixed(1),
    holdingRequiredMinutes: SPINO_CONFIG.HOLD_DURATION_MINUTES,
    countdownSeconds: 0,
    tierLocked,
    tierLockReason,
    tier3CooldownSeconds,
    isFullyEligibleForHolderSpin: isEligible,
  };
}

/**
 * IP-based X Claim Checking
 */
export function hasIpClaimedX(ip: string): boolean {
  if (!ip) return false;
  const db = loadDatabase();
  return !!db.x_claims[ip.trim()];
}

export function recordIpClaimX(ip: string, walletAddress: string, xHandle: string): void {
  if (!ip) return;
  const db = loadDatabase();
  db.x_claims[ip.trim()] = {
    claimed_at: new Date().toISOString(),
    wallet_address: normalizeAddress(walletAddress),
    x_handle: xHandle || "",
  };
  saveDatabase(db);
}

/**
 * Daily Global Safety Rail Check
 * Calculated strictly from real recorded claims in the database
 */
export function getDailyPoolStats() {
  const db = loadDatabase();
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const todayPaid = db.claims.filter(
    (c) => c.status === "paid" && (c.paid_at || c.created_at).startsWith(todayStr)
  );

  const totalPaidToday = todayPaid.reduce((sum, c) => sum + c.amount_won_usd, 0);
  const cap = SPINO_CONFIG.DAILY_PAYOUT_CAP_USD;
  const isCapReached = totalPaidToday >= cap;
  const remainingInCap = Math.max(0, cap - totalPaidToday);

  const now = new Date();
  const nextReset = new Date();
  nextReset.setUTCHours(24, 0, 0, 0);
  const resetInSeconds = Math.max(0, Math.floor((nextReset.getTime() - now.getTime()) / 1000));

  const allConfirmed = db.claims.filter((c) => c.status === "paid");
  const totalAllTimePaid = allConfirmed.reduce((sum, c) => sum + c.amount_won_usd, 0);
  const totalSpinsCount = db.claims.length;
  const totalPaidCount = allConfirmed.length;

  return {
    date: todayStr,
    totalPaidToday,
    totalClaimedToday: totalPaidToday,
    totalAllTimePaid,
    totalSpinsCount,
    totalPaidCount,
    dailyCap: cap,
    isCapReached,
    remainingInCap,
    resetInSeconds,
  };
}

/**
 * Public recent paid wins
 * Sourced ONLY from real confirmed on-chain payouts
 */
export function getRecentPaidWins(limit = 10): Array<{
  id: string;
  walletTruncated: string;
  amountWonUsd: number;
  spinType: "holder" | "community";
  paidAt: string;
  status: "paid" | "pending_retry" | "failed";
  txHash: string;
  ethAmount?: string;
  payoutNote?: string;
}> {
  const db = loadDatabase();
  return db.claims
    .filter((c) => Boolean(c.amount_won_usd > 0))
    .sort((a, b) => new Date(b.paid_at || b.created_at).getTime() - new Date(a.paid_at || a.created_at).getTime())
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      walletTruncated: `${c.wallet_address.slice(0, 6)}...${c.wallet_address.slice(-4)}`,
      amountWonUsd: c.amount_won_usd,
      spinType: c.spin_type,
      paidAt: c.paid_at || c.created_at,
      status: c.status,
      txHash: c.payout_tx_hash,
      ethAmount: c.eth_amount,
      payoutNote: c.payout_note,
    }));
}

/**
 * Export claims to CSV for operational monitoring records
 */
export function exportClaimsCsv(): string {
  const db = loadDatabase();
  const headers = [
    "Payout ID",
    "Wallet Address",
    "Spin Type",
    "Amount USD",
    "ETH Amount",
    "Holding Tier",
    "Balance at Spin USD",
    "Paid At",
    "Transaction Hash",
    "Status",
    "Notes",
  ];

  const rows = db.claims.map((c) => [
    c.id,
    c.wallet_address,
    c.spin_type,
    c.amount_won_usd,
    c.eth_amount ?? "",
    c.holding_tier ?? "N/A",
    c.balance_usd_at_spin,
    c.paid_at,
    c.payout_tx_hash,
    c.status,
    `"${c.payout_note}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
