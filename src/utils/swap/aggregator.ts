import {
    ChainId,
    Currency,
    CurrencyAmount,
    Fraction,
    NATIVE,
    Percent,
    Price,
    JSBI,
    // TokenAmount,
    TradeType,
  } from 'sdk'
  import { captureException } from '@sentry/react'
  import invariant from 'tiny-invariant'
  
  import { DEX_TO_COMPARE } from 'constants/dexes'
  import { SOULSWAP_SOURCE, sentryRequestId } from 'constants/index'
  import { FeeConfig } from 'hooks/useSwapV2Callback'
  import { AggregationComparer } from 'state/swap/types'
  
  import fetchWaiting from '../fetchWaiting'
  
  /**
   */
  export class Aggregator {
    /**
     * The type of the trade, either exact in or exact out.
     */
    public readonly tradeType: TradeType
    /**
     * The input amount for the trade assuming no slippage.
     */
    public readonly inputAmount: CurrencyAmount<Currency>
    /**
     * The output amount for the trade assuming no slippage.
     */
    public readonly outputAmount: CurrencyAmount<Currency>
    /**
     */
    public readonly swaps: any[][]
    /**
     */
    public readonly tokens: any
    /**
     * The price expressed in terms of output amount/input amount.
     */
    public readonly executionPrice: Price<Currency, Currency>
  
    public readonly amountInUsd: number
    public readonly amountOutUsd: number
    public readonly receivedUsd: number
    public readonly gasUsd: number
    // -1 mean can not get price of token => can not calculate price impact
    public readonly priceImpact: number
    public readonly encodedSwapData: string
    public readonly routerAddress: string
  
    public constructor(
      inputAmount: CurrencyAmount<Currency>,
      outputAmount: CurrencyAmount<Currency>,
      amountInUsd: number,
      amountOutUsd: number,
      receivedUsd: number,
      swaps: any[][],
      tokens: any,
      tradeType: TradeType,
      gasUsd: number,
      priceImpact: number,
      encodedSwapData: string,
      routerAddress: string,
    ) {
      this.tradeType = tradeType
      this.inputAmount = inputAmount
      this.outputAmount = outputAmount
      this.amountInUsd = amountInUsd
      this.amountOutUsd = amountOutUsd
      this.receivedUsd = receivedUsd
      this.executionPrice = new Price(
        this.inputAmount.currency,
        this.outputAmount.currency,
        this.inputAmount.quotient,
        this.outputAmount.quotient,
      )
      this.swaps = swaps
      this.tokens = tokens
      this.gasUsd = gasUsd
      this.priceImpact = priceImpact
      this.encodedSwapData = encodedSwapData
      this.routerAddress = routerAddress
    }
  
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    public minimumAmountOut(slippageTolerance: Percent): CurrencyAmount<Currency> {
      invariant(!slippageTolerance.lessThan(0), 'SLIPPAGE_TOLERANCE')
    //   invariant(!slippageTolerance.lessThan(JSBI.BigInt(0)), 'SLIPPAGE_TOLERANCE')
      if (this.tradeType === TradeType.EXACT_OUTPUT) {
        return this.outputAmount
      } else {
        const slippageAdjustedAmountOut = new Fraction(1)
        // const slippageAdjustedAmountOut = new Fraction(JSBI.BigInt(1))
          .add(slippageTolerance)
          .invert()
          .multiply(this.outputAmount.quotient).quotient
        return CurrencyAmount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut)
        // return TokenAmount.fromRawAmount(this.outputAmount.currency, slippageAdjustedAmountOut)
      }
    }
  
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    public maximumAmountIn(slippageTolerance: Percent): CurrencyAmount<Currency> {
      invariant(!slippageTolerance.lessThan(0), 'SLIPPAGE_TOLERANCE')
    //   invariant(!slippageTolerance.lessThan(JSBI.BigInt(0)), 'SLIPPAGE_TOLERANCE')
      if (this.tradeType === TradeType.EXACT_INPUT) {
        return this.inputAmount
      } else {
        const slippageAdjustedAmountIn = new Fraction(1)
        // const slippageAdjustedAmountIn = new Fraction(JSBI.BigInt(1))
          .add(slippageTolerance)
          .multiply(this.inputAmount.quotient).quotient
        return CurrencyAmount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn)
        // return TokenAmount.fromRawAmount(this.inputAmount.currency, slippageAdjustedAmountIn)
      }
    }
  
    /**
     * @param baseURL
     * @param currencyAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param saveGas
     * @param dexes
     * @param slippageTolerance
     * @param deadline
     * @param to
     * @param feeConfig
     * @param signal
     * @param minimumLoadingTime
     */
    public static async bestTradeExactIn(
      baseURL: string,
      currencyAmountIn: CurrencyAmount<Currency>,
      currencyOut: Currency,
      saveGas = false,
      dexes = '',
      slippageTolerance: number,
      deadline: number | undefined,
      to: string,
      feeConfig: FeeConfig | undefined,
      signal: AbortSignal,
      minimumLoadingTime: number,
    ): Promise<Aggregator | null> {
      const chainId: ChainId | undefined = currencyAmountIn.currency.chainId || currencyOut.chainId
  
      invariant(chainId !== undefined, 'CHAIN_ID')
  
      const amountIn = currencyAmountIn
      const tokenOut = currencyOut.wrapped
  
      const tokenInAddress = currencyAmountIn.currency.isNative ? NATIVE[chainId ?? ChainId.FANTOM].address : amountIn.currency.wrapped.address
      const tokenOutAddress = currencyOut.isNative ? NATIVE[chainId ?? ChainId.FANTOM].address : tokenOut.address
      if (tokenInAddress && tokenOutAddress) {
        const search = new URLSearchParams({
          // Trade config
          tokenIn: tokenInAddress.toLowerCase(),
          tokenOut: tokenOutAddress.toLowerCase(),
          amountIn: currencyAmountIn.quotient?.toString(),
          saveGas: saveGas ? '1' : '0',
          gasInclude: saveGas ? '1' : '0',
          ...(dexes ? { dexes } : {}),
          slippageTolerance: slippageTolerance?.toString() ?? '',
          deadline: deadline?.toString() ?? '',
          to,
  
          // Fee config
          chargeFeeBy: feeConfig?.chargeFeeBy ?? '',
          feeReceiver: feeConfig?.feeReceiver ?? '',
          isInBps: feeConfig?.isInBps !== undefined ? (feeConfig.isInBps ? '1' : '0') : '',
          feeAmount: feeConfig?.feeAmount ?? '',
  
          // Client data
          clientData: SOULSWAP_SOURCE,
        })
        try {
          const response = await fetchWaiting(
            `${baseURL}?${search}`,
            {
              signal,
              headers: {
                'X-Request-Id': sentryRequestId,
                'Accept-Version': 'Latest',
              },
            },
            minimumLoadingTime,
          )
          const result = await response.json()
          if (
            !result?.inputAmount ||
            !result?.outputAmount ||
            result.inputAmount === '0' ||
            result.outputAmount === '0'
          ) {
            return null
          }
  
          const toCurrencyAmount = function (value: string, currency: Currency): CurrencyAmount<Currency> {
            return CurrencyAmount.fromRawAmount(currency, value)
            // return TokenAmount.fromRawAmount(currency, JSBI.BigInt(value))
          }
  
          const outputAmount = toCurrencyAmount(result.outputAmount, currencyOut)
  
          const priceImpact = !result.amountOutUsd
            ? -1
            : ((-result.amountOutUsd + result.amountInUsd) * 100) / result.amountInUsd
  
          const { encodedSwapData, routerAddress } = result
  
          return new Aggregator(
            currencyAmountIn,
            outputAmount,
            result.amountInUsd,
            result.amountOutUsd,
            result.receivedUsd,
            result.swaps || [],
            result.tokens || {},
            TradeType.EXACT_INPUT,
            result.gasUsd,
            priceImpact,
            encodedSwapData,
            routerAddress,
          )
        } catch (e) {
          // ignore aborted request error
          if (!e?.message?.includes('Fetch is aborted') && !e?.message?.includes('The user aborted a request')) {
            const e = new Error('Aggregator API call failed')
            e.name = 'AggregatorAPIError'
            captureException(e, { 
              // level: 'error'
             })
          }
        }
      }
  
      return null
    }
  
    /**
     * @param baseURL
     * @param currencyAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param slippageTolerance
     * @param deadline
     * @param to
     * @param feeConfig
     * @param signal
     * @param minimumLoadingTime
     */
    public static async compareDex(
      baseURL: string,
      currencyAmountIn: CurrencyAmount<Currency>,
      currencyOut: Currency,
      slippageTolerance: number,
      deadline: number | undefined,
      to: string,
      feeConfig: FeeConfig | undefined,
      signal: AbortSignal,
      minimumLoadingTime: number,
    ): Promise<AggregationComparer | null> {
      const chainId: ChainId | undefined = currencyAmountIn.currency.chainId || currencyOut.chainId
      invariant(chainId !== undefined, 'CHAIN_ID')
  
      const amountIn = currencyAmountIn
      const tokenOut = currencyOut.wrapped
  
      const tokenInAddress = currencyAmountIn.currency.isNative ? NATIVE[chainId ?? ChainId.FANTOM].address : amountIn.currency.wrapped.address
      const tokenOutAddress = currencyOut.isNative ? NATIVE[chainId ?? ChainId.FANTOM].address : tokenOut.address
      const comparedDex = DEX_TO_COMPARE[chainId ?? ChainId.FANTOM]
  
      if (tokenInAddress && tokenOutAddress && comparedDex) {
        const search = new URLSearchParams({
          // Trade config
          tokenIn: tokenInAddress.toLowerCase(),
          tokenOut: tokenOutAddress.toLowerCase(),
          amountIn: currencyAmountIn.quotient?.toString(),
          saveGas: '0',
          gasInclude: '1',
          dexes: comparedDex,
          slippageTolerance: slippageTolerance?.toString() ?? '',
          deadline: deadline?.toString() ?? '',
          to,
  
          // Fee config
          chargeFeeBy: feeConfig?.chargeFeeBy ?? '',
          feeReceiver: feeConfig?.feeReceiver ?? '',
          isInBps: feeConfig?.isInBps !== undefined ? (feeConfig.isInBps ? '1' : '0') : '',
          feeAmount: feeConfig?.feeAmount ?? '',
  
          // Client data
          clientData: SOULSWAP_SOURCE,
        })
        try {
          const response = await fetchWaiting(
            `${baseURL}?${search}`,
            {
              signal,
              headers: {
                'X-Request-Id': sentryRequestId,
                'Accept-Version': 'Latest',
              },
            },
            minimumLoadingTime,
          )
          const swapData = await response.json()
  
          if (!swapData?.inputAmount || !swapData?.outputAmount) {
            return null
          }
  
          const toCurrencyAmount = function (value: string, currency: Currency): CurrencyAmount<Currency> {
            return CurrencyAmount.fromRawAmount(currency, value)
            // return TokenAmount.fromRawAmount(currency, JSBI.BigInt(value))
          }
  
          const inputAmount = toCurrencyAmount(swapData.inputAmount, currencyAmountIn.currency)
          const outputAmount = toCurrencyAmount(swapData.outputAmount, currencyOut)
          const amountInUsd = swapData.amountInUsd
          const amountOutUsd = swapData.amountOutUsd
          const receivedUsd = swapData.receivedUsd
  
          // const outputPriceUSD = priceData.data[tokenOutAddress] || Object.values(priceData.data[0]) || '0'
          return {
            inputAmount,
            outputAmount,
            amountInUsd,
            amountOutUsd,
            receivedUsd,
            // outputPriceUSD: parseFloat(outputPriceUSD),
            comparedDex,
          }
        } catch (e) {
          // ignore aborted request error
          if (!e?.message?.includes('Fetch is aborted') && !e?.message?.includes('The user aborted a request')) {
            const e = new Error('Aggregator API (comparedDex) call failed')
            e.name = 'AggregatorAPIError'
            captureException(e, { 
              // level: 'error' 
            })
          }
        }
      }
  
      return null
    }
  }