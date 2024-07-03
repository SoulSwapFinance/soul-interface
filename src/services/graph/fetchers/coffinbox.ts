import { ChainId, CurrencyAmount, JSBI, Token } from 'sdk'
import { aprToApy, getFraction, toAmount, toAmountCurrencyAmount } from 'functions'
import { GRAPH_HOST } from 'services/graph/constants'
import { getTokenSubset } from 'services/graph/fetchers'
import {
  coffinBoxQuery,
  coffinStrategiesQuery,
  coffinTokensQuery,
  coffinUserTokensQuery,
  clonesQuery,
  underworldPairsQuery,
  underworldUserPairsQuery,
} from 'services/graph/queries/coffinbox'

import { pager } from './pager'

export const COFFINBOX = {
  [ChainId.FANTOM]: 'soulswapfinance/coffinbox',
  [ChainId.AVALANCHE]: 'soulswapfinance/coffinbox-avalanche'
}
const fetcher = async (chainId = ChainId.FANTOM, query, variables = undefined) =>
  // pager(`${GRAPH_HOST[chainId ?? ChainId.FANTOM]}/subgraphs/name/${COFFINBOX[chainId ?? ChainId.FANTOM]}`, query, variables)
  pager(`https://api.studio.thegraph.com/query/3838/coffinbox${chainId == ChainId.FANTOM ? `` : `-avalanche`}/version/latest`, query, variables)

export const getClones = async (chainId = ChainId.FANTOM) => {
  const { clones } = await fetcher(chainId, clonesQuery)
  return clones
}

export const getUnderworldPairs = async (chainId = ChainId.FANTOM, variables = undefined) => {
  const { underworldPairs } = await fetcher(chainId, underworldPairsQuery, variables)

  const tokens = await getTokenSubset(chainId, {
    tokenAddresses: Array.from(
      underworldPairs.reduce(
        (previousValue, currentValue) => previousValue.add(currentValue.asset.id, currentValue.collateral.id),
        new Set() // use set to avoid duplicates
      )
    ),
  })

  return underworldPairs.map((pair) => ({
    ...pair,
    token0: {
      ...pair.asset,
      ...tokens.find((token) => token.id === pair.asset.id),
    },
    token1: {
      ...pair.collateral,
      ...tokens.find((token) => token.id === pair.collateral.id),
    },
    assetAmount: Math.floor(pair.totalAssetBase / getFraction({ ...pair, token0: pair.asset })).toString(),
    borrowedAmount: toAmount(
      {
        elastic: pair.totalBorrowElastic.toBigNumber(0),
        base: pair.totalBorrowBase.toBigNumber(0),
      },
      pair.totalBorrowElastic.toBigNumber(0)
    ).toString(),
    collateralAmount: toAmount(
      {
        elastic: pair.collateral.totalSupplyElastic.toBigNumber(0),
        base: pair.collateral.totalSupplyBase.toBigNumber(0),
      },
      pair.totalCollateralShare.toBigNumber(0)
    ).toString(),
  }))
}

export const getUserUnderworldPairs = async (chainId = ChainId.FANTOM, variables) => {
  const { userUnderworldPairs } = await fetcher(chainId, underworldUserPairsQuery, variables)

  return userUnderworldPairs.map((userPair) => ({
    ...userPair,
    assetAmount: Math.floor(
      userPair.assetFraction / getFraction({ ...userPair.pair, token0: userPair.pair.asset })
    ).toString(),
    borrowedAmount: toAmount(
      {
        elastic: userPair.pair.totalBorrowElastic.toBigNumber(0),
        base: userPair.pair.totalBorrowBase.toBigNumber(0),
      },
      userPair.borrowPart.toBigNumber(0)
    ).toString(),
    collateralAmount: toAmount(
      {
        elastic: userPair.pair.collateral.totalSupplyElastic.toBigNumber(0),
        base: userPair.pair.collateral.totalSupplyBase.toBigNumber(0),
      },
      userPair.collateralShare.toBigNumber(0)
    ).toString(),
  }))
}

export const getCoffinUserTokens = async (chainId = ChainId.FANTOM, variables): Promise<CurrencyAmount<Token>[]> => {
  const { userTokens } = await fetcher(chainId, coffinUserTokensQuery, variables)
  return userTokens.map(({ share, token: { decimals, id, name, symbol, totalSupplyElastic, totalSupplyBase } }) => {
    return toAmountCurrencyAmount(
      {
        elastic: JSBI.BigInt(totalSupplyElastic),
        base: JSBI.BigInt(totalSupplyBase),
      },
      CurrencyAmount.fromRawAmount(new Token(chainId, id, Number(decimals), symbol, name), JSBI.BigInt(share))
    )
  })
}

export const getCoffinBox = async (chainId = ChainId.FANTOM, variables) => {
  const { coffinBoxes } = await fetcher(chainId, coffinBoxQuery, variables)

  return coffinBoxes[0]
}

export const getCoffinStrategies = async (chainId = ChainId.FANTOM, variables) => {
  const { strategies } = await fetcher(chainId, coffinStrategiesQuery, variables)

  const SECONDS_IN_YEAR = 60 * 60 * 24 * 365

  return strategies?.map((strategy) => {
    const apys = strategy.harvests?.reduce((apys, _, i) => {
      const [lastHarvest, previousHarvest] = [strategy.harvests?.[i], strategy.harvests?.[i + 1]]

      if (!previousHarvest) return apys

      const profitPerYear =
        ((SECONDS_IN_YEAR / (lastHarvest.timestamp - previousHarvest.timestamp)) * lastHarvest.profit) /
        10 ** strategy.token.decimals

      const [tvl, tvlPrevious] = [
        lastHarvest?.tokenElastic / 10 ** strategy.token.decimals,
        previousHarvest?.tokenElastic / 10 ** strategy.token.decimals,
      ]

      return [...apys, ((profitPerYear / ((tvl + tvlPrevious) / 2)) * 100) / 2]
    }, [])

    const apy = apys.reduce((apyAcc, apy) => apyAcc + apy, 0) / apys.length

    return {
      token: strategy.token.id,
      apy: !isNaN(apy) ? aprToApy(apy, 365) : 0,
      targetPercentage: Number(strategy.token.strategyTargetPercentage ?? 0),
      utilization: (Number(strategy.balance) / Number(strategy.token.totalSupplyElastic)) * 100,
    }
  })
}

export const getCoffinTokens = async (chainId = ChainId.FANTOM, variables) => {
  const { tokens } = await fetcher(chainId, coffinTokensQuery, variables)

  return tokens
}
