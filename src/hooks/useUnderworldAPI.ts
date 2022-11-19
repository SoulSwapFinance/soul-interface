import { request } from 'graphql-request'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import useSWR from 'swr'

export function useFetcher() {
    const { chainId } = useActiveWeb3React()
    const prefix = chainId == ChainId.FANTOM ? 'fantom' : 'avalanche'
    const fetcher = (query) => request(
    `https://api.thegraph.com/subgraphs/name/soulswapfinance/${prefix}-underworld`,
    query
    )
    return fetcher
}

export function useUnderworldPairAPI(pairAddress: string) {
    const smolPair = pairAddress?.toLowerCase()
    const QUERY = `{
        underworldPair(id: "${smolPair}") {
            symbol
            name
            decimals
            totalSupply

            asset { symbol }
            collateral { symbol }
            
            exchangeRate
            utilization
        
            supplyAPR
            borrowAPR

            totalAsset{
                elastic
                base
            }

            totalBorrow{
                elastic
                base
            }
        }
    }`
  const { data } = useSWR(QUERY, useFetcher())
  const name = data?.underworldPair?.name
  const symbol = data?.underworldPair?.symbol
  const decimals = data?.underworldPair?.decimals
  const asset = data?.underworldPair?.asset.symbol
  const collateral = data?.underworldPair?.collateral.symbol
  const divisor = 10**decimals
  const exchangeRate = data?.underworldPair?.exchangeRate
  const utilization = data?.underworldPair?.utilization
  const supplyAPR = data?.underworldPair?.supplyAPR
  const borrowAPR = data?.underworldPair?.borrowAPR
  const aElastic = data?.underworldPair?.totalAsset.elastic / divisor
  const aBase = data?.underworldPair?.totalAsset.base / divisor
  const bElastic = data?.underworldPair?.totalBorrow.elastic / divisor
  const bBase = data?.underworldPair?.totalBorrow.base / divisor
    return [
        name,
        symbol, 
        decimals,
        asset,
        collateral,
        exchangeRate, 
        utilization, 
        supplyAPR,
        borrowAPR,
        aElastic, 
        aBase, 
        bElastic, 
        bBase
    ]
}


