import { Interface } from '@ethersproject/abi'
import { 
    computeConstantProductPoolAddress, 
    ConstantProductPool, 
    Fee, 
    PoolState,
    Currency, 
    CurrencyAmount, 
    } from 'sdk'
import constantProductPoolArtifact from 'sdk/abis/ConstantProductPool.json'
import { enumToArray } from 'functions/array/enumToArray'
import { useConstantProductPoolFactory } from 'hooks/useContract'
import { PoolWithState } from 'types'
import combinate from 'combinate'
import { useMemo } from 'react'

import { useMultipleContractSingleData } from '../state/multicall/hooks'

const POOL_INTERFACE = new Interface(constantProductPoolArtifact.abi)

type PoolInput = [Currency | undefined, Currency | undefined, Fee | undefined, boolean | undefined]

export function useConstantProductPoolsPermutations(
  currencies: [Currency | undefined, Currency | undefined][]
): PoolWithState<ConstantProductPool>[] {
  const permutations = useMemo(() => {
    if (!currencies.length) return []
    return combinate({
      tokens: currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
      fee: enumToArray(Fee),
      twap: [true, false],
    }).map<PoolInput>(({ tokens: [tokenA, tokenB], fee, twap }) => [tokenA, tokenB, fee, twap])
  }, [currencies])

  return useConstantProductPools(permutations)
}

export function useConstantProductPools(pools: PoolInput[]): PoolWithState<ConstantProductPool>[] {
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const poolsAddresses = useMemo(
    () =>
      pools.reduce<(string | undefined)[]>((acc, [tokenA, tokenB, fee, twap]) => {
        const address =
          tokenA &&
          tokenB &&
          fee &&
          twap !== undefined &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          constantProductPoolFactory?.address
            ? computeConstantProductPoolAddress({
                factoryAddress: constantProductPoolFactory.address,
                tokenA: tokenA.wrapped,
                tokenB: tokenB.wrapped,
                fee,
                twap,
              })
            : undefined

        acc.push(address && !acc.includes(address) ? address : undefined)
        return acc
      }, []),
    [constantProductPoolFactory?.address, pools]
  )

  const results = useMultipleContractSingleData(poolsAddresses, POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const twap = pools[i]?.[3]
      // TODO: fix lines below
      if (loading) return
      // if (loading) return { state: PoolState.LOADING }
      // if (!reserves) return { state: PoolState.NOT_EXISTS }
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return { state: PoolState.INVALID }

      // const { _reserve0: reserve0, _reserve1: reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return {
        // TODO: fix lines below
        state: 2,
        // state: PoolState.EXISTS,
        pool: new ConstantProductPool(
          CurrencyAmount.fromRawAmount(token0, 'reserve0'),
          CurrencyAmount.fromRawAmount(token1, 'reserve1'),
          // CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          // CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          twap
        ),
      }
    })
  }, [results, pools])
}

export function useConstantProductPool(
  tokenA?: Currency,
  tokenB?: Currency,
  fee?: Fee,
  twap?: boolean
): PoolWithState<ConstantProductPool> {
  const inputs: [PoolInput] = useMemo(() => [[tokenA, tokenB, fee, twap]], [tokenA, tokenB, fee, twap])
  return useConstantProductPools(inputs)[0]
}