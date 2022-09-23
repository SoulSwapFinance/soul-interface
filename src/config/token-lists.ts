const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'

// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */
export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]
// const DEFAULT_TOKEN_LIST = 'constants/token-lists/soulswap.tokenlist.json'
const DEFAULT_TOKEN_LIST = 'https://raw.githubusercontent.com/soulswapfinance/default-token-list/master/soulswap.tokenlist.json'

// const NFTX_LIST = 'https://nftx.ethereumdb.com/v2/tokenlist/'
// const SYNTHETIX_LIST = 'synths.snx.eth'
// const AAVE_LIST = 'tokenlist.aave.eth'
// const CMC_ALL_LIST = 'defi.cmc.eth'
// const CMC_STABLECOIN = 'stablecoin.cmc.eth'
// const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
// const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
// const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
// const KLEROS_LIST = 't2crtokens.eth'
// export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
// const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
// const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
// const UMA_LIST = 'https://umaproject.org/uma.tokenlist.json'
// const WRAPPED_LIST = 'wrapped.tokensoft.eth'
// const DHEDGE_LIST = 'https://list.dhedge.eth.link/'

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  DEFAULT_TOKEN_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [DEFAULT_TOKEN_LIST]