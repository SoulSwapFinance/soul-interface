import styled from "styled-components";

import {
  MateContainer,
  Row,
  MateContentWrapper,
  TokenPairBox,
  MateItemBox,
} from "./MateStyles";

import {
  Wrap,
  Text,
  ExternalLink,
} from "./ReusableStyles";

const HideOnMobile = styled(MateItemBox)`
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const TokenPair = styled(ExternalLink)`
  font-size: 1.2rem;
  padding: 0;

  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`;

export default function MateKey() {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <MateContainer>
          <Row padding=".25rem 1rem">
            <MateContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <Text padding="0" fontSize=".7rem" color="#bbb">
                    STAKE
                  </Text>
                </Wrap>
              </TokenPairBox>

              <MateItemBox>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  APR
                </Text>
              </MateItemBox>

              <MateItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  EARNED
                </Text>
              </MateItemBox>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  REWARDS P/D
                </Text>
              </HideOnMobile>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  OWNERSHIP
                </Text>
              </HideOnMobile>

              <HideOnMobile>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  TVL
                </Text>
              </HideOnMobile>
            </MateContentWrapper>
          </Row>
        </MateContainer>
      </Wrap>
    </>
  );
};