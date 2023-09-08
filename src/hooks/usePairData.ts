import { request } from 'graphql-request'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import useSWR from 'swr'

export function useFetcher() {
    const { chainId } = useActiveWeb3React()
    const prefix = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
    const fetcher = (query) => request(
    `https://api.thegraph.com/subgraphs/name/soulswapfinance/${prefix ?? 'fantom'}-exchange`,
    query
    )
    return fetcher
}

// refactor fxns l8tr
export function usePairVolume(pairAddress: string) {
    const smolPair = pairAddress?.toLowerCase()
    const QUERY = `{
        pairDayData(id: "${smolPair}") {
            id
            volumeUSD
        }
    }`
  const { data } = useSWR(QUERY, useFetcher())
  const volumeUSD = Number(data?.pairDayData?.volumeUSD)
  console.log('volume:%s', volumeUSD)
  return volumeUSD
}

export function usePairPrice(pairAddress: string) {
    const smolPair = pairAddress?.toLowerCase()
    const QUERY = `{
        pair(id: "${smolPair}") {
            totalSupply
            reserveUSD
        }
    }`
  const { data } = useSWR(QUERY, useFetcher())
  const liquidityValue = Number(data?.pair?.reserveUSD)
  const totalSupply = Number(data?.pair?.totalSupply)
  const price = Number(liquidityValue) / Number(totalSupply)
//   console.log('liquidityValue:%s', liquidityValue)
//   console.log('totalSupply:%s', totalSupply)
//   console.log('price:%s', Number(price))
  return price
}

export function usePairBalance(userAddress: string, pairAddress: string) {
    const smolUser = userAddress?.toLowerCase()
    const smolPair = pairAddress?.toLowerCase()
    const QUERY = `{
        liquidityPositions(where: 
            {
                user: "${smolUser}"
                pair: "${smolPair}"
            }) 
            {
            liquidityTokenBalance
        }
    }`
  const { data } = useSWR(QUERY, useFetcher())
  const balance = Number(data?.liquidityPositions?.liquidityTokenBalance)
  console.log('volume:%s', balance)
  return balance
}
