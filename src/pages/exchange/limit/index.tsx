import React, { useCallback, useState, Fragment, useEffect } from "react";
import {
  Currency,
  CurrencyAmount,
  Percent,
  TradeType,
} from "sdk";
import { NATIVE, Trade } from "sdk";
// import { AdvancedSwapDetails } from "../order/AdvancedSwapDetails";
// import UnsupportedCurrencyFooter from "../order/UnsupportedCurrencyFooter";
import { MouseoverTooltip, MouseoverTooltipContent } from "components/Tooltip";
import {
  ArrowDown,
  Info,
  Divide,
  X,
  CheckCircle,
  HelpCircle,
} from "react-feather";
import { Text } from "rebass";
import styled from "styled-components";
import {
  ButtonConfirmed,
  ButtonError,
  // ButtonLight,
  ButtonPrimary,
} from "components/Button";
import PurpleCard from "components/Card";
import { AutoColumn } from "components/Column";
// import CurrencyInputPanel from "components/CurrencyInputPanel";
import Row, { AutoRow, RowFixed } from "components/Row";
// import TradePrice from "../order/TradePrice";
import useGelatoLimitOrders from "hooks/gelato/useGelatoLimitOrders";
import { useIsSwapUnsupported } from "hooks/useIsSwapUnsupported";
import { useUSDCValue } from "hooks/useUSDCPrice";
import { Field } from "state/order/actions";
// import { tryParseAmount } from "state/gorder/hooks";
import { maxAmountSpend } from "utils/currency/maxAmountSpend";
import { useWeb3 } from "services/web3/hooks/useWeb3";
import useTheme from "hooks/useTheme";
import {
  ApprovalState,
  useApproveCallbackFromInputCurrencyAmount,
} from "hooks/useApproveCallback";
import Loader from "components/Loader";
import { SOUL_FANTOM } from "constants/gelato/tokens.fantom";
import { CurrencyLogo } from "components/CurrencyLogo";
import { useActiveWeb3React } from "services/web3";
import { tryParseAmount } from "functions/parse";
import { TYPE } from "theme";
import { ArrowWrapper, BottomGrouping, Dots, SwapCallbackError, Wrapper } from "components/Order/styleds";
import ConfirmSwapModal from "components/Order/ConfirmSwapModal";
import UnsupportedCurrencyFooter from "components/Order/UnsupportedCurrencyFooter";
import useGasOverhead from "hooks/gelato/useGasOverhead";
import TradePrice from "components/Order/TradePrice";
import { AdvancedSwapDetails } from "components/Order/AdvancedSwapDetails";
import CurrencyInputPanel from "components/CurrencyInputPanel";
import Input from "components/Input";
// import CurrencyInputPanel from "components/Order/CurrencyInputPanel";

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

interface GelatoLimitOrderProps {
  showCommonBases?: boolean;
}

const Limit = () => {
  const { account, toggleWalletModal } = useWeb3();

  const theme = useTheme();
  const recipient = account ?? null;

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
  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) &&
      !parsedAmounts.input?.equalTo(maxInputAmount)
  );

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
        throw new Error("Invalid input currency");
      }

      if (!currencies.output?.wrapped.address) {
        throw new Error("Invalid output currency");
      }

      if (!rawAmounts.input) {
        throw new Error("Invalid input amount");
      }

      if (!rawAmounts.output) {
        throw new Error("Invalid output amount");
      }

      if (!account) {
        throw new Error("No account");
      }

      handleLimitOrderSubmission({
        inputToken: currencies.input?.isNative
          ? NATIVE[chainId]
          : currencies.input?.wrapped.address,
        outputToken: currencies.output?.isNative
          ? NATIVE[chainId]
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
  const { chainId } = useActiveWeb3React()

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

  const handleMaxInput = useCallback(() => {
    maxInputAmount && handleInput(Field.INPUT, maxInputAmount.toExact());
  }, [maxInputAmount, handleInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => handleCurrencySelection(Field.OUTPUT, outputCurrency),
    [handleCurrencySelection]
  );

  const swapIsUnsupported = useIsSwapUnsupported(
    currencies?.input,
    currencies?.output
  );

  const {
    gasPrice,
    realExecutionPrice,
    realExecutionPriceAsString,
  } = useGasOverhead(parsedAmounts.input, parsedAmounts.output, rateType);

  const showApproveFlow =
    !inputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED));

  const handleApprove = useCallback(async () => {
    await approveCallback();
  }, [approveCallback]);

  return (
    <Fragment>
      <AppBody>
        {/* <SwapHeader handleActiveTab={handleActiveTab} activeTab={activeTab} /> */}
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
              <CurrencyInputPanel
                chainId={chainId}
                label={
                  independentField === Field.OUTPUT ? "From (at most)" : "From"
                }
                value={formattedAmounts.input}
                showMaxButton={showMaxButton}
                currency={currencies.input}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies.output || SOUL_FANTOM}
                showCommonBases={false}
                id="limit-order-currency-input"
              />
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
              <Input.Numeric
                id="rate-input"
                value={formattedAmounts.price}
                onUserInput={(val) => {
                  handleTypeDesiredRate(val)
                }}
                />
              {/* <CurrencyInputPanel
                chainId={chainId}
                value={formattedAmounts.price}
                showMaxButton={showMaxButton}
                // currency={currencies.input}
                onUserInput={handleTypeDesiredRate}
                fiatValue={fiatValueDesiredRate ?? undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies.output}
                showCommonBases={false}
                id="limit-order-currency-rate"
                disableCurrencySelect={true}
                hideBalance={true}
                // showRate={true}
                // isInvertedRate={rateType === Rate.MUL ? false : true}
                // gasPrice={gasPrice}
                // realExecutionPrice={realExecutionPrice ?? undefined}
                // realExecutionPriceAsString={realExecutionPriceAsString}
              /> */}
              <ArrowWrapper clickable>
                <ArrowDown
                  size="16"
                  onClick={() => {
                    //   setApprovalSubmitted(false); // reset 2 step UI for approvals
                    handleSwitchTokens();
                  }}
                  color={
                    currencies.input && currencies.output
                      ? theme.text1
                      : theme.text3
                  }
                />
              </ArrowWrapper>
              <CurrencyInputPanel
                chainId={chainId}
                value={formattedAmounts.output}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT ? "To (at least)" : "To"
                }
                showMaxButton={false}
                hideBalance={false}
                priceImpact={percentageRateDifference}
                currency={currencies.output}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies.input}
                showCommonBases={false}
                // rateType={rateType}
                id="limit-order-currency-output"
              />
            </div>

            <Row
              style={{ justifyContent: !trade ? "center" : "space-between" }}
            >
              {trade ? (
                <RowFixed>
                  {/* Current Market Rate */}
                  <TradePrice
                    price={trade.executionPrice}
                    showInverted={showInverted}
                    setShowInverted={setShowInverted}
                  />
                  <MouseoverTooltipContent content={<AdvancedSwapDetails />}>
                    <StyledInfo />
                  </MouseoverTooltipContent>
                </RowFixed>
              ) : null}
            </Row>

            <BottomGrouping>
              {swapIsUnsupported ? (
                <ButtonPrimary disabled={true}>
                  <TYPE.Main mb="4px">Unsupported Asset</TYPE.Main>
                </ButtonPrimary>
            //   ) : 
            //   !account ? (
            //     <ButtonLight onClick={toggleWalletModal}>
            //       Connect Wallet
            //     </ButtonLight>
              ) : routeNotFound && isLoadingRoute ? (
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
      </AppBody>

      {!swapIsUnsupported ? null : (
        <UnsupportedCurrencyFooter
          show={swapIsUnsupported}
          currencies={[currencies.input, currencies.output]}
        />
      )}
    </Fragment>
  );
}

export default Limit