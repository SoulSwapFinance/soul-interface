import React, { useContext, useState } from "react"
import { ThemeContext } from "styled-components"
import Row from "../Row"
import Spacer from "../Spacer"
import InputCurrency from "./InputCurrency"
import { Button } from "../index"
import { Token } from 'utils/account/types'
import FtmLogo from "assets/networks/fantom.svg";
import { NATIVE } from "sdk"
import { useActiveWeb3React } from "services/web3"

export const FANTOM_NATIVE: Token = {
  address: null,
  decimals: 18,
  name: "Fantom",
  symbol: "FTM",
  logoURL: FtmLogo,
};

const InputCurrencyBox: React.FC<any> = ({
  value,
  max,
  setValue,
  disabled,
  minus,
  variant = "old",
}) => {
  const [error, setError] = useState(null);
  const { chainId } = useActiveWeb3React()
  const handleSetMax = () => {
    setError(null);
    setValue(max);
  };

  return (
    <Row
      style={{
        width: "100%",
        backgroundColor: variant === "new" ? 'black' : "#202F49",
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
        token={NATIVE[chainId]}
      />
      <Row style={{ alignItems: "center" }}>
        <Button
          disabled={disabled}
          fontSize="14px"
          color={'grey'}
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