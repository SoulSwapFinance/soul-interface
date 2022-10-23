import React from "react";
import { Button, Typo2 } from "../index";
import useModal from "../../hooks/useModal";
import TokenSelectModal from "./TokenSelectModal";
// import Row from "../Row";
import ftmIcon from "assets/networks/fantom.svg";
import Spacer from "../Spacer";
// import vShape from "../../assets/img/shapes/vShape.png";
import Image from 'next/image'
import { SubmitButton } from "features/summoner/Styles";
const vShape = 'https://raw.githubusercontent.com/BunsDev/fWallet-interface/buns/packages/app/src/assets/img/shapes/vShape.png'

const TokenSelectButton: React.FC<any> = ({
  currentToken,
  // chainId,
  ftmBalance,
  assets,
  setTokenSelected,
  includeNative = true,
}) => {
  const [onPresentSelectTokenModal] = useModal(
    <TokenSelectModal
      // chainId={chainId}
      ftmBalance={ftmBalance}
      assets={assets}
      setTokenSelected={setTokenSelected}
      includeNative={includeNative}
    />,
    "token-select-modal"
  );
  return (
    <div className="grid grid-cols-1 mr-1rem">
    <SubmitButton
      style={{ flex: 0.25, padding: "12px" }}
      variant="filled"
      primaryColor={'black'}
      onClick={() => onPresentSelectTokenModal()}
    >
      {/* <Row  */}
      {/* // style={{ alignItems: "center" }}
      // > */}
        <Image
          alt=""
          width="36px"
          height="36px"
          src={currentToken?.symbol === "FTM" ? ftmIcon : currentToken?.logoURL}
          style={{ height: "36px", width: "36px" }}
        />
        {/* <Spacer 
        size="xxs" 
        /> */}
        {/* <Typo2>{currentToken?.symbol}</Typo2> */}
        <Spacer 
        size="sm" 
        />
        <Image
          width="8px"
          height="8px"
          alt="" 
          src={vShape} />
      {/* </Row> */}
    </SubmitButton>    
    </div>

  );
};

export default TokenSelectButton;