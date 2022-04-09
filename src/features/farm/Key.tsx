import styled from "styled-components";
import { Button } from 'components/Button'
import QuestionHelper from 'components/QuestionHelper'
import {
  Wrap,
  FarmContainer,
  Row,
  FarmContentWrapper,
  TokenPairBox,
  FarmItemBox,
  Text,
  SubmitButton
} from "./Styles";
import React from "react";
import { useSummonerAssistantContract, useSummonerContract } from "hooks";
import { useSummonerUserInfo } from "hooks/useAPI";
// import Table from "./Table";

const HideOnSmall = styled.div`
@media screen and (max-width: 800px) {
  display: none;
}
`

const HideOnMobile = styled.div`
@media screen and (max-width: 600px) {
  display: none;
}
`

export function Active() {
  return (
    <Wrap
    padding="0"
    display="flex"
    justifyContent="center"
    alignContent="center"
  >

        <FarmContainer>
          {/* <div className="grid grid-cols-5 ml-24 mr-6 sm:ml-0 bg-dark-1000"> */}
          <div className="grid grid-cols-1 bg-dark-1000">
            <FarmContentWrapper>
              
            {/* <HideOnMobile> */}
              <FarmItemBox>
                  <Text fontSize=".8" color="#FFFFFF">
                  ASSET
                  </Text>
              </FarmItemBox>
            {/* </HideOnMobile> */}

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                STAKE
                </Text>
              </FarmItemBox>

            <HideOnMobile>
              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                VALUE
                </Text>
              </FarmItemBox>
            </HideOnMobile>
 
            <HideOnSmall>
              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                SHARE
                </Text>
              </FarmItemBox>
            </HideOnSmall>

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                APR
                </Text>
              </FarmItemBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                YIELD
                </Text>
              </FarmItemBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                TVL
                </Text>
              </FarmItemBox>

            </FarmContentWrapper>
            </div>
        </FarmContainer>
          </Wrap>
  )
}