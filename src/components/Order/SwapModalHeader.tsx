import React, { Dispatch, useState, useEffect } from "react"
import { SetStateAction } from "react"
import { Currency, TradeType } from "sdk"
import { Trade } from "sdk"
import { ArrowDown, AlertTriangle } from "react-feather"
import styled from "styled-components"
// import { useUSDCValue } from "../../hooks/useUSDCPrice"
import { TYPE } from "../../theme"
import { ButtonPrimary } from "../Button"
// import { isAddress, shortenAddress } from "../../utils"
// import { computeFiatValuePriceImpact } from "../../utils/computeFiatValuePriceImpact"
import { AutoColumn } from "../Column"
// import { FiatValue } from "../CurrencyInputPanel/FiatValue"
import { CurrencyLogo } from "../CurrencyLogo"
import { RowBetween, RowFixed } from "../Row"
import {
  TruncatedText,
  SwapShowAcceptChanges,
  DisclaimerText,
} from "./styleds"
import { AdvancedSwapDetails } from "./AdvancedSwapDetails"
import LightCard from "../Card"
import DarkGreyCard from "../Card"
// import TradePrice from "../order/TradePrice"
import useTheme from "../../hooks/useTheme"
// import Toggle from "react-styled-toggle"
import TradePrice from "features/swap/TradePrice"
import useGelatoLimitOrders from "hooks/gelato/useGelatoLimitOrders"
import { Toggle } from "components/Toggle"
import Typography from "components/Typography"

export const AnimatedCard = styled(LightCard)<{ expand: boolean }>`
  padding: 0.75rem;
  margin-top: 0.5rem;
`;

export const ArrowWrapper = styled.div`
  padding: 4px;
  border-radius: 12px;
  height: 32px;
  width: 32px;
  position: relative;
  margin-top: -18px;
  margin-bottom: -18px;
  left: calc(50% - 16px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 2;
`;

export default function SwapModalHeader({
  trade,
  // recipient,
  showAcceptChanges,
  onAcceptChanges,
  onDisclaimerChange,
}: {
  trade?: Trade<Currency, Currency, TradeType>;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
  onDisclaimerChange: Dispatch<SetStateAction<boolean>>;
}) {
  const theme = useTheme();

  const [showInverted, setShowInverted] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  const [disclaimer, setDisclaimer] = useState<boolean>(true);

  const {
    derivedOrderInfo: { price, parsedAmounts },
  } = useGelatoLimitOrders();

  const inputAmount = parsedAmounts.input;
  const outputAmount = parsedAmounts.output;

  // const fiatValueInput = useUSDCValue(inputAmount);
  // const fiatValueOutput = useUSDCValue(outputAmount);

  useEffect(() => {
    onDisclaimerChange(disclaimer);
  }, [disclaimer, onDisclaimerChange]);

  if (!inputAmount || !outputAmount) return null;

  const handleDisclaimer = (value: boolean) => {
    onDisclaimerChange(value);
    setDisclaimer(value);
  };

  return (
    <AutoColumn gap={"4px"} style={{ marginTop: "0rem" }}>
      <DarkGreyCard 
      // padding="0.75rem 1rem"
      >
        <AutoColumn gap={"12px"}>
          <RowBetween align="center">
            <RowFixed gap={"12px"}>
              <CurrencyLogo
                currency={inputAmount.currency}
                size={36}
                style={{ marginRight: "12px" }}
              />
              <Typography className={"flex m-2 text-lg sm:text-xl font-bold"}>
                {inputAmount.currency.symbol}
              </Typography>
            </RowFixed>
            <RowFixed gap={"12px"}>
              <TruncatedText
                fontSize={21}
                fontWeight={500}
                color={
                  showAcceptChanges &&
                  trade?.tradeType === TradeType.EXACT_OUTPUT
                    ? theme.primary7
                    : ""
                }
              >
                {inputAmount.toSignificant(6)}
              </TruncatedText>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
      </DarkGreyCard>
      <ArrowWrapper>
        <ArrowDown size="16" color={theme.text2} />
      </ArrowWrapper>
      <DarkGreyCard 
        // padding="0.75rem 1rem" 
        style={{ marginBottom: "0.25rem" }}
        >
        <AutoColumn gap={"12px"}>
          <RowBetween align="flex-end">
            <RowFixed gap={"12px"}>
              <CurrencyLogo
                currency={outputAmount.currency}
                size={36}
                style={{ marginRight: "12px" }}
              />
              <Typography className={"flex m-2 text-lg sm:text-xl font-bold"}>
                {outputAmount.currency.symbol}
              </Typography>
            </RowFixed>
            <RowFixed gap={"12px"}>
              <TruncatedText fontSize={21} fontWeight={500}>
                {outputAmount.toSignificant(6)}
              </TruncatedText>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
      </DarkGreyCard>
      <RowBetween style={{ marginTop: "0.25rem", padding: "0 1rem" }}>
        {/* <TYPE.Body color={theme.text2} fontWeight={500} fontSize={14}>
          {"Limit Price:"}
        </TYPE.Body> */}
        <TradePrice
          price={price!}
          showInverted={showInverted}
          setShowInverted={setShowInverted}
        />
      {/* </RowBetween> */}

      {/* <LightCard style={{ padding: ".75rem", marginTop: "0.5rem" }}>
        <AdvancedSwapDetails />
      </LightCard> */}

      {/* {showDisclaimer && (
        <AnimatedCard
          style={{ padding: ".75rem", marginTop: "0.5rem" }}
          expand={showDisclaimer}
        >
          <DisclaimerText />
        </AnimatedCard>
      )} */}

      {/* <RowBetween style={{ marginTop: "0.25rem", padding: "0 1rem" }}> */}
        {/* <TYPE.Link
          color={theme.purple}
          fontWeight={500}
          fontSize={14}
          style={{ cursor: "pointer" }}
          onClick={() => setShowDisclaimer(!showDisclaimer)}
        >
          {!showDisclaimer ? "Show" : "Hide"}
        </TYPE.Link> */}
        <Toggle 
          isActive={disclaimer}
          toggle={() => handleDisclaimer(!disclaimer)}
          // name={"disclaimer"}
          // disabled={false}
          // checked={disclaimer}
          // value={""}
          // labelLeft={"Accept"}
          // labelRight={""}
          // height={24}
          // sliderHeight={16}
          // width={44}
          // sliderWidth={16}
          // translate={22}
        />
      </RowBetween>

      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={"0px"}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle
                size={20}
                style={{ marginRight: "8px", minWidth: 24 }}
              />
              <TYPE.Main color={theme.primary7}> Price Updated</TYPE.Main>
            </RowFixed>
            <ButtonPrimary
              style={{
                padding: ".5rem",
                width: "fit-content",
                fontSize: "0.825rem",
                borderRadius: "12px",
              }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      {/* <AutoColumn
        justify="flex-start"
        gap="sm"
        style={{ padding: ".75rem 1rem" }}
      >
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic
            fontWeight={400}
            textAlign="left"
            style={{ width: "100%" }}
          >
            {`Output is estimated. You will receive at least `}
            <b>
              {trade.minimumAmountOut(allowedSlippage).toSignificant(6)}{" "}
              {outputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        ) : (
          <TYPE.italic
            fontWeight={400}
            textAlign="left"
            style={{ width: "100%" }}
          >
            {`Input is estimated. You will sell at most`}
            <b>
              {trade.maximumAmountIn(allowedSlippage).toSignificant(6)}{" "}
              {inputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        )}
      </AutoColumn> */}
      {/* {recipient !== null ? (
        <AutoColumn
          justify="center"
          gap="sm"
          style={{ padding: "12px 0 0 0px" }}
        >
          <TYPE.main>
            Output will be sent to{" "}
            <b title={recipient}>
              {isAddress(recipient) ? shortenAddress(recipient) : recipient}
            </b>
          </TYPE.main>
        </AutoColumn>
      ) : null} */}
    </AutoColumn>
  );
}
