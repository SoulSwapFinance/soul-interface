import {
  BSC,
  FANTOM,
  AVALANCHE,
  TELOS,
  MOONRIVER,
} from './tokens'
// a list of tokens by chain
import { ChainId, Token, WNATIVE } from '../sdk'

// // a list of tokens by chain
type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM]],
  [ChainId.TELOS]: [WNATIVE[ChainId.TELOS]],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC]],
  [ChainId.FANTOM]: [WNATIVE[ChainId.FANTOM]],
  [ChainId.AVALANCHE]: [WNATIVE[ChainId.AVALANCHE]],
  [ChainId.MATIC]: [WNATIVE[ChainId.MATIC]],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM]],
  [ChainId.MOONRIVER]: [WNATIVE[ChainId.MOONRIVER]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  // [ChainId.ETHEREUM]: [...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM], DAI, USDC, USDT, WBTC, RUNE, NFTX, STETH],
  [ChainId.TELOS]: [...WRAPPED_NATIVE_ONLY[ChainId.TELOS], TELOS.USDC, TELOS.USDT],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.SOUL,
    FANTOM.DAI, 
    FANTOM.USDC,
    FANTOM.MUSDC,
    FANTOM.WBTC, 
    FANTOM.WETH
  ], // 27 AUG
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB, BSC.WETH],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE], 
    AVALANCHE.USDC, 
    AVALANCHE.SOUL, 
    AVALANCHE.WETH, 
    AVALANCHE.WBTC, 
    AVALANCHE.DAI
  ],
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    // WFTM[ChainId.ETHEREUM],
    // SOUL[ChainId.ETHEREUM],
    // USDC[ChainId.ETHEREUM],
  ],
  [ChainId.MOONRIVER]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MOONRIVER], MOONRIVER.USDC, MOONRIVER.WETH, 
  ],
  [ChainId.MATIC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MATIC], 
  ],
  [ChainId.ARBITRUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM], 
  ],
  [ChainId.TELOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.TELOS], 
    TELOS.USDC, TELOS.FTM, TELOS.BNB
  ],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.SOUL,
    FANTOM.LUX,
    FANTOM.DAI,
    FANTOM.SURV,
    FANTOM.USDC,
    FANTOM.MUSDC,
    FANTOM.WBTC,
    FANTOM.WETH,
    FANTOM.AVAX,
    FANTOM.BNB,
    FANTOM.FMULTI,
  ],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC], 
    BSC.DAI, 
    BSC.USD, 
    BSC.USDC, 
    BSC.USDT, 
    BSC.BTCB, 
    BSC.WETH
  ],
  [ChainId.AVALANCHE]: [
  ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE], 
  AVALANCHE.SOUL,
  AVALANCHE.USDC,
  AVALANCHE.WBTC,
  AVALANCHE.WETH,
  AVALANCHE.DAI,
  // AVALANCHE.BUSD,
  // AVALANCHE.FRAX,
  AVALANCHE.LINK,
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  // [ChainId.ETHEREUM]: [...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM], DAI, USDC, USDT, WBTC],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.SOUL, FANTOM.DAI, FANTOM.USDC, FANTOM.MUSDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB, BSC.WETH],
  [ChainId.AVALANCHE]: [...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE], AVALANCHE.USDC, AVALANCHE.SOUL, AVALANCHE.WBTC, AVALANCHE.WETH],
}