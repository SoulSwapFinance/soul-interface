import { Pair, Token } from 'sdk'

import { getAddress, parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'

// import { useGetPairsQuery } from '../graphql/generated/schema'

import { useActiveWeb3React } from 'services/web3'
import { getPairs } from 'services/graph'

// export function useAllPairs(): { loading: boolean; pairs: Pair[] } {
export function useAllPairs() {
  const { chainId } = useActiveWeb3React()
  const { data } = {
      data: {
        pairs:[
        {
            Pair:{
                token0: Token,
                token1: Token,
                reserve0: 0,
                reserve1: 0
            },
            Pair1:{
                token0: Token,
                token1: Token,
                reserve0: 0,
                reserve1: 0            
            }
        }]
      }
    }
//   const { loading, data, error } = getPairs()
// 
  return useMemo(() => {
    // if (loading || !chainId) return { loading: true, pairs: [] }
    // if (!data || error) return { loading: false, pairs: [] }
    return {
      loading: false,
      // @tslint-disable
      pairs: 
      data.pairs?.reduce((pairs: Pair[], rawPair) => {
        // const { token0, token1, reserve0, reserve1 } = rawPair
        const tokenAmountA = 1
        // new TokenAmount(
        //   new Token(chainId, getAddress(token0.address), parseInt(token0.decimals), token0.symbol, token0.name),
        //   parseUnits(reserve0, token0.decimals).toString()
        // )
        const tokenAmountB = 2
        // new TokenAmount(
        //   new Token(chainId, getAddress(token1.address), parseInt(token1.decimals), token1.symbol, token1.name),
        //   parseUnits(reserve1, token1.decimals).toString()
        // )
        // pairs.push(new Pair(tokenAmountA, tokenAmountB))
        return pairs
      }, []),
    }
  }, [chainId, data,
    //  error, loading
    ])
}