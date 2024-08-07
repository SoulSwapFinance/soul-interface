import { request } from 'graphql-request'
import { ChainId, WNATIVE_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import useSWR from 'swr'
import { useTokenPrice } from './getPrices'

export function useFetcher() {
    const { chainId } = useActiveWeb3React()
    // const prefix = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
    const fetcher = (query) => request(
        // note: important -- used for volume metrics.
        `https://api.studio.thegraph.com/query/3838/${chainId == ChainId.AVALANCHE ? 'avalanche' : 'fantom'}-swap/version/latest`,
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
    const { chainId } = useActiveWeb3React()

    const fantomPrice = useTokenPrice(WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM])
    const price = Number(data?.token?.derivedETH) * Number(fantomPrice)
    return parseFloat(price.toString())
}
