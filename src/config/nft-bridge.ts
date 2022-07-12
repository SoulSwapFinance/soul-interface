import { bridgeApi, controlConfig, env, ENV_NODE_CONFIG, INIT_NODE, version } from 'constants/bridges'
import { chainInfo } from './chainConfig'
import { ChainId } from './chainId' 
import { getInitBridgeChain, getNetwork } from './tools/getUrlParams'

// methods //

export function formatSwapTokenList (name, tokenlist) {
    const arr = []
    for (const obj of tokenlist) {
      arr.push({
        ...obj,
        address: obj.address.toLowerCase()
      })
    }
    return {
      "keywords": ["roll", "default", "social money", "personal tokens"],
      "logoURI": "",
      "name": name,
      "timestamp": "",
      "tokens": arr,
      "version": {"major": 0, "minor": 0, "patch": 1}
    }
  }
  
  const LOCAL_RPC = 'LOCAL_RPC'
  export function getLocalRPC (chainId, initRpc) {
    const lStr = localStorage.getItem(USE_VERSION + '_' + LOCAL_RPC)
    if (lStr) {
      const lObj = JSON.parse(lStr)
      if (lObj[chainId]) {
        return lObj[chainId]
      } else {
        return initRpc
      }
    } else {
      return initRpc
    }
  }
  
  export function setLocalRPC (chainId, initRpc) {
    const lStr = localStorage.getItem(USE_VERSION + '_' + LOCAL_RPC)
    let lObj ={}
    if (lStr) {
      lObj = JSON.parse(lStr)
      lObj[chainId] = initRpc
    } else {
      lObj[chainId] = initRpc
    }
    localStorage.setItem(USE_VERSION + '_' + LOCAL_RPC, JSON.stringify(lObj))
  }

// constants //
export enum VERSION {
    V1 = 'UNDERLYING',
    V1_1 = 'UNDERLYINGV2',
    V2 = 'STABLE',
    V2_1 = 'STABLEV2',
    V2_2 = 'STABLEV3',
    V2_T1 = 'STABLE_TEST',
    V2_T2 = 'TEST',
    V2_T3 = 'TESTV2',
    V3 = 'ARB_DEV',
    V3_1 = 'ARB',
    V4 = 'BRIDGE',
    V4_OKT = 'BRIDGE_OKT',
    V4_MOVR = 'BRIDGE_MOVR',
    V5 = 'ALL',
    V6 = 'NFT_TEST',
    V6_1 = 'NFT',
    V7 = 'SOURCE_CHAIN',
    V7_TEST = 'SOURCE_CHAIN_TEST',
    V7_BAS_TEST = 'SOURCE_CHAIN_BAS_TEST',
  }
export const BASECURRENCY = 'BASECURRENCY'
export const tokenListUrl = 'https://list.htswap.io/tokenList/'
// export const INIT_VERSION = VERSION.V6_1
export const INIT_VERSION = VERSION.V7
// export const INIT_VERSION = VERSION.V7_TEST
// export const INIT_VERSION = VERSION.V7_BAS_TEST
 
// functions //
export function getUrlVersion (init:any) {
  const url = window.location.href
  let version:any
  if (url.indexOf('https://stable.anyswap.exchange') === 0) {
    version = VERSION.V2_2
  } else if (url.indexOf('https://router.anyswap.exchange') === 0) {
    version = VERSION.V1_1
  } else if (url.indexOf('https://oec.anyswap.exchange') === 0) {
    version = VERSION.V4_OKT
  } else if (url.indexOf('https://movr.anyswap.exchange') === 0) {
    version = VERSION.V4_MOVR
  } else if (
    url.indexOf('https://app.anyswap.exchange') === 0
    || url.indexOf('https://anyswap.exchange') === 0
  ) {
    version = VERSION.V5
  } else if (url.indexOf('https://arb.anyswap.exchange') === 0) {
    version = VERSION.V3_1
  } else if (url.indexOf('https://nft.anyswap.exchange') === 0) {
    version = VERSION.V6_1
  } else if (url.indexOf('https://nfttest.anyswap.exchange') === 0) {
    version = VERSION.V6
  } else if (
    url.indexOf('https://app.multichain.org') === 0
    || url.indexOf('https://app.multichain.tools') === 0
  ) {
    version = VERSION.V7
  } else if (url.indexOf('https://test.multichain.org') === 0) {
    version = VERSION.V7_TEST
  } else if (url.indexOf('https://bas.multichain.org') === 0) {
    version = VERSION.V7_BAS_TEST
  } else {
    version = init
  }
  return version
}
export const USE_VERSION:any = getUrlVersion(INIT_VERSION)


export const FTM_MAIN_CHAINID = ChainId.FTM
// const useNode = 'https://rpc.fantom.network'
// const useNode = 'https://rpc2.fantom.network'
// const useNode = 'https://rpc3.fantom.network'
// const useNode = 'https://rpcapi.fantom.network'
const useNode = 'https://rpc.ftm.tools/'
export const FTM_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(FTM_MAIN_CHAINID, useNode) : getLocalRPC(FTM_MAIN_CHAINID, 'https://rpc.ftm.tools/')
export const FTM_MAIN_EXPLORER = 'https://ftmscan.com'

export const FTM_TEST_CHAINID = ChainId.FTM_TEST
export const FTM_TESTNET = getLocalRPC(FTM_TEST_CHAINID, 'https://rpc.testnet.fantom.network')
export const FTM_TEST_EXPLORER = 'https://testnet.ftmscan.com/'

export const tokenList = [
  {
    "address": "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    "chainId": FTM_MAIN_CHAINID,
    "decimals": 18,
    "name": "Fantom",
    "symbol": BASECURRENCY
  },
  {
    "address": "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    "chainId": FTM_MAIN_CHAINID,
    "decimals": 18,
    "name": "Dai",
    "symbol": "DAI"
  },
]

const symbol = 'FTM'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeInitChain: '137',
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeInitChain: '137',
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
    nativeToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    crossBridgeInitToken: 'FTM'
  },
  [VERSION.V6_1]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
    nftInitToken: '0xa0b20decbc557e3f68e140ed5a0c69bc865f865a',
    crossBridgeInitToken: 'FTM'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
    nativeToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    crossBridgeInitToken: 'FTM'
  },
  [VERSION.V7_TEST]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

// import {getNetwork, getInitBridgeChain} from './tools/getUrlParams'
 
export interface ConFig {
  [key: string]: any
}

const ENV = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
const netConfig:ConFig = chainInfo[ENV] ? chainInfo[ENV] : chainInfo[INIT_NODE]
// console.log(ENV)
const INITBRIDGE = getInitBridgeChain(netConfig.bridgeInitChain, netConfig.bridgeInitToken)

const config: ConFig = {
  ...netConfig,
  ...INITBRIDGE,
  env,
  version,
  ENV_NODE_CONFIG,
  chainInfo,
  bridgeApi,
//   explorer,
  oldAppName: 'Anyswap V1',
  appName: 'HTswap LP',
  baseCurrency: 'ANY',
  localDataDeadline: 1624700942896,
  farmUrl: '#/',
  explorerUrl: 'https://anyswap.net/explorer',
  isStopSystem: 0,
  getBaseCoin (value:any, chainId:any, type?: number, name?: string) {
    // console.log(value)
    // console.log(chainId)
    if (
      value
      && (
        value === 'BASECURRENCY'
        || (value === 'W' + this.getCurChainInfo(chainId).symbol && this.getCurChainInfo(chainId).nativeToken)
      )
    ) {
      if (type) {
        return (this.getCurChainInfo(chainId).symbolName ?? this.getCurChainInfo(chainId).name) + '(Router)'
      } else {
        return this.getCurChainInfo(chainId).symbol
      }
    } 
    // else if (value && value === 'WETH') {
    //   return 'W' + this.getCurChainInfo(chainId).symbol
    // } 
    else {
      if (type) {
        if (value === this.getCurChainInfo(chainId).symbol) {
          return name + '(Bridge)'
        } else {
          return name
        }
      } else {
        return value
      }
    }
  },
  getCurConfigInfo (version?:any) {
    version = version ? version : USE_VERSION
    return controlConfig[version]
  },
  getCurChainInfo (chainID:any) {
    if (chainID && chainInfo[chainID]) {
      return chainInfo[chainID]
    } else {
      return netConfig
    }
  }
}


export default {
  [FTM_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + FTM_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    swapInitToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    // multicalToken: '0x63B8310c5093ac917552931D8b15d5AB6945c0a6',
    multicalToken: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
    nodeRpc: FTM_MAINNET,
    nodeRpcList: [
      FTM_MAINNET,
      'https://rpc.fantom.network',
      'https://rpc2.fantom.network',
      'https://rpc3.fantom.network',
      'https://rpcapi.fantom.network'
    ],
    chainID: FTM_MAIN_CHAINID,
    lookHash: FTM_MAIN_EXPLORER + '/tx/',
    lookAddr: FTM_MAIN_EXPLORER + '/address/',
    lookBlock: FTM_MAIN_EXPLORER + '/block/',
    explorer: FTM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Fantom',
    networkName: 'Fantom mainnet',
    type: 'main',
    label: FTM_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'FRC20',
    anyToken: '0xddcb3ffd12750b45d32e084887fdf1aabab34239'
  },
  [FTM_TEST_CHAINID]: {
    tokenListUrl: tokenListUrl + FTM_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x5aF9b9de61F645C08eA4540C177737C6c6622060',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: FTM_TESTNET,
    nodeRpcList: [
      FTM_TESTNET,
    ],
    chainID: FTM_TEST_CHAINID,
    lookHash: FTM_TEST_CHAINID + '/tx/',
    lookAddr: FTM_TEST_CHAINID + '/address/',
    lookBlock: FTM_TEST_CHAINID + '/block/',
    explorer: FTM_TEST_CHAINID,
    symbol: symbol,
    name: 'Fantom',
    networkName: 'Fantom testnet',
    type: 'test',
    label: FTM_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'FRC20',
    anyToken: ''
  },
}