import BigNumber from 'bignumber.js'

export const BIG_ZERO = new BigNumber(0)
export const BIG_TEN = new BigNumber(10)

const BLOCK_TIME = 1;
const BLOCKS_PER_YEAR = 86400 * 365;

export function getFarmApr(totalAllocPoints, allocPoints, rewardsPerBlock, rewardPrice, stakedTvl) {
  const rewardsPerWeek = rewardsPerBlock.times(604800).div(BLOCK_TIME)
  const poolWeight = new BigNumber(allocPoints).div(totalAllocPoints)

  const userDailyRewards = rewardsPerBlock.times(new BigNumber(86400).div(BLOCK_TIME)).times(poolWeight)

  const poolRewardsPerWeek = poolWeight.times(rewardsPerWeek)
  const usdPerWeek = poolRewardsPerWeek.times(new BigNumber(rewardPrice))

  const weeklyAPR = usdPerWeek.div(new BigNumber(stakedTvl)).times(100)
  const monthlyAPR = weeklyAPR.times(30 / 7)
  const yearlyAPR = weeklyAPR.times(365 / 7)

  return {
    weeklyAPR: weeklyAPR.isNaN() || !weeklyAPR.isFinite() ? '0' : weeklyAPR.toFixed(2),
    yearlyAPR: yearlyAPR.isNaN() || !yearlyAPR.isFinite() ? '0' : yearlyAPR.toFixed(2),
    monthlyAPR: monthlyAPR.isNaN() || !monthlyAPR.isFinite() ? '0' : monthlyAPR.toFixed(2),
    userDailyRewards: userDailyRewards.isNaN() ? '0' : userDailyRewards.toJSON(),
  }
}

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @param decimalTokenEarning decimals of token reward
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (stakingTokenPrice, rewardTokenPrice, totalStaked, tokenPerBlock, decimalTokenEarning) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(new BigNumber(tokenPerBlock).div(BIG_TEN.pow(decimalTokenEarning)))
    .times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getPoolAprV2 = (stakingTokenPrice, rewardTokensPrice, totalStaked, tokensPerBlock, earningTokens) => {
  const totalRewardsPricePerYear = earningTokens.reduce((acc, earningToken, index) => {
    const totalRewardPricePerYear = new BigNumber(rewardTokensPrice[index])
      .times(new BigNumber(tokensPerBlock[index]).div(BIG_TEN.pow(earningToken.decimals)))
      .times(BLOCKS_PER_YEAR)

    return acc.plus(totalRewardPricePerYear)
  }, new BigNumber(0))

  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardsPricePerYear.div(totalStakingTokenInPool).times(100)

  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const getVaultApy = (aprWeek, fees) => {
  if (!aprWeek) return 0

  const aprFiveMinutes = ((+aprWeek / 100) * ((100 - fees) / 100)) / 7 / 24 / 12
  const yearlyApy = (1 + aprFiveMinutes) ** (288 * 365.25) - 1
  const monthly180Apy = (1 + aprFiveMinutes) ** (288 * 180) - 1
  const monthly60Apy = (1 + aprFiveMinutes) ** (288 * 60) - 1
  const monthlyApy = (1 + aprFiveMinutes) ** (288 * 30) - 1
  const weeklyApy = (1 + aprFiveMinutes) ** (288 * 7) - 1
  const dailyApy = (1 + aprFiveMinutes) ** 288 - 1

  return {
    yearlyApy: Number.isNaN(yearlyApy) ? 0 : yearlyApy * 100,
    monthly180Apy: Number.isNaN(monthly180Apy) ? 0 : monthly180Apy * 100,
    monthly60Apy: Number.isNaN(monthly60Apy) ? 0 : monthly60Apy * 100,
    monthlyApy: Number.isNaN(monthlyApy) ? 0 : monthlyApy * 100,
    weeklyApy: Number.isNaN(weeklyApy) ? 0 : weeklyApy * 100,
    dailyApy: Number.isNaN(dailyApy) ? 0 : dailyApy * 100,
  }
}

export const getVaultV2Apy = (aprWeekOfVault, aprWeekOfVaultStaked, feesVault, feesVaultStaked, type) => {
  if (!aprWeekOfVault || !aprWeekOfVaultStaked) return 0

  const aprFiveMinutes = ((+aprWeekOfVault / 100) * ((100 - feesVault) / 100)) / 7 / 24 / 12
  const aprX4 = ((+aprWeekOfVaultStaked / 100) * ((100 - feesVaultStaked) / 100)) / 7 / 24 / 12

  let yearlyApy
  let monthly180Apy
  let monthly60Apy
  let monthlyApy
  let weeklyApy
  let dailyApy

  return {
    yearlyApy: Number.isNaN(yearlyApy) ? 0 : yearlyApy * 100,
    monthlyApy: Number.isNaN(monthlyApy) ? 0 : monthlyApy * 100,
    monthly180Apy: Number.isNaN(monthly180Apy) ? 0 : monthly180Apy * 100,
    monthly60Apy: Number.isNaN(monthly60Apy) ? 0 : monthly60Apy * 100,
    weeklyApy: Number.isNaN(weeklyApy) ? 0 : weeklyApy * 100,
    dailyApy: Number.isNaN(dailyApy) ? 0 : dailyApy * 100,
  }
}
