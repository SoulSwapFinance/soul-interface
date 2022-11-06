import React, { useCallback, useState, Fragment, useEffect, useMemo } from "react"
import {
  ChainId,
  Currency,
  CurrencyAmount,
  NATIVE,
  Percent,
  SOUL,
  Token,
  TradeType,
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
import { SwapLayout } from "layouts/SwapLayout"
import Image from 'next/image'
import { GelatoLimitOrdersHistoryPanel } from "soulswap-limit-orders-react"
import { Toggle } from "components/Toggle"
import SwapAssetPanel from "features/trident/swap/SwapAssetPanel"
import { maxAmountSpend } from "utils/currency/maxAmountSpend"
import { ZERO_ADDRESS } from "constants/index"
// import { useDefaultsFromURLSearch } from "state/limit-order/hooks"
// import { useCurrency } from "hooks/Tokens"

const BodyWrapper = styled.div<{ margin?: string }>`
position: relative;
margin-top: ${({ margin }) => margin ?? "0px"};
max-width: 1080px;
  width: 100%;
  background: ${({ theme }) => theme.bg7};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
  margin-top: 1rem;
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
function AppBody({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  return <BodyWrapper {...rest}>{children}</BodyWrapper>;
}


const StyledInfo = styled(Info)`
  opacity: 0.4;
  color: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  :hover {
    opacity: 0.8;
  }
`;

enum Rate {
  DIV = "DIV",
  MUL = "MUL",
}

// interface GelatoLimitOrderProps {
//   showCommonBases?: boolean;
// }

const Limit = () => {

  const { account, chainId } = useActiveWeb3React();
  // const [inputCurrency, setInputCurrency] = useState(NATIVE[chainId])
  // const [ouputCurrency, setOutputCurrency] = useState(SOUL[chainId])

  const theme = useTheme();
  const recipient = account ?? null;

  const [showOrders, setShowOrders] = useState(false)


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

  const fiatValueInput = useUSDCValue(parsedAmounts.input);

  const desiredRateInCurrencyAmount = tryParseAmount(
    trade?.outputAmount.toSignificant(6),
    currencies.output
  );

  const fiatValueDesiredRate = useUSDCValue(desiredRateInCurrencyAmount);

  const currentMarketRate = trade?.executionPrice ?? undefined;

  const pct =
    currentMarketRate && price
      ? price.subtract(currentMarketRate).divide(currentMarketRate)
      : undefined;

  const percentageRateDifference = pct
    ? new Percent(pct.numerator, pct.denominator)
    : undefined;

  const isValid = !inputError;
  const rawPriceDelta = Number(formattedAmounts.price) - Number(trade?.executionPrice.toSignificant(4))
  const rawPercentDelta = 100 * (rawPriceDelta) / Number(trade?.executionPrice.toSignificant(8))
  const percentDelta = Math.abs(rawPercentDelta)
  const priceDelta = Math.abs(rawPriceDelta)
  const isSell = trade && rateType === Rate.MUL
  const isBuy = trade && rateType === Rate.DIV
  const isProfitable = isSell && rawPriceDelta > 0 || isBuy && rawPriceDelta < 0

  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");
  const handleActiveTab = (tab: "sell" | "buy") => {
    if (activeTab === tab) return;

    handleRateType(rateType, price);
    setActiveTab(tab);
  };
  const handleTypeInput = useCallback(
    (value: string) => {
      handleInput(Field.INPUT, value);
    },
    [handleInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      handleInput(Field.OUTPUT, value);
    },
    [handleInput]
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
    currencies.input && currencies.output
  );
  const routeNotFound = !trade?.route;
  const isLoadingRoute =
    userHasSpecifiedInputOutput &&
    ((parsedAmounts.input && !parsedAmounts.output) ||
      (!parsedAmounts.input && parsedAmounts.output));

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(
    currencyBalances.input
  );
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
      if (!currencies.input?.wrapped.address) {
        throw new Error("Invalid Input Currency");
      }

      if (!currencies.output?.wrapped.address) {
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
        inputToken: currencies.input?.isNative
          ? ZERO_ADDRESS
          : currencies.input?.wrapped.address,
          outputToken: currencies.output?.isNative
          ? ZERO_ADDRESS
          : currencies.output?.wrapped.address,
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
    currencies.input?.wrapped.address,
    currencies.input?.isNative,
    currencies.output?.wrapped.address,
    currencies.output?.isNative,
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
    (inputCurrency) => {
      //  setApprovalSubmitted(false); // reset 2 step UI for approvals
      handleCurrencySelection(Field.INPUT, inputCurrency);
    },
    [handleCurrencySelection]
  );

  // const handleMaxInput = useCallback(() => {
  //   maxInputAmount && handleInput(Field.INPUT, maxInputAmount.toExact());
  // }, [maxInputAmount, handleInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => handleCurrencySelection(Field.OUTPUT, outputCurrency),
    [handleCurrencySelection]
  );

  const swapIsUnsupported = useIsSwapUnsupported(
    currencies?.input,
    currencies?.output
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
        <div className="p-4 px-2 mt-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
          <SwapHeader />
          {/* <OrderHeader handleActiveTab={handleActiveTab} activeTab={activeTab} /> */}
          <Wrapper id="limit-order-page">
            <ConfirmSwapModal
              isOpen={showConfirm}
              trade={trade}
              originalTrade={tradeToConfirm}
              onAcceptChanges={handleAcceptChanges}
              attemptingTxn={attemptingTxn}
              txHash={txHash}
              recipient={recipient}
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
                // currency={currencies.input}
                currency={currencies.input}
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
                  currency={currencies.input}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  fiatValue={fiatValueInput ?? undefined}
                  onCurrencySelect={handleInputSelect}
                  // otherCurrency={currencies.output || SOUL_FANTOM}
                  showCommonBases={false}
                  id="limit-order-currency-input"
                /> */}
                <ArrowWrapper clickable={false}>
                  {rateType === Rate.MUL ? (
                    <X
                      size="16"
                      color={
                        currencies.input && currencies.output
                          ? theme.text1
                          : theme.text3
                      }
                    />
                  ) : (
                    <Divide
                      size="16"
                      color={
                        currencies.input && currencies.output
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
                  // currency={currencies.input}
                  onUserInput={handleTypeDesiredRate}
                  fiatValue={fiatValueDesiredRate ?? undefined}
                  onCurrencySelect={handleInputSelect}
                  // otherCurrency={currencies.output}
                  showCommonBases={false}
                  id="limit-order-currency-rate"
                  disableCurrencySelect={true}
                  hideBalance={true}
                  label={
                    trade &&
                    // trade && rateType === Rate.MUL ? `≈ ${formatNumber(formattedAmounts.price, false, true)} (${currencies.output.symbol})`
                    // : trade && rateType === Rate.MUL ? `≈ ${formatNumber(formattedAmounts.price, false, true)} (${currencies.input.symbol})`
                    // : 
                    `1 ${currencies.input?.symbol} ≈ ${formatNumber(formattedAmounts.price)} ${currencies.output?.symbol}`
                      // ? `${currencies.input.symbol} ≈ ${Number(formattedAmounts.price).toFixed(2)} ${currencies.output.symbol}`
                      // ? `≈ ${(1 / Number(formattedAmounts.price)).toFixed(4)} (${currencies.output.symbol})`
                      // : `≈ ${(1 / Number(formattedAmounts.price)).toFixed(4)} (${currencies.input.symbol})`
                    // : `${currencies.output.symbol} : ${currencies.input.symbol}`

                  }
                // label={`Price Ratio`}
                // showRate={true}
                // isInvertedRate={rateType === Rate.MUL ? false : true}
                // gasPrice={gasPrice}
                // realExecutionPrice={realExecutionPrice ?? undefined}
                // realExecutionPriceAsString={realExecutionPriceAsString}
                />
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      handleSwitchTokens();
                    }}
                    color={
                      currencies.input && currencies.output
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
                currency={currencies.output}
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
                  currency={currencies.output}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies.input}
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
                                  currency={currencies.input}
                                  size={"20px"}
                                  style={{ marginRight: "8px", flexShrink: 0 }}
                                />
                                {/* we need to shorten this string on mobile */}
                                {approvalState === ApprovalState.APPROVED
                                  ? `${currencies.input?.symbol} Allowed.`
                                  : `Approve
                              ${currencies.input?.symbol}.`}
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
                                ${currencies.input?.symbol}. You only have to do
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
          </Wrapper>

          {!swapIsUnsupported ? null : (
            <UnsupportedCurrencyFooter
              show={swapIsUnsupported}
              currencies={[currencies.input, currencies.output]}
            />
          )}
        </div>
      <div className={classNames([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `flex flex-cols-2 gap-3 text-white justify-end` : `hidden`)}>
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
      {!showOrders &&
        <div className="grid grid-cols-1">
          <Image src='https://app.soulswap.finance/title-soul-halfs.png' height="400px" width="600px" alt="logo" />
        </div>
      }
      {showOrders &&
        <div className="ml-0 mb-4 sm:ml-0">
          <GelatoLimitOrdersHistoryPanel />
        </div>
      }
      </DoubleGlowShadowV2>
    </Container>
  );
}

export default Limit
Limit.Guard = NetworkGuard(Feature.LIMIT)
Limit.Layout = SwapLayout('limit-order-page')