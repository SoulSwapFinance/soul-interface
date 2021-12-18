import styled from "styled-components";

import {
  BondContainer,
  Row,
  BondContentWrapper,
  TokenPairBox,
  BondItemBox,
} from "./BondStyles";

import {
  Wrap,
  Text,
  ExternalLink,
} from "./ReusableStyles";

const HideOnMobile = styled(BondItemBox)`
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

export default function BondKey(withdraw) {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <BondContainer>
          <Row padding=".5rem 1rem">
            <BondContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <Text padding ="0" fontSize=".9rem" color="#bbb">
                  LP TOKEN PAIR
                  </Text>
                </Wrap>
              </TokenPairBox>

              <BondItemBox>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                % APR
                </Text>
              </BondItemBox>

              <BondItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                EARNED
                </Text>
              </BondItemBox>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".9rem" color="#bbb">
                REWARDS P/D
                </Text>
              </HideOnMobile>

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
            </BondContentWrapper>
          </Row>
        </BondContainer>
      </Wrap>
    </>
  );
};