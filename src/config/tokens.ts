import { ChainId, ENCHANT_ADDRESS, Token, WETH9, WNATIVE } from '../sdk'

export const BSC: { [key: string]: Token } = {
  BNB: new Token(ChainId.BSC, '', 18, 'BNB', 'Binance'),
  DAI: new Token(ChainId.BSC, '', 18, 'DAI', 'Dai Stablecoin'),
}

export const FANTOM: { [key: string]: Token } = {
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether'),
  FUSD: new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD'),

  SOUL: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'SoulPower'), // 27 AUG
  SEANCE: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'SeanceCircle'), // 27 AUG
  USDT: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'fUSDT', 'Frapped USDT'),
  fUSDT: new Token(ChainId.FANTOM, '0x049d68029688eAbF473097a2fC38ef61633A3C7A', 6, 'fUSDT', 'Frapped USDT'),
  gFUSDT: new Token(ChainId.FANTOM, '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5', 6, 'gFUSDT', 'Geist fUSDT'),
  MIM: new Token(ChainId.FANTOM, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'MIM', 'Magic Internet Money'),
  ENCHANT: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'),
  
}

export const MAINNET: { [key: string]: Token } = {
  CREAM: new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream'),
  DAI: new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin'),
  MEOW: new Token(ChainId.MAINNET, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi'),
  USDC: new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC'),
  XSUSHI: new Token(ChainId.MAINNET, '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', 18, 'xSUSHI', 'SushiBar'),
}

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

// SOUL
export const SOUL: ChainTokenMap = {
  // [ChainId.MAINNET]: new Token(ChainId.MAINNET, SOUL_ADDRESS[ChainId.MAINNET], 18, 'SOUL', 'SoulPower'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'SoulPower'), // 27 AUG
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'SoulPower'), // 31 JUL
}

// SEANCE TOKEN
export const SEANCE: ChainTokenMap = {
  // [ChainId.MAINNET]: new Token(ChainId.MAINNET, SEANCE_ADDRESS[ChainId.MAINNET], 18, 'SEANCE', 'SeanceCircle'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
}

export const ENCHANT: ChainTokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', 18, 'ENCHANT', 'Enchantment'), // 01 OCT
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '', 18, 'SPELL', 'Enchantment'), // TODO
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', 18, 'WFTM', 'Wrapped Fantom')
}