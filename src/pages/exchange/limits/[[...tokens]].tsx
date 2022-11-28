import React, { useCallback, useState, Fragment, useEffect, useMemo } from "react"
import { ChevronDoubleUpIcon } from '@heroicons/react/solid'

import {
  ChainId,
  Currency,
  CurrencyAmount,
  currencyEquals,
  NATIVE,
  NATIVE_ADDRESS,
  Percent,
  SOUL,
  Token,
  TradeType,
  WNATIVE,
} from "sdk"
import { Trade } from "sdk"
// import { AdvancedSwapDetails } from "../order/AdvancedSwapDetails"
// import UnsupportedCurrencyFooter from "../order/UnsupportedCurrencyFooter"
import { MouseoverTooltip, MouseoverTooltipContent } from "components/Tooltip"
import {
  ArrowDown,
  Info,
  Divide,
  X,
  CheckCircle,
  HelpCircle,
} from "react-feather"
import { Text } from "rebass"
import styled from "styled-components"
// import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { useModalOpen, useWalletModalToggle } from 'state/application/hooks'

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
import { ArrowWrapper, BottomGrouping, Dots, SwapCallbackError, Wrapper } from "components/Order/styleds"
import ConfirmSwapModal from "components/Order/ConfirmSwapModal"
import UnsupportedCurrencyFooter from "components/Order/UnsupportedCurrencyFooter"
// import useGasOverhead from "hooks/gelato/useGasOverhead"
import TradePrice from "components/Order/TradePrice"
// import { AdvancedSwapDetails } from "components/Order/AdvancedSwapDetails"
import CurrencyInputPanel from "components/CurrencyInputPanel"
// import Input from "components/Input"
// import OrderHeader from "components/Order/OrderHeader"
import { classNames, formatNumber, formatPercent } from "functions"
import { useActiveWeb3React } from "services/web3"
import SwapHeader from "features/swap/SwapHeader"
import Container from "components/Container"
// import CurrencyInputPanel from "components/Order/CurrencyInputPanel"
import DoubleGlowShadowV2 from "components/DoubleGlowShadowV2"
import NetworkGuard from "guards/Network"
import { Feature } from "enums/Feature"
import { SwapLayout, SwapLayoutCard } from "layouts/SwapLayout"
import Image from 'next/image'
import { GelatoLimitOrdersHistoryPanel } from "soulswap-limit-orders-react"
import { Toggle } from "components/Toggle"
import SwapAssetPanel from "features/trident/swap/SwapAssetPanel"
// import { maxAmountSpend } from "utils/currency/maxAmountSpend"
import { currencyId } from "functions/currency"
import { useRouter } from "next/router"
import { useCurrency } from "hooks/Tokens"
import SocialWidget from "components/Social"
import SwapDropdown from "features/swap/SwapDropdown"
import { getChainColor, getChainColorCode } from "constants/chains"

// const BodyWrapper = styled.div<{ margin?: string }>`
// position: relative;
// margin-top: ${({ margin }) => margin ?? "0px"};
// max-width: 1080px;
//   width: 100%;
//   background: ${({ theme }) => theme.bg7};
//   box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
//     0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
//   border-radius: 24px;
//   margin-top: 1rem;
// `;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
// function AppBody({
//   children,
//   ...rest
// }: {
//   children: React.ReactNode;
// }) {
//   return <BodyWrapper {...rest}>{children}</BodyWrapper>;
// }

// const StyledInfo = styled(Info)`
//   opacity: 0.4;
//   color: ${({ theme }) => theme.text1};
//   height: 16px;
//   width: 16px;
//   :hover {
//     opacity: 0.8;
//   }
// `;


// interface GelatoLimitOrderProps {
//   showCommonBases?: boolean;
// }

const Limits = () => {
  const { account, chainId } = useActiveWeb3React();
  // const [inputCurrency, setInputCurrency] = useState(NATIVE[chainId])
  // const [ouputCurrency, setOutputCurrency] = useState(SOUL[chainId])
  const theme = useTheme();
  const [showOrders, setShowOrders] = useState(false)
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [undefined, undefined]
  const [useSwap, setUseSwap] = useState(false)
  // const [currencyIdA, currencyIdB] = (tokens as string[]) || [undefined, undefined]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  enum Rate {
    DIV = "DIV",
    MUL = "MUL",
  }

  const handleSetSwap = useCallback(
    (useSwap: boolean) => {
      router.push(`/exchange/swap/${currencyIdB}/${currencyIdA}`)
    }, [useSwap]
  )

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        router.push(`/exchange/swap/${currencyIdB}/${currencyIdA}`)
      } else {
        router.push(`/exchange/swap/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, router, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.push(`/exchange/swap/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          router.push(`/exchange/swap/${newCurrencyIdB}`)
        }
      } else {
        router.push(`/exchange/swap/${currencyIdA ? currencyIdA : NATIVE[chainId].symbol}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, router, currencyIdB]
  )

  const {
    handlers: {
      handleInput,
      handleRateType,
      handleCurrencySelection,
      handleSwitchTokens,
      handleLimitOrderSubmission,
    },
    derivedOrderInfo: {
      parsedAmounts,
      currencies,
      currencyBalances,
      trade,
      formattedAmounts,
      inputError,
      rawAmounts,
      price,
    },
    orderState: { independentField, rateType },
  } = useGelatoLimitOrders();

  // const fiatValueInput = useUSDCValue(parsedAmounts.input);

  const desiredRateInCurrencyAmount = tryParseAmount(
    trade?.outputAmount.toSignificant(6),
    currencyB
  );

  const fiatValueDesiredRate = useUSDCValue(desiredRateInCurrencyAmount);

  // const currentMarketRate = trade?.executionPrice ?? undefined;

  // const pct =
  //   currentMarketRate && price
  //     ? price.subtract(currentMarketRate).divide(currentMarketRate)
  //     : undefined;

  // const percentageRateDifference = pct
  //   ? new Percent(pct.numerator, pct.denominator)
  //   : undefined;

  const isValid = !inputError;
  const rawPriceDelta = Number(formattedAmounts.price) - Number(trade?.executionPrice.toSignificant(4))
  const rawPercentDelta = 100 * (rawPriceDelta) / Number(trade?.executionPrice.toSignificant(8))
  const percentDelta = Math.abs(rawPercentDelta)
  const priceDelta = Math.abs(rawPriceDelta)
  const isSell = trade && rateType === Rate.MUL
  const isBuy = trade && rateType === Rate.DIV
  const isProfitable = isSell && rawPriceDelta > 0 || isBuy && rawPriceDelta < 0

  // const currencyA = currencyA

  // const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");
  // const handleActiveTab = (tab: "sell" | "buy") => {
  //   if (activeTab === tab) return;

  //   handleRateType(rateType, price);
  //   setActiveTab(tab);
  // };
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

  // const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(
  //   currencyBalances.input
  // );
  // const showMaxButton = Boolean(
  //   maxInputAmount?.greaterThan(0) &&
  //   !parsedAmounts.input?.equalTo(maxInputAmount)
  // );

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
    },
    [handleCurrencySelection]
  );

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
  }, [approveCallback]);

  return (
    <Container id="cross-page" maxWidth="2xl" className="space-y-4">
      <DoubleGlowShadowV2>
        <SwapLayoutCard>
          {/* <SwapDropdown
            inputCurrency={currencyA}
            outputCurrency={currencyB}
            allowedSlippage={allowedSlippage}
          /> */}

          <div className="p-0 px-2 mt-0 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
            {/* <SwapHeader
            inputCurrency={currencyA}
            outputCurrency={currencyB}
            allowedSlippage={allowedSlippage}
          />           */}
            {/* <OrderHeader handleActiveTab={handleActiveTab} activeTab={activeTab} /> */}
            {/* <Wrapper id="limit-order-page"> */}
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
                {/* <CurrencyInputPanel
                  chainId={chainId}
                  // label={
                  //   independentField === Field.OUTPUT ? "From (at most)" : "From"
                  // }
                  value={formattedAmounts.input}
                  currency={currencyA}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  fiatValue={fiatValueInput ?? undefined}
                  onCurrencySelect={handleInputSelect}
                  // otherCurrency={currencyB || SOUL_FANTOM}
                  showCommonBases={false}
                  id="limit-order-currency-input"
                /> */}
                <ArrowWrapper clickable={false}>
                  {rateType === Rate.MUL ? (
                    <X
                      size="16"
                      color={
                        currencyA && currencyB
                          ? theme.text1
                          : theme.text3
                      }
                    />
                  ) : (
                    <Divide
                      size="16"
                      color={
                        currencyA && currencyB
                          ? theme.text1
                          : theme.text3
                      }
                    />
                  )}
                </ArrowWrapper>
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
                  <X
                    size="14"
                    color={getChainColor(chainId)}
                  />
                  </div> */}
                <div className={classNames("flex justify-end -mt-2 -mb-6 z-0")}>
                  <Button
                    size={'md'}
                    className={classNames(``)}
                    onClick={handleSetSwap}
                  >
                    <ChevronDoubleUpIcon
                      width={'16px'}
                      height={'21px'}
                      className={`justify-center rounded rounded-xl bg-${getChainColorCode(chainId)}`}
                    // src={ChevronDoubleUpIcon}
                    />
                  </Button>
                </div>
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      handleSwitchTokens();
                    }}
                    color={
                      currencyA && currencyB
                        ? theme.text1
                        : theme.text3
                    }
                  />
                </ArrowWrapper>

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

                {/* <CurrencyInputPanel
                  chainId={chainId}
                  value={formattedAmounts.output}
                  onUserInput={handleTypeOutput}
                  // label={
                  //   independentField === Field.INPUT ? "To (at least)" : "To"
                  // }
                  hideBalance={false}
                  // priceImpact={percentageRateDifference}
                  priceImpact={percentageRateDifference}
                  currency={currencyB}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencyA}
                  showCommonBases={false}
                  // rateType={rateType}
                  id="limit-order-currency-output"
                /> */}
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
                    <ButtonLight onClick={useWalletModalToggle}>
                      Connect Wallet
                    </ButtonLight>
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
                                  size={"20px"}
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

            {!swapIsUnsupported ? null : (
              <UnsupportedCurrencyFooter
                show={swapIsUnsupported}
                currencies={[currencyA, currencyB]}
              />
            )}
            <div className={classNames([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `flex flex-cols-2 gap-3 text-white justify-end` : `hidden`)}>

            </div>
          </div>
        </SwapLayoutCard>
      </DoubleGlowShadowV2>
    </Container>

  );
}

export default Limits
Limits.Guard = NetworkGuard(Feature.LIMIT)
Limits.Layout = SwapLayout('limit-order-page')