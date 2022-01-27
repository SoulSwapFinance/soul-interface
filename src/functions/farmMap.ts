
import { POOLS } from 'constants/farms'
import { usePrice, useSummonerInfo } from 'hooks'
import { ChainId, SOUL_ADDRESS } from 'sdk'

export const farmMap = (chainId: ChainId) => (pool: any) => {
  pool.owner = 'SoulSwap'
  pool.balance = 0
  const soulPrice = usePrice(SOUL_ADDRESS[chainId])
  const pair = POOLS[chainId][pool.lpToken]
  const summonerInfo = useSummonerInfo()

  function getRewards() {
    const rewardPerSecond =
      ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 1e18

    const defaultReward = {
      token: 'SOUL',
      icon: '/images/token/soul.png',
      rewardPerSecond,
      rewardPerDay: rewardPerSecond * 86400,
      rewardPrice: soulPrice,
    }

    const defaultRewards = [defaultReward]

    return defaultRewards
  }

  const rewards = getRewards()

//   // const tvl = getTvl()
//   const tvl = pool.pair?.token1
//   ? Number(pool.pairPrice) * Number(pool.lpBalance) / 1e18
//   : Number(soulPrice) * Number(pool.lpBalance) / 1e18

//   const rewardPerSec =
//     ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 1e18

//   const rewardPrice = soulPrice

//   const roiPerSecond =
//     farms.reduce((previousValue, currentValue) => {
//       return previousValue + rewardPerSec * rewardPrice
//     }, 0) / Number(tvl)

//   // const roiPerSecond = Number(tvl)
//   const roiPerHour = roiPerSecond * 60 * 60
//   const roiPerDay = roiPerHour * 24
//   const roiPerMonth = roiPerDay * 30
//   const roiPerYear = roiPerDay * 365

//   const position = positions.find((position) => position.id === pool.id)

  return {
    ...pool,
    // ...position,
    allocPointNumber: pool.allocPoint?.toNumber ? pool.allocPoint.toNumber() : pool.allocPoint || 0,
    pair: {
      ...pair,
      decimals: 18,
    },
    // roiPerSecond,
    // roiPerHour,
    // roiPerDay,
    // roiPerMonth,
    // roiPerYear,
    rewards,
    // tvl,
    // secondsPerHour,
  }
}