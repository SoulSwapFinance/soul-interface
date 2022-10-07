import { request } from 'graphql-request'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import useSWR from 'swr'
import { useFantomPrice } from './getPrices'

export function useFetcher() {
    const { chainId } = useActiveWeb3React()
    const prefix = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
    const fetcher = (query) => request(
    `https://api.thegraph.com/subgraphs/name/soulswapfinance/${prefix}-exchange`,
    query
    )
    return fetcher
}

export default function usePriceApi(tokenAddress: string) {
    const smolToken = tokenAddress?.toLowerCase()
    const QUERY = `{
        token(id: "${smolToken}") {
            derivedETH
        }
    }`
  const { data } = useSWR(QUERY, useFetcher())
  const fantomPrice = useFantomPrice()
  const price = Number(data?.token?.derivedETH) * Number(fantomPrice)
  return parseFloat(price.toString())
}
