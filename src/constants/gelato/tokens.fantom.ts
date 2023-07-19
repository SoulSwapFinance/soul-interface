import { Token } from "sdk";

export const USDC_FANTOM = new Token(
  250,
  "0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf",
  6,
  "USDC",
  "USD Coin"
);
export const DAI_FANTOM = new Token(
  250,
  "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
  18,
  "DAI",
  "Dai Stablecoin"
);
export const WETH_FANTOM = new Token(
  250,
  "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  18,
  "WETH",
  "Wrapped ETH"
);
export const SOUL_FANTOM = new Token(
  250,
  "0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07",
  18,
  "SOUL",
  "Soul Power"
);
export const WBTC_FANTOM = new Token(
  250,
  // "0x321162Cd933E2Be498Cd2267a90534A804051b11",
  "0x448d59B4302aB5d2dadf9611bED9457491926c8e", // axlBTC
  8,
  "WBTC",
  "Wrapped BTC"
);
export const WBNB_FANTOM = new Token(
  250,
  "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454",
  18,
  "WBNB",
  "Wrapped Binance"
);
export const WFTM_FANTOM = new Token(
  250,
  "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  18,
  "WFTM",
  "Wrapped Fantom"
);
export const LUX_FANTOM = new Token(
  250,
  "0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b",
  9,
  "LUX",
  "Luxor Money"
);

export const FANTOM_BASES = [
  USDC_FANTOM,
  DAI_FANTOM,
  WETH_FANTOM,
  SOUL_FANTOM,
  LUX_FANTOM,
  WBNB_FANTOM,
  WBTC_FANTOM,
  WFTM_FANTOM,
];
