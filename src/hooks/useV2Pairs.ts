import { ChainId, computePairAddress, Currency, CurrencyAmount, Pair, SOUL, SOUL_VAULT_ADDRESS, Token } from '../sdk'

import ISoulSwapPair from '../constants/abis/soulswap/ISoulSwapPair.json'
import { Interface } from '@ethersproject/abi'
import { useMemo } from 'react'
import { useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import { FACTORY_ADDRESS, SOUL_SUMMONER_ADDRESS, SOUL_DAO_ADDRESS, LUX_TREASURY_ADDRESS } from '../constants'
import { POOLS, TokenInfo } from '../constants/farms'
import { concat } from 'lodash'
import { VAULTS } from '../constants/vaults'
import { useActiveWeb3React } from 'services/web3'
import { SOUL_BOND_ADDRESS } from 'features/bond/constants'
import { BONDS } from 'constants/bonds'
import { useFantomPrice, useLuxorPrice, useSeancePrice, useSoulPrice, useWrappedBtcPrice, useWrappedEthPrice, useWrappedLumPrice } from './getPrices'

const PAIR_INTERFACE = new Interface(ISoulSwapPair)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
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
          ? computePairAddress({
              factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
              tokenA,
              tokenB,
            })
          : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

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
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
      ]
    })
  }, [results, tokens])
}

export interface TVLInfo {
  id?: string
  lpToken: string
  tvl: number
  lpPrice: number
}

export function useVaultTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const ftmPrice = useFantomPrice()
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()

  const farmingPools = Object.keys(VAULTS[chainId || 250]).map((key) => {
    return { ...VAULTS[chainId || 250][key] }
  })

  const singlePools = farmingPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = farmingPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const vaultBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_VAULT_ADDRESS[chainId || 250],
  ])
  const vaultBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_VAULT_ADDRESS[chainId || 250],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL[chainId].address.toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' || token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' || token.symbol == 'DAI'
      )
    }

    function getPrice(token: TokenInfo) {
      if (token.id.toLowerCase() == SOUL[chainId].address.toLowerCase()) {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'USDC' || token.symbol == 'DAI') {
        return 1
      }
      return 0
    }

    const lpTVL = results.map((result, i) => {
      const { result: reserves, loading } = result

      let { token0, token1, lpToken } = lpPools[i]

      token0 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token0 : token1
      token1 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token1 : token0

      if (loading) return { lpToken, tvl: 0, lpPrice: 0, id: '0' }
      if (!reserves) return { lpToken, tvl: 0, lpPrice: 0, id: '0' }

      const { reserve0, reserve1 } = reserves

      const lpTotalSupply = totalSupply[i]?.result?.[0]

      const summonerRatio = vaultBalance[i]?.result?.[0] / lpTotalSupply

      const token0price = getPrice(token0)
      const token1price = getPrice(token1)

      const token0total = Number(Number(token0price * (Number(reserve0) / 10 ** token0?.decimals)).toString())
      const token1total = Number(Number(token1price * (Number(reserve1) / 10 ** token1?.decimals)).toString())

      let lpTotalPrice = Number(token0total + token1total)

      if (isKnownToken(token0)) {
        lpTotalPrice = token0total * 2
      } else if (isKnownToken(token1)) {
        lpTotalPrice = token1total * 2
      }

      const lpPrice = lpTotalPrice / (lpTotalSupply / 10 ** 18)
      const tvl = lpTotalPrice * summonerRatio

      return {
        lpToken,
        tvl,
        lpPrice,
        id: '0',
      }
    })

    const singleTVL = vaultBalanceSingle.map((result, i) => {
      const { result: balance, loading } = result

      const { token0, lpToken } = singlePools[i]

      if (loading) return { lpToken, tvl: 0, lpPrice: 0, id: '0' }
      if (!balance) return { lpToken, tvl: 0, lpPrice: 0, id: '0' }

      const token0price = getPrice(token0)

      const token0total = Number(Number(token0price * (Number(balance) / 10 ** token0?.decimals)).toString())

      const lpPrice = token0price
      const tvl = token0total

      return {
        lpToken,
        tvl,
        lpPrice,
        id: i.toString(),
      }
    })

    return concat(singleTVL, lpTVL)
  }, [
    results,
    vaultBalanceSingle,
    chainId,
    soulPrice,
    ftmPrice,
    seancePrice,
    totalSupply,
    vaultBalance,
    lpPools,
    singlePools,
  ])
}

export function useTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const ftmPrice = useFantomPrice()
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const luxPrice = useLuxorPrice()
  const wethPrice = useWrappedEthPrice()

  const farmingPools = Object.keys(POOLS[chainId || 250]).map((key) => {
    return { ...POOLS[chainId || 250][key], lpToken: key }
  })

  const singlePools = farmingPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = farmingPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const summonerBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_SUMMONER_ADDRESS[chainId || 250],
  ])
  const summonerBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_SUMMONER_ADDRESS[chainId || 250],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.symbol == 'SOUL' ||
        token.symbol == 'FTM' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'AVAX' ||
        token.symbol == 'WAVAX' ||
        token.symbol == 'WETH' ||
        token.symbol == 'WBTC' ||
        token.symbol == 'LUX' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'USDT' ||
        token.symbol == 'DAI'
      )
    }

    function getPrice(token: TokenInfo) {
      if (token.symbol == 'SOUL') {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'LUX') {
        return luxPrice
      }
      if (token.symbol == 'WETH') {
        return wethPrice
      }
      if (
        token.symbol == 'USDC' || token.symbol == 'USDT' || token.symbol == 'DAI'
      ) {
        return 1
      }
      return 0
    }

    const lpTVL = results.map((result, i) => {
      const { result: reserves, loading } = result

      let { token0, token1, lpToken } = lpPools[i]

      token0 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token0 : token1
      token1 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token1 : token0

      if (loading) return { lpToken, tvl: 0, lpPrice: 0 }
      if (!reserves) return { lpToken, tvl: 0, lpPrice: 0 }

      const { reserve0, reserve1 } = reserves

      const lpTotalSupply = totalSupply[i]?.result?.[0]

      const summonerRatio = summonerBalance[i]?.result?.[0] / lpTotalSupply

      const token0price = getPrice(token0)
      const token1price = getPrice(token1)

      const token0total = Number(Number(token0price * (Number(reserve0) / 10 ** token0?.decimals)).toString())
      const token1total = Number(Number(token1price * (Number(reserve1) / 10 ** token1?.decimals)).toString())

      let lpTotalPrice = Number(token0total + token1total)

      if (isKnownToken(token0)) {
        lpTotalPrice = token0total * 2
      } else if (isKnownToken(token1)) {
        lpTotalPrice = token1total * 2
      }

      const lpPrice = lpTotalPrice / (lpTotalSupply / 10 ** 18)
      const tvl = lpTotalPrice * summonerRatio

      return {
        lpToken,
        tvl,
        lpPrice,
      }
    })

    const singleTVL = summonerBalanceSingle.map((result, i) => {
      const { result: balance, loading } = result

      const { token0, lpToken } = singlePools[i]

      if (loading) return { lpToken, tvl: 0, lpPrice: 0 }
      if (!balance) return { lpToken, tvl: 0, lpPrice: 0 }

      const token0price = getPrice(token0)

      const token0total = Number(Number(token0price * (Number(balance) / 10 ** token0?.decimals)).toString())

      const lpPrice = token0price
      const tvl = token0total

      return {
        lpToken,
        tvl,
        lpPrice,
      }
    })

    return concat(singleTVL, lpTVL)
  }, [
    results,
    summonerBalanceSingle,
    chainId,
    soulPrice,
    ftmPrice,
    seancePrice,
    totalSupply,
    summonerBalance,
    lpPools,
    singlePools,
  ])
}
export function useBondTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const ftmPrice = useFantomPrice()
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const luxPrice = useLuxorPrice()
  const wethPrice = useWrappedEthPrice()

  const bondingPools = Object.keys(BONDS[chainId || 250]).map((key) => {
    return { ...BONDS[chainId || 250][key], lpToken: key }
  })

  const singlePools = bondingPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = bondingPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const summonerBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_BOND_ADDRESS[chainId],
  ])
  const summonerBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_BOND_ADDRESS[chainId],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL[chainId].address.toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'USDT' ||
        token.symbol == 'DAI' ||
        token.symbol == 'WETH'
      )
    }

    function getPrice(token: TokenInfo) {
      if (token.symbol == 'SOUL') {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'LUX') {
        return luxPrice
      }
      if (token.symbol == 'WETH') {
        return wethPrice
      }
      if (
        token.symbol == 'USDC' || token.symbol == 'USDT' || token.symbol == 'DAI'
      ) {
        return 1
      }
      return 0
    }

    const lpTVL = results.map((result, i) => {
      const { result: reserves, loading } = result

      let { token0, token1, lpToken } = lpPools[i]

      token0 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token0 : token1
      token1 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token1 : token0

      if (loading) return { lpToken, tvl: 0, lpPrice: 0 }
      if (!reserves) return { lpToken, tvl: 0, lpPrice: 0 }

      const { reserve0, reserve1 } = reserves

      const lpTotalSupply = totalSupply[i]?.result?.[0]

      const summonerRatio = summonerBalance[i]?.result?.[0] / lpTotalSupply

      const token0price = getPrice(token0)
      const token1price = getPrice(token1)

      const token0total = Number(Number(token0price * (Number(reserve0) / 10 ** token0?.decimals)).toString())
      const token1total = Number(Number(token1price * (Number(reserve1) / 10 ** token1?.decimals)).toString())

      let lpTotalPrice = Number(token0total + token1total)

      if (isKnownToken(token0)) {
        lpTotalPrice = token0total * 2
      } else if (isKnownToken(token1)) {
        lpTotalPrice = token1total * 2
      }

      const lpPrice = lpTotalPrice / (lpTotalSupply / 10 ** 18)
      const tvl = lpTotalPrice * summonerRatio

      return {
        lpToken,
        tvl,
        lpPrice,
      }
    })

    return concat(lpTVL)
  }, [
    results,
    chainId,
    soulPrice,
    ftmPrice,
    seancePrice,
    totalSupply,
    summonerBalance,
    lpPools,
    singlePools,
  ])
}

export function useSoulTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const ftmPrice = useFantomPrice()
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const luxPrice = useLuxorPrice()
  const wethPrice = useWrappedEthPrice()
  const wlumPrice = useWrappedLumPrice()

  const liquidityPools = Object.keys(POOLS[chainId || 250]).map((key) => {
    return { ...POOLS[chainId || 250][key], lpToken: key }
  })

  const singlePools = liquidityPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = liquidityPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const daoBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_DAO_ADDRESS[chainId || 250],
  ])
  const daoBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_DAO_ADDRESS[chainId || 250],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL[chainId].address.toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'USDT' ||
        token.symbol == 'DAI' ||
        token.symbol == 'WETH'
      )
    }

    function getPrice(token: TokenInfo) {
      
      if (token.symbol == 'SOUL') {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'LUX') {
        return luxPrice
      }
      if (token.symbol == 'WLUM') {
        return wlumPrice
      }
      if (token.symbol == 'WETH' || token.symbol == "ETH") {
        return wethPrice
      }
      if (
        token.symbol == 'USDC' || token.symbol == 'USDT' || token.symbol == 'DAI'
      ) {
        return 1
      }
      return 0
    }

    const lpTVL = results.map((result, i) => {
      const { result: reserves, loading } = result

      let { token0, token1, lpToken } = lpPools[i]

      token0 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token0 : token1
      token1 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token1 : token0

      if (loading) return { lpToken, tvl: 0, lpPrice: 0 }
      if (!reserves) return { lpToken, tvl: 0, lpPrice: 0 }

      const { reserve0, reserve1 } = reserves

      const lpTotalSupply = totalSupply[i]?.result?.[0]

      const summonerRatio = daoBalance[i]?.result?.[0] / lpTotalSupply

      const token0price = getPrice(token0)
      const token1price = getPrice(token1)

      const token0total = Number(Number(token0price * (Number(reserve0) / 10 ** token0?.decimals)).toString())
      const token1total = Number(Number(token1price * (Number(reserve1) / 10 ** token1?.decimals)).toString())

      let lpTotalPrice = Number(token0total + token1total)

      if (isKnownToken(token0)) {
        lpTotalPrice = token0total * 2
      } else if (isKnownToken(token1)) {
        lpTotalPrice = token1total * 2
      }

      const lpPrice = lpTotalPrice / (lpTotalSupply / 10 ** 18)
      const tvl = lpTotalPrice * summonerRatio

      return {
        lpToken,
        tvl,
        lpPrice,
      }
    })
    
    return concat(lpTVL)
  }, [
    results,
    daoBalanceSingle,
    chainId,
    soulPrice,
    ftmPrice,
    seancePrice,
    luxPrice,
    wethPrice,
    totalSupply,
    daoBalanceSingle,
    lpPools,
    singlePools,
  ])
}

export function useLuxTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const ftmPrice = useFantomPrice()
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const luxPrice = useLuxorPrice()
  const wethPrice = useWrappedEthPrice()
  const wbtcPrice = useWrappedBtcPrice()

  const liquidityPools = Object.keys(POOLS[chainId || 250]).map((key) => {
    return { ...POOLS[chainId || 250][key], lpToken: key }
  })

  const singlePools = liquidityPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = liquidityPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const daoBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    LUX_TREASURY_ADDRESS[chainId || 250],
  ])
  const daoBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    LUX_TREASURY_ADDRESS[chainId || 250],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL[chainId].address.toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'USDT' ||
        token.symbol == 'DAI' ||
        token.symbol == 'WETH' ||
        token.symbol == 'WBTC'
      )
    }

    function getPrice(token: TokenInfo) {
      if (token.symbol == 'SOUL') {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'LUX') {
        return luxPrice
      }
      if (token.symbol == 'WETH') {
        return wethPrice
      }
      if (token.symbol == 'WBTC') {
        return wbtcPrice
      }
      if (
        token.symbol == 'USDC' || token.symbol == 'USDT' || token.symbol == 'DAI' || token.symbol == 'MIM'
      ) {
        return 1
      }
      return 0
    }

    const lpTVL = results.map((result, i) => {
      const { result: reserves, loading } = result

      let { token0, token1, lpToken } = lpPools[i]

      token0 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token0 : token1
      token1 = token0.id.toLowerCase() < token1.id.toLowerCase() ? token1 : token0

      if (loading) return { lpToken, tvl: 0, lpPrice: 0 }
      if (!reserves) return { lpToken, tvl: 0, lpPrice: 0 }

      const { reserve0, reserve1 } = reserves

      const lpTotalSupply = totalSupply[i]?.result?.[0]

      const summonerRatio = daoBalance[i]?.result?.[0] / lpTotalSupply

      const token0price = getPrice(token0)
      const token1price = getPrice(token1)

      const token0total = Number(Number(token0price * (Number(reserve0) / 10 ** token0?.decimals)).toString())
      const token1total = Number(Number(token1price * (Number(reserve1) / 10 ** token1?.decimals)).toString())

      let lpTotalPrice = Number(token0total + token1total)

      if (isKnownToken(token0)) {
        lpTotalPrice = token0total * 2
      } else if (isKnownToken(token1)) {
        lpTotalPrice = token1total * 2
      }

      const lpPrice = lpTotalPrice / (lpTotalSupply / 10 ** 18)
      const tvl = lpTotalPrice * summonerRatio

      return {
        lpToken,
        tvl,
        lpPrice,
      }
    })

    return concat(lpTVL)
  }, [
    results,
    daoBalanceSingle,
    chainId,
    soulPrice,
    ftmPrice,
    seancePrice,
    luxPrice,
    wethPrice,
    wbtcPrice,
    totalSupply,
    daoBalanceSingle,
    lpPools,
    singlePools,
  ])
}

export function useV2PairsWithPrice(
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null, number][] {
  const { chainId } = useActiveWeb3React()
  const ftmPrice = useFantomPrice()
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()
  const luxPrice = useLuxorPrice()
  const wethPrice = useWrappedEthPrice()
  const wbtcPrice = useWrappedBtcPrice()

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
          ? computePairAddress({
              factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
              tokenA,
              tokenB,
            })
          : undefined
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')

  return useMemo(() => {
    function isKnownToken(token: Token) {
      return (
        token.symbol == 'SOUL' || token.symbol == 'SEANCE' ||
        token.symbol == 'WFTM' || token.symbol == 'FTM' || 
        token.symbol == 'WETH' || token.symbol == 'ETH' ||
        token.symbol == 'USDC' || token.symbol == 'USDT' || 
        token.symbol == 'DAI' || token.symbol == 'LUX' 
        || token.symbol == 'WLUM' 
      )
    }

    function getPrice(token: Token) {
      if (token.symbol == 'SOUL') {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'WETH' || token.symbol == 'ETH') {
        return wethPrice
      }
      if (token.symbol == 'WBTC' || token.symbol == 'BTC') {
        return wbtcPrice
      }
      if (token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'LUX') {
        return luxPrice
      }
      if (token.symbol == 'USDC' || token.symbol == 'USDT' || token.symbol == 'DAI') {
        return 1
      }
      return 0
    }

    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null, 0]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null, 0]
      if (!reserves) return [PairState.NOT_EXISTS, null, 0]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

      const lpTotalSupply = totalSupply[i]?.result?.[0]

      const token0price = getPrice(token0)
      const token1price = getPrice(token1)

      const token0total = Number(Number(token0price * (Number(reserve0) / 10 ** token0?.decimals)).toString())
      const token1total = Number(Number(token1price * (Number(reserve1) / 10 ** token1?.decimals)).toString())

      let lpTotalPrice = Number(token0total + token1total)

      if (isKnownToken(token0)) {
        lpTotalPrice = token0total * 2
      } else if (isKnownToken(token1)) {
        lpTotalPrice = token1total * 2
      }

      const lpPrice = lpTotalPrice / (lpTotalSupply / 10 ** 18)

      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
        lpPrice,
      ]
    })
  }, [results, chainId, soulPrice, ftmPrice, luxPrice, seancePrice, tokens, totalSupply, wethPrice, wbtcPrice])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}
