import { Currency, Token } from 'sdk';
import { AbstractCurrency } from './AbstractCurrency'

/**
 * Represents the native currency of the chain on which it resides
 */
export declare class NativeCurrency extends AbstractCurrency {
  readonly isNative: true;
  readonly isToken: false;
  constructor(chainId: number, decimals: number, symbol?: string, name?: string);
  get wrapped(): Token;
  equals(other: Currency): boolean;
}