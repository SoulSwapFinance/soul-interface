import { classNames } from "functions";
import React from "react";
import styled from "styled-components";

const HideOnSmall = styled.div`
@media screen and (max-width: 900px) {
  display: none;
}
`

const HideOnMobile = styled.div`
@media screen and (max-width: 600px) {
  display: none;
}
`

const FarmItemBox = styled.div`
  width: 100px;
  display: grid;
  justify-content: center;
  align-items: center;
`

const FarmContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`

const FarmContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0rem 0 0;

  &:last-child {
    justify-content: space-between;
  }

  @media screen and (max-width: 720px) {
    padding: 0;
  }
`

const Text = styled.p`
  padding: ${({ padding }) => (padding ? `${padding}` : "0 0.25rem")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0 0")};
  color: ${({ color }) => (color ? `${color}` : `white`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `1rem`)};
  font-weight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}` : ``)};
  text-align: ${({ textAlign }) => (textAlign ? `${textAlign}` : `center`)};
`;

export function Active() {
  return (
    <div className = "justify-center">
        <FarmContainer>
        <div className="grid grid-cols-1  bg-dark-1000 rounded-md font-bold border-2 border-dark-800 hover:border-purple" >
            <FarmContentWrapper>
              <FarmItemBox
                className="sm:ml-6"
              >
                <Text fontSize=".9" color="#FFFFFF">
                  ASSET
                </Text>
              </FarmItemBox>

            {/* <HideOnMobile>
              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                  STAKED
                </Text>
              </FarmItemBox>
            </HideOnMobile> */}
 
            {/* <HideOnSmall>
              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                  SHARE
                </Text>
              </FarmItemBox>
            </HideOnSmall> */}

              <FarmItemBox
                className="sm:-ml-8 sm:mr-8"
                >
                <Text padding="0" fontSize=".9" color="#FFFFFF">
                  APR
                </Text>
              </FarmItemBox>

              <FarmItemBox
                className="sm:-ml-12"
              >
                <Text padding="0" fontSize=".9" color="#FFFFFF">
                  YIELD
                </Text>
              </FarmItemBox>

              <FarmItemBox
                className="sm:mr-6"
              >
                <Text padding="0" fontSize=".9" color="#FFFFFF">
                  TVL
                </Text>
              </FarmItemBox>

            </FarmContentWrapper>
            </div>
        </FarmContainer>
      </div>
  )
}

export function Inactive() {
  return (
    <div className = "justify-center">
        <FarmContainer>
        <div className="grid grid-cols-1  bg-avaxRed rounded-md font-bold border-2 border-dark-800" >
            <FarmContentWrapper>
              
              <FarmItemBox>
                  <Text fontSize=".8" color="#FFFFFF">
                  ASSET
                  </Text>
              </FarmItemBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                % APR
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
      </div>
  )
}

export function Underworld() {
  return (
    <div className="justify-center">
        <FarmContainer>
        <div className="grid grid-cols-1  bg-ftmBlue rounded-md font-bold border-2 border-dark-800" >
            <FarmContentWrapper>

              <FarmItemBox>
                  <Text fontSize=".8" color="#FFFFFF">
                  SUPPLY
                  </Text>
              </FarmItemBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".8" color="#FFFFFF">
                % APR
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
      </div>
  )
}