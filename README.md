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

- **Growth Vault**: Locked funds go into a **Solidity time-lock contract**
- **Mainnet Ready**: Deployed to Celo Mainnet.

---

## 🚀 Project Status

- **Smart Contracts**: ✅ Deployed & Verified on Celo Mainnet
- **Frontend**: 🚧 In Progress (Core features integrated)
- **AI Allocation**: ✅ Functional rule-based engine

---

## 🏗️ Technical Architecture

### 🔗 Blockchain Layer

- **Solidity Smart Contracts**: Custom escrow and time-lock logic.
- **Yield Adapters**: Modular interface for DeFi yield integration.
- **Oracle Interface**: Pluggable condition checking.

### 💻 Frontend Layer

- **Next.js 16**: Modern, fast web framework.
- **Wagmi/Viem**: Robust Ethereum interactions.
- **Tailwind CSS**: Utility-first styling.

---

## 🛠 Setup & Installation

- **Celo Network**
  - Fast, low-cost payments
  - cUSD/CELO transfers

---

## 🚀 Deployment Status

### Celo Mainnet

- **PaymentFactory**: [`0xf3850044Ee8d0498Cf07C5e820dd7Dd923fe869E`](https://celoscan.io/address/0xf3850044Ee8d0498Cf07C5e820dd7Dd923fe869E)
- **ConditionOracle**: [`0x81BCf3F9aBB2fAa06732Cd3A7190490C9708f0C6`](https://celoscan.io/address/0x81BCf3F9aBB2fAa06732Cd3A7190490C9708f0C6)

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

_Project maintained by @bbkenny._

## 📖 How does IntentRemit work?

This interface is the heart of **IntentRemit**. It is designed to let you send money (remittance) to someone while enforcing *how* and *when* they can use it, rather than just giving them all the cash at once. 

Here is a step-by-step breakdown of how the interface works and how you should interact with it:

### 1. Connect Your Wallet
Before you can do anything, make sure you have connected your Web3 wallet (like MetaMask, MiniPay, or Valora) using the green **Connect Wallet** button in the top right. You must be on the **Celo Network**.

### 2. Select Remittance Goal
You start by selecting the purpose of the money you are sending. 
* **Options:** `School Fees`, `Medical`, `Rent`, or `Business`.
* **AI Suggestion:** When you click a goal (e.g., *School Fees*), a small AI banner appears suggesting the best way to split the money. For School Fees, it suggests locking 90% for future tuition and keeping 10% immediate. 
* **Apply Split:** Clicking this button automatically moves your slider to match the AI's advice.

### 3. Recipient & Amount
* **Recipient Address:** Paste the `0x...` Celo wallet address of the person receiving the funds.
* **Asset & Total Amount:** Choose whether you are sending **CELO** or **cUSD** from the dropdown, and type in the total amount you want to send. 
* *Note:* You will see the total converted into "Raw Units (Wei)" below the input. This is just the blockchain's raw format for that number.

### 4. Immediate vs. Locked Split
This slider is where the magic happens. You use it to divide the Total Amount into two buckets:
* **Recipient Gets Now:** The percentage of money the recipient can withdraw and spend the exact second you hit send.
* **To Growth Vault (Locked Amount):** The percentage of money that is held back by the smart contract. 
* **Yield Protocol:** The UI shows a simulated 1-year growth projection (at 4.5% APY) to demonstrate how the locked money could grow while it sits in the vault.

### 5. Lock Conditions
This determines *how* the locked money is eventually released to the recipient. You choose one of two options:
* **Time-Locked:** You select a specific future Date and Time from a calendar dropdown. The smart contract will strictly hold the funds until that exact moment passes.
* **Manual Approval:** This acts as an escrow or multi-sig. If you select this, new fields will appear asking for **Approver Addresses** and **Required Approvals**. The locked funds will only be released when those specific addresses vote to approve it.

### 6. Confirm Intent
Once the form is filled, click the large **Confirm Intent** button at the bottom. Your wallet will pop up asking you to sign the transaction. 

### 7. My Dashboard (Tracking)
Once you send it, you can click on the **My Dashboard** tab on the left sidebar. 
* Here, you will see a list of all the purposeful transfers you've made. 
* You can see the live countdown timer for Time-Locked funds.
* If you are the recipient (or testing with your own alternate wallet), this is the same dashboard where you will see the **Claim Immediate** button and the **Unlock Vault** button (which only becomes clickable once the time has passed or approvals are met).
