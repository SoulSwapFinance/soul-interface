import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { WNATIVE } from 'sdk'
import { Button } from 'components/Button'
import UnderworldCooker from 'entities/UnderworldCooker'
import { Direction, TransactionReview } from 'entities/TransactionReview'
import { Warnings } from 'entities/Warnings'
import { formatNumber } from 'functions/format'
import { e10, ZERO } from 'functions/math'
import { useCoffinBoxContract } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'
import React, { useState } from 'react'

import { UnderworldApproveButton, TokenApproveButton } from '../components/Button'
import SmartNumberInput from '../components/SmartNumberInput'
import TransactionReviewList from '../components/TransactionReview'
import WarningsList from '../components/WarningsList'

export default function Deposit({ pair }: any): JSX.Element {
  const { account, chainId } = useActiveWeb3React()

  const assetToken = useCurrency(pair.asset.address) || undefined

  const coffinBoxContract = useCoffinBoxContract()

  const { i18n } = useLingui()

  // State
  const [useCoffin, setUseCoffin] = useState<boolean>(pair.asset.coffinBalance.gt(0))
  const [value, setValue] = useState('')

  // Calculated
  const assetNative = WNATIVE[chainId].address === pair.asset.address

  const ethBalance = useETHBalances(assetNative ? [account] : [])

  const balance = useCoffin
    ? pair.asset.coffinBalance
    : assetNative
    ? BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const max = useCoffin
    ? pair.asset.coffinBalance
    : assetNative
    ? BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const warnings = new Warnings()

  warnings.add(
    balance?.lt(value.toBigNumber(pair.asset.tokenInfo.decimals)),
    i18n._(
      t`Please make sure your ${useCoffin ? 'CoffinBox' : 'wallet'} balance is sufficient to deposit and then try again.`
    ),
    true
  )

  const transactionReview = new TransactionReview()

  if (value && !warnings.broken) {
    const amount = value.toBigNumber(pair.asset.tokenInfo.decimals)
    const newUserAssetAmount = pair.currentUserAssetAmount.value.add(amount)
    transactionReview.addTokenAmount(
      i18n._(t`Balance`),
      pair.currentUserAssetAmount.value,
      newUserAssetAmount,
      pair.asset
    )
    transactionReview.addUSD(i18n._(t`Balance USD`), pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
    const newUtilization = e10(18).mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.add(amount))
    transactionReview.addPercentage(i18n._(t`Borrowed`), pair.utilization.value, newUtilization)
    if (pair.currentExchangeRate.isZero()) {
      transactionReview.add(
        'Exchange Rate',
        formatNumber(
          pair.currentExchangeRate.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)
        ),
        formatNumber(
          pair.oracleExchangeRate.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)
        ),
        Direction.UP
      )
    }
    transactionReview.addPercentage(i18n._(t`Supply APR`), pair.supplyAPR.value, pair.currentSupplyAPR.value)
  }

  // Handlers
  async function onExecute(cooker: UnderworldCooker): Promise<string> {
    if (pair.currentExchangeRate.isZero()) {
      cooker.updateExchangeRate(false, ZERO, ZERO)
    }
    const amount = value.toBigNumber(pair.asset.tokenInfo.decimals)

    const deadBalance = await coffinBoxContract.balanceOf(
      pair.asset.address,
      '0x000000000000000000000000000000000000dead'
    )

    cooker.addAsset(amount, useCoffin, deadBalance.isZero())

    return `${i18n._(t`Deposit`)} ${pair.asset.tokenInfo.symbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis">Deposit {pair.asset.tokenInfo.symbol}</div>

      <SmartNumberInput
        color="blue"
        token={pair.asset}
        value={value}
        setValue={setValue}
        useCoffinTitleDirection="down"
        useCoffinTitle="from"
        useCoffin={useCoffin}
        setUseCoffin={setUseCoffin}
        maxTitle="Balance"
        max={max}
        showMax={true}
      />

      <WarningsList warnings={warnings} />
      <TransactionReviewList transactionReview={transactionReview} />

      <UnderworldApproveButton
        color="blue"
        content={(onCook: any) => (
          <TokenApproveButton value={value} token={assetToken} needed={!useCoffin}>
            <Button
              onClick={() => onCook(pair, onExecute)}
              disabled={value.toBigNumber(pair.asset.tokenInfo.decimals).lte(0) || warnings.broken}
              fullWidth={true}
            >
              {i18n._(t`Deposit`)}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}