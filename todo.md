# 📝 IntentRemit — Remaining TODO

> [!IMPORTANT]
> Items listed here are **genuinely incomplete**. Everything that was completed this session (AI Allocation Engine, Growth Vault Visualizer, Live Countdown, IYieldProtocol, ConditionOracle, Unit Tests, ABI Sync, SEO/Metadata, micro-unit support, balance reader) has been removed.

---

## 🚀 Deployment (Completed ✅)

- [x] **Fix frontend `npm run build`** — Cleaned up corrupted SWC compiler binaries.
- [x] **Deploy `PaymentFactory` + `ConditionOracle` to Celo Mainnet** — Deployed and verified.
- [x] **Update `frontend/lib/contracts.ts` and `constants.ts` with real deployed addresses** — All addresses updated.

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
