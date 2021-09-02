
// import { ChainId, Ether, SOUL_ADDRESS, Token, WETH9, WNATIVE } from '@soulswap/sdk'

// import { SupportedChainId } from '../chains'

// export const CELO: { [key: string]: Token } = {
//   mCUSD: new Token(ChainId.CELO, '0x64dEFa3544c695db8c535D289d843a189aa26b98', 18, 'mCUSD', 'Moola cUSD'),
//   mCELO: new Token(ChainId.CELO, '0x7037F7296B2fc7908de7b57a89efaa8319f0C500', 18, 'mCELO', 'Moola CELO'),
//   mcEURO: new Token(ChainId.CELO, '0xa8d0E6799FF3Fd19c6459bf02689aE09c4d78Ba7', 18, 'mCEUR', 'Moola Celo Euro'),
//   cUSD: new Token(ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'cUSD', 'Celo Dollar'),
//   cEURO: new Token(ChainId.CELO, '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', 18, 'cEUR', 'Celo Euro'),
//   cBTC: new Token(ChainId.CELO, '0xD629eb00dEced2a080B7EC630eF6aC117e614f1b', 18, 'cBTC', 'Wrapped Bitcoin'),
// }

// export const BSC: { [key: string]: Token } = {
//   DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
//   USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
//   USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
//   USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
//   BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin'),
//   WETH: new Token(ChainId.BSC, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WETH', 'Wrapped Ether'),
// }

// export const FANTOM: { [key: string]: Token } = {
//   SOUL: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'SoulPower'), // 27 AUG
//   SEANCE: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SOUL', 'SoulPower'), // 27 AUG
//   USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
//   WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
//   DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
//   FUSD: new Token(ChainId.FANTOM, '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', 18, 'FUSD', 'Fantom USD'), // 27 AUG
//   WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether'),
// }

// export const FANTOM_TESTNET: { [key: string]: Token } = {
//   SOUL: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'SoulPower'), // 30 JUL
//   SEANCE: new Token(ChainId.FANTOM_TESTNET, '0xD858E1a257Cb595Ba395520daD4c9C9592307734', 18, 'SEANCE', 'SeanceCircle'), // 30 JUL
//   SPELL: new Token(ChainId.FANTOM_TESTNET, '0xdFDC55e7E7eBA3E7BF2a0E0743f4D3C858FaC37E', 18, 'SPELL', 'SpellBound'), // 30 JUL
//   FUSD: new Token(ChainId.FANTOM_TESTNET, '0x306557358e20AEa124b16a548597897858D13cb2', 18, 'FUSD', 'Fantom USD'), // 31 JUL
//   FETH: new Token(ChainId.FANTOM_TESTNET, '0x910a38cE2a26278c3493A95fe83e092aE821dF26', 18, 'fETH', 'Fantom Synthetic ETH'), // 31 JUL
//   WBTC: new Token(ChainId.FANTOM_TESTNET, '0x2Eb4Ee20d9816Bd6810F69166dD046F09C737201', 18, 'fBTC', 'Fantom Synthetic BTC'),
// }

// export const MATIC: { [key: string]: Token } = {
//   USDC: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
//   WBTC: new Token(ChainId.MATIC, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin'),
//   DAI: new Token(ChainId.MATIC, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
//   WETH: new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
//   USDT: new Token(ChainId.MATIC, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
//   TEL: new Token(ChainId.MATIC, '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32', 2, 'TEL', 'Telcoin'),
//   SUSHI: new Token(ChainId.MATIC, '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', 18, 'SUSHI', 'SushiToken'),
//   AAVE: new Token(ChainId.MATIC, '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', 18, 'AAVE', 'Aave'),
//   FRAX: new Token(ChainId.MATIC, '0x104592a158490a9228070E0A8e5343B499e125D0', 18, 'FRAX', 'Frax'),
//   FXS: new Token(ChainId.MATIC, '0x3e121107F6F22DA4911079845a470757aF4e1A1b', 18, 'FXS', 'Frax Share'),
//   DMAGIC: new Token(ChainId.MATIC, '0x61dAECaB65EE2A1D5b6032df030f3fAA3d116Aa7', 18, 'DMAGIC', 'Dark Magic'),
//   DRAX: new Token(ChainId.MATIC, '0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b', 18, 'DRAX', 'Drax'),
// }

// export const OKEX: { [key: string]: Token } = {
//   DAI: new Token(ChainId.OKEX, '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9', 18, 'DAI', 'Dai Stablecoin'),
//   USDC: new Token(ChainId.OKEX, '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85', 18, 'USDC', 'USD Coin'),
//   USDT: new Token(ChainId.OKEX, '0x382bB369d343125BfB2117af9c149795C6C65C50', 18, 'USDT', 'Tether USD'),
//   WBTC: new Token(ChainId.OKEX, '0x506f731F7656e2FB34b587B912808f2a7aB640BD', 18, 'WBTC', 'Wrapped Bitcoin'),
//   WETH: new Token(ChainId.OKEX, '0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C', 18, 'WETH', 'Wrapped Ether'),
// }

// export const HECO: { [key: string]: Token } = {
//   DAI: new Token(ChainId.HECO, '0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a', 18, 'DAI', 'Dai Stablecoin'),
//   USDC: new Token(ChainId.HECO, '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B', 18, 'USDC', 'USD Coin'),
//   USDT: new Token(ChainId.HECO, '0xa71EdC38d189767582C38A3145b5873052c3e47a', 18, 'USDT', 'Tether USD'),
//   WBTC: new Token(ChainId.HECO, '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa', 18, 'WBTC', 'Wrapped Bitcoin'),
//   WETH: new Token(ChainId.HECO, '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', 18, 'WETH', 'Wrapped Ether'),
// }

// export const HARMONY: { [key: string]: Token } = {
//   DAI: new Token(ChainId.HARMONY, '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339', 18, 'DAI', 'Dai Stablecoin'),
//   USDC: new Token(ChainId.HARMONY, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, 'USDC', 'USD Coin'),
//   USDT: new Token(ChainId.HARMONY, '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f', 6, 'USDT', 'Tether USD'),
//   WBTC: new Token(ChainId.HARMONY, '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9', 8, 'WBTC', 'Wrapped Bitcoin'),
//   WETH: new Token(ChainId.HARMONY, '0x6983D1E6DEf3690C4d616b13597A09e6193EA013', 18, 'WETH', 'Wrapped Ether'),
// }

// export const XDAI: { [key: string]: Token } = {
//   USDC: new Token(ChainId.XDAI, '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', 6, 'USDC', 'USD Coin'),
//   USDT: new Token(ChainId.XDAI, '0x4ECaBa5870353805a9F068101A40E0f32ed605C6', 6, 'USDT', 'Tether USD'),
//   WBTC: new Token(ChainId.XDAI, '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252', 8, 'WBTC', 'Wrapped Bitcoin'),
//   WETH: new Token(ChainId.XDAI, '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', 18, 'WETH', 'Wrapped Ether'),
// }

// export const AVALANCHE: { [key: string]: Token } = {
//   DAI: new Token(ChainId.AVALANCHE, '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', 18, 'DAI', 'Dai Stablecoin'),
//   USDT: new Token(ChainId.AVALANCHE, '0xde3A24028580884448a5397872046a019649b084', 6, 'USDT', 'Tether USD'),
//   WBTC: new Token(ChainId.AVALANCHE, '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB', 8, 'WBTC', 'Wrapped Bitcoin'),
//   WETH: new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'WETH', 'Wrapped Ether'),
// }

// // Default Ethereum chain tokens
// export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
// export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
// export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
// export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
// export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
// export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
// export const DOUGH = new Token(
//   ChainId.MAINNET,
//   '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
//   18,
//   'DOUGH',
//   'PieDAO Dough v2'
// )
// export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
// export const ETH2X_FLI = new Token(
//   ChainId.MAINNET,
//   '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
//   18,
//   'ETH2x-FLI',
//   'ETH 2x Flexible Leverage Index'
// )
// export const FEI = new Token(ChainId.MAINNET, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
// export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
// export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
// export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
// export const IBETH = new Token(
//   ChainId.MAINNET,
//   '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
//   8,
//   'ibETHv2',
//   'Interest Bearing Ether v2'
// )
// export const MEOW = new Token(ChainId.MAINNET, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi')
// export const MIR = new Token(ChainId.MAINNET, '0x09a3EcAFa817268f77BE1283176B946C4ff2E608', 18, 'MIR', 'Wrapped MIR')
// export const NFTX = new Token(ChainId.MAINNET, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
// export const PLAY = new Token(
//   ChainId.MAINNET,
//   '0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4',
//   18,
//   'PLAY',
//   'Metaverse NFT Index'
// )
// export const PONT = new Token(
//   ChainId.MAINNET,
//   '0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2',
//   9,
//   'pONT',
//   'Poly Ontology Token'
// )
// export const PWING = new Token(
//   ChainId.MAINNET,
//   '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a',
//   9,
//   'pWING',
//   'Poly Ontology Wing Token'
// )
// export const RENBTC = new Token(1, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
// export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
// export const STETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')
// export const TRIBE = new Token(ChainId.MAINNET, '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B', 18, 'TRIBE', 'Tribe')
// export const UMA = new Token(ChainId.MAINNET, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA')
// export const UMA_CALL = new Token(
//   ChainId.MAINNET,
//   '0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F',
//   18,
//   'UMA',
//   'UMA 35 Call [30 Apr 2021]'
// )
// export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
// export const USDP = new Token(
//   ChainId.MAINNET,
//   '0x1456688345527bE1f37E9e627DA0837D6f08C925',
//   18,
//   'USDP',
//   'USDP Stablecoin'
// )
// export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
// export const UST = new Token(ChainId.MAINNET, '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD', 18, 'UST', 'Wrapped UST')
// export const XSUSHI_CALL = new Token(
//   ChainId.MAINNET,
//   '0xada279f9301C01A4eF914127a6C2a493Ad733924',
//   18,
//   'XSUc25-0531',
//   'XSUSHI 25 Call [31 May 2021]'
// )
// export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

// export const LIFT = new Token(ChainId.MAINNET, '0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6', 18, 'LIFT', 'LiftKitchen')
// export const LFBTC = new Token(
//   ChainId.MAINNET,
//   '0xafcE9B78D409bF74980CACF610AFB851BF02F257',
//   18,
//   'LFBTC',
//   'LiftKitchen BTC'
// )
// export const CVXCRV = new Token(ChainId.MAINNET, '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7', 18, 'cvxCRV', 'cvxCRV')
// export const CRV = new Token(ChainId.MAINNET, '0xD533a949740bb3306d119CC777fa900bA034cd52', 18, 'CRV', 'Curve')

// type ChainTokenMap = {
//   readonly [chainId in ChainId]?: Token
// }

// // SOUL
// export const SOUL: ChainTokenMap = {
//   // [ChainId.MAINNET]: new Token(ChainId.MAINNET, SOUL_ADDRESS[ChainId.MAINNET], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, SOUL_ADDRESS[ChainId.ROPSTEN], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, SOUL_ADDRESS[ChainId.RINKEBY], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, SOUL_ADDRESS[ChainId.GÖRLI], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.KOVAN]: new Token(ChainId.KOVAN, SOUL_ADDRESS[ChainId.KOVAN], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.MATIC]: new Token(ChainId.MATIC, SOUL_ADDRESS[ChainId.MATIC], 18, 'SOUL', 'SoulPower'),
//   [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'SoulPower'), // 27 AUG
//   [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'SoulPower'), // 31 JUL
//   // [ChainId.XDAI]: new Token(ChainId.XDAI, SOUL_ADDRESS[ChainId.XDAI], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.BSC]: new Token(ChainId.BSC, SOUL_ADDRESS[ChainId.BSC], 18, 'SOUL', 'SoulPower'),
//   // // [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, SOUL_ADDRESS[ChainId.ARBITRUM], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.OKEX]: new Token(ChainId.OKEX, SOUL_ADDRESS[ChainId.OKEX], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.HARMONY]: new Token(ChainId.HARMONY, SOUL_ADDRESS[ChainId.HARMONY], 18, 'SOUL', 'SoulPower'),
//   // [ChainId.HECO]: new Token(ChainId.HECO, SOUL_ADDRESS[ChainId.HECO], 18, 'SOUL', 'SoulPower'),
// }

// // SEANCE TOKEN
// export const SEANCE: ChainTokenMap = {
//   // [ChainId.MAINNET]: new Token(
//   //   ChainId.MAINNET, SEANCE_ADDRESS[ChainId.MAINNET], 18, 'xSOUL', 'SushiBar'
//   // ),
//   [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
//   [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
// }

// export const SPELL: ChainTokenMap = {
//   // [ChainId.FANTOM]: new Token(ChainId.FANTOM, SPELL_ADDRESS[ChainId.FANTOM], 18, 'SPELL', 'SpellBound'), // TODO: update
//   [ChainId.FANTOM_TESTNET]: new Token(
//     ChainId.FANTOM_TESTNET,
//     '0xdFDC55e7E7eBA3E7BF2a0E0743f4D3C858FaC37E', // 30 JUL
//     18,
//     'SPELL',
//     'SpellBound'
//   ), // TODO: update
// }

// export const WETH9_EXTENDED: { [chainId: number]: Token } = {
//   ...WETH9,
//   [SupportedChainId.ARBITRUM_TESTNET]: new Token(
//     ChainId.ARBITRUM_TESTNET,
//     '0x4A5e4A42dC430f669086b417AADf2B128beFEfac',
//     18,
//     'WETH9',
//     'Wrapped Ether'
//   ),
//   [SupportedChainId.ARBITRUM]: new Token(
//     ChainId.ARBITRUM,
//     '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
//     18,
//     'WETH',
//     'Wrapped Ether'
//   ),

//   [SupportedChainId.FANTOM]: new Token(
//     ChainId.FANTOM,
//     '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
//     18,
//     'WFTM',
//     'Wrapped Fantom'
//   ),
// }

// export class ExtendedEther extends Ether {
//   public get wrapped(): Token {
//     // if (this.chainId in WNATIVE) return WNATIVE[this.chainId]
//     if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]

//     throw new Error('Unsupported chain ID')
//   }

//   public static onChain(chainId: number): ExtendedEther {
//     return new ExtendedEther(chainId)
//   }
// }

// // export class ExtendedCelo extends Celo {
// //   public get wrapped(): Token {
// //     if (this.chainId in WNATIVE) return WNATIVE[this.chainId];

// //     throw new Error("Unsupported chain ID");
// //   }

// //   public static onChain(chainId: number): ExtendedCelo {
// //     return new ExtendedCelo(chainId);
// //   }
// // }


import { ChainId, Token, WETH9, WNATIVE } from '@soulswap/sdk'

export const CELO: { [key: string]: Token } = {
  mCUSD: new Token(ChainId.CELO, '0x64dEFa3544c695db8c535D289d843a189aa26b98', 18, 'mCUSD', 'Moola cUSD'),
  mCELO: new Token(ChainId.CELO, '0x7037F7296B2fc7908de7b57a89efaa8319f0C500', 18, 'mCELO', 'Moola CELO'),
  mcEURO: new Token(ChainId.CELO, '0xa8d0E6799FF3Fd19c6459bf02689aE09c4d78Ba7', 18, 'mCEUR', 'Moola Celo Euro'),
  cUSD: new Token(ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'cUSD', 'Celo Dollar'),
  cEURO: new Token(ChainId.CELO, '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', 18, 'cEUR', 'Celo Euro'),
  cBTC: new Token(ChainId.CELO, '0xD629eb00dEced2a080B7EC630eF6aC117e614f1b', 18, 'cBTC', 'Wrapped Bitcoin'),
}

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin'),
  WETH: new Token(ChainId.BSC, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'WETH', 'Wrapped Ether'),
}

export const FANTOM: { [key: string]: Token } = {
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether'),
}

export const MATIC: { [key: string]: Token } = {
  USDC: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.MATIC, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.MATIC, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
  USDT: new Token(ChainId.MATIC, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
  TEL: new Token(ChainId.MATIC, '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32', 2, 'TEL', 'Telcoin'),
  SUSHI: new Token(ChainId.MATIC, '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', 18, 'SUSHI', 'SushiToken'),
  AAVE: new Token(ChainId.MATIC, '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', 18, 'AAVE', 'Aave'),
  FRAX: new Token(ChainId.MATIC, '0x104592a158490a9228070E0A8e5343B499e125D0', 18, 'FRAX', 'Frax'),
  FXS: new Token(ChainId.MATIC, '0x3e121107F6F22DA4911079845a470757aF4e1A1b', 18, 'FXS', 'Frax Share'),
  DMAGIC: new Token(ChainId.MATIC, '0x61dAECaB65EE2A1D5b6032df030f3fAA3d116Aa7', 18, 'DMAGIC', 'Dark Magic'),
  DRAX: new Token(ChainId.MATIC, '0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b', 18, 'DRAX', 'Drax'),
  AXMATIC: new Token(ChainId.MATIC, '0x1221591c1d77A9c334aBb0fe530ae6EE3aF51Af9', 18, 'AXMATIC', 'axMATIC'),
}

export const OKEX: { [key: string]: Token } = {
  DAI: new Token(ChainId.OKEX, '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.OKEX, '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.OKEX, '0x382bB369d343125BfB2117af9c149795C6C65C50', 18, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.OKEX, '0x506f731F7656e2FB34b587B912808f2a7aB640BD', 18, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.OKEX, '0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C', 18, 'WETH', 'Wrapped Ether'),
}

export const HECO: { [key: string]: Token } = {
  DAI: new Token(ChainId.HECO, '0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.HECO, '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.HECO, '0xa71EdC38d189767582C38A3145b5873052c3e47a', 18, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.HECO, '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa', 18, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.HECO, '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', 18, 'WETH', 'Wrapped Ether'),
}

export const HARMONY: { [key: string]: Token } = {
  DAI: new Token(ChainId.HARMONY, '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.HARMONY, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.HARMONY, '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.HARMONY, '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.HARMONY, '0x6983D1E6DEf3690C4d616b13597A09e6193EA013', 18, 'WETH', 'Wrapped Ether'),
}

export const XDAI: { [key: string]: Token } = {
  USDC: new Token(ChainId.XDAI, '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.XDAI, '0x4ECaBa5870353805a9F068101A40E0f32ed605C6', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.XDAI, '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.XDAI, '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', 18, 'WETH', 'Wrapped Ether'),
}

export const AVALANCHE: { [key: string]: Token } = {
  DAI: new Token(ChainId.AVALANCHE, '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', 18, 'DAI', 'Dai Stablecoin'),
  USDT: new Token(ChainId.AVALANCHE, '0xde3A24028580884448a5397872046a019649b084', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.AVALANCHE, '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'WETH', 'Wrapped Ether'),
}

// Default Ethereum chain tokens
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const DOUGH = new Token(
  ChainId.MAINNET,
  '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
  18,
  'DOUGH',
  'PieDAO Dough v2'
)
export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const ETH2X_FLI = new Token(
  ChainId.MAINNET,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
export const FEI = new Token(ChainId.MAINNET, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const IBETH = new Token(
  ChainId.MAINNET,
  '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
  8,
  'ibETHv2',
  'Interest Bearing Ether v2'
)
export const MEOW = new Token(ChainId.MAINNET, '0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', 18, 'MEOW', 'Meowshi')
export const MIR = new Token(ChainId.MAINNET, '0x09a3EcAFa817268f77BE1283176B946C4ff2E608', 18, 'MIR', 'Wrapped MIR')
export const NFTX = new Token(ChainId.MAINNET, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
export const PLAY = new Token(
  ChainId.MAINNET,
  '0x33e18a092a93ff21aD04746c7Da12e35D34DC7C4',
  18,
  'PLAY',
  'Metaverse NFT Index'
)
export const PONT = new Token(
  ChainId.MAINNET,
  '0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2',
  9,
  'pONT',
  'Poly Ontology Token'
)
export const PWING = new Token(
  ChainId.MAINNET,
  '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a',
  9,
  'pWING',
  'Poly Ontology Wing Token'
)
export const RENBTC = new Token(1, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const STETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')
export const TRIBE = new Token(ChainId.MAINNET, '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B', 18, 'TRIBE', 'Tribe')
export const UMA = new Token(ChainId.MAINNET, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA')
export const UMA_CALL = new Token(
  ChainId.MAINNET,
  '0x1062aD0E59fa67fa0b27369113098cC941Dd0D5F',
  18,
  'UMA',
  'UMA 35 Call [30 Apr 2021]'
)
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDP = new Token(
  ChainId.MAINNET,
  '0x1456688345527bE1f37E9e627DA0837D6f08C925',
  18,
  'USDP',
  'USDP Stablecoin'
)
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const UST = new Token(ChainId.MAINNET, '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD', 18, 'UST', 'Wrapped UST')
export const XSUSHI_CALL = new Token(
  ChainId.MAINNET,
  '0xada279f9301C01A4eF914127a6C2a493Ad733924',
  18,
  'XSUc25-0531',
  'XSUSHI 25 Call [31 May 2021]'
)
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')

export const XSUSHI = new Token(ChainId.MAINNET, '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272', 18, 'xSUSHI', 'SushiBar')

export const LIFT = new Token(ChainId.MAINNET, '0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6', 18, 'LIFT', 'LiftKitchen')
export const LFBTC = new Token(
  ChainId.MAINNET,
  '0xafcE9B78D409bF74980CACF610AFB851BF02F257',
  18,
  'LFBTC',
  'LiftKitchen BTC'
)
export const CVXCRV = new Token(ChainId.MAINNET, '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7', 18, 'cvxCRV', 'cvxCRV')
export const CRV = new Token(ChainId.MAINNET, '0xD533a949740bb3306d119CC777fa900bA034cd52', 18, 'CRV', 'Curve')

export const CRXSUSHI = new Token(
  ChainId.MAINNET,
  '0x228619CCa194Fbe3Ebeb2f835eC1eA5080DaFbb2',
  8,
  'crXSUSHI',
  'Cream SushiBar'
)
export const AXSUSHI = new Token(
  ChainId.MAINNET,
  '0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a',
  18,
  'aXSUSHI',
  'Aave interest bearing XSUSHI'
)

export const DPI = new Token(ChainId.MAINNET, '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b', 18, 'DefiPulse', 'DPI')

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

// SOUL
export const SOUL: ChainTokenMap = {
  // [ChainId.MAINNET]: new Token(ChainId.MAINNET, SOUL_ADDRESS[ChainId.MAINNET], 18, 'SOUL', 'SoulPower'),
  // [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, SOUL_ADDRESS[ChainId.ROPSTEN], 18, 'SOUL', 'SoulPower'),
  // [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, SOUL_ADDRESS[ChainId.RINKEBY], 18, 'SOUL', 'SoulPower'),
  // [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, SOUL_ADDRESS[ChainId.GÖRLI], 18, 'SOUL', 'SoulPower'),
  // [ChainId.KOVAN]: new Token(ChainId.KOVAN, SOUL_ADDRESS[ChainId.KOVAN], 18, 'SOUL', 'SoulPower'),
  // [ChainId.MATIC]: new Token(ChainId.MATIC, SOUL_ADDRESS[ChainId.MATIC], 18, 'SOUL', 'SoulPower'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', 18, 'SOUL', 'SoulPower'), // 27 AUG
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5', 18, 'SOUL', 'SoulPower'), // 31 JUL
  // [ChainId.XDAI]: new Token(ChainId.XDAI, SOUL_ADDRESS[ChainId.XDAI], 18, 'SOUL', 'SoulPower'),
  // [ChainId.BSC]: new Token(ChainId.BSC, SOUL_ADDRESS[ChainId.BSC], 18, 'SOUL', 'SoulPower'),
  // // [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, SOUL_ADDRESS[ChainId.ARBITRUM], 18, 'SOUL', 'SoulPower'),
  // [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'SoulPower'),
  // [ChainId.OKEX]: new Token(ChainId.OKEX, SOUL_ADDRESS[ChainId.OKEX], 18, 'SOUL', 'SoulPower'),
  // [ChainId.HARMONY]: new Token(ChainId.HARMONY, SOUL_ADDRESS[ChainId.HARMONY], 18, 'SOUL', 'SoulPower'),
  // [ChainId.HECO]: new Token(ChainId.HECO, SOUL_ADDRESS[ChainId.HECO], 18, 'SOUL', 'SoulPower'),
}

// SEANCE TOKEN
export const SEANCE: ChainTokenMap = {
  // [ChainId.MAINNET]: new Token(
  //   ChainId.MAINNET, SEANCE_ADDRESS[ChainId.MAINNET], 18, 'xSOUL', 'SushiBar'
  // ),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, '0xD54Cf31D5653F4a062f5DA4C83170A5867d04442', 18, 'SEANCE', 'SeanceCircle'),  // 31 JUL
}

export const SPELL: ChainTokenMap = {
  // [ChainId.FANTOM]: new Token(ChainId.FANTOM, SPELL_ADDRESS[ChainId.FANTOM], 18, 'SPELL', 'SpellBound'), // TODO: update
  [ChainId.FANTOM_TESTNET]: new Token(
    ChainId.FANTOM_TESTNET,
    '0xdFDC55e7E7eBA3E7BF2a0E0743f4D3C858FaC37E', // 30 JUL
    18,
    'SPELL',
    'SpellBound'
  ), // TODO: update
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  [ChainId.ARBITRUM_TESTNET]: new Token(
    ChainId.ARBITRUM_TESTNET,
    '0x4A5e4A42dC430f669086b417AADf2B128beFEfac',
    18,
    'WETH9',
    'Wrapped Ether'
  ),
  [ChainId.ARBITRUM]: new Token(
    ChainId.ARBITRUM,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),

  [ChainId.FANTOM]: new Token(
    ChainId.FANTOM,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    18,
    'WFTM',
    'Wrapped Fantom'
  ),

  // [SupportedChainId.CELO]: new Token(
  //   SupportedChainId.CELO,
  //   "0x471EcE3750Da237f93B8E339c536989b8978a438",
  //   18,
  //   "CELO",
  //   "Celo"
  // ),
}

// export class ExtendedCelo extends Celo {
//   public get wrapped(): Token {
//     if (this.chainId in WNATIVE) return WNATIVE[this.chainId];

//     throw new Error("Unsupported chain ID");
//   }

//   public static onChain(chainId: number): ExtendedCelo {
//     return new ExtendedCelo(chainId);
//   }
// }