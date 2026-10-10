import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@privy-io/server-auth"],
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config: any, { isServer }: any) => {
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      ...(config.resolve.modules || []),
    ];

    // Exclude source fields so webpack uses pre-bundled dist files instead of monorepo ts sources
    config.resolve.mainFields = ["browser", "module", "main"];

    config.resolve.alias = {
      ...config.resolve.alias,
      "@base-org/account": path.resolve(__dirname, "src/stubs/base-account.js"),
      "@coinbase/cdp-sdk": path.resolve(__dirname, "src/stubs/cdp-sdk.js"),
      "@solana-program/system": path.resolve(__dirname, "src/stubs/solana-system.js"),
      "@solana-program/token": path.resolve(__dirname, "src/stubs/solana-token.js"),
      "@solana-program/token-2022": path.resolve(__dirname, "src/stubs/solana-token-2022.js"),
      "@solana-program/compute-budget": path.resolve(__dirname, "src/stubs/solana-compute-budget.js"),
      "@solana/kit": path.resolve(__dirname, "src/stubs/solana-kit.js"),
      "@coinbase/wallet-sdk": path.resolve(__dirname, "src/stubs/coinbase-wallet-sdk.js"),
      "@stripe/crypto": path.resolve(__dirname, "src/stubs/stripe-crypto.js"),
      "@walletconnect/ethereum-provider": path.resolve(__dirname, "src/stubs/walletconnect-ethereum-provider.js"),
      "@farcaster/mini-app-solana": path.resolve(__dirname, "src/stubs/farcaster-solana.js"),
      "@react-aria/focus": path.resolve(__dirname, "node_modules/@react-aria/focus/dist/main.js"),
      "@react-aria/interactions": path.resolve(__dirname, "node_modules/@react-aria/interactions/dist/main.js"),
      "process/browser": path.resolve(__dirname, "node_modules/next/dist/compiled/process/browser.js"),
      "process/browser.js": path.resolve(__dirname, "node_modules/next/dist/compiled/process/browser.js"),
      process: path.resolve(__dirname, "node_modules/next/dist/compiled/process/browser.js"),
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
