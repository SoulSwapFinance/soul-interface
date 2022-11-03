import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import { hexToUnit, toFormattedBalance } from "../../utils/conversion";
import Row from "../Row";
import { Typo1, Typo2 } from "../index";
import Image from 'components/Image'
import Spacer from "components/Spacer";
import { useActiveWeb3React } from "services/web3";
import { ChainId } from "sdk";
import Typography from "components/Typography";

export const TokenBalance: React.FC<any> = ({ token }) => {
  const { chainId } = useActiveWeb3React()

  const formattedBalance = toFormattedBalance(
    hexToUnit(token.balanceOf, token.decimals)
  );
  return (
    <Row 
    style={ { justifyContent: "space-between" } }
    >
      { [ChainId.FANTOM].includes(chainId) && ( 
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
      )}
      { [ChainId.AVALANCHE].includes(chainId) && ( 
        <div className={"flex justify-betwwen"}>
        <Spacer size={'lg'} />
        <Image
          alt=""
          height={'28px'}
          width={'28px'}
          // style={{ marginLeft: ".1rem" }}
          src={token.logoURL}
        />
      <Spacer size={'sm'} />
        <Typography>{`${token.name} (${token.symbol})`}</Typography>
        {/* <Typo1 style={{ fontWeight: "bold" }}>{token.symbol}</Typo1> */}
      </div>
      )}
      { [ChainId.FANTOM].includes(chainId) && (
      <Spacer size={'md'} />)}
      { [ChainId.FANTOM].includes(chainId) && (
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
      )}
    </Row>
  );
};

export default TokenBalance;