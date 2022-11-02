import React from "react"
import styled from "styled-components"
import Image from 'next/image'
// import CrossSymbol from "../../assets/image/symbols/Cross.svg";
const CrossSymbol = "https://raw.githubusercontent.com/Fantom-foundation/fWallet-interface/94af5d96a763acf8ba1693a54df0f0ad2508d989/packages/app/src/assets/img/symbols/Cross.svg"

const OverlayButton = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  text-decoration: none;
  cursor: ${(props) => !props.disabled && "pointer"};
  color: inherit;
  font-family: "proxima-nova", sans-serif;
  transition: 0.2s all;
  :active {
    transform: ${(props) => !props.disabled && "scale(0.98)"};
  }
`;

const ModalClose: React.FC<any> = ({ onDismiss }) => {
  return (
    <div style={{ position: "absolute", right: "1.5rem", top: "1.5rem" }}>
      <OverlayButton onClick={() => onDismiss()}>
        {/* <Image
          alt=""
          src={CrossSymbol}
          style={{ width: ".7rem", height: ".7rem" }}
        /> */}
      </OverlayButton>
    </div>
  );
};

export default ModalClose;