import React from "react";
import styled from "styled-components";

interface ModalImageProps {
  src: string;
}

const ModalImage: React.FC<ModalImageProps> = ({ src }) => (
  <StyledModalImage src={src} />
);

const StyledModalImage = styled.div<ModalImageProps>`
  min-height: 110px;
  min-width: 90px;
  background: url(${(props) => props.src});
`;

export default ModalImage;