import { createApi } from '@reduxjs/toolkit/query/react'
// import { baseQueryOauthDynamic } from 'services/baseQueryOauth'
import { BuildRoutePayload, BuildRouteResponse } from 'services/route/types/buildRoute'
import { BaseQueryFn, fetchBaseQuery } from '@reduxjs/toolkit/query'

import { GetRouteParams, GetRouteResponse } from './types/getRoute'
import { checkIamDown } from 'utils/swap/iamError'


// const queryWithToken = async (config: any, baseUrl: string) => {
//   try {
//     if (config.method?.toLowerCase() !== 'get') {
//       // mapping rtk query vs axios
//       config.data = config.data || config.body
//     }
//     config.url = baseUrl + config.url
//     const result = await KyberOauth2Api.call(config)
//     return { data: result.data }
//   } catch (err) {
//     checkIamDown(err)
//     return {
//       error: {
//         status: err.response?.status,
//         data: err.response?.data || err.message,
//       },
//     }
//   }
// }

// this query is use for private api call: this will attach access token in every request, auto refresh token if expired
// const baseQueryOauth =
//   ({ baseUrl = '' }: { baseUrl?: string }): BaseQueryFn =>
//   async config => {
//     return config
//     // return queryWithToken(config, baseUrl)
//   }

// same as baseQueryOauth, but has flag to revert if meet incident
export const baseQueryOauthDynamic =
  ({ baseUrl = '' }: { baseUrl?: string }): BaseQueryFn =>
  async (args, WebApi, extraOptions) => {
    if (!args.authentication) {
      // to quickly revert if meet incident
      const rawBaseQuery = fetchBaseQuery({ baseUrl })
      return rawBaseQuery(args, WebApi, extraOptions)
    }
    return args
    // return queryWithToken(args, baseUrl)
  }

const routeApi = createApi({
  reducerPath: 'routeApi',
  baseQuery: baseQueryOauthDynamic({ baseUrl: '' }),
  endpoints: builder => ({
    getRoute: builder.query<
      GetRouteResponse,
      {
        url: string
        params: GetRouteParams
        authentication: boolean
      }
    >({
      query: ({ params, url, authentication }) => ({
        url,
        params,
        authentication,
      }),
    }),
    buildRoute: builder.mutation<
      BuildRouteResponse,
      { url: string; payload: BuildRoutePayload; signal: AbortSignal; authentication: boolean }
    >({
      query: ({ url, payload, signal, authentication }) => ({
        url,
        method: 'POST',
        body: payload,
        signal,
        authentication,
      }),
    }),
  }),
})

export default routeApi
