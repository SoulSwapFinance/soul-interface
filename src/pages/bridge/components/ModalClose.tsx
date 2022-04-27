import React from "react";
import { OverlayButton } from "./components";
// import CrossSymbol from "../../assets/image/symbols/Cross.svg";
import Image from 'next/image'

const CrossSymbol = "https://raw.githubusercontent.com/Fantom-foundation/fWallet-interface/94af5d96a763acf8ba1693a54df0f0ad2508d989/packages/app/src/assets/img/symbols/Cross.svg"

const ModalClose: React.FC<any> = ({ onDismiss }) => {
  return (
    <div style={{ position: "absolute", right: "1.5rem", top: "1.5rem" }}>
      <OverlayButton onClick={() => onDismiss()}>
        <Image
          alt="cross symbol"
          src={CrossSymbol}
          width="0.7rem"
          height="0.7rem"
        />
      </OverlayButton>
    </div>
  );
};

export default ModalClose;