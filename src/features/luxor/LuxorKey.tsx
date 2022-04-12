import React from 'react'
import {
  Wrap,
  StakeContainer,
  Row,
  StakeContentWrapper,
  StakeItemBox,
  Text,
  SubmitButton
} from "./Styles";
import { useLuxorBondContract } from 'hooks/useContract';


export default function LuxorKey() {
  const BondContract = useLuxorBondContract()
  const handleHarvestAll = async () => {
    try {
        let tx
        tx = await BondContract.harvestAll(false)
        await tx?.wait()
    } catch (e) {
        // alert(e.message)
        console.log(e)
    }
  }

  const handleHarvestStakeAll = async () => {
    try {
        let tx
        tx = await BondContract.harvestAll(true)
        await tx?.wait()
    } catch (e) {
        // alert(e.message)
        console.log(e)
    }
  }
  
  return (
    <>
      <div className="flex gap-2 mb-2">
          <SubmitButton
              height="2rem"
              width="50%"
              primaryColor="#F4A703"
              color="black"
              margin=".5rem 0 .5rem 0"
              onClick={() =>
                  handleHarvestAll()
              }
          >
              HARVEST ALL
          </SubmitButton>
          
          <SubmitButton
              height="2rem"
              width="50%"
              primaryColor="#F4A703"
              color="black"
              margin=".5rem 0 .5rem 0"
              onClick={() =>
                  handleHarvestStakeAll()
              }
          >
              HARVEST {`&`} STAKE
          </SubmitButton>
      </div>
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