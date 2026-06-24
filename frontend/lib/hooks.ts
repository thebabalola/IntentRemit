'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, parseEther, formatEther } from 'viem'
import { PAYMENT_FACTORY_ADDRESS } from './constants'
import { PAYMENT_FACTORY_FUNCTIONS, CONDITIONAL_PAYMENT_FUNCTIONS } from './constants/contracts'
import { PaymentFactoryABI, ConditionalPaymentABI } from './contracts'

// ============================================================================
// PaymentFactory Hooks
// ============================================================================

export function useGetPaymentAddress(paymentId: bigint) {
  return useReadContract({
    address: PAYMENT_FACTORY_ADDRESS,
    abi: PaymentFactoryABI,
    functionName: PAYMENT_FACTORY_FUNCTIONS.GET_PAYMENT,
    args: [paymentId],
    query: {
      enabled: !!paymentId,
    }
  })
}

export function useUserPayments(userAddress: `0x${string}`) {
  return useReadContract({
    address: PAYMENT_FACTORY_ADDRESS,
    abi: PaymentFactoryABI,
    functionName: PAYMENT_FACTORY_FUNCTIONS.GET_USER_PAYMENT_IDS,
    args: [userAddress],
    query: {
      enabled: !!userAddress && userAddress !== '0x0000000000000000000000000000000000000000',
    }
  })
}

export function useCreateTimestampPayment() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  async function createTimestampPayment({
    recipient,
    token,
    totalAmount,
    immediateAmount,
    goal,
    executeAt,
  }: {
    recipient: `0x${string}`
    token: `0x${string}`
    totalAmount: string
    immediateAmount: string
    goal: string
    executeAt: bigint
  }) {
    const isNative = token === '0x0000000000000000000000000000000000000000'
    const totalRaw = parseEther(totalAmount)
    const immediateRaw = parseEther(immediateAmount)

    writeContract({
      address: PAYMENT_FACTORY_ADDRESS,
      abi: PaymentFactoryABI,
      functionName: PAYMENT_FACTORY_FUNCTIONS.CREATE_TIME_BASED_PAYMENT,
      value: isNative ? totalRaw : 0n,
      args: [recipient, token, totalRaw, immediateRaw, goal, executeAt],
      type: 'legacy'
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return { createTimestampPayment, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useCreateManualPayment() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  async function createManualPayment({
    recipient,
    token,
    totalAmount,
    immediateAmount,
    goal,
    approvers,
    requiredApprovals = 1n,
  }: {
    recipient: `0x${string}`
    token: `0x${string}`
    totalAmount: string
    immediateAmount: string
    goal: string
    approvers: `0x${string}`[]
    requiredApprovals?: bigint
  }) {
    const isNative = token === '0x0000000000000000000000000000000000000000'
    const totalRaw = parseEther(totalAmount)
    const immediateRaw = parseEther(immediateAmount)

    writeContract({
      address: PAYMENT_FACTORY_ADDRESS,
      abi: PaymentFactoryABI,
      functionName: PAYMENT_FACTORY_FUNCTIONS.CREATE_MANUAL_PAYMENT,
      value: isNative ? totalRaw : 0n,
      args: [recipient, token, totalRaw, immediateRaw, goal, approvers, requiredApprovals],
      type: 'legacy'
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return { createManualPayment, hash, isPending, isConfirming, isSuccess, error, reset }
}

// ============================================================================
// ConditionalPayment Instance Hooks
// ============================================================================

export function useConditionalPayment(paymentAddress: `0x${string}` | undefined) {
  const enabled = !!paymentAddress && paymentAddress !== '0x0000000000000000000000000000000000000000'

  const { data: sender } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.SENDER, query: { enabled } })
  const { data: recipient } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.RECIPIENT, query: { enabled } })
  const { data: token } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.TOKEN, query: { enabled } })
  const { data: totalAmount } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.TOTAL_AMOUNT, query: { enabled } })
  const { data: immediateAmount } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.IMMEDIATE_AMOUNT, query: { enabled } })
  const { data: lockedAmount } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.LOCKED_AMOUNT, query: { enabled } })
  const { data: goal } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.GOAL, query: { enabled } })
  const { data: conditionType } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.CONDITION_TYPE, query: { enabled } })
  const { data: immediateExecuted } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.IMMEDIATE_EXECUTED, query: { enabled } })
  const { data: lockedExecuted } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.LOCKED_EXECUTED, query: { enabled } })
  const { data: refunded } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.REFUNDED, query: { enabled } })
  const { data: executeAt } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.EXECUTE_AT, query: { enabled } })
  const { data: requiredApprovals } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.REQUIRED_APPROVALS, query: { enabled } })
  const { data: canExecute } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.CHECK_CONDITION, query: { enabled } })
  const { data: isYieldBearing } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.IS_YIELD_BEARING, query: { enabled } })

  return {
    sender,
    recipient,
    token,
    totalAmount: totalAmount ? formatEther(totalAmount as bigint) : undefined,
    immediateAmount: immediateAmount ? formatEther(immediateAmount as bigint) : undefined,
    lockedAmount: lockedAmount ? formatEther(lockedAmount as bigint) : undefined,
    goal: goal as string | undefined,
    conditionType: conditionType as number | undefined,
    immediateExecuted: immediateExecuted as boolean | undefined,
    lockedExecuted: lockedExecuted as boolean | undefined,
    refunded: refunded as boolean | undefined,
    executeAt: executeAt as bigint | undefined,
    requiredApprovals: requiredApprovals as bigint | undefined,
    canExecute: canExecute as boolean | undefined,
    isYieldBearing: isYieldBearing as boolean | undefined,
    isLoading: enabled && (totalAmount === undefined)
  }
}

export function useExecuteImmediate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function execute(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.EXECUTE_IMMEDIATE, type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { execute, hash, isPending, isConfirming, isSuccess, error }
}

export function useExecuteLocked() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function execute(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.EXECUTE_LOCKED, type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { execute, hash, isPending, isConfirming, isSuccess, error }
}

export function useRefundPayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function refund(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.REFUND, type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { refund, hash, isPending, isConfirming, isSuccess, error }
}

export function useApprovePayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function approve(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.APPROVE_MANUAL, type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { approve, hash, isPending, isConfirming, isSuccess, error }
}

export function useEnableYield() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  async function enableYield(paymentAddress: `0x${string}`, yieldPool: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: CONDITIONAL_PAYMENT_FUNCTIONS.ENABLE_YIELD, args: [yieldPool], type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { enableYield, hash, isPending, isConfirming, isSuccess, error, reset }
}

export function useGetFactoryOwner() {
  return useReadContract({
    address: PAYMENT_FACTORY_ADDRESS,
    abi: PaymentFactoryABI,
    functionName: PAYMENT_FACTORY_FUNCTIONS.OWNER,
  })
}

export function useSetDefaultRefundTimeout() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function setTimeout(timeout: bigint) {
    writeContract({ address: PAYMENT_FACTORY_ADDRESS, abi: PaymentFactoryABI, functionName: PAYMENT_FACTORY_FUNCTIONS.SET_DEFAULT_REFUND_TIMEOUT, args: [timeout], type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { setTimeout, hash, isPending, isConfirming, isSuccess, error }
}

export function useTransferOwnership() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function transfer(newOwner: `0x${string}`) {
    writeContract({ address: PAYMENT_FACTORY_ADDRESS, abi: PaymentFactoryABI, functionName: PAYMENT_FACTORY_FUNCTIONS.TRANSFER_OWNERSHIP, args: [newOwner], type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { transfer, hash, isPending, isConfirming, isSuccess, error }
}
