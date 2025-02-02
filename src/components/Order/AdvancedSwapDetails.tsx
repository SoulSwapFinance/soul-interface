import React, { useMemo } from "react";
import { constants } from "soulswap-limit-orders-lib";
import { isTransactionCostDependentChain } from "soulswap-limit-orders-lib/dist/utils";
import { CurrencyAmount } from "sdk";
import useGelatoLimitOrders from "hooks/gelato/useGelatoLimitOrders";
import useGelatoLimitOrdersLib from "hooks/gelato/useGelatoLimitOrdersLib";
import useTheme from "../../hooks/useTheme";
import { Rate } from "state/order/actions";
import { TYPE } from "../../theme";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";
import { MouseoverTooltip } from "../Tooltip";
import { useActiveWeb3React } from "services/web3";
import useGasOverhead from "hooks/gelato/useGasOverhead";

export function AdvancedSwapDetails() {
  const theme = useTheme();
  const { chainId } = useActiveWeb3React();
  const {
    derivedOrderInfo: { parsedAmounts, rawAmounts },
    orderState: { rateType },
  } = useGelatoLimitOrders();

  const library = useGelatoLimitOrdersLib();

  const { realExecutionPriceAsString } = useGasOverhead(
    // gasPrice,
    parsedAmounts.input,
    parsedAmounts.output,
    rateType
  );

  const isInvertedRate = rateType === Rate.DIV;

  const realExecutionRateWithSymbols = useMemo(
    () =>
      parsedAmounts.input?.currency &&
      parsedAmounts.output?.currency &&
      realExecutionPriceAsString
        ? realExecutionPriceAsString === "never executes"
          ? realExecutionPriceAsString
          : `1 ${
              isInvertedRate
                ? parsedAmounts.output.currency.symbol
                : parsedAmounts.input.currency.symbol
            } = ${realExecutionPriceAsString} ${
              isInvertedRate
                ? parsedAmounts.input.currency.symbol
                : parsedAmounts.output.currency.symbol
            }`
        : undefined,
    [parsedAmounts, realExecutionPriceAsString, isInvertedRate]
  );

  const outputAmount = parsedAmounts.output;

  const rawOutputAmount = rawAmounts.output ?? "0";
  const { gelatoFeePercentage } = useMemo(() => {
    // minReturn, slippagePercentage,
    if (!outputAmount || !library || !chainId)
      return {
        minReturn: undefined,
        slippagePercentage: undefined,
        gelatoFeePercentage: undefined,
      };

    if (isTransactionCostDependentChain(chainId))
      return {
        minReturn: outputAmount,
        slippagePercentage: undefined,
        gelatoFeePercentage: undefined,
      };

    const { minReturn } = library.getFeeAndSlippageAdjustedMinReturn(
      rawOutputAmount
    );

    const slippagePercentage = library.slippageBPS / 100;
    const gelatoFeePercentage = library.gelatoFeeBPS / 100;

    const minReturnParsed = CurrencyAmount.fromRawAmount(
      outputAmount.currency,
      minReturn
    );

    return {
      minReturn: minReturnParsed,
      slippagePercentage,
      gelatoFeePercentage,
    };
  }, [outputAmount, chainId, library, rawOutputAmount]);

  const expiryDate = new Date(
    new Date().getTime() + constants.MAX_LIFETIME_IN_SECONDS * 1000
  ).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });

  return !chainId ? null : (
    <AutoColumn gap="8px">
      {!isTransactionCostDependentChain(chainId) ? (
        <>
          <RowBetween>
            <RowFixed>
              <TYPE.Black fontSize={12} fontWeight={400} color={theme.text2}>
                Order Fee
              </TYPE.Black>
            </RowFixed>
            <TYPE.Black textAlign="right" fontSize={12} color={theme.text1}>
              {gelatoFeePercentage ? `${gelatoFeePercentage}` : "-"}%
            </TYPE.Black>
          </RowBetween>

          {/* <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={12} fontWeight={400} color={theme.text2}>
                Slippage
              </TYPE.black>
            </RowFixed>
            <TYPE.black textAlign="right" fontSize={12} color={theme.text1}>
              {slippagePercentage ? `${slippagePercentage}` : "-"}%
            </TYPE.black>
          </RowBetween> */}
        </>
      ) : (
        <>
          {/* <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={12} fontWeight={400} color={theme.text2}>
                Gas Price
              </TYPE.black>
            </RowFixed>
            <TYPE.black textAlign="right" fontSize={12} color={theme.text1}>
              {gasPrice
                // ? `${parseFloat(formatUnits(gasPrice, "gwei")).toFixed(0)} GWEI`
                : "-"}
            </TYPE.black>
          </RowBetween> */}
          <RowBetween>
            <RowFixed>
              <MouseoverTooltip
                text={`The real execution price. Takes into account the gas necessary to execute your order and guarantees that your desired rate is fulfilled. It fluctuates according to gas prices. ${
                  realExecutionRateWithSymbols
                    ? `Assuming current gas price it should execute when ` +
                      realExecutionRateWithSymbols +
                      "."
                    : ""
                }`}
              >
                <TYPE.Black fontSize={12} fontWeight={400} color={theme.text2}>
                  Execution Price
                </TYPE.Black>{" "}
              </MouseoverTooltip>
            </RowFixed>
            <TYPE.Black textAlign="right" fontSize={12} color={theme.text1}>
              {realExecutionRateWithSymbols
                ? `${realExecutionRateWithSymbols}`
                : "-"}
            </TYPE.Black>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TYPE.Black fontSize={12} fontWeight={400} color={theme.text2}>
                Order Fee
              </TYPE.Black>
            </RowFixed>
            <TYPE.Black textAlign="right" fontSize={12} color={theme.text1}>
              {gelatoFeePercentage ? `${gelatoFeePercentage}` : "-"}%
            </TYPE.Black>
          </RowBetween>

          {/* <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={12} fontWeight={400} color={theme.text2}>
                Slippage
              </TYPE.black>
            </RowFixed>
            <TYPE.black textAlign="right" fontSize={12} color={theme.text1}>
              {slippagePercentage ? `${slippagePercentage}` : "-"}%
            </TYPE.black>
          </RowBetween> */}
        </>
      )}

      {/* <RowBetween>
        <RowFixed>
          <MouseoverTooltip
            text={`The minimum amount you can receive. It includes all fees and maximum slippage tolerance.`}
          >
            <TYPE.black fontSize={12} fontWeight={400} color={theme.text2}>
              Minimum Received
            </TYPE.black>
          </MouseoverTooltip>
        </RowFixed>
        <TYPE.black textAlign="right" fontSize={12} color={theme.text1}>
          {minReturn
            ? `${minReturn.toSignificant(4)} ${
                outputAmount ? outputAmount.currency.symbol : "-"
              }`
            : "-"}
        </TYPE.black>
      </RowBetween> */}
      <RowBetween>
        <RowFixed>
          <MouseoverTooltip
            text={`After your order is expired it might never be executed. Please cancel your order once expired`}
          >
            <TYPE.Black fontSize={12} fontWeight={400} color={theme.text2}>
              Expiration Date
            </TYPE.Black>
          </MouseoverTooltip>
        </RowFixed>
        <TYPE.Black textAlign="right" fontSize={12} color={theme.text1}>
          {expiryDate}
        </TYPE.Black>
      </RowBetween>
    </AutoColumn>
  );
}
