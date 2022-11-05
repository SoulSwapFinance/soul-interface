import { BigNumber } from "@ethersproject/bignumber";
import { Tags, TokenInfo, Version } from "@uniswap/token-lists";
import { BIPS_BASE } from "constants/index";
import { JSBI, Percent } from "sdk";

export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
    JSBI.BigInt(100),
    BIPS_BASE
  ); // 1%
  export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
    JSBI.BigInt(300),
    BIPS_BASE
  ); // 3%
  export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
    JSBI.BigInt(500),
    BIPS_BASE
  ); // 5%

export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000);

export interface TokenList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly tokens: TokenInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
