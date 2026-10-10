export function createCoinbaseWalletSDK(options) {
  return {
    getProvider: () => ({
      request: async () => {},
      on: () => {},
      removeListener: () => {},
    }),
  };
}

export class CoinbaseWalletSDK {
  constructor(options) {}
  makeWeb3Provider() {
    return {
      request: async () => {},
      on: () => {},
      removeListener: () => {},
    };
  }
}

export default {
  createCoinbaseWalletSDK,
  CoinbaseWalletSDK,
};
