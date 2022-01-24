import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import KashiCooker from 'entities/KashiCooker'
import { TransactionReview } from 'entities/TransactionReview'
import { Warnings } from 'entities/Warnings'
import { e10, minimum } from 'functions/math'
import useKashiApproveCallback from 'hooks/useKashiApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import { useKashiApprovalPending } from 'state/application/hooks'
import React, { useState } from 'react'

import { KashiApproveButton } from './Button'
import SmartNumberInput from './SmartNumberInput'
import TransactionReviewView from './TransactionReview'
import WarningsView from './WarningsList'
import { JSBI } from 'sdk'

export default function Withdraw({ pair }: any): JSX.Element {
  const { account } = useActiveWeb3React()
  const pendingApprovalMessage = useKashiApprovalPending()

  const { i18n } = useLingui()

  // State
  const [useBento, setUseBento] = useState<boolean>(pair.asset.bentoBalance.gt(0))
  const [value, setValue] = useState('')
  const [pinMax, setPinMax] = useState(false)

  const [kashiApprovalState, approveKashiFallback, kashiPermit, onApprove, onCook] = useKashiApproveCallback()

  // Calculated
  const max = minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)
  const displayValue = pinMax ? max : value
  // .toFixed(pair.asset.tokenInfo.decimals) : value

  const fraction = pinMax
    ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
    : Number(value) * pair.currentTotalAsset.base * pair.currentTotalAsset.value
    // .toBigNumber(pair.asset.tokenInfo.decimals)
    // .mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

  const warnings = new Warnings()
    .add(
      pair.currentUserAssetAmount.value.lt(value),
        // .toBigNumber(pair.asset.tokenInfo.decimals)),
      i18n._(
        t`Please make sure your ${
          useBento ? 'CoffinBox' : 'wallet'
        } balance is sufficient to withdraw and then try again.`
      ),
      true
    )
    .add(
      pair.maxAssetAvailableFraction.lt(fraction),
      i18n._(
        t`The isn't enough liquidity available at the moment to withdraw this amount. Please try withdrawing less or later.`
      ),
      true
    )

  const transactionReview = new TransactionReview()
  if (displayValue && !warnings.broken) {
    const amount = displayValue
    // .toBigNumber(pair.asset.tokenInfo.decimals)
    const newUserAssetAmount = pair.currentUserAssetAmount.value.sub(amount)
    transactionReview.addTokenAmount(
      i18n._(t`Balance`),
      pair.currentUserAssetAmount.value,
      newUserAssetAmount,
      pair.asset
    )
    transactionReview.addUSD(i18n._(t`Balance USD`), pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)

    const newUtilization = Number(e10(18)) * pair.currentBorrowAmount.value / pair.currentAllAssets.value - Number(amount)
    // .mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
    transactionReview + pair.utilization.value + newUtilization
    // .addPercentage(i18n._(t`Borrowed`), pair.utilization.value, newUtilization)
  }

  // Handlers
  async function onExecute(cooker: KashiCooker) {
    const fraction = pinMax
      ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      : Number(value) * pair.currencyTotalAsset.base / pair.currentAllAssets.value
          // .toBigNumber(pair.asset.tokenInfo.decimals)
          // .mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

    // cooker.removeAsset(fraction, useBento)
    return `${i18n._(t`Withdraw`)} ${pair.asset.tokenInfo.symbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis">
        {i18n._(t`Withdraw`)} {pair.asset.tokenInfo.symbol}
      </div>

      <SmartNumberInput
        color="blue"
        token={pair.asset}
        value={Number(displayValue).toString()}
        setValue={setValue}
        useBentoTitleDirection="up"
        useBentoTitle="to"
        useBento={useBento}
        setUseBento={setUseBento}
        max={max}
        pinMax={pinMax}
        setPinMax={setPinMax}
        showMax={true}
      />

      <WarningsView warnings={warnings} />
      <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

      <KashiApproveButton
        color="blue"
        content={(onCook: any) => (
          <Button
            onClick={() => onCook(pair, onExecute)}
            disabled={displayValue
              // .toBigNumber(pair.asset.tokenInfo.decimals).lte(0) 
              || warnings.broken}
            fullWidth={true}
          >
            {i18n._(t`Withdraw`)}
          </Button>
        )}
      />
    </>
  )
}