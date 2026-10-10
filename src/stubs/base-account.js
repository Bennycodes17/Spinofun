// Safe stub for @base-org/account preventing transitive module resolution errors
export function createBaseAccountSDK(config) {
  return {
    getProvider: () => ({
      request: async () => {},
      on: () => {},
      removeListener: () => {},
    }),
  };
}

export const getCryptoKeyAccount = () => {};
export const removeCryptoKey = () => {};
export const VERSION = '2.5.13';
export const base = {};
export const CHAIN_IDS = {};
export const getPaymentStatus = async () => {};
export const getSubscriptionStatus = async () => {};
export const pay = async () => {};
export const prepareCharge = async () => {};
export const subscribe = async () => {};
export const TOKENS = {};
export const createProlinkUrl = () => '';
export const decodeProlink = () => ({});
export const encodeProlink = () => '';
export const charge = undefined;
export const getOrCreateSubscriptionOwnerWallet = undefined;

export default {
  createBaseAccountSDK,
  getCryptoKeyAccount,
  removeCryptoKey,
  VERSION,
  base,
  CHAIN_IDS,
  getPaymentStatus,
  getSubscriptionStatus,
  pay,
  prepareCharge,
  subscribe,
  TOKENS,
  createProlinkUrl,
  decodeProlink,
  encodeProlink,
};
