import {
  Wrap,
  StakeContainer,
  Row,
  StakeContentWrapper,
  TokenPairBox,
  StakeItemBox,
  Text
} from "./Styles";

export default function LuxorKey() {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <StakeContainer>
          <Row padding=".25rem 1.25rem">
            <StakeContentWrapper>
                <Wrap>
                  <Text padding ="0" fontSize=".8" color="#bbb">
                  ASSET
                  </Text>
                </Wrap>

              <StakeItemBox>
                <Text padding="0" fontSize=".8" color="#bbb">
                PRICE
                </Text>
              </StakeItemBox>

              <StakeItemBox>
                <Text padding="0" fontSize=".8" color="#bbb">
                ROI
                </Text>
              </StakeItemBox>

              <StakeItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".8" color="#bbb">
                CLAIM
                </Text>
              </StakeItemBox>
              <StakeItemBox>
                <Text padding="0" fontSize=".8" color="#bbb">
                TERM
                </Text>
              </StakeItemBox>

            </StakeContentWrapper>
            
          </Row>
        </StakeContainer>
      </Wrap>
    </>
  );
};