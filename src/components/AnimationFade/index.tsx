import React, { useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import styled from "styled-components";

const FadeInOut: React.FC<any> = ({ children }) => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
    return () => setMount(false);
  }, []);

  return (
    <Transition in={mount} timeout={200}>
      {(state) => <StyledContainer state={state}>{children}</StyledContainer>}
    </Transition>
  );
};

const StyledContainer = styled.div<any>`
  transition: 0.5s all;
  opacity: ${({ state }) => (state === "entered" ? 1 : 0)};
`;

export default FadeInOut;