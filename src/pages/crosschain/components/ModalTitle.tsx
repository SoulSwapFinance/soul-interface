import React from "react";
import styled from "styled-components";

interface ModalTitleProps {
  text?: string;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ text }) => (
  <StyledModalTitle>{text}</StyledModalTitle>
);

const StyledModalTitle = styled.div`
  align-items: center;
  justify-content: center;
  color: black;
  display: flex;
  font-size: 22px;
  font-weight: 700;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

export default ModalTitle;