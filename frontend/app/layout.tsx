import type { Metadata, Viewport } from "next";
import "./globals.css";
import Web3Provider from "@/context/Web3Provider";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://intentremit.vercel.app"),
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#050505" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black selection:bg-green-500/30">
        <Web3Provider>
          <Navbar />
          <ClientLayout>{children}</ClientLayout>
        </Web3Provider>
      </body>
    </html>
  );
}
