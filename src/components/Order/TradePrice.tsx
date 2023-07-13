import React, { useCallback } from "react";
import { Price, Currency } from "sdk";
import styled from "styled-components";
import useTheme from "../../hooks/useTheme";
import Typography from "components/Typography";

interface TradePriceProps {
  price: Price<Currency, Currency>;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
  fontSize?: number;
  fontWeight?: number;
}

const StyledPriceContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 400;
  background-color: transparent;
  border: none;
  height: 24px;
  cursor: pointer;
`;

export default function TradePrice({
  price,
  showInverted,
  setShowInverted,
  fontSize,
  fontWeight,
}: TradePriceProps) {
  const theme = useTheme();

  let formattedPrice: string;
  try {
    formattedPrice = showInverted
      ? price.toSignificant(4)
      : price.invert()?.toSignificant(4);
  } catch (error) {
    formattedPrice = "0";
  }

  const label = showInverted
    ? `${price.quoteCurrency?.symbol}`
    : `${price.baseCurrency?.symbol} `;
  const labelInverted = showInverted
    ? `${price.baseCurrency?.symbol} `
    : `${price.quoteCurrency?.symbol}`;
  const flipPrice = useCallback(() => setShowInverted(!showInverted), [
    setShowInverted,
    showInverted,
  ]);

  const text = `${
    "1 " + labelInverted + " = " + formattedPrice ?? "-"
  } ${label}`;

  return (
    <StyledPriceContainer onClick={flipPrice} title={text}>
      <div
        style={{ alignItems: "center", display: "flex", width: "fit-content" }}
      >
        <Typography
          // fontWeight={fontWeight ?? 500}
          // fontSize={fontSize ?? 14}
          size={fontSize ?? 14}
          color={theme.text1}
        >
          {text}
        </Typography>
      </div>
    </StyledPriceContainer>
  );
}
