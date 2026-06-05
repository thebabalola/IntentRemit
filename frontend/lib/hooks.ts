'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, parseEther, formatEther } from 'viem'
import { PAYMENT_FACTORY_ADDRESS } from './constants'
import { PaymentFactoryABI, ConditionalPaymentABI } from './contracts'

// ============================================================================
// PaymentFactory Hooks
// ============================================================================

export function useGetPaymentAddress(paymentId: bigint) {
  return useReadContract({
    address: PAYMENT_FACTORY_ADDRESS,
    abi: PaymentFactoryABI,
    functionName: 'getPayment',
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
    functionName: 'getUserPaymentIds',
    args: [userAddress],
    query: {
      enabled: !!userAddress && userAddress !== '0x0000000000000000000000000000000000000000',
    }
  })
}

export function useCreateTimestampPayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

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
      functionName: 'createTimeBasedPayment',
      value: isNative ? totalRaw : 0n,
      args: [recipient, token, totalRaw, immediateRaw, goal, executeAt],
      type: 'legacy'
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return { createTimestampPayment, hash, isPending, isConfirming, isSuccess, error }
}

export function useCreateManualPayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

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
      functionName: 'createManualPayment',
      value: isNative ? totalRaw : 0n,
      args: [recipient, token, totalRaw, immediateRaw, goal, approvers, requiredApprovals],
      type: 'legacy'
    })
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return { createManualPayment, hash, isPending, isConfirming, isSuccess, error }
}

// ============================================================================
// ConditionalPayment Instance Hooks
// ============================================================================

export function useConditionalPayment(paymentAddress: `0x${string}` | undefined) {
  const enabled = !!paymentAddress && paymentAddress !== '0x0000000000000000000000000000000000000000'

  const { data: sender } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'sender', query: { enabled } })
  const { data: recipient } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'recipient', query: { enabled } })
  const { data: token } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'token', query: { enabled } })
  const { data: totalAmount } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'totalAmount', query: { enabled } })
  const { data: immediateAmount } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'immediateAmount', query: { enabled } })
  const { data: lockedAmount } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'lockedAmount', query: { enabled } })
  const { data: goal } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'goal', query: { enabled } })
  const { data: conditionType } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'conditionType', query: { enabled } })
  const { data: immediateExecuted } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'immediateExecuted', query: { enabled } })
  const { data: lockedExecuted } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'lockedExecuted', query: { enabled } })
  const { data: refunded } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'refunded', query: { enabled } })
  const { data: executeAt } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'executeAt', query: { enabled } })
  const { data: requiredApprovals } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'requiredApprovals', query: { enabled } })
  const { data: canExecute } = useReadContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'checkCondition', query: { enabled } })

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
    isLoading: enabled && (totalAmount === undefined)
  }
}

export function useExecuteImmediate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function execute(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'executeImmediate', type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { execute, hash, isPending, isConfirming, isSuccess, error }
}

export function useExecuteLocked() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function execute(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'executeLocked', type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { execute, hash, isPending, isConfirming, isSuccess, error }
}

export function useRefundPayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function refund(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'refund', type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { refund, hash, isPending, isConfirming, isSuccess, error }
}

export function useApprovePayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function approve(paymentAddress: `0x${string}`) {
    writeContract({ address: paymentAddress, abi: ConditionalPaymentABI, functionName: 'approveManual', type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { approve, hash, isPending, isConfirming, isSuccess, error }
}

export function useGetFactoryOwner() {
  return useReadContract({
    address: PAYMENT_FACTORY_ADDRESS,
    abi: PaymentFactoryABI,
    functionName: 'owner',
  })
}

export function useSetDefaultRefundTimeout() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function setTimeout(timeout: bigint) {
    writeContract({ address: PAYMENT_FACTORY_ADDRESS, abi: PaymentFactoryABI, functionName: 'setDefaultRefundTimeout', args: [timeout], type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { setTimeout, hash, isPending, isConfirming, isSuccess, error }
}

export function useTransferOwnership() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  async function transfer(newOwner: `0x${string}`) {
    writeContract({ address: PAYMENT_FACTORY_ADDRESS, abi: PaymentFactoryABI, functionName: 'transferOwnership', args: [newOwner], type: 'legacy' })
  }
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  return { transfer, hash, isPending, isConfirming, isSuccess, error }
}
