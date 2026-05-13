# IntentRemit 🚀

> **Programmable Remittance with Purpose on Celo** — Turn diaspora remittances into structured financial growth.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-green)](https://celo.org)

## 🧠 Overview

**IntentRemit** is a programmable remittance layer built on Celo that allows diaspora senders to attach **goals, conditions, and intelligent allocation** to transfers — helping recipients turn money into structured financial growth instead of immediate consumption.

---

## ❗ Problem

Remittances into regions like West Africa exceed **$20B+ annually**, yet:

- 💸 High fees (8%–20%) and slow settlement (3–5 days)
- 💳 Existing crypto rails solve _speed_, but not _financial behavior_
- 📉 80–90% of remittances go into immediate consumption
- 🚫 No structured way to enforce savings, goals, or financial discipline

**Result:**  
Money flows in — but long-term financial progress remains stagnant.

---

## 💡 Solution

IntentRemit introduces **programmable financial intent** into remittances:

- 📨 Send money with a **goal** (e.g., school fees, rent, business capital)
- ⚙️ Define **conditional splits** (e.g., 60% now, 40% later)
- 🧠 Get **AI-powered allocation suggestions**
- 🔒 Lock funds into a **Growth Vault** (time-locked smart contract)

---

## 🎯 Core MVP Features (5-Day Build Scope)

### 1. ⚡ Instant Celo Transfer

- Connect wallet (MiniPay / Valora / MetaMask)
- Send **cUSD or CELO** instantly to recipient

---

### 2. 🎯 Goal-Based Remittance

- Sender selects:
  - School Fees
  - Rent
  - Business Capital
  - Custom goal
- Optional message/note

---

### 3. 🔐 Conditional Split (Solidity Smart Contract)

- Sender defines rules:
  - "60% available immediately"
  - "40% locked until [date]"
- Smart contract enforces release conditions

---

### 4. 🧠 AI Allocation Suggestion (Lightweight)

- System suggests optimal split:

  > "For school fees, we recommend 55% now, 45% locked."

- Based on:
  - Goal type
  - Region heuristics
  - Simple rule-based logic (MVP)

---

### 5. 📈 Growth Vault

- Locked funds go into a **Solidity time-lock contract**
- Displays:
  - Locked amount
  - Unlock date
  - Simulated growth

> ⚠️ MVP Note: Yield is simulated  
> Production path: Celo liquidity pools / tokenized assets

---

## 🏗️ Technical Architecture

### 🔗 Blockchain Layer

- **Solidity Smart Contracts**
  - Time-lock / vesting logic
  - Conditional release rules
- **Celo Network**
  - Fast, low-cost payments
  - cUSD/CELO transfers

---

### 🧠 AI Layer

- Rule-based engine (MVP)
- Context-aware suggestions
- Future:
  - Behavioral learning
  - Personal financial optimization

---

### 🖥️ Frontend

- Next.js (React)
- TypeScript
- Tailwind CSS
- Mobile-first (PWA / MiniPay)

---

### 🔌 Wallet Integration

- MiniPay / Valora
- Wagmi / Viem / Celo SDK

---

### ⚙️ Backend (Minimal)

- Node.js (optional)
- Can be mostly client-side for MVP speed

---

## 🎥 Demo Flow (2-Minute Pitch)

1. Sender connects wallet
2. Enters recipient address
3. Selects goal (e.g., school fees)
4. System suggests allocation (AI)
5. Sender confirms split (e.g., 60/40)
6. Sends funds
7. Recipient receives instantly
8. Sees:
   - Available funds
   - Locked funds in vault
9. Vault shows growth over time

---

## 🚀 Why This Matters

- 💡 Moves remittances from **consumption → structured growth**
- ⚡ Uses Celo's strengths (speed, low fees, asset support, mobile-first)
- 🔐 Unlocks **programmable money behavior** via Solidity
- 🌍 High impact for emerging markets
- ❤️ Emotional + practical value (family, education, survival → growth)

---

## 🧩 Future Expansion (Post-MVP)

- Real off-ramp (mobile money / bank integration)
- Advanced AI financial assistant
- Multi-user family dashboards
- Milestone verification (e.g., receipt upload)
- Yield integration (DeFi / tokenized assets)
- Cross-border payroll & merchant tools

---

## 📂 Project Structure

```
IntentRemit/
├── smartcontract/     # Solidity time-lock & vault contracts
├── frontend/          # Next.js PWA frontend
├── docs/             # Development guides & issue trackers
├── README.md         # This file
├── STYLE.md          # Code style guidelines
├── MAINTAINERS.md    # Project maintainers
├── CONTRIBUTING.md   # Contribution guidelines
└── CODE_OF_CONDUCT.md # Community code of conduct
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Hardhat / Foundry (for Solidity)
- MiniPay / Valora / MetaMask

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Setup Smart Contracts
```bash
cd smartcontract
npm install
npx hardhat compile
```

---

## 📚 Documentation & Trackers

- 🧠 **[Smart Contract Issues](./docs/ISSUES-SMARTCONTRACT.md)**
- 🎨 **[Frontend Issues](./docs/ISSUES-FRONTEND.md)**
- 🤖 **[Backend & AI Issues](./docs/ISSUES-BACKEND-AI.md)**

Guides:
- 📘 **[Smart Contract Guide](./docs/SMARTCONTRACT_GUIDE.md)**
- 🌐 **[Frontend Integration Guide](./docs/FRONTEND_GUIDE.md)**

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

*Project maintained by @bbkenny.*