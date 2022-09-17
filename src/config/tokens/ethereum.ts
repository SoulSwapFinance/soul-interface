import { ChainId, SOUL_ADDRESS, Token } from 'sdk'

// Default Ethereum chain tokens
export const ALPHA = new Token(
  ChainId.ETHEREUM,
  '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
  18,
  'ALPHA',
  'AlphaToken'
)
export const AMPL = new Token(ChainId.ETHEREUM, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const DAI = new Token(
  ChainId.ETHEREUM,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const ETH2X_FLI = new Token(
  ChainId.ETHEREUM,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
export const FEI = new Token(ChainId.ETHEREUM, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
export const FRAX = new Token(ChainId.ETHEREUM, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
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
export const RENBTC = new Token(ChainId.ETHEREUM, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
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
export const USDC = new Token(ChainId.ETHEREUM, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDP = new Token(
  ChainId.ETHEREUM,
  '0x1456688345527bE1f37E9e627DA0837D6f08C925',
  18,
  'USDP',
  'USDP Stablecoin'
)
export const USDT = new Token(ChainId.ETHEREUM, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const XSUSHI_CALL = new Token(
  ChainId.ETHEREUM,
  '0xada279f9301C01A4eF914127a6C2a493Ad733924',
  18,
  'XSUc25-0531',
  'XSUSHI 25 Call [31 May 2021]'
)
export const WBTC = new Token(ChainId.ETHEREUM, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const XSUSHI = new Token(
  ChainId.ETHEREUM,
  '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
  18,
  'xSUSHI',
  'SushiBar'
)
export const CVXCRV = new Token(ChainId.ETHEREUM, '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7', 18, 'cvxCRV', 'cvxCRV')
export const CRV = new Token(ChainId.ETHEREUM, '0xD533a949740bb3306d119CC777fa900bA034cd52', 18, 'CRV', 'Curve')
export const YFI = new Token(ChainId.ETHEREUM, '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', 18, 'YFI', 'YFI')
export const MIM = new Token(
  ChainId.ETHEREUM,
  '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
  18,
  'MIM',
  'Magic Internet Money'
)
export const SPELL = new Token(
  ChainId.ETHEREUM,
  '0x090185f2135308BaD17527004364eBcC2D37e5F6',
  18,
  'SPELL',
  'Spell Token'
)
export const ICE = new Token(ChainId.ETHEREUM, '0xf16e81dce15B08F326220742020379B855B87DF9', 18, 'ICE', 'IceToken')
export const FTM = new Token(ChainId.ETHEREUM, '0x4E15361FD6b4BB609Fa63C81A2be19d873717870', 18, 'FTM', 'Fantom')
export const SOUL = new Token(ChainId.ETHEREUM, SOUL_ADDRESS[ChainId.ETHEREUM], 18, 'SOUL', 'SoulPower')
