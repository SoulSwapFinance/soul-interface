import { useMemo } from 'react'
import { ChainId } from 'sdk'

// import { BridgeState } from '../../components'
import { useBridgeFees } from './useBridgeFees'
import { SendTransactionResult } from 'wagmi/actions'
import { Amount, Price, Token, tryParseAmount, Type as Currency, Type } from 'soulswap-currency'
import { Signature } from '@ethersproject/bytes'

export type BridgeState = {
  id: string
  srcChainId: ChainId
  dstChainId: ChainId
  srcToken: Type | undefined
  dstToken: Type | undefined
  srcTypedAmount: string
  dstTypedAmount: string
  amount: Amount<Type> | undefined
  sourceTx?: SendTransactionResult
  signature?: Signature
  timestamp?: number
  gasFee?: Amount<Type>
}

export const useBridgeOutput = (state: BridgeState) => {
  const { amount, dstToken } = state
  const { bridgeFee, isLoading } = useBridgeFees(state)

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
