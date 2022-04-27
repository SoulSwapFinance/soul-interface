import React, { useContext, useState } from "react";
import { ThemeContext } from "styled-components";
import InputCurrency from "./InputCurrency";
import { Button } from "components/Button";
import Spacer from "components/Spacer";
import Row from "components/Row";

export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURL: string;
  totalSupply?: string;
  balanceOf?: string;
}

export const FANTOM_NATIVE: Token = {
  address: null,
  decimals: 18,
  name: "Fantom",
  symbol: "FTM",
  logoURL: "https://raw.githubusercontent.com/BunsDev/fWallet-interface/main/packages/app/src/assets/img/chains/Fantom.svg",
};

const InputCurrencyBox: React.FC<any> = ({
  value,
  max,
  setValue,
  disabled,
  minus,
  variant = "old",
}) => {
  const { color } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const handleSetMax = () => {
    setError(null);
    setValue(max);
  };

  return (
    <Row
      style={{
        width: "100%",
        backgroundColor: variant === "new" ? color.primary.black() : "#202F49",
        borderRadius: "8px",
        height: "64px",
        alignItems: "center",
      }}
    >
      <Spacer />
      <InputCurrency
        disabled={disabled}
        value={value}
        max={max}
        handleValue={setValue}
        handleError={setError}
        token={ FANTOM_NATIVE }
      />
      <Row style={{ alignItems: "center" }}>
        <Button
          disabled={disabled}
          fontSize="14px"
          color={color.greys.grey()}
          padding="8px"
          style={{ flex: 1 }}
          variant="tertiary"
          onClick={handleSetMax}
        >
          MAX {minus ? "" : ""}
        </Button>
        <Spacer />
      </Row>
    </Row>
  );
};

export default InputCurrencyBox;