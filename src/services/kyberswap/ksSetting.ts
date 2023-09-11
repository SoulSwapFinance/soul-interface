import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from 'sdk'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Connection } from '@solana/web3.js'

// import { AppJsonRpcProvider } from 'constants/providers'
import { TokenInfo } from 'state/lists/wrappedTokenInfo'
import { NETWORKS_INFO } from 'constants/networks'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
// import { TopToken } from 'state/topTokens/type'


export class AppJsonRpcProvider extends StaticJsonRpcProvider {
  constructor(url: string, chainId: ChainId) {
    // Including networkish allows ethers to skip the initial detectNetwork call.
    super(url, /* networkish= */ { chainId, name: NETWORKS_INFO[chainId].name })

    // NB: Third-party providers (eg MetaMask) will have their own polling intervals,
    // which should be left as-is to allow operations (eg transaction confirmation) to resolve faster.
    // Network providers (eg AppJsonRpcProvider) need to update less frequently to be considered responsive.
    this.pollingInterval = 12_000
  }
}

const KS_SETTING_API ='https://ks-setting.kyberswap.com/api'
export type KyberSwapConfig = {
  rpc: string
  prochart: boolean
  isEnableBlockService: boolean
  blockClient: ApolloClient<NormalizedCacheObject>
  classicClient: ApolloClient<NormalizedCacheObject>
  elasticClient: ApolloClient<NormalizedCacheObject>
  readProvider: AppJsonRpcProvider | undefined
  connection: Connection | undefined
  commonTokens?: string[]
}

export type KyberSwapConfigResponse = {
  rpc: string
  prochart: boolean
  isEnableBlockService: boolean
  blockSubgraph: string
  classicSubgraph: string
  elasticSubgraph: string
  commonTokens?: string[]
}

export type KyberswapConfigurationResponse = {
  data: {
    config: KyberSwapConfigResponse
  }
}

export type KyberswapGlobalConfigurationResponse = {
  data: {
    config: {
      aggregator: string
      isEnableAuthenAggregator: boolean
    }
  }
}

export interface TokenListResponse<T = TokenInfo> {
  data: {
    pageination: {
      totalItems: number
    }
    tokens: Array<T>
  }
}

const ksSettingApi = createApi({
  reducerPath: 'ksSettingConfigurationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${KS_SETTING_API}/v1`,
  }),
  endpoints: builder => ({
    getKyberswapConfiguration: builder.query<KyberswapConfigurationResponse, ChainId>({
      query: chainId => ({
        url: '/configurations/fetch',
        params: {
          serviceCode: `kyberswap-${chainId}`,
        },
      }),
    }),

    getKyberswapGlobalConfiguration: builder.query<KyberswapGlobalConfigurationResponse, void>({
      query: () => ({
        url: '/configurations/fetch',
        params: {
          serviceCode: `kyberswap`,
        },
      }),
    }),

    getTokenList: builder.query<
      TokenListResponse,
      { chainId: number; page?: number; pageSize?: number; isWhitelisted?: boolean; isStable?: boolean }
    >({
      query: ({ chainId, ...params }) => ({
        url: `/tokens`,
        params: { ...params, chainIds: chainId },
      }),
    }),
    importToken: builder.mutation<TokenListResponse, Array<{ chainId: string; address: string }>>({
      query: tokens => ({
        url: `/tokens/import`,
        body: { tokens },
        method: 'POST',
      }),
    }),
    // getTopTokens: builder.query<TokenListResponse<TopToken>, { chainId: number; page: number }>({
    //   query: params => ({
    //     url: `/tokens/popular`,
    //     params,
      // }),
    // }),
  }),
})

export const {
  useGetKyberswapConfigurationQuery,
  useLazyGetKyberswapConfigurationQuery,
  useGetKyberswapGlobalConfigurationQuery,
  useLazyGetTokenListQuery,
  useGetTokenListQuery,
  useImportTokenMutation,
  // useLazyGetTopTokensQuery,
} = ksSettingApi

export default ksSettingApi
