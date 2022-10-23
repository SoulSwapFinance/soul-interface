import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { hexToUnit, toFormattedBalance } from "../../utils/conversion";
import Row from "../Row";
import { Typo1, Typo2 } from "../index";
import Image from 'components/Image'
import Spacer from "components/Spacer";

export const TokenBalance: React.FC<any> = ({ token }) => {

  const formattedBalance = toFormattedBalance(
    hexToUnit(token.balanceOf, token.decimals)
  );
  return (
    <Row 
    style={{ justifyContent: "space-between" }}
    >
      <Row style={{ alignItems: "center" }}>
        <Spacer size={'xs'} />
        <Image
          alt=""
          height={'32px'}
          width={'32px'}
          // style={{ marginLeft: ".1rem" }}
          src={token.logoURL}
        />
      <Spacer size={'lg'} />
        <Typo1 style={{ fontWeight: "bold" }}>{token.symbol}</Typo1>
      </Row>
      <Spacer size={'md'} />
      <Row style={{ alignItems: "center" }}>
      <Spacer size={'lg'} />
        <Typo2
          style={{
            fontWeight: "bold",
            color: 'white',
            marginLeft: "2.5rem"
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