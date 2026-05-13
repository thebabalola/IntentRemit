// PaymentFactory ABI
export const PaymentFactoryABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "immediateAmount", "type": "uint256" },
      { "internalType": "string", "name": "goal", "type": "string" },
      { "internalType": "uint256", "name": "executeAt", "type": "uint256" }
    ],
    "name": "createTimeBasedPayment",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "immediateAmount", "type": "uint256" },
      { "internalType": "string", "name": "goal", "type": "string" },
      { "internalType": "address[]", "name": "approvers", "type": "address[]" },
      { "internalType": "uint256", "name": "requiredApprovals", "type": "uint256" }
    ],
    "name": "createManualPayment",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "immediateAmount", "type": "uint256" },
      { "internalType": "string", "name": "goal", "type": "string" },
      { "internalType": "enum PaymentFactory.ConditionType", "name": "conditionType", "type": "uint8" },
      { "internalType": "bytes", "name": "conditionData", "type": "bytes" }
    ],
    "name": "createPayment",
    "outputs": [{ "internalType": "address", "name": "paymentAddress", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "paymentId", "type": "uint256" }],
    "name": "getPayment",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserPaymentIds",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// ConditionalPayment ABI
export const ConditionalPaymentABI = [
  { "inputs": [], "name": "sender", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "recipient", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "token", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "immediateAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "lockedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "goal", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "conditionType", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "immediateExecuted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "lockedExecuted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "refunded", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "executeAt", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "executeImmediate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "executeLocked", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "refund", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "approveManual", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getApprovalCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "requiredApprovals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "checkCondition", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getStatus", "outputs": [
    { "internalType": "bool", "name": "_immediateExecuted", "type": "bool" },
    { "internalType": "bool", "name": "_lockedExecuted", "type": "bool" },
    { "internalType": "bool", "name": "_refunded", "type": "bool" },
    { "internalType": "uint256", "name": "_balance", "type": "uint256" }
  ], "stateMutability": "view", "type": "function" }
] as const
