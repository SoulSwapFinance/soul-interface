import { ChainId, ROUTER_ADDRESS } from '../sdk'
import { Currency, CurrencyAmount, Percent, TradeType, Trade as V2Trade } from 'sdk'
import { useCallback, useMemo } from 'react'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'

import { ARCHER_ROUTER_ADDRESS } from '../constants'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from '../functions/trade'
import { useActiveWeb3React } from 'services/web3'
import { useTokenAllowance } from './useTokenAllowance'
import { useTokenContract } from './useContract'
import { computeSlippageAdjustedAmounts } from 'utils/prices'
import { Aggregator } from 'utils/swap/aggregator'
import { Field } from 'state/swap/actions'
import useGelatoLimitOrdersLib from './gelato/useGelatoLimitOrdersLib'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns: approval state. 
export function useTokenApprove(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  // approves: [if] needed [else] terminates.
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // checks: approval status.
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // sets: `UNKNOWN` when state unknown
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // `amountToApprove’: [iff] `currentAllowance` < `amountToApprove`
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
// fallbacks: tokens w/restricted approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

// wraps useTokenApprove in the context of a swap
export function useApproveCallbackFromTrade(
  trade: V2Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: Percent,
  doArcher: boolean = false
  // doJoe: boolean = false
) {
  const { chainId } = useActiveWeb3React()
  const amountToApprove = useMemo(
    () => (trade && trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined),
    [trade, allowedSlippage]
  )
  return useTokenApprove(
    amountToApprove,
    chainId
      ? trade instanceof V2Trade
        ? !doArcher
          ? ROUTER_ADDRESS[chainId ?? ChainId.FANTOM]
          : ARCHER_ROUTER_ADDRESS[chainId ?? ChainId.FANTOM]
          // : doJoe
          // ? JOE_ROUTER_ADDRESS[ChainId.AVALANCHE]
        : undefined
      : undefined
  )
}

// wraps useTokenApprove in the context of a swap
export function useApproveCallbackFromTradeV2(trade?: Aggregator, allowedSlippage = 0) {
  const { chainId } = useActiveWeb3React()
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage],
  )
  return useTokenApprove(amountToApprove, !!chainId && trade?.routerAddress ? trade.routerAddress : undefined)
}

// wraps useTokenApprove in the context of a swap
export function useApproveCallbackFromInputCurrencyAmount(
  currencyAmountIn: CurrencyAmount<Currency> | undefined
) {
  const gelatoLibrary = useGelatoLimitOrdersLib();

  return useTokenApprove(
    currencyAmountIn,
    gelatoLibrary?.erc20OrderRouter.address ?? undefined
  );
}