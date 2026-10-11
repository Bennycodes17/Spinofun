"use client";

// Polyfill crypto.randomUUID for non-localhost HTTP mobile environments
if (typeof window !== "undefined") {
  if (!window.crypto) {
    (window as any).crypto = {};
  }
  if (!window.crypto.randomUUID) {
    window.crypto.randomUUID = function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) as `${string}-${string}-${string}-${string}-${string}`;
    };
  }
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { SPINO_CONFIG } from "@/config/spino";
import { MobileWalletModal, isMobileDevice, isInAppBrowser } from "./MobileWalletModal";

// Robinhood Chain definition for Privy
export const robinhoodPrivyChain = {
  id: SPINO_CONFIG.CHAIN_ID,
  name: SPINO_CONFIG.CHAIN_NAME,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [SPINO_CONFIG.RPC_URL],
    },
    public: {
      http: [SPINO_CONFIG.RPC_FALLBACK_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Chain Explorer",
      url: SPINO_CONFIG.EXPLORER_URL,
    },
  },
};

export interface SimulatedWallet {
  id: string;
  name: string;
  address: string;
  tokens: number;
  balanceUsd: number;
  holdingMinutes: number;
  description: string;
  previousSpinTier?: 1 | 2 | 3;
}

export const PRESET_SIMULATED_WALLETS: SimulatedWallet[] = [
  {
    id: "tier1-ready",
    name: "Tier 1 Holder ($25 • 45m hold)",
    address: "0x4a189f3a52d9b23184cf281a9418e24185ad1942",
    tokens: 59523,
    balanceUsd: 25.0,
    holdingMinutes: 45,
    description: "Eligible for Tier 1 Holder Spin ($15–$35 wins)",
  },
  {
    id: "tier2-ready",
    name: "Tier 2 Dolphin ($180 • 1h hold)",
    address: "0x89205a3e3b2a69de6dbf7f01ed13b2108b2c43e7",
    tokens: 428571,
    balanceUsd: 180.0,
    holdingMinutes: 60,
    description: "Eligible for Tier 2 Holder Spin ($25–$65 wins)",
  },
  {
    id: "tier3-whale",
    name: "Tier 3 Whale ($950 • 2h hold)",
    address: "0xf492a831e5491cb89104fa285091cba9125da981",
    tokens: 2261904,
    balanceUsd: 950.0,
    holdingMinutes: 120,
    description: "Eligible for Tier 3 Unlimited Spins (24h cooldown reset)",
  },
  {
    id: "new-holder-waiting",
    name: "New Buyer (5m hold)",
    address: "0x12c984bfa910248cb1940125da910cb4912094aa",
    tokens: 35714,
    balanceUsd: 15.0,
    holdingMinutes: 5,
    description: "Above $1 threshold, in 30-min holding countdown",
  },
  {
    id: "below-threshold",
    name: "Under $1 ($0.40)",
    address: "0x334455667788990011223344556677889900aabb",
    tokens: 950,
    balanceUsd: 0.4,
    holdingMinutes: 0,
    description: "Ineligible: holds less than $1 minimum threshold",
  },
  {
    id: "tier1-spin-locked",
    name: "Tier 1 Claimed (Spin-Locked)",
    address: "0x778899aabbccddeeff0011223344556677889900",
    tokens: 71428,
    balanceUsd: 30.0,
    holdingMinutes: 90,
    previousSpinTier: 1,
    description: "Claimed Tier 1 spin; must advance to Tier 2 ($50+) to spin again",
  },
];

interface WalletSimulatorContextType {
  activeAddress: string | null;
  setActiveAddress: (addr: string | null) => void;
  isSimulated: boolean;
  selectedPreset: SimulatedWallet | null;
  selectSimulatedWallet: (preset: SimulatedWallet) => void;
  disconnectAll: () => void;
  openConnectModal: () => void;
}

const WalletSimulatorContext = createContext<WalletSimulatorContextType>({
  activeAddress: null,
  setActiveAddress: () => {},
  isSimulated: false,
  selectedPreset: null,
  selectSimulatedWallet: () => {},
  disconnectAll: () => {},
  openConnectModal: () => {},
});

export const useWalletSimulator = () => useContext(WalletSimulatorContext);

function Web3InnerProvider({ children }: { children: React.ReactNode }) {
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SimulatedWallet | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const { login } = usePrivy();

  useEffect(() => {
    const saved = localStorage.getItem("spino_sim_wallet");
    if (saved) {
      const match = PRESET_SIMULATED_WALLETS.find((p) => p.address.toLowerCase() === saved.toLowerCase());
      if (match) {
        setSelectedPreset(match);
        setActiveAddress(match.address);
      }
    }
  }, []);

  const selectSimulatedWallet = async (preset: SimulatedWallet) => {
    setSelectedPreset(preset);
    setActiveAddress(preset.address);
    localStorage.setItem("spino_sim_wallet", preset.address);

    try {
      await fetch("/api/admin/simulate-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: preset.address,
          balanceUsd: preset.balanceUsd,
          holdingMinutes: preset.holdingMinutes,
          previousSpinTier: preset.previousSpinTier || null,
          resetCooldowns: !preset.previousSpinTier,
          verifyX: true,
        }),
      });
    } catch (e) {
      console.error("Simulation sync error:", e);
    }
  };

  const disconnectAll = () => {
    setActiveAddress(null);
    setSelectedPreset(null);
    localStorage.removeItem("spino_sim_wallet");
  };

  const openConnectModal = () => {
    if (isMobileDevice() && !isInAppBrowser()) {
      setIsMobileModalOpen(true);
    } else {
      login();
    }
  };

  return (
    <WalletSimulatorContext.Provider
      value={{
        activeAddress,
        setActiveAddress,
        isSimulated: !!selectedPreset,
        selectedPreset,
        selectSimulatedWallet,
        disconnectAll,
        openConnectModal,
      }}
    >
      {children}
      <MobileWalletModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onOpenPrivy={() => {
          setIsMobileModalOpen(false);
          login();
        }}
      />
    </WalletSimulatorContext.Provider>
  );
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Safe fallback App ID (must be exactly 25 chars) for build/local verification before user configures PRIVY_APP_ID
  const appId =
    SPINO_CONFIG.PRIVY_APP_ID && SPINO_CONFIG.PRIVY_APP_ID.length === 25
      ? SPINO_CONFIG.PRIVY_APP_ID
      : "clxyzspinoappid0000000001";

  // Check if running in a secure HTTPS context or localhost (required by browsers for WebCrypto embedded wallets)
  const isSecureContext =
    typeof window !== "undefined"
      ? window.location.protocol === "https:" ||
        ["localhost", "127.0.0.1"].includes(window.location.hostname)
      : true;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        defaultChain: robinhoodPrivyChain,
        supportedChains: [robinhoodPrivyChain],
        appearance: {
          theme: "light",
          accentColor: "#FF6B8A",
          logo: "/spino-logo.jpg",
          walletList: ["detected_wallets", "metamask", "coinbase_wallet", "rainbow", "wallet_connect"],
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: isSecureContext ? "users-without-wallets" : "off",
          },
        },
        loginMethods: ["wallet", "email", "google", "twitter", "discord"],
      }}
    >
      <Web3InnerProvider>{children}</Web3InnerProvider>
    </PrivyProvider>
  );
}
