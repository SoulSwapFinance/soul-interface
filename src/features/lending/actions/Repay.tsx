import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { hexConcat, hexlify } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { Percent, SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS, WNATIVE } from 'sdk'
import { Button } from 'components/Button'
import { UnderworldCooker } from 'entities'
import { TransactionReview } from 'entities/TransactionReview'
import { Warning, Warnings } from 'entities/Warnings'
import { toAmount, toShare } from 'functions/coffinbox'
import { e10, maximum, minimum, ZERO } from 'functions/math'
import { tryParseAmount } from 'functions/parse'
import { computeRealizedLPFeePercent, warningSeverity } from 'functions/prices'
import { useCurrency } from 'hooks/Tokens'
import { useV2TradeExactOut } from 'hooks/useV2Trades'
import { useActiveWeb3React } from 'services/web3'
import { useAppSelector } from 'state/hooks'
import { selectSlippageWithDefault } from 'state/slippage/slippageSlice'
import { useETHBalances } from 'state/wallet/hooks'
import React, { useMemo, useState } from 'react'

import { UnderworldApproveButton, TokenApproveButton } from '../components/Button'
import { ExchangeRateCheckBox, SwapCheckbox } from '../components/Checkbox'
import SmartNumberInput from '../components/SmartNumberInput'
import TradeReview from '../components/TradeReview'
import TransactionReviewView from '../components/TransactionReview'
import WarningsView from '../components/WarningsList'
import { useUnderworldPairInfo } from 'hooks/useAPI'

interface RepayProps {
  pair: any
}

const DEFAULT_UNDERWORLD_REPAY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const DEFAULT_UPDATE_ORACLE = true

export default function Repay({ pair }: RepayProps) {
  const { account, chainId } = useActiveWeb3React()

  // State
  // const [useCoffinRepay, setUseCoffinRepay] = useState<boolean>(pair.asset.coffinBalance > 0)
  const [useCoffinRepay, setUseCoffinRepay] = useState<boolean>(false)
  const [useCoffinRemove, setUseCoffinRemoveCollateral] = useState<boolean>(false)

  const [repayValue, setRepayAssetValue] = useState('')
  const [removeValue, setRemoveCollateralValue] = useState('')
  const [pinRemoveMax, setPinRemoveMax] = useState(false)
  const [pinRepayMax, setPinRepayMax] = useState(false)
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)

  const assetToken = useCurrency(pair.asset.address) || undefined
  const collateralToken = useCurrency(pair.collateral.address) || undefined
  const { underworldPairInfo } = useUnderworldPairInfo(pair.address)
  const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
  const assetDecimals = Number(underworldPairInfo.assetDecimals)
  // format tickers //
  const aTicker = underworldPairInfo.assetTicker
  const bTicker = underworldPairInfo.collateralTicker

  const assetSymbol
    = aTicker == 'WAVAX' ? 'AVAX'
      : aTicker == 'WFTM' ? 'FTM'
      : aTicker == 'WETH.e' ? 'ETH'
        : aTicker == 'WBTC.e' ? 'BTC'
          : aTicker
  const collateralSymbol
    = bTicker == 'WAVAX' ? 'AVAX'
      : bTicker == 'WFTM' ? 'FTM'
      : bTicker == 'WETH.e' ? 'ETH'
        : bTicker == 'WBTC.e' ? 'BTC'
          : bTicker

  // Calculated
  const assetNative = WNATIVE[chainId || 250].address === pair.asset.address
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  console.log({ pair })

  const balance = useCoffinRepay
    ? toAmount(pair.asset, pair.asset.coffinBalance)
    : assetNative
    ? // @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

  const displayRepayValue = pinRepayMax
    ? minimum(pair.currentUserBorrowAmount.value, balance).toFixed(assetDecimals)
    : repayValue

  const nextUserBorrowAmount = pair.currentUserBorrowAmount.value.sub(
    displayRepayValue.toBigNumber(assetDecimals)
  )

  const nextMinCollateralOracle = nextUserBorrowAmount.mulDiv(pair.oracleExchangeRate, e10(16).mul('75'))
  const nextMinCollateralSpot = nextUserBorrowAmount.mulDiv(pair.spotExchangeRate, e10(16).mul('75'))
  const nextMinCollateralStored = nextUserBorrowAmount.mulDiv(
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate,
    e10(16).mul('75')
  )
  const nextMinCollateralMinimum = maximum(nextMinCollateralOracle, nextMinCollateralSpot, nextMinCollateralStored)
  const nextMaxRemoveCollateral = maximum(
    pair.userCollateralAmount.value.sub(nextMinCollateralMinimum.mul(100).div(95)),
    ZERO
  )
  const maxRemoveCollateral = nextMaxRemoveCollateral.toFixed(collateralDecimals)

  const displayRemoveValue = pinRemoveMax ? maxRemoveCollateral : removeValue

  const allowedSlippage = useAppSelector(selectSlippageWithDefault(DEFAULT_UNDERWORLD_REPAY_SLIPPAGE_TOLERANCE))

  const parsedAmount = tryParseAmount(pair.currentUserBorrowAmount.string, assetToken)

  const trade = useV2TradeExactOut(collateralToken, parsedAmount) || undefined

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    // @ts-ignore TYPE NEEDS FIXING
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)
    // @ts-ignore TYPE NEEDS FIXING
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [trade])

  // const maxAmountIn = swap
  //   ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
  //       [Field.INPUT]?.toFixed(collateralDecimals)
  //       .toBigNumber(collateralDecimals) || ZERO
  //   : ZERO;

  const maxAmountIn =
    swap && trade
      ? trade
          .maximumAmountIn(allowedSlippage)
          .toFixed(collateralDecimals)
          .toBigNumber(collateralDecimals)
      : ZERO

  // const nextUserCollateralValue = pair.userCollateralAmount.value.add(collateralValue.toBigNumber(collateralDecimals)).add(extraCollateral)

  const nextUserCollateralAmount = pair.userCollateralShare.sub(
    displayRemoveValue.toBigNumber(collateralDecimals)
  )

  const nextMaxBorrowableOracle = nextUserCollateralAmount.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate)
  const nextMaxBorrowableSpot = nextUserCollateralAmount.mulDiv(e10(16).mul('75'), pair.spotExchangeRate)
  const nextMaxBorrowableStored = nextUserCollateralAmount.mulDiv(
    e10(16).mul('75'),
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
  )
  const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
  const nextMaxBorrowSafe = nextMaxBorrowMinimum.mulDiv('95', '100').sub(pair.currentUserBorrowAmount.value)
  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

  const nextHealth = pair.currentUserBorrowAmount.value
    .sub(displayRepayValue.toBigNumber(assetDecimals))
    .mulDiv(BigNumber.from('1000000000000000000'), nextMaxBorrowMinimum)

  const transactionReview = new TransactionReview()

  if (displayRepayValue || displayRemoveValue) {
    transactionReview.addTokenAmount(
      'Borrow Limit',
      pair.maxBorrowable.safe.value,
      nextMaxBorrowSafe.add(displayRepayValue.toBigNumber(assetDecimals)),
      pair.asset
    )
    transactionReview.addPercentage('Health', BigNumber.from(pair.health.value), BigNumber.from(nextHealth))
  }

  const warnings = new Warnings()
    // .addError(
    //   assetNative && !useCoffinRepay && pinRepayMax,
    //   `You cannot MAX repay ${assetSymbol} directly from your wallet. 
    //   Please deposit your ${assetSymbol} into the CoffinBox first, then repay. 
    //   Because your debt is slowly accrueing interest we can't predict how much it will be once your transaction gets mined.`
    // )
    .addError(
      assetNative && !useCoffinRepay && pinRepayMax,
      `You cannot MAX repay ${assetSymbol} directly from your wallet. 
      Please enter a balance slighlty below the MAX.`
    )
    .addError(
      displayRemoveValue.toBigNumber(collateralDecimals).gt(pair.userCollateralShare),
      'You have insufficient collateral. Please enter a smaller amount or repay more.'
    )
    /* .addError(
      displayRepayValue.toBigNumber(assetDecimals).gt(pair.currentUserBorrowAmount.value),
      "You can't repay more than you owe. To fully repay, please click the 'max' button.",
      new Warning(
        balance?.lt(displayRepayValue.toBigNumber(assetDecimals)),
        `Please make sure your balance is sufficient to repay and then try again.`,
        true
      )
    ) */
    .addError(
      displayRemoveValue
        .toBigNumber(collateralDecimals)
        .gt(maximum(pair.userCollateralShare.sub(nextMinCollateralMinimum), ZERO)),
      'Removing this much collateral would put you into insolvency.',
      new Warning(
        displayRemoveValue.toBigNumber(collateralDecimals).gt(nextMaxRemoveCollateral),
        'Removing this much collateral may put you very close to insolvency.'
      )
    )

  const removeValueSet =
    !displayRemoveValue.toBigNumber(collateralDecimals).isZero() ||
    (pinRemoveMax && pair.userCollateralShare.gt(ZERO))

  const repayValueSet = !displayRepayValue.toBigNumber(assetDecimals).isZero()

  // const trade = swap ? foundTrade : undefined;
  // const trade = swap && removeValueSet ? foundTrade : undefined

  // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  let actionName = 'Enter Amounts'

  if (removeValueSet) {
    if (repayValueSet) {
      actionName = 'Repay and Remove Collateral'
    } else {
      actionName = 'Remove Collateral'
    }
  } else if (repayValueSet) {
    actionName = 'Repay'
  } else if (swap) {
    actionName = 'Automatic Repay'
  }

  // const actionDisabled = false

  const actionDisabled =
    (!swap &&
      !trade &&
      displayRepayValue.toBigNumber(assetDecimals).lte(0) &&
      displayRemoveValue.toBigNumber(collateralDecimals).lte(0) &&
      (!pinRemoveMax || pair.userCollateralShare.isZero())) ||
    warnings.some((warning) => warning.breaking)

  function resetRepayState() {
    setPinRepayMax(false)
    setPinRemoveMax(false)
    setRemoveCollateralValue('')
    setRepayAssetValue('')
  }

  // Handlers
  async function onExecute(cooker: UnderworldCooker) {
    let summary = ''

    if (swap && trade) {
      const share = toShare(pair.collateral, pair.userCollateralAmount.value)

      cooker.removeCollateral(pair.userCollateralShare, true)
      cooker.coffinTransferCollateral(pair.userCollateralShare, SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS[chainId || 1])
      cooker.repayShare(pair.userBorrowPart)

      const path = trade.route.path.map((token) => token.address) || []

      console.log('debug', [
        pair.collateral.address,
        pair.asset.address,
        maxAmountIn,
        path.length > 2 ? path[1] : AddressZero,
        path.length > 3 ? path[2] : AddressZero,
        account,
        pair.userCollateralShare,
      ])

      const data = defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
        [
          pair.collateral.address,
          pair.asset.address,
          maxAmountIn,
          path.length > 2 ? path[1] : AddressZero,
          path.length > 3 ? path[2] : AddressZero,
          account,
          pair.userCollateralShare,
        ]
      )

      cooker.action(
        SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS[chainId],
        ZERO,
        hexConcat([hexlify('0x3087d742'), data]),
        true,
        false,
        1
      )

      cooker.repayPart(pair.userBorrowPart, true)

      if (!useCoffinRemove) {
        cooker.coffinWithdrawCollateral(ZERO, BigNumber.from(-1))
      }

      summary = 'Repay All'
    } else {
      if (pinRepayMax && pair.userBorrowPart.gt(0) && balance.gte(pair.currentUserBorrowAmount.value)) {
        cooker.repayPart(pair.userBorrowPart, useCoffinRepay)
        summary = 'Repay Max'
      } else if (displayRepayValue.toBigNumber(assetDecimals).gt(0)) {
        cooker.repay(displayRepayValue.toBigNumber(assetDecimals), useCoffinRepay)
        summary = 'Repay'
      }
      if (
        Number(displayRemoveValue) > 0 ||
        (pinRemoveMax && pair.userCollateralShare.gt(0))
      ) {
        const share =
          pinRemoveMax &&
          (nextUserBorrowAmount.isZero() ||
            (pinRepayMax && pair.userBorrowPart.gt(0) && balance.gte(pair.currentUserBorrowAmount.value)))
            ? pair.userCollateralShare
            : toShare(pair.collateral, displayRemoveValue.toBigNumber(collateralDecimals))

        cooker.removeCollateral(displayRemoveValue.toBigNumber(collateralDecimals), useCoffinRemove)
        summary += (summary ? ' and ' : '') + 'Remove Collateral'
      }
    }

    resetRepayState()

    return summary
  }

  return (
    <>
      {/* <div className="mt-6 mb-4 text-3xl text-high-emphesis">Repay {assetSymbol}</div> */}

      <SmartNumberInput
        color="purple"
        token={pair.asset}
        value={displayRepayValue}
        setValue={setRepayAssetValue}
        useCoffinTitleDirection="down"
        useCoffinTitle={`Repay ${assetSymbol} from`}
        useCoffin={useCoffinRepay}
        setUseCoffin={setUseCoffinRepay}
        maxTitle={`${assetSymbol}`}
        max={balance}
        pinMax={pinRepayMax}
        setPinMax={setPinRepayMax}
        showMax={!swap && !pair.currentUserBorrowAmount.value.isZero()}
        disabled={swap || pair.currentUserBorrowAmount.value.isZero()}
        switchDisabled={swap || pair.currentUserBorrowAmount.value.isZero()}
      />

      <SmartNumberInput
        color="purple"
        token={pair.collateral}
        value={displayRemoveValue}
        setValue={setRemoveCollateralValue}
        useCoffinTitleDirection="up"
        useCoffinTitle={`Remove ${collateralSymbol} to`}
        useCoffin={true}
        setUseCoffin={setUseCoffinRemoveCollateral}
        max={nextMaxRemoveCollateral}
        pinMax={pinRemoveMax}
        setPinMax={setPinRemoveMax}
        showMax={
          pair.currentUserBorrowAmount.value.eq(displayRepayValue.toBigNumber(assetDecimals)) ||
          pair.currentUserBorrowAmount.value.isZero()
        }
        disabled={swap || pair.userCollateralShare.isZero()}
        switchDisabled={pair.userCollateralShare.isZero()}
      />

      {!pair.currentUserBorrowAmount.value.isZero() && (
        <SwapCheckbox
          trade={trade}
          color="purple"
          swap={swap}
          setSwap={(value: boolean) => {
            resetRepayState()
            setSwap(value)
          }}
          title={`Swap ${collateralSymbol} collateral for ${assetSymbol} and repay`}
          help="Swapping your removed collateral tokens and repay allows for reducing your borrow by using your collateral and/or to unwind leveraged positions."
        />
      )}

      {removeValueSet && (
        <ExchangeRateCheckBox
          pair={pair}
          updateOracle={updateOracle}
          setUpdateOracle={setUpdateOracle}
          desiredDirection="up"
        />
      )}

      <WarningsView warnings={warnings} />

      {swap && trade && <TradeReview trade={trade} allowedSlippage={allowedSlippage} />}

      {swap && (priceImpactSeverity < 3) && (
        <TransactionReviewView transactionReview={transactionReview} />
      )}

      <UnderworldApproveButton
        color="purple"
        content={(onCook: any) => (
          <TokenApproveButton value={displayRepayValue} token={assetToken} needed={!useCoffinRepay}>
            <Button 
              onClick={() => onCook(pair, onExecute)} disabled={actionDisabled} 
              className="w-full"
            >
              {actionName}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}