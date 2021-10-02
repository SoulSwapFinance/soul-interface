import { ChainId } from '../sdk'

export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
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
      token0: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
      name: 'SoulPower',
      symbol: 'SOUL',
      decimals: 18,
      },
    }, 
    '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57': { // SOUL-FTM
    id: 1,
    token0: {
      id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
      name: 'Wrapped Fantom',
      symbol: 'WFTM',
      decimals: 18,
    },
    token1: {
      id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
      name: 'SoulPower',
      symbol: 'SOUL',
      decimals: 18,
    },
  },
    '0x160653F02b6597E7Db00BA8cA826cf43D2f39556': { // FTM-USDC 
      id: 2,
      token0: {
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    },
    '0x9e7711eAeb652d0da577C1748844407f8Db44a10': { // SOUL-FUSD 
      id: 3,
      token0: {
        id: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f', // FUSD
        name: 'Fantom USD',
        symbol: 'FUSD',
        decimals: 18,
      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'SoulPower',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xC615a5fd68265D9Ec6eF60805998fa5Bb71972Cb': { // FTM-ETH
      id: 4,
      token0: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
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
      id: 5,
      token0: {
        id: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
        name: 'SeanceCircle',
        symbol: 'SEANCE',
        decimals: 18,

      },
      token1: {
        id: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
        name: 'SoulPower',
        symbol: 'SOUL',
        decimals: 18,
      },
    },
    '0xD5F5E2638d636A98eD4aAEBfd2045441316e0c08': {  // USDC-FUSD
      id: 6,
      token0: {
        id: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
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
      id: 7,
      token0: { // USDC
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: { // SEANCE
        id: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
        name: 'SeaceCircle',
        symbol: 'SEANCE',
        decimals: 18,
    },
  },
    '0x1FC954d3484bC21E0Ce53A6648a35BBfc03DC9D0': {  // BTC-ETH
      id: 8,
      token0: { // BTC
        id: '0x321162Cd933E2Be498Cd2267a90534A804051b11', // WBTC
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 18,
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
      token0: { // USDC
        id: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
        name: 'USDC Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x049d68029688eAbF473097a2fC38ef61633A3C7A', // fUSDT
        name: 'Frapped USDT',
        symbol: 'fUSDT',
        decimals: 18,
    },
  },
    '0x8542bEAC34282aFe5Bb6951Eb6DCE0B3783b7faB': {  // SEANCE-FTM
      id: 10,
      token0: {
        id: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
        name: 'SeaceCircle',
        symbol: 'SEANCE',
        decimals: 18,
      },
      token1: {
        id: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
        name: 'Wrapped Fantom',
        symbol: 'WFTM',
        decimals: 18,
      },
    }
  }
}