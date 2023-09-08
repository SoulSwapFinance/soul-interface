import { TransactionResponse } from "@ethersproject/providers";
import { Order } from "soulswap-limit-orders-lib";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, AppState } from "../index";
import { addTransaction, TransactionType } from "./actions";
import { TransactionDetails } from "./reducer";
import { useActiveWeb3React } from "services/web3";
import { ChainId } from "sdk";

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string;
    order?: Order;
    type: TransactionType;
    approval?: { tokenAddress: string; spender: string };
  }
) => void {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        type,
        order,
        approval,
      }: {
        summary?: string;
        order?: Order;
        type: TransactionType;
        approval?: { tokenAddress: string; spender: string };
      } = { type: "submission" }
    ) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error("No transaction hash found.");
      }

      dispatch(
        addTransaction({
          hash,
          from: account,
          order,
          chainId,
          type,
          approval,
          summary,
        })
      );
    },
    [dispatch, chainId, account]
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useActiveWeb3React();

  const state = useSelector<AppState, AppState["gtransactions"]>(
    (state) => state.gtransactions
  );

  return chainId ? state[chainId ?? ChainId.FANTOM] ?? {} : {};
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return !transactions[transactionHash].receipt;
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
  tokenAddress: string | undefined,
  spender: string | undefined
): boolean {
  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      typeof tokenAddress === "string" &&
      typeof spender === "string" &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          const approval = tx.approval;
          if (!approval) return false;
          return (
            approval.spender === spender &&
            approval.tokenAddress === tokenAddress &&
            isTransactionRecent(tx)
          );
        }
      }),
    [allTransactions, spender, tokenAddress]
  );
}
