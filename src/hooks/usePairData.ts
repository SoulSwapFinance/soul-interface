import { request } from 'graphql-request'
import useSWR from 'swr'

const fetcher = (query) => request(
    'https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-exchange', 
    query
)

// refactor fxns l8tr
export function usePairVolume(pairAddress: string) {
    const smolPair = pairAddress?.toLowerCase()
    const QUERY = `{
        pairDayData(id: "${smolPair}") {
            id
            volumeUSD
        }
    }`
  const { data } = useSWR(QUERY, fetcher)
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
  const { data } = useSWR(QUERY, fetcher)
  const liquidityValue = Number(data?.pair?.reserveUSD)
  const totalSupply = Number(data?.pair?.totalSupply)
  const price = Number(liquidityValue) / Number(totalSupply)
  console.log('liquidityValue:%s', liquidityValue)
  console.log('totalSupply:%s', totalSupply)
  console.log('price:%s', Number(price))
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
  const { data } = useSWR(QUERY, fetcher)
  const balance = Number(data?.liquidityPositions?.liquidityTokenBalance)
  console.log('volume:%s', balance)
  return balance
}
