// used to mark unsupported tokens, these are hosted lists of unsupported tokens

const COINGECKO_LIST = "https://tokens.coingecko.com/uniswap/all.json";
const BA_LIST =
  "https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json";

const QUICKSWAP_LIST =
  "https://unpkg.com/quickswap-default-token-list@1.2.18/build/quickswap-default.tokenlist.json";

const SOULSWAP_LIST =
  "https://unpkg.com/soulswap-default-token-list@latest/build/soulswap-default.tokenlist.json";

const PANCAKESWAP_LIST =
  "https://tokens.pancakeswap.finance/pancakeswap-extended.json";

// const TRADERJOE_LIST =
//   "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json";

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST];

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS_MAINNET: string[] = [
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  // COMPOUND_LIST,
  COINGECKO_LIST,
  // GEMINI_LIST,
  SOULSWAP_LIST,
];

export const DEFAULT_LIST_OF_LISTS_MATIC: string[] = [QUICKSWAP_LIST];
export const DEFAULT_LIST_OF_LISTS_BSC: string[] = [PANCAKESWAP_LIST];
export const DEFAULT_LIST_OF_LISTS_FANTOM: string[] = [SOULSWAP_LIST];
// export const DEFAULT_LIST_OF_LISTS_AVALANCHE: string[] = [TRADERJOE_LIST];
export const DEFAULT_LIST_OF_LISTS_AVALANCHE: string[] = [SOULSWAP_LIST];

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  // GEMINI_LIST,
  QUICKSWAP_LIST,
  PANCAKESWAP_LIST,
  SOULSWAP_LIST,
  // TRADERJOE_LIST,
];

export const DEFAULT_ACTIVE_LIST_URLS_BY_CHAIN_ID: {
  [chainId: number]: string[];
} = {
  [1]: [SOULSWAP_LIST],
  [56]: [PANCAKESWAP_LIST],
  [137]: [QUICKSWAP_LIST],
  [250]: [SOULSWAP_LIST],
  [43114]: [SOULSWAP_LIST],
};
