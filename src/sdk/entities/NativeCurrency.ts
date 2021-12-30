import { AbstractCurrency } from './AbstractCurrency'
import { Currency } from './Currency'
import { Token } from './Token'

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends AbstractCurrency {
  public readonly isNative: true = true
  public readonly isToken: false = false
  public readonly address: Token = new Token(250, '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18, 'FTM')// = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
}
