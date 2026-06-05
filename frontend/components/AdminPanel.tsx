"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { ShieldCheck, Loader2, Save } from "lucide-react";
import { PAYMENT_FACTORY_ADDRESS } from "@/lib/constants";
import { PaymentFactoryABI } from "@/lib/contracts";
import { useSetDefaultRefundTimeout, useTransferOwnership } from "@/lib/hooks";

export default function AdminPanel() {
  const [timeoutValue, setTimeoutValue] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: defaultTimeout } = useReadContract({
    address: PAYMENT_FACTORY_ADDRESS,
    abi: PaymentFactoryABI,
    functionName: "defaultRefundTimeout",
  });

  const { setTimeout, isPending: isTimeoutPending } = useSetDefaultRefundTimeout();
  const { transfer, isPending: isTransferPending } = useTransferOwnership();

  const handleUpdateTimeout = async () => {
    try {
      setStatus(null);
      if (!timeoutValue) throw new Error("Please enter a valid timeout in seconds");
      await setTimeout(BigInt(timeoutValue));
      setStatus({ type: "success", message: "Timeout updated successfully" });
    } catch (e: any) {
      setStatus({ type: "error", message: e.message || "Failed to update timeout" });
    }
  };

  const handleTransferOwnership = async () => {
    try {
      setStatus(null);
      if (!newOwner || !newOwner.startsWith("0x")) throw new Error("Invalid address format");
      await transfer(newOwner as `0x${string}`);
      setStatus({ type: "success", message: "Ownership transferred successfully" });
    } catch (e: any) {
      setStatus({ type: "error", message: e.message || "Failed to transfer ownership" });
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-celoyellow">
            <ShieldCheck size={28} />
            Admin Dashboard
          </h2>
          <p className="text-gray-500 text-sm mt-1">Exclusive smart contract management access</p>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold border ${status.type === "success" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Set Timeout */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2">Refund Timeout</h3>
          <p className="text-xs text-gray-500 mb-4">
            Current Default: {defaultTimeout ? (Number(defaultTimeout) / 86400).toFixed(2) + " days" : "Loading..."}
          </p>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Timeout in seconds (min 86400)"
              value={timeoutValue}
              onChange={(e) => setTimeoutValue(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 focus:border-celoyellow/50 focus:bg-white/[0.05] rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
            <button
              onClick={handleUpdateTimeout}
              disabled={isTimeoutPending}
              className="w-full h-11 bg-celoyellow/10 hover:bg-celoyellow/20 border border-celoyellow/30 text-celoyellow rounded-xl text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {isTimeoutPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Update Timeout
            </button>
          </div>
        </div>

        {/* Transfer Ownership */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2 text-red-400">Danger Zone</h3>
          <p className="text-xs text-gray-500 mb-4">Transfer PaymentFactory ownership</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="New Owner Address (0x...)"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="w-full bg-white/[0.03] border border-red-500/20 focus:border-red-500 focus:bg-red-500/5 rounded-xl px-4 py-3 text-sm outline-none transition-all"
            />
            <button
              onClick={handleTransferOwnership}
              disabled={isTransferPending}
              className="w-full h-11 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {isTransferPending ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              Transfer Ownership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
