import { getAddress } from '@ethersproject/address'
import { ChainId, Currency, NATIVE, SOUL_ADDRESS, Token } from 'sdk'
import { useSummonerInfo } from 'hooks/useSummonerInfo'
import { usePositions } from 'hooks/usePositions'
import { Chef, PairType } from 'features/mines/enum'
// import { usePositions } from 'features/mines/hooks'
import { aprToApy } from 'functions/convert'
import {
    useAverageBlockTime,
    useEthPrice,
    useFantomPrice,
    // useFarms,
    useUnderworldPairs,
    useOneDayBlock,
    useSoulPrice,
    useSoulPairs,
} from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'
import { useSoulSummonerContract } from 'hooks'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import zip from 'lodash/zip'
import { Contract } from '@ethersproject/contracts'

export function useSoulFarms(contract?: Contract | null) {
    const { chainId, account } = useActiveWeb3React()
  
    const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)?.result?.[0]
  
    const args = useMemo(() => {
      if (!numberOfPools) {
        return
      }
      return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid)])
    }, [numberOfPools])
  
    const poolInfo = useSingleContractMultipleData(args ? contract : null, 'poolInfo', args)
  
    return useMemo(() => {
      if (!poolInfo) {
        return []
      }
      return zip(poolInfo).map((data, i) => ({
        id: args[i][0],
        lpToken: data[0].result?.['lpToken'] || '',
        allocPoint: data[0].result?.['allocPoint'] || '',
        lastRewardTime: data[0].result?.['lastRewardTime'] || '',
        accSoulPerShare: data[0].result?.['accSoulPerShare'] || '',
        totalLp: data[0].result?.['totalLp'] || '',
      }))
    }, [args, poolInfo])
  }

  
export function useFarms() {
    return useSoulFarms(useSoulSummonerContract())
  }

  
export default function useFarmRewards() {
    const { chainId } = useActiveWeb3React()

    const positions = usePositions()
    const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })

    const farms = useFarms()

    const farmAddresses = useMemo(() => farms.map((farm) => farm.lpToken), [farms])

    const swapPairs = useSoulPairs({
        chainId,
        variables: {
            where: {
                id_in: farmAddresses.map(toLower),
            },
        },
        shouldFetch: !!farmAddresses,
    })

    const swapPairs1d = useSoulPairs({
        chainId,
        variables: {
            block: block1d,
            where: {
                id_in: farmAddresses.map(toLower),
            },
        },
        shouldFetch: !!block1d && !!farmAddresses,
    })

    const kashiPairs = useUnderworldPairs({
        chainId,
        variables: { where: { id_in: farmAddresses.map(toLower) } },
        shouldFetch: !!farmAddresses,
    })

    const averageBlockTime = useAverageBlockTime({ chainId })

    const [
        soulPrice,
        ethPrice,
        fantomPrice,

    ] = [
            useSoulPrice(),
            useEthPrice(),
            useFantomPrice(),
        ]

    const blocksPerDay = 86400 / Number(averageBlockTime)

    // @ts-ignore TYPE NEEDS FIXING
    const map = (pool) => {
        // TODO: Deal with inconsistencies between properties on subgraph
        pool.owner = pool?.owner || pool?.masterChef || pool?.miniChef
        pool.balance = pool?.balance || pool?.slpBalance

        // @ts-ignore TYPE NEEDS FIXING
        const swapPair = swapPairs?.find((pair) => pair.id === pool.pair)
        // @ts-ignore TYPE NEEDS FIXING
        const swapPair1d = swapPairs1d?.find((pair) => pair.id === pool.pair)
        // @ts-ignore TYPE NEEDS FIXING
        // const kashiPair = kashiPairs?.find((pair) => pair.id === pool.pair)

        const pair = swapPair || kashiPair

        const type = swapPair ? PairType.SWAP : PairType.KASHI

        const blocksPerHour = 3600 / averageBlockTime

        function getRewards() {
            // TODO: Some subgraphs give soulPerBlock & soulPerSecond, and mcv2 gives nothing
            const soulPerBlock =
                pool?.owner?.soulPerBlock / 1e18 ||
                (pool?.owner?.soulPerSecond / 1e18) * averageBlockTime

            // @ts-ignore TYPE NEEDS FIXING
            const rewardPerBlock = (pool.allocPoint / pool.owner.totalAllocPoint) * soulPerBlock

            const defaultReward = {
                currency: SOUL_ADDRESS[ChainId.MAINNET],
                rewardPerBlock,
                rewardPerDay: rewardPerBlock * blocksPerDay,
                rewardPrice: soulPrice,
            }

            let rewards: { currency: Currency; rewardPerBlock: number; rewardPerDay: number; rewardPrice: number }[] = [
                // @ts-ignore TYPE NEEDS FIXING
                defaultReward,
            ]

            if (pool.chef === Chef.MASTERCHEF_V2) {
                // override for mcv2...
                // pool.owner.totalAllocPoint = masterChefV1TotalAllocPoint

                // CVX-WETH hardcode 0 rewards since ended, can remove after swapping out rewarder
                if (pool.id === '1') {
                    pool.rewarder.rewardPerSecond = 0
                }

                // vestedQUARTZ to QUARTZ adjustments
                if (pool.rewarder.rewardToken === '0x5dd8905aec612529361a35372efd5b127bb182b3') {
                    pool.rewarder.rewardToken = '0xba8a621b4a54e61c442f5ec623687e2a942225ef'
                    pool.rewardToken.id = '0xba8a621b4a54e61c442f5ec623687e2a942225ef'
                    pool.rewardToken.symbol = 'vestedQUARTZ'
                    pool.rewardToken.derivedETH = pair.token1.derivedETH
                    pool.rewardToken.decimals = 18
                }

                const decimals = 10 ** pool.rewardToken.decimals

                if (pool.rewarder.rewardToken !== '0x0000000000000000000000000000000000000000') {
                    const rewardPerBlock =
                        pool.rewardToken.symbol === 'ALCX'
                            ? pool.rewarder.rewardPerSecond / decimals
                            : pool.rewardToken.symbol === 'LDO'
                                ? (77160493827160493 / decimals) * averageBlockTime
                                : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime

                    const rewardPerDay =
                        pool.rewardToken.symbol === 'ALCX'
                            ? (pool.rewarder.rewardPerSecond / decimals) * blocksPerDay
                            : pool.rewardToken.symbol === 'LDO'
                                ? (77160493827160493 / decimals) * averageBlockTime * blocksPerDay
                                : (pool.rewarder.rewardPerSecond / decimals) * averageBlockTime * blocksPerDay

                    const rewardPrice = pool.rewardToken.derivedETH * ethPrice

                    const reward = {
                        currency: new Token(
                            ChainId.MAINNET,
                            getAddress(pool.rewardToken.id),
                            Number(pool.rewardToken.decimals),
                            pool.rewardToken.symbol,
                            pool.rewardToken.name
                        ),
                        rewardPerBlock,
                        rewardPerDay,
                        rewardPrice,
                    }
                    rewards[1] = reward
                }
            } else if (pool.chef === Chef.MINICHEF) {
                const soulPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.soulPerSecond) / 1e18
                const soulPerBlock = soulPerSecond * averageBlockTime
                const soulPerDay = soulPerBlock * blocksPerDay
                const summonerInfo = useSummonerInfo()

                const rewardPerSecond =
                    ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 1e18

                // const rewardPerSecond =
                //   pool.rewarder.rewardPerSecond && chainId === ChainId.ARBITRUM
                //     ? pool.rewarder.rewardPerSecond / 1e18
                //     : ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

                const rewardPerBlock = rewardPerSecond * averageBlockTime

                const rewardPerDay = rewardPerBlock * blocksPerDay

                const reward = {
                    //   [ChainId.MATIC]: {
                    //     currency: NATIVE[ChainId.MATIC],
                    //     rewardPerBlock,
                    //     rewardPerDay: rewardPerSecond * 86400,
                    //     rewardPrice: maticPrice,
                    //   },
                    //   [ChainId.XDAI]: {
                    //     currency: XDAI_TOKENS.GNO,
                    //     rewardPerBlock,
                    //     rewardPerDay: rewardPerSecond * 86400,
                    //     rewardPrice: gnoPrice,
                    //   },
                    //   [ChainId.HARMONY]: {
                    //     currency: NATIVE[ChainId.HARMONY],
                    //     rewardPerBlock,
                    //     rewardPerDay: rewardPerSecond * 86400,
                    //     rewardPrice: onePrice,
                    //   },
                    //   [ChainId.CELO]: {
                    //     currency: NATIVE[ChainId.CELO],
                    //     rewardPerBlock,
                    //     rewardPerDay: rewardPerSecond * 86400,
                    //     rewardPrice: celoPrice,
                    //   },
                    //   [ChainId.MOONRIVER]: {
                    //     currency: NATIVE[ChainId.MOONRIVER],
                    //     rewardPerBlock,
                    //     rewardPerDay: rewardPerSecond * 86400,
                    //     rewardPrice: movrPrice,
                    //   },
                    //   [ChainId.FUSE]: {
                    //     currency: NATIVE[ChainId.FUSE],
                    //     rewardPerBlock,
                    //     rewardPerDay: rewardPerSecond * 86400,
                    //     rewardPrice: fusePrice,
                    //   },
                    [ChainId.FANTOM]: {
                        currency: NATIVE[ChainId.FANTOM],
                        rewardPerBlock,
                        rewardPerDay: rewardPerSecond * 86400,
                        rewardPrice: fantomPrice,
                    },
                }

                // if (chainId === ChainId.FUSE) {b

                // if (chainId === ChainId.ARBITRUM && ['9', '11'].includes(pool.id)) {
                //   rewards[1] = {
                //     currency: ARBITRUM_TOKENS.SPELL,
                //     rewardPerBlock,
                //     rewardPerDay,
                //     rewardPrice: spellPrice,
                //   }
                // }
                // if (chainId === ChainId.ARBITRUM && ['12'].includes(pool.id)) {
                //   rewards[1] = {
                //     currency: ARBITRUM_TOKENS.gOHM,
                //     rewardPerBlock,
                //     rewardPerDay,
                //     rewardPrice: ohmPrice,
                //   }
                // }
                // if (chainId === ChainId.ARBITRUM && ['13'].includes(pool.id)) {
                //   rewards[1] = {
                //     currency: ARBITRUM_TOKENS.MAGIC,
                //     rewardPerBlock,
                //     rewardPerDay,
                //     rewardPrice: magicPrice,
                //   }
                // }
                // if (chainId === ChainId.MATIC && ['47'].includes(pool.id)) {
                //   const rewardTokenPerSecond = 0.00000462962963
                //   const rewardTokenPerBlock = rewardTokenPerSecond * averageBlockTime
                //   const rewardTokenPerDay = 0.4
                //   rewards[1] = {
                //     currency: MATIC_TOKENS.gOHM,
                //     rewardPerBlock: rewardTokenPerBlock,
                //     rewardPerDay: rewardTokenPerDay,
                //     rewardPrice: ohmPrice,
                //   }
                // }
            } else if (pool.chef === Chef.OLD_FARMS) {
                const soulPerSecond = ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.miniChef.soulPerSecond) / 1e18
                const soulPerBlock = soulPerSecond * averageBlockTime
                const soulPerDay = soulPerBlock * blocksPerDay

                const rewardPerSecond =
                    //   pool.rewarder.rewardPerSecond && chainId === ChainId.ARBITRUM
                    //     ? pool.rewarder.rewardPerSecond / 1e18
                    //     : 
                    ((pool.allocPoint / pool.miniChef.totalAllocPoint) * pool.rewarder.rewardPerSecond) / 1e18

                const rewardPerBlock = rewardPerSecond * averageBlockTime

                const rewardPerDay = rewardPerBlock * blocksPerDay

                // const reward = {
                //   [ChainId.CELO]: {
                //     currency: NATIVE[ChainId.CELO],
                //     rewardPerBlock,
                //     rewardPerDay: rewardPerSecond * 86400,
                //     rewardPrice: celoPrice,
                //   },
                // }

                // @ts-ignore TYPE NEEDS FIXING
                rewards[0] = {
                    ...defaultReward,
                    rewardPerBlock: soulPerBlock,
                    rewardPerDay: soulPerDay,
                }

                // @ts-ignore TYPE NEEDS FIXING
                if (chainId in reward) {
                    // @ts-ignore TYPE NEEDS FIXING
                    rewards[1] = reward[chainId]
                }
            }

            return rewards
        }

        const rewards = getRewards()
        const balance = Number(pool.balance / 1e18)
        const tvl = (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)


        // const balance = swapPair ? Number(pool.balance / 1e18) : pool.balance / 10 ** kashiPair.token0.decimals

        // const tvl =
        // swapPair
        //   ? (balance / Number(swapPair.totalSupply)) * Number(swapPair.reserveUSD)
        //   : balance * kashiPair.token0.derivedETH * ethPrice

        const feeApyPerYear =
            swapPair && swapPair1d
                ? aprToApy((((pair?.volumeUSD - swapPair1d?.volumeUSD) * 0.0025 * 365) / pair?.reserveUSD) * 100, 3650) / 100
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

        const position = positions.find((position) => position.id === pool.id)
        // const position = positions.find((position) => position.id === pool.id && position.chef === pool.chef)

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
                // @ts-ignore TYPE NEEDS FIXING
                (swapPairs && swapPairs.find((pair) => pair.id === farm.pair)) ||
                // @ts-ignore TYPE NEEDS FIXING
                (kashiPairs && kashiPairs.find((pair) => pair.id === farm.pair))
            )
        })
        .map(map)
}