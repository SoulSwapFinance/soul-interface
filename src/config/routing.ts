// a list of tokens by chain
import { ChainId, SOUL, Token, WNATIVE } from 'sdk'

import * as BSC from './tokens/bsc'
import * as ETHEREUM from './tokens/ethereum'
import * as FANTOM from './tokens/fantom'

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// List of all mirror's assets addresses.
// Last pulled from : https://whitelist.mirror.finance/eth/tokenlists.json
// TODO: Generate this programmatically ?
const MIRROR_ADDITIONAL_BASES: { [tokenAddress: string]: Token[] } = {
  [ETHEREUM.UST.address]: [ETHEREUM.MIR],
  [ETHEREUM.MIR.address]: [ETHEREUM.UST],
  '0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84': [ETHEREUM.MIR, ETHEREUM.UST], // mAAPL
  '0x59A921Db27Dd6d4d974745B7FfC5c33932653442': [ETHEREUM.MIR, ETHEREUM.UST], // mGOOGL
  '0x21cA39943E91d704678F5D00b6616650F066fD63': [ETHEREUM.MIR, ETHEREUM.UST], // mTSLA
  '0xC8d674114bac90148d11D3C1d33C61835a0F9DCD': [ETHEREUM.MIR, ETHEREUM.UST], // mNFLX
  '0x13B02c8dE71680e71F0820c996E4bE43c2F57d15': [ETHEREUM.MIR, ETHEREUM.UST], // mQQQ
  '0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9': [ETHEREUM.MIR, ETHEREUM.UST], // mTWTR
  '0x41BbEDd7286dAab5910a1f15d12CBda839852BD7': [ETHEREUM.MIR, ETHEREUM.UST], // mMSFT
  '0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7': [ETHEREUM.MIR, ETHEREUM.UST], // mAMZN
  '0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72': [ETHEREUM.MIR, ETHEREUM.UST], // mBABA
  '0x1d350417d9787E000cc1b95d70E9536DcD91F373': [ETHEREUM.MIR, ETHEREUM.UST], // mIAU
  '0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676': [ETHEREUM.MIR, ETHEREUM.UST], // mSLV
  '0x31c63146a635EB7465e5853020b39713AC356991': [ETHEREUM.MIR, ETHEREUM.UST], // mUSO
  '0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86': [ETHEREUM.MIR, ETHEREUM.UST], // mVIXY
}

const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM]],
  [ChainId.FANTOM]: [WNATIVE[ChainId.FANTOM]],
  [ChainId.FANTOM_TESTNET]: [WNATIVE[ChainId.FANTOM_TESTNET]],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    ETHEREUM.RUNE,
    ETHEREUM.NFTX,
    ETHEREUM.STETH,
    ETHEREUM.OHM_V1,
    ETHEREUM.OHM_V2,
    ETHEREUM.MIM,
  ],

  [ChainId.FANTOM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM],
    FANTOM.DAI,
    FANTOM.USDT,
    FANTOM.USDC,
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
  [ChainId.FANTOM_TESTNET]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM_TESTNET]
  ],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    ...MIRROR_ADDITIONAL_BASES,
    '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETHEREUM.ETH2X_FLI],
    [ETHEREUM.FEI.address]: [ETHEREUM.DPI],
    [ETHEREUM.FRAX.address]: [ETHEREUM.FXS],
    [ETHEREUM.FXS.address]: [ETHEREUM.FRAX],
    [ETHEREUM.WBTC.address]: [ETHEREUM.RENBTC],
    [ETHEREUM.RENBTC.address]: [ETHEREUM.WBTC],
    [ETHEREUM.PONT.address]: [ETHEREUM.PWING],
    [ETHEREUM.PWING.address]: [ETHEREUM.PONT],
    [ETHEREUM.PLAY.address]: [ETHEREUM.DOUGH],
    [ETHEREUM.DOUGH.address]: [ETHEREUM.PLAY],
    [ETHEREUM.IBETH.address]: [ETHEREUM.ALPHA],
    [ETHEREUM.ALPHA.address]: [ETHEREUM.IBETH],
    [ETHEREUM.HBTC.address]: [ETHEREUM.CREAM],
    [ETHEREUM.CREAM.address]: [ETHEREUM.HBTC],
    [ETHEREUM.DUCK.address]: [ETHEREUM.USDP],
    [ETHEREUM.USDP.address]: [ETHEREUM.DUCK],
    [ETHEREUM.BAB.address]: [ETHEREUM.BAC],
    [ETHEREUM.BAC.address]: [ETHEREUM.BAB],
    [ETHEREUM.LIFT.address]: [ETHEREUM.LFBTC],
    [ETHEREUM.LFBTC.address]: [ETHEREUM.LIFT],
    [ETHEREUM.CVXCRV.address]: [ETHEREUM.CRV],
    [ETHEREUM.CRV.address]: [ETHEREUM.CVXCRV],
    [ETHEREUM.WOOFY.address]: [ETHEREUM.YFI],
    [ETHEREUM.SPANK.address]: [ETHEREUM.RAI],
    [ETHEREUM.DOLA.address]: [ETHEREUM.INV],
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
    ETHEREUM.SPELL,
    ETHEREUM.ICE,
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
    FANTOM.SEANCE,
    FANTOM.USDC,
    FANTOM.LUX,
    FANTOM.WLUM,
    FANTOM.DAI,
    FANTOM.USDT,
  ],

  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.WETH,
    BSC.BTCB,
    // BSC.MIM,
    BSC.SPELL,
    BSC.ICE,
    BSC.DAI,
    BSC.USDC,
    BSC.USDT,
    BSC.USD,
  ],
  [ChainId.FANTOM_TESTNET]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.FANTOM_TESTNET]
  ],}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    ETHEREUM.OHM_V1,
    ETHEREUM.OHM_V2,
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
    // BSC.MIM,
  ],
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
