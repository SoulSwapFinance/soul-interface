import styled from "styled-components";
import { Button } from 'components/Button'
import QuestionHelper from 'components/QuestionHelper'
import {
  Wrap,
  FarmContainer,
  Row,
  StakeContentWrapper,
  TokenPairBox,
  FarmItemBox,
  Text
} from "./Styles";

export function Active() {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <FarmContainer>
          <Row padding=".25rem 1rem">
            <StakeContentWrapper>
              <TokenPairBox>
                <Wrap>
                  <Text padding ="0" fontSize=".8" color="#bbb">
                  ASSET
                  </Text>
                </Wrap>
              </TokenPairBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#bbb">
                % APR
                </Text>
              </FarmItemBox>

              <FarmItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".8" color="#bbb">
                YIELD
                </Text>
              </FarmItemBox>

              {/* <HideOnMobile> */}
                <Text padding="0" fontSize=".8" color="#bbb">
                TVL
                </Text>
              {/* </HideOnMobile> */}
            </StakeContentWrapper>
            
          </Row>
          {/* <Button variant={'link'} color={'purple'} className="absolute top-[5%] right-[10%]"> */}
 
              {/* </Button> */}
        </FarmContainer>
      </Wrap>
    </>
  );
};

export function Inactive() {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <FarmContainer>
          <Row padding=".25rem 1rem">
            <StakeContentWrapper>
              <TokenPairBox>

                <Wrap>
                  <Text padding ="0" fontSize=".8" color="#bbb">
                    ASSET
                  </Text>
                </Wrap>

              </TokenPairBox>

              <FarmItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".8" color="#bbb">
                  YIELD
                </Text>
              </FarmItemBox>

                <Text padding="0" fontSize=".8" color="#bbb">
                  TVL
                </Text>
            </StakeContentWrapper>
            
          </Row>

        </FarmContainer>
      </Wrap>
    </>
  );
};