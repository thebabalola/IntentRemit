# MiniPay Integration Guide for Celo Mini Apps

This guide explains how to optimize a Next.js/React application for the **MiniPay** wallet (integrated into Opera Mini).

## 1. Detection
MiniPay injects a provider that can be identified via the `window.ethereum.isMiniPay` property.

```javascript
const isMiniPay = window.ethereum && window.ethereum.isMiniPay;
```

## 2. Auto-Connection
Mini Apps should connect automatically when launched inside MiniPay. If you are using `wagmi`, you can trigger this in a `useEffect`.

```tsx
import { useConnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';

function MiniPayAutoConnect() {
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (window.ethereum?.isMiniPay && !isConnected) {
      connect({ connector: injected() });
    }
  }, [connect, isConnected]);
}
```

## 3. UI Adjustments
Since the wallet is already connected and integrated into the browser chrome, you should hide manual "Connect Wallet" buttons for MiniPay users to avoid confusion.

```tsx
{!isMiniPay && <ConnectButton />}
```

## 4. Transaction Requirements
MiniPay has specific constraints for transactions:
- **Type**: Only **Legacy** transactions are supported (no EIP-1559 `maxPriorityFeePerGas`).
- **Fee Currency**: Supports `feeCurrency` (typically cUSD or native CELO).

When using `viem` or `wagmi`, ensure you specify the type:

```javascript
writeContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'transfer',
  args: [...],
  type: 'legacy', // CRITICAL for MiniPay
});
```

## 5. Development & Testing
To test locally, use **ngrok** to expose your localhost to a public URL, then load that URL in the MiniPay "Developer Mode" (tap version number 7 times in settings).

```bash
ngrok http 3000
```
