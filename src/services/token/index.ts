import { createApi } from '@reduxjs/toolkit/query/react'
import { TOKEN_SCORE_TTL } from 'constants/index'

import { GetTokenScoreParams, GetTokenScoreResponse } from './types'
import { baseQueryOauthDynamic } from 'services/route'
import { BFF_API } from 'utils/swap/iamError'

const tokenApi = createApi({
  reducerPath: 'tokenApi',
  baseQuery: baseQueryOauthDynamic({ baseUrl: BFF_API }),
  endpoints: builder => ({
    getTokenScore: builder.query<
      GetTokenScoreResponse,
      {
        params: GetTokenScoreParams
        authentication: boolean
      }
    >({
      query: ({ params, authentication }) => ({
        url: '/v1/tokens/score',
        params,
        authentication,
      }),
      keepUnusedDataFor: TOKEN_SCORE_TTL,
    }),
  }),
})

export default tokenApi