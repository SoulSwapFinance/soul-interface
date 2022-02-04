import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Fraction } from 'entities/bignumber/Fraction'
import { POOL_DENY } from '../constants'
import orderBy from 'lodash/orderBy'
import range from 'lodash/range'
import soulData from '@soulswap/soul-data'
import { useActiveWeb3React } from 'services/web3'
import { useSoulGuideContract } from './useContract'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useZapperFarms = () => {
  const [farms, setFarms] = useState<any | undefined>()
  const { account } = useActiveWeb3React()
  const soulGuideContract = useSoulGuideContract()

  const fetchAllFarms = useCallback(async () => {
    let [pools, liquidityPositions, averageBlockTime, soulPrice, underworldPairs, soulPairs, masterChef] = await Promise.all(
      [
        soulData.masterchef.pools(), // results[1]
        soulData.exchange.userPositions({
          user_address: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
        }), // results[1]
        soulData.utils.getAverageBlockTime(), // results[2]
        soulData.soul.priceUSD(), // results[3]
        soulData.bentobox.kashiStakedInfo(), // results[4]
        soulData.exchange.pairs(), // results[5]
        soulData.masterchef.info(), // results[6]
      ]
    )

    const pairAddresses = pools
      .map((pool) => {
        return pool.pair
      })
      .sort()

    underworldPairs = underworldPairs.filter((result) => result !== undefined) // filter out undefined (not in onsen) from all underworldPairs
    soulPairs = soulPairs.filter((pair) => pairAddresses.includes(pair.id))

    const UNDERWORLD_PAIRS = range(190, 230, 1) // underworldPair pids 189-229

    const farms = pools
      .filter((pool: any) => {
        // console.log(UNDERWORLD_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
        return (
          !POOL_DENY.includes(pool?.id) &&
          (soulPairs.find((pair: any) => pair?.id === pool?.pair) || UNDERWORLD_PAIRS.includes(Number(pool?.id)))
        )
      })
      .map((pool) => {
        if (UNDERWORLD_PAIRS.includes(Number(pool?.id))) {
          const pair = underworldPairs.find((pair) => pair?.id === pool?.pair)
          // console.log('kpair:', pair, pool)
          return {
            ...pool,
            ...pair,
            type: 'KMP',
            pid: Number(pool.id),
            pairAddress: pair?.id,
            pairSymbol: pair?.symbol,
            liquidityPair: {
              token0: {
                id: pair?.collateral,
                symbol: pair?.collateralSymbol,
                decimals: pair?.collateralDecimals,
              },
              token1: {
                id: pair?.asset,
                symbol: pair?.assetSymbol,
                decimals: pair?.assetDecimals,
              },
            },
            roiPerYear: pair?.roiPerYear,
            totalAssetStaked: pair?.totalAssetStaked ? pair?.totalAssetStaked / Math.pow(10, pair?.assetDecimals) : 0,
            tvl: pair?.balanceUSD ? pair?.balanceUSD : 0,
          }
        } else {
          const pair = soulPairs.find((pair) => pair.id === pool.pair)
          const liquidityPosition = liquidityPositions.find(
            (liquidityPosition: any) => liquidityPosition.pair.id === pair.id
          )
          const secondsPerHour = 3600
          const balance = Number(pool.slpBalance / 1e18) > 0 ? Number(pool.slpBalance / 1e18) : 0.1
          const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
          const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
          const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
          const rewardPerSecond = ((pool.allocPoint / masterChef.totalAllocPoint) * masterChef.soulPerSecond) / 1e18
          const roiPerSecond = (rewardPerSecond * soulPrice) / balanceUSD
          const roiPerHour = roiPerSecond * secondsPerHour
          const roiPerDay = roiPerHour * 24
          const roiPerMonth = roiPerDay * 30
          const roiPerYear = roiPerMonth * 12

          return {
            ...pool,
            type: 'SLP',
            symbol: pair.token0.symbol + '-' + pair.token1.symbol,
            name: pair.token0.name + ' ' + pair.token1.name,
            pid: Number(pool.id),
            pairAddress: pair.id,
            slpBalance: pool.slpBalance,
            liquidityPair: pair,
            roiPerSecond,
            roiPerHour,
            roiPerDay,
            roiPerMonth,
            roiPerYear,
            rewardPerThousand: 1 * roiPerDay * (1000 / soulPrice),
            tvl: liquidityPosition?.liquidityTokenBalance
              ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
              : 0.1,
          }
        }
      })

    // console.log('farms:', farms)
    const sorted = orderBy(farms, ['pid'], ['desc'])

    const pids = sorted.map((pool) => {
      return pool.pid
    })

    if (account) {
      const userFarmDetails = await soulGuideContract?.pollPools(account, pids)
      // console.log('userFarmDetails:', userFarmDetails)
      const userFarms = userFarmDetails
        .filter((farm: any) => {
          return farm.balance.gt(BigNumber.from(0)) || farm.pending.gt(BigNumber.from(0))
        })
        .map((farm: any) => {
          // console.log('userFarm:', farm.pid.toNumber(), farm)

          const pid = farm.pid.toNumber()
          const farmDetails: any = sorted.find((pair: any) => pair.pid === pid)

          let deposited
          let depositedUSD
          if (farmDetails && farmDetails.type === 'KMP') {
            deposited = Fraction.from(
              farm.balance,
              BigNumber.from(10).pow(farmDetails.liquidityPair.asset.decimals)
            ).toString()
            depositedUSD =
              farmDetails.totalAssetStaked && farmDetails.totalAssetStaked > 0
                ? (Number(deposited) * Number(farmDetails.tvl)) / farmDetails.totalAssetStaked
                : 0
          } else {
            deposited = Fraction.from(farm.balance, BigNumber.from(10).pow(18)).toString(18)
            depositedUSD =
              farmDetails.slpBalance && Number(farmDetails.slpBalance / 1e18) > 0
                ? (Number(deposited) * Number(farmDetails.tvl)) / (farmDetails.slpBalance / 1e18)
                : 0
          }
          const pending = Fraction.from(farm.pending, BigNumber.from(10).pow(18)).toString(18)

          return {
            ...farmDetails,
            type: farmDetails.type, // KMP or SLP
            depositedLP: deposited,
            depositedUSD: depositedUSD,
            pendingSoul: pending,
          }
        })
      setFarms({ farms: sorted, userFarms: userFarms })
      // console.log('userFarms:', userFarms)
    } else {
      setFarms({ farms: sorted, userFarms: [] })
    }
  }, [account, soulGuideContract])

  useEffect(() => {
    fetchAllFarms()
  }, [fetchAllFarms])

  return farms
}

export default useZapperFarms
