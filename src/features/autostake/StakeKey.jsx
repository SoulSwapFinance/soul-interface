import styled from "styled-components";

import {
  Wrap,
  StakeContainer,
  Row,
  StakeContentWrapper,
  TokenPairBox,
  StakeItemBox,
  Text
} from "./StakeStyles";

export default function StakeKey() {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <StakeContainer>
          <Row padding=".25rem 2rem">
            <StakeContentWrapper>
              <TokenPairBox>
                <Wrap>
                  <Text padding ="0" fontSize=".8" color="#bbb">
                  TOKEN
                  </Text>
                </Wrap>
              </TokenPairBox>

              <StakeItemBox>
                <Text padding="0" fontSize=".8" color="#bbb">
                % APY
                </Text>
              </StakeItemBox>

              <StakeItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".8" color="#bbb">
                EARNED
                </Text>
              </StakeItemBox>

              {/* <HideOnMobile> */}
                <Text padding="0" fontSize=".8" color="#bbb">
                  TVL
                </Text>
              {/* </HideOnMobile> */}
            </StakeContentWrapper>
          </Row>
        </StakeContainer>
      </Wrap>
    </>
  );
};