// import { getAddress } from '@ethersproject/address'
// import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, Currency, CurrencyAmount, Fraction, JSBI, Pair, Price, Token, TokenAmount } from 'sdk'
import { useMemo } from 'react'

// import { ZERO_ADDRESS } from 'constants/index'
// import { EVM_NETWORK } from 'constants/networks'
import { NativeCurrencies } from 'constants/tokens'
// import { useActiveWeb3React } from 'hooks'
// import { useAllTokens } from 'hooks/Tokens'
// import { useBlockNumber } from 'state/application/hooks'
// import { useRewardTokens } from 'state/farms/classic/hooks'
// import { Farm, RewardPerTimeUnit } from 'state/farms/classic/types'
// import { SubgraphPoolData, UserLiquidityPosition } from 'state/pools/hooks'
// import { tryParseAmount } from 'state/swap/hooks'
// import { useTokenPrices } from 'state/tokenPrices/hooks'
// import { formattedNum } from 'utils'
import { isTokenNative } from 'utils/tokenInfo'
// import { unwrappedToken } from 'utils/wrappedCurrency'
// import { formatNumber } from 'functions/format'
// import { tryParseAmount } from 'state/order/hooks'

export function priceRangeCalc(
  price?: Price<Currency, Currency> | Fraction,
  amp?: Fraction,
): [Fraction | undefined, Fraction | undefined] {
  //Ex amp = 1.23456
  if (amp && (amp.equalTo(JSBI.BigInt(1)) || amp?.equalTo(JSBI.BigInt(0)))) return [undefined, undefined]
  const temp = amp?.divide(amp?.subtract(JSBI.BigInt(1)))
  if (!amp || !temp || !price) return [undefined, undefined]
  if (price instanceof Price) {
    return [
      price.asFraction.multiply(price.scalar).multiply(temp.multiply(temp)),
      price.asFraction.multiply(price.scalar).divide(temp.multiply(temp)),
    ]
  }
  return [price.asFraction.multiply(temp.multiply(temp)), price?.divide(temp.multiply(temp))]
}

// export function parseSubgraphPoolData(
//   poolData: SubgraphPoolData,
//   chainId: ChainId,
// ): {
//   reserve0: CurrencyAmount<Currency> | undefined
//   virtualReserve0: CurrencyAmount<Currency> | undefined
//   reserve1: CurrencyAmount<Currency> | undefined
//   virtualReserve1: CurrencyAmount<Currency> | undefined
//   totalSupply: CurrencyAmount<Currency> | undefined
//   currency0: Currency
//   currency1: Currency
// } {
//   const token0 = new Token(
//     chainId,
//     getAddress(poolData.token0.id),
//     +poolData.token0.decimals,
//     poolData.token0.symbol,
//     poolData.token0.name,
//   )
//   const token1 = new Token(
//     chainId,
//     getAddress(poolData.token1.id),
//     +poolData.token1.decimals,
//     poolData.token1.symbol,
//     poolData.token1.name,
//   )
//   const currency0 = unwrappedToken(token0)
//   const currency1 = unwrappedToken(token1)

//   const reserve0 = tryParseAmount(poolData.reserve0, currency0)
//   const virtualReserve0 = tryParseAmount(poolData.vReserve0, currency0)
//   const reserve1 = tryParseAmount(poolData.reserve1, currency1)
//   const virtualReserve1 = tryParseAmount(poolData.vReserve1, currency1)
//   const totalSupply = tryParseAmount(poolData.totalSupply, NativeCurrencies[chainId]) // Only care about decimals 18

//   return {
//     reserve0,
//     virtualReserve0,
//     reserve1,
//     virtualReserve1,
//     totalSupply,
//     currency0,
//     currency1,
//   }
// }

// const temp = pool.virtualReserve1.subtract(pool.reserve1).divide(pool.reserve1.decimalScale).asFraction

export const feeRangeCalc = (amp: number): string => {
  let baseFee = 0
  if (amp > 20) baseFee = 4
  if (amp <= 20 && amp > 5) baseFee = 10
  if (amp <= 5 && amp > 2) baseFee = 20
  if (amp <= 2) baseFee = 30

  return `${(baseFee / 2 / 100).toPrecision()}% - ${((baseFee * 2) / 100).toPrecision()}%`
}

export const getTradingFeeAPR = (liquidity?: string, feeOneDay?: string): number => {
  return !feeOneDay || !liquidity || parseFloat(liquidity) === 0
    ? 0
    : (parseFloat(feeOneDay) * 365 * 100) / parseFloat(liquidity)
}

// const DEFAULT_MY_LIQUIDITY = '-'

// export const getMyLiquidity = (
//   liquidityPosition?: UserLiquidityPosition,
//   defaultValue = DEFAULT_MY_LIQUIDITY,
// ): string | 0 => {
//   if (!liquidityPosition || parseFloat(liquidityPosition.pool.totalSupply) === 0) {
//     return defaultValue
//   }

//   const myLiquidity =
//     (parseFloat(liquidityPosition.liquidityTokenBalance) * parseFloat(liquidityPosition.pool.reserveUSD)) /
//     parseFloat(liquidityPosition.pool.totalSupply)

//   if (myLiquidity === 0) {
//     return defaultValue
//   }

//   return formatNumber(myLiquidity, false, true).toString()
// }

// function useFarmRewardsPerTimeUnit(farm?: Farm): RewardPerTimeUnit[] {
//   if (!farm) {
//     return []
//   }

//   const farmRewardsPerTimeUnit: RewardPerTimeUnit[] = []

//   if (farm.rewardPerSeconds) {
//     farm.rewardTokens.forEach((token, index) => {
//       if (farmRewardsPerTimeUnit[index]) {
//         farmRewardsPerTimeUnit[index].amount = farmRewardsPerTimeUnit[index].amount.add(
//           BigNumber.from(farm.rewardPerSeconds[index]),
//         )
//       } else {
//         farmRewardsPerTimeUnit[index] = {
//           token,
//           amount: BigNumber.from(farm.rewardPerSeconds[index]),
//         }
//       }
//     })
//   } else if (farm.rewardPerBlocks) {
//     farm.rewardTokens.forEach((token, index) => {
//       if (farmRewardsPerTimeUnit[index]) {
//         farmRewardsPerTimeUnit[index].amount = farmRewardsPerTimeUnit[index].amount.add(
//           BigNumber.from(farm.rewardPerBlocks[index]),
//         )
//       } else {
//         farmRewardsPerTimeUnit[index] = {
//           token,
//           amount: BigNumber.from(farm.rewardPerBlocks[index]),
//         }
//       }
//     })
//   }

//   return farmRewardsPerTimeUnit
// }

/**
 * Get farm APR value in %
 * @param kncPriceUsd KNC price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
// export function useFarmApr(farm: Farm, poolLiquidityUsd: string): number {
//   const { chainId } = useActiveWeb3React()
//   const currentBlock = useBlockNumber()
//   const rewardsPerTimeUnit = useFarmRewardsPerTimeUnit(farm)
//   const tokenPrices = useTokenPrices((rewardsPerTimeUnit || []).map(item => item.token.wrapped.address))

//   let yearlyRewardUSD

//   if (farm.rewardPerSeconds) {
//     // FarmV2

//     const currentTimestamp = Math.floor(Date.now() / 1000)

//     // Check if pool is active for liquidity mining
//     const isLiquidityMiningActive =
//       currentTimestamp && farm.startTime && farm.endTime
//         ? farm.startTime <= currentTimestamp && currentTimestamp <= farm.endTime
//         : false

//     if (parseFloat(poolLiquidityUsd) === 0 || !isLiquidityMiningActive) {
//       return 0
//     }

//     if (!rewardsPerTimeUnit || rewardsPerTimeUnit.length === 0) {
//       return 0
//     }

//     yearlyRewardUSD = rewardsPerTimeUnit.reduce((total, rewardPerSecond) => {
//       if (!rewardPerSecond || !rewardPerSecond.amount) {
//         return total
//       }

//       if (chainId && tokenPrices[rewardPerSecond.token.wrapped.address]) {
//         const rewardPerSecondAmount = TokenAmount.fromRawAmount(
//           rewardPerSecond.token,
//           rewardPerSecond.amount.toString(),
//         )
//         const yearlyETHRewardAllocation = parseFloat(rewardPerSecondAmount.toSignificant(6)) * SECONDS_PER_YEAR
//         total += yearlyETHRewardAllocation * tokenPrices[rewardPerSecond.token.wrapped.address]
//       }

//       return total
//     }, 0)
//   } else {
//     // Check if pool is active for liquidity mining
//     const isLiquidityMiningActive =
//       currentBlock && farm.startBlock && farm.endBlock
//         ? farm.startBlock <= currentBlock && currentBlock <= farm.endBlock
//         : false

//     if (parseFloat(poolLiquidityUsd) === 0 || !isLiquidityMiningActive) {
//       return 0
//     }

//     if (!rewardsPerTimeUnit || rewardsPerTimeUnit.length === 0) {
//       return 0
//     }

//     yearlyRewardUSD = rewardsPerTimeUnit.reduce((total, rewardPerBlock, index) => {
//       if (!rewardPerBlock || !rewardPerBlock.amount) {
//         return total
//       }

//       if (isEVM && tokenPrices[index]) {
//         const rewardPerBlockAmount = TokenAmount.fromRawAmount(rewardPerBlock.token, rewardPerBlock.amount.toString())
//         const yearlyETHRewardAllocation =
//           parseFloat(rewardPerBlockAmount.toSignificant(6)) * BLOCKS_PER_YEAR(chainId as EVM_NETWORK)
//         total += yearlyETHRewardAllocation * tokenPrices[index]
//       }

//       return total
//     }, 0)
//   }

//   const apr = (yearlyRewardUSD / parseFloat(poolLiquidityUsd)) * 100

//   return apr
// }

export function useCurrencyConvertedToNative(currency?: Currency): Currency | undefined {
  return useMemo(() => {
    if (!!currency) {
      return isTokenNative(currency, currency.chainId) ? NativeCurrencies[currency.chainId] : currency
    }
    return undefined
  }, [currency])
}

// export function useFarmRewards(farms?: Farm[], onlyCurrentUser = true): Reward[] {
//   const result = useMemo(() => {
//     if (!farms) {
//       return []
//     }

//     const initialRewards: { [key: string]: Reward } = {}

//     const userFarmRewards = farms.reduce((total, farm) => {
//       if (farm.userData?.rewards) {
//         farm.rewardTokens.forEach((token, index) => {
//           if (total[token.address]) {
//             total[token.address].amount = total[token.address].amount.add(
//               BigNumber.from(farm.userData?.rewards?.[index]),
//             )
//           } else {
//             total[token.address] = {
//               token,
//               amount: BigNumber.from(farm.userData?.rewards?.[index]),
//             }
//           }
//         })
//         return total
//       } else {
//         farm.rewardTokens.forEach(token => {
//           total[token.address] = {
//             token,
//             amount: BigNumber.from(0),
//           }
//         })
//       }

//       return total
//     }, initialRewards)

//     const initialAllFarmsRewards: { [key: string]: Reward } = {}

//     const allFarmsRewards = farms.reduce((total, farm) => {
//       if (farm.rewardPerSeconds) {
//         farm.rewardTokens.forEach((token, index) => {
//           if (total[token.address]) {
//             total[token.address].amount = total[token.address].amount.add(
//               BigNumber.from(farm.lastRewardTime - farm.startTime).mul(farm.rewardPerSeconds[index]),
//             )
//           } else {
//             total[token.address] = {
//               token,
//               amount: BigNumber.from(farm.lastRewardTime - farm.startTime).mul(farm.rewardPerSeconds[index]),
//             }
//           }
//         })
//       } else {
//         farm.rewardTokens.forEach((token, index) => {
//           if (total[token.address]) {
//             total[token.address].amount = total[token.address].amount.add(
//               BigNumber.from(farm.lastRewardBlock - farm.startBlock).mul(farm.rewardPerBlocks[index]),
//             )
//           } else {
//             total[token.address] = {
//               token,
//               amount: BigNumber.from(farm.lastRewardBlock - farm.startBlock).mul(farm.rewardPerBlocks[index]),
//             }
//           }
//         })
//       }

//       return total
//     }, initialAllFarmsRewards)

//     return onlyCurrentUser ? Object.values(userFarmRewards) : Object.values(allFarmsRewards)
//   }, [farms, onlyCurrentUser])
//   return result
// }

// export function useFarmRewardsUSD(rewards?: Reward[]): number {
//   const { chainId } = useActiveWeb3React()
//   const tokenPrices = useTokenPrices((rewards || []).map(item => item.token.wrapped.address))
//   if (!rewards) {
//     return 0
//   }

//   const rewardUSD = rewards.reduce((total, reward) => {
//     if (!reward || !reward.amount || !reward.token) {
//       return total
//     }

//     if (chainId && tokenPrices[reward.token.wrapped.address]) {
//       total +=
//         +CurrencyAmount.fromRawAmount(reward.token, reward.amount.toString()).toExact() *
//         tokenPrices[reward.token.wrapped.address]
//     }

//     return total
//   }, 0)

//   return rewardUSD
// }

// export function useRewardTokensFullInfo(): Token[] {
//   const { chainId } = useActiveWeb3React()
//   const rewardTokens = useRewardTokens()

//   const allTokens = useAllTokens()
//   const nativeName = NativeCurrencies[chainId].symbol

//   return useMemo(
//     () =>
//       !!rewardTokens && allTokens
//         ? rewardTokens.map(address =>
//             address.toLowerCase() === ZERO_ADDRESS.toLowerCase()
//               ? new Token(chainId, ZERO_ADDRESS.toLowerCase(), 18, nativeName, nativeName)
//               : allTokens[address],
//           )
//         : [],
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [chainId, nativeName, JSON.stringify(rewardTokens)],
//   )
// }
