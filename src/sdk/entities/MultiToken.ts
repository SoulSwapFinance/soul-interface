import { ChainId } from '../enums'
import { MultiCurrency } from './MultiCurrency'

export declare class MultiToken extends MultiCurrency {
  readonly chainId: ChainId;
  readonly address: string;
  constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string, underlying?: any, ContractVersion?: any, destChains?: any, logoUrl?: any, price?: any, tokenid?: any, version?: any, routerToken?: any);
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  equals(other: MultiToken): boolean;
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  sortsBefore(other: MultiToken): boolean;
}
// /**
//  * Compares two currencies for equality
//  */
// export function currencyEquals(currencyA: MultiCurrency, currencyB: MultiCurrency): boolean {
//   if (currencyA instanceof MultiToken && currencyB instanceof MultiToken) {
//     return currencyA.equals(currencyB)
//   } else if (currencyA instanceof MultiToken) {
//     return false
//   } else if (currencyB instanceof MultiToken) {
//     return false
//   } else {
//     return currencyA === currencyB
//   }
// }
