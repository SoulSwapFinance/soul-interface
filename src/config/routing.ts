// a list of tokens by chain
import { ChainId, SOUL, Token, WNATIVE } from 'sdk'

import * as BSC from './tokens/bsc'
import * as ETHEREUM from './tokens/ethereum'
import * as TELOS from './tokens/telos'
import * as FANTOM from './tokens/fantom'
import * as AVALANCHE from './tokens/avalanche'

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM]],
  [ChainId.TELOS]: [WNATIVE[ChainId.TELOS]],
  [ChainId.FANTOM]: [WNATIVE[ChainId.FANTOM]],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC]],
  [ChainId.AVALANCHE]: [WNATIVE[ChainId.AVALANCHE]],
  [ChainId.MATIC]: [WNATIVE[ChainId.MATIC]],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM]],
  [ChainId.MOONRIVER]: [WNATIVE[ChainId.MOONRIVER]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.FTM,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    ETHEREUM.MIM,
  ],

  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.DAI,
    FANTOM.LZUSDC,
    FANTOM.MUSDC,
    FANTOM.WBTC,
    FANTOM.WETH,
    FANTOM.SOUL,
    FANTOM.SEANCE,
    FANTOM.LUX,
    FANTOM.WLUM,
  ],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.DAI,
    BSC.USD,
    BSC.USDC,
    BSC.USDT,
    BSC.BTCB,
    BSC.WETH,
    // BSC.MIM,
  ],
  [ChainId.TELOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.TELOS],
    TELOS.USDC,
    TELOS.USDT,
    TELOS.WETH,
  ],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    AVALANCHE.DAI,
    AVALANCHE.SOUL,
    AVALANCHE.BNB,
    AVALANCHE.USDC,
    AVALANCHE.WETH,
    AVALANCHE.WBTC,
  ],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETHEREUM.ETH2X_FLI],
    [ETHEREUM.WBTC.address]: [ETHEREUM.RENBTC],
    [ETHEREUM.RENBTC.address]: [ETHEREUM.WBTC],
    [ETHEREUM.IBETH.address]: [ETHEREUM.ALPHA],
    [ETHEREUM.ALPHA.address]: [ETHEREUM.IBETH],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    [ETHEREUM.AMPL.address]: [ETHEREUM.DAI, WNATIVE[ChainId.ETHEREUM]],
  },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.WBTC,
    ETHEREUM.MIM,
    ETHEREUM.FTM,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.DAI,
  ],

  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    SOUL[ChainId.FANTOM],
    FANTOM.WETH,
    FANTOM.WBTC,
    FANTOM.SOUL,
    FANTOM.LZUSDC,
    FANTOM.MUSDC,
    FANTOM.LUX,
    FANTOM.WLUM,
    FANTOM.DAI
  ],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.WETH,
    BSC.BTCB,
    // BSC.MIM,
    BSC.ICE,
    BSC.DAI,
    BSC.USDC,
    BSC.USDT,
    BSC.USD,
  ],
  [ChainId.TELOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.TELOS]
  ],
  [ChainId.MOONRIVER]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONRIVER]
  ],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE], 
    AVALANCHE.WBTC,
    AVALANCHE.WETH,
    AVALANCHE.DAI,
    AVALANCHE.SOUL,
    AVALANCHE.BNB,
    AVALANCHE.USDC,
    // AVALANCHE.BUSD,
    // AVALANCHE.FRAX,
    // AVALANCHE.LINK,

  ],
  [ChainId.MATIC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MATIC]
  ],
  [ChainId.ARBITRUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM]
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    ETHEREUM.MIM,
  ],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.DAI,
    FANTOM.SOUL,
    FANTOM.SEANCE,
    FANTOM.USDC,
    FANTOM.WBTC,
    FANTOM.WETH,
    FANTOM.BNB,
    FANTOM.LUX,
    FANTOM.WLUM,
    FANTOM.MIM,
  ],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.DAI,
    BSC.USD,
    BSC.USDC,
    BSC.USDT,
    BSC.BTCB,
    BSC.WETH,
  ],
  [ChainId.TELOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.TELOS],
    TELOS.USDC,
    TELOS.SOUL,
    TELOS.WETH,
  ],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    AVALANCHE.USDC,
    AVALANCHE.SOUL,
    AVALANCHE.BNB,
    AVALANCHE.WETH,
    AVALANCHE.WBTC,
    AVALANCHE.DAI,
  ],
  [ChainId.MOONRIVER]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONRIVER]
  ]
}

// export const PINNED_PAIRS: {
//   readonly [chainId in ChainId]?: [Token, Token][]
// } = {
//   [ChainId.FANTOM]: [
//     [SOUL[ChainId.FANTOM], WNATIVE[ChainId.FANTOM]],
//     [FANTOM.USDC, FANTOM.USDT],
//     [FANTOM.DAI, FANTOM.USDT],
//   ],
// }
