import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import {
  FACTOR_PRECISION,
  FULL_UTILIZATION_MINUS_MAX,
  INTEREST_ELASTICITY,
  MAXIMUM_INTEREST_PER_YEAR,
  MAXIMUM_TARGET_UTILIZATION,
  MINIMUM_INTEREST_PER_YEAR,
  MINIMUM_TARGET_UTILIZATION,
  PROTOCOL_FEE,
  PROTOCOL_FEE_DIVISOR,
  STARTING_INTEREST_PER_YEAR,
  USD
} from 'sdk'

import { e10, ZERO } from './math'

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
  const extraAmount = 
  BigNumber.from(pair.totalBorrow.elastic
    .mul(pair.accrueInfo.interestPerSecond)
    .mul(pair.elapsedSeconds.add('3600')) // Project an hour into the future
    .div(e10(18)))
  const feeAmount = BigNumber.from(extraAmount).mul(Number(PROTOCOL_FEE)).div(Number(PROTOCOL_FEE_DIVISOR)) // % of interest paid goes to fee
  const feeFraction = feeAmount.mulDiv(pair.totalAsset.base, pair.currentAllAssets.value)
  return {
    elastic: pair.totalAsset.elastic,
    base: BigNumber.from(pair.totalAsset.base).add(feeFraction),
  }
}


export function interestAccrue(pair: any, interest: BigNumber): string {
  if (pair.totalBorrow.base.eq(0)) {
    return BigNumber.from(Math.floor(Number(STARTING_INTEREST_PER_YEAR) / 1e16)).toString()
  }
  if (pair.elapsedSeconds.lte(0)) {
    return interest.toString()
  }

  let currentInterest = interest
  if (Number(pair.utilization) < Number(MINIMUM_TARGET_UTILIZATION)) {
    const underFactor = BigNumber.from(
      Number(MINIMUM_TARGET_UTILIZATION)
      - pair.utilization
      * Number(FACTOR_PRECISION)
      / Number(MINIMUM_TARGET_UTILIZATION))
      // / 1e18)
      
      
      const scale = BigNumber.from(INTEREST_ELASTICITY).add(BigNumber.from(underFactor).mul(underFactor).mul(pair.elapsedSeconds))
      currentInterest = currentInterest.mul(BigNumber.from(INTEREST_ELASTICITY)).div(scale)
      
      // console logs
      console.log('underFactor:%s', underFactor)
      console.log('scale:%s', scale)
      console.log('currentInterest:%s', currentInterest)

    if (currentInterest.lt(Number(MINIMUM_INTEREST_PER_YEAR))) {
      currentInterest = BigNumber.from(Number(MINIMUM_INTEREST_PER_YEAR)) // 0.25% APR minimum
    }

  } else if (Number(pair.utilization) > Number(MAXIMUM_TARGET_UTILIZATION)) {
     const overFactor = Number(pair.utilization)
      - Number(MAXIMUM_TARGET_UTILIZATION)
      * Number(FACTOR_PRECISION)
      / Number(FULL_UTILIZATION_MINUS_MAX)
      / 1e16
      
      // console logs
      console.log('utilization:%s', pair.utilization)
      console.log('MAXIMUM_TARGET_UTILIZATION:%s', MAXIMUM_TARGET_UTILIZATION)
    
    const scale = Number(INTEREST_ELASTICITY) + overFactor * overFactor * Number(pair.elapsedSeconds) / 1e16
    currentInterest = BigNumber.from(Math.floor(Number(currentInterest) * (scale) / Number(INTEREST_ELASTICITY) / 1e16))
    if (Number(currentInterest) > Number(MAXIMUM_INTEREST_PER_YEAR)) {
      currentInterest = BigNumber.from(MAXIMUM_INTEREST_PER_YEAR) // 1000% APR maximum
    }
  }
  return currentInterest.toString()
}


export function getUSDValue(amount: BigNumberish, token: any): BigNumber {
  return BigNumber.from(amount)
    .mul(token.usd)
    .div(e10(token?.decimals ? token.decimals : token.tokenInfo.decimals))
}

export function getUSDString(amount: BigNumberish, token: any): string {
  return BigNumber.from(amount)
    .mul(token.usd)
    .div(e10(token?.decimals ? token.decimals : token.tokenInfo.decimals))
    .toFixed(USD[token?.chainId ? token.chainId : token.tokenInfo.chainId].decimals)
}

export function easyAmount(
  amount: BigNumber,
  token: any
): { value: BigNumber; string: string; usdValue: BigNumber; usd: string } {
  // console.log('easyAmount', token)
  return {
    value: amount,
    string: amount.toFixed(token?.decimals ? token.decimals : token.tokenInfo.decimals),
    usdValue: getUSDValue(amount, token),
    usd: getUSDString(amount, token),
  }
}

export function takeFee(amount: BigNumber): BigNumber {
  return amount.mul(BigNumber.from(9)).div(BigNumber.from(10))
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