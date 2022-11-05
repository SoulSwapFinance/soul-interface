import { Token } from "sdk";

export const WAVAX_AVAX = new Token(
  43114,
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  18,
  "WAVAX",
  "Wrapped AVAX"
);

export const DAI_AVAX = new Token(
  43114,
  "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  18,
  "DAI",
  "Dai Stablecoin"
);

export const USDC_AVAX = new Token(
  43114,
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  6,
  "USDC",
  "USD Coin"
);

export const SOUL_AVAX = new Token(
  43114,
  "0x11d6DD25c1695764e64F439E32cc7746f3945543",
  18,
  "SOUL",
  "Soul Power"
);

export const AVAX_BASES = [WAVAX_AVAX, USDC_AVAX, DAI_AVAX, SOUL_AVAX];
