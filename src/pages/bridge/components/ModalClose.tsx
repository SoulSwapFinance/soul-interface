import React from "react";
import { OverlayButton } from "components/index";
import CrossSymbol from "assets/images/icon/Cross.svg";
import Image from 'next/image'

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