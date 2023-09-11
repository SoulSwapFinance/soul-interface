import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from 'sdk'

export type NetworkInfo = {
  readonly chainId: ChainId

  // route can be used to detect which chain is favored in query param, check out useActiveNetwork.ts
  readonly route: string
  readonly name: string
  readonly icon?: string
  readonly iconDark?: string
  readonly classicClient: ApolloClient<NormalizedCacheObject>
  readonly elasticClient: ApolloClient<NormalizedCacheObject>
  readonly blockClient: ApolloClient<NormalizedCacheObject>
  readonly etherscanUrl: string
  readonly etherscanName: string
  readonly tokenListUrl: string
  readonly bridgeURL: string
  readonly defaultBlockSubgraph: string
  readonly aggregatorRoute: string
  readonly nativeToken: {
    readonly symbol: string
    readonly name: string
    readonly address: string
    readonly logo: string
    readonly decimal: number
  }
  readonly rpcUrl: string
  readonly routerUri: string
  readonly classic: {
    readonly defaultSubgraph: string
    readonly static: {
      readonly zap: string
      readonly router: string
      readonly factory: string
    }
    readonly oldStatic: {
      readonly zap: string
      readonly router: string
      readonly factory: string
    } | null
    readonly dynamic: {
      readonly zap: string
      readonly router: string
      readonly factory: string
    } | null
    readonly claimReward: string
    readonly fairlaunch: string[]
    readonly fairlaunchV2: string[]
  }
  readonly elastic: {
    readonly coreFactory: string
    readonly nonfungiblePositionManager: string
    readonly tickReader: string
    readonly initCodeHash: string
    readonly quoter: string
    readonly routers: string
    readonly defaultSubgraph: string
  }
  // token: {
  //   DAI: Token
  //   USDC: Token
  //   USDT: Token
  // }
  readonly averageBlockTimeInSeconds: number
  readonly coingeckoNetworkId: string //https://api.coingecko.com/api/v3/asset_platforms
  readonly coingeckoNativeTokenId: string //https://api.coingecko.com/api/v3/coins/list
  readonly deBankSlug: string
}