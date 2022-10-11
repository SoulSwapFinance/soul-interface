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
import AssetInput from 'components/AssetInput'
import LendAssetInput from 'components/LendAssetInput'
import usePriceApi from 'hooks/usePriceApi'
import { useUnderworldPairInfo } from 'hooks/useAPI'


interface BorrowProps {
  pair: any
}

const DEFAULT_UPDATE_ORACLE = true

export default function Borrow({ pair }: BorrowProps) {
  const { account, chainId } = useActiveWeb3React()

  // State
  // const [useCoffinCollateral, setUseCoffinCollateral] = useState<boolean>(Number(pair.coffinBalance) > 0)
  const [useCoffinCollateral, setUseCoffinCollateral] = useState<boolean>(false)
  const [useCoffinBorrow, setUseCoffinBorrow] = useState<boolean>(false)
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')
  const [swapBorrowValue, setSwapBorrowValue] = useState('')
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)
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

  const assetToken = useCurrency(pair.asset.address) || undefined
  const collateralToken = useCurrency(pair.collateral.address) || undefined
  // const coffinBoxContract = useCoffinBoxContract()

  const userBorrowAmount = pair.currentUserBorrowAmount.value // √
  const borrowAssetPrice = usePriceApi(pair?.asset.address) || undefined // √
  const userBorrowValue = userBorrowAmount * borrowAssetPrice // √

  const userCollateralBalance = pair.userCollateralShare // √
  const collateralAssetPrice = usePriceApi(pair?.collateral.address) || undefined // √
  const userCollateralValue = userCollateralBalance * collateralAssetPrice / 1e18

  const userCollateralAmount = Number(pair?.currentUserBorrowAmount.string / 1e18) // √
  // const collateralPrice = usePrice(pair?.collateral.address)
  // const borrowPrice = usePrice(pair?.asset.address)
  // const pairUtilization = (Number(userBorrowValue) 
  // / Number(userCollateralValue) 
  // / 10**collateralDecimals
  // ).toString().toBigNumber(collateralDecimals)

  // const pairHealth = pairUtilization.toString().toBigNumber(collateralDecimals)

  // √ CORRECT (displays borrowed amount)
  // console.log('userBorrowAmount:%s',Number(userBorrowAmount))
  // √ CORRECT (displays borrowed price)
  // console.log('borrowAssetPrice:%s',Number(borrowAssetPrice))
  // √ CORRECT (displays borrowed value)
  // console.log('userBorrowValue:%s',Number(userBorrowValue))

  // √ CORRECT (displays collateral amount)
  // console.log('userCollateralAmount:%s', Number(userCollateralAmount))
  // √ CORRECT (displays collateral price)
  // console.log('collateralAssetPrice:%s', collateralAssetPrice)
  // √ CORRECT (displays collateral amount)
  // console.log('userCollateralValue:%s', Number(userCollateralValue))

  // Calculated
  // @ts-ignore TYPE NEEDS FIXING
  const assetNative = WNATIVE[chainId].address === pair.collateral.address

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useETHBalances(assetNative ? [account] : [])
  // const { data: coffinBalance } = useCoffinBalanceV2(pair.collateral ? pair.collateral.address : undefined)
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
  //       [Field.OUTPUT]?.toFixed(collateralDecimals)
  //       .toBigNumber(collateralDecimals) || ZERO
  //   : ZERO;

  const swapCollateral = collateralValue.toString().toBigNumber(collateralDecimals)
  console.log('collateralValue: %s', Number(collateralValue))

  const nextUserCollateralValue = pair.userCollateralAmount.value
    .add(collateralValue.toString().toBigNumber(collateralDecimals))
    .add(extraCollateral)

    const nextUserBorrowValue = userBorrowAmount
    .add(borrowValue.toString().toBigNumber(collateralDecimals)).add(extraCollateral)

  const nextUserCollateralAmount = userCollateralBalance.add(BigNumber.from(nextUserCollateralValue))
  const nextUserBorrowAmount = userBorrowAmount.add(BigNumber.from(nextUserBorrowValue))

  // Calculate max borrow
  const nextMaxBorrowableOracle = nextUserCollateralValue.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate)
  const nextMaxBorrowableSpot = nextUserCollateralValue.mulDiv(e10(16).mul('75'), pair.spotExchangeRate)
  const nextMaxBorrowableStored = nextUserCollateralValue.mulDiv(e10(16).mul('75'),
    displayUpdateOracle ? pair.oracleExchangeRate : pair.currentExchangeRate
  )

  const nextMaxBorrowMinimum
    = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)
  // console.log('nextMaxBorrowableOracle:%s', Number(nextMaxBorrowableOracle))
  // console.log('nextMaxBorrowableSpot:%s', Number(nextMaxBorrowableSpot))
  // console.log('nextMaxBorrowableStored:%s', Number(nextMaxBorrowableStored))

  let nextMaxBorrowSafe
  userBorrowAmount <= 0
    ? nextMaxBorrowSafe
    = 0
    : nextMaxBorrowSafe = nextMaxBorrowMinimum.mulDiv('95', userBorrowAmount)

  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

  const maxBorrow = nextMaxBorrowPossible.toFixed(assetDecimals)
  const nextUserMaxBorrowAmount = (pair.maxBorrowable.safe.value).mul(-1)
  const nextBorrowValue = pair.currentUserBorrowAmount.value.add(userBorrowValue.toString().toBigNumber(assetDecimals))
  const nextHealth 
  = Number(nextUserBorrowValue / collateralDecimals)
    / Number(nextUserCollateralValue)
      / collateralDecimals
    

  // console logs
  // √ COLLATERAL INPUT
  // console.log('nextUserCollateralValue: %s', Number(nextUserCollateralValue))
  // √ COLLATERAL INPUT
  // console.log('nextUserCollateralAmount: %s', Number(nextUserCollateralAmount))
  // console.log('userCollateralBalance: %s', Number(userCollateralBalance))
  // console.log('userCollateralValue: %s', Number(userCollateralValue))
  // console.log('collateralBalance: %s', Number(collateralBalance))
  // console.log('nextMaxBorrowSafe: %s', Number(nextMaxBorrowSafe))
  // console.log('pair.currentUserBorrowAmount.value: %s', Number(pair.currentUserBorrowAmount.value))
  // console.log('nextMaxBorrowableOracle:%s', nextMaxBorrowableOracle)
  // console.log('nextMaxBorrowMinimum:%s', Number(nextMaxBorrowMinimum))
  // console.log('nextMaxBorrowableSpot:%s', nextMaxBorrowableSpot)
  const collateralValueSet = !collateralValue.toString().toBigNumber(collateralDecimals).isZero()

  const borrowValueSet = !borrowValue.toString().toBigNumber(assetDecimals).isZero()

  const trade = swap && borrowValueSet ? foundTrade : undefined

  const [isExpertMode] = useExpertModeManager()

  // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  const collateralWarnings = new Warnings()

  collateralWarnings.add(
    // wallet balance < resultant sum - current collateral
    Number(collateralBalance) < Number(nextUserCollateralAmount - Number(userCollateralBalance)),
    //.toString().toBigNumber(collateralDecimals)),
    `Ensure your ${useCoffinCollateral ? 'CoffinBox' : 'wallet'
    } balance is sufficient to deposit and try again.`,
    true
  )

  const borrowWarnings = new Warnings()
    .add(
      // 356636329935468600 < 25083547125509136000
      // Number(borrowValue) < Number(userBorrowAmount),
      // TODO: FIX TEST CONDITION
      false,
      'You have surpassed your borrow limit and may be liquidated. Repay or Add Collateral.',
      true,
      new Warning(
        Number(nextMaxBorrowSafe) < 0,
        'You have surpassed your borrow limit and assets are at a high risk of liquidation.',
        true,
        new Warning(
          Number(borrowValue) > 0
          && Number(userBorrowValue) < Number(nextMaxBorrowMinimum?.sub(pair.currentUserBorrowAmount.value)),
          "You don't have enough collateral to borrow this amount.",
          true,
          new Warning(
            Number(borrowValue) > 0
            && Number(userBorrowAmount) < Number(nextMaxBorrowSafe),
            'You will surpass your borrow limit and assets will be at a high risk of liquidation.',
            false
          )
        )
      )
    )
    .add(
      Number(borrowValue) > 0
      && nextMaxBorrowMinimum
        .add((collateralBalance || 0).toString().toBigNumber(collateralDecimals)
          .mul('75').div('100')).lt(borrowValue.toBigNumber(assetDecimals)),
      'Not enough liquidity in this pair.',
      true
    )
  console.log('nextMaxBorrowSafe:%s', Number(nextMaxBorrowSafe))
  console.log('userBorrowAmount:%s', Number(userBorrowAmount))
  console.log('nextMaxBorrowMinimum:%s', Number(nextMaxBorrowMinimum))
  // console.log('pair.currentUserBorrowAmount.value:%s', Number(pair.currentUserBorrowAmount.value))

  // console.log('Oracle Discrepancy', {
  //     name: assetSymbol + '-' + collateralSymbol,
  //     borrowValueSet: borrowValueSet,
  //     displayUpdateOracle: displayUpdateOracle,
  //     currentExchangeRate: pair.currentExchangeRate.toFixed(
  //         assetDecimals
  //     ),
  //     oracleExchangeRate: pair.oracleExchangeRate.toFixed(
  //         assetDecimals
  //     ),
  //     diff:
  //         pair.currentExchangeRate.toFixed(assetDecimals) /
  //         pair.oracleExchangeRate.toFixed(assetDecimals),
  // })

  const transactionReview = new TransactionReview()
  if ((collateralValue || borrowValue) && !collateralWarnings.broken
    && (!borrowWarnings.broken || !borrowValue)) {
    if (collateralValueSet) {
      transactionReview.addTokenAmount(
        'Collateral',
        userCollateralBalance,//pair.userCollateralAmount.value,
        nextUserCollateralAmount,
        pair.collateral
      )
      // transactionReview.addUSD(
      //   'Collateral USD',
      //   userCollateralBalance.div(e10(12)),
      //   // userCollateralValue.toString().toBigNumber(collateralDecimals),
      //   nextUserCollateralAmount.div(e10(12)),        pair.collateral
      // )
    }
    if (borrowValueSet) {
      transactionReview.addTokenAmount('Borrowed',
      pair.currentUserBorrowAmount.value,
      nextUserBorrowAmount.sub(pair.currentUserBorrowAmount.value),
      // (Number(nextUserBorrowAmount) / 1e18).toString().toBigNumber(assetDecimals),
        pair.asset)
      transactionReview.addUSD('Borrowed USD',
      pair.currentUserBorrowAmount.value.div(e10(12)),
      nextUserBorrowAmount.sub(pair.currentUserBorrowAmount.value).div(e10(12)),
        pair.asset)
    }
    // if (displayUpdateOracle) {
    //   transactionReview.addRate('Exchange Rate', pair.currentExchangeRate, pair.oracleExchangeRate, pair)
    // }
    // transactionReview.addTokenAmount(
    //   'Borrow Limit',
    //   nextUserMaxBorrowAmount,
    //   nextUserMaxBorrowAmount
    //     .add((nextMaxBorrowSafe).toString().toBigNumber(assetDecimals)),
    //   pair.asset
    // )
    // transactionReview.addPercentage(
    //   'Limit Used',
    //   pairUtilization,
    //   (nextHealth - (Number(pairUtilization) / 1e18)).toString().toBigNumber(collateralDecimals)
    // )
    // transactionReview.addPercentage('Borrow APR', pair.interestPerYear.value, pair.currentInterestPerYear.value)
  }

  let actionName = 'Enter Amounts'

  if (collateralValueSet) {
    if (borrowValueSet) {
      actionName = trade ? 'Borrow, Swap, Collateralize' : 'Collateralize and Borrow'
    } else {
      actionName = 'Add Collateral'
    }
  } else if (borrowValueSet) {
    actionName = trade ? 'Borrow, Swap, Collateralize' : `Borrow ${assetSymbol}`
  }

  if (swap && priceImpactSeverity > 3 && !isExpertMode) {
    actionName = 'Price Impact High'
  } else if (swap && priceImpactSeverity > 2) {
    actionName = actionName + ' anyway'
  }

  const actionDisabled =
    // (userCollateralValue.toString().toBigNumber(collateralDecimals).lte(0) &&
    //   userBorrowValue.toString().toBigNumber(assetDecimals).lte(0))
    // || 
    collateralWarnings.broken
    || (borrowValue.length > 0 && borrowWarnings.broken)
    || (swap && priceImpactSeverity > 3 && !isExpertMode)
    // || (userCollateralValue == 0  && !collateralValueSet)

  // Handlers
  async function onExecute(cooker: UnderworldCooker): Promise<string> {
    let summary = ''

    if (borrowValueSet) {
      if (displayUpdateOracle) {
        cooker.updateExchangeRate(true, ZERO, ZERO)
      }

      if (swap && !useCoffinCollateral) {
        cooker.coffinDepositCollateral(collateralValue.toString().toBigNumber(collateralDecimals))
      }

      cooker.borrow(
        borrowValue.toBigNumber(assetDecimals),
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
        toShare(pair.collateral, collateralValue.toString().toBigNumber(collateralDecimals)),
        borrowValue.toBigNumber(assetDecimals),
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
          toShare(pair.collateral, collateralValue.toString().toBigNumber(collateralDecimals)),
        ]
      )

      cooker.action(
        SOULSWAP_MULTISWAPPER_ADDRESS[chainId || 250],
        ZERO,
        hexConcat([hexlify('0x3087d742'), data]),
        false,
        true,
        1
      )
    }
    if (collateralValueSet) {
      cooker.addCollateral(
        swap ? BigNumber.from(-1) 
          : collateralValue.toString().toBigNumber(collateralDecimals),
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
      summary = trade ? 'Borrow, Swap, Collateralize' : `Borrow ${assetSymbol}`
    }

    return summary
  }

  function onMultiply(multiplier: string) {
    const multipliedCollateral = swapCollateral.add(
      swapCollateral.mulDiv(
        multiplier.toBigNumber(collateralDecimals),
        '1'.toBigNumber(collateralDecimals)
      )
    )

    const multipliedBorrow = multipliedCollateral.mulDiv(e10(16).mul('75'), pair.currentExchangeRate)

    // console.log({
    //     original: swapCollateral.toFixed(collateralDecimals),
    //     multiplied: swapCollateral
    //         .add(
    //             swapCollateral.mulDiv(
    //                 multiplier.toBigNumber(collateralDecimals),
    //                 '1'.toBigNumber(collateralDecimals)
    //             )
    //         )
    //         .toFixed(collateralDecimals),
    //     borrow: multipliedBorrow.toFixed(assetDecimals),
    // })

    // console.log('multipliedBorrow:', multipliedBorrow)

    setBorrowValue(multipliedBorrow.toFixed(assetDecimals))
  }

  return (
    <>
      {/* <div className="mt-6 mb-4 text-2xl text-high-emphesis">Borrow {assetSymbol}</div> */}

      {/* <div className="text-left text-purple text-primary mt-1 mb-1">{collateralSymbol} Collateral</div> */}
      <SmartNumberInput
        color="purple"
        token={pair.collateral}
        value={collateralValue.toString()}
        setValue={setCollateralValue}
        useCoffinTitleDirection="down"
        useCoffinTitle={`${collateralSymbol} Collateral`}
        useCoffin={useCoffinCollateral}
        setUseCoffin={setUseCoffinCollateral}
        maxTitle={`${collateralSymbol}`}
        max={collateralBalance}
        showMax={true}
      />
      {/* <LendAssetInput
        size="sm"
        id="add-collateral-input-tokena"
        value={collateralValue}
        currency={collateralToken}
        onChange={setCollateralValue}
        className="!mt-0"
        showMax={true}
        spendFromWallet={!useCoffinCollateral}
      /> */}

      {/* <div className="text-left text-purple text-primary mt-1 mb-1">Borrow {assetSymbol}</div> */}
      <SmartNumberInput
        color="purple"
        token={pair.asset}
        value={borrowValue}
        setValue={setBorrowValue}
        useCoffinTitleDirection="up"
        useCoffinTitle={`Borrow ${assetSymbol}`}
        useCoffin={useCoffinBorrow}
        setUseCoffin={setUseCoffinBorrow}
        maxTitle={`${assetSymbol}`}
        max={nextMaxBorrowPossible}
        showMax={true}
        />
        {/* <LendAssetInput
          size="sm"
          id="add-collateral-input-tokenb"
          value={borrowValue}
          currency={assetToken}
          onChange={setBorrowValue}
          className="!mt-0"
          showMax={true}
          spendFromWallet={!useCoffinBorrow}
        /> */}

      {collateralValueSet && (
        <SwapCheckbox
          trade={trade}
          color="purple"
          swap={swap}
          setSwap={setSwap}
          title={`Swap Borrowed ${assetSymbol}`}
          // title={`Swap borrowed ${assetSymbol} for ${collateralSymbol} collateral`}
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
        (borrowValueSet && userCollateralAmount > 0) ||
        (swap && (priceImpactSeverity < 3 || isExpertMode))) && (
          <TransactionReviewView transactionReview={transactionReview} />
        )}

      <UnderworldApproveButton
        color="purple"
        content={(onCook: any) => (
          <TokenApproveButton value={collateralValue} token={collateralToken} needed={!useCoffinCollateral}>
            <Button onClick={() => onCook(pair, onExecute)} 
            disabled={actionDisabled} 
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