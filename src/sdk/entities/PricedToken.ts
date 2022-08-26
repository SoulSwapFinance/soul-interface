import { Price, Token } from 'sdk';
import { ChainId } from 'sdk/enums/ChainId';
/**
 * Represents an ERC20 token and its price, expressed in any given currency.
 */
export declare class PricedToken extends Token {
  readonly price: number
  constructor(chainId: ChainId, address: string, decimals: number, price: number, symbol?: string, name?: string);
}
