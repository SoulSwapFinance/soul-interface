import { ChainId, computePairAddress, Currency, CurrencyAmount, Pair, Token } from '../sdk'

import ISoulSwapPair from '../constants/abis/soulswap/ISoulSwapPair.json'
import { Interface } from '@ethersproject/abi'
import { useContext, useMemo } from 'react'
import { useMultipleContractSingleData, useSingleCallResult } from '../state/multicall/hooks'
import { SOUL_ADDRESS, FACTORY_ADDRESS, SOUL_SUMMONER_ADDRESS, SOUL_VAULT_ADDRESS, SOUL_DAO_ADDRESS, LUX_TREASURY_ADDRESS } from '../constants'
import { PriceContext } from '../contexts/priceContext'
import { POOLS, TokenInfo } from '../constants/farms'
import { concat } from 'lodash'
import { VAULTS } from '../constants/vaults'
import { usePriceHelperContract } from '../features/bond/hooks/useContract'
import { formatCurrency } from '../modals/TokensStatsModal'
import { useActiveWeb3React } from 'services/web3'
import { SOUL_BOND_ADDRESS } from 'features/bond/constants'
import { BONDS } from 'constants/bonds'

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
  const priceHelperContract = usePriceHelperContract()

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log(soulPrice)

  const farmingPools = Object.keys(VAULTS[ChainId.FANTOM]).map((key) => {
    return { ...VAULTS[ChainId.FANTOM][key] }
  })

  const singlePools = farmingPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = farmingPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const summonerBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_VAULT_ADDRESS[ChainId.FANTOM],
  ])
  const summonerBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_VAULT_ADDRESS[ChainId.FANTOM],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' || token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' || token.symbol == 'fUSDT'
      )
    }

    function getPrice(token: TokenInfo) {
      if (token.id.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase()) {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'SEANCE' || token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'USDC' || token.symbol == 'fUSDT') {
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
        id: '0',
      }
    })

    const singleTVL = summonerBalanceSingle.map((result, i) => {
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

export function useTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const priceHelperContract = usePriceHelperContract()

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log(soulPrice)

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  // console.log(Number(rawLuxPrice))
  const luxPrice = Number(rawLuxPrice) / 1E18
  // console.log(luxPrice)

  const farmingPools = Object.keys(POOLS[ChainId.FANTOM]).map((key) => {
    return { ...POOLS[ChainId.FANTOM][key], lpToken: key }
  })

  const singlePools = farmingPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = farmingPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const summonerBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_SUMMONER_ADDRESS[ChainId.FANTOM],
  ])
  const summonerBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_SUMMONER_ADDRESS[ChainId.FANTOM],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'fUSDT' ||
        token.symbol == 'FUSDT' ||
        token.symbol == 'MIM' ||
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
      if (
        token.symbol == 'USDC' || token.symbol == 'fUSDT' || token.symbol == 'DAI' ||
        token.symbol == 'FUSDT' || token.symbol == 'USDT' || token.symbol == 'MIM'
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
  const priceHelperContract = usePriceHelperContract()

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log(soulPrice)

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  // console.log(Number(rawLuxPrice))
  const luxPrice = Number(rawLuxPrice) / 1E18
  // console.log(luxPrice)

  const bondingPools = Object.keys(BONDS[ChainId.FANTOM]).map((key) => {
    return { ...BONDS[ChainId.FANTOM][key], lpToken: key }
  })

  const singlePools = bondingPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = bondingPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const summonerBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_BOND_ADDRESS,
  ])
  const summonerBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_BOND_ADDRESS,
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'fUSDT' ||
        token.symbol == 'FUSDT' ||
        token.symbol == 'MIM' ||
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
      if (
        token.symbol == 'USDC' || token.symbol == 'fUSDT' || token.symbol == 'DAI' ||
        token.symbol == 'FUSDT' || token.symbol == 'USDT' || token.symbol == 'MIM'
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
  const priceHelperContract = usePriceHelperContract()

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log(soulPrice)

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  // console.log(Number(rawLuxPrice))
  const luxPrice = Number(rawLuxPrice) / 1E18
  // console.log(luxPrice)

  const liquidityPools = Object.keys(POOLS[ChainId.FANTOM]).map((key) => {
    return { ...POOLS[ChainId.FANTOM][key], lpToken: key }
  })

  const singlePools = liquidityPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = liquidityPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const daoBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_DAO_ADDRESS[ChainId.FANTOM],
  ])
  const daoBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    SOUL_DAO_ADDRESS[ChainId.FANTOM],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'fUSDT' ||
        token.symbol == 'FUSDT' ||
        token.symbol == 'MIM' ||
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
      if (
        token.symbol == 'USDC' || token.symbol == 'fUSDT' || token.symbol == 'DAI' ||
        token.symbol == 'FUSDT' || token.symbol == 'USDT' || token.symbol == 'MIM'
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
    totalSupply,
    daoBalanceSingle,
    lpPools,
    singlePools,
  ])
}

export function useLuxTVL(): TVLInfo[] {
  const { chainId } = useActiveWeb3React()
  const priceHelperContract = usePriceHelperContract()

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log(soulPrice)

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  // console.log(Number(rawLuxPrice))
  const luxPrice = Number(rawLuxPrice) / 1E18
  // console.log(luxPrice)

  const liquidityPools = Object.keys(POOLS[ChainId.FANTOM]).map((key) => {
    return { ...POOLS[ChainId.FANTOM][key], lpToken: key }
  })

  const singlePools = liquidityPools.filter((r) => !r.token1)
  const singleAddresses = singlePools.map((r) => r.lpToken)
  const lpPools = liquidityPools.filter((r) => !!r.token1)
  const pairAddresses = lpPools.map((r) => r.lpToken)

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const totalSupply = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'totalSupply')
  const daoBalance = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'balanceOf', [
    LUX_TREASURY_ADDRESS[ChainId.FANTOM],
  ])
  const daoBalanceSingle = useMultipleContractSingleData(singleAddresses, PAIR_INTERFACE, 'balanceOf', [
    LUX_TREASURY_ADDRESS[ChainId.FANTOM],
  ])

  return useMemo(() => {
    function isKnownToken(token: TokenInfo) {
      return (
        token.id.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() ||
        token.symbol == 'SOUL' ||
        token.symbol == 'WFTM' ||
        token.symbol == 'LUX' ||
        token.symbol == 'FTM' ||
        token.symbol == 'SEANCE' ||
        token.symbol == 'USDC' ||
        token.symbol == 'fUSDT' ||
        token.symbol == 'FUSDT' ||
        token.symbol == 'MIM' ||
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
      if (
        token.symbol == 'USDC' || token.symbol == 'fUSDT' || token.symbol == 'DAI' ||
        token.symbol == 'FUSDT' || token.symbol == 'USDT' || token.symbol == 'MIM'
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
  const priceHelperContract = usePriceHelperContract()

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  // console.log('soul price:%s', soulPrice)

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  // console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice) / 1E18
  // console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice) / 1E18
  // console.log(seancePrice)

  const rawEthPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x74b23882a30290451A17c44f4F05243b6b58C76d'])?.result
  // console.log(Number(rawEthPrice))
  const ethPrice = Number(rawEthPrice) / 1E18
  // console.log(ethPrice)

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

  // const priceData = useContext(PriceContext)
  // const soulPrice = priceData?.['soul']
  // const ftmPrice = priceData?.['ftm']
  // const seancePrice = priceData?.['seance']

  return useMemo(() => {
    function isKnownToken(token: Token) {
      return (
        token.address.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() ||
        token.symbol == 'WFTM' || token.symbol == 'FTM' || token.symbol == 'SEANCE' || token.symbol == 'WETH' ||
        token.symbol == 'USDC' || token.symbol == 'fUSDT' || token.symbol == 'DAI'
      )
    }

    function getPrice(token: Token) {
      if (token.address.toLowerCase() == SOUL_ADDRESS[chainId].toLowerCase() || token.symbol == 'SOUL') {
        return soulPrice
      }
      if (token.symbol == 'WFTM' || token.symbol == 'FTM') {
        return ftmPrice
      }
      if (token.symbol == 'WETH' || token.symbol == 'ETH') {
        return ethPrice
      }
      if (token.symbol == 'SEANCE' || token.symbol == 'SEANCE') {
        return seancePrice
      }
      if (token.symbol == 'USDC' || token.symbol == 'fUSDT' || token.symbol == 'DAI') {
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
  }, [results, chainId, soulPrice, ftmPrice, seancePrice, tokens, totalSupply, ethPrice])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}
