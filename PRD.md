# Product Requirements Document: IntentRemit

## 1. Executive Summary
IntentRemit is a next-generation remittance infrastructure engineered on the Celo blockchain. It transitions the paradigm of cross-border payments from immediate, untracked consumption to structured, purpose-driven capital allocation. By embedding programmable conditions into transactions, senders can ensure their funds are utilized for specific objectives, fostering long-term financial stability for recipients in emerging markets.

## 2. Market Opportunity
Current global remittance flows suffer from high friction, exorbitant fees, and a lack of sender oversight. While traditional cryptocurrencies solve the transmission speed and cost issues, they fail to address the behavioral economics of the transfer. IntentRemit bridges this gap by offering a trustless, smart-contract-based escrow system that enforces sender intent without requiring intermediaries.

## 3. Core Capabilities
### 3.1 Goal-Oriented Capital Routing
Senders designate a specific purpose for the transfer (e.g., Tuition, Housing, Enterprise Capital). This categorization drives the subsequent conditional logic applied to the funds.

### 3.2 Programmatic Disbursement
Funds are partitioned based on sender-defined parameters:
*   **Immediate Liquidity:** A percentage made instantly available to the recipient.
*   **Structured Vesting (Growth Vault):** The remaining balance is secured in a time-locked smart contract, releasing only upon maturity or specific cryptographic approvals.

### 3.3 CIP-64 Fee Abstraction
To ensure a frictionless user experience, all network gas fees are abstracted using Celo's CIP-64 standard, allowing transaction costs to be settled in stablecoins (e.g., USDm) rather than native network tokens.

### 3.4 Multi-Asset Compatibility
The protocol natively supports a diverse basket of assets, including native CELO and major stablecoins (USDm, EURm, USDC, USDT), ensuring flexibility for international senders.

## 4. Technical Architecture
The system is built on a highly modular architecture:
*   **Smart Contracts:** Developed in Solidity, utilizing a Factory pattern (`PaymentFactory.sol`) to deploy isolated, secure `ConditionalPayment` instances for every transaction.
*   **Frontend Interface:** A highly responsive, mobile-optimized Web3 application built with Next.js, integrating the Wagmi/Viem stack for robust blockchain communication.
*   **Wallet Integration:** Seamless compatibility with MiniPay and Valora, ensuring accessibility for the target demographic.

## 5. Deployment Information
The core infrastructure is fully operational on the Celo Mainnet:
*   **PaymentFactory:** `0xBC78E2a916514CBE944074295070C63db8d375BD`
*   **ConditionOracle:** `0x2CdCbaDf713DC4eF0e45c26bD484d1ea154c698a`

## 6. Strategic Roadmap
Subsequent iterations will focus on expanding the Oracle integrations to include real-world data verification (e.g., academic enrollment confirmation) and deeper integration with localized off-ramp providers.
