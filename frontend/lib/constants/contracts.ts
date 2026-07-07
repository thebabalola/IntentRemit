export const CONTRACT_ADDRESSES = {
  PAYMENT_FACTORY: "0xE662E6BDa0dB72cA992B0DDf2FC413467622CeE5" as `0x${string}`,
  CELO: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  USDM: "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`,
  EURM: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73" as `0x${string}`,
  USDT: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e" as `0x${string}`,
  USDC: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as `0x${string}`
};

export const PAYMENT_FACTORY_FUNCTIONS = {
  GET_PAYMENT: "getPayment",
  GET_USER_PAYMENT_IDS: "getUserPaymentIds",
  CREATE_TIME_BASED_PAYMENT: "createTimeBasedPayment",
  CREATE_MANUAL_PAYMENT: "createManualPayment",
  SET_DEFAULT_REFUND_TIMEOUT: "setDefaultRefundTimeout",
  TRANSFER_OWNERSHIP: "transferOwnership",
  OWNER: "owner"
} as const;

export const CONDITIONAL_PAYMENT_FUNCTIONS = {
  SENDER: "sender",
  RECIPIENT: "recipient",
  TOKEN: "token",
  TOTAL_AMOUNT: "totalAmount",
  IMMEDIATE_AMOUNT: "immediateAmount",
  LOCKED_AMOUNT: "lockedAmount",
  GOAL: "goal",
  CONDITION_TYPE: "conditionType",
  IMMEDIATE_EXECUTED: "immediateExecuted",
  LOCKED_EXECUTED: "lockedExecuted",
  REFUNDED: "refunded",
  EXECUTE_AT: "executeAt",
  REQUIRED_APPROVALS: "requiredApprovals",
  CHECK_CONDITION: "checkCondition",
  EXECUTE_IMMEDIATE: "executeImmediate",
  EXECUTE_LOCKED: "executeLocked",
  REFUND: "refund",
  APPROVE_MANUAL: "approveManual",
  ENABLE_YIELD: "enableYield",
  IS_YIELD_BEARING: "isYieldBearing"
} as const;
