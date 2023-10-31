import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
// import { ChainId } from 'sdk'
// import { useActiveWeb3React } from 'services/web3'

export const dexCandlesGraph = (chainId) => {
  // const { chainId } = useActiveWeb3React()
  // const prefix = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
    // const uri = `https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-soulswap`
  const uri = 'https://ftmapi.soulswap.finance/api/dexcandles'
  return new ApolloClient({
    link: createHttpLink({
      uri: uri,
    }),
    cache: new InMemoryCache(),
  })
}
