import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { hexConcat, hexlify } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { SOULSWAP_MULTISWAPPER_ADDRESS, WNATIVE } from 'sdk'
import { Button } from 'components/Button'
import UnderworldCooker from 'entities/UnderworldCooker'
import { TransactionReview } from 'entities/TransactionReview'
import { Warning, Warnings } from 'entities/Warnings'
import { toShare } from 'functions/coffinbox'
import { e10, maximum, minimum, ZERO } from 'functions/math'
import { tryParseAmount } from 'functions/parse'
import { computeRealizedLPFeePercent, warningSeverity } from 'functions/prices'
import { useCurrency } from 'hooks/Tokens'
import { useV2TradeExactIn } from 'hooks/useV2Trades'
import { useActiveWeb3React } from 'services/web3'
import { useAppSelector } from 'state/hooks'
import { selectSlippage } from 'state/slippage/slippageSlice'
import { useExpertModeManager } from 'state/user/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import React, { useMemo, useState } from 'react'

import { UnderworldApproveButton, TokenApproveButton } from '../components/Button'
import { SwapCheckbox } from '../components/Checkbox'
import SmartNumberInput from '../components/SmartNumberInput'
import TradeReview from '../components/TradeReview'
import TransactionReviewView from '../components/TransactionReview'
import WarningsView from '../components/WarningsList'
import { usePrice } from 'hooks'


interface BorrowProps {
  pair: any
}

const DEFAULT_UPDATE_ORACLE = true

export default function Borrow({ pair }: BorrowProps) {
  const { account, chainId } = useActiveWeb3React()

  // State
  // const [useCoffinCollateral, setUseCoffinCollateral] = useState<boolean>(Number(pair.collateral.coffinBalance) > 0)
  const [useCoffinCollateral, setUseCoffinCollateral] = useState<boolean>(false)
  const [useCoffinBorrow, setUseCoffinBorrow] = useState<boolean>(true)
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [swapBorrowValue, setSwapBorrowValue] = useState('')
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)

  const assetToken = useCurrency(pair.asset.address) || undefined
  const collateralToken = useCurrency(pair.collateral.address) || undefined
  
  const userBorrowAmount = pair.currentUserBorrowAmount.value // √
  const borrowAssetPrice = usePrice(pair.asset.address) || undefined // √
  const userBorrowValue = userBorrowAmount * borrowAssetPrice // √
  
  const userCollateralBalance = pair.userCollateralShare // √
  const collateralAssetPrice = usePrice(pair.collateral.address) || undefined // √
  const userCollateralValue = userCollateralBalance * collateralAssetPrice // √

    // √ CORRECT (displays borrowed amount)
  // console.log('userBorrowAmount:%s',Number(userBorrowAmount))
    // √ CORRECT (displays borrowed price)
  // console.log('borrowAssetPrice:%s',Number(borrowAssetPrice))
    // √ CORRECT (displays borrowed value)
  // console.log('userBorrowValue:%s',Number(userBorrowValue))

    // √ CORRECT (displays collateral amount)
  // console.log('userCollateralBalance:%s', Number(userCollateralBalance))
    // √ CORRECT (displays collateral price)
  // console.log('collateralAssetPrice:%s', collateralAssetPrice)
    // √ CORRECT (displays collateral amount)
  // console.log('userCollateralValue:%s', Number(userCollateralValue))

  // Calculated
  // @ts-ignore TYPE NEEDS FIXING
  const assetNative = WNATIVE[chainId].address === pair.collateral.address

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account] : [])

  // balance of the collateral token in wallet.
  const collateralBalance = useCoffinCollateral
    ? pair.collateral.coffinBalance
    : assetNative
    ? // @ts-ignore TYPE NEEDS FIXING
      BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
    : pair.collateral.balance

  const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true

  const allowedSlippage = useAppSelector(selectSlippage)

  const parsedAmount = tryParseAmount(borrowValue, assetToken)

  const foundTrade = useV2TradeExactIn(parsedAmount, collateralToken)

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!foundTrade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(foundTrade)
    // @ts-ignore TYPE NEEDS FIXING
    const realizedLPFee = foundTrade.inputAmount.multiply(realizedLpFeePercent)
    // @ts-ignore TYPE NEEDS FIXING
    const priceImpact = foundTrade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [foundTrade])

  // const borrowAmount = pair.currentUserBorrowAmount.value

  const extraCollateral =
    swap && foundTrade ? BigNumber.from(foundTrade.minimumAmountOut(allowedSlippage).quotient.toString()) : ZERO

  // const extraCollateral = swap
  //   ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
  //       [Field.OUTPUT]?.toFixed(pair.collateral.tokenInfo.decimals)
  //       .toBigNumber(pair.collateral.tokenInfo.decimals) || ZERO
  //   : ZERO;

  const swapCollateral = collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals)
  console.log('collateralValue: %s', Number(collateralValue))

  const nextUserCollateralValue = pair.userCollateralAmount.value
    .add(collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals))
    .add(extraCollateral)

  // Calculate max borrow
  const nextMaxBorrowableOracle = nextUserCollateralValue.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate)
  const nextMaxBorrowableSpot = nextUserCollateralValue.mulDiv(e10(16).mul('75'), pair.spotExchangeRate)
  const nextMaxBorrowableStored = nextUserCollateralValue.mulDiv(e10(16).mul('75'),
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
  )

  const nextMaxBorrowMinimum 
    = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
    // 189763349269417620000 || 189 // ALL SAME
    // console.log('nextMaxBorrowableOracle:%s', Number(nextMaxBorrowableOracle))
    // console.log('nextMaxBorrowableSpot:%s', Number(nextMaxBorrowableSpot))
    // console.log('nextMaxBorrowableStored:%s', Number(nextMaxBorrowableStored))

  const nextMaxBorrowSafe = nextMaxBorrowMinimum.mul(95).div(pair.currentUserBorrowAmount.value)

  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

  const maxBorrow = nextMaxBorrowPossible.toFixed(pair.asset.tokenInfo.decimals)

  const nextBorrowValue = pair.currentUserBorrowAmount.value.add(userBorrowValue.toString().toBigNumber(pair.asset.tokenInfo.decimals))
  const nextHealth = nextBorrowValue.mulDiv('1000000000000000000', nextMaxBorrowMinimum)

  // console logs
  // √ COLLATERAL INPUT
  // console.log('nextUserCollateralValue: %s', Number(nextUserCollateralValue))
  console.log('nextMaxBorrowSafe: %s', Number(nextMaxBorrowSafe))
  console.log('pair.currentUserBorrowAmount.value: %s', Number(pair.currentUserBorrowAmount.value))
  // console.log('nextMaxBorrowableOracle:%s', nextMaxBorrowableOracle)
  // console.log('nextMaxBorrowMinimum:%s', Number(nextMaxBorrowMinimum))
  // console.log('nextMaxBorrowableSpot:%s', nextMaxBorrowableSpot)
  const collateralValueSet = !collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals).isZero()

  const borrowValueSet = !borrowValue.toString().toBigNumber(pair.asset.tokenInfo.decimals).isZero()

  const trade = swap && borrowValueSet ? foundTrade : undefined

  const [isExpertMode] = useExpertModeManager()

  // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  const collateralWarnings = new Warnings()

  collateralWarnings.add(
    Number(userCollateralBalance) < Number(collateralValue), //.toString().toBigNumber(pair.collateral.tokenInfo.decimals)),
    `Please make sure your ${
      useCoffinCollateral ? 'CoffinBox' : 'wallet'
    } balance is sufficient to deposit and then try again.`,
    true
  )

  const borrowWarnings = new Warnings()
    .add(
      // 3949472447368421000 < 25083493774619406000
      nextMaxBorrowMinimum.lt(pair.currentUserBorrowAmount.value),
      'You have surpassed your borrow limit and may be liquidated. Repay or Add Collateral.',
      true,
      new Warning(
        nextMaxBorrowSafe.lt(0),
        'You have surpassed your borrow limit and assets are at a high risk of liquidation.',
        true,
        new Warning(
          borrowValue.length > 0 && userBorrowAmount.gt(nextMaxBorrowMinimum.sub(pair.currentUserBorrowAmount.value)),
          "You don't have enough collateral to borrow this amount.",
          true,
          new Warning(
            borrowValue.length > 0 && userBorrowAmount.gt(nextMaxBorrowSafe),
            'You will surpass your borrow limit and assets will be at a high risk of liquidation.',
            false
          )
        )
      )
    )
    .add(
      borrowValue.length > 0 && pair.maxAssetAvailable.lt(borrowValue.toBigNumber(pair.asset.tokenInfo.decimals)),
      'Not enough liquidity in this pair.',
      true
    )
    // console.log('nextMaxBorrowSafe:%s', Number(nextMaxBorrowSafe))
    // console.log('nextMaxBorrowMinimum:%s', Number(nextMaxBorrowMinimum))
    // console.log('pair.currentUserBorrowAmount.value:%s', Number(pair.currentUserBorrowAmount.value))

  // console.log('Oracle Discrepancy', {
  //     name: pair.asset.tokenInfo.symbol + '-' + pair.collateral.tokenInfo.symbol,
  //     borrowValueSet: borrowValueSet,
  //     displayUpdateOracle: displayUpdateOracle,
  //     currentExchangeRate: pair.currentExchangeRate.toFixed(
  //         pair.asset.tokenInfo.decimals
  //     ),
  //     oracleExchangeRate: pair.oracleExchangeRate.toFixed(
  //         pair.asset.tokenInfo.decimals
  //     ),
  //     diff:
  //         pair.currentExchangeRate.toFixed(pair.asset.tokenInfo.decimals) /
  //         pair.oracleExchangeRate.toFixed(pair.asset.tokenInfo.decimals),
  // })

  const transactionReview = new TransactionReview()
  if ((collateralValue || borrowValue) && !collateralWarnings.broken) {
  // && (!borrowWarnings.broken || !borrowValue)) {
    if (collateralValueSet) {
      transactionReview.addTokenAmount(
        'Collateral',
        pair.userCollateralAmount.value,
        nextUserCollateralValue,
        pair.collateral
      )
      transactionReview.addUSD(
        'Collateral USD',
        pair.userCollateralAmount.value,
        nextUserCollateralValue,
        pair.collateral
      )
    }
    if (borrowValueSet) {
      transactionReview.addTokenAmount('Borrowed', pair.currentUserBorrowAmount.value, nextBorrowValue, pair.asset)
      transactionReview.addUSD('Borrowed USD', pair.currentUserBorrowAmount.value, nextBorrowValue, pair.asset)
    }
    if (displayUpdateOracle) {
      transactionReview.addRate('Exchange Rate', pair.currentExchangeRate, pair.oracleExchangeRate, pair)
    }
    transactionReview.addTokenAmount(
      'Borrow Limit',
      pair.maxBorrowable.safe.value,
      nextMaxBorrowSafe.sub(borrowValue.toString().toBigNumber(pair.asset.tokenInfo.decimals)),
      pair.asset
    )
    transactionReview.addPercentage('Limit Used', pair.health.value, nextHealth)
    transactionReview.addPercentage('Borrow APR', pair.interestPerYear.value, pair.currentInterestPerYear.value)
  }

  let actionName = 'Enter Amounts'

  if (collateralValueSet) {
    if (borrowValueSet) {
      actionName = trade ? 'Borrow, Swap, Collateralize' : 'Collateralize and Borrow'
    } else {
      actionName = 'Add collateral'
    }
  } else if (borrowValueSet) {
    actionName = trade ? 'Borrow, Swap, Collateralize' : 'Borrow'
  }

  if (swap && priceImpactSeverity > 3 && !isExpertMode) {
    actionName = 'Price Impact High'
  } else if (swap && priceImpactSeverity > 2) {
    actionName = actionName + ' anyway'
  }

  const actionDisabled =
    (collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals).lte(0) &&
      borrowValue.toString().toBigNumber(pair.asset.tokenInfo.decimals).lte(0)) ||
    collateralWarnings.broken ||
    (borrowValue.length > 0 && borrowWarnings.broken) ||
    (swap && priceImpactSeverity > 3 && !isExpertMode) ||
    (pair.userCollateralAmount.value.isZero() && !collateralValueSet)

  // Handlers
  async function onExecute(cooker: UnderworldCooker): Promise<string> {
    let summary = ''

    if (borrowValueSet) {
      if (displayUpdateOracle) {
        cooker.updateExchangeRate(true, ZERO, ZERO)
      }

      if (swap && !useCoffinCollateral) {
        cooker.coffinDepositCollateral(collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals))
      }

      cooker.borrow(
        borrowValue.toBigNumber(pair.asset.tokenInfo.decimals),
        swap || useCoffinBorrow,
        swap ? SOULSWAP_MULTISWAPPER_ADDRESS[chainId || 250] : ''
      )
    }
    if (borrowValueSet && trade) {
      const path = trade.route.path.map((token) => token.address) || []

      if (path.length > 4) {
        throw 'Path too long'
      }

      console.log('debug', [
        pair.asset.address,
        pair.collateral.address,
        extraCollateral,
        path.length > 2 ? path[1] : AddressZero,
        path.length > 3 ? path[2] : AddressZero,
        account,
        toShare(pair.collateral, collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals)),
        borrowValue.toBigNumber(pair.asset.tokenInfo.decimals),
      ])

      const data = defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
        [
          pair.asset.address,
          pair.collateral.address,
          extraCollateral,
          path.length > 2 ? path[1] : AddressZero,
          path.length > 3 ? path[2] : AddressZero,
          account,
          toShare(pair.collateral, collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals)),
        ]
      )

      cooker.action(
        SOULSWAP_MULTISWAPPER_ADDRESS[chainId || 1],
        ZERO,
        hexConcat([hexlify('0x3087d742'), data]),
        false,
        true,
        1
      )
    }
    if (collateralValueSet) {
      cooker.addCollateral(
        swap ? BigNumber.from(-1) : collateralValue.toString().toBigNumber(pair.collateral.tokenInfo.decimals),
        useCoffinCollateral || swap
      )
    }

    if (collateralValueSet) {
      if (borrowValueSet) {
        summary = trade ? 'Borrow, Swap, Collateralize' : 'Collateralize and Borrow'
      } else {
        summary = 'Add Collateral'
      }
    } else if (borrowValueSet) {
      summary = trade ? 'Borrow, Swap, Collateralize' : 'Borrow'
    }

    return summary
  }

  function onMultiply(multiplier: string) {
    const multipliedCollateral = swapCollateral.add(
      swapCollateral.mulDiv(
        multiplier.toBigNumber(pair.collateral.tokenInfo.decimals),
        '1'.toBigNumber(pair.collateral.tokenInfo.decimals)
      )
    )

    const multipliedBorrow = multipliedCollateral.mulDiv(e10(16).mul('75'), pair.currentExchangeRate)

    // console.log({
    //     original: swapCollateral.toFixed(pair.collateral.tokenInfo.decimals),
    //     multiplied: swapCollateral
    //         .add(
    //             swapCollateral.mulDiv(
    //                 multiplier.toBigNumber(pair.collateral.tokenInfo.decimals),
    //                 '1'.toBigNumber(pair.collateral.tokenInfo.decimals)
    //             )
    //         )
    //         .toFixed(pair.collateral.tokenInfo.decimals),
    //     borrow: multipliedBorrow.toFixed(pair.asset.tokenInfo.decimals),
    // })

    // console.log('multipliedBorrow:', multipliedBorrow)

    setBorrowValue(multipliedBorrow.toFixed(pair.asset.tokenInfo.decimals))
  }

  return (
    <>
      <div className="mt-6 mb-4 text-3xl text-high-emphesis">Borrow {pair.asset.tokenInfo.symbol}</div>

      <SmartNumberInput
        color="purple"
        token={pair.collateral}
        value={collateralValue.toString()}
        setValue={setCollateralValue}
        useCoffinTitleDirection="down"
        useCoffinTitle={`${pair.collateral.tokenInfo.symbol} Collateral`}
        useCoffin={useCoffinCollateral}
        setUseCoffin={setUseCoffinCollateral}
        maxTitle={`${pair.collateral.tokenInfo.symbol}`}
        max={collateralBalance}
        showMax={true}
      />

      <SmartNumberInput
        color="purple"
        token={pair.asset}
        value={borrowValue}
        setValue={setBorrowValue}
        useCoffinTitleDirection="up"
        useCoffinTitle={`Borrow ${pair.asset.tokenInfo.symbol} to`}
        useCoffin={useCoffinBorrow}
        setUseCoffin={setUseCoffinBorrow}
        maxTitle={`${pair.asset.tokenInfo.symbol}`}
        max={Number(nextMaxBorrowPossible)}
        showMax={true}
      />

      {collateralValueSet && (
        <SwapCheckbox
          trade={trade}
          color="purple"
          swap={swap}
          setSwap={setSwap}
          title={`Swap Borrowed ${pair.asset.tokenInfo.symbol}`}
          // title={`Swap borrowed ${pair.asset.tokenInfo.symbol} for ${pair.collateral.tokenInfo.symbol} collateral`}
          help="Swapping your borrowed tokens for collateral allows for opening long/short positions with leverage in a single transaction."
        />
      )}

      {/* {borrowValueSet && (
        <ExchangeRateCheckBox
          pair={pair}
          updateOracle={updateOracle}
          setUpdateOracle={setUpdateOracle}
          desiredDirection="up"
        />
      )} */}

      {collateralValueSet && (
        <>
          <div className="flex mb-4">
            {['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2.0'].map((multipler, i) => (
              <Button
                variant="outlined"
                size="xs"
                color="purple"
                key={i}
                onClick={() => {
                  onMultiply(multipler)
                  setSwap(true)
                }}
                className="mr-0.5 sm:mr-4 text-md focus:ring-purple"
              >
                {multipler}x
              </Button>
            ))}
            {/* <div className="mb-4">
            {/* <div className="mb-4">
              <input
                  type="range"
                  onChange={e => {
                      onMultiply(e.target.value)
                  }}
                  min="0"
                  max="2"
                  step="0.01"
                  className="w-full slider"
                  color="purple"
              />
              <div className="flex justify-between w-full px-2 text-center">
                  <div className="font-semibold">1.5x</div>
                  <div className="font-semibold">3x</div>
                  <div className="font-semibold">4.5x</div>
              </div>
          </div> */}
        </div>
        </>
      )}

      <WarningsView warnings={collateralWarnings}></WarningsView>

      <WarningsView warnings={borrowWarnings}></WarningsView>

      {swap && trade && <TradeReview trade={trade} allowedSlippage={allowedSlippage} />}

      {(collateralValueSet ||
        (borrowValueSet && !pair.userCollateralAmount.value.isZero()) ||
        (swap && (priceImpactSeverity < 3 || isExpertMode))) && (
        <TransactionReviewView transactionReview={transactionReview} />
      )}

      <UnderworldApproveButton
        color="purple"
        content={(onCook: any) => (
          <TokenApproveButton value={collateralValue} token={collateralToken} needed={!useCoffinCollateral}>
            <Button onClick={() => onCook(pair, onExecute)} disabled={actionDisabled} fullWidth={true}>
              {actionName}
            </Button>
          </TokenApproveButton>
        )}
      />
    </>
  )
}