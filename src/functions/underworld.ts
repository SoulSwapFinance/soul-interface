import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import {
  FACTOR_PRECISION,
  FULL_UTILIZATION_MINUS_MAX,
  INTEREST_ELASTICITY,
  MAXIMUM_INTEREST_PER_YEAR,
  MAXIMUM_TARGET_UTILIZATION,
  MINIMUM_INTEREST_PER_YEAR,
  MINIMUM_TARGET_UTILIZATION,
  // PROTOCOL_FEE,
  // PROTOCOL_FEE_DIVISOR,
  // STARTING_INTEREST_PER_YEAR,
  USD,
} from 'sdk'

import { e10, ZERO } from './math'

const PROTOCOL_FEE = BigNumber.from('10000') // 10%
export const PROTOCOL_FEE_DIVISOR = BigNumber.from('100000')
export const STARTING_INTEREST_PER_YEAR 
  // = JSBI.multiply(JSBI.BigInt(317097920), JSBI.BigInt(60 * 60 * 24 * 365))
  = 317097920 //* 60 * 60 * 24 * 365

export function accrue(pair: any, amount: BigNumber, includePrincipal = false): BigNumber {
  return amount
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds)
    .div(e10(18))
    .add(includePrincipal ? amount : ZERO)
}

export function accrueTotalAssetWithFee(pair: any): {
  elastic: BigNumber
  base: BigNumber
} {
  const extraAmount = BigNumber.from(pair.totalBorrow.elastic)
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds.add('3600')) // Project an hour into the future
    .div(e10(18))
  const feeAmount 
    // = extraAmount?.mul(BigNumber.from(PROTOCOL_FEE || 0)).div(BigNumber.from(PROTOCOL_FEE_DIVISOR)) // % of interest paid goes to fee
    = Number(extraAmount) * Number(PROTOCOL_FEE) / Number(PROTOCOL_FEE_DIVISOR) // % of interest paid goes to fee
  // const feeAmount = extraAmount?.mul(BigNumber.from(PROTOCOL_FEE || 0)).div(BigNumber.from(PROTOCOL_FEE_DIVISOR)) // % of interest paid goes to fee
  const feeFraction 
    // = feeAmount.mulDiv(pair.totalAsset.base, pair.currentAllAssets.value)
    = feeAmount * pair.totalAsset.base / pair.currentAllAssets.value
  return {
    elastic: pair.totalAsset.elastic,
    // base: pair.totalAsset.base.add(feeFraction),
    base: pair.totalAsset.base + feeFraction,
  }
}

export function interestAccrue(pair: any, interest: BigNumber): BigNumber {
  if (pair.totalBorrow.base.eq(0)) {
    return BigNumber.from(STARTING_INTEREST_PER_YEAR)
  }
  if (pair.elapsedSeconds.lte(0)) {
    return interest
  }

  let currentInterest = interest
  if (pair.utilization.lt(MINIMUM_TARGET_UTILIZATION)) {
    const underFactor = BigNumber.from(MINIMUM_TARGET_UTILIZATION)
      .sub(pair.utilization)
      .mulDiv(BigNumber.from(FACTOR_PRECISION), BigNumber.from(MINIMUM_TARGET_UTILIZATION))
    const scale = BigNumber.from(INTEREST_ELASTICITY).add(underFactor.mul(underFactor).mul(pair.elapsedSeconds))
    currentInterest = currentInterest.mul(BigNumber.from(INTEREST_ELASTICITY)).div(scale)

    if (currentInterest.lt(BigNumber.from(MINIMUM_INTEREST_PER_YEAR))) {
      currentInterest = BigNumber.from(MINIMUM_INTEREST_PER_YEAR) // 0.25% APR minimum
    }
  } else if (pair.utilization.gt(MAXIMUM_TARGET_UTILIZATION)) {
    const overFactor = pair.utilization
      .sub(MAXIMUM_TARGET_UTILIZATION)
      .mul(BigNumber.from(FACTOR_PRECISION).div(BigNumber.from(FULL_UTILIZATION_MINUS_MAX)))
    const scale = BigNumber.from(INTEREST_ELASTICITY).add(overFactor.mul(overFactor).mul(pair.elapsedSeconds))
    currentInterest = currentInterest.mul(scale).div(BigNumber.from(INTEREST_ELASTICITY))
    if (currentInterest.gt(BigNumber.from(MAXIMUM_INTEREST_PER_YEAR))) {
      currentInterest = BigNumber.from(MAXIMUM_INTEREST_PER_YEAR) // 1000% APR maximum
    }
  }
  return currentInterest
}

export function getUSDValue(amount: number, token: any): number {
  return amount
    * token.usd
    / 1e18
    // e10(token?.decimals ? token.decimals : token.tokenInfo.decimals))
}

export function getUSDString(amount: number, token: any): string {
  return (amount
    * token.usd
    / 1e18).toString()
    // .div(e10(token?.decimals ? token.decimals : token.tokenInfo.decimals))
    // .toFixed(USD[token?.chainId ? token.chainId : token.tokenInfo.chainId].decimals)
}

export function easyAmount(
  amount: number,
  token: any
): { value: number; string: string; usdValue: number; usd: string } {
  // console.log('easyAmount', token)
  return {
    value: amount,
    string: amount.toString(),
    usdValue: getUSDValue(amount, token),
    usd: getUSDString(amount, token),
  }
}

export function takeFee(amount: number): string {
  // return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
  return (amount * 9 / 10).toString()
}

export function addBorrowFee(amount: BigNumber): BigNumber {
  return amount.mul(BigNumber.from(10005)).div(BigNumber.from(10000))
}

export function getFraction({
  totalAssetBase,
  totalAssetElastic,
  totalBorrowElastic,
  token0: { totalSupplyBase, totalSupplyElastic },
}) {
  return totalAssetBase / (Number(totalAssetElastic) + (totalBorrowElastic * totalSupplyBase) / totalSupplyElastic)
}