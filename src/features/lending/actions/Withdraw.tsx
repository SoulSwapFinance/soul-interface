import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import UnderworldCooker from 'entities/UnderworldCooker'
import { Warnings } from 'entities/Warnings'
import { useActiveWeb3React } from 'services/web3'
import React, { useState } from 'react'

import { UnderworldApproveButton } from '../components/Button'
import WarningsView from '../components/WarningsList'
import SmartNumberInput from '../components/SmartNumberInput'
import { useUnderworldPairInfo } from 'hooks/useAPI'
import { ChainId, DAI_BNB_MARKET, DAI_BTC_MARKET, DAI_ETH_MARKET, DAI_NATIVE_MARKET, LEND_MULTIPLIER, NATIVE_DAI_MARKET } from 'sdk'
import NavLink from 'components/NavLink'

// import { TransactionReview } from 'entities/TransactionReview'
// import { e10, minimum } from 'functions/math'
// import useUnderworldApproveCallback from 'hooks/useUnderworldApproveCallback'
// import { useUnderworldApprovalPending } from 'state/application/hooks'
// import TransactionReviewView from '../components/TransactionReview'
// import { useCurrency } from 'hooks/Tokens'
// import LendAssetInput from 'components/LendAssetInput'

export default function Withdraw({ pair }: any): JSX.Element {
  const { account, chainId } = useActiveWeb3React()
  // const pendingApprovalMessage = useUnderworldApprovalPending()
  // const assetToken = useCurrency(pair.asset.address) || undefined
  const { underworldPairInfo } = useUnderworldPairInfo(pair.address)
  // const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  const assetDecimals = Number(underworldPairInfo.assetDecimals)
  // format tickers //
  const aTicker = underworldPairInfo.assetTicker
  // const bTicker = underworldPairInfo.collateralTicker

  const inactivePair =
    pair.address == NATIVE_DAI_MARKET[ChainId.FANTOM]
    || pair.address == DAI_NATIVE_MARKET[ChainId.FANTOM]
    || pair.address == DAI_ETH_MARKET[ChainId.FANTOM]
    || pair.address == DAI_BTC_MARKET[ChainId.FANTOM]
    || pair.address == DAI_BNB_MARKET[ChainId.FANTOM]

  const assetSymbol
    = aTicker == 'WAVAX' ? 'AVAX'
      : aTicker == 'WFTM' ? 'FTM'
        : aTicker == 'WETH.e' ? 'ETH'
          : aTicker == 'WBTC.e' ? 'BTC'
            : aTicker == 'LINK.e' ? 'LINK'
              : aTicker

  // const collateralSymbol
  //   = bTicker == 'WAVAX' ? 'AVAX'
  //     : bTicker == 'WFTM' ? 'FTM'
  //     : bTicker == 'WETH.e' ? 'ETH'
  //       : bTicker == 'WBTC.e' ? 'BTC'
  //         : bTicker

  const { i18n } = useLingui()

  // State
  // const [useCoffin, setUseCoffin] = useState<boolean>(BigNumber.from(pair.asset.balance).gt(0))
  const [useCoffin, setUseCoffin] = useState<boolean>(true)
  const [value, setValue] = useState('')
  const [pinMax, setPinMax] = useState(false)

  // const [underworldApprovalState, approveUnderworldFallback, underworldPermit, onApprove, onCook] = useUnderworldApproveCallback()
  const MULTIPLIER = LEND_MULTIPLIER(chainId, pair?.address)

  // Calculated
  // const max = minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)
  const max =
    // minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)
    pair.maxAssetAvailable.lte(pair.currentUserAssetAmount.value)
      // DEPOSITED AMOUNT - LENT AMOUNT
      ? pair.userAssetFraction.mul(MULTIPLIER) //.sub(pair.currentUserLentAmount.value)
      : pair.currentUserAssetAmount.value

  const displayValue = pinMax ? max.toFixed(assetDecimals) : value

  // const fraction = pinMax
  //   ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
  //   : value.toBigNumber(assetDecimals).mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

  const warnings = new Warnings()
    // CHECKS: WITHDRAW AMOUNT !> DEPOSITED AMOUNT - LENT AMOUNT
    // .add(
    //   pair.userAssetFraction.sub(pair.currentUserLentAmount.value)
    //     .lt(value.toBigNumber(assetDecimals)),
    //   i18n._(
    //     t`Please make sure your balance is sufficient to withdraw and then try again.`
    //   ),
    //   true
    // )
    .add(
      // pair.maxAssetAvailableFraction.lt(fraction),
      // Number(minimum(pair.maxAssetAvailable, pair.currentUserAssetAmount.value)) == 0,
      // chainId == ChainId.FANTOM 
      // && 
      // INACTIVE //
      (
        inactivePair
      ),
      // && pair.userAssetFraction.sub(pair.currentUserLentAmount.value).lte(0),
      i18n._(
        t`Insufficient liquidity, please swap or bond to exit.`
      ),
      true
    )


  // const transactionReview = new TransactionReview()
  // if (displayValue && !warnings.broken) {
  // const amount = displayValue.toBigNumber(assetDecimals)
  // const newUserAssetAmount = pair.userAssetFraction.sub(amount).mul(MULTIPLIER)
  // transactionReview.addTokenAmount(
  //   i18n._(t`Balance`),
  //   pair.userAssetFraction,
  //   newUserAssetAmount,
  //   pair.asset
  // )
  // transactionReview.addUSD(i18n._(t`Balance USD`),
  //   pair.userAssetFraction.div(e10(12)),
  //   newUserAssetAmount.div(e10(12)),
  //   pair.asset)

  // const newUtilization = e10(18).mulDiv(pair.currentBorrowAmount.value, pair.currentAllAssets.value.sub(amount))
  // transactionReview.addPercentage(i18n._(t`Borrowed`), pair.utilization.value, newUtilization)
  // }

  // Handlers
  async function onExecute(cooker: UnderworldCooker) {
    const fraction = pinMax
      // ? minimum(pair.userAssetFraction, pair.maxAssetAvailableFraction)
      ? pair.userAssetFraction
      : value
        .toBigNumber(assetDecimals)
        .div(MULTIPLIER)
    // .mulDiv(pair.currentTotalAsset.base, pair.currentAllAssets.value)

    cooker.removeAsset(fraction, useCoffin)
    return `${i18n._(t`Withdraw`)} ${assetSymbol}`
  }

  return (
    <>
      <div className="mt-6 text-3xl text-high-emphesis">
        {/* {i18n._(t`Withdraw`)} {assetSymbol} */}
      </div>

      <SmartNumberInput
        color="blue"
        token={pair.asset}
        value={displayValue}
        setValue={setValue}
        useCoffinTitleDirection="up"
        useCoffinTitle="to"
        // useCoffin={true}
        useCoffin={useCoffin}
        setUseCoffin={setUseCoffin}
        maxTitle={`${assetSymbol}`}
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
      {/* <TransactionReviewView transactionReview={transactionReview}></TransactionReviewView> */}

      <UnderworldApproveButton
        color="blue"
        content={(onCook: any) => (
          <Button
            onClick={() => onCook(pair, onExecute)}
            disabled={displayValue.toBigNumber(assetDecimals).lte(0)
              || warnings.broken
            }
            className="w-full"
          >
            {i18n._(t`Withdraw`)}
          </Button>
        )}
      />
      {
        inactivePair &&
        <div
          className={`mt-2 grid grid-cols-2 gap-2`}
        >

          <NavLink href="/lend/swap">
            <Button variant="filled" color={`ftmBlue`} size="sm">
              <span className="justify-center font-bold">
                {'Redeem Asset'}
              </span>
            </Button>
          </NavLink>
          <NavLink
            href="/bond"
          >
            <Button variant="filled" color={`ftmBlue`} size="sm">
              <span className="justify-center font-bold">
                {'Bond Asset'}
              </span>
            </Button>
          </NavLink>
        </div>
      }
    </>
  )
}