import {
  ALPHA,
  AMPL,
  AVALANCHE,
  BAB,
  BAC,
  BSC,
  CELO,
  CREAM,
  CRV,
  CVXCRV,
  DAI,
  DOUGH,
  DUCK,
  ETH2X_FLI,
  FANTOM,
  FEI,
  FRAX,
  FXS,
  HARMONY,
  HBTC,
  HECO,
  IBETH,
  LFBTC,
  LIFT,
  MATIC,
  MIR,
  NFTX,
  OKEX,
  PLAY,
  PONT,
  PWING,
  RENBTC,
  RUNE,
  SOUL,
  SPELL,
  STETH,
  TRIBE,
  UMA,
  USDC,
  USDP,
  USDT,
  UST,
  WBTC,
  XDAI,
} from './tokens'
// a list of tokens by chain
import { ChainId, Currency, Token, WNATIVE } from '@soulswap/sdk'

import { SupportedChainId } from './chains'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

// // a list of tokens by chain
// type ChainTokenList = {
//     readonly [chainId in ChainId]: Token[]
// }

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

// List of all mirror's assets addresses.
// Last pulled from : https://whitelist.mirror.finance/eth/tokenlists.json
// TODO: Generate this programmatically ?
const MIRROR_ADDITIONAL_BASES: { [tokenAddress: string]: Token[] } = {
  [UST.address]: [MIR],
  [MIR.address]: [UST],
  '0xd36932143F6eBDEDD872D5Fb0651f4B72Fd15a84': [MIR, UST], // mAAPL
  '0x59A921Db27Dd6d4d974745B7FfC5c33932653442': [MIR, UST], // mGOOGL
  '0x21cA39943E91d704678F5D00b6616650F066fD63': [MIR, UST], // mTSLA
  '0xC8d674114bac90148d11D3C1d33C61835a0F9DCD': [MIR, UST], // mNFLX
  '0x13B02c8dE71680e71F0820c996E4bE43c2F57d15': [MIR, UST], // mQQQ
  '0xEdb0414627E6f1e3F082DE65cD4F9C693D78CCA9': [MIR, UST], // mTWTR
  '0x41BbEDd7286dAab5910a1f15d12CBda839852BD7': [MIR, UST], // mMSFT
  '0x0cae9e4d663793c2a2A0b211c1Cf4bBca2B9cAa7': [MIR, UST], // mAMZN
  '0x56aA298a19C93c6801FDde870fA63EF75Cc0aF72': [MIR, UST], // mBABA
  '0x1d350417d9787E000cc1b95d70E9536DcD91F373': [MIR, UST], // mIAU
  '0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676': [MIR, UST], // mSLV
  '0x31c63146a635EB7465e5853020b39713AC356991': [MIR, UST], // mUSO
  '0xf72FCd9DCF0190923Fadd44811E240Ef4533fc86': [MIR, UST], // mVIXY
}

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WNATIVE[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WNATIVE[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WNATIVE[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WNATIVE[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WNATIVE[ChainId.KOVAN]],
  [ChainId.FANTOM]: [WNATIVE[ChainId.FANTOM]],
  [ChainId.FANTOM_TESTNET]: [WNATIVE[ChainId.FANTOM_TESTNET]],
  [ChainId.MATIC]: [WNATIVE[ChainId.MATIC]],
  [ChainId.MATIC_TESTNET]: [WNATIVE[ChainId.MATIC_TESTNET]],
  [ChainId.XDAI]: [WNATIVE[ChainId.XDAI]],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC]],
  [ChainId.BSC_TESTNET]: [WNATIVE[ChainId.BSC_TESTNET]],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM]],
  [ChainId.ARBITRUM_TESTNET]: [WNATIVE[ChainId.ARBITRUM_TESTNET]],
  [ChainId.MOONBEAM_TESTNET]: [WNATIVE[ChainId.MOONBEAM_TESTNET]],
  [ChainId.AVALANCHE]: [WNATIVE[ChainId.AVALANCHE]],
  [ChainId.AVALANCHE_TESTNET]: [WNATIVE[ChainId.AVALANCHE_TESTNET]],
  [ChainId.HECO]: [WNATIVE[ChainId.HECO]],
  [ChainId.HECO_TESTNET]: [WNATIVE[ChainId.HECO_TESTNET]],
  [ChainId.HARMONY]: [WNATIVE[ChainId.HARMONY]],
  [ChainId.HARMONY_TESTNET]: [WNATIVE[ChainId.HARMONY_TESTNET]],
  [ChainId.OKEX]: [WNATIVE[ChainId.OKEX]],
  [ChainId.OKEX_TESTNET]: [WNATIVE[ChainId.OKEX_TESTNET]],
  [ChainId.CELO]: [WNATIVE[ChainId.CELO]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC, RUNE, NFTX, STETH],
  [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB, BSC.WETH],
  [ChainId.ARBITRUM]: [...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM]],
  [ChainId.XDAI]: [...WRAPPED_NATIVE_ONLY[ChainId.XDAI], XDAI.USDC, XDAI.USDT, XDAI.WBTC, XDAI.WETH],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    AVALANCHE.DAI,
    AVALANCHE.USDT,
    AVALANCHE.WBTC,
    AVALANCHE.WETH,
  ],
  [ChainId.HARMONY]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    HARMONY.DAI,
    HARMONY.USDC,
    HARMONY.USDT,
    HARMONY.WBTC,
    HARMONY.WETH,
  ],
  [ChainId.HECO]: [...WRAPPED_NATIVE_ONLY[ChainId.HECO], HECO.DAI, HECO.USDC, HECO.USDT, HECO.WBTC, HECO.WETH],
  [ChainId.OKEX]: [...WRAPPED_NATIVE_ONLY[ChainId.OKEX], OKEX.DAI, OKEX.USDC, OKEX.USDT, OKEX.WBTC, OKEX.WETH],
  [ChainId.CELO]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.CELO],
    CELO.mCUSD,
    CELO.mCELO,
    CELO.mcEURO,
    CELO.cUSD,
    CELO.cEURO,
    CELO.cBTC,
  ],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.MAINNET]: {
    ...MIRROR_ADDITIONAL_BASES,
    '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETH2X_FLI],
    '0xb5083b964a0B6A447564657285AeE1E76524B3Db': [SPELL[ChainId.MAINNET]], // XSUSHI 25 Call [30 June 2021] // JUL 27th
    '0xB46F57e7Ce3a284d74b70447Ef9352B5E5Df8963': [UMA], // UMA 25 Call [30 June 2021]
    [FEI.address]: [TRIBE],
    [TRIBE.address]: [FEI],
    [FRAX.address]: [FXS],
    [FXS.address]: [FRAX],
    [WBTC.address]: [RENBTC],
    [RENBTC.address]: [WBTC],
    [PONT.address]: [PWING],
    [PWING.address]: [PONT],
    [PLAY.address]: [DOUGH],
    [DOUGH.address]: [PLAY],
    [IBETH.address]: [ALPHA],
    [ALPHA.address]: [IBETH],
    [HBTC.address]: [CREAM],
    [CREAM.address]: [HBTC],
    [DUCK.address]: [USDP],
    [USDP.address]: [DUCK],
    [BAB.address]: [BAC],
    [BAC.address]: [BAB],
    [LIFT.address]: [LFBTC],
    [LFBTC.address]: [LIFT],
    [CVXCRV.address]: [CRV],
    [CRV.address]: [CVXCRV],
  },
  [ChainId.MATIC]: {
    [MATIC.FRAX.address]: [MATIC.FXS],
    [MATIC.FXS.address]: [MATIC.FRAX],
    [MATIC.DRAX.address]: [MATIC.DMAGIC],
    [MATIC.DMAGIC.address]: [MATIC.DRAX],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WNATIVE[ChainId.MAINNET]],
  },
  [ChainId.MATIC]: {
    [MATIC.TEL.address]: [MATIC.SOUL, MATIC.AAVE],
  },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
// export const COMMON_BASES: ChainCurrencyList = {
//     [ChainId.MAINNET]: [ExtendedEther.onChain(1), DAI, USDC, USDT, WBTC, WETH9_EXTENDED[1]],
//     [3]: [ExtendedEther.onChain(3), WETH9_EXTENDED[3]],
//     [4]: [ExtendedEther.onChain(4), WETH9_EXTENDED[4]],
//     [5]: [ExtendedEther.onChain(5), WETH9_EXTENDED[5]],
//     [42]: [ExtendedEther.onChain(42), WETH9_EXTENDED[42]],
//     [SupportedChainId.ARBITRUM_KOVAN]: [
//         ExtendedEther.onChain(SupportedChainId.ARBITRUM_KOVAN),
//         WETH9_EXTENDED[SupportedChainId.ARBITRUM_KOVAN],
//     ],
//     [SupportedChainId.ARBITRUM_ONE]: [
//         ExtendedEther.onChain(SupportedChainId.ARBITRUM_ONE),
//         WETH9_EXTENDED[SupportedChainId.ARBITRUM_ONE],
//     ],
// }

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB, BSC.WETH],
  [ChainId.ARBITRUM]: [...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM]],
  [ChainId.XDAI]: [...WRAPPED_NATIVE_ONLY[ChainId.XDAI], XDAI.USDC, XDAI.USDT, XDAI.WBTC, XDAI.WETH],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    AVALANCHE.DAI,
    AVALANCHE.USDT,
    AVALANCHE.WBTC,
    AVALANCHE.WETH,
  ],
  [ChainId.HARMONY]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    HARMONY.DAI,
    HARMONY.USDC,
    HARMONY.USDT,
    HARMONY.WETH,
    HARMONY.WBTC,
  ],
  [ChainId.HECO]: [...WRAPPED_NATIVE_ONLY[ChainId.HECO], HECO.DAI, HECO.USDC, HECO.USDT, HECO.WBTC, HECO.WETH],
  [ChainId.OKEX]: [...WRAPPED_NATIVE_ONLY[ChainId.OKEX], OKEX.DAI, OKEX.USDC, OKEX.USDT, OKEX.WBTC, OKEX.WETH],
  // [ChainId.CELO]: [
  //   ...WRAPPED_NATIVE_ONLY[ChainId.CELO],
  //   CELO.mCUSD,
  //   CELO.mCELO,
  //   CELO.mcEURO,
  //   CELO.cEUR,
  // ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB, BSC.WETH],
  [ChainId.ARBITRUM]: [...WRAPPED_NATIVE_ONLY[ChainId.ARBITRUM]],
  [ChainId.XDAI]: [...WRAPPED_NATIVE_ONLY[ChainId.XDAI], XDAI.USDC, XDAI.USDT, XDAI.WBTC, XDAI.WETH],
  [ChainId.AVALANCHE]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.AVALANCHE],
    AVALANCHE.DAI,
    AVALANCHE.USDT,
    AVALANCHE.WBTC,
    AVALANCHE.WETH,
  ],
  [ChainId.HARMONY]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.HARMONY],
    HARMONY.DAI,
    HARMONY.USDC,
    HARMONY.USDT,
    HARMONY.WBTC,
    HARMONY.WETH,
  ],
  [ChainId.HECO]: [...WRAPPED_NATIVE_ONLY[ChainId.HECO], HECO.DAI, HECO.USDC, HECO.USDT, HECO.WBTC, HECO.WETH],
  [ChainId.OKEX]: [...WRAPPED_NATIVE_ONLY[ChainId.OKEX], OKEX.DAI, OKEX.USDC, OKEX.USDT, OKEX.WBTC, OKEX.WETH],
  // [ChainId.CELO]: [
  //   ...WRAPPED_NATIVE_ONLY[ChainId.CELO],
  //   CELO.mCUSD,
  //   CELO.mCELO,
  //   CELO.mcEURO,
  //   CELO.cEUR,
  // ],
}

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][]
} = {
  [ChainId.MAINNET]: [
    [SOUL[ChainId.MAINNET] as Token, WNATIVE[ChainId.MAINNET]],
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
}
