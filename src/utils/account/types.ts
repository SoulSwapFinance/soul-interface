import { ChainId } from "sdk";

export interface Token {
    chainId?: ChainId
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    logoURL: string;
    totalSupply?: string;
    balanceOf?: string;
  }
  
  export type FormattedValueType = [string, string];