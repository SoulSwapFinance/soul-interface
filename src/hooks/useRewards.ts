
import { useWeb3React } from '@web3-react/core'
import { SOUL_ADDRESS } from 'constants/addresses'
import { POOLS } from 'constants/farms'
import { usePrice, useSummonerInfo } from 'hooks'
import {ChainId} from 'sdk'

// export const useRewards = () => (pool: any) => {

// pool.owner = 'SoulSwap'
//   pool.balance = 0

//   const pair = POOLS[chainId][pool.lpToken]
//     const rewardPerSecond =
//       ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 1e18

//     const defaultReward = {
//       token: 'SOUL',
//       icon: '/images/token/soul.png',
//       rewardPerSecond,
//       rewardPerDay: rewardPerSecond * 86400,
//       rewardPrice: soulPrice,
//     }

//     const defaultRewards = [defaultReward]

//     return defaultRewards
//   }

// const useSeanceStakeManual = () => {

export const useRewards = (pool: any) => {
    const summonerInfo = useSummonerInfo() 
    const { chainId } = useWeb3React()    

    const soulPrice = usePrice(SOUL_ADDRESS[chainId])

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