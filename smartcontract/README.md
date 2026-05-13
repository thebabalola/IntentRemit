# IntentRemit — Smart Contracts

![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?style=flat-square&logo=solidity)
[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-green)](https://celo.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Solidity smart contracts for the **IntentRemit** programmable remittance protocol. Features conditional escrow payments with goal-based splits and multi-token support.

---

## 🏗️ Architecture

- **PaymentFactory.sol**: Deployer contract that manages the creation of conditional payments.
- **ConditionalPayment.sol**: Individual escrow contracts that hold funds and enforce release conditions.
- **IConditionOracle.sol**: Interface for extending the protocol with custom external triggers.

---

## 🎯 Features

- **Programmable Splits**: Send a portion immediately and lock the rest.
- **Goal-Based**: Attach intent (e.g., School Fees, Medical) directly to the transaction.
- **Multi-Token**: Supports Native CELO and ERC20 tokens (cUSD, cEUR).
- **Flexible Conditions**:
    - **TIMESTAMP**: Time-locked release.
    - **MANUAL**: Multi-sig/Approver-based release.
    - **RECURRING**: Interval-based payments.
    - **ORACLE**: Integration with external data providers.

---

## 🚀 Development

### Prerequisites
- Node.js v18+
- Hardhat

### Setup
```bash
cd smartcontract
npm install
npx hardhat compile
```

### Testing
```bash
npx hardhat test
```

---

## 📄 License
MIT © thebabalola