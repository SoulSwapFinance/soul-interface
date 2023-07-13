import {
  Currency,
  CurrencyAmount,
  Pair,
  Percent,
  Price,
  Token,
} from "sdk";
import React, { useState, useCallback, useMemo } from "react"; // Fragment
import styled from "styled-components/macro";
import { darken } from "polished";
// import { useCurrencyBalance } from "../../hooks/Balances";
// import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
// import { CurrencyLogo } from "components/CurrencyLogo";
// import DoubleCurrencyLogo from "../DoubleLogo";
import { Button } from "../../Button";
import { RowBetween, RowFixed } from "../../Row";
import { Input as NumericalInput } from "../../NumericalInput";
import useTheme from "hooks/useTheme";
import { Lock } from "react-feather";
import { AutoColumn } from "../../Column";
import { FiatValue } from "./FiatValue";
import { formatTokenAmount } from "utils/currency/formatTokenAmount";
import { MouseoverTooltip } from "../../Tooltip";
// import HoverInlineText from "../HoverInlineText";
import DropDown from "assets/images/dropdown.svg";
import { isTransactionCostDependentChain } from "soulswap-limit-orders-lib/dist/utils";
// import { Pair } from "../../entities/pair";
// import TradePrice from "../order/TradePrice";
import { RatePercentage } from "./RatePercentage";
import { Rate } from "state/order/actions";
import { useCurrencyBalance } from "state/wallet/hooks";
import { TYPE } from "theme";
import { useWeb3 } from "services/web3/hooks/useWeb3";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import CurrencySearchModal from "modals/SearchModal/CurrencySearchModal";
import { useActiveWeb3React } from "services/web3";
// import Loader from "../Loader";

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? "16px" : "20px")};
  background-color: ${({ theme, hideInput }) =>
    hideInput ? "transparent" : theme.bg7};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
`;

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg7};
  opacity: 0.95;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? "16px" : "20px")};
  border: 1px solid
    ${({ theme, hideInput }) => (hideInput ? " transparent" : theme.bg2)};
  background-color: ${({ theme }) => theme.bg7};
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
  :focus,
  :hover {
    border: 1px solid
      ${({ theme, hideInput }) => (hideInput ? " transparent" : theme.purple)};
  }
`;

const CurrencySelect = styled(Button)<{
  selected: boolean;
  hideInput?: boolean;
}>`
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  background-color: ${({ selected, theme }) =>
    selected ? theme.bg2 : theme.primary7};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 16px;
  box-shadow: ${({ selected }) =>
    selected ? "none" : "0px 6px 10px rgba(0, 0, 0, 0.075)"};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  height: ${({ hideInput }) => (hideInput ? "2.8rem" : "2.4rem")};
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
  padding: 0 8px;
  justify-content: space-between;
  margin-right: ${({ hideInput }) => (hideInput ? "0" : "12px")};
  :focus,
  :hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.bg2 : darken(0.05, theme.primary7)};
  }
`;

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) =>
    selected ? " 1rem 1rem 0.75rem 1rem" : "1rem 1rem 0.75rem 1rem"};
`;

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0 1rem 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`;

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
`;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

// const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
//   margin: 0 0.25rem 0 0.35rem;
//   height: 35%;

//   path {
//     stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
//     stroke-width: 1.5px;
//   }
// `;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? "  margin: 0 0.25rem 0 0.25rem;"
      : "  margin: 0 0.25rem 0 0.25rem;"}
  font-size:  ${({ active }) => (active ? "18px" : "18px")};
`;

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  color: ${({ theme }) => theme.primary7};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  pointer-events: ${({ disabled }) => (!disabled ? "initial" : "none")};
  margin-left: 0.25rem;

  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`;

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  fiatValue?: CurrencyAmount<Currency> | null;
  priceImpact?: Percent;
  id: string;
  showCommonBases?: boolean;
  customBalanceText?: string;
  locked?: boolean;
  showCurrencySelector?: boolean;
  showRate?: boolean;
  isInvertedRate?: boolean;
  realExecutionPrice?: Price<Currency, Currency> | undefined;
  realExecutionPriceAsString?: string | undefined;
  gasPrice?: number;
  rateType?: Rate;
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  showCurrencySelector = true,
  showRate = false,
  isInvertedRate = false,
  // realExecutionPrice,
  // realExecutionPriceAsString,
  rateType,
  ...rest
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  // const [showInverted, setShowInverted] = useState<boolean>(true);

  const { account, chainId } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    chainId,
    account ?? undefined,
    currency ?? undefined
  );
  const theme = useTheme();

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const isTransactionCostDependentChainBool =
    chainId && isTransactionCostDependentChain(chainId);

  const rate = useMemo(
    () =>
      currency && otherCurrency && value
        ? `1 ${
            isInvertedRate ? otherCurrency?.symbol : currency?.symbol
          } = ${value} ${
            isInvertedRate ? currency?.symbol : otherCurrency?.symbol
          }`
        : undefined,
    [currency, isInvertedRate, otherCurrency, value]
  );

  // const realExecutionRateExplainer = useMemo(
  //   () =>
  //     currency && otherCurrency && realExecutionPriceAsString
  //       ? realExecutionPriceAsString === "never executes"
  //         ? realExecutionPriceAsString
  //         : `1 ${
  //             isInvertedRate ? otherCurrency?.symbol : currency?.symbol
  //           } = ${realExecutionPriceAsString} ${
  //             isInvertedRate ? currency?.symbol : otherCurrency?.symbol
  //           }`
  //       : undefined,
  //   [currency, isInvertedRate, otherCurrency, realExecutionPriceAsString]
  // );

  return (
    <InputPanel id={id} hideInput={hideInput} {...rest}>
      {locked && (
        <FixedContainer>
          <AutoColumn gap="sm" justify="center">
            <Lock />
            <TYPE.Label fontSize="12px" textAlign="center">
              The market price is outside your specified price range.
              Single-asset deposit only.
            </TYPE.Label>
          </AutoColumn>
        </FixedContainer>
      )}
      <Container hideInput={hideInput}>
        <InputRow
          style={hideInput ? { padding: "0", borderRadius: "8px" } : {}}
          selected={!onCurrencySelect}
        >
          {showCurrencySelector ? (
            <CurrencySelect
              selected={!!currency}
              hideInput={hideInput}
              className="open-currency-select-button"
              onClick={() => {
                if (onCurrencySelect) {
                  setModalOpen(true);
                }
              }}
            >
              <Aligner>
                <RowFixed>
                    <StyledTokenName
                      className="token-symbol-container"
                      active={Boolean(currency && currency.symbol)}
                    >
                      {(currency &&
                      currency.symbol &&
                      currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                          "..." +
                          currency.symbol.slice(
                            currency.symbol.length - 5,
                            currency.symbol.length
                          )
                        : currency?.symbol) || "Select Token"}
                    </StyledTokenName>
                  {/* )} */}
                </RowFixed>
                {onCurrencySelect && 
                   <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
                // <StyledDropDown selected={!!currency} />
                }
              </Aligner>
            </CurrencySelect>
          ) : null}

          {showRate && (
            <RowFixed style={{ height: "17px" }}>
              <MouseoverTooltip
                text={`The virtual price that will determine your output amount. ${
                  isTransactionCostDependentChainBool
                    ? "It does not account execution gas costs. For that check the real execution rate below."
                    : ""
                } ${rate ? rate + "." : ""}`}
              >
                <TYPE.Main>{"Price"}</TYPE.Main>
              </MouseoverTooltip>
            </RowFixed>
          )}

          {!hideInput && (
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val);
              }}
            />
          )}
        </InputRow>
        {!hideInput && !hideBalance && !showRate && (
          <FiatRow>
            <RowBetween>
              {account ? (
                <RowFixed style={{ height: "17px" }}>
                  <TYPE.Body
                    onClick={onMax}
                    color={theme.text2}
                    fontWeight={400}
                    fontSize={14}
                    style={{ display: "inline", cursor: "pointer" }}
                  >
                    {!hideBalance && !!currency && selectedCurrencyBalance
                      ? (customBalanceText ?? "Balance: ") +
                        formatTokenAmount(selectedCurrencyBalance, 4) +
                        " " +
                        currency.symbol
                      : "-"}
                  </TYPE.Body>
                  {showMaxButton && selectedCurrencyBalance ? (
                    <StyledBalanceMax onClick={onMax}>(Max)</StyledBalanceMax>
                  ) : null}
                </RowFixed>
              ) : (
                "-"
              )}
              {!rateType ? (
                <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
              ) : (
                //  Only show on output panel
                <RatePercentage
                  priceImpact={priceImpact}
                  rateType={rateType}
                  inputCurrency={otherCurrency}
                  outputCurrency={currency}
                />
              )}
            </RowBetween>
          </FiatRow>
        )}

        {/* {showRate &&
          value &&
          currency &&
          otherCurrency &&
          isTransactionCostDependentChainBool && (
            <Fragment>
              <FiatRow>
                <RowBetween>
                  {currency && otherCurrency ? (
                    <MouseoverTooltip
                      text={`The real execution price. Takes into account the gas necessary to execute your order and guarantees that your desired rate is fulfilled. It fluctuates according to gas prices. ${
                        rate
                          ? `Assuming current gas price it should execute when ` +
                            realExecutionRateExplainer +
                            "."
                          : ""
                      }`}
                    >
                      <TYPE.Body
                        onClick={onMax}
                        color={theme.text2}
                        fontWeight={400}
                        fontSize={14}
                        style={{ display: "inline", cursor: "pointer" }}
                      >
                        Real Execution Price
                      </TYPE.Body>
                    </MouseoverTooltip>
                  ) : (
                    "-"
                  )}
                  {realExecutionPrice ? (
                    <TradePrice
                      price={realExecutionPrice}
                      showInverted={showInverted}
                      setShowInverted={setShowInverted}
                    />
                  ) : (
                    <TYPE.Body
                      fontSize={14}
                      color={
                        realExecutionRateExplainer ? theme.text2 : theme.text4
                      }
                    >
                      {realExecutionRateExplainer ? "~" : ""}
                      {realExecutionRateExplainer ? (
                        <HoverInlineText text={realExecutionRateExplainer} />
                      ) : (
                        <Loader />
                      )}
                    </TYPE.Body>
                  )}
                </RowBetween>
              </FiatRow>
            </Fragment>
          )} */}
      </Container>
      {/* {onCurrencySelect && ( */}
        <CurrencySearchModal
        chainId={chainId}
        trigger={modalOpen}
          // isOpen={modalOpen}
          // onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      {/* )} */}
    </InputPanel>
  );
}
