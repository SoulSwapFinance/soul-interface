import { Currency } from '../Currency'
import { NativeCurrency } from '../NativeCurrency'
import { Token } from '../Token'
import { WNATIVE } from '../../constants/tokens'
import invariant from 'tiny-invariant'
import { ChainId } from 'sdk'

export class Polygon extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'MATIC', 'Matic (Polygon)')
  }

  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId]
    invariant(!!wnative, 'WRAPPED')
    return wnative
  }

  private static _cache: { [chainId: number]: Polygon } = {}

  public static onChain(chainId: number): Polygon {
    return this._cache[chainId ?? ChainId.FANTOM] ?? (this._cache[chainId ?? ChainId.FANTOM] = new Polygon(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
