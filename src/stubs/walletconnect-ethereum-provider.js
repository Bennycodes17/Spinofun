export const OPTIONAL_METHODS = [];
export const OPTIONAL_EVENTS = [];

export class EthereumProvider {
  static async init(options) {
    return {
      on: () => {},
      removeListener: () => {},
      request: async () => {},
      enable: async () => [],
      disconnect: async () => {},
      signer: { abortPairingAttempt: () => {} },
      session: null,
      accounts: [],
    };
  }
}

export default {
  EthereumProvider,
  OPTIONAL_METHODS,
  OPTIONAL_EVENTS,
};
