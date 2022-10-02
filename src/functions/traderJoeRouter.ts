import {
  ChainId,
  Currency,
  CurrencyAmount,
  Ether,
  SwapParameters,
  Trade,
  TradeOptions,
  TradeType,
} from '../sdk'

import { getAddress } from '@ethersproject/address'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

export interface JoeTrade {
  amountIn: string
  amountOut: string
  path: string[]
  to: string
  deadline: string
}

export interface JoeTradeOptions extends TradeOptions {}

export interface JoeSwapParameters extends Omit<SwapParameters, 'args'> {
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[] | JoeTrade)[]
}

function toHex(currencyAmount: CurrencyAmount<Currency>) {
  return `0x${currencyAmount.quotient.toString(16)}`
}

function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}

/**
 * Represents the Joe Router, and has static methods for helping execute trades.
 */
export abstract class JoeRouter {
  /**
   * Cannot be constructed.
   */
  private constructor() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */
  public static swapCallParameters(
    factoryAddress: string,
    trade: Trade<Currency, Currency, TradeType>,
    options: JoeTradeOptions
  ): JoeSwapParameters {
    const etherIn = trade.inputAmount.currency === Ether.onChain(ChainId.ETHEREUM)
    const etherOut = trade.outputAmount.currency === Ether.onChain(ChainId.ETHEREUM)

    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
    invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

    const to: string = validateAndParseAddress(options.recipient)
    const amountInCurrency = trade.maximumAmountIn(options.allowedSlippage)
    const amountIn: string = toHex(amountInCurrency)
    const amountOutCurrency = trade.minimumAmountOut(options.allowedSlippage)
    const amountOut: string = toHex(amountOutCurrency)
    const path: string[] = trade.route.path.map((token) => token.address)
    const deadline = `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`

    const joeTrade: JoeTrade = {
      amountIn,
      amountOut,
      path,
      to,
      deadline,
    }

    let methodName: string
    let args: (string | string[] | JoeTrade)[]
    let value: string

    switch (trade.tradeType) {
      case TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = 'swapExactAVAXForTokensAndTipAmount'
          args = [factoryAddress, joeTrade]
          value = toHex(amountInCurrency)
        } else if (etherOut) {
          methodName = 'swapExactTokensForAVAXAndTipAmount'
          args = [factoryAddress, joeTrade]
          value 
        }
        break
      case TradeType.EXACT_OUTPUT:
        if (etherIn) {
          methodName = 'swapAVAXForExactTokensAndTipAmount'
          args = [factoryAddress, joeTrade]
          value = toHex(amountInCurrency)
        }
        break
    }

    return {
      methodName,
      args,
      value,
    }
  }
}
