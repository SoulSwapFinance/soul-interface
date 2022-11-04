import { useMemo } from 'react'
import { ChainId, Currency, CurrencyAmount, Price, ZERO } from 'sdk'
// import { BridgeState } from '../../components'
// import { useBridgeFees } from './useBridgeFees'
import { Signature } from '@ethersproject/bytes'
// import { BigNumber } from '@ethersproject/bignumber'
import { tryParseAmount } from 'functions/parse'

export type BridgeState = {
  id: string
  srcChainId: ChainId
  dstChainId: ChainId
  srcToken: Currency | undefined
  dstToken: Currency | undefined
  srcTypedAmount: string
  dstTypedAmount: string
  amount: CurrencyAmount<Currency> | undefined
  sourceTx?: any | undefined //SendTransactionResult
  signature?: Signature
  timestamp?: number
  gasFee?: CurrencyAmount<Currency>
}

export const useBridgeOutput = (state: BridgeState) => {
  const { amount, dstToken } = state
  // const { bridgeFee, isLoading } = useBridgeFees(state)
  
  // dummies //
  let bridgeFee = amount?.subtract(amount)
  let isLoading = false
  //

  const srcAmountOut = useMemo(() => (bridgeFee ? amount?.subtract(bridgeFee) : undefined), [bridgeFee, amount])

  const dstAmountOut = useMemo(() => {
    if (!srcAmountOut || !dstToken) return
    return tryParseAmount(
      srcAmountOut.toFixed(srcAmountOut.currency.decimals > dstToken.decimals ? dstToken.decimals : undefined),
      dstToken
    )
  }, [dstToken, srcAmountOut])

  const price = useMemo(
    () => (amount && dstAmountOut ? new Price({ baseAmount: amount, quoteAmount: dstAmountOut }) : undefined),
    [amount, dstAmountOut]
  )

  return useMemo(
    () => ({
      srcAmountOut,
      dstAmountOut,
      price,
      bridgeFee,
      isLoading,
    }),
    [bridgeFee, dstAmountOut, isLoading, price, srcAmountOut]
  )
}
