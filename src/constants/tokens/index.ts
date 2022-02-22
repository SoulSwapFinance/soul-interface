import { ChainId, Ether, Token, WETH9, WNATIVE } from '../../sdk'

import { SupportedChainId } from '../chains'

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 8, 'BTCB', 'Bitcoin'),
  WETH: new Token(ChainId.BSC, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WETH', 'Wrapped Ether'),
}
  
export const FANTOM: { [key: string]: Token } = {

  SOUL: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'SoulPower'), // 27 AUG
  SEANCE: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'SeanceCircle'), // 27 AUG
  LUX: new Token(ChainId.FANTOM, '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', 9, 'LUX', 'Luxor Money'),
  WLUM: new Token(ChainId.FANTOM, '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', 9, 'WLUM', 'Wrapped Lumens'),
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  GRIMEVO: new Token(ChainId.FANTOM, '0x0a77866C01429941BFC7854c0c0675dB1015218b', 18, 'GRIM EVO', 'Grim EVO'),
  USDT: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'fUSDT', 'Frapped USDT'),
  fUSDT: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'fUSDT', 'Frapped USDT'),
  gFUSDT: new Token(ChainId.FANTOM, '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5', 6, 'gFUSDT', 'Geist fUSDT'),
  FUSD: new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD'), // 27 AUG
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether'),
  MIM: new Token(ChainId.FANTOM, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'MIM', 'Magic Internet Money'),
  ENCHANT: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'),
  SPELL: new Token(ChainId.FANTOM, '0x468003B688943977e6130F4F68F23aad939a1040', 18, 'SPELL', 'Spell Token'),
  
  
}

export const FANTOM_TESTNET: { [key: string]: Token } = {
  SOUL: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'SoulPower'), // 30 JUL
  SEANCE: new Token(ChainId.FANTOM_TESTNET, '0xD858E1a257Cb595Ba395520daD4c9C9592307734', 18, 'SEANCE', 'SeanceCircle'), // 30 JUL
  FUSD: new Token(ChainId.FANTOM_TESTNET, '0x306557358e20AEa124b16a548597897858D13cb2', 18, 'FUSD', 'Fantom USD'), // 31 JUL
  FETH: new Token(ChainId.FANTOM_TESTNET, '0x910a38cE2a26278c3493A95fe83e092aE821dF26', 18, 'fETH', 'Fantom Synthetic ETH'), // 31 JUL
  WBTC: new Token(ChainId.FANTOM_TESTNET, '0x2Eb4Ee20d9816Bd6810F69166dD046F09C737201', 18, 'fBTC', 'Fantom Synthetic BTC'),
}

// Default Ethereum chain tokens
export const ALPHA = new Token(ChainId.ETHEREUM, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const AMPL = new Token(ChainId.ETHEREUM, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const BAB = new Token(ChainId.ETHEREUM, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const BAC = new Token(ChainId.ETHEREUM, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const CREAM = new Token(ChainId.ETHEREUM, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const DOUGH = new Token(
  ChainId.ETHEREUM,
  '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
  18,
  'DOUGH',
  'PieDAO Dough v2'
)
export const DUCK = new Token(ChainId.ETHEREUM, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const ETH2X_FLI = new Token(
  ChainId.ETHEREUM,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
export const FEI = new Token(ChainId.ETHEREUM, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
export const FRAX = new Token(ChainId.ETHEREUM, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const FXS = new Token(ChainId.ETHEREUM, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const HBTC = new Token(ChainId.ETHEREUM, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const IBETH = new Token(
  ChainId.ETHEREUM,
  '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
  8,
  'ibETHv2',
  'Interest Bearing Ether v2'
)
export const MEOW = new Token(ChainId.ETHEREUM, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi')
export const MIR = new Token(ChainId.ETHEREUM, '0x09a3EcAFa817268f77BE1283176B946C4ff2E608', 18, 'MIR', 'Wrapped MIR')
export const NFTX = new Token(ChainId.ETHEREUM, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
export const PLAY = new Token(
  ChainId.ETHEREUM,
  '0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4',
  18,
  'PLAY',
  'Metaverse NFT Index'
)
export const PONT = new Token(
  ChainId.ETHEREUM,
  '0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2',
  9,
  'pONT',
  'Poly Ontology Token'
)
export const PWING = new Token(
  ChainId.ETHEREUM,
  '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a',
  9,
  'pWING',
  'Poly Ontology Wing Token'
)
export const RENBTC = new Token(1, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
export const RUNE = new Token(ChainId.ETHEREUM, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const STETH = new Token(ChainId.ETHEREUM, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')
export const TRIBE = new Token(ChainId.ETHEREUM, '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B', 18, 'TRIBE', 'Tribe')
export const UMA = new Token(ChainId.ETHEREUM, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA')
export const UMA_CALL = new Token(
  ChainId.ETHEREUM,
  '0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F',
  18,
  'UMA',
  'UMA 35 Call [30 Apr 2021]'
)
// export const USDC = new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDC = new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin')
export const USDP = new Token(
  ChainId.ETHEREUM,
  '0x1456688345527bE1f37E9e627DA0837D6f08C925',
  18,
  'USDP',
  'USDP Stablecoin'
)
export const UST = new Token(ChainId.ETHEREUM, '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD', 18, 'UST', 'Wrapped UST')
export const XSUSHI_CALL = new Token(
  ChainId.ETHEREUM,
  '0xada279f9301C01A4eF914127a6C2a493Ad733924',
  18,
  'XSUc25-0531',
  'XSUSHI 25 Call [31 May 2021]'
)

export const LIFT = new Token(ChainId.ETHEREUM, '0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6', 18, 'LIFT', 'LiftKitchen')
export const LFBTC = new Token(
  ChainId.ETHEREUM,
  '0xafcE9B78D409bF74980CACF610AFB851BF02F257',
  18,
  'LFBTC',
  'LiftKitchen BTC'
)
export const CVXCRV = new Token(ChainId.ETHEREUM, '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7', 18, 'cvxCRV', 'cvxCRV')

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

// SOUL
export const SOUL: ChainTokenMap = {
  // [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, SOUL_ADDRESS[ChainId.ETHEREUM], 18, 'SOUL', 'SoulPower'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'Soul Power'), // 27 AUG
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'Soul Power'), // 31 JUL
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

// WETH
export const WETH: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped ETH'),
}

// WBTC
export const WBTC: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped BTC'),
}

// BNB
export const BNB: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', 18, 'BNB', 'Binance'),
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

// GRIM
export const GRIM: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x7eC94C4327dC757601B4273cD67014d7760Be97E', 18, 'GRIM', 'GrimToken'),
}

// REAPER
export const REAPER: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x117dB78176C8eDe4F12fCd29d85Cd96b91A4cbBb', 18, 'REAPER', 'ReaperToken'),
}

// WFTM
export const WFTM: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18, 'FTM', 'Wrapped Fantom')
}

// USDT
export const USDT: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'FUSDT', 'Frapped USDT')
}

// DAI
export const DAI: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin')
}

// SEANCE
export const SEANCE: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'Seance Circle'),  // 31 JUL
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
}

// AURA
export const AURA: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x5b014e247c517Be62D622D44b912280B0b60ac73', 18, 'AURA', 'SoulAura'),  // 21 DEC
}

// ENCHANT
export const ENCHANT: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'),  // 30 OCT
  // [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '', 18, 'ENCHANT', 'Enchantment'), // 30 OCT
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  // 

  // [SupportedChainId.ETHEREUM]: new Token(
  //   ChainId.ETHEREUM,
  //   '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  //   18,
  //   'WETH',
  //   'Wrapped Ethereum'
  // ),

  [SupportedChainId.FANTOM]: new Token(
    ChainId.FANTOM,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    18,
    'WFTM',
    'Wrapped Fantom'
  ),
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
