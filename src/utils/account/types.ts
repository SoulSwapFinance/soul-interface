export interface Token {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    logoURL: string;
    totalSupply?: string;
    balanceOf?: string;
  }
  
  export type FormattedValueType = [string, string];