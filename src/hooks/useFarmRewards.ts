import { Chef, PairType } from '../features/summoner/enum'
import {
  useAverageBlockTime,
  useBlock,
  useEthPrice,
  useFarms,
  useKashiPairs,
//   useMasterChefV1SushiPerBlock,
//   useMasterChefV1TotalAllocPoint,
//   useMaticPrice,
//   useNativePrice,
//   useOnePrice,
//   useStakePrice,
  useSoulPairs,
  useSoulPrice,
} from '../services/graph'

import { ChainId } from '../sdk'
import { getAddress } from '@ethersproject/address'
import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'
import { usePositions } from '../features/summoner/hooks'
import { aprToApy } from '../functions/convert'

export default function useFarmRewards() {
  const { chainId } = useActiveWeb3React()

  // const positions = usePositions(chainId)
  const positions = usePositions()

  const block1w = useBlock({ daysAgo: 7, chainId })

//   const farms = useFarms({ chainId })
  const farms = useFarms()
  const farmAddresses = useMemo(() => farms.map((farm) => farm.pair), [farms])
  const swapPairs = useSoulPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })
  const swapPairs1w = useSoulPairs({
    subset: farmAddresses,
    block: block1w,
    shouldFetch: !!block1w && !!farmAddresses,
    chainId,
  })
  // const kashiPairs = useKashiPairs({ subset: farmAddresses, shouldFetch: !!farmAddresses, chainId })

  const averageBlockTime = useAverageBlockTime()

  const [soulPrice, ethPrice] = [
    useSoulPrice(),
    useEthPrice()
  ]

  const blocksPerDay = 86400 / Number(averageBlockTime)

  const map = (pool) => {
    // TODO: Deal with inconsistencies between properties on subgraph
    pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
    pool.balance = pool?.balance || pool?.slpBalance

    const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
    const swapPair1w = swapPairs1w?.find((pair) => pair.id === pool.pair)
    // const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

    const pair = swapPair // || kashiPair
    const pair1w = swapPair1w

    const type = swapPair ? PairType.SWAP : PairType.KASHI

    const blocksPerHour = 3600 / averageBlockTime

    function getRewards() {
      // TODO: Some subgraphs give soulPerBlock & soulPerSecond, and mcv2 gives nothing
      const soulPerBlock =
        pool?.owner?.soulPerBlock / 1e18 ||
        (pool?.owner?.soulPerSecond / 1e18) * averageBlockTime

      const rewardPerBlock = (pool.allocPoint / pool.owner.totalAllocPoint) * soulPerBlock

      const defaultReward = {
        token: 'SOUL',
        icon: 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/soul.jpg',
        rewardPerBlock,
        rewardPerDay: rewardPerBlock * blocksPerDay,
        rewardPrice: soulPrice,
      }

      let rewards = [defaultReward]

    //   if (pool.cheS
      return rewards
    }

    const rewards = getRewards()

    const balance = // swapPair ?
      Number(pool.balance / 1e18) // : pool.balance / 10 ** kashiPair.token0.decimals

    const tvl = 
        // swapPair ?
      (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
    //   : balance * kashiPair.token0.derivedETH * ethPrice

    const feeApyPerYear = swapPair
      ? aprToApy((((((pair?.volumeUSD - pair1w?.volumeUSD) * 0.0025) / 7) * 365) / pair?.reserveUSD) * 100, 3650) / 100
      : 0

    const feeApyPerMonth = feeApyPerYear / 12
    const feeApyPerDay = feeApyPerMonth / 30
    const feeApyPerHour = feeApyPerDay / blocksPerHour

    const roiPerBlock =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
      }, 0) / tvl

    const rewardAprPerHour = roiPerBlock * blocksPerHour
    const rewardAprPerDay = rewardAprPerHour * 24
    const rewardAprPerMonth = rewardAprPerDay * 30
    const rewardAprPerYear = rewardAprPerMonth * 12

    const roiPerHour = rewardAprPerHour + feeApyPerHour
    const roiPerMonth = rewardAprPerMonth + feeApyPerMonth
    const roiPerDay = rewardAprPerDay + feeApyPerDay
    const roiPerYear = rewardAprPerYear + feeApyPerYear

    // const position = positions.find((position) => position.id === pool.id && position.chef === pool.chef)
    const position = positions.find((position) => position.id === pool.id && position === pool.chef)

    return {
      ...pool,
      ...position,
      pair: {
        ...pair,
        decimals: pair.type === PairType.KASHI ? Number(pair.asset.tokenInfo.decimals) : 18,
        type,
      },
      balance,
      feeApyPerHour,
      feeApyPerDay,
      feeApyPerMonth,
      feeApyPerYear,
      rewardAprPerHour,
      rewardAprPerDay,
      rewardAprPerMonth,
      rewardAprPerYear,
      roiPerBlock,
      roiPerHour,
      roiPerDay,
      roiPerMonth,
      roiPerYear,
      rewards,
      tvl,
    }
  }

  return farms
    .filter((farm) => {
      return (
        (swapPairs && swapPairs.find((pair) => pair.id === farm.pair))
        // || (kashiPairs && kashiPairs.find((pair) => pair.id === farm.pair))
      )
    })
    .map(map)
}
