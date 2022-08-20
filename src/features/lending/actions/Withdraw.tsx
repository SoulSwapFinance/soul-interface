import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import UnderworldCooker from 'entities/UnderworldCooker'
import { TransactionReview } from 'entities/TransactionReview'
import { Warnings } from 'entities/Warnings'
import { e10, minimum } from 'functions/math'
import useUnderworldApproveCallback from 'hooks/useUnderworldApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import { useUnderworldApprovalPending } from 'state/application/hooks'
import React, { useState } from 'react'

import { UnderworldApproveButton } from '../components/Button'
import TransactionReviewView from '../components/TransactionReview'
import WarningsView from '../components/WarningsList'
import { useCurrency } from 'hooks/Tokens'
import LendAssetInput from 'components/LendAssetInput'
import SmartNumberInput from '../components/SmartNumberInput'

export default function Withdraw({ pair }: any): JSX.Element {
  const { account } = useActiveWeb3React()
  const pendingApprovalMessage = useUnderworldApprovalPending()
  const assetToken = useCurrency(pair.asset.address) || undefined

  const { i18n } = useLingui()

  // State
  // const [useCoffin, setUseCoffin] = useState<boolean>(BigNumber.from(pair.asset.balance).gt(0))
  const [useCoffin, setUseCoffin] = useState<boolean>(true)
  const [value, setValue] = useState('')
  const [pinMax, setPinMax] = useState(false)

  // const [underworldApprovalState, approveUnderworldFallback, underworldPermit, onApprove, onCook] = useUnderworldApproveCallback()


  // Calculated
  // const max = minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)
  const max =
    // minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)
    pair.maxAssetAvailable.lte(pair.currentUserAssetAmount.value)
      // DEPOSITED AMOUNT - LENT AMOUNT
      ? pair.userAssetFraction //.sub(pair.currentUserLentAmount.value)
      : pair.currentUserAssetAmount.value

  const displayValue = pinMax ? max.toFixed(pair.asset.tokenInfo.decimals) : value

  const fraction = pinMax
    ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
    : value.toBigNumber(pair.asset.tokenInfo.decimals).mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

  const warnings = new Warnings()
    // CHECKS: WITHDRAW AMOUNT !> DEPOSITED AMOUNT - LENT AMOUNT
    .add(
      pair.userAssetFraction.sub(pair.currentUserLentAmount.value)
        .lt(value.toBigNumber(pair.asset.tokenInfo.decimals)),
      i18n._(
        t`Please make sure your ${useCoffin ? 'CoffinBox' : 'wallet'
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
    const amount = displayValue.toBigNumber(pair.asset.tokenInfo.decimals)
    const newUserAssetAmount = pair.userAssetFraction.sub(amount)
    transactionReview.addTokenAmount(
      i18n._(t`Balance`),
      pair.userAssetFraction,
      newUserAssetAmount,
      pair.asset
    )
    transactionReview.addUSD(i18n._(t`Balance USD`),
      pair.userAssetFraction.div(e10(12)),
      newUserAssetAmount.div(e10(12)),
      pair.asset)

    const newUtilization = e10(18).mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
    // transactionReview.addPercentage(i18n._(t`Borrowed`), pair.utilization.value, newUtilization)
  }

  // Handlers
  async function onExecute(cooker: UnderworldCooker) {
    const fraction = pinMax
      // ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      ? pair.userAssetFraction
      : value
        .toBigNumber(pair.asset.tokenInfo.decimals)
        // .mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

    cooker.removeAsset(fraction, useCoffin)
    return `${i18n._(t`Withdraw`)} ${pair.asset.tokenInfo.symbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis">
        {/* {i18n._(t`Withdraw`)} {pair.asset.tokenInfo.symbol} */}
      </div>

      <SmartNumberInput
        color="blue"
        token={pair.asset}
        value={displayValue}
        setValue={setValue}
        useCoffinTitleDirection="up"
        useCoffinTitle="to"
        useCoffin={true}
        setUseCoffin={setUseCoffin}
        max={max}
        pinMax={pinMax}
        setPinMax={setPinMax}
        showMax={true}
      />
      {/* <LendAssetInput
        size="sm"
        id="add-collateral-input"
        value={value}
        currency={assetToken}
        onChange={setValue}
        className="!mt-0"
        // balance={Number(displayValue)}
        // maxSpend={displayValue}
        showMax={true}
        // spendFromWallet={useCoffin} 
      /> */}

      <WarningsView warnings={warnings} />
      <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView>

      <UnderworldApproveButton
        color="blue"
        content={(onCook: any) => (
          <Button
            onClick={() => onCook(pair, onExecute)}
            disabled={displayValue.toBigNumber(pair.asset.tokenInfo.decimals).lte(0) || warnings.broken}
            className="w-full"
            >
            {i18n._(t`Withdraw`)}
          </Button>
        )}
      />
    </>
  )
}