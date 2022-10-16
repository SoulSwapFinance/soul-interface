import { Fraction, JSBI } from 'sdk'
import { parseUnits } from 'ethers/lib/utils'

import { BIPS_BASE, RESERVE_USD_DECIMALS } from 'constants/index'
import { FeeConfig } from 'hooks/useSwapV2Callback'
import { Aggregator } from 'utils/swap/aggregator'
import { formatNumber } from 'functions/format'

/**
 * Get Fee Amount in a Trade (unit: USD)
 * @param trade
 * @param feeConfig
 */
export function getFormattedFeeAmountUsd(trade: Aggregator, feeConfig: FeeConfig | undefined) {
  if (feeConfig) {
    const amountInUsd = new Fraction(
      parseUnits(trade.amountInUsd.toString(), RESERVE_USD_DECIMALS).toString(),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(RESERVE_USD_DECIMALS)),
    )
    // feeAmount might < 1.
    const feeAmountFraction = new Fraction(
      parseUnits(feeConfig.feeAmount, RESERVE_USD_DECIMALS).toString(),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(RESERVE_USD_DECIMALS)),
    )
    const feeAmountDecimal = feeAmountFraction.divide(BIPS_BASE)
    if (amountInUsd) {
      const feeAmountUsd = amountInUsd.multiply(feeAmountDecimal).toSignificant(RESERVE_USD_DECIMALS)
      return formatNumber(feeAmountUsd, true, true)
    }
  }

  return '--'
}
