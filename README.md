# IntentRemit Protocol

IntentRemit represents a paradigm shift in cross-border capital transfers. Built natively on the Celo blockchain, it transforms standard remittances into programmable, goal-driven financial instruments.

## Overview

By leveraging the speed and cost-efficiency of Celo, IntentRemit allows senders to attach specific conditions and vesting schedules to their transfers. This ensures that remittances contribute to long-term financial objectives rather than immediate consumption, providing peace of mind to the sender and structured financial support to the recipient.

## Protocol Features

*   **Smart Escrow Vaults:** Funds are secured in isolated, immutable smart contracts (`ConditionalPayment`) deployed via a robust Factory pattern.
*   **Customizable Disbursement:** Senders configure exact parameters for immediate liquidity versus time-locked capital.
*   **Stablecoin Native:** Full support for USDm, EURm, USDC, and USDT, shielding users from asset volatility.
*   **Frictionless UX:** Implements CIP-64 fee abstraction, allowing users to pay gas in stablecoins, entirely removing the need to hold native CELO.
*   **Mobile-First Design:** Fully optimized for MiniPay and Valora environments, ensuring maximum accessibility in emerging markets.

## Network Deployments

The protocol is live and verified on the Celo Mainnet.

*   **PaymentFactory:** [`0xBC78E2a916514CBE944074295070C63db8d375BD`](https://celoscan.io/address/0xBC78E2a916514CBE944074295070C63db8d375BD)
*   **ConditionOracle:** [`0x2CdCbaDf713DC4eF0e45c26bD484d1ea154c698a`](https://celoscan.io/address/0x2CdCbaDf713DC4eF0e45c26bD484d1ea154c698a)

## Developer Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   Yarn or npm
*   A Web3 wallet (MetaMask, MiniPay)

### Local Environment Setup

1.  **Smart Contracts:**
    Navigate to the `smartcontract` directory, install dependencies, and compile the Solidity source code.
    ```bash
    cd smartcontract
    npm install
    npx hardhat compile
    ```

2.  **Client Application:**
    Navigate to the `frontend` directory, install necessary packages, and initialize the development server.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Licensing

This software is released under the MIT License.
