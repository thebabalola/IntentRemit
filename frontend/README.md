# IntentRemit — Frontend

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-green)](https://celo.org)

The mobile-first web interface for **IntentRemit**, allowing diaspora senders to create purposeful remittances on the Celo network.

---

## 📱 Features

- **Wallet Integration**: Support for MiniPay, Valora, and MetaMask via Wagmi/Viem.
- **Goal Selection**: User-friendly flow to select remittance intents.
- **Split Configuration**: Interactive sliders/inputs to define immediate vs. locked portions.
- **Growth Dashboard**: Visualization of locked funds and release timelines.
- **Secure Admin Panel**: A gated admin dashboard explicitly restricted to the original contract deployer wallet. This panel supports critical smart contract interactions such as dynamically modifying the global refund timeout duration and transferring the factory contract's ownership.

---

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```

---

## 📄 License
MIT © thebabalola
