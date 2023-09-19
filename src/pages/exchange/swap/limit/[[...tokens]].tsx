import React, { useCallback, useState, Fragment, useEffect, useMemo } from "react"
// import { ChevronDoubleUpIcon } from '@heroicons/react/24/solid'
import ChevronDoubleUp from 'assets/svg/icons/ChevronDoubleUp.svg'
import ChevronDown from 'assets/svg/icons/ChevronDown.svg'
import Multiply from 'assets/svg/icons/Multiply.svg'
import Divide from 'assets/svg/icons/Divide.svg'

import {
  ChainId,
  Currency,
  // CurrencyAmount,
  // currencyEquals,
  NATIVE,
  NATIVE_ADDRESS,
  Percent,
  // SOUL,
  SOUL_ADDRESS,
  // Token,
  TradeType,
  USDC_ADDRESS,
  // WNATIVE,
} from "sdk"
import { Trade } from "sdk"
// import { AdvancedSwapDetails } from "../order/AdvancedSwapDetails"
// import UnsupportedCurrencyFooter from "../order/UnsupportedCurrencyFooter"
import { MouseoverTooltip, MouseoverTooltipContent } from "components/Tooltip"
import {
  // ArrowDown,
  // Info,
  // Divide,
  // X,
  CheckCircle,
  HelpCircle,
} from "react-feather"
import { Text } from "rebass"
// import styled from "styled-components"
// import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { useWalletModalToggle } from 'state/application/hooks'

import {
  Button,
  ButtonConfirmed,
  ButtonError,
  ButtonLight,
  // ButtonLight,
  ButtonPrimary,
} from "components/Button"
import PurpleCard from "components/Card"
import { AutoColumn } from "components/Column"
// import CurrencyInputPanel from "components/CurrencyInputPanel"
import Row, { AutoRow, RowFixed } from "components/Row"
// import TradePrice from "../order/TradePrice"
import useGelatoLimitOrders from "hooks/gelato/useGelatoLimitOrders"
import { useIsSwapUnsupported } from "hooks/useIsSwapUnsupported"
import { useUSDCValue } from "hooks/useUSDCPrice"
import { Field } from "state/order/actions"
// import { tryParseAmount } from "state/order/hooks"
// import { maxAmountSpend } from "utils/currency/maxAmountSpend"
import useTheme from "hooks/useTheme"
import {
  ApprovalState,
  useApproveCallbackFromInputCurrencyAmount,
} from "hooks/useApproveCallback"
import Loader from "components/Loader"
// import { SOUL_FANTOM } from "constants/gelato/tokens.fantom"
import { CurrencyLogo } from "components/CurrencyLogo"
import { tryParseAmount } from "functions/parse"
import { TYPE } from "theme"
import { BottomGrouping, Dots, SwapCallbackError } from "components/Order/styleds"
import ConfirmSwapModal from "components/Order/ConfirmSwapModal"
import UnsupportedCurrencyFooter from "components/Order/UnsupportedCurrencyFooter"
import TradePrice from "components/Order/TradePrice"
import CurrencyInputPanel from "components/CurrencyInputPanel"
import { classNames, formatNumber, formatPercent } from "functions"
import { useActiveWeb3React } from "services/web3"
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2"
import NetworkGuard from "guards/Network"
import { Feature } from "enums/Feature"
import { SwapLayout } from "layouts/SwapLayout"
import Image from 'next/image'
import { GelatoLimitOrdersHistoryPanel } from "soulswap-limit-orders-react"
import { Toggle } from "components/Toggle"
import SwapAssetPanel from "features/trident/swap/SwapAssetPanel"
import { currencyId } from "functions/currency"
import { useRouter } from "next/router"
import { useCurrency } from "hooks/Tokens"
import SwapDropdown from "features/swap/SwapDropdown"
import { getChainColorCode } from "constants/chains"
import LimitHeader from "features/limit/LimitHeader"
import { CustomBanner } from "components/Banner"
import Typography from "components/Typography"
import Head from "next/head"

const Limit = () => {
  const { account, chainId } = useActiveWeb3React();
  // const [inputCurrency, setInputCurrency] = useState(NATIVE[chainId ?? ChainId.FANTOM])
  // const [ouputCurrency, setOutputCurrency] = useState(SOUL[chainId ?? ChainId.FANTOM])
  const theme = useTheme();
  const [showOrders, setShowOrders] = useState(false)
  // const [useSwap, setUseSwap] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const DEFAULT_CURRENCY_B = [ChainId.ETHEREUM, ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId) ? SOUL_ADDRESS[chainId ?? ChainId.FANTOM] : USDC_ADDRESS[chainId ?? ChainId.FANTOM]
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [NATIVE[chainId ?? ChainId.FANTOM].symbol, DEFAULT_CURRENCY_B]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  enum Rate {
    DIV = "DIV",
    MUL = "MUL",
  }

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/exchange/swap/limit/${currencyIdB}/${currencyIdA}`)
      } else {
        router.push(`/exchange/swap/limit/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )

  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/exchange/swap/limit/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          router.push(`/exchange/swap/limit/${newCurrencyIdB}`)
        }
      } else {
        router.push(`/exchange/swap/limit/${currencyIdA ? currencyIdA : NATIVE[chainId ?? ChainId.FANTOM].symbol}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, router, currencyIdB]
  )

  const {
    handlers: {
      handleInput,
      // handleRateType,
      handleCurrencySelection,
      // handleSwitchTokens,
      handleLimitOrderSubmission,
    },
    derivedOrderInfo: {
      parsedAmounts,
      // currencies,
      // currencyBalances,
      trade,
      formattedAmounts,
      inputError,
      rawAmounts,
      // price,
    },
    orderState: { independentField, rateType },
  } = useGelatoLimitOrders();

  // const fiatValueInput = useUSDCValue(parsedAmounts.input);

  const desiredRateInCurrencyAmount = tryParseAmount(
    trade?.outputAmount.toSignificant(6),
    currencyB
  );

  const fiatValueDesiredRate = useUSDCValue(desiredRateInCurrencyAmount);

  const isValid = !inputError;
  const rawPriceDelta = Number(formattedAmounts.price) - Number(trade?.executionPrice.toSignificant(4))
  const rawPercentDelta = 100 * (rawPriceDelta) / Number(trade?.executionPrice.toSignificant(8))
  const percentDelta = Math.abs(rawPercentDelta)
  const priceDelta = Math.abs(rawPriceDelta)
  const isSell = trade && rateType === Rate.MUL
  const isBuy = trade && rateType === Rate.DIV
  const isProfitable = isSell && rawPriceDelta > 0 || isBuy && rawPriceDelta < 0

  const handleTypeInput = useCallback(
      (value: string) => {
        handleInput(Field.INPUT, value);
        handleCurrencySelection(Field.INPUT, currencyA)
        handleCurrencySelection(Field.OUTPUT, currencyB)
      },
      [handleInput, handleCurrencySelection]
  );

  const handleTypeOutput = useCallback(
      (value: string) => {
        handleInput(Field.OUTPUT, value);
        handleCurrencySelection(Field.INPUT, currencyA)
        handleCurrencySelection(Field.OUTPUT, currencyB)
      },
      [handleInput, handleCurrencySelection]
  );

  const handleTypeDesiredRate = useCallback(
      (value: string) => {
        handleInput(Field.PRICE, value);
      },
      [handleInput]
  );

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const [
    approvalState,
    approveCallback,
  ] = useApproveCallbackFromInputCurrencyAmount(parsedAmounts.input);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);

  const allowedSlippage = new Percent(40, 10_000);
  const userHasSpecifiedInputOutput = Boolean(
    currencyA && currencyB
  );
  const routeNotFound = !trade?.route;
  const isLoadingRoute =
    userHasSpecifiedInputOutput &&
    ((parsedAmounts.input && !parsedAmounts.output) ||
      (!parsedAmounts.input && parsedAmounts.output));

  const handleSwap = useCallback(() => {
    if (!handleLimitOrderSubmission) {
      return;
    }

    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });

    try {
      if (!currencyA?.wrapped.address) {
        throw new Error("Invalid Input Currency");
      }

      if (!currencyB?.wrapped.address) {
        throw new Error("Invalid Output Currency");
      }

      if (!rawAmounts.input) {
        throw new Error("Invalid Input Amount");
      }

      if (!rawAmounts.output) {
        throw new Error("Invalid Output Amount");
      }

      if (!account) {
        throw new Error("No Account");
      }

      handleLimitOrderSubmission({
        inputToken: currencyA?.isNative
          ? NATIVE_ADDRESS
          : currencyA?.wrapped.address,
        outputToken: currencyB?.isNative
          ? NATIVE_ADDRESS
          : currencyB?.wrapped.address,
        inputAmount: rawAmounts.input,
        outputAmount: rawAmounts.output,
        owner: account,
      })
        .then(({ hash }) => {
          setSwapState({
            attemptingTxn: false,
            tradeToConfirm,
            showConfirm,
            swapErrorMessage: undefined,
            txHash: hash,
          });
        })
        .catch((error) => {
          setSwapState({
            attemptingTxn: false,
            tradeToConfirm,
            showConfirm,
            swapErrorMessage: error.message,
            txHash: undefined,
          });
        });
    } catch (error: any) {
      setSwapState({
        attemptingTxn: false,
        tradeToConfirm,
        showConfirm,
        swapErrorMessage: error.message,
        txHash: undefined,
      });
    }
  }, [
    handleLimitOrderSubmission,
    tradeToConfirm,
    showConfirm,
    currencyA?.wrapped.address,
    currencyA?.isNative,
    currencyB?.wrapped.address,
    currencyB?.isNative,
    rawAmounts.input,
    rawAmounts.output,
    account,
  ]);

  const [showInverted, setShowInverted] = useState<boolean>(false);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      handleInput(Field.INPUT, "");
    }
  }, [attemptingTxn, handleInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade as any,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (currencyA) => {
      //  setApprovalSubmitted(false); // reset 2 step UI for approvals
      handleCurrencySelection(Field.INPUT, currencyA);
      handleCurrencyASelect(currencyA)
      setShowHeader(true)
    },
    [handleCurrencySelection]
  );

  // const handleMaxInput = useCallback(() => {
  //   maxInputAmount && handleInput(Field.INPUT, maxInputAmount.toExact());
  // }, [maxInputAmount, handleInput]);

  const handleOutputSelect = useCallback(
    (currencyB) => {
      handleCurrencySelection(Field.OUTPUT, currencyB)
      handleCurrencyBSelect(currencyB)
      setShowHeader(true)
    },
    [handleCurrencySelection]
  );

  // const handleSwitch = useCallback(
  //   (inputCurrency, outputCurrency) => {
  //     // handleCurrencyASelect(inputCurrency)
  //     // handleCurrencySelection(Field.OUTPUT, inputCurrency)
  //     // handleCurrencySelection(Field.INPUT, outputCurrency)
  //     // handleOutputSelect(inputCurrency)
  //   },
  //   [handleCurrencySelection]
  // );

  const swapIsUnsupported = useIsSwapUnsupported(
    currencyA,
    currencyB
  );

  // const {
  //   gasPrice,
  //   realExecutionPrice,
  //   realExecutionPriceAsString,
  // } = useGasOverhead(parsedAmounts.input, parsedAmounts.output, rateType);

  const showApproveFlow =
    !inputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED));

  const handleApprove = useCallback(async () => {
    await approveCallback();
  }, [approveCallback])

  return (
    <DoubleGlowShadowV2>
      <Head>
        <title>Limit | SoulSwap</title>
          {/* <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
          <meta name="description" content="Create limit orders on SoulSwap. Set a price and select your desired assets to execute an order, view open orders, and more." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:description" content="Create limit orders on SoulSwap. Set a price and select your desired assets to execute an order, view open orders, and more." />
        </Head>
      <div className={`grid p-1 mt-4 space-y-2 rounded-2xl bg-dark-1000`}>
        {showHeader &&
          <SwapDropdown
            inputCurrency={currencyA}
            outputCurrency={currencyB}
            allowedSlippage={allowedSlippage}
          />
        }
        <CustomBanner
          external={true}
          chains={[ChainId.FANTOM, ChainId.AVALANCHE]}
          link={'https://docs.soulswap.finance/docs/user-guides/our-utility/ios-mobile-premium'}
          text={'Our (Beta) Mobile App (iOS) ↗'}
          textColor={'white'}
          color={'ftmBlue'}
          className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
        />
        <LimitHeader
          inputCurrency={currencyA}
          outputCurrency={currencyB}
        />
        {showHeader && <div className={`mt-12`} />}
        <ConfirmSwapModal
          isOpen={showConfirm}
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={account}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          onDismiss={handleConfirmDismiss}
          inputAmount={parsedAmounts.input}
          outputAmount={parsedAmounts.output}
        />
        <AutoColumn gap={"md"}>
          <div style={{ display: "relative" }}>
            <SwapAssetPanel
              spendFromWallet={true}
              chainId={chainId}
              header={(props) => (
                <SwapAssetPanel.Header
                  {...props}
                  label={''}
                />
              )}
              currency={currencyA}
              value={formattedAmounts.input}
              onChange={handleTypeInput}
              onSelect={handleInputSelect}
            />
            {/* <div className={ 'my-2' } /> */}
            <div className="flex -mt-2 -mb-2 z-0 justify-between">
              {rateType === Rate.MUL ? (
                <Button
                  size={'xs'}
                  className={classNames(`mx-[45%] rounded-xl bg-dark-1000 border border-${getChainColorCode(chainId)}`)}
                // onClick={handleSetSwap}
                >
                  <Image
                    width={14}
                    alt={"m{14}sign"}
                    height={14}
                    className={`rounded-xl`}
                    src={Multiply}
                  />
                </Button>
              ) : (
                <Button
                  size={'xs'}
                  className={classNames(`mx-[45%] rounded-xl bg-dark-1000 border border-${getChainColorCode(chainId)}`)}
                // onClick={handleSetSwap}
                >
                  <Image
                    alt={"divide icon"}
                    width={14}
                    height={14}
                    className={`rounded-xl`}
                    src={Divide}
                  />
                </Button>
              )}
            </div>
            {/* </ArrowWrapper> */}
            <CurrencyInputPanel
              chainId={chainId}
              value={formattedAmounts.price}
              showCurrencySelect={false}
              // currency={currencyA}
              onUserInput={handleTypeDesiredRate}
              fiatValue={fiatValueDesiredRate ?? undefined}
              onCurrencySelect={handleInputSelect}
              // otherCurrency={currencyB}
              showCommonBases={false}
              id="limit-order-currency-rate"
              disableCurrencySelect={true}
              hideBalance={true}
              label={
                trade &&
                // trade && rateType === Rate.MUL ? `≈ ${formatNumber(formattedAmounts.price, false, true)} (${currencyB.symbol})`
                // : trade && rateType === Rate.MUL ? `≈ ${formatNumber(formattedAmounts.price, false, true)} (${currencyA.symbol})`
                // : 
                `1 ${currencyA?.symbol} ≈ ${formatNumber(formattedAmounts.price)} ${currencyB?.symbol}`
                // ? `${currencyA.symbol} ≈ ${Number(formattedAmounts.price).toFixed(2)} ${currencyB.symbol}`
                // ? `≈ ${(1 / Number(formattedAmounts.price)).toFixed(4)} (${currencyB.symbol})`
                // : `≈ ${(1 / Number(formattedAmounts.price)).toFixed(4)} (${currencyA.symbol})`
                // : `${currencyB.symbol} : ${currencyA.symbol}`

              }
            />
            {/* <div className="flex justify-end">
              <Button
                size={'xs'}
                className={classNames(`-ml-8 -mt-2 sm:-ml-2 rounded-xl bg-dark-1000 border border-${getChainColorCode(chainId)}`)}
                onClick={handleSetSwap(currencyA, currencyB)}
              >
                <Image
                  alt={"Chevron double up icon"}
                  width={14}
                  height={14}
                  className={`rounded-xl`}
                  src={ChevronDoubleUp}
                />
              </Button>
            </div> */}
            {/* <div className={`my-1`} /> */}
            <div className="flex -mt-2 -mb-2 z-0 justify-between">
              <Button
                size={'xs'}
                className={classNames(`mx-[45%] rounded-xl bg-dark-1000 border border-${getChainColorCode(chainId)}`)}
              // onClick={handleSwitch(currencyA, currencyB)}
              >
                <Image
                  alt={"chevron down icon"}
                  width={14}
                  height={14}
                  className={`rounded-xl`}
                  src={ChevronDown}
                />
              </Button>
            </div>
            {/* </ArrowWrapper> */}

            <SwapAssetPanel
              spendFromWallet={true}
              chainId={chainId}
              header={
                (props) => (
                  <SwapAssetPanel.Header
                    {...props}
                    label={''}
                  />
                )
              }
              currency={currencyB}
              value={formattedAmounts.output}
              onChange={handleTypeOutput}
              onSelect={handleOutputSelect}
            />
          </div>

          {trade &&
            <div>
              <div className={classNames(!trade ? "hidden" : "flex justify-between")}>
                <div className={'flex mx-2'}>
                  Current Market Rate
                </div>
                <div className={'flex mx-2'}>
                  <TradePrice
                    price={trade?.executionPrice}
                    showInverted={showInverted}
                    setShowInverted={setShowInverted}
                  />
                </div>
              </div>
              <div className={classNames(!trade ? "hidden" : "flex justify-between")}>
                <div className={'flex mx-2'}>
                  Price {`${trade && rateType === Rate.MUL ? `Premium` : `Discount`}`}
                </div>
                <div className={classNames(isProfitable ? `text-green` : `text-red`, 'flex mx-2')}>
                  {/* { `${formattedAmounts.price} vs. ${trade?.executionPrice.toSignificant(4)}` } */}
                  {/* { `${Number(formattedAmounts.price) - Number(trade?.executionPrice.toSignificant(4))}` } */}
                  {rawPriceDelta > 0 ? formatNumber(rawPriceDelta, false, true) : `${formatNumber(priceDelta, false, true)} below Market.`}
                </div>
              </div>
              <div className={classNames(!trade ? "hidden" : "flex justify-between")}>
                <div className={'flex mx-2'}>
                  Percent {`${trade && rateType === Rate.MUL ? `Premium` : `Discount`}`}
                </div>
                <div className={classNames(isProfitable ? `text-green` : `text-red`, 'flex mx-2')}>
                  {/* { `${formattedAmounts.price} vs. ${trade?.executionPrice.toSignificant(4)}` } */}
                  {/* { `${Number(formattedAmounts.price) - Number(trade?.executionPrice.toSignificant(4))}` } */}
                  {`${rawPercentDelta > 0 ? formatPercent(rawPercentDelta) : `${formatPercent(percentDelta)} below Market.`}`}
                </div>
              </div>
            </div>
          }

          <BottomGrouping>
            {swapIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.Main mb="4px">Unsupported Asset</TYPE.Main>
              </ButtonPrimary>
            ) :
              !account ? (
                <div className={`flex justify-center w-full`}>
                  <Button 
                    variant={'filled'} 
                    color={'avaxRed'}
                    disabled={true}
                  // onClick={useWalletModalToggle}
                  >
                    <Typography className={`text-bold text-white`}>
                      {`Connect Wallet`}
                    </Typography>
                  </Button>
                </div>
              ) :
                routeNotFound && isLoadingRoute ? (
                  <PurpleCard style={{ textAlign: "center" }}>
                    <TYPE.Main mb="4px">
                      <Dots>Loading</Dots>
                    </TYPE.Main>
                  </PurpleCard>
                ) : showApproveFlow ? (
                  <AutoRow style={{ flexWrap: "nowrap", width: "100%" }}>
                    <AutoColumn style={{ width: "100%" }} gap="12px">
                      <ButtonConfirmed
                        onClick={handleApprove}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted
                        }
                        width="100%"
                        altDisabledStyle={approvalState === ApprovalState.PENDING} // show solid button while waiting
                        confirmed={approvalState === ApprovalState.APPROVED}
                      >
                        <AutoRow
                          justify="space-between"
                          style={{ flexWrap: "nowrap" }}
                        >
                          <span style={{ display: "flex", alignItems: "center" }}>
                            <CurrencyLogo
                              currency={currencyA}
                              size={20}
                              style={{ marginRight: "8px", flexShrink: 0 }}
                            />
                            {/* we need to shorten this string on mobile */}
                            {approvalState === ApprovalState.APPROVED
                              ? `${currencyA?.symbol} Allowed.`
                              : `Approve
                              ${currencyA?.symbol}.`}
                          </span>
                          {approvalState === ApprovalState.PENDING ||
                            (approvalSubmitted &&
                              approvalState === ApprovalState.NOT_APPROVED) ? (
                            <Loader stroke="white" />
                          ) : approvalSubmitted &&
                            approvalState === ApprovalState.APPROVED ? (
                            <CheckCircle size="20" color={theme.green1} />
                          ) : (
                            <MouseoverTooltip
                              text={`You must give the Limit Orders smart contracts
                                permission to use your 
                                ${currencyA?.symbol}. You only have to do
                                this once per token.`}
                            >
                              <HelpCircle
                                size="20"
                                color={"white"}
                                style={{ marginLeft: "8px" }}
                              />
                            </MouseoverTooltip>
                          )}
                        </AutoRow>
                      </ButtonConfirmed>
                      <ButtonError
                        onClick={() => {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          });
                        }}
                        id="limit-order-button"
                        disabled={
                          !isValid || approvalState !== ApprovalState.APPROVED
                        }
                        error={false}
                      >
                        <Text fontSize={20} fontWeight={500}>
                          {inputError ? inputError : `Place Order`}
                        </Text>
                      </ButtonError>
                    </AutoColumn>
                  </AutoRow>
                ) : (
                  <ButtonError
                    onClick={() => {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }}
                    id="limit-order-button"
                    disabled={!isValid}
                    error={false}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {inputError ? inputError : `Place Order`}
                    </Text>
                  </ButtonError>
                )}
            {swapErrorMessage && isValid ? (
              <SwapCallbackError error={swapErrorMessage} />
            ) : null}
          </BottomGrouping>
        </AutoColumn>
        {/* </Wrapper> */}
        <div className={classNames(account ? `flex flex-cols-2 gap-3 text-white justify-end` : `hidden`)}>
          <Toggle
            id="toggle-button"
            optionA="Orders"
            optionB="Orders"
            isActive={showOrders}
            toggle={
              showOrders
                ? () => {
                  setShowOrders(false)
                }
                : () => {
                  setShowOrders(true)
                }
            }
          />
        </div>
        {showOrders && account &&
          <GelatoLimitOrdersHistoryPanel />
        }
        {!swapIsUnsupported ? null : (
          <UnsupportedCurrencyFooter
            show={swapIsUnsupported}
            currencies={[currencyA, currencyB]}
          />
        )}
        <div className={classNames([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `flex flex-cols-2 gap-3 text-white justify-end` : `hidden`)}>
        </div>
      </div>
    </DoubleGlowShadowV2>
  )
}

export default Limit
Limit.Guard = NetworkGuard(Feature.LIMIT)
Limit.Layout = SwapLayout('limit-order-page')