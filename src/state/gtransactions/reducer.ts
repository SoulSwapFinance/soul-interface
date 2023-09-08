import { Order } from "soulswap-limit-orders-lib";
import { createReducer } from "@reduxjs/toolkit";
import {
  confirmOrderCancellation,
  confirmOrderSubmission,
  saveOrder,
} from "utils/localStorageOrders";
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  TransactionType,
} from "./actions";
import { ChainId } from "sdk";

const now = () => new Date().getTime();

export interface TransactionDetails {
  hash: string;
  approval?: { tokenAddress: string; spender: string };
  type: TransactionType;
  order?: Order;
  summary?: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails;
  };
}

export const initialState: TransactionState = {};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (
        transactions,
        { payload: { chainId, from, hash, summary, approval, type, order } }
      ) => {
        if (transactions[chainId ?? ChainId.FANTOM]?.[hash]) {
          throw Error("Attempted to add existing transaction.");
        }
        const txs = transactions[chainId ?? ChainId.FANTOM] ?? {};
        txs[hash] = {
          hash,
          summary,
          approval,
          from,
          order,
          type,
          addedTime: now(),
        };

        transactions[chainId ?? ChainId.FANTOM] = txs;
        if (order) saveOrder(chainId, from, order, true);
      }
    )
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId ?? ChainId.FANTOM]) return;
      transactions[chainId ?? ChainId.FANTOM] = {};
    })
    .addCase(
      checkedTransaction,
      (transactions, { payload: { chainId, hash, blockNumber } }) => {
        const tx = transactions[chainId ?? ChainId.FANTOM]?.[hash];
        if (!tx) {
          return;
        }
        if (!tx.lastCheckedBlockNumber) {
          tx.lastCheckedBlockNumber = blockNumber;
        } else {
          tx.lastCheckedBlockNumber = Math.max(
            blockNumber,
            tx.lastCheckedBlockNumber
          );
        }
      }
    )
    .addCase(
      finalizeTransaction,
      (transactions, { payload: { hash, chainId, receipt } }) => {
        const tx = transactions[chainId ?? ChainId.FANTOM]?.[hash];
        if (!tx) {
          return;
        }
        tx.receipt = receipt;
        tx.confirmedTime = now();

        if (transactions[chainId ?? ChainId.FANTOM]?.[hash].type === "submission") {
          confirmOrderSubmission(
            chainId,
            receipt.from,
            hash,
            receipt.status === 0 ? false : true
          );
        } else if (transactions[chainId ?? ChainId.FANTOM]?.[hash].type === "cancellation") {
          confirmOrderCancellation(
            chainId,
            receipt.from,
            hash,
            receipt.status === 0 ? false : true
          );
        }
      }
    )
);
