import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ACTION_ACCRUE } from 'sdk'
import React, { useMemo } from 'react'

import { Button } from 'components/Button'
import QuestionHelper from 'components/QuestionHelper'
import { UnderworldCooker } from 'entities'
import { formatPercent } from 'functions'
import { ZERO } from 'functions/math'
import useUnderworldApproveCallback from 'hooks/useUnderworldApproveCallback'
import { useUnderworldPairContract } from 'hooks/useContract'

export default function PairTools({ pair }) {
  const [, , , , onCook] = useUnderworldApproveCallback()
  const UnderworldPair = useUnderworldPairContract(pair.address)
  async function onUpdatePrice(cooker: UnderworldCooker): Promise<string> {
    cooker.updateExchangeRate(false, ZERO, ZERO)
    return `${i18n._(t`Update Price`)} ${pair.asset.tokenInfo.symbol}/${pair.collateral.tokenInfo.symbol}`
  }

  async function onAccrue(cooker: UnderworldCooker): Promise<string> {
    cooker.add(ACTION_ACCRUE, '0x00')
    return `${i18n._(t`Accrue`)} ${pair.asset.tokenInfo.symbol}/${pair.collateral.tokenInfo.symbol}`
  }

  const priceChange = useMemo(() => {
    const currentPrice = pair?.currentExchangeRate / 1e18
    const oraclePrice = pair?.oracleExchangeRate / 1e18

    const difference = Math.abs(currentPrice - oraclePrice)

    return (difference / currentPrice) * 100
  }, [pair])

  return (
    <div className="flex flex-row flex-shrink space-x-2">
      <Button color="blue" variant="filled" size="xs" className="w-full" onClick={() => onCook(pair, onAccrue)}>
        Accrue
      </Button>
      <QuestionHelper text={'Sync Market to Supply APR'} />
      <Button
        color="purple"
        variant="filled"
        size="xs"
        className="w-full"
        onClick={() => onCook(pair, onUpdatePrice)}
      >
        Update Price
      </Button>
      <QuestionHelper
        text={
          <div>
            <div>Update Exchange Rate</div>
            <div>Current Deviation: {formatPercent(priceChange)}</div>
            {/* <div> Address: {pair.address}</div> */}

          </div>
        }
      />

    </div>
  )
}