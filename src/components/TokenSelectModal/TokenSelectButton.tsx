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
      ftmBalance={ftmBalance}
      assets={assets}
      setTokenSelected={setTokenSelected}
      includeNative={includeNative}
    />,
    "token-select-modal"
  );
  return (
    <div className="grid grid-cols-1 sm:ml-10">
    <SubmitButton
      // style={{ marginLeft: '.1rem', flex: 0.25, padding: "1px" }}
      variant="bordered"
      primaryColor={'black'}
      onClick={() => onPresentSelectTokenModal()}
    >
      {/* <Row
      style={{ alignItems: "center" }}
      /> */}
        <Image
          alt=""
          width={36}
          height={36}
          src={currentToken?.symbol === "FTM" ? ftmIcon : currentToken?.logoURL}
          style={{ height: 36, width: 36 }}
        />
        {/* <Spacer 
        size="xs" 
        /> */}
        {/* <Typo2 className={'font-bold'}>{currentToken?.symbol}</Typo2> */}
        {/* <Spacer 
        size="xxs" 
        /> */}
        {/* <Image
          width="6px"
          height="6px"
          alt="" 
          src={vShape} /> */}
      {/* </Row> */}
    </SubmitButton>    
    </div>

  );
};

export default TokenSelectButton;