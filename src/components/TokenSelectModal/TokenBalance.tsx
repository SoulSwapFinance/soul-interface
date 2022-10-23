import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { hexToUnit, toFormattedBalance } from "../../utils/conversion";
import Row from "../Row";
import { Typo1, Typo2 } from "../index";
import Image from 'components/Image'

export const TokenBalance: React.FC<any> = ({ token, imageSize = " 32px" }) => {
  // const { color } = useContext(ThemeContext);

  const formattedBalance = toFormattedBalance(
    hexToUnit(token.balanceOf, token.decimals)
  );
  return (
    <Row style={{ justifyContent: "space-between" }}>
      <Row style={{ alignItems: "center" }}>
        <Image
          alt=""
          style={{ width: imageSize, height: imageSize, marginRight: ".4rem" }}
          src={token.logoURL}
        />
        <Typo1 style={{ fontWeight: "bold" }}>{token.symbol}</Typo1>
      </Row>
      <Row style={{ alignItems: "center" }}>
        <Typo2
          style={{
            fontWeight: "bold",
            color: 'white',
          }}
        >
          {formattedBalance[0]}
          {formattedBalance[1]}
        </Typo2>
      </Row>
    </Row>
  );
};

export default TokenBalance;