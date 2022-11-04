import { Interface } from '@ethersproject/abi'
import ISoulSwapPairABI from 'constants/abis/soulswap/ISoulSwapPair.json'
import { useMultipleContractSingleData } from 'lib/state/multicall'
import { useMemo } from 'react'
import { useBlockNumber } from 'state/application/hooks'
import { computePairAddress, Currency, CurrencyAmount, Pair, FACTORY_ADDRESS } from 'sdk'

const PAIR_INTERFACE = new Interface(ISoulSwapPairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  chainId: number,
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null][] {
  const latestBlockNumber = useBlockNumber()
  // const { data: latestBlockNumber } = useBlockNumber[chainId]
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          FACTORY_ADDRESS[tokenA.chainId]
          ? computePairAddress({ factoryAddress: FACTORY_ADDRESS[tokenA.chainId], tokenA, tokenB })
          : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(
    chainId,
    latestBlockNumber,
    pairAddresses,
    PAIR_INTERFACE,
    'getReserves'
  )

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(CurrencyAmount.fromRawAmount(token0, reserve0.toString()), CurrencyAmount.fromRawAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, tokens])
}

export function usePair(chainId: number, tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(chainId, inputs)[0]
}
