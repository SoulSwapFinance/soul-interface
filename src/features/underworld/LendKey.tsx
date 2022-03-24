import {
  Wrap,
  LendContainer,
  Row,
  LendContentWrapper,
  TokenPairBox,
  LendItemBox,
  Text
} from "./LendStyles";

export default function LendKey() {
  return (
    <>
      <Wrap
        padding="0"
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        <LendContainer>
          <Row padding="0.25rem 1rem">
            <LendContentWrapper>
                <Wrap>
                  <Text padding ="0" fontSize=".8rem" color="#bbb">
                  ASSET
                  </Text>
                </Wrap>

              <LendItemBox>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                STAKED
                </Text>
              </LendItemBox>

              <LendItemBox>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                % APY
                </Text>
              </LendItemBox>

              <LendItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                CLAIMABLE
                </Text>
              </LendItemBox>
              <LendItemBox>
                <Text padding="0" fontSize=".8rem" color="#bbb">
                TVL
                </Text>
              </LendItemBox>

            </LendContentWrapper>
            
          </Row>
        </LendContainer>
      </Wrap>
    </>
  );
};