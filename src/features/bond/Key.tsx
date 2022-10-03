import React from 'react'
import styled from 'styled-components'
import {
  Wrap,
  BondContainer,
  // Row,
  BondContentWrapper,
  BondItemBox,
  Text
} from "./Styles";

const HideOnMobile = styled.div`
@media screen and (max-width: 600px) {
  display: none;
}
`

export default function BondKey() {

  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >

        <BondContainer>
          <div className=".25rem .5rem">
            <BondContentWrapper>
              <Wrap>
                <Text padding ="0" fontSize=".9" color="#bbb">
                ASSET
                </Text>
              </Wrap>

              <HideOnMobile>
              <BondItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                STAKE
                </Text>
              </BondItemBox>
              </HideOnMobile>

              <BondItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                APR
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                REACHED
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                TVL
                </Text>
              </BondItemBox>

            </BondContentWrapper>
            
          </div>
        </BondContainer>
      </Wrap>
    </>
  );
};