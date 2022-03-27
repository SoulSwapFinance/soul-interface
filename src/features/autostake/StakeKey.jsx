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
          <Row padding="0.25rem 1rem">
            <StakeContentWrapper>
                <Wrap>
                  <Text padding ="0" fontSize=".8rem" color="#bbb">
                  ASSET
                  </Text>
                </Wrap>

              <StakeItemBox>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                STAKED
                </Text>
              </StakeItemBox>

              <StakeItemBox>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                % APY
                </Text>
              </StakeItemBox>

              <StakeItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                CLAIMABLE
                </Text>
              </StakeItemBox>
              <StakeItemBox>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                TVL
                </Text>
              </StakeItemBox>

            </StakeContentWrapper>
            
          </Row>
        </StakeContainer>
      </Wrap>
    </>
  );
};