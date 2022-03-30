import {
  Wrap,
  StakeContainer,
  Row,
  StakeContentWrapper,
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
          <Row padding=".25rem .5rem">
            <StakeContentWrapper>
              <Wrap>
                <Text padding ="0" fontSize=".9" color="#bbb">
                ASSET
                </Text>
              </Wrap>
              <StakeItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                PRICE
                </Text>
              </StakeItemBox>

              <StakeItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                ROI
                </Text>
              </StakeItemBox>

              <StakeItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
                PAYOUT
                </Text>
              </StakeItemBox>
              <StakeItemBox>
                <Text padding="0" fontSize=".9" color="#bbb">
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