import { BigNumber } from 'ethers'
import { ChainId } from 'sdk'
import { DEFAULT_GAS_LIMIT_MARGIN } from 'constants/index'

// export function calculateGasMargin(value: BigNumber): BigNumber {
//   return value.mul(120).div(100)
// }

/**
 * Add a margin amount equal to max of 20000 or 20% of estimatedGas
 * total = estimate + max(20k, 20% * estimate)
 *
 * @param value BigNumber
 * @returns BigNumber
 */
export function calculateGasMargin(value: BigNumber, chainId?: ChainId): BigNumber {
  const defaultGasLimitMargin = BigNumber.from(DEFAULT_GAS_LIMIT_MARGIN)
  // const needHigherGas = [ChainId.MATIC, ChainId.OPTIMISM].includes(chainId as ChainId)
  const needHigherGas = [ChainId.MATIC].includes(chainId as ChainId)
  const gasMargin = value.mul(BigNumber.from(needHigherGas ? 5000 : 2000)).div(BigNumber.from(10000))

  return gasMargin.gte(defaultGasLimitMargin) ? value.add(gasMargin) : value.add(defaultGasLimitMargin)
}