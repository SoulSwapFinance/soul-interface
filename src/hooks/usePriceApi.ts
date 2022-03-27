import { request } from 'graphql-request'
import useSWR from 'swr'
import { useFantomPrice } from './getPrices'

const fetcher = (query) => request('https://api.thegraph.com/subgraphs/name/soulswapfinance/fantom-exchange', query)

export default function usePriceApi(tokenAddress: string) {
    const smolToken = tokenAddress?.toLowerCase()
    const QUERY = `{
        token(id: "${smolToken}") {
            derivedETH
        }
    }`
  const { data } = useSWR(QUERY, fetcher)
  const fantomPrice = useFantomPrice()
  const price = Number(data?.token?.derivedETH) * Number(fantomPrice)
  return parseFloat(price.toString())
}
