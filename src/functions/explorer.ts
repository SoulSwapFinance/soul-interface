import { ChainId } from '../sdk'

// Multichain Explorer
const builders = {
  etherscan: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://etherscan.io`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  fantom: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://ftmscan.com'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  
  blast: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://blastscan.io'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  teloscan: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://teloscan.io'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  fantomTestnet: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://testnet.ftmscan.com'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  bscscan: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://bscscan.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  // xdai: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = `https://blockscout.com/poa/xdai`
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     case 'token':
  //       return `${prefix}/tokens/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },

  matic: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    // const prefix = `https://explorer-${chainName}.maticvigil.com`
    const prefix = 'https://polygonscan.com'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  // token is not yet supported for arbitrum
  arbitrum: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://arbiscan.io`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  // // token is not yet supported for arbitrum
  // arbitrumTestnet: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = `https://explorer.offchainlabs.com/#`
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     case 'token':
  //       return prefix
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },

  moonriver: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://blockscout.moonriver.moonbeam.network'
    
   switch (type) {
     case 'transaction':
       return `${prefix}/tx/${data}`
        case 'address': 
          return `${prefix}/address/${data}`
       default:
        return `${prefix}/${type}/${data}`
   }
  },

  // moonbase: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = 'https://moonbeam-explorer.netlify.app'
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     case 'address':
  //       return `${prefix}/address/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },

  avalanche: (data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://snowtrace.io`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  // heco: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = `https://${chainName ? `${chainName}.` : ''}hecoinfo.com`
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },

  // harmony: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = 'https://beta.explorer.harmony.one/#'
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },

  // harmonyTestnet: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = 'https://explorer.pops.one/#'
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },
  // okex: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = 'https://www.oklink.com/okexchain'
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     case 'token':
  //       return `${prefix}/tokenAddr/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },
  // okexTestnet: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = 'https://www.oklink.com/okexchain-test'
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     case 'token':
  //       return `${prefix}/tokenAddr/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },

  // celo: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
  //   const prefix = 'https://explorer.celo.org'
  //   switch (type) {
  //     case 'transaction':
  //       return `${prefix}/tx/${data}`
  //     case 'token':
  //       return `${prefix}/tokens/${data}`
  //     default:
  //       return `${prefix}/${type}/${data}`
  //   }
  // },
}

interface ChainObject {
  [chainId: number]:
  {
    // chainName: string
    builder: (
      // chainName: string, 
      data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

const chains: ChainObject = {
  [ChainId.ETHEREUM]: {
    // chainName: '',
    builder: builders.etherscan,
  },
  [ChainId.TELOS]: {
    // chainName: 'testnet',
    builder: builders.teloscan,
  },
  [ChainId.BSC]: {
    // chainName: 'testnet',
    builder: builders.bscscan,
  },
  [ChainId.FANTOM]: {
    // chainName: '',
    builder: builders.fantom,
  },
  [ChainId.MOONRIVER]: {
    // chainName: '',
    builder: builders.moonriver,
  }, 
  [ChainId.AVALANCHE]: {
    // chainName: '',
    builder: builders.avalanche,
  },
  [ChainId.MATIC]: {
    // chainName: 'mainnet',
    builder: builders.matic,
  },
  [ChainId.ARBITRUM]: {
    // chainName: '',
    builder: builders.arbitrum,
  },
  [ChainId.BLAST]: {
    // chainName: '',
    builder: builders.blast,
  },
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const chain = chains[chainId ?? ChainId.FANTOM]
  return chain.builder
  (
    // chain.chainName, 
    data, type)
}
