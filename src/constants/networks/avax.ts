import { ChainId } from 'sdk'

// import AVAX from 'assets/networks/avax-network.png'
import { SS_SETTING_API } from 'constants/env'
import { createClient } from 'utils/client'

import { NetworkInfo } from '../type'

const NOT_SUPPORT = null

const avaxInfo: NetworkInfo = {
  chainId: ChainId.AVALANCHE,
  route: 'avalanche',
  name: 'Avalanche',
  icon: "https://raw.githubusercontent.com/soulswapfinance/assets/master/blockchains/avalanche/Avalanche.svg",
  classicClient: createClient('https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-exchange-avalanche'),
  elasticClient: createClient('https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-elastic-avalanche'),
  blockClient: createClient('https://api.thegraph.com/subgraphs/name/ducquangkstn/avalache-blocks'),
  etherscanUrl: 'https://snowtrace.io',
  etherscanName: 'Snowtrace',
  tokenListUrl: `${SS_SETTING_API}/v1/tokens?chainIds=${ChainId.AVALANCHE}&isWhitelisted=${true}`,
  bridgeURL: 'https://bridge.avax.network',
  nativeToken: {
    symbol: 'AVAX',
    name: 'AVAX (Wrapped)',
    address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    logo: "https://raw.githubusercontent.com/soulswapfinance/assets/master/blockchains/avalanche/Avalanche.svg",
    decimal: 18,
  },
  // rpcUrl: 'https://avalanche.kyberengineering.io',
  rpcUrl: 'https://rpc.ankr.com/avalanche',
  routerUri: `${process.env.REACT_APP_AGGREGATOR_API}/avalanche/route/encode`,
  classic: {
    static: {
      zap: '0x2abE8750e4a65584d7452316356128C936273e0D',
      router: '0x5649B4DD00780e99Bab7Abb4A3d581Ea1aEB23D0',
      factory: '0x1c758aF0688502e49140230F6b0EBd376d429be5',
    },
    oldStatic: NOT_SUPPORT,
    dynamic: {
      zap: '0x83D4908c1B4F9Ca423BEE264163BC1d50F251c31',
      router: '0x8Efa5A9AD6D594Cf76830267077B78cE0Bc5A5F8',
      factory: '0x10908C875D865C66f271F5d3949848971c9595C9',
    },
    claimReward: '0x610A05127d51dd42031A39c25aF951a8e77cDDf7',
    fairlaunch: [
      '0xD169410524Ab1c3C51F56a856a2157B88d4D4FF5',
      '0x3133C5C35947dBcA7A76Ee05f106a7c63BFD5C3F',
      '0x98910F7f13496fcDE2ade93648F05b4854Fc99D9',
      '0x854Cf246b09c7366AEe5abce92fA167bfE7f3E75',
    ],
    fairlaunchV2: [
      '0x8e9Bd30D15420bAe4B7EC0aC014B7ECeE864373C',
      '0x845d1d0d9b344fba8a205461b9e94aefe258b918',
      '0xa107e6466Be74361840059a11e390200371a7538',
      '0x89929Bc485cE72D2Af7b7283B40b921e9F4f80b3',
    ],
  },
  elastic: {
    coreFactory: '0x5F1dddbf348aC2fbe22a163e30F99F9ECE3DD50a',
    nonfungiblePositionManager: '0x2B1c7b41f6A8F2b2bc45C3233a5d5FB3cD6dC9A8',
    tickReader: '0x165c68077ac06c83800d19200e6E2B08D02dE75D',
    initCodeHash: '0xc597aba1bb02db42ba24a8878837965718c032f8b46be94a6e46452a9f89ca01',
    quoter: '0x0D125c15D54cA1F8a813C74A81aEe34ebB508C1f',
    routers: '0xC1e7dFE73E1598E3910EF4C7845B68A9Ab6F4c83',
  },
  averageBlockTimeInSeconds: 1.85,
  coingeckoNetworkId: 'avalanche',
  coingeckoNativeTokenId: 'avalanche-2',
  deBankSlug: 'avax',
}

export default avaxInfo