import { AbstractCurrency } from './AbstractCurrency'
import { ChainId } from '../enums'
import { Currency } from './Currency'
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from '../functions/validateAndParseAddress'
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends AbstractCurrency {
  public readonly chainId: ChainId
  public readonly address: string

  public readonly isNative: false = false
  public readonly isToken: true = true

  public constructor(
    chainId: ChainId,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string
  ) {
    super(chainId, decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return (
      other.isToken &&
      this.chainId === other.chainId &&
      this.address === other.address
    )
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Token {
    return this
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(
  currencyA: Currency,
  currencyB: Currency
): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const WETH9: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH9',
    'Wrapped Ether'
  ),

  [ChainId.BSC]: new Token(
    ChainId.BSC,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'WETH',
    'Wrapped Ether'
  ),

  [ChainId.FANTOM]: new Token(
    ChainId.FANTOM,
    '0x74b23882a30290451A17c44f4F05243b6b58C76d',
    18,
    'WETH',
    'Wrapped Ether'
  ),
}

export const WNATIVE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: WETH9[ChainId.MAINNET],
  
  
  [ChainId.FANTOM]: new Token(
    ChainId.FANTOM,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    18,
    'WFTM',
    'Wrapped FTM'
    ),

    [ChainId.BSC]: new Token(
      ChainId.BSC,
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      18,
      'WBNB',
      'Wrapped BNB'
    ),
    
  [ChainId.FANTOM_TESTNET]: new Token(
    ChainId.FANTOM_TESTNET,
    '0xf1277d1Ed8AD466beddF92ef448A132661956621',
    18,
    'WFTM',
    'Wrapped FTM'
  ),
}
