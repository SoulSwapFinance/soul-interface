import { ChainId, SOUL } from 'sdk'

import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { GraphQLClient } from 'graphql-request'

// Includes chains on which swpr has its infrastructure
export type SWPRUnsupportedChains =
  | ChainId.MATIC
//   | ChainId.OPTIMISM_MAINNET
//   | ChainId.OPTIMISM_GOERLI
export type SWPRSupportedChains = Exclude<ChainId, SWPRUnsupportedChains>

export const chainSupportsSWPR = (chainId?: ChainId) => {
  if (!chainId) return false
  return !!SOUL[chainId]
}

export const subgraphClientsUris: { [chainId: number]: string } = {
    1: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 40: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 56: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 250: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 4002: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 43114: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 137: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 42161: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',
    // 1285: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-mainnet-v2',

//   [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-arbitrum-one-v3',
//   [ChainId.XDAI]: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-xdai-v2',
//   [ChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-rinkeby',
//   [ChainId.ARBITRUM_RINKEBY]: 'https://api.thegraph.com/subgraphs/name/dxgraphs/swapr-arbitrum-rinkeby-v2',
}

const setupApolloClient = (network: number) =>
  new ApolloClient({
    uri: subgraphClientsUris[network],
    cache: new InMemoryCache(),
  })

export const defaultSubgraphClient = setupApolloClient(ChainId.ETHEREUM)

export const subgraphClients: {
  [chainId: number]: ApolloClient<NormalizedCacheObject>
} = {
  [ChainId.ETHEREUM]: defaultSubgraphClient,
  // testnets
//   [ChainId.RINKEBY]: setupApolloClient(ChainId.RINKEBY),
//   [ChainId.ARBITRUM_RINKEBY]: setupApolloClient(ChainId.ARBITRUM_RINKEBY),
}

export const immediateSubgraphClients: { [chainId: number]: GraphQLClient } = {
  [ChainId.ETHEREUM]: new GraphQLClient(subgraphClientsUris[ChainId.ETHEREUM]),
//   [ChainId.RINKEBY]: new GraphQLClient(subgraphClientsUris[ChainId.RINKEBY]),
//   [ChainId.XDAI]: new GraphQLClient(subgraphClientsUris[ChainId.XDAI]),
//   [ChainId.ARBITRUM_ONE]: new GraphQLClient(subgraphClientsUris[ChainId.ARBITRUM_ONE]),
//   [ChainId.ARBITRUM_RINKEBY]: new GraphQLClient(subgraphClientsUris[ChainId.ARBITRUM_RINKEBY]),
//   [ChainId.ARBITRUM_GOERLI]: new GraphQLClient(subgraphClientsUris[ChainId.ARBITRUM_GOERLI]), // FIXME: fix this once the subgraph is deployed
}

export const subgraphBlocksClientsUris: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
//   [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/dodoex/arbitrum-one-blocks',
//   [ChainId.GNOSIS]: 'https://api.thegraph.com/subgraphs/name/1hive/xdai-blocks',
//   // testnests
//   [ChainId.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
//   [ChainId.ARBITRUM_RINKEBY]: 'https://api.thegraph.com/subgraphs/name/dodoex/arbitrum-one-blocks',
//   [ChainId.ARBITRUM_GOERLI]: '', // FIXME: fix this once the subgraph is deployed
}

const setupBlocksApolloClient = (network: SWPRSupportedChains) =>
  new ApolloClient({
    uri: subgraphBlocksClientsUris[network],
    cache: new InMemoryCache(),
  })

export const subgraphBlocksClients: {
  [chainId: number]: ApolloClient<NormalizedCacheObject>
} = {
  [ChainId.ETHEREUM]: setupBlocksApolloClient(
    ChainId.ETHEREUM),
//   [ChainId.XDAI]: setupBlocksApolloClient(ChainId.XDAI),
//   [ChainId.ARBITRUM_ONE]: setupBlocksApolloClient(ChainId.ARBITRUM_ONE),
//   // testnets
//   [ChainId.RINKEBY]: setupBlocksApolloClient(ChainId.RINKEBY),
//   [ChainId.ARBITRUM_RINKEBY]: setupBlocksApolloClient(ChainId.ARBITRUM_RINKEBY),
//   [ChainId.ARBITRUM_GOERLI]: setupBlocksApolloClient(ChainId.ARBITRUM_GOERLI), // FIXME: fix this once the subgraph is deployed
}