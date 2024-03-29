import { ChainId, Currency, NATIVE, WNATIVE } from 'sdk'
import { tryParseAmount } from 'functions/parse'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useMemo } from 'react'

import { useWETH9Contract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: WrapType
  execute?: undefined | (() => Promise<void>)
  inputError?: string
} {
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETH9Contract()
  const balance = useCurrencyBalance(chainId, account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency)
      // || chainId === ChainId.CELO)
      return NOT_APPLICABLE
    const weth = WNATIVE[chainId ?? ChainId.FANTOM]
    if (!weth) return NOT_APPLICABLE

    const hasInputAmount = Boolean(inputAmount?.greaterThan('0'))
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.isNative && weth.equals(outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({
                    value: `0x${inputAmount.quotient.toString(16)}`,
                  })
                  addTransaction(txReceipt, {
                    // @ts-ignore TYPE NEEDS FIXING
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${NATIVE[chainId ?? ChainId.FANTOM].symbol} to ${
                      WNATIVE[chainId ?? ChainId.FANTOM].symbol
                    }`,
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? `Insufficient ${NATIVE[chainId ?? ChainId.FANTOM].symbol} balance`
          : `Enter ${NATIVE[chainId ?? ChainId.FANTOM].symbol} amount`,
      }
    } else if (weth.equals(inputCurrency) && outputCurrency.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.quotient.toString(16)}`)
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} ${WNATIVE[chainId ?? ChainId.FANTOM].symbol} to ${
                      // @ts-ignore TYPE NEEDS FIXING
                      NATIVE[chainId ?? ChainId.FANTOM].symbol
                    }`,
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? `Insufficient ${WNATIVE[chainId ?? ChainId.FANTOM].symbol} balance`
          : `Enter ${WNATIVE[chainId ?? ChainId.FANTOM].symbol} amount`,
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}