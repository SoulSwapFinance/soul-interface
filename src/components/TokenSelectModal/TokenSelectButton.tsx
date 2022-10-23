import React from "react";
import { Button, Typo2 } from "../index";
import useModal from "../../hooks/useModal";
import TokenSelectModal from "./TokenSelectModal";
import Row from "../Row";
import ftmIcon from "assets/networks/fantom.svg";
import Spacer from "../Spacer";
// import vShape from "../../assets/img/shapes/vShape.png";
import Image from 'next/image'
const vShape = 'https://raw.githubusercontent.com/BunsDev/fWallet-interface/buns/packages/app/src/assets/img/shapes/vShape.png'

const TokenSelectButton: React.FC<any> = ({
  currentToken,
  ftmBalance,
  assets,
  setTokenSelected,
  includeNative = true,
}) => {
  const [onPresentSelectTokenModal] = useModal(
    <TokenSelectModal
      ftmBalance={ftmBalance}
      assets={assets}
      setTokenSelected={setTokenSelected}
      includeNative={includeNative}
    />,
    "token-select-modal"
  );
  return (
    <Button
      style={{ flex: 2, padding: "10px" }}
      variant="secondary"
      onClick={() => onPresentSelectTokenModal()}
    >
      <Row style={{ alignItems: "center" }}>
        <Image
          alt=""
          width="24px"
          height="24px"
          src={currentToken?.symbol === "FTM" ? ftmIcon : currentToken?.logoURL}
          style={{ height: "24px" }}
        />
        <Spacer 
        size="xxs" 
        />
        <Typo2>{currentToken?.symbol}</Typo2>
        <Spacer 
        size="sm" 
        />
        <Image
          width="8px"
          height="8px"
          alt="" src={vShape} />
      </Row>
    </Button>
  );
};

export default TokenSelectButton;