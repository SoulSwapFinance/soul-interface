import { AbstractCurrency } from './../AbstractCurrency'
import { ChainId } from '../../enums'
import { xCurrency } from './xCurrency'
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from '../../functions/validateAndParseAddress'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class xToken extends AbstractCurrency {
  public readonly chainId: ChainId
  public readonly address: string

  public readonly isNative: false = false
  public readonly isToken: true = true

  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    super(chainId, decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */

  // note: added to include xToken
  public equals(other: xCurrency | xToken): boolean {
    return other?.isToken && this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: xToken): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): xToken {
    return this
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: xCurrency, currencyB: xCurrency): boolean {
  if (currencyA instanceof xToken && currencyB instanceof xToken) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof xToken) {
    return false
  } else if (currencyB instanceof xToken) {
    return false
  } else {
    return currencyA === currencyB
  }
}
