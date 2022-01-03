import styled from "styled-components";

import {
  FarmContainer,
  Row,
  FarmContentWrapper,
  TokenPairBox,
  FarmItemBox,
} from "./FarmStyles";

import {
  Wrap,
  Text,
  ExternalLink,
} from "./ReusableStyles";

const HideOnMobile = styled(FarmItemBox)`
  @media screen and (max-width: 620px) {
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

export default function FarmKey(withdraw) {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <FarmContainer>
          <Row padding=".5rem 1rem">
            <FarmContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <Text padding ="0" fontSize=".9rem" color="#bbb">
                  LP TOKEN PAIR
                  </Text>
                </Wrap>
              </TokenPairBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                % APR
                </Text>
              </FarmItemBox>

              <FarmItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                EARNED
                </Text>
              </FarmItemBox>

              {/* <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                REWARDS P/D
                </Text>
              </HideOnMobile> */}

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                OWNERSHIP
                </Text>
              </HideOnMobile>

              <HideOnMobile>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                  VALUE (TVL)
                </Text>
              </HideOnMobile>
            </FarmContentWrapper>
          </Row>
        </FarmContainer>
      </Wrap>
    </>
  );
};