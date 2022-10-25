import React from "react";
import styled from "styled-components";

const ModalContent: React.FC<any> = ({ children, style }) => {
  return <StyledModalContent style={style}>{children}</StyledModalContent>;
};

const StyledModalContent = styled.div`
  width: 100%;
  padding: ${(props) =>
    props.style?.padding ? props.style.padding : `${props.theme.spacing[3]}px`};
  background-color: #333333;
  border-radius: 8px;
  text-align: center;
  @media (max-width: ${576}px) {
    flex: 1;
    overflow: auto;
  }
`;

export default ModalContent;