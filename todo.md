# 📝 IntentRemit — Remaining TODO

> [!IMPORTANT]
> Items listed here are **genuinely incomplete**. Everything that was completed this session (AI Allocation Engine, Growth Vault Visualizer, Live Countdown, IYieldProtocol, ConditionOracle, Unit Tests, ABI Sync, SEO/Metadata, micro-unit support, balance reader) has been removed.

---

## 🚀 Deployment (Blocked — Must Do First)

- [ ] **Fix frontend `npm run build`** — currently crashes with a `Bus error (core dumped)` caused by corrupted SWC compiler binaries from the aborted `npm install`. Fix: `rm -rf node_modules .next && npm install` (let it finish fully).
- [ ] **Deploy `PaymentFactory` + `ConditionOracle` to Celo Mainnet** — run `npx hardhat run scripts/deploy.ts --network celo` and capture deployed addresses.
- [ ] **Update `frontend/lib/contracts.ts` with real deployed addresses** — currently the contract address fields point to placeholder/zero addresses.

---

## 🛠 Smart Contract

- [ ] **Yield Protocol — Live DeFi Integration**: `enableYield` is implemented with the `IYieldProtocol` interface but is only tested against a `MockYieldProtocol`. A real integration with **Moola Market** (Celo's Aave fork) requires testing with the actual Moola pool address on **Celo Mainnet** to verify `deposit()` / `withdraw()` work correctly.
- [ ] **`useCreateRecurringPayment` hook** — frontend hook exists but the corresponding factory function (`createPayment` with `RECURRING` condition type) has no end-to-end test.

---

## 🧪 Testing

- [ ] **End-to-end browser wallet test** — manually create an intent through the UI with a connected wallet (Metamask / Safe) on Alfajores, verify the split executes and the dashboard updates.
- [ ] **Security Review** — internal audit of escrow refund timeout, re-entrancy guards, and the `enableYield` access control flow.

---

## 🎨 Design

- [ ] **Asset Finalization** — confirm `/public/intentremit-logo.svg` is the final high-res version before mainnet launch.
