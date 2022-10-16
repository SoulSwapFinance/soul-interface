import { ChainId } from '../../sdk'
import { createAction } from '@reduxjs/toolkit'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  type?: string
  summary?: string
  arbitrary?: any
  archer?: {
    rawTransaction: string
    deadline: number
    nonce: number
    ethTip: string
  }
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: ChainId }>('transactions/clearAllTransactions')
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
  needCheckSubgraph?: boolean
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
export const checkedSubgraph = createAction<{ chainId: ChainId; hash: string }>('transactions/checkedSubgraph')
