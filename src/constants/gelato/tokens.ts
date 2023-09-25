import { ChainId, Token } from "sdk";
export { MATIC_BASES } from "./tokens.matic";
export { FANTOM_BASES } from "./tokens.fantom";

export const UNI_ADDRESS = {
  [1]: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  [5]: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  [4]: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  [3]: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  [56]: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
  [137]: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
  [43114]: "0x8eBAf22B6F053dFFeaf46f4Dd9eFA95D89ba8580",
};

export const AMPL = new Token(
  1,
  "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
  9,
  "AMPL",
  "Ampleforth"
);
export const DAI = new Token(
  1,
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  18,
  "DAI",
  "Dai Stablecoin"
);
export const USDC = new Token(
  1,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC",
  "USD//C"
);
export const USDT = new Token(
  1,
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  6,
  "USDT",
  "Tether USD"
);
export const WBTC = new Token(
  1,
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  8,
  "WBTC",
  "Wrapped BTC"
);
export const FEI = new Token(
  1,
  "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
  18,
  "FEI",
  "Fei USD"
);
export const TRIBE = new Token(
  1,
  "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  18,
  "TRIBE",
  "Tribe"
);
export const FRAX = new Token(
  1,
  "0x853d955aCEf822Db058eb8505911ED77F175b99e",
  18,
  "FRAX",
  "Frax"
);
export const FXS = new Token(
  1,
  "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
  18,
  "FXS",
  "Frax Share"
);
export const renBTC = new Token(
  1,
  "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
  8,
  "renBTC",
  "renBTC"
);
export const UMA = new Token(
  1,
  "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
  18,
  "UMA",
  "UMA Voting Token v1"
);
// Mirror Protocol compat.
export const UST = new Token(
  1,
  "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  18,
  "UST",
  "Wrapped UST"
);
export const MIR = new Token(
  1,
  "0x09a3ecafa817268f77be1283176b946c4ff2e608",
  18,
  "MIR",
  "Wrapped MIR"
);
export const UNI: { [chainId: number]: Token } = {
  [1]: new Token(ChainId.ETHEREUM, UNI_ADDRESS[1], 18, "UNI", "Uniswap"),
  [56]: new Token(ChainId.BSC, UNI_ADDRESS[56], 18, "UNI", "Uniswap"),
  [137]: new Token(ChainId.MATIC, UNI_ADDRESS[137], 18, "UNI", "Uniswap"),
  [43114]: new Token(ChainId.AVALANCHE, UNI_ADDRESS[43114], 18, "UNI.e", "Uniswap"),
};

export const getBaseTokenLogoURLByTokenSymbol = (
  symbol: string | undefined
): string | undefined => {
  switch (symbol) {
    case "USDC":
      return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png";
    case "FTM":
      return "https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/ftm.jpg";
    case "WFTM":
      return "https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83/logo.png";
    case "SOUL":
      return "https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png";
    case "DAI":
      return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png";
    case "USDT":
    case "USDT.e":
      return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png";
    case "ETH":
    case "WETH":
      return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";
    case "QUICK":
      return "https://i.imgur.com/8G7QIrR.png";
    case "WMATIC":
    case "MATIC":
      return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png";
    case "WBTC":
    case "BTC":
      return "https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0x448d59B4302aB5d2dadf9611bED9457491926c8e/logo.png";
    case "WBNB":
    case "BNB":
      return "https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454/logo.png";
    case "BUSD":
      return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png";
    case "WAVAX":
    case "AVAX":
      return "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png";
    default:
      return undefined;
  }
};
