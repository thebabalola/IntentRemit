"use client";

import { useState, useMemo, useEffect } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { parseEther, formatEther, erc20Abi } from "viem";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp
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
  useGetPaymentAddress
} from "@/lib/hooks";
import { ConditionType } from "@/lib/constants";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'create' | 'status'>('create');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Form State
  const [recipient, setRecipient] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [immediatePercentage, setImmediatePercentage] = useState(50);
  const [goal, setGoal] = useState("School Fees");
  const [token, setToken] = useState("0x0000000000000000000000000000000000000000"); // Native CELO
  const [conditionType, setConditionType] = useState<ConditionType>(ConditionType.TIMESTAMP);
  const [executeAt, setExecuteAt] = useState("");
  const [approvers, setApprovers] = useState("");
  const [requiredApprovals, setRequiredApprovals] = useState("1");

  const { data: userPaymentsData, isLoading: loadingPayments } = useUserPayments(address || '0x');
  const isNative = token === "0x0000000000000000000000000000000000000000";
  const { data: nativeBalance } = useBalance({
    address,
    query: { enabled: isNative && !!address }
  });
  const { data: tokenBalance } = useReadContract({
    address: isNative ? undefined : (token as `0x${string}`),
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !isNative && !!address }
  });

  const balanceData = useMemo(() => {
    if (isNative && nativeBalance) {
      return {
        formatted: formatEther(nativeBalance.value),
        symbol: nativeBalance.symbol,
        decimals: nativeBalance.decimals
      };
    }
    if (tokenBalance !== undefined) {
      return {
        formatted: formatEther(tokenBalance as bigint),
        symbol: token === "0x765DE816845861e75A25fCA122bb6898B8B1282a" ? "cUSD" : "TOKEN",
        decimals: 18
      };
    }
    return undefined;
  }, [isNative, nativeBalance, tokenBalance, token]);
  const createTimestamp = useCreateTimestampPayment();
  const createManual = useCreateManualPayment();

  const paymentIds = useMemo(() => (userPaymentsData as bigint[]) || [], [userPaymentsData]);

  const immediateAmount = useMemo(() => {
    if (!totalAmount) return "0";
    const val = parseFloat(totalAmount) * (immediatePercentage / 100);
    return Number(val.toFixed(8)).toString();
  }, [totalAmount, immediatePercentage]);

  const aiSuggestion = useMemo(() => {
    switch(goal) {
      case "School Fees": return { immediate: 10, locked: 90, desc: "AI Suggests: Lock 90% in Growth Vault for future tuition." };
      case "Medical": return { immediate: 80, locked: 20, desc: "AI Suggests: 80% immediate availability for urgent care." };
      case "Rent": return { immediate: 50, locked: 50, desc: "AI Suggests: Balanced split for ongoing lease." };
      case "Business": return { immediate: 30, locked: 70, desc: "AI Suggests: 70% to Growth Vault for capital expansion." };
      default: return null;
    }
  }, [goal]);

  const simulatedGrowth = useMemo(() => {
    const locked = parseFloat(totalAmount || "0") - parseFloat(immediateAmount);
    if (locked <= 0) return "0";
    return Number((locked * 1.045).toFixed(8)).toString(); // 4.5% APY
  }, [totalAmount, immediateAmount]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    try {
      if (conditionType === ConditionType.TIMESTAMP) {
        const timestamp = BigInt(Math.floor(new Date(executeAt).getTime() / 1000));
        await createTimestamp.createTimestampPayment({
          recipient: recipient as `0x${string}`,
          token: token as `0x${string}`,
          totalAmount,
          immediateAmount,
          goal,
          executeAt: timestamp,
        });
      } else if (conditionType === ConditionType.MANUAL) {
        const approverList = approvers.split(',').map(a => a.trim() as `0x${string}`).filter(a => a);
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
      setStatus({ type: 'success', message: 'Remittance intent published!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Transaction failed' });
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30 overflow-x-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase mb-6">
            <ShieldCheck size={14} /> Programmable Purpose
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
            Intent <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent italic">Remit</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium">
            Send money with purpose. Define the goal, split the payout, and ensure your remittance builds long-term growth.
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <TabButton 
              active={activeTab === 'create'} 
              onClick={() => setActiveTab('create')}
              icon={<Plus size={18} />}
              label="New Remittance"
            />
            <TabButton 
              active={activeTab === 'status'} 
              onClick={() => setActiveTab('status')}
              icon={<History size={18} />}
              label="My Dashboard"
              count={paymentIds.length}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'create' ? (
                <motion.div
                  key="create-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold">Create Intent</h2>
                      <p className="text-gray-500 text-sm">Configure your purposeful transfer</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                      <Wallet className="text-green-400" />
                    </div>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-8">
                    {/* Goal Selection */}
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Select Remittance Goal</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["School Fees", "Medical", "Rent", "Business"].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGoal(g)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                              goal === g ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      
                      {aiSuggestion && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                            <Sparkles size={14} /> {aiSuggestion.desc}
                          </div>
                          <button
                            type="button"
                            onClick={() => setImmediatePercentage(aiSuggestion.immediate)}
                            className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] uppercase font-black tracking-widest rounded-lg transition-all"
                          >
                            Apply Split
                          </button>
                        </motion.div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput 
                        label="Recipient Address" 
                        placeholder="0x..." 
                        value={recipient} 
                        onChange={setRecipient}
                        icon={<ChevronRight size={16} className="text-gray-600" />}
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset & Total Amount</label>
                          {balanceData && (
                            <span className="text-[10px] font-medium text-gray-400">
                              Bal: {Number(balanceData.formatted).toLocaleString(undefined, {maximumFractionDigits: 6})} {balanceData.symbol}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select 
                            value={token} 
                            onChange={(e) => setToken(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-3 text-xs outline-none"
                          >
                            <option value="0x0000000000000000000000000000000000000000">CELO</option>
                            <option value="0x765DE816845861e75A25fCA122bb6898B8B1282a">cUSD</option>
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
                        {/* Live Raw Unit conversion display */}
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mt-2 px-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">=</span>
                            <span className="text-green-400">
                              {totalAmount ? parseEther(totalAmount).toString() : '0'}
                            </span>
                            <span className="text-gray-600">Raw Units (Wei)</span>
                          </div>
                          {balanceData && (
                            <button 
                              type="button"
                              onClick={() => setTotalAmount(balanceData.formatted)}
                              className="text-green-500 hover:text-green-400 transition-colors"
                            >
                              USE MAX
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Split Slider */}
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Immediate vs. Locked Split</label>
                          <div className="text-2xl font-black text-green-400 mt-1">{immediatePercentage}% / {100 - immediatePercentage}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black uppercase text-gray-500">Locked Amount</div>
                          <div className="text-xl font-bold text-emerald-300">{Number((parseFloat(totalAmount || "0") - parseFloat(immediateAmount)).toFixed(8)).toString()}</div>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={immediatePercentage} 
                        onChange={(e) => setImmediatePercentage(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-green-500"
                      />
                        <span>Recipient Gets Now: {immediateAmount}</span>
                        <span>To Growth Vault: {Number((parseFloat(totalAmount || "0") - parseFloat(immediateAmount)).toFixed(8)).toString()}</span>
                      
                      {/* Growth Vault Visualization */}
                      <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <TrendingUp size={16} className="text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Yield Protocol (4.5% APY)</div>
                            <div className="text-sm font-bold text-emerald-400">Simulated 1yr Growth</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-emerald-300">~{simulatedGrowth}</div>
                          <div className="text-[10px] uppercase text-emerald-500/50">Projected Return</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Lock Conditions</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ConditionCard 
                          selected={conditionType === ConditionType.TIMESTAMP}
                          onClick={() => setConditionType(ConditionType.TIMESTAMP)}
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

                    <button
                      type="submit"
                      disabled={createTimestamp.isPending || !isConnected}
                      className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl font-bold text-black flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                    >
                      {createTimestamp.isPending ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
                      {isConnected ? "Confirm Intent" : "Connect Wallet to Start"}
                    </button>
                  </form>
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
                      <Wallet size={48} className="mx-auto mb-6 text-gray-600" />
                      <h3 className="text-2xl font-bold mb-2">Wallet Disconnected</h3>
                      <p className="text-gray-500 mb-8">Connect your wallet to manage your remittance intents</p>
                      <appkit-button />
                    </div>
                  ) : paymentIds.length === 0 ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-20 text-center">
                      <div className="w-20 h-20 bg-green-500/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/10">
                        <History size={32} className="text-green-500/50" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">No Active Intents</h3>
                      <p className="text-gray-500 mb-8 text-lg">You haven't created any purposeful remittances yet.</p>
                      <button 
                        onClick={() => setActiveTab('create')}
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
    </main>
  );
}

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
        active 
          ? "bg-green-500/10 border border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]" 
          : "hover:bg-white/5 text-gray-500"
      }`}
    >
      <div className="flex items-center gap-4 font-bold text-sm">
        {icon}
        {label}
      </div>
      {count !== undefined && (
        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md">{count}</span>
      )}
    </button>
  );
}

function ConditionCard({ selected, onClick, icon, title, desc }: any) {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
        selected 
          ? "bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/5" 
          : "bg-white/[0.02] border-white/5 hover:border-white/20"
      }`}
    >
      <div className={`mb-3 ${selected ? 'text-green-400' : 'text-gray-500'}`}>{icon}</div>
      <div className="font-bold text-sm mb-1">{title}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">{desc}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text", icon }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 group-focus-within:text-green-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/5 focus:border-green-500/50 focus:bg-white/[0.05] rounded-xl px-4 py-3 text-sm outline-none transition-all"
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
    if (payment.refunded) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (payment.immediateExecuted && payment.lockedExecuted) return 'text-green-400 bg-green-400/10 border-green-400/20';
    return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  };

  const getTypeName = () => {
    switch (payment.conditionType) {
      case 0: return 'Timestamp';
      case 1: return 'Manual Approval';
      case 2: return 'Recurring';
      default: return 'Custom';
    }
  };

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (payment.conditionType !== 0 || !payment.executeAt) return;
    
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const target = Number(payment.executeAt);
      if (now >= target) {
        setTimeLeft('Unlocked');
        clearInterval(interval);
      } else {
        const diff = target - now;
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [payment.executeAt, payment.conditionType]);

  const getProgressWidth = () => {
    if (payment.canExecute) return '100%';
    if (payment.conditionType === 0 && payment.executeAt) {
      // Assuming a max lock of 30 days for visual scale
      const now = Math.floor(Date.now() / 1000);
      const target = Number(payment.executeAt);
      const diff = target - now;
      if (diff <= 0) return '100%';
      const maxDiff = 30 * 86400; // 30 days
      const progress = Math.max(10, 100 - (diff / maxDiff) * 100);
      return `${Math.min(100, progress)}%`;
    }
    if (payment.conditionType === 1) {
      return payment.canExecute ? '100%' : '20%';
    }
    return '40%';
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
              <span className="font-black text-xs uppercase tracking-widest text-gray-500">ID #{paymentId.toString()}</span>
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor()}`}>
                {payment.refunded ? 'Refunded' : (payment.immediateExecuted && payment.lockedExecuted) ? 'Completed' : 'Active'}
              </div>
              {payment.goal && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/5 text-gray-400 border border-white/10">
                  {payment.goal}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {payment.totalAmount} {payment.token === '0x0000000000000000000000000000000000000000' ? 'CELO' : 'cUSD'} 
              <ArrowRight size={16} className="text-gray-600" /> 
              {payment.recipient?.slice(0,6)}...{payment.recipient?.slice(-4)}
            </h3>
            <p className="text-xs text-gray-500 font-medium">Split: {payment.immediateAmount} Immediate / {payment.lockedAmount} Locked</p>
          </div>
        </div>

        {/* Right Side: Actions & Detailed Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!payment.refunded && (
            <>
              {!payment.immediateExecuted && (
                <button 
                  onClick={() => executeImmediate.execute(address as `0x${string}`)}
                  className="flex-1 md:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  {executeImmediate.isPending ? <Loader2 size={14} className="animate-spin" /> : "Claim Immediate"}
                </button>
              )}
              {!payment.lockedExecuted && (
                <>
                  {payment.conditionType === 1 && (
                    <button 
                      onClick={() => approve.approve(address as `0x${string}`)}
                      className="flex-1 md:flex-none h-11 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      Approve (Threshold: {payment.requiredApprovals?.toString()})
                    </button>
                  )}
                  <button 
                    onClick={() => executeLocked.execute(address as `0x${string}`)}
                    disabled={!payment.canExecute}
                    className="flex-1 md:flex-none h-11 px-6 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {executeLocked.isPending ? <Loader2 size={14} className="animate-spin" /> : "Unlock Vault"}
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
                <div className="text-emerald-400 font-black tracking-widest">{timeLeft || 'Calculating...'}</div>
              )}
              <div className="text-[8px]">Target: {payment.executeAt ? new Date(Number(payment.executeAt) * 1000).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: getProgressWidth() }}
              transition={{ duration: 1 }}
              className={`h-full relative overflow-hidden ${payment.canExecute ? 'bg-green-500' : 'bg-emerald-500/40'}`}
            >
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

