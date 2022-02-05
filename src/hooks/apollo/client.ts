import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

export const dexCandlesGraph = (chainId) => {
    const uri = 'https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-soulswap'
//   const uri = 'https://ftmapi.soulswap.finance/api/dexcandles'
  return new ApolloClient({
    link: createHttpLink({
      uri: uri,
    }),
    cache: new InMemoryCache(),
  })
}
