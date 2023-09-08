import { ChainId } from 'sdk'
import { toAmount } from 'functions'
import { GRAPH_HOST } from 'services/graph/constants'
import { getTokenSubset } from 'services/graph/fetchers'
import { underworldPairsQuery } from 'services/graph/queries/coffinbox'

import { getCoffinTokens } from './coffinbox'
import { pager } from './pager'

export const UNDERWORLD = {
  [ChainId.FANTOM]: 'soulswapfinance/fantom-underworld',
  [ChainId.AVALANCHE]: 'soulswapfinance/avalanche-underworld',
}

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (chainId = ChainId.ETHEREUM, query, variables = undefined) =>
  pager(`${GRAPH_HOST[chainId ?? ChainId.FANTOM]}/subgraphs/name/${UNDERWORLD[chainId ?? ChainId.FANTOM]}`, query, variables)

export const getUnderworldPairs = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const { underworldPairs } = await fetcher(chainId, underworldPairsQuery, variables)

  const tokenAddresses = Array.from(
    underworldPairs.reduce(
      // @ts-ignore TYPE NEEDS FIXING
      (previousValue, currentValue) => previousValue.add(currentValue.asset, currentValue.collateral),
      new Set() // use set to avoid duplicates
    )
  )

  const coffinBoxTokens = await getCoffinTokens(chainId, {
    tokenAddresses,
  })

  const exchangeTokens = await getTokenSubset(chainId, {
    tokenAddresses,
  })

  try {
    // @ts-ignore TYPE NEEDS FIXING
    return underworldPairs.map((pair) => {
      // @ts-ignore TYPE NEEDS FIXING
      const asset = coffinBoxTokens.find((token) => token.id === pair.asset)
      // @ts-ignore TYPE NEEDS FIXING
      const collateral = coffinBoxTokens.find((token) => token.id === pair.collateral)
      return {
        ...pair,
        asset: {
          ...pair.asset,
          // @ts-ignore TYPE NEEDS FIXING
          ...coffinBoxTokens.find((token) => token.id === pair.asset),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.asset),
        },
        collateral: {
          ...pair.collateral,
          // @ts-ignore TYPE NEEDS FIXING
          ...coffinBoxTokens.find((token) => token.id === pair.collateral),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.collateral),
        },
        token0: {
          ...pair.asset,
          // @ts-ignore TYPE NEEDS FIXING
          ...coffinBoxTokens.find((token) => token.id === pair.asset),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.asset),
        },
        token1: {
          ...pair.collateral,
          // @ts-ignore TYPE NEEDS FIXING
          ...coffinBoxTokens.find((token) => token.id === pair.collateral),
          // @ts-ignore TYPE NEEDS FIXING
          ...exchangeTokens.find((token) => token.id === pair.collateral),
        },
        assetAmount: Math.floor(
          pair.totalAssetBase /
            (pair.totalAssetBase /
              (Number(pair.totalAssetElastic) + (pair.totalBorrowElastic * asset.rebase.base) / asset.rebase.elastic))
        ).toString(),
        borrowedAmount: toAmount(
          {
            elastic: pair.totalBorrowElastic.toBigNumber(0),
            base: pair.totalBorrowBase.toBigNumber(0),
          },
          pair.totalBorrowElastic.toBigNumber(0)
        ).toString(),
        collateralAmount: toAmount(
          {
            elastic: collateral.rebase.elastic.toBigNumber(0),
            base: collateral.rebase.base.toBigNumber(0),
          },
          pair.totalCollateralShare.toBigNumber(0)
        ).toString(),
      }
    })
  } catch (error) {
    console.log(error)
  }
}