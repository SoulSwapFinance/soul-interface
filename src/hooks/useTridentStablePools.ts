import { Interface } from '@ethersproject/abi'
import { computeHybridPoolAddress, Currency, CurrencyAmount, JSBI, Fee, HybridPool } from 'sdk'
import HybridPoolArtifact from 'sdk/abis/HybridPool.json'
import { PoolAtomType } from 'features/trident/types'
import { useStablePoolFactory } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { useMultipleContractSingleData } from 'state/multicall/hooks'
import { useMemo } from 'react'

const STABLE_POOL_INTERFACE = new Interface(HybridPoolArtifact.abi)

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useTridentStablePools(
  pools: [Currency | undefined, Currency | undefined, Fee | undefined, JSBI | undefined][]
): PoolAtomType[] {
  const { chainId } = useActiveWeb3React()
  const hybridPoolFactory = useStablePoolFactory()

  const poolAddresses = useMemo(() => {
    if (!chainId) return []

    return pools.map(([currencyA, currencyB, fee, a]) => {
      if (!currencyA || !currencyB || currencyA === currencyB) return undefined

      const [tokenA, tokenB] = currencyA?.wrapped.sortsBefore(currencyB?.wrapped)
        ? [currencyA?.wrapped, currencyB?.wrapped]
        : [currencyB?.wrapped, currencyA?.wrapped]

      return tokenA &&
        tokenB &&
        tokenA.chainId === tokenB.chainId &&
        !tokenA.equals(tokenB) &&
        fee &&
        a &&
        hybridPoolFactory?.address
        ? computeHybridPoolAddress({
            factoryAddress: hybridPoolFactory.address,
            tokenA,
            tokenB,
            fee,
            // TODO: Jack - work out what this number is
            a,
          })
        : undefined
    })
  }, [pools, chainId])

  const results = useMultipleContractSingleData(poolAddresses, STABLE_POOL_INTERFACE, 'getReserves')
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = pools[i][0]?.wrapped
      const tokenB = pools[i][1]?.wrapped
      const fee = pools[i]?.[2]
      const a = pools[i]?.[3]
      if (loading) return { state: StablePoolState.LOADING }
      if (!tokenA || !tokenB || tokenA.equals(tokenB) || !fee || !a) return { state: StablePoolState.INVALID }
      if (!reserves) return { state: StablePoolState.NOT_EXISTS }
      const [reserve0, reserve1] = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return {
        state: StablePoolState.EXISTS,
        pool: new HybridPool(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          fee,
          a
        ),
      }
    })
  }, [results, pools])
}

export function useTridentStablePool(tokenA?: Currency, tokenB?: Currency, fee?: Fee, a?: JSBI): PoolAtomType {
  const inputs: [[Currency | undefined, Currency | undefined, Fee | undefined, JSBI | undefined]] = useMemo(
    () => [[tokenA, tokenB, fee, a]],
    [tokenA, tokenB, fee, a]
  )
  return useTridentStablePools(inputs)[0]
}