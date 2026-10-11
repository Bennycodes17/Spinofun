/**
 * Spinofun.online Core Configuration
 * Target EVM Network: Robinhood Chain (ETH)
 * Single wallet & payout system: Privy (EVM 4663 / 46630)
 */

export interface WheelSegment {
  id: string;
  label: string;
  amountUsd: number;
  weight: number; // Probability weight
  color: string;
  textColor?: string;
}

const isProduction = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
const networkEnv = (process.env.NEXT_PUBLIC_NETWORK || (isProduction ? "mainnet" : "testnet")).toLowerCase();
const isMainnet = networkEnv === "mainnet";

export const SPINO_CONFIG = {
  // Target EVM Network: Robinhood Chain (ETH)
  NETWORK_ENV: isMainnet ? ("mainnet" as const) : ("testnet" as const),
  CHAIN_ID: isMainnet ? 4663 : 46630, // 4663 = mainnet, 46630 = testnet
  CHAIN_NAME: isMainnet ? "Robinhood Chain" : "Robinhood Chain Testnet",
  NATIVE_CURRENCY: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  // RPC Endpoints
  // Use dedicated provider endpoint in production; public endpoint is local-dev fallback only
  RPC_URL: isMainnet
    ? (process.env.ROBINHOOD_CHAIN_RPC_URL || process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_RPC_URL || "https://rpc.mainnet.chain.robinhood.com")
    : (process.env.ROBINHOOD_CHAIN_RPC_URL_TESTNET || process.env.NEXT_PUBLIC_ROBINHOOD_CHAIN_RPC_URL_TESTNET || "https://rpc.testnet.chain.robinhood.com"),
  RPC_FALLBACK_URL: isMainnet
    ? "https://rpc.mainnet.chain.robinhood.com"
    : "https://rpc.testnet.chain.robinhood.com",

  // Block Explorer URLs
  EXPLORER_URL: isMainnet
    ? "https://explorer.chain.robinhood.com"
    : "https://testnet.explorer.chain.robinhood.com",

  // Token Specification
  TOKEN_NAME: "SPINO",
  TOKEN_SYMBOL: "$SPIN",
  // Real token contract address on Robinhood Chain (User input required for production)
  TOKEN_CONTRACT: (process.env.SPIN_TOKEN_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_SPIN_TOKEN_CONTRACT_ADDRESS || "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") as `0x${string}`,
  TOKEN_DECIMALS: 18,

  // Privy Configuration
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID || process.env.PRIVY_APP_ID || "",
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET || "",
  PRIVY_SERVER_WALLET_ID: process.env.PRIVY_SERVER_WALLET_ID || "",

  // Privy Server Wallet Enforced Policy Safeguards
  SERVER_WALLET_POLICY: {
    MAX_ETH_PER_TX: 0.05, // e.g. Max ~$150 USD per tx at ~$3000/ETH
    MAX_ETH_PER_DAY: 0.5, // e.g. Max ~$1500 USD per day
    ALLOWED_TX_TYPES: ["NATIVE_TRANSFER"], // Native ETH transfers only (no arbitrary contract calls)
  },

  // Eligibility Gates (Hold requirements)
  HOLD_USD_THRESHOLD: 5.0, // Minimum $5.00 USD equivalent of $SPIN required
  HOLD_DURATION_MINUTES: 5, // 5 minutes continuous holding required
  TIER3_COOLDOWN_HOURS: 24, // 24 hours cooldown reset for Tier 3 unlimited spins
  COMMUNITY_SPIN_COOLDOWN_HOURS: 24, // 24 hours cooldown for X Community Spin

  // Global Caps & Safety Rail
  DAILY_PAYOUT_CAP_USD: 1000, // Maximum automated payouts per UTC day

  // Ops Monitoring Passcode & Unlisted Slug
  OPS_PANEL_SLUG: "ops-panel-7f2a",
  ADMIN_PASSCODE: process.env.ADMIN_PASSCODE || "spino-admin-2026",

  // Social Verification Targets
  X_TARGET_HANDLE: "@SpinoFun",
  X_TARGET_TWEET_ID: "1890000000000000000",
  X_COMMUNITY_FLAT_REWARD_USD: 5,

  // Baseline $SPIN price in USD (fallback if live DEX quote is temporarily unreachable)
  DEFAULT_SPIN_PRICE_USD: 0.00042,

  // Holding Tier Bands & Rewards
  TIERS: {
    TIER_1: {
      id: 1,
      name: "Tier 1 Holder",
      minUsd: 5.0,
      maxUsd: 49.99,
      rewardRange: "$15 - $35",
      badgeColor: "#C9B8FF", // Lilac
      spinLockRule: "Must advance to Tier 2 ($50+) to unlock next spin",
      segments: [
        { id: "t1-1", label: "$15", amountUsd: 15, weight: 35, color: "#FFD94A", textColor: "#14151A" },
        { id: "t1-2", label: "$20", amountUsd: 20, weight: 25, color: "#FF6B8A", textColor: "#FFFFFF" },
        { id: "t1-3", label: "$18", amountUsd: 18, weight: 15, color: "#C9B8FF", textColor: "#14151A" },
        { id: "t1-4", label: "$25", amountUsd: 25, weight: 12, color: "#C9EEF2", textColor: "#14151A" },
        { id: "t1-5", label: "$22", amountUsd: 22, weight: 7, color: "#E8F8EE", textColor: "#14151A" },
        { id: "t1-6", label: "$30", amountUsd: 30, weight: 4, color: "#FFD94A", textColor: "#14151A" },
        { id: "t1-7", label: "$28", amountUsd: 28, weight: 1.8, color: "#FF6B8A", textColor: "#FFFFFF" },
        { id: "t1-8", label: "★ $35 ★", amountUsd: 35, weight: 0.2, color: "#14151A", textColor: "#FFD94A" }, // Jackpot
      ] as WheelSegment[],
    },
    TIER_2: {
      id: 2,
      name: "Tier 2 Dolphin",
      minUsd: 50.0,
      maxUsd: 499.99,
      rewardRange: "$25 - $65",
      badgeColor: "#FFD94A", // Yellow
      spinLockRule: "Must advance to Tier 3 ($500+) to unlock next spin",
      segments: [
        { id: "t2-1", label: "$25", amountUsd: 25, weight: 32, color: "#FFD94A", textColor: "#14151A" },
        { id: "t2-2", label: "$30", amountUsd: 30, weight: 26, color: "#C9EEF2", textColor: "#14151A" },
        { id: "t2-3", label: "$35", amountUsd: 35, weight: 18, color: "#FF6B8A", textColor: "#FFFFFF" },
        { id: "t2-4", label: "$40", amountUsd: 40, weight: 12, color: "#C9B8FF", textColor: "#14151A" },
        { id: "t2-5", label: "$45", amountUsd: 45, weight: 6, color: "#E8F8EE", textColor: "#14151A" },
        { id: "t2-6", label: "$50", amountUsd: 50, weight: 4, color: "#FFD94A", textColor: "#14151A" },
        { id: "t2-7", label: "$55", amountUsd: 55, weight: 1.8, color: "#FF6B8A", textColor: "#FFFFFF" },
        { id: "t2-8", label: "★ $65 ★", amountUsd: 65, weight: 0.2, color: "#14151A", textColor: "#FFD94A" }, // Jackpot
      ] as WheelSegment[],
    },
    TIER_3: {
      id: 3,
      name: "Tier 3 Whale",
      minUsd: 500.0,
      maxUsd: Infinity,
      rewardRange: "$40 - $100",
      badgeColor: "#FF6B8A", // Coral
      spinLockRule: "Unlimited spins with standard 24h cooldown reset",
      segments: [
        { id: "t3-1", label: "$40", amountUsd: 40, weight: 30, color: "#C9B8FF", textColor: "#14151A" },
        { id: "t3-2", label: "$45", amountUsd: 45, weight: 25, color: "#FFD94A", textColor: "#14151A" },
        { id: "t3-3", label: "$50", amountUsd: 50, weight: 20, color: "#C9EEF2", textColor: "#14151A" },
        { id: "t3-4", label: "$60", amountUsd: 60, weight: 13, color: "#FF6B8A", textColor: "#FFFFFF" },
        { id: "t3-5", label: "$70", amountUsd: 70, weight: 6, color: "#E8F8EE", textColor: "#14151A" },
        { id: "t3-6", label: "$80", amountUsd: 80, weight: 3.5, color: "#FFD94A", textColor: "#14151A" },
        { id: "t3-7", label: "$90", amountUsd: 90, weight: 2, color: "#C9B8FF", textColor: "#14151A" },
        { id: "t3-8", label: "★ $100 ★", amountUsd: 100, weight: 0.5, color: "#14151A", textColor: "#FFD94A" }, // Jackpot
      ] as WheelSegment[],
    },
  },

  // X Community Spin Wheel Segments ($5 flat reward)
  COMMUNITY_SEGMENTS: [
    { id: "c-1", label: "$5 CASH", amountUsd: 5, weight: 50, color: "#FFD94A", textColor: "#14151A" },
    { id: "c-2", label: "$5 DROP", amountUsd: 5, weight: 25, color: "#C9B8FF", textColor: "#14151A" },
    { id: "c-3", label: "$5 WIN", amountUsd: 5, weight: 15, color: "#C9EEF2", textColor: "#14151A" },
    { id: "c-4", label: "$5 CLAIM", amountUsd: 5, weight: 7, color: "#E8F8EE", textColor: "#14151A" },
    { id: "c-5", label: "$5 BOOST", amountUsd: 5, weight: 2.5, color: "#FF6B8A", textColor: "#FFFFFF" },
    { id: "c-6", label: "★ $5 JACKPOT ★", amountUsd: 5, weight: 0.5, color: "#14151A", textColor: "#FFD94A" },
  ] as WheelSegment[],
} as const;
