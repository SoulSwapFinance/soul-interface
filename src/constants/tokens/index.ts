import { SURV_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, ETH_ADDRESS, MULTI_WETH_ADDRESS } from 'constants/addresses'
import { AVAX_ADDRESS, BNB_ADDRESS, BUSD_ADDRESS, ChainId, DAI_ADDRESS, Ether, FMULTI_ADDRESS, FRAX_ADDRESS, LINK_ADDRESS, LUX_ADDRESS, MPX_ADDRESS, MULTI_AVAX_ADDRESS, MULTI_DAI_ADDRESS, MULTI_WBTC_ADDRESS, NATIVE, SEANCE_ADDRESS, SOUL_ADDRESS, Token, USDC_ADDRESS, WETH9, WNATIVE, WNATIVE_ADDRESS } from '../../sdk'

import { SupportedChainId } from '../chains'

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 8, 'BTCB', 'Bitcoin'),
  WETH: new Token(ChainId.BSC, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WETH', 'Wrapped Ether'),
}

export const TELOS: { [key: string]: Token } = {
  USDC: new Token(ChainId.TELOS, '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', 6, 'USDC', 'USD Coin'),
  AVAX: new Token(ChainId.TELOS, '0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D', 18, 'AVAX', 'Avalanche'),
  FTM: new Token(ChainId.TELOS, '0xC1Be9a4D5D45BeeACAE296a7BD5fADBfc14602C4', 18, 'FTM', 'Fantom Opera'),
  BNB: new Token(ChainId.TELOS, '0x2C78f1b70Ccf63CDEe49F9233e9fAa99D43AA07e', 18, 'BNB', 'Binance'),
}

export const FANTOM: { [key: string]: Token } = {
  // NATIVE: new Token(ChainId.FANTOM, ETH_ADDRESS, 18, NATIVE[ChainId.FANTOM].symbol, NATIVE[ChainId.FANTOM].name),
  SOUL: new Token(ChainId.FANTOM, SOUL_ADDRESS[ChainId.FANTOM], 18, 'SOUL', 'Soul Power'), // 27 AUG
  WFTM: new Token(ChainId.FANTOM, WNATIVE_ADDRESS[ChainId.FANTOM], 18, 'WFTM', 'Wrapped Fantom'), // 27 AUG
  FMULTI: new Token(ChainId.FANTOM, FMULTI_ADDRESS[ChainId.FANTOM], 18, 'FMULTI', 'Fuck Multi'),
  MPX: new Token(ChainId.FANTOM, MPX_ADDRESS[ChainId.FANTOM], 18, 'MPX', 'Morphex'),
  SEANCE: new Token(ChainId.FANTOM, SEANCE_ADDRESS[ChainId.FANTOM], 18, 'SEANCE', 'Seance Circle'), // 27 AUG
  LUX: new Token(ChainId.FANTOM, LUX_ADDRESS[ChainId.FANTOM], 9, 'LUX', 'Luxor Money'),
  WLUM: new Token(ChainId.FANTOM, '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', 9, 'WLUM', 'Wrapped Lumens'),
  LUM: new Token(ChainId.FANTOM, '0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c', 9, 'LUM', 'Lumens'),
  USDC: new Token(ChainId.FANTOM, USDC_ADDRESS[ChainId.FANTOM], 6, 'USDC', 'USD Coin (Axelar)'),
  LZUSDC: new Token(ChainId.FANTOM, '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf', 6, 'lzUSDC', 'USDC (LayerZero)'),
  MUSDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'mUSDC', 'USDC (Multichain)'),
  LINK: new Token(ChainId.FANTOM, LINK_ADDRESS[ChainId.FANTOM], 18, 'LINK', 'Chainlink'),
  BNB: new Token(ChainId.FANTOM, BNB_ADDRESS[ChainId.FANTOM], 18, 'BNB', 'Binance'),
  MWBTC: new Token(ChainId.FANTOM, MULTI_WBTC_ADDRESS[ChainId.FANTOM], 8, 'mWBTC', 'Wrapped Bitcoin (Multichain)'),
  WBTC: new Token(ChainId.FANTOM, WBTC_ADDRESS[ChainId.FANTOM], 8, 'WBTC', 'Wrapped Bitcoin (Axelar)'),
  DAI: new Token(ChainId.FANTOM, DAI_ADDRESS[ChainId.FANTOM], 18, 'DAI', 'DAI (Axelar)'),
  MDAI: new Token(ChainId.FANTOM, MULTI_DAI_ADDRESS[ChainId.FANTOM], 18, 'mDAI', 'DAI (Multichain)'),
  SOR: new Token(ChainId.FANTOM, '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A', 18, 'SOR', 'SOR'),
  SURV: new Token(ChainId.FANTOM, SURV_ADDRESS[ChainId.FANTOM], 18, 'SURV', 'SurveyorDAO'),
  GRIMEVO: new Token(ChainId.FANTOM, '0x0a77866C01429941BFC7854c0c0675dB1015218b', 18, 'GRIMEVO', 'Grim EVO'),
  USDT: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'USDT', 'Frapped USDT'),
  FUSD: new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD'), // 27 AUG
  WETH: new Token(ChainId.FANTOM, WETH_ADDRESS[ChainId.FANTOM], 18, 'WETH', 'Wrapped Ether (Axelar)'),
  MWETH: new Token(ChainId.FANTOM, MULTI_WETH_ADDRESS[ChainId.FANTOM], 18, 'mWETH', 'Wrapped Ether (Multichain)'),
  MIM: new Token(ChainId.FANTOM, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'MIM', 'Magic Internet Money'),
  MAVAX: new Token(ChainId.FANTOM, MULTI_AVAX_ADDRESS[ChainId.FANTOM], 18, 'mAVAX', 'Avalanche (Multichain)'),
  AVAX: new Token(ChainId.FANTOM, AVAX_ADDRESS[ChainId.FANTOM], 18, 'AVAX', 'Avalanche (Axelar)'),
  ENCHANT: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'),
  SPELL: new Token(ChainId.FANTOM, '0x468003B688943977e6130F4F68F23aad939a1040', 18, 'SPELL', 'Spell Token'),
}

export const AVALANCHE: { [key: string]: Token } = {
  BNB: new Token(ChainId.AVALANCHE, BNB_ADDRESS[ChainId.AVALANCHE], 18, 'BNB', 'Binance'),
  SOUL: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'SoulPower'),
  USDC: new Token(ChainId.AVALANCHE, USDC_ADDRESS[ChainId.AVALANCHE], 6, 'USDC', 'USD Coin'),
  DAI: new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether'),
  WBTC: new Token(ChainId.AVALANCHE, '0x50b7545627a5162F82A992c33b87aDc75187B218', 8, 'WBTC', 'Wrapped Bitcoin'),
  BUSD: new Token(ChainId.AVALANCHE, BUSD_ADDRESS[ChainId.AVALANCHE], 18, 'BUSD', 'Binance USD'),
  FRAX: new Token(ChainId.AVALANCHE, FRAX_ADDRESS[ChainId.AVALANCHE], 18, 'FRAX', 'Frax'),
  LINK: new Token(ChainId.AVALANCHE, LINK_ADDRESS[ChainId.AVALANCHE], 18, 'LINK', 'Chainlink'),
}

export const MOONRIVER: { [key: string]: Token } = {
  DAI: new Token(ChainId.MOONRIVER, '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844', 18, 'DAI', 'Dai Stablecoin'),
  WBTC: new Token(ChainId.MOONRIVER, '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.MOONRIVER, '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C', 18, 'WETH', 'Wrapped Ether'),
  MATIC: new Token(ChainId.MOONRIVER, '0x682F81e57EAa716504090C3ECBa8595fB54561D8', 18, 'MATIC', 'Polygon (Matic)'),
}

// Default Ethereum chain tokens
export const MEOW = new Token(ChainId.ETHEREUM, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi')
export const MIR = new Token(ChainId.ETHEREUM, '0x09a3EcAFa817268f77BE1283176B946C4ff2E608', 18, 'MIR', 'Wrapped MIR')

// export const USDC = new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const UST = new Token(ChainId.ETHEREUM, '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD', 18, 'UST', 'Wrapped UST')

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

// SOUL
export const SOUL: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, SOUL_ADDRESS[ChainId.ETHEREUM], 18, 'SOUL', 'Soul Power'), // SEP22
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, SOUL_ADDRESS[ChainId.FANTOM], 18, 'SOUL', 'Soul Power'), // AUG21
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'Soul Power'), // SEP22
}

export const USDC = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x1B6382DBDEa11d97f24495C9A90b7c88469134a4', 6, 'USDC', 'USD Coin (Axelar)'),
  // [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 6, 'USDC', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USD Coin'),
}

// LZUSDC
export const LZUSDC: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf', 6, 'lzUSDC', 'USDC (LayerZero)'),
} 

// MUSDC
export const MUSDC: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'mUSDC', 'USDC (Multichain)'),
} 

// LUXOR
export const LUXOR: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', 9, 'LUX', 'Luxor Money'),
}

// SURV
export const SURV: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x5d9EaFC54567F34164A269Ba6C099068df6ef651', 18, 'SURV', 'SurvToken'),
}

// MIM
export const MIM: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'MIM', 'Magic Internet Money'),
}

// FUSD
export const FUSD: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD'),
}

// WLUM
export const WLUM: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', 9, 'WLUM', 'Wrapped Lumens'),
}

// LUM
export const LUM: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c', 9, 'LUM', 'Lumens'),
}

// SOR
export const SOR: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A', 18, 'SOR', 'SOR'),
}

// WETH
export const WETH: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, WNATIVE_ADDRESS[ChainId.ETHEREUM], 18, 'WETH', 'Wrapped ETH'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xfe7eDa5F2c56160d406869A8aA4B2F365d544C7B', 18, 'axlETH', 'Wrapped ETH (Axelar)'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WETH_ADDRESS[ChainId.AVALANCHE], 18, 'mETH', 'Wrapped ETH'),
}

export const MWETH: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped ETH (Multichain)'),
}


export const MWBTC: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'mWBTC', 'Wrapped BTC (Multichain)'),
}


// WBTC
export const WBTC: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, WBTC_ADDRESS[ChainId.ETHEREUM], 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, WBTC_ADDRESS[ChainId.FANTOM], 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WBTC_ADDRESS[ChainId.AVALANCHE], 8, 'WBTC', 'Wrapped BTC'),
}

// BNB
export const BNB: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', 18, 'BNB', 'Binance'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x264c1383EA520f73dd837F915ef3a732e204a493', 18, 'BNB', 'Binance'),
}
// CRV
export const CRV: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x1E4F97b9f9F913c46F1632781732927B9019C68b', 18, 'CRV', 'Curve DAO'),
}
// LINK
export const LINK: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8', 18, 'LINK', 'ChainLink'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x5947BB275c521040051D82396192181b413227A3', 18, 'LINK', 'ChainLink'),
}

// ANY
export const ANY: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xdDcb3fFD12750B45d32E084887fdf1aABAb34239', 18, 'ANY', 'AnySwap'),
}

// UNIDX
export const UNIDX: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0', 18, 'UNIDX', 'UniDex'),
}

// GRIM EVO
export const GRIMEVO: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x0a77866C01429941BFC7854c0c0675dB1015218b', 18, 'GRIMEVO', 'Grim EVO'),
}

// WFTM
export const WFTM: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.FANTOM, '0x4E15361FD6b4BB609Fa63C81A2be19d873717870', 18, 'FTM', 'Fantom'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18, 'WFTM', 'Wrapped Fantom')
}

// USDT
export const USDT: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'FUSDT', 'Frapped USDT')
}

// DAI
export const DAI: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, DAI_ADDRESS[ChainId.ETHEREUM], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, DAI_ADDRESS[ChainId.FANTOM], 18, 'DAI', 'DAI (Axelar)'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI', 'Dai Stablecoin')
}

// MDAI
export const MDAI: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MULTI_DAI_ADDRESS[ChainId.FANTOM], 18, 'mDAI', 'DAI (Multichain)'),
}

// AVAX
export const AVAX: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'AVAX', 'Avalanche'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, AVAX_ADDRESS[ChainId.FANTOM], 18, 'AVAX', 'Avalanche (Axelar)'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped Avalanche')
}

// mAVAX
export const MAVAX: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MULTI_AVAX_ADDRESS[ChainId.FANTOM], 18, 'mAVAX', 'Avalanche (Multichain)'),
}

// SEANCE
export const SEANCE: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'Seance Circle'),  // JUL21
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x97Ee3C9Cf4E5DE384f95e595a8F327e65265cC4E', 18, 'SEANCE', 'Seance Circle'),  // SEP22
}

// AURA
export const AURA: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x91Dd51634f280DB77dA5D8c383a9de1e72224C4e', 18, 'AURA', 'SoulAura'),  // AUG23
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x385cC4Ce661a32891919153676efd4E208AAc3Bc', 18, 'AURA', 'SoulAura'),  // SEP22
}

// ENCHANT
export const ENCHANT: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'),  // 30 OCT
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  // 
  [SupportedChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ethereum'
  ),
  // [SupportedChainId.FANTOM]: new Token(
  //   ChainId.FANTOM,
  //   '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  //   18,
  //   'WFTM',
  //   'Wrapped Fantom'
  // ),
  // 56: undefined,
  // 4002: undefined
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WNATIVE) return WNATIVE[this.chainId]
    // if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]

    throw new Error('Unsupported Chain ID')
  }

  public static onChain(chainId: number): ExtendedEther {
    return new ExtendedEther(chainId)
  }
}
