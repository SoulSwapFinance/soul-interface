import React from "react";
import styled, { keyframes } from "styled-components";
import ModalClose from "./ModalClose";

export interface ModalProps {
  onDismiss?: () => void;
}

const Modal: React.FC<any> = ({ children, style, onDismiss }) => {
  return (
    <StyledResponsiveWrapper>
      <StyledModal style={{ ...style }}>
        {onDismiss && <ModalClose onDismiss={onDismiss} />}
        {children}
      </StyledModal>
    </StyledResponsiveWrapper>
  );
};

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const StyledResponsiveWrapper = styled.div<any>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;

  @media (max-width: ${768}px) {
    flex: 1;
    top: 100%;
    right: 0;
    left: 0;
    max-height: 100%;
    animation: ${mobileKeyframes} 0.3s forwards ease-out;
    max-width: 100vw;
  }
`;

const StyledModal = styled.div<any>`
  padding: ${(props) =>
    props.padding === undefined ? "20px 40px" : props.padding};
  background: ${'black'};
  color: ${'white'};
  font-family: "proxima-nova", sans-serif;
  border-radius: 8px;
  backdrop-filter: blur(40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 0;
  min-width: 20rem;
  z-index: 1;
`;

export default Modal;