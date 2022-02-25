import BigNumber from 'bignumber.js'
import { getPoolPrices, getToken } from 'state/farms/helpers'
import { getFarmApr } from './apr'

import soulSummonerAbi from 'constants/abis/soulswap/soulsummoner.json'
import {useMulticallContract} from 'hooks/useContract'

export const BIG_TEN = new BigNumber(10)

export function getParameterCaseInsensitive(object, key) {
  if (object instanceof Object && key) {
    return object[Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase())]
  }
  return undefined
}

export const getFarms = async (farmsToFetch, soulSummonerAddress, prices = {}, earningToken) => {
  const [[totalAllocPointsRes], [rewardsPerSecondRes]] = await useMulticallContract[chainId](soulSummonerAbi, [
    {
      address: soulSummonerAddress,
      name: 'totalAllocPoint',
    },
    {
      address: soulSummonerAddress,
      name: 'rewardPerSecond',
    },
  ])

  const totalAllocPoints = new BigNumber(totalAllocPointsRes._hex)
  const rewardsPerSecond = new BigNumber(rewardsPerSecondRes._hex).div(BIG_TEN.pow(18))

  const poolInfosFetch = await Promise.all(
    farmsToFetch.map(async (pool) => {
      const poolToken = await getToken(pool.lpAddress, soulSummonerAddress)

      return {
        ...pool,
        ...poolToken,
      }
    }),
  )

  const poolPrices = poolInfosFetch.map((poolInfo) => {
    return {
      ...getPoolPrices(prices, poolInfo),
      ...poolInfo,
    }
  })

  const earningTokenPrice = getParameterCaseInsensitive(prices, earningToken.address)

  const farmsInfo = poolPrices.map((farm) => {
    let stakedTvl = Number.isNaN(farm?.stakedTvl) ? 0 : farm?.stakedTvl ?? 0

    const apr = getFarmApr(totalAllocPoints, farm.allocPoint, rewardsPerSecond, earningTokenPrice, stakedTvl, farm.pid)

    prices[farm.lpAddress] = farm.price

    return {
      apr,
      mul: farm.allocPoint / 100,
      ...farm,
      earningTokenPrice: earningTokenPrice,
    }
  })

  return {
    prices,
    farms: farmsInfo,
  }
}
