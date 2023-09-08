import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from 'sdk'

import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
  type?: string
  arbitrary: any // to store anything arbitrary, so it has any type
  hash: string
  approval?: { tokenAddress: string; spender: string }
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
}

type txHash = string

export type TransactionState = { [key in ChainId]?: Record<txHash, TransactionDetails> }

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addTransaction, (transactions, { payload: { chainId, from, hash, type, approval, summary, claim, arbitrary } }) => {
      if (transactions[chainId ?? ChainId.FANTOM]?.[hash]) {
        throw Error('Attempted to add existing transaction.')
      }
      const txs = transactions[chainId ?? ChainId.FANTOM] ?? {}
      txs[hash] = {
        type,
        hash,
        approval,
        summary,
        claim,
        arbitrary,
        from,
        addedTime: now(),
      }
      transactions[chainId ?? ChainId.FANTOM] = txs
    })
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId ?? ChainId.FANTOM]) return
      transactions[chainId ?? ChainId.FANTOM] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId ?? ChainId.FANTOM]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId ?? ChainId.FANTOM]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    })
)
