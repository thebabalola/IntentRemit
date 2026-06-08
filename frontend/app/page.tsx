"use client";

import { useState, useMemo, useEffect } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { parseEther, formatEther, erc20Abi } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingTour from "@/components/OnboardingTour";
import { DashboardSkeleton } from "@/components/SkeletonLoaders";
import AdminPanel from "@/components/AdminPanel";
import {
  Plus,
  History,
  Wallet,
  ArrowRight,
  Clock,
  UserCheck,
  Repeat,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import {
  useUserPayments,
  useCreateTimestampPayment,
  useCreateManualPayment,
  useConditionalPayment,
  useApprovePayment,
  useExecuteImmediate,
  useExecuteLocked,
  useRefundPayment,
  useGetPaymentAddress,
  useGetFactoryOwner,
} from "@/lib/hooks";
import { ConditionType } from "@/lib/constants";

export default function Home() {
  // Main entry point for IntentRemit - Diaspora-focused programmable remittances
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const [activeTab, setActiveTab] = useState<"create" | "status" | "admin">("create");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#create") {
        setActiveTab("create");
        setTimeout(() => {
          document
            .getElementById("main-container")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else if (hash === "#dashboard") {
        setActiveTab("status");
        setTimeout(() => {
          document
            .getElementById("main-container")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Form State
  const [recipient, setRecipient] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [immediatePercentage, setImmediatePercentage] = useState(50);
  const [goal, setGoal] = useState("School Fees");
  const [token, setToken] = useState(
    "0x0000000000000000000000000000000000000000",
  ); // Native CELO
  const [conditionType, setConditionType] = useState<ConditionType>(
    ConditionType.TIMESTAMP,
  );
  const [executeAt, setExecuteAt] = useState("");
  const [approvers, setApprovers] = useState("");
  const [requiredApprovals, setRequiredApprovals] = useState("1");

  const { data: userPaymentsData, isLoading: loadingPayments } =
    useUserPayments(address || "0x");
  const { data: factoryOwner } = useGetFactoryOwner();
  const isNative = token === "0x0000000000000000000000000000000000000000";
  const { data: nativeBalance } = useBalance({
    address,
    query: { enabled: isNative && !!address },
  });
  const { data: tokenBalance } = useReadContract({
    address: isNative ? undefined : (token as `0x${string}`),
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !isNative && !!address },
  });

  const balanceData = useMemo(() => {
    if (isNative && nativeBalance) {
      return {
        formatted: formatEther(nativeBalance.value),
        symbol: nativeBalance.symbol,
        decimals: nativeBalance.decimals,
      };
    }
    if (tokenBalance !== undefined) {
      return {
        formatted: formatEther(tokenBalance as bigint),
        symbol:
          token === "0x765DE816845861e75A25fCA122bb6898B8B1282a"
            ? "cUSD"
            : "TOKEN",
        decimals: 18,
      };
    }
    return undefined;
  }, [isNative, nativeBalance, tokenBalance, token]);
  const createTimestamp = useCreateTimestampPayment();
  const createManual = useCreateManualPayment();

  const paymentIds = useMemo(
    () => (userPaymentsData as bigint[]) || [],
    [userPaymentsData],
  );

  const immediateAmount = useMemo(() => {
    if (!totalAmount) return "0";
    const val = parseFloat(totalAmount) * (immediatePercentage / 100);
    return Number(val.toFixed(8)).toString();
  }, [totalAmount, immediatePercentage]);

  const aiSuggestion = useMemo(() => {
    if (!goal) return null;
    switch (goal) {
      case "School Fees":
        return {
          immediate: 10,
          locked: 90,
          desc: "AI Suggests: Lock 90% in Growth Vault for future tuition.",
        };
      case "Medical":
        return {
          immediate: 80,
          locked: 20,
          desc: "AI Suggests: 80% immediate availability for urgent care.",
        };
      case "Rent":
        return {
          immediate: 50,
          locked: 50,
          desc: "AI Suggests: Balanced split for ongoing lease.",
        };
      case "Business":
        return {
          immediate: 30,
          locked: 70,
          desc: "AI Suggests: 70% to Growth Vault for capital expansion.",
        };
      default:
        return null;
    }
  }, [goal]);

  const simulatedGrowth = useMemo(() => {
    const locked = parseFloat(totalAmount || "0") - parseFloat(immediateAmount);
    if (locked <= 0) return "0";
    return Number((locked * 1.045).toFixed(8)).toString(); // 4.5% APY
  }, [totalAmount, immediateAmount]);

  const isInsufficientBalance = useMemo(() => {
    if (!balanceData || !totalAmount) return false;
    return parseFloat(totalAmount) > parseFloat(balanceData.formatted);
  }, [totalAmount, balanceData]);

  const [showSimulationModal, setShowSimulationModal] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !totalAmount) return;
    setShowSimulationModal(true);
  };

  const handleCreate = async () => {
    setStatus(null);

    try {
      if (conditionType === ConditionType.TIMESTAMP) {
        const timestamp = BigInt(
          Math.floor(new Date(executeAt).getTime() / 1000),
        );
        await createTimestamp.createTimestampPayment({
          recipient: recipient as `0x${string}`,
          token: token as `0x${string}`,
          totalAmount,
          immediateAmount,
          goal,
          executeAt: timestamp,
        });
      } else if (conditionType === ConditionType.MANUAL) {
        const approverList = approvers
          .split(",")
          .map((a) => a.trim() as `0x${string}`)
          .filter((a) => a);
        await createManual.createManualPayment({
          recipient: recipient as `0x${string}`,
          token: token as `0x${string}`,
          totalAmount,
          immediateAmount,
          goal,
          approvers: approverList,
          requiredApprovals: BigInt(requiredApprovals || 1),
        });
      }
      setStatus({ type: "success", message: "Remittance intent published!" });
    } catch (err: unknown) {
      const error = err as Error;
      setStatus({
        type: "error",
        message: error.message || "Transaction failed",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050502] via-[#0b0a05] to-[#020201] text-white selection:bg-celoyellow/30 overflow-x-hidden">
      <OnboardingTour />
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-celoyellow/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-celogold/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-celoyellow/10 border border-celoyellow/20 text-celoyellow text-xs font-bold tracking-widest uppercase mb-6">
            <ShieldCheck size={14} /> Programmable Purpose
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
            Intent{" "}
            <span className="bg-gradient-to-r from-celoyellow to-celogold bg-clip-text text-transparent italic">
              Remit
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
            Send money with purpose. Define the goal, split the payout, and
            ensure your remittance builds long-term growth.
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <div
          id="main-container"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Navigation Sidebar */}
          <div className="grid grid-cols-2 lg:flex lg:flex-col lg:col-span-3 gap-2 lg:space-y-2">
            <TabButton
              active={activeTab === "create"}
              onClick={() => setActiveTab("create")}
              icon={<Plus size={18} />}
              label="New Remittance"
            />
            <TabButton
              active={activeTab === "status"}
              onClick={() => setActiveTab("status")}
              icon={<History size={18} />}
              label="My Dashboard"
              count={paymentIds.length}
            />
            {isConnected && address && factoryOwner && address.toLowerCase() === (factoryOwner as string).toLowerCase() && (
              <TabButton
                active={activeTab === "admin"}
                onClick={() => setActiveTab("admin")}
                icon={<ShieldCheck size={18} />}
                label="Admin Panel"
              />
            )}
            {isConnected && address && (
              <div className="col-span-2 mt-2 lg:mt-4 px-2 py-1 flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500 uppercase tracking-widest text-[9px] font-black">Connected Wallet</span>
                <div className="flex items-center gap-1.5 text-celoyellow">
                  <span className="font-mono tracking-wider">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(address);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1 hover:bg-white/5 rounded transition-all active:scale-95 flex items-center justify-center shrink-0"
                    title="Copy Address"
                  >
                    {copied ? (
                      <Check size={12} className="text-celoyellow" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === "create" ? (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold">Create Intent</h2>
                      <p className="text-gray-500 text-sm">
                        Configure your purposeful transfer
                      </p>
                    </div>
                    <div className="p-3 bg-celoyellow/10 rounded-2xl">
                      <Wallet className="text-celoyellow" />
                    </div>
                  </div>

                  <form onSubmit={handleSimulate} className="space-y-8">
                    {/* Goal Selection */}
                    <div id="goal-selection" className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                        Select Remittance Goal
                      </label>
                      
                      {/* Mobile Select Dropdown */}
                      <div className="md:hidden">
                        <select
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          className="w-full bg-[#14130d] border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold outline-none text-white focus:border-celoyellow/50 transition-all"
                        >
                          <option value="" disabled>Select Goal...</option>
                          {["School Fees", "Medical", "Rent", "Business"].map((g) => (
                            <option key={g} value={g} className="bg-[#14130d] text-white">
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Desktop Grid Selector */}
                      <div className="hidden md:grid grid-cols-4 gap-3">
                        {["School Fees", "Medical", "Rent", "Business"].map(
                          (g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGoal(g)}
                              className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                goal === g
                                  ? "bg-celoyellow/20 border-celoyellow/50 text-celoyellow"
                                  : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                              }`}
                            >
                              {g}
                            </button>
                          ),
                        )}
                      </div>

                      {aiSuggestion && (
                        <motion.div
                          id="ai-suggestion"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                            <Sparkles size={14} /> {aiSuggestion.desc}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setImmediatePercentage(aiSuggestion.immediate)
                            }
                            className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] uppercase font-black tracking-widest rounded-lg transition-all"
                          >
                            Apply Split
                          </button>
                        </motion.div>
                      )}
                    </div>

                    <div className="border-b border-white/5 my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Recipient Address"
                        placeholder="0x..."
                        value={recipient}
                        onChange={setRecipient}
                        icon={
                          <ChevronRight size={16} className="text-gray-600" />
                        }
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                            Asset & Total Amount
                          </label>
                          {balanceData && (
                            <span className="text-[10px] font-medium text-gray-400">
                              Bal:{" "}
                              {Number(balanceData.formatted).toLocaleString(
                                undefined,
                                { maximumFractionDigits: 6 },
                              )}{" "}
                              {balanceData.symbol}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 text-xs outline-none"
                          >
                            <option value="0x0000000000000000000000000000000000000000">
                              CELO
                            </option>
                            <option value="0x765DE816845861e75A25fCA122bb6898B8B1282a">
                              cUSD
                            </option>
                          </select>
                          <input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                          />
                        </div>
                        {/* Max Button Container */}
                        <div className="flex items-center justify-end text-[10px] font-black uppercase tracking-widest mt-2 px-1">
                          {balanceData && (
                            <button
                              type="button"
                              onClick={() =>
                                setTotalAmount(balanceData.formatted)
                              }
                              className="text-celoyellow hover:text-celogold transition-colors px-2 py-0.5 rounded bg-celoyellow/10"
                            >
                              USE MAX
                            </button>
                          )}
                        </div>
                        {isInsufficientBalance && (
                          <div className="text-red-500 text-xs font-bold mt-1 px-1">
                            ⚠️ Insufficient Balance (You have {Number(balanceData?.formatted || "0").toLocaleString(undefined, { maximumFractionDigits: 6 })} {balanceData?.symbol})
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-white/15 my-8" />

                    {/* Split Slider */}
                    <div
                      id="split-slider"
                      className="p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6"
                    >
                      <div className="flex justify-between items-end">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                            Immediate vs. Locked Split
                          </label>
                          <div className="text-2xl font-black text-celoyellow mt-1">
                            {immediatePercentage}% / {100 - immediatePercentage}
                            %
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black uppercase text-gray-500">
                            Locked Amount
                          </div>
                          <div className="text-xl font-bold text-celogold">
                            {Number(
                              (
                                parseFloat(totalAmount || "0") -
                                parseFloat(immediateAmount)
                              ).toFixed(8),
                            ).toString()}{" "}
                            {balanceData?.symbol || ""}
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={immediatePercentage}
                        onChange={(e) =>
                          setImmediatePercentage(parseInt(e.target.value))
                        }
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-celoyellow"
                      />
                      
                      <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs font-semibold text-gray-400 px-1 pt-1">
                        <span>
                          Recipient Gets Now: <strong className="text-white">{immediateAmount} {balanceData?.symbol || ""}</strong>
                        </span>
                        <span>
                          To Growth Vault:{" "}
                          <strong className="text-white">
                            {Number(
                              (
                                parseFloat(totalAmount || "0") -
                                parseFloat(immediateAmount)
                              ).toFixed(8),
                            ).toString()}{" "}
                            {balanceData?.symbol || ""}
                          </strong>
                        </span>
                      </div>

                      {/* Growth Vault Visualization */}
                      <div
                        id="growth-vault"
                        className="mt-4 p-4 bg-celogold/5 border border-celogold/10 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-celogold/20 rounded-lg">
                            <TrendingUp size={16} className="text-celogold" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-celogold/70">
                              Yield Protocol (4.5% APY)
                            </div>
                            <div className="text-sm font-bold text-celogold">
                              Simulated 1yr Growth
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-celogold">
                            ~{simulatedGrowth}
                          </div>
                          <div className="text-[10px] uppercase text-celogold/50">
                            Projected Return
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-white/15 my-8" />

                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                        Lock Conditions
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <ConditionCard
                          selected={conditionType === ConditionType.TIMESTAMP}
                          onClick={() =>
                            setConditionType(ConditionType.TIMESTAMP)
                          }
                          icon={<Clock size={20} />}
                          title="Time-Locked"
                          desc="Release on specific date"
                        />
                        <ConditionCard
                          selected={conditionType === ConditionType.MANUAL}
                          onClick={() => setConditionType(ConditionType.MANUAL)}
                          icon={<UserCheck size={20} />}
                          title="Manual Approval"
                          desc="Multi-sig protection"
                        />
                      </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      {conditionType === ConditionType.TIMESTAMP && (
                        <FormInput
                          label="Release Date & Time"
                          type="datetime-local"
                          value={executeAt}
                          onChange={setExecuteAt}
                        />
                      )}
                      {conditionType === ConditionType.MANUAL && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            label="Approvers (comma separated)"
                            placeholder="0x1, 0x2..."
                            value={approvers}
                            onChange={setApprovers}
                          />
                          <FormInput
                            label="Required Approvals"
                            type="number"
                            value={requiredApprovals}
                            onChange={setRequiredApprovals}
                          />
                        </div>
                      )}
                    </div>

                    <div className="border-b border-white/5 my-6" />

                    <button
                      type="submit"
                      disabled={!isConnected || isInsufficientBalance}
                      className="w-full h-14 bg-gradient-to-r from-celoyellow to-celogold hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl font-bold text-black flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                    >
                      <ArrowRight size={20} />
                      {isConnected
                        ? isInsufficientBalance
                          ? "Insufficient Balance"
                          : "Simulate & Confirm Intent"
                        : "Connect Wallet to Start"}
                    </button>
                  </form>
                </motion.div>
              ) : activeTab === "admin" && isConnected && address && factoryOwner && address.toLowerCase() === (factoryOwner as string).toLowerCase() ? (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <AdminPanel />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {!isConnected ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-20 text-center">
                      <Wallet
                        size={48}
                        className="mx-auto mb-6 text-gray-600"
                      />
                      <h3 className="text-2xl font-bold mb-2">
                        Wallet Disconnected
                      </h3>
                      <p className="text-gray-500 mb-8">
                        Connect your wallet to manage your remittance intents
                      </p>
                      <button
                        onClick={() => open()}
                        className="bg-celoyellow text-black font-bold py-3 px-8 rounded-xl text-sm hover:bg-celoyellow/90 transition-colors shadow-[0_0_20px_rgba(252,255,82,0.2)] active:scale-95 transition-all cursor-pointer mx-auto block"
                      >
                        CONNECT WALLET
                      </button>
                    </div>
                  ) : loadingPayments ? (
                    <DashboardSkeleton />
                  ) : paymentIds.length === 0 ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-20 text-center">
                      <div className="w-20 h-20 bg-celoyellow/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-celoyellow/10">
                        <History size={32} className="text-celoyellow/50" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        No Active Intents
                      </h3>
                      <p className="text-gray-500 mb-8 text-lg">
                        You haven&apos;t created any purposeful remittances yet.
                      </p>
                      <button
                        onClick={() => setActiveTab("create")}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold"
                      >
                        Send First Remittance
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {paymentIds.map((pid) => (
                        <PaymentItem key={pid.toString()} paymentId={pid} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSimulationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0b0a05] border border-celoyellow/20 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-celoyellow/10 blur-[50px] pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 text-center">Transaction Simulation</h3>
                
                {(createTimestamp.isPending || createManual.isPending) ? (
                  <div className="py-8 text-center space-y-4">
                    <Loader2 size={48} className="animate-spin text-celoyellow mx-auto" />
                    <p className="text-celoyellow font-bold animate-pulse">Broadcasting to Celo Network...</p>
                    <p className="text-sm text-gray-500">Please sign the transaction in your wallet.</p>
                  </div>
                ) : (createTimestamp.isConfirming || createManual.isConfirming) ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-celoyellow/30 border-t-celoyellow rounded-full animate-spin mx-auto" />
                    <p className="text-celoyellow font-bold animate-pulse">Confirming Block...</p>
                    <p className="text-sm text-gray-500">Waiting for network confirmation.</p>
                  </div>
                ) : (createTimestamp.isSuccess || createManual.isSuccess) ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                      <Check size={32} />
                    </div>
                    <p className="text-green-500 font-bold text-xl">Transaction Confirmed!</p>
                    <button
                      onClick={() => {
                        setShowSimulationModal(false);
                        setActiveTab("status");
                        setTotalAmount("");
                      }}
                      className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                    >
                      View Dashboard
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm text-center mb-6">
                      You are about to lock funds into the IntentRemit smart contract.
                    </p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Amount:</span>
                        <span className="font-bold text-white">{totalAmount} {balanceData?.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Immediate Unlock:</span>
                        <span className="font-bold text-white">{immediateAmount} {balanceData?.symbol}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Locked to Vault:</span>
                        <span className="font-bold text-celoyellow">
                          {Number((parseFloat(totalAmount || "0") - parseFloat(immediateAmount)).toFixed(8)).toString()} {balanceData?.symbol}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between text-xs">
                        <span className="text-gray-500">Estimated Gas:</span>
                        <span className="font-mono text-gray-400">~0.0002 CELO</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowSimulationModal(false)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCreate}
                        className="flex-1 py-3 bg-gradient-to-r from-celoyellow to-celogold hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl font-bold text-black"
                      >
                        Proceed & Sign
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
        active
          ? "bg-celoyellow/10 border border-celoyellow/30 text-celoyellow shadow-[0_0_20px_rgba(252,255,82,0.1)]"
          : "hover:bg-white/5 text-gray-500"
      }`}
    >
      <div className="flex items-center gap-4 font-bold text-sm">
        {icon}
        {label}
      </div>
      {count !== undefined && (
        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md">
          {count}
        </span>
      )}
    </button>
  );
}

interface ConditionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function ConditionCard({
  selected,
  onClick,
  icon,
  title,
  desc,
}: ConditionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
        selected
          ? "bg-celoyellow/10 border-celoyellow/50 shadow-lg shadow-celoyellow/5"
          : "bg-white/[0.02] border-white/5 hover:border-white/20"
      }`}
    >
      <div className={`mb-3 ${selected ? "text-celoyellow" : "text-gray-500"}`}>
        {icon}
      </div>
      <div className="font-bold text-sm mb-1">{title}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
        {desc}
      </div>
    </div>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: FormInputProps) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 group-focus-within:text-celoyellow transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/5 focus:border-celoyellow/50 focus:bg-white/[0.05] rounded-xl px-4 py-3 text-sm outline-none transition-all"
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentItem({ paymentId }: { paymentId: bigint }) {
  const { data: address } = useGetPaymentAddress(paymentId);
  const payment = useConditionalPayment(address as `0x${string}`);
  const executeImmediate = useExecuteImmediate();
  const executeLocked = useExecuteLocked();
  const refund = useRefundPayment();
  const approve = useApprovePayment();

  const [timeLeft, setTimeLeft] = useState<string>("");
  const [progressWidth, setProgressWidth] = useState<string>("0%");

  useEffect(() => {
    if (!payment || payment.conditionType !== 0 || !payment.executeAt) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const target = Number(payment.executeAt);

      // Update Time Left
      if (now >= target) {
        setTimeLeft("Unlocked");
      } else {
        const diff = target - now;
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }

      // Update Progress Width
      if (payment.canExecute) {
        setProgressWidth("100%");
      } else {
        const diff = target - now;
        if (diff <= 0) {
          setProgressWidth("100%");
        } else {
          const maxDiff = 30 * 86400; // 30 days
          const progress = Math.max(10, 100 - (diff / maxDiff) * 100);
          setProgressWidth(`${Math.min(100, progress)}%`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [payment.executeAt, payment.conditionType, payment.canExecute]);

  if (!address || payment.isLoading) {
    return (
      <div className="h-24 bg-white/[0.02] rounded-2xl animate-pulse flex items-center px-6">
        <div className="w-8 h-8 bg-white/5 rounded-full mr-4" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (payment.refunded) return "text-red-400 bg-red-400/10 border-red-400/20";
    if (payment.immediateExecuted && payment.lockedExecuted)
      return "text-celoyellow bg-celoyellow/10 border-celoyellow/20";
    return "text-blue-400 bg-blue-400/10 border-blue-400/20";
  };

  const getTypeName = () => {
    switch (payment.conditionType) {
      case 0:
        return "Timestamp";
      case 1:
        return "Manual Approval";
      case 2:
        return "Recurring";
      default:
        return "Custom";
    }
  };

  const getProgressWidthValue = () => {
    return progressWidth;
  };

  return (
    <div className="group relative bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-3xl p-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        {/* Left Side: Basic Info */}
        <div className="flex gap-5 items-center">
          <div className={`p-4 rounded-2xl border ${getStatusColor()}`}>
            {payment.conditionType === 0 && <Clock size={24} />}
            {payment.conditionType === 1 && <UserCheck size={24} />}
            {payment.conditionType === 2 && <Repeat size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-xs uppercase tracking-widest text-gray-500">
                ID #{paymentId.toString()}
              </span>
              <div
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor()}`}
              >
                {payment.refunded
                  ? "Refunded"
                  : payment.immediateExecuted && payment.lockedExecuted
                    ? "Completed"
                    : "Active"}
              </div>
              {payment.goal && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/5 text-gray-400 border border-white/10">
                  {payment.goal}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {payment.totalAmount}{" "}
              {payment.token === "0x0000000000000000000000000000000000000000"
                ? "CELO"
                : "cUSD"}
              <ArrowRight size={16} className="text-gray-600" />
              {payment.recipient?.slice(0, 6)}...{payment.recipient?.slice(-4)}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Split: {payment.immediateAmount} Immediate /{" "}
              {payment.lockedAmount} Locked
            </p>
          </div>
        </div>

        {/* Right Side: Actions & Detailed Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!payment.refunded && (
            <>
              {!payment.immediateExecuted && (
                <button
                  onClick={() =>
                    executeImmediate.execute(address as `0x${string}`)
                  }
                  className="flex-1 md:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {executeImmediate.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Claim Immediate"
                  )}
                </button>
              )}
              {!payment.lockedExecuted && (
                <>
                  {payment.conditionType === 1 && (
                    <button
                      onClick={() => approve.approve(address as `0x${string}`)}
                      className="flex-1 md:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Approve (Threshold:{" "}
                      {payment.requiredApprovals?.toString()})
                    </button>
                  )}
                  <button
                    onClick={() =>
                      executeLocked.execute(address as `0x${string}`)
                    }
                    disabled={!payment.canExecute}
                    className="flex-1 md:flex-none h-11 px-6 bg-celoyellow/10 hover:bg-celoyellow/20 border border-celoyellow/30 text-celoyellow rounded-xl text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {executeLocked.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Unlock Vault"
                    )}
                  </button>
                </>
              )}
              {!payment.immediateExecuted && !payment.lockedExecuted && (
                <button
                  onClick={() => refund.refund(address as `0x${string}`)}
                  className="h-11 w-11 flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl transition-all"
                >
                  <History size={16} />
                </button>
              )}
            </>
          )}
          <a
            href={`https://celoscan.io/address/${address}`}
            target="_blank"
            className="h-11 w-11 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-xl transition-all"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Progress Bar for Locked Funds */}
      {!payment.lockedExecuted && !payment.refunded && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between items-end text-[10px] font-bold text-gray-600 uppercase mb-2">
            <span>{getTypeName()} Progress</span>
            <div className="text-right">
              {payment.executeAt && (
                <div className="text-celogold font-black tracking-widest">
                  {timeLeft || "Calculating..."}
                </div>
              )}
              <div className="text-[8px]">
                Target:{" "}
                {payment.executeAt
                  ? new Date(
                      Number(payment.executeAt) * 1000,
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: getProgressWidthValue() }}
              transition={{ duration: 1 }}
              className={`h-full relative overflow-hidden ${payment.canExecute ? "bg-celoyellow" : "bg-celogold/40"}`}
            >
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
