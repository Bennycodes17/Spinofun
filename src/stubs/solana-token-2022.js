export const TOKEN_2022_PROGRAM_ADDRESS = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
export const fetchMint = async () => ({ programAddress: TOKEN_2022_PROGRAM_ADDRESS, data: { decimals: 6 } });
export const findAssociatedTokenPda = async () => ["", 0];
export const getTransferCheckedInstruction = () => ({});
export const identifyToken2022Instruction = () => 0;
export const parseTransferCheckedInstruction = () => ({});

export default {
  TOKEN_2022_PROGRAM_ADDRESS,
  fetchMint,
  findAssociatedTokenPda,
  getTransferCheckedInstruction,
  identifyToken2022Instruction,
  parseTransferCheckedInstruction,
};
