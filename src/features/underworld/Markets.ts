import { tokens } from './Tokens'

export const UnderworldMarkets = [
  {
    // LENDING
    pid: 48,
    token1: 'FTM',
    token2: 'DAI',
    lpSymbol: 'DAI-FTM',
    lpAddresses: {
      4002: '',
      250: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.DAI,
  },
  {
    // LENDING
    pid: 49,
    token1: 'DAI',
    token2: 'FTM',
    lpSymbol: 'FTM-DAI',
    lpAddresses: {
      4002: '',
      250: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
    },
    token1Address: tokens.DAI,
    token2Address: tokens.FTM,
  },
  {
    // LENDING
    pid: 51,
    token1: 'WETH',
    token2: 'DAI',
    lpSymbol: 'DAI-ETH',
    lpAddresses: {
      4002: '',
      250: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
    },
    token1Address: tokens.WETH,
    token2Address: tokens.DAI,
  },
  {
    // LENDING
    pid: 53,
    token1: 'BNB',
    token2: 'DAI',
    lpSymbol: 'DAI-BNB',
    lpAddresses: {
      4002: '',
      250: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
    },
    token1Address: tokens.BNB,
    token2Address: tokens.DAI,
  },
  {
    // LENDING
    pid: 53,
    token1: 'WETH',
    token2: 'FTM',
    lpSymbol: 'WETH-FTM',
    lpAddresses: {
      4002: '',
      250: '0x4224b2870875df7f693dEB5Fc6560ee50C8B602d',
    },
    token1Address: tokens. WETH,
    token2Address: tokens.FTM,
  },
]

export const FarmMarkets = [
  {
    // FARM MARKETS
    pid: 48,
    token1: 'FTM',
    token2: 'DAI',
    lpSymbol: 'DAI-FTM',
    lpAddresses: {
      4002: '',
      250: '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd',
    },
    token1Address: tokens.FTM,
    token2Address: tokens.DAI,
  },
  {
    // FARM MARKETS
    pid: 49,
    token1: 'DAI',
    token2: 'FTM',
    lpSymbol: 'FTM-DAI',
    lpAddresses: {
      4002: '',
      250: '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61',
    },
    token1Address: tokens.DAI,
    token2Address: tokens.FTM,
  },
  {
    // FARM MARKETS
    pid: 51,
    token1: 'WETH',
    token2: 'DAI',
    lpSymbol: 'DAI-ETH',
    lpAddresses: {
      4002: '',
      250: '0x9fA5de19495331E13b443F787B90CdD22B32263d',
    },
    token1Address: tokens.WETH,
    token2Address: tokens.DAI,
  },
  {
    // FARM MARKETS
    pid: 53,
    token1: 'BNB',
    token2: 'DAI',
    lpSymbol: 'DAI-BNB',
    lpAddresses: {
      4002: '',
      250: '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6',
    },
    token1Address: tokens.BNB,
    token2Address: tokens.DAI,
  },
]