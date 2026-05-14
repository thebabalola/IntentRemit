'use client'

import React, { ReactNode } from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celo } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'placeholder-build-id'

const metadata = {
  name: 'IntentRemit',
  description: 'Intent-based remittance protocol for purposeful transfers on Celo',
  url: 'https://intentremit.vercel.app',
  icons: ['/favicon.ico'],
}

const wagmiAdapter = new WagmiAdapter({
  networks: [celo],
  projectId,
  ssr: true,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [celo],
  defaultNetwork: celo,
  projectId,
  metadata,
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#22c55e',
    '--w3m-color-mix': '#050505',
    '--w3m-color-mix-strength': 20,
    '--w3m-border-radius-master': '12px',
  },
})

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
