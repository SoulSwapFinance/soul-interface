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
import { useETHBalances } from 'state/wallet/hooks'
import React, { useMemo, useState } from 'react'

import { UnderworldApproveButton, TokenApproveButton } from '../components/Button'
import { SwapCheckbox } from '../components/Checkbox'
import SmartNumberInput from '../components/SmartNumberInput'
import TradeReview from '../components/TradeReview'
import TransactionReviewView from '../components/TransactionReview'
import WarningsView from '../components/WarningsList'
import usePriceApi from 'hooks/usePriceApi'
import { useUnderworldPairInfo, useUnderworldUserInfo, useUserTokenInfo } from 'hooks/useAPI'


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
  const [collateralValue, setCollateralValue] = useState(ZERO)
  const [borrowValue, setBorrowValue] = useState(ZERO)
  // const [swapBorrowValue, setSwapBorrowValue] = useState('')
  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [swap, setSwap] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const pairAddress = pair?.address
  const { underworldPairInfo } = useUnderworldPairInfo(pairAddress)
  const { underworldUserInfo } = useUnderworldUserInfo(pairAddress)

  // const collateralAddress = underworldPairInfo.collateralAddress
  // const assetAddress = underworldPairInfo.assetAddress
  const cDecimals = Number(underworldPairInfo.collateralDecimals)
  const aDecimals = Number(underworldPairInfo.assetDecimals)
  const cDivisor = 10 ** cDecimals
  const aDivisor = 10 ** aDecimals
  
  const collateralWalletBalance = underworldUserInfo.userCollateralBalance
  const collateralWalletBalance_BN = collateralWalletBalance ? BigNumber.from(collateralWalletBalance) : ZERO
  // console.log('cBal:%s', collateralWalletBalance)
  // console.log('collateralWalletBalance:%s', collateralWalletBalance_BN)
  
  // const consoleLogs = async () => {
  //   showLogs && 
  //   setShowLogs(true)
  // }

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

  // const userBorrowAmount = underworldUserInfo.userBalance // √
  // console.log('borrowed:%s', userBorrowAmount)
  // const userBorrowAmount_BN = userBorrowAmount.toBigNumber(aDecimals) ?? ZERO
  // // const borrowAssetPrice = usePriceApi(pair?.asset.address) || undefined // √
  
  const assetPrice = Number(underworldUserInfo.assetPrice)
  const assetPrice_BN = assetPrice.toString().toBigNumber(aDecimals)
  // const userBorrowValue = userBorrowAmount_BN.mul(assetPrice_BN)

  const userCollateralBalance = (underworldUserInfo.userCollateralShare).toBigNumber(cDecimals) // √
  const userBorrowBalance = (underworldUserInfo.userBorrowPart).toBigNumber(aDecimals) // √
  const cPrice = (underworldPairInfo.collateralPrice).toString().toBigNumber(cDecimals)
  const aPrice = (underworldPairInfo.assetPrice).toString().toBigNumber(aDecimals)
  const userCollateralValue = userCollateralBalance.mul(cPrice)
  const userBorrowValue = userBorrowBalance.mul(aPrice)
  
  console.log('cPrice:%s', cPrice)
  console.log('aPrice:%s', aPrice)

  // const collateralPrice = usePrice(pair?.collateral.address)
  // const borrowPrice = usePrice(pair?.asset.address)
  // const pairUtilization = (Number(userBorrowValue) 
  // / Number(userCollateralValue) 
  // / 10**cDecimals
  // ).toString().toBigNumber(cDecimals)

  // const pairHealth = pairUtilization.toString().toBigNumber(cDecimals)

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
  const assetNative = WNATIVE[chainId].address === pair.collateral.address

  const ethBalance = useETHBalances(assetNative ? [account] : [])
  // const { data: coffinBalance } = useCoffinBalanceV2(pair.collateral ? pair.collateral.address : undefined)
  // balance of the collateral token in wallet.
  const collateralBalance = useCoffinCollateral
    ? pair.collateral.coffinBalance
    : assetNative
      ? BigNumber.from(ethBalance[account]?.quotient.toString() || 0)
      : pair.collateral.balance

  const displayUpdateOracle = pair.currentExchangeRate.gt(0) ? updateOracle : true
  const allowedSlippage = useAppSelector(selectSlippage)
  const parsedAmount = tryParseAmount(borrowValue.toString(), assetToken)
  const foundTrade = useV2TradeExactIn(parsedAmount, collateralToken)

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!foundTrade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(foundTrade)
    const realizedLPFee = foundTrade.inputAmount.multiply(realizedLpFeePercent)
    const priceImpact = foundTrade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [foundTrade])

  // const borrowAmount = pair.currentUserBorrowAmount.value

  const extraCollateral =
    swap && foundTrade ? BigNumber.from(foundTrade.minimumAmountOut(allowedSlippage).quotient.toString()) : ZERO

  // const extraCollateral = swap
  //   ? computeSlippageAdjustedAmounts(foundTrade, allowedSlippage)
  //       [Field.OUTPUT]?.toFixed(cDecimals)
  //       .toBigNumber(cDecimals) || ZERO
  //   : ZERO;

  const swapCollateral = collateralValue.toString().toBigNumber(cDecimals)
  console.log('collateralValue: %s', Number(collateralValue))

  const swapBorrow = borrowValue.toString().toBigNumber(aDecimals)
  console.log('collateralValue: %s', Number(collateralValue))

  const nextUserCollateralValue = userCollateralValue.add(swapCollateral)
  const nextUserBorrowValue = userBorrowValue.add(swapBorrow)
    // .add(collateralValue.toString().toBigNumber(cDecimals))
    // .add(extraCollateral)
  // const nextUserBorrowValue  = userBorrowAmount_BN
  //   .add(borrowValue ?? ZERO).add(extraCollateral) ?? ZERO

    // const nextUserBorrowValue_BN = userBorrowAmount_BN
    // .add(borrowValue ?? ZERO).add(extraCollateral) ?? ZERO

  const nextUserCollateralAmount = userCollateralBalance.toString().toBigNumber(cDecimals).add(nextUserCollateralValue)
  const nextUserBorrowAmount = userBorrowBalance.toString().toBigNumber(aDecimals).add(nextUserBorrowValue)
  // const nextUserBorrowAmount = userBorrowAmount_BN.add(BigNumber.from(nextUserBorrowValue_BN))

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
  userBorrowBalance.lte(ZERO)
    ? nextMaxBorrowSafe
    = ZERO
    : nextMaxBorrowSafe = nextMaxBorrowMinimum.mulDiv('95', userBorrowBalance)

  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, pair.maxAssetAvailable), ZERO)

  // const maxBorrow = nextMaxBorrowPossible.toFixed(aDecimals)
  // const nextUserMaxBorrowAmount = (pair.maxBorrowable.safe.value).mul(-1)
  // const nextBorrowValue = pair.currentUserBorrowAmount.value.add(userBorrowValue.toString().toBigNumber(aDecimals))
  // const nextHealth 
  // = Number(nextUserBorrowValue / cDecimals)
  //   / Number(nextUserCollateralValue)
  //     / cDecimals
    

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
  const collateralValueSet = !collateralValue.toString().toBigNumber(cDecimals).isZero()

  const borrowValueSet = !borrowValue.toString().toBigNumber(aDecimals).isZero()

  const trade = swap && borrowValueSet ? foundTrade : undefined

 // const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const priceImpactSeverity = warningSeverity(priceImpact)

  const collateralWarnings = new Warnings()


  collateralWarnings.add(
    // wallet balance < resultant sum - current collateral
    collateralWalletBalance_BN?.lt(nextUserCollateralAmount.sub(userCollateralBalance)),
    // collateralBalance.lt(nextUserCollateralAmount.sub(userCollateralBalance)),
    //.toString().toBigNumber(cDecimals)),
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
            && Number(userBorrowBalance) < Number(nextMaxBorrowSafe),
            'You will surpass your borrow limit and assets will be at a high risk of liquidation.',
            false
          )
        )
      )
    )
    .add(
    borrowValue < ZERO
      && nextMaxBorrowMinimum
        .add((userCollateralBalance)
          .mul('75').div('100')).lt(borrowValue.toString().toBigNumber(aDecimals)),
      'Not enough liquidity in this pair.',
      true
    )
  console.log('nextMaxBorrowSafe:%s', Number(nextMaxBorrowSafe))
  console.log('userBorrowAmount:%s', Number(userBorrowBalance))
  console.log('nextMaxBorrowMinimum:%s', Number(nextMaxBorrowMinimum))
  // console.log('pair.currentUserBorrowAmount.value:%s', Number(pair.currentUserBorrowAmount.value))

  // console.log('Oracle Discrepancy', {
  //     name: assetSymbol + '-' + collateralSymbol,
  //     borrowValueSet: borrowValueSet,
  //     displayUpdateOracle: displayUpdateOracle,
  //     currentExchangeRate: pair.currentExchangeRate.toFixed(
  //         aDecimals
  //     ),
  //     oracleExchangeRate: pair.oracleExchangeRate.toFixed(
  //         aDecimals
  //     ),
  //     diff:
  //         pair.currentExchangeRate.toFixed(aDecimals) /
  //         pair.oracleExchangeRate.toFixed(aDecimals),
  // })

  const transactionReview = new TransactionReview()
  if ((collateralValue || borrowValue) && !collateralWarnings.broken
    && (!borrowWarnings.broken || !borrowValue)) {
    if (collateralValueSet) {
      transactionReview.addTokenAmount(
        'Collateral',
        userCollateralBalance.toString().toBigNumber(cDecimals),//pair.userCollateralAmount.value,
        nextUserCollateralAmount,
        pair.collateral
      )
      // transactionReview.addUSD(
      //   'Collateral USD',
      //   userCollateralBalance.div(e10(12)),
      //   // userCollateralValue.toString().toBigNumber(cDecimals),
      //   nextUserCollateralAmount.div(e10(12)),        pair.collateral
      // )
    }
    if (borrowValueSet) {
      transactionReview.addTokenAmount('Borrowed',
      pair.currentUserBorrowAmount.value,
      nextUserBorrowAmount.sub(pair.currentUserBorrowAmount.value),
      // (Number(nextUserBorrowAmount) / 1e18).toString().toBigNumber(aDecimals),
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
    //     .add((nextMaxBorrowSafe).toString().toBigNumber(aDecimals)),
    //   pair.asset
    // )
    // transactionReview.addPercentage(
    //   'Limit Used',
    //   pairUtilization,
    //   (nextHealth - (Number(pairUtilization) / 1e18)).toString().toBigNumber(cDecimals)
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

  if (swap && priceImpactSeverity > 3) {
    actionName = 'Price Impact High'
  } else if (swap && priceImpactSeverity > 2) {
    actionName = actionName + ' anyway'
  }

  const actionDisabled =false
    // (userCollateralValue.toString().toBigNumber(cDecimals).lte(0) &&
    //   userBorrowValue.toString().toBigNumber(aDecimals).lte(0))
    // || 
    // collateralWarnings.broken
    // || (Number(borrowValue) > 0 && borrowWarnings.broken)
    // || (swap && priceImpactSeverity > 3)
    // || (userCollateralValue == 0  && !collateralValueSet)

  // Handlers
  async function onExecute(cooker: UnderworldCooker): Promise<string> {
    let summary = ''

    if (borrowValueSet) {
      if (displayUpdateOracle) {
        cooker.updateExchangeRate(true, ZERO, ZERO)
      }

      if (swap && !useCoffinCollateral) {
        cooker.coffinDepositCollateral(collateralValue.toString().toBigNumber(cDecimals))
      }

      cooker.borrow(
        borrowValue.toString().toBigNumber(aDecimals),
        swap || useCoffinBorrow,
        swap ? SOULSWAP_MULTISWAPPER_ADDRESS[chainId] : ''
      )
    }
    if (borrowValueSet && trade) {
      const path = trade.route.path.map((token) => token.address) || []

      if (path.length > 4) {
        throw 'Path too long'
      }
      // todo: uncomment //
      // console.log('debug', [
      //   pair.asset.address,
      //   pair.collateral.address,
      //   extraCollateral,
      //   path.length > 2 ? path[1] : AddressZero,
      //   path.length > 3 ? path[2] : AddressZero,
      //   account,
      //   toShare(pair.collateral, collateralValue.toString().toBigNumber(cDecimals)),
      //   borrowValue,
      // ])

      const data = defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
        [
          pair.asset.address,
          pair.collateral.address,
          extraCollateral,
          path.length > 2 ? path[1] : AddressZero,
          path.length > 3 ? path[2] : AddressZero,
          account,
          toShare(pair.collateral, collateralValue.toString().toBigNumber(cDecimals)),
        ]
      )

      cooker.action(
        SOULSWAP_MULTISWAPPER_ADDRESS[chainId],
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
          : collateralValue.toString().toBigNumber(cDecimals),
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
        multiplier.toBigNumber(cDecimals),
        '1'.toBigNumber(cDecimals)
      )
    )

    // consoleLogs()

    const multipliedBorrow = multipliedCollateral.mulDiv(e10(16).mul('75'), pair.currentExchangeRate)

    // console.log({
    //     original: swapCollateral.toFixed(cDecimals),
    //     multiplied: swapCollateral
    //         .add(
    //             swapCollateral.mulDiv(
    //                 multiplier.toBigNumber(cDecimals),
    //                 '1'.toBigNumber(cDecimals)
    //             )
    //         )
    //         .toFixed(cDecimals),
    //     borrow: multipliedBorrow.toFixed(aDecimals),
    // })

    // console.log('multipliedBorrow:', multipliedBorrow)

    setBorrowValue(multipliedBorrow)
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
        value={borrowValue.toString()}
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
        (borrowValueSet && userCollateralBalance.gt(ZERO)) ||
        (swap && (priceImpactSeverity < 3))) && (
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