import { Direction, TransactionReview } from '../../entities/TransactionReview'
import { UnderworldApproveButton, TokenApproveButton } from './Button'
import React, { useState } from 'react'
import { ZERO, e10 } from '../../functions/math'

import { Button } from '../../components/Button'
import UnderworldCooker from '../../entities/UnderworldCooker'
import SmartNumberInput from './SmartNumberInput'
import TransactionReviewList from './TransactionReview'
import { WNATIVE } from '../../sdk'
import { Warnings } from '../../entities/Warnings'
import WarningsList from './WarningsList'
import { formatNumber } from '../../functions/format'
import { useActiveWeb3React } from 'services/web3'
import { useCurrency } from '../../hooks/Tokens'
import { useUnderworldInfo } from './context'
import { BigNumber } from '@ethersproject/bignumber'

export default function Deposit({ pair }: any): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const assetToken = useCurrency(pair.asset.address) || undefined

  // console.log({ pair })

  // State
  const [useCoffin, setUseCoffin] = useState<boolean>(pair.asset.coffinBalance.gt(0))
  const [value, setValue] = useState('')

  const info = useUnderworldInfo()

  // Calculated
  const assetNative = WNATIVE[chainId || 1].address === pair.asset.address
  const balance = useCoffin ? pair.asset.coffinBalance : assetNative ? info?.ethBalance : pair.asset.balance

  const max = useCoffin ? pair.asset.coffinBalance : assetNative ? info?.ethBalance : pair.asset.balance

  const warnings = new Warnings()

  warnings.add(
    balance?.lt(value),
      // .toBigNumber(pair.asset.tokenInfo.decimals)),
    `Please make sure your ${useCoffin ? 'CoffinBox' : 'wallet'} balance is sufficient to deposit and then try again.`,
    true
  )

  const transactionReview = new TransactionReview()

  if (value && !warnings.broken) {
    const amount = value
    // .toBigNumber(pair.asset.tokenInfo.decimals)
    const newUserAssetAmount = pair.currentUserAssetAmount.value.add(amount)
    transactionReview.addTokenAmount('Balance', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
    transactionReview.addUSD('Balance USD', pair.currentUserAssetAmount.value, newUserAssetAmount, pair.asset)
    const newUtilization = e10(18)
      .mul(pair.currentBorrowAmount.value).div(pair.currentAllAssets.value.add(amount))
    transactionReview.addPercentage('Borrowed', pair.utilization.value, newUtilization)
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
    transactionReview.addPercentage('Supply APR', pair.supplyAPR.value, pair.currentSupplyAPR.value)
  }

  // Handlers
  async function onExecute(cooker: UnderworldCooker): Promise<string> {
    if (pair.currentExchangeRate.isZero()) {
      cooker.updateExchangeRate(false, ZERO, ZERO)
    }
    cooker.addAsset(new BigNumber(value, ''),
      // .toBigNumber(pair.asset.tokenInfo.decimals), 
      useCoffin)
    return `Deposit ${pair.asset.tokenInfo.symbol}`
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
              disabled={value
                // .toBigNumber(pair.asset.tokenInfo.decimals).lte(0) 
                || warnings.broken}
            >
              Deposit
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}
