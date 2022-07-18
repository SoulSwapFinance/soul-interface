import invariant from 'tiny-invariant'

import { ChainId } from '../enums'
import { Price } from './Price'
import { Token } from './Token'

/**
 * Represents an ERC20 token and its price, expressed in any given currency.
 */
export class PricedToken extends Token {
  public readonly quote: Price<Token, Token>
    // TODO: quote was price, originally.
  constructor(chainId: ChainId, address: string, decimals: number, quote: Price<Token, Token>, symbol?: string, name?: string) {
    invariant(quote.baseCurrency.symbol === symbol && quote.baseCurrency.decimals === decimals, 'TOKEN')
    super(chainId, address, decimals, symbol, name)
    this.quote = quote
  }
}