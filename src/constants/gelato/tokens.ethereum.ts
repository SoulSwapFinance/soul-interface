import { ChainId, Token, USDC_ADDRESS, USDT_ADDRESS, WNATIVE_ADDRESS } from "sdk";

export const WETH_ETH = new Token(
  ChainId.ETHEREUM,
  WNATIVE_ADDRESS[ChainId.ETHEREUM],
  18,
  "WETH",
  "Wrapped Ethereum"
);

export const USDC_ETH = new Token(
  ChainId.ETHEREUM,
  USDC_ADDRESS[ChainId.ETHEREUM],
  6,
  "USDC",
  "USD Coin"
);

export const USDT_ETH = new Token(
  ChainId.ETHEREUM,
  USDT_ADDRESS[ChainId.ETHEREUM],
  6,
  "USDT",
  "Tether USD"
);

export const ETH_BASES = [WETH_ETH, USDC_ETH, USDT_ETH];
