import { SPINO_CONFIG } from "@/config/spino";
import { createPublicClient, http, defineChain } from "viem";

// Viem Chain Definition for Robinhood Chain (ETH)
export const robinhoodChain = defineChain({
  id: SPINO_CONFIG.CHAIN_ID,
  name: SPINO_CONFIG.CHAIN_NAME,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [SPINO_CONFIG.RPC_URL] },
    public: { http: [SPINO_CONFIG.RPC_FALLBACK_URL] },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Chain Explorer",
      url: SPINO_CONFIG.EXPLORER_URL,
    },
  },
});

export const viemPublicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(SPINO_CONFIG.RPC_URL, {
    retryCount: 3,
    retryDelay: 300,
    timeout: 8_000,
  }),
});
