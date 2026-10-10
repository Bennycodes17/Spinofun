export const pipe = (init, ...fns) => fns.reduce((acc, fn) => fn(acc), init);
export const createTransactionMessage = () => ({});
export const setTransactionMessageFeePayerSigner = () => ({});
export const setTransactionMessageFeePayer = () => ({});
export const setTransactionMessageLifetimeUsingBlockhash = () => ({});
export const appendTransactionMessageInstruction = () => ({});
export const appendTransactionMessageInstructions = () => ({});
export const prependTransactionMessageInstruction = () => ({});
export const compileTransaction = () => ({});
export const decompileTransactionMessage = () => ({});
export const decompileTransactionMessageFetchingLookupTables = async () => ({
  lifetimeConstraint: {},
});
export const fetchAddressesForLookupTables = async () => ({});
export const fetchEncodedAccounts = async () => [];
export const partiallySignTransactionMessageWithSigners = async (tx) => tx;
export const getSignatureFromTransaction = () => "";
export const assertIsTransactionMessageWithBlockhashLifetime = () => true;
export const assertIsInstructionWithAccounts = () => true;
export const assertIsInstructionWithData = () => true;
export const isTransactionMessageWithDurableNonceLifetime = () => false;

export const containsBytes = (source, pattern, offset = 0) => {
  if (!source || !pattern) return false;
  return false;
};

const dummyCodec = () => ({
  encode: () => new Uint8Array(),
  decode: () => 0,
});

export const getU8Encoder = dummyCodec;
export const getU8Decoder = dummyCodec;
export const getU16Encoder = dummyCodec;
export const getU16Decoder = dummyCodec;
export const getU32Encoder = dummyCodec;
export const getU32Decoder = dummyCodec;
export const getU64Encoder = dummyCodec;
export const getU64Decoder = dummyCodec;
export const getStructEncoder = dummyCodec;
export const getStructDecoder = dummyCodec;
export const combineCodec = dummyCodec;
export const transformEncoder = dummyCodec;
export const getBase64EncodedWireTransaction = () => "";

export class SolanaError extends Error {}
export const isSolanaError = () => false;
export const SOLANA_ERROR__TRANSACTION__FAILED_TO_ESTIMATE_COMPUTE_LIMIT = "ESTIMATE_FAILED";
export const SOLANA_ERROR__TRANSACTION__FAILED_WHEN_SIMULATING_TO_ESTIMATE_COMPUTE_LIMIT = "SIMULATION_FAILED";
export const SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED = "BLOCK_HEIGHT_EXCEEDED";

export const getTransactionEncoder = () => ({ encode: () => new Uint8Array() });
export const getTransactionDecoder = () => ({
  decode: () => ({
    signatures: {},
    messageBytes: new Uint8Array(),
  }),
});
export const getCompiledTransactionMessageDecoder = () => ({ decode: () => ({}) });
export const getBase64Decoder = () => ({ decode: () => new Uint8Array() });
export const getBase58Decoder = () => ({ decode: () => new Uint8Array() });
export const getBase58Encoder = () => ({ encode: () => "" });

export const address = (a) => a;
export const blockhash = (b) => b;

export const createSolanaRpcSubscriptions = () => ({});
export const createSolanaRpc = () => ({
  getFeeForMessage: () => ({ send: async () => ({ value: 0n }) }),
  simulateTransaction: () => ({
    send: async () => ({ value: { err: null, logs: [] } }),
  }),
  getLatestBlockhash: () => ({
    send: async () => ({ value: { blockhash: "", lastValidBlockHeight: 0n } }),
  }),
  getAccountInfo: () => ({ send: async () => ({ value: null }) }),
  sendTransaction: () => ({ send: async () => "" }),
});

export const devnet = (url) => url || "https://api.devnet.solana.com";
export const mainnet = (url) => url || "https://api.mainnet-beta.solana.com";
export const createKeyPairSignerFromBytes = async () => ({ address: "" });
export const createKeyPairSignerFromPrivateKeyBytes = async () => ({ address: "" });
export const isTransactionSigner = () => false;
export const isTransactionModifyingSigner = () => false;
export const isTransactionPartialSigner = () => false;
export const getBase64Encoder = () => ({ encode: () => new Uint8Array() });

export default {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  prependTransactionMessageInstruction,
  compileTransaction,
  decompileTransactionMessage,
  decompileTransactionMessageFetchingLookupTables,
  fetchAddressesForLookupTables,
  fetchEncodedAccounts,
  partiallySignTransactionMessageWithSigners,
  getSignatureFromTransaction,
  assertIsTransactionMessageWithBlockhashLifetime,
  assertIsInstructionWithAccounts,
  assertIsInstructionWithData,
  isTransactionMessageWithDurableNonceLifetime,
  containsBytes,
  getU8Encoder,
  getU8Decoder,
  getU16Encoder,
  getU16Decoder,
  getU32Encoder,
  getU32Decoder,
  getU64Encoder,
  getU64Decoder,
  getStructEncoder,
  getStructDecoder,
  combineCodec,
  transformEncoder,
  getBase64EncodedWireTransaction,
  SolanaError,
  isSolanaError,
  SOLANA_ERROR__TRANSACTION__FAILED_TO_ESTIMATE_COMPUTE_LIMIT,
  SOLANA_ERROR__TRANSACTION__FAILED_WHEN_SIMULATING_TO_ESTIMATE_COMPUTE_LIMIT,
  SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED,
  getTransactionEncoder,
  getTransactionDecoder,
  getCompiledTransactionMessageDecoder,
  getBase64Decoder,
  getBase64Encoder,
  getBase58Decoder,
  getBase58Encoder,
  address,
  blockhash,
  createSolanaRpcSubscriptions,
  createSolanaRpc,
  devnet,
  mainnet,
  createKeyPairSignerFromBytes,
  createKeyPairSignerFromPrivateKeyBytes,
  isTransactionSigner,
  isTransactionModifyingSigner,
  isTransactionPartialSigner,
};
