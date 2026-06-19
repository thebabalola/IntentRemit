"use client";

import { ReactNode } from "react";
import { ToastProvider } from "./Toast";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
