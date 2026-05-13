# 📝 IntentRemit Development TODO

> [!IMPORTANT]
> This document tracks the pending tasks and technical requirements for the IntentRemit project. All upcoming work, including smart contract deployments, frontend refinements, and testing, is logged here.

## 🚀 Phase 3: Advanced Features & UX
- [ ] **AI Allocation Suggestion Engine**: Implement a rule-based/AI suggestion component that recommends splits (Immediate vs. Locked) based on selected remittance goals.
- [ ] **Growth Vault Visualizations**: Create a dedicated UI section in the dashboard to show "simulated growth" or interest earned on locked funds.
- [ ] **Dynamic Progress Visualization**: Enhanced countdowns and status bars for different lock conditions (Oracle, Manual, Timestamp).

## 🛠 Smart Contract & Technical Foundation
- [ ] **Mainnet/Testnet Deployment**: Deploy `PaymentFactory` to Celo Mainnet/Alfajores.
- [ ] **Contract Address Update**: Update `frontend/lib/constants.ts` with the new deployed addresses.
- [ ] **ABI Synchronization**: Run `npx hardhat compile` and sync final ABIs to `frontend/lib/contracts.ts` after any logic tweaks.
- [ ] **Yield Integration Implementation**: Replace the `_depositToYield` and `_withdrawFromYield` placeholders in `ConditionalPayment.sol` with actual DeFi protocol integrations (e.g., Moola Market or Aave).
- [ ] **Condition Oracle Implementation**: Build a concrete Oracle contract for AI-powered data triggers.

## 🧪 Testing & Validation
- [ ] **Unit Tests Expansion**: Update `smartcontract/test/` to cover the new split payment logic and ERC20/cUSD support.
- [ ] **Frontend Integration Testing**: Verify end-to-end flows using a browser wallet (Metamask/Safe).
- [ ] **Security Review**: Internal audit of the escrow logic, specifically the split execution and refund timeouts.

## 🎨 Design & Branding
- [ ] **Asset Finalization**: Ensure all logos (`.svg`, `.png`) in `frontend/public` are the final high-res versions.
- [ ] **Favicon Sync**: Ensure the site favicon matches the new IntentRemit branding.
- [ ] **SEO Optimization**: Finalize meta tags and descriptions for all routes.
