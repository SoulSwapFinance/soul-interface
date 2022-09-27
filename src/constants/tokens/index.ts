import { WBTC_ADDRESS, WETH_ADDRESS } from 'constants/addresses'
import { ChainId, Ether, SOUL_ADDRESS, Token, WETH9, WNATIVE, WNATIVE_ADDRESS } from '../../sdk'

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
  SOUL: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'Soul Power'), // 27 AUG
  WFTM: new Token(ChainId.FANTOM, '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18, 'WFTM', 'Wrapped Fantom'), // 27 AUG
  SEANCE: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'Seance Circle'), // 27 AUG
  LUX: new Token(ChainId.FANTOM, '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', 9, 'LUX', 'Luxor Money'),
  WLUM: new Token(ChainId.FANTOM, '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', 9, 'WLUM', 'Wrapped Lumens'),
  LUM: new Token(ChainId.FANTOM, '0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c', 9, 'LUM', 'Lumens'),
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  SOR: new Token(ChainId.FANTOM, '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A', 18, 'SOR', 'SOR'),
  GRIMEVO: new Token(ChainId.FANTOM, '0x0a77866C01429941BFC7854c0c0675dB1015218b', 18, 'GRIMEVO', 'Grim EVO'),
  USDT: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'USDT', 'Frapped USDT'),
  gFUSDT: new Token(ChainId.FANTOM, '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5', 6, 'gFUSDT', 'Geist fUSDT'),
  FUSD: new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD'), // 27 AUG
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether'),
  MIM: new Token(ChainId.FANTOM, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'MIM', 'Magic Internet Money'),
  AVAX: new Token(ChainId.FANTOM, '0x511D35c52a3C244E7b8bd92c0C297755FbD89212', 18, 'AVAX', 'Avalanche'),
  ENCHANT: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'),
  SPELL: new Token(ChainId.FANTOM, '0x468003B688943977e6130F4F68F23aad939a1040', 18, 'SPELL', 'Spell Token'),
}

export const FANTOM_TESTNET: { [key: string]: Token } = {
  SOUL: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'Soul Power'), // 30 JUL
  SEANCE: new Token(ChainId.FANTOM_TESTNET, '0xD858E1a257Cb595Ba395520daD4c9C9592307734', 18, 'SEANCE', 'Seance Circle'), // 30 JUL
  FUSD: new Token(ChainId.FANTOM_TESTNET, '0x306557358e20AEa124b16a548597897858D13cb2', 18, 'FUSD', 'Fantom USD'), // 31 JUL
  FETH: new Token(ChainId.FANTOM_TESTNET, '0x910a38cE2a26278c3493A95fe83e092aE821dF26', 18, 'fETH', 'Fantom Synthetic ETH'), // 31 JUL
  WBTC: new Token(ChainId.FANTOM_TESTNET, '0x2Eb4Ee20d9816Bd6810F69166dD046F09C737201', 18, 'fBTC', 'Fantom Synthetic BTC'),
}

export const AVALANCHE: { [key: string]: Token } = {
  SOUL: new Token(ChainId.AVALANCHE, '0x11d6DD25c1695764e64F439E32cc7746f3945543', 18, 'SOUL', 'SoulPower'),
  USDC: new Token(ChainId.AVALANCHE, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USD Coin'),
  DAI: new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI', 'Dai Stablecoin'),
  WBTC: new Token(ChainId.AVALANCHE, '0x50b7545627a5162F82A992c33b87aDc75187B218', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether'),
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
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'Soul Power'), // JUL21
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'Soul Power'), // SEP22
}

export const USDC = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 6, 'USDC', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USD Coin'),
}

// LUXOR
export const LUXOR: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', 9, 'LUX', 'Luxor Money'),
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
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped ETH'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WETH_ADDRESS[ChainId.AVALANCHE], 18, 'WETH', 'Wrapped ETH'),
}

// WBTC
export const WBTC: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped BTC'),
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
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x0a77866C01429941BFC7854c0c0675dB1015218b', 18, 'GRIM EVO', 'Grim EVO'),
}

// WFTM
export const WFTM: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18, 'WFTM', 'Wrapped Fantom')
}

// USDT
export const USDT: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'FUSDT', 'Frapped USDT')
}

// DAI
export const DAI: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI', 'Dai Stablecoin')
}

// AVAX
export const AVAX: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x511D35c52a3C244E7b8bd92c0C297755FbD89212', 18, 'AVAX', 'Avalanche'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped Avalanche')
}

// SEANCE
export const SEANCE: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'Seance Circle'),  // JUL21
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442', 18, 'SEANCE', 'Seance Circle'),  // JUL21
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, '0x97Ee3C9Cf4E5DE384f95e595a8F327e65265cC4E', 18, 'SEANCE', 'Seance Circle'),  // SEP22
}

// AURA
export const AURA: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xf4253A709733CdD8568542bD9eb4029516a0147A', 18, 'AURA', 'SoulAura'),  // JUL22
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
