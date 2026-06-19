import type { Metadata, Viewport } from "next";
import "./globals.css";
import Web3Provider from "@/context/Web3Provider";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://intent-remit.vercel.app"),
  title: {
    template: "%s | IntentRemit",
    default: "IntentRemit — Programmable Purposeful Remittance",
  },
  description:
    "IntentRemit is an intent-based remittance protocol that allows users to define goals and conditions for cross-border transfers on Celo.",
  keywords: [
    "IntentRemit",
    "remittance",
    "conditional payments",
    "growth vault",
    "Celo",
    "DeFi",
    "stablecoins",
  ],
  authors: [{ name: "IntentRemit Protocol" }],
  creator: "IntentRemit Protocol",
  openGraph: {
    type: "website",
    title: "IntentRemit — Purposeful Remittance Protocol",
    description:
      "Send money with purpose. Split payments between immediate needs and long-term growth vaults.",
    siteName: "IntentRemit",
    images: [
      { url: "/intentremit-logo.svg", width: 512, height: 512, alt: "IntentRemit Logo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntentRemit — Purposeful Remittance",
    description:
      "IntentRemit: Purposeful remittance with automated splits and growth vaults.",
    images: ["/intentremit-logo.svg"],
  },
  icons: {
    icon: "/intentremit-logo.svg",
    shortcut: "/intentremit-logo.svg",
    apple: "/intentremit-logo.svg",
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
  other: {
    "talentapp:project_verification": "01872b469c464da6d5d19b345a1eac2aa826d7ab4e6c0a60eb3105e034002eea6629b8eea66a341578b8853ae79d62d247030406a1c00309d2f16474363da045",
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#050505" }],
  width: "device-width",
  initialScale: 1,
};

import SecurityNotice from "@/components/SecurityNotice";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-black selection:bg-green-500/30" suppressHydrationWarning>
        <Web3Provider>
          <SecurityNotice />
          <Navbar />
          <ClientLayout>{children}</ClientLayout>
        </Web3Provider>
      </body>
    </html>
  );
}
