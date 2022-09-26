import { ChainId } from '../sdk'

export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  address: string
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
  type?: string
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: PairInfo
  }
}

export const POOLS: AddressMap = {
  [ChainId.FANTOM]: {
    '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07': {
      id: 0,
      address: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07',
      token0: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57': { // SOUL-FTM
      id: 1, // 1600
      address: '0xa2527af9dabf3e3b4979d7e0493b5e2c6e63dc57',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0x160653F02b6597E7Db00BA8cA826cf43D2f39556': { // FTM-USDC 
      id: 2,
      address: '0x160653f02b6597e7db00ba8ca826cf43d2f39556',
      token0: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    '0x9e7711eAeb652d0da577C1748844407f8Db44a10': { // SOUL-FUSD 
      id: 3,
      address: '0x9e7711eaeb652d0da577c1748844407f8db44a10',
      token0: {
        id: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
        name: 'Fantom USD',
        symbol: 'FUSD',
        decimals: 18,
      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb': { // FTM-ETH
      id: 4,
      address: '0xc615a5fd68265d9ec6ef60805998fa5bb71972cb', // FTM-ETH
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
    },
    '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b': { // SEANCE-SOUL
      id: 5, // 600
      address: '0x8f1e15cd3d5a0bb85b8189d5c6b61bb64398e19b',
      token0: {
        id: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,

      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xD5F5E2638d636A98eD4aAEBfd2045441316e0c08': {  // USDC-FUSD
      id: 6,
      address: '0xd5f5e2638d636a98ed4aaebfd2045441316e0c08',
      token0: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
        name: 'Fantom USD',
        symbol: 'FUSD',
        decimals: 18,
      },
    },
    '0x98C678d3C7ebeD4a36B84666700d8b5b5Ddc1f79': {  // SEANCE-USDC
      id: 7, // 400
      address: '0x98c678d3c7ebed4a36b84666700d8b5b5ddc1f79',
      token0: { // USDC
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: { // SEANCE
        id: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
    },
    '0x1FC954d3484bC21E0Ce53A6648a35BBfc03DC9D0': {  // BTC-ETH
      id: 8,
      address: '0x1fc954d3484bc21e0ce53a6648a35bbfc03dc9d0',
      token0: { // WBTC
        id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
      token1: { // WETH
        id: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
        name: 'Wrapped Ethereum',
        symbol: 'WETH',
        decimals: 18,
      },
    },
    '0x298c12D6d9D6746Dd0ef0A89421288F52D5566eF': {  // USDC-USDT
      id: 9,
      address: '0x298c12d6d9d6746dd0ef0a89421288f52d5566ef',
      token0: { // USDC
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x049d68029688eAbF473097a2fC38ef61633A3C7A', // USDT
        name: 'Frapped USDT',
        symbol: 'USDT',
        decimals: 6,
      },
    },
    '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB': {  // SEANCE-FTM
      id: 10, // 1200
      address: '0x8542beac34282afe5bb6951eb6dce0b3783b7fab',
      token0: {
        id: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    '0x124D8CA33E29D1090a844e4C896DD16A360B1c96': {  // GRIM-FTM
      id: 11,
      address: '0x124d8ca33e29d1090a844e4c896dd16a360b1c96',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x7eC94C4327dC757601B4273cD67014d7760Be97E', // GRIM
        name: 'GrimToken',
        symbol: 'GRIM',
        decimals: 18,
      },
    },
    '0x7D776489372c8AFC0A1941a1335C9e9f90e0116a': {  // REAPER-FTM
      id: 12,
      address: '0x7d776489372c8afc0a1941a1335c9e9f90e0116a',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x117dB78176C8eDe4F12fCd29d85Cd96b91A4cbBb', // REAPER
        name: 'ReaperToken',
        symbol: 'REAPER',
        decimals: 18,
      },
    },
    '0xecB41D6B5885E75a149EDA173e92267aa271D895': {  // FTM-BTC
      id: 13,
      address: '0xecb41d6b5885e75a149eda173e92267aa271d895',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
    },
    '0xdC24814AD654986928F8E4aec48D37fa30bBC5BB': {  // FTM-USDT
      id: 14,
      address: '0xdc24814ad654986928f8e4aec48d37fa30bbc5bb',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x049d68029688eAbF473097a2fC38ef61633A3C7A', // USDT
        name: 'Frapped USDT',
        symbol: 'USDT',
        decimals: 6,
      },
    },
    '0x5b181BBc3Cc18C66B6f36f584866a1ff09865630': {  // ETH-USDC
      id: 15, // 600
      address: '0x5b181bbc3cc18c66b6f36f584866a1ff09865630',
      token0: {
        id: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
        name: 'Wrapped Ethereum',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
    '0xe637D90A993EDBD75AC09E9fcB16313D193B9451': {  // DAI-gfUSDT
      id: 16, // 0
      address: '0xe637d90a993edbd75ac09e9fcb16313d193b9451',
      token0: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5', // gfUSDT
        name: 'Geist fUSDT',
        symbol: 'gFUSDT',
        decimals: 6,
      },
    },
    '0xC1EdFbA9811B696bDFd07d31eD5FF702e031364E': {  // BNB-DAI
      id: 17, // 400
      address: '0xc1edfba9811b696bdfd07d31ed5ff702e031364e',
      token0: {
        id: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
        name: 'Binance',
        symbol: 'BNB',
        decimals: 18,
      },
      token1: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },
    '0x52966a12e3211c92909C28603ca3df8465c06c82': {  // BNB-FTM
      id: 18, // 600
      address: '0x52966a12e3211c92909c28603ca3df8465c06c82',
      token0: {
        id: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
        name: 'Binance',
        symbol: 'BNB',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    '0x34990FC1e6e3169DCf23624049be29782AFc81bd': {  // MIM-FTM
      id: 19, // 600
      address: '0x34990fc1e6e3169dcf23624049be29782afc81bd',
      token0: {
        id: '0x82f0B8B456c1A451378467398982d4834b6829c1', // MIM
        name: 'Magic Internet Money',
        symbol: 'MIM',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    '0xE2d39F7f0c8517Ca2058Fa97eB3D8d4928F7C6D6': {  // BTC-USDC
      id: 20, // 400
      address: '0xe2d39f7f0c8517ca2058fa97eb3d8d4928f7c6d6',
      token0: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
    },
    '0x406dE3A93f6B4179E3B21a3d81226B43e1918fd9': {  // DAI-USDC
      id: 21, // 200
      address: '0x406de3a93f6b4179e3b21a3d81226b43e1918fd9',
      token0: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
    '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef': {  // SOUL-USDC
      id: 22, // 600
      address: '0xc0a301f1e5e0fe37a31657e8f60a41b14d01b0ef',
      token0: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
      token1: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
    },
    '0xF3d6E8Ecece8647B456d57375Ce0B51B8F0cD40b': {  // FTM-DAI
      id: 23, // 600
      address: '0xf3d6e8ecece8647b456d57375ce0b51b8f0cd40b',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },
    '0xb4d6Ff768F409e4D102BAD80f9A8ac105453ccdD': {  // ENCHANT-FTM
      id: 24, // 1200
      address: '0xb4d6ff768f409e4d102bad80f9a8ac105453ccdd',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', // ENCHANT
        name: 'Enchantment',
        symbol: 'ENCHANT',
        decimals: 18,
      },
    },
    '0x9acc8F23680B6d7e295166277e2fb9c88A26cce6': {  // ENCHANT-SOUL
      id: 25, // 600
      address: '0x9acc8f23680b6d7e295166277e2fb9c88a26cce6',
      token0: {
        id: '0x6a1a8368d607c7a808f7bba4f7aed1d9ebde147a', // ENCHANT
        name: 'Enchantment',
        symbol: 'ENCHANT',
        decimals: 18,
      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0x5695176D085F8f7320507495066FFeC940da244C': {  // SEANCE-ENCHANT
      id: 26, // 600
      address: '0x5695176d085f8f7320507495066ffec940da244c',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x6a1a8368d607c7a808f7bba4f7aed1d9ebde147a', // ENCHANT
        name: 'Enchantment',
        symbol: 'ENCHANT',
        decimals: 18,
      },
    },
    '0x578c7B9A45D9e55246d3036D48db262b9B3CA48e': {  // SEANCE-UNIDEX
      id: 27, // 400
      address: '0x578c7b9a45d9e55246d3036d48db262b9b3ca48e',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0', // UNIDX
        name: 'UniDex',
        symbol: 'UNIDX',
        decimals: 18,
      },
    },
    '0xE27Cc06a7F34892BC17a5474303b91b2C9F3F21A': {  // SOUL-FUSDT
      id: 28, // 600
      address: '0xe27cc06a7f34892bc17a5474303b91b2c9f3f21a',
      token0: {
        id: '0x049d68029688eAbF473097a2fC38ef61633A3C7A', // FUSDT
        name: 'Frapped USDT',
        symbol: 'USDT',
        decimals: 6,
      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0x6c6f32008262666CA4acEd0a824c4945AB96e5F3': {  // ENCHANT-USDC
      id: 29, // 400
      address: '0x6c6f32008262666ca4aced0a824c4945ab96e5f3',
      token0: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x6a1a8368d607c7a808f7bba4f7aed1d9ebde147a', // ENCHANT
        name: 'Enchantment',
        symbol: 'ENCHANT',
        decimals: 18,
      },
    },
    '0xE3c700551c0D96202934969Ad219B8693a723d59': {  // SEANCE-SPIRIT
      id: 30, // 200
      address: '0xe3c700551c0d96202934969ad219b8693a723d59',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B', // SPIRIT
        name: 'SpiritSwap Token',
        symbol: 'SPIRIT',
        decimals: 18,
      },
    },
    '0x26a30b02A8DFb3f573E3F881D04258461Cae47Db': {  // SEANCE-BOO
      id: 31, // 200
      address: '0x26a30b02a8dfb3f573e3f881d04258461cae47db',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe', // BOO
        name: 'SpookyToken',
        symbol: 'BOO',
        decimals: 18,
      },
    },
    '0xa2cFc18F3A41E158DA173be0e4785F017Ff92a6e': {  // SEANCE-ZOO
      id: 32, // 200
      address: '0xa2cfc18f3a41e158da173be0e4785f017ff92a6e',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x09e145A1D53c0045F41aEEf25D8ff982ae74dD56', // ZOO
        name: 'Zoo Coin',
        symbol: 'ZOO',
        decimals: 0,
      },
    },
    '0x75aE2E7B4f3a4b5F9048AD6966f6e975e510aD03': {  // SEANCE-TOMB
      id: 33, // 200
      address: '0x75ae2e7b4f3a4b5f9048ad6966f6e975e510ad03',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7', // TOMB
        name: 'Tomb Token',
        symbol: 'TOMB',
        decimals: 18,
      },
    },
    '0xc0fEd4A6EDef23da7fF766D24F17Ecf454C16D25': {  // SEANCE-ICE
      id: 34, // 200
      address: '0xc0fed4a6edef23da7ff766d24f17ecf454c16d25',
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0xf16e81dce15B08F326220742020379B855B87DF9', // ICE
        name: 'IceToken',
        symbol: 'ICE',
        decimals: 18,
      },
    },
    '0x63A1b4E3f210db7f1d4Ae7d29Bc0BC7F611e713a': {  // SEANCE-SPELL
      id: 35, // 200
      address: '0x63a1b4e3f210db7f1d4ae7d29bc0bc7f611e713a', // 200
      token0: {
        id: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
        name: 'Seance Circle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x468003B688943977e6130F4F68F23aad939a1040', // SPELL
        name: 'Spell Token',
        symbol: 'SPELL',
        decimals: 18,
      },
    },
    '0x778F0d5515A3E78D1DD191f30835420c0275bde1': {  // SOUL-WETH
      id: 36, // 1200
      address: '0x778f0d5515a3e78d1dd191f30835420c0275bde1',
      token0: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
      token1: {
        id: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
    },
    '0xDA9D9CB5482EFD10839A676Fe99f05E41F57D885': {  // SOUL-WBTC
      id: 37, // 1200
      address: '0xda9d9cb5482efd10839a676fe99f05e41f57d885',
      token0: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
      token1: {
        id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      },
    },
    '0x1AE16105a7d4bE7DFD9737FD13D9A50AEFed1437': {  // FTM-FUSD
      id: 38, // 300
      address: '0x1ae16105a7d4be7dfd9737fd13d9a50aefed1437',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
        name: 'Fantom USD',
        symbol: 'FUSD',
        decimals: 18,
      },
    },
    '0x944Aa704eDaF75dAD30832C6d0f111506a48b1c8': {  // FTM-ICE
      id: 39, // 300
      address: '0x944aa704edaf75dad30832c6d0f111506a48b1c8',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0xf16e81dce15B08F326220742020379B855B87DF9', // ICE
        name: 'IceToken',
        symbol: 'ICE',
        decimals: 18,
      },
    },
    '0xf4199594986E35c49f20beaaCD0f3529D18BF08E': {  // FTM-ANY
      id: 40, // 300
      address: '0xf4199594986e35c49f20beaacd0f3529d18bf08e',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0xdDcb3fFD12750B45d32E084887fdf1aABAb34239', // ANY
        name: 'Anyswap',
        symbol: 'ANY',
        decimals: 18,
      },
    },
    '0x1C9A342A615E8CAB4d21A2ACA7E40a48b2F8747F': {  // FTM-CRV
      id: 41, // 300
      address: '0x1c9a342a615e8cab4d21a2aca7e40a48b2f8747f',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x1E4F97b9f9F913c46F1632781732927B9019C68b', // CRV
        name: 'Curve DAO',
        symbol: 'CRV',
        decimals: 18,
      },
    },
    '0x3d24C65201566f17d3Ac48C746919788d27Ee743': {  // FTM-SPELL
      id: 42, // 300
      address: '0x3d24c65201566f17d3ac48c746919788d27ee743',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x468003B688943977e6130F4F68F23aad939a1040', // SPELL
        name: 'Spell Token',
        symbol: 'SPELL',
        decimals: 18,
      },
    },
    '0xB38508Ed92C4878daE7652d8d46cAE46eEa8aA9A': {  // USDT-DAI
      id: 43, // 200
      address: '0xb38508ed92c4878dae7652d8d46cae46eea8aa9a',
      token0: {
        id: '0x049d68029688eAbF473097a2fC38ef61633A3C7A', // USDT
        name: 'Frapped USDT',
        symbol: 'USDT',
        decimals: 6,
      },
      token1: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },
    '0x951BBB838e49F7081072895947735b0892cCcbCD': {  // LUX-FTM
      id: 44, // 0
      address: '0x951bbb838e49f7081072895947735b0892cccbcd',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', // LUX
        name: 'Luxor Money',
        symbol: 'LUX',
        decimals: 9,
      },
    },
    '0x46729c2AeeabE7774a0E710867df80a6E19Ef851': {  // LUX-DAI
      id: 45, // 0
      address: '0x46729c2aeeabe7774a0e710867df80a6e19ef851',
      token0: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', // LUX
        name: 'Luxor Money',
        symbol: 'LUX',
        decimals: 9,
      },
    },
    '0x475a63154C3e85ac0F2CB453f0b5c63e4370333c': {  // LUX-SOUL
      id: 46, // 0
      address: '0x475a63154c3e85ac0f2cb453f0b5c63e4370333c',
      token0: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'Soul Power',
        symbol: 'SOUL',
        decimals: 18,
      },
      token1: {
        id: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', // LUX
        name: 'Luxor Money',
        symbol: 'LUX',
        decimals: 9,
      },
    },
    '0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99': {  // FTM-WLUM
      id: 47, // 1000
      address: '0xa670c1e02c7ae8b3d575293bfa1f7eba90f81c99',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', // WLUM
        name: 'Wrapped Lumens',
        symbol: 'wLUM',
        decimals: 9,
      },
    },
    '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd': {  // DAI-FTM [LEND]
      id: 48, // 420
      address: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
      type: 'underworld',
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },
    '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61': {  // FTM-DAI [LEND]
      id: 49, // 420
      address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // 420
      type: 'underworld',
      token0: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    '0x857107e8F42023F7623C7ca413811DB1853F7f4b': {  // GRIM EVO-FTM
      id: 50, // 1000
      address: '0x857107e8f42023f7623c7ca413811db1853f7f4b', // 1000
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      token1: {
        id: '0x0a77866C01429941BFC7854c0c0675dB1015218b', // GRIM EVO
        name: 'Grim EVO',
        symbol: 'EVO',
        decimals: 18,
      },
    },
    '0x9fA5de19495331E13b443F787B90CdD22B32263d': {  // DAI/WETH
      id: 51, // 0
      address: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
      type: 'underworld',
      token0: {
        id: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', // DAI
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
    },
    '0x4224b2870875df7f693dEB5Fc6560ee50C8B602d': {  // FTM/WETH
      id: 52, // 420
      address: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
      type: 'underworld',
      token0: {
        id: '0x74b23882a30290451A17c44f4F05243b6b58C76d', // WETH
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
    '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6': {  // BNB/FTM
      id: 53, // 420
      address: '0xd67de0e0a0fd7b15dc8348bb9be742f3c5850454',
      type: 'underworld',
      token0: {
        id: '0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454', // BNB
        name: 'Binance',
        symbol: 'BNB',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
    },
  }
}