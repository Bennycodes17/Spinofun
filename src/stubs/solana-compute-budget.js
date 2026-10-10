export const COMPUTE_BUDGET_PROGRAM_ADDRESS = "ComputeBudget111111111111111111111111111111";
export const ComputeBudgetInstruction = {};
export const identifyComputeBudgetInstruction = () => 0;
export const estimateComputeUnitLimitFactory = () => async () => 200000;
export const getSetComputeUnitLimitInstruction = () => ({});
export const setTransactionMessageComputeUnitPrice = (_price, tx) => tx;
export const parseSetComputeUnitLimitInstruction = () => ({});
export const parseSetComputeUnitPriceInstruction = () => ({});

export default {
  COMPUTE_BUDGET_PROGRAM_ADDRESS,
  ComputeBudgetInstruction,
  identifyComputeBudgetInstruction,
  estimateComputeUnitLimitFactory,
  getSetComputeUnitLimitInstruction,
  setTransactionMessageComputeUnitPrice,
  parseSetComputeUnitLimitInstruction,
  parseSetComputeUnitPriceInstruction,
};
