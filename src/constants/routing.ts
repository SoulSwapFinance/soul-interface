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
  [ChainId.BLAST]: [WNATIVE[ChainId.BLAST]],
  [ChainId.MOONRIVER]: [WNATIVE[ChainId.MOONRIVER]],
  [ChainId.BASE]: [WNATIVE[ChainId.BASE]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  // [ChainId.ETHEREUM]: [...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM], DAI, USDC, USDT, WBTC, RUNE, NFTX, STETH],
  [ChainId.TELOS]: [...WRAPPED_NATIVE_ONLY[ChainId.TELOS], TELOS.USDC, TELOS.USDT],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.SOUL,
    FANTOM.USDC,
    FANTOM.WETH,
    FANTOM.WBTC,
    // FANTOM.DAI,
    FANTOM.MDAI,
    FANTOM.MUSDC,
    FANTOM.MWBTC,
    FANTOM.MWETH,
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
  [ChainId.BASE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BASE], 
  ],
  [ChainId.ARBITRUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM], 
  ],
  [ChainId.BLAST]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BLAST], 
  ],
  [ChainId.TELOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.TELOS], 
    TELOS.USDC, TELOS.FTM, TELOS.BNB
  ],
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.SOUL,
    FANTOM.USDC,
    FANTOM.LZUSDC,
    FANTOM.WETH,
    FANTOM.WBTC,
    FANTOM.SURV,
    FANTOM.DAI,
    FANTOM.AVAX,
    FANTOM.BNB,
    FANTOM.FMULTI,
    FANTOM.MUSDC,
    FANTOM.MWBTC,
    FANTOM.MWETH,
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
  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.SOUL,
    FANTOM.USDC,
    FANTOM.WETH,
    FANTOM.WBTC,
    FANTOM.MDAI,
    FANTOM.MUSDC,
    FANTOM.MWETH,
    FANTOM.MWBTC,
  ],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB, BSC.WETH],
  [ChainId.AVALANCHE]: [...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE], AVALANCHE.USDC, AVALANCHE.SOUL, AVALANCHE.WBTC, AVALANCHE.WETH],
}