import React from "react";
import { OverlayButton } from "../index";
import CrossSymbol from "assets/images/icon/Cross.svg";
import Image from 'components/Image'

const ModalClose: React.FC<any> = ({ onDismiss }) => {
  return (
    <div style={{ position: "absolute", right: "1.5rem", top: "1.5rem" }}>
      <OverlayButton onClick={() => onDismiss()}>
        {/* <Image
          alt="cross symbol"
          src={CrossSymbol}
          style={{ width: ".7rem", height: ".7rem" }}
        /> */}
      </OverlayButton>
    </div>
  );
};

export default ModalClose;