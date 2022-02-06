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
import { useExpertModeManager, useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import React, { useMemo, useState } from 'react'

import { UnderworldApproveButton, TokenApproveButton } from '../components/Button'
import { SwapCheckbox } from '../components/Checkbox'
import SmartNumberInput from '../components/SmartNumberInput'
import TradeReview from '../components/TradeReview'
import TransactionReviewView from '../components/TransactionReview'
import WarningsView from '../components/WarningsList'

interface RepayProps {
  pair: any
}

const DEFAULT_UNDERWORLD_REPAY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

const DEFAULT_UPDATE_ORACLE = true

export default function Repay({ pair }: RepayProps) {
  const { account, chainId } = useActiveWeb3React()
  let multiplier = 1e16 * 75

  // State
  const [useCoffinRepay, setUseCoffinRepay] = useState<boolean>(pair.asset.coffinBalance > 0)
  const [useCoffinRemove, setUseCoffinRemoveCollateral] = useState<boolean>(true)

  const [repayValue, setRepayAssetValue] = useState('')
  const [removeValue, setRemoveCollateralValue] = useState('')
  const [pinRemoveMax, setPinRemoveMax] = useState(false)
  const [pinRepayMax, setPinRepayMax] = useState(false)
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)

  const assetToken = useCurrency(pair.asset.address) || undefined
  const collateralToken = useCurrency(pair.collateral.address) || undefined

  // Calculated
  const assetNative = WNATIVE[chainId || 1].address === pair.asset.address
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  console.log({ pair })

  const balance = useCoffinRepay
    ? toAmount(pair.asset, pair.asset.coffinBalance)
    : assetNative
    ? BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.asset.balance

  const displayUpdateOracle = pair.currentExchangeRate > 0 ? updateOracle : true

  const displayRepayValue = pinRepayMax
    ? minimum(pair.currentUserBorrowAmount.value, balance).toFixed(pair.asset.tokenInfo.decimals)
    : repayValue

  const nextUserBorrowAmount = pair.currentUserBorrowAmount.value - Number(displayRepayValue)

  const nextMinCollateralOracle 
    = nextUserBorrowAmount * pair.oracleExchangeRate / multiplier

  const nextMinCollateralSpot 
    = nextUserBorrowAmount * pair.spotExchangeRate / multiplier
  
  const nextMinCollateralStored 
    = nextUserBorrowAmount *
      Number(displayUpdateOracle) ? pair.oracleExchangeRate : pair.currentExchangeRate
      / multiplier

  const nextMinCollateralMinimum 
    // = maximum(nextMinCollateralOracle, nextMinCollateralSpot, nextMinCollateralStored)
    = nextMinCollateralOracle > nextMinCollateralSpot
    && nextMinCollateralOracle > nextMinCollateralStored
    ? nextMinCollateralOracle
    : nextMinCollateralSpot > nextMinCollateralOracle
    && nextMinCollateralSpot > nextMinCollateralStored
    ? nextMinCollateralSpot
    : nextMinCollateralStored

  let removeCollatoral = pair.userCollateralAmount.value - Number(nextMinCollateralMinimum) * 100 / 95
  const nextMaxRemoveCollateral = removeCollatoral > 0 ? removeCollatoral : 0

  const maxRemoveCollateral 
    = nextMaxRemoveCollateral

  const displayRemoveValue = pinRemoveMax ? maxRemoveCollateral : removeValue

  // Swap
  // const [allowedSlippage] = useUserSlippageTolerance(); // 10 = 0.1%
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_UNDERWORLD_REPAY_SLIPPAGE_TOLERANCE)

  const parsedAmount = tryParseAmount(pair.currentUserBorrowAmount.string, assetToken)

  const trade = useV2TradeExactOut(collateralToken, parsedAmount) || undefined

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [trade])

  // const maxAmountIn = swap
  //   ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
  //       [Field.INPUT]?.toFixed(pair.collateral.tokenInfo.decimals)
  //       .toBigNumber(pair.collateral.tokenInfo.decimals) || ZERO
  //   : ZERO;

  const maxAmountIn =
    swap && trade
      ? trade
          .maximumAmountIn(allowedSlippage)
          .toFixed(pair.collateral.tokenInfo.decimals)
          .toBigNumber(pair.collateral.tokenInfo.decimals)
      : ZERO

  // const nextUserCollateralValue = pair.userCollateralAmount.value + Number(collateralValue) + Number(extraCollateral)

  const nextUserCollateralAmount 
  = pair.userCollateralAmount.value 
    - Number(displayRemoveValue)

  const nextMaxBorrowableOracle 
    = nextUserCollateralAmount * multiplier / pair.oracleExchangeRate
  
  const nextMaxBorrowableSpot 
    = nextUserCollateralAmount * multiplier / pair.spotExchangeRate
  
  const nextMaxBorrowableStored 
    = nextUserCollateralAmount * multiplier / 
    Number(displayUpdateOracle) ? pair.oracleExchangeRate : pair.currentExchangeRate

  const nextMaxBorrowMinimum 
    // = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
    = nextMaxBorrowableOracle < nextMaxBorrowableSpot
    && nextMaxBorrowableOracle < nextMaxBorrowableStored ? nextMaxBorrowableOracle
    : nextMaxBorrowableSpot < nextMaxBorrowableOracle
    && nextMaxBorrowableSpot < nextMaxBorrowableStored ? nextMaxBorrowableSpot
    : nextMaxBorrowableStored

  const nextMaxBorrowSafe 
    = nextMaxBorrowMinimum * 95 / 100 - pair.currentUserBorrowAmount.value

  let minBorrow = nextMaxBorrowSafe < pair.maxAssetAvailable ? nextMaxBorrowSafe : pair.maxAssetAvailable
  const nextMaxBorrowPossible = minBorrow > 0 ? minBorrow : 0

  const nextHealth = pair.currentUserBorrowAmount.value
    - Number(displayRepayValue)
    * 1000000000000000000 
    / nextMaxBorrowMinimum

  const transactionReview = new TransactionReview()

  if (displayRepayValue || displayRemoveValue) {
    transactionReview.addTokenAmount(
      'Borrow Limit',
      pair.maxBorrowable.safe.value,
      Number(nextMaxBorrowSafe) + Number(displayRepayValue),
      pair.asset
    )
    transactionReview.addPercentage('Health', pair.health.value, nextHealth)
  }

  let maxCollatoral 
    // = maximum(pair.userCollateralAmount.value.sub(nextMinCollateralMinimum), ZERO)
    = pair.userCollatoralAmount - Number(nextMinCollateralMinimum) > 0 ?
    pair.userCollatoralAmount - Number(nextMinCollateralMinimum) : 0

  const warnings = new Warnings()
    .addError(
      assetNative && !useCoffinRepay && pinRepayMax,
      `You cannot MAX repay ${pair.asset.tokenInfo.symbol} directly from your wallet. Please deposit your ${pair.asset.tokenInfo.symbol} into the CoffinBox first, then repay. Because your debt is slowly accrueing interest we can't predict how much it will be once your transaction gets mined.`
    )
    .addError(
      displayRemoveValue > (pair.userCollateralAmount.value),
      'You have insufficient collateral. Please enter a smaller amount or repay more.'
    )
    .addError(
      displayRepayValue > pair.currentUserBorrowAmount.value,
      "You can't repay more than you owe. To fully repay, please click the 'max' button.",
      new Warning(
        balance < displayRepayValue,
        `Please make sure your ${
          useCoffinRepay ? 'CoffinBox' : 'wallet'
        } balance is sufficient to repay and then try again.`,
        true
      )
    )
    .addError(
      Number(displayRemoveValue) > maxCollatoral,
      'Removing this much collateral would put you into insolvency.',
      new Warning(
        Number(displayRemoveValue) > Number(nextMaxRemoveCollateral),
        'Removing this much collateral would put you very close to insolvency.'
      )
    )

  const removeValueSet =
    displayRemoveValue != 0 ||
    (pinRemoveMax && pair.userCollateralShare.gt(ZERO))

  const repayValueSet = !displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals).isZero()

  // const trade = swap ? foundTrade : undefined;
  // const trade = swap && removeValueSet ? foundTrade : undefined

  const [isExpertMode] = useExpertModeManager()

  // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  let actionName = 'Enter Amount'

  if (removeValueSet) {
    if (repayValueSet) {
      actionName = 'Repay and remove collateral'
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
      Number(displayRepayValue) <= 0 &&
      displayRemoveValue <= 0 &&
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
        SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS[chainId || 1],
        ZERO,
        hexConcat([hexlify('0x3087d742'), data]),
        true,
        false,
        1
      )

      cooker.repayPart(pair.userBorrowPart, true)

      if (!useCoffinRemove) {
        cooker.coffinWithdrawCollateral(0, -1)
      }

      summary = 'Repay All'
    } else {
      if (pinRepayMax && pair.userBorrowPart > 0 && balance >= pair.currentUserBorrowAmount.value) {
        cooker.repayPart(pair.userBorrowPart, useCoffinRepay)
        summary = 'Repay Max'
      } else if (displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals).gt(0)) {
        cooker.repay(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals), useCoffinRepay)
        summary = 'Repay'
      }
      if (
        displayRemoveValue > 0 ||
        (pinRemoveMax && pair.userCollateralShare > 0)
      ) {
        const share =
          pinRemoveMax &&
          (nextUserBorrowAmount == 0 ||
            (pinRepayMax && pair.userBorrowPart > 0 && balance >= pair.currentUserBorrowAmount.value))
            ? pair.userCollateralShare
            : toShare(pair.collateral, 
              Number(displayRemoveValue))
        cooker.removeCollateral(share, useCoffinRemove)
        summary += (summary ? ' and ' : '') + 'Remove Collateral'
      }
    }

    resetRepayState()
    return summary
  }

  return (
    <>
      <div className="mt-6 mb-4 text-3xl text-high-emphesis">Repay {pair.asset.tokenInfo.symbol}</div>

      <SmartNumberInput
        color="pink"
        token={pair.asset}
        value={displayRepayValue}
        setValue={setRepayAssetValue}
        useCoffinTitleDirection="down"
        useCoffinTitle={`Repay ${pair.asset.tokenInfo.symbol} from`}
        useCoffin={useCoffinRepay}
        setUseCoffin={setUseCoffinRepay}
        maxTitle="Balance"
        max={balance}
        pinMax={pinRepayMax}
        setPinMax={setPinRepayMax}
        showMax={!swap && !pair.currentUserBorrowAmount.value.isZero()}
        disabled={swap || pair.currentUserBorrowAmount.value.isZero()}
        switchDisabled={swap || pair.currentUserBorrowAmount.value.isZero()}
      />

      <SmartNumberInput
        color="pink"
        token={pair.collateral}
        value={displayRemoveValue.toString()}
        setValue={setRemoveCollateralValue}
        useCoffinTitleDirection="up"
        useCoffinTitle={`Remove ${pair.collateral.tokenInfo.symbol} to`}
        useCoffin={useCoffinRemove}
        setUseCoffin={setUseCoffinRemoveCollateral}
        max={nextMaxRemoveCollateral}
        pinMax={pinRemoveMax}
        setPinMax={setPinRemoveMax}
        showMax={
          pair.currentUserBorrowAmount.value.eq(displayRepayValue.toBigNumber(pair.asset.tokenInfo.decimals)) ||
          pair.currentUserBorrowAmount.value.isZero()
        }
        disabled={swap || pair.userCollateralAmount.value == 0}
        switchDisabled={pair.userCollateralAmount.value == 0}
      />

      {!pair.currentUserBorrowAmount.value.isZero() && (
        <SwapCheckbox
          trade={trade}
          color="pink"
          swap={swap}
          setSwap={(value: boolean) => {
            resetRepayState()
            setSwap(value)
          }}
          title={`Swap ${pair.collateral.tokenInfo.symbol} collateral for ${pair.asset.tokenInfo.symbol} and repay`}
          help="Swapping your removed collateral tokens and repay allows for reducing your borrow by using your collateral and/or to unwind leveraged positions."
        />
      )}

      {/* {removeValueSet && (
        <ExchangeRateCheckBox
          pair={pair}
          updateOracle={updateOracle}
          setUpdateOracle={setUpdateOracle}
          desiredDirection="up"
        />
      )} */}

      <WarningsView warnings={warnings} />

      {swap && trade && <TradeReview trade={trade} allowedSlippage={allowedSlippage} />}

      {swap && (priceImpactSeverity < 3 || isExpertMode) && (
        <TransactionReviewView transactionReview={transactionReview} />
      )}

      <UnderworldApproveButton
        color="pink"
        content={(onCook: any) => (
          <TokenApproveButton value={displayRepayValue} token={assetToken} needed={!useCoffinRepay}>
            <Button onClick={() => onCook(pair, onExecute)} disabled={actionDisabled} fullWidth={true}>
              {actionName}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}