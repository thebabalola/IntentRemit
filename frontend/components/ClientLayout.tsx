"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import { ToastProvider } from "./Toast";
import OnboardingTour from "./OnboardingTour";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      <OnboardingTour />
      {children}
    </ToastProvider>
  );
}
