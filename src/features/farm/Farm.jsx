import React, { useState } from 'react'
import styled from 'styled-components'

// params to render farm with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

// each item will need its own box

// ---------------------
//  Row Section
// ---------------------

const FarmContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`

const FarmRow = styled.div`
  background-color: #38284b;
  margin: 4px;
  border-radius: 8px;
  padding: 5px 15px;
`

const FarmContentWrapper = styled.div`
  display: flex;
`

const FarmItemBox = styled.div`
  width: ${({ width }) => (width ? `${width}` : `100px`)};
  display: grid;
  justify-content: left;
  align-items: center;
  margin-left: ${({ marginLeft }) => (marginLeft ? `${marginLeft}` : `30px`)};
`

const FarmItemHeading = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  color: white;
`

const FarmItem = styled.h2`
  font-size: 1.5rem;
  color: white;
`

const TokenPairBox = styled.div`
  width: 150px;
  display: flex;
  justify-content: left;
  align-items: center;
`

const TokenPair = styled.h2`
  overflow-wrap: break-word;
  font-size: 1.2rem;
  color: white;
`

const ShowBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ShowBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  color: white;
  font-size: 1rem;
  background-color: transparent;

  &:hover,
  &:active {
    text-shadow: 0 0 5px white;
  }
`

// ---------------------
//  Dropdown Section
// ---------------------

const DetailsContainer = styled.div`
  margin: 4px;
`

const DetailsWrapper = styled.div`
  display: flex;
  background-color: #5c5466;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
`

const FunctionBox = styled.div`
  padding: 10px;
`

const Input = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.25rem;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5em;
  border-radius: 0.2em;
  background-color: #888888;
  color: white;

  &:focus {
    border-color: white;
    /* y axis, x axis, blur, spread, colour */
    box-shadow: 0 0 10px 0 white;
    outline: 0;
  }
`

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.5rem 0.25rem 0 0.25rem;
  outline: 0;
  border: none;
  border-radius: 0.25em;
  font-size: 1rem;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
  background: ${({ primaryColour }) => (primaryColour ? primaryColour : 'white')};
  color: black;

  &:hover {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : 'violet')};
    box-shadow: ${({ hoverColour }) => (hoverColour ? `0 0 10px 0 ${hoverColour}` : '0 0 10px 0 violet')};
    background-color: ${({ hoverColour }) => (hoverColour ? hoverColour : 'violet')};
    cursor: pointer;
  }

  &:focus {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : 'violet')};
  }
`

const Farm = ({ lpToken }) => {
  const [showing, setShowing] = useState(false)

  const handleShow = () => {
    setShowing(!showing)
  }

  return (
    <>
      <FarmContainer>
        <FarmRow>
          <FarmContentWrapper>
            <TokenPairBox>
              {/* 2 token logo combined ? */}
              <TokenPair>{lpToken}</TokenPair>
            </TokenPairBox>
            <FarmItemBox>
              <FarmItemHeading>Earned</FarmItemHeading>
              <FarmItem>2500</FarmItem>
            </FarmItemBox>
            <FarmItemBox>
              <FarmItemHeading>APR</FarmItemHeading>
              <FarmItem>150%</FarmItem>
            </FarmItemBox>
            <FarmItemBox>
              <FarmItemHeading>TVL</FarmItemHeading>
              <FarmItem>$1,413,435</FarmItem>
            </FarmItemBox>
            <FarmItemBox marginLeft={'100px'}>
              <FarmItemHeading>Multiplier</FarmItemHeading>
              <FarmItem>3x</FarmItem>
            </FarmItemBox>

            <FarmItemBox>
              {/* <ShowBtnWrapper> */}
              <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              {/* </ShowBtnWrapper> */}
            </FarmItemBox>
          </FarmContentWrapper>
        </FarmRow>
      </FarmContainer>
      {showing ? (
        <DetailsContainer>
          <DetailsWrapper>
            <FunctionBox>
              <Input name="stake" type="number" placeholder="0.0" />
              <SubmitButton primaryColour="#45b7da" type="Submit">
                Stake
              </SubmitButton>
            </FunctionBox>
            <FunctionBox>
              <Input name="unstake" type="number" placeholder="0.0" />
              <SubmitButton primaryColour="#e63d27" type="Submit">
                Unstake
              </SubmitButton>
            </FunctionBox>
          </DetailsWrapper>
        </DetailsContainer>
      ) : null}
    </>
  )
}

export const FarmList = () => {
  const farms = ['SOUL-FTM', 'SOUL-FUSD', 'SOUL-PILL']
  const farmList = farms.map((farm) => <Farm key={farm} lpToken={farm} />)
  return (
    <>
      {/* Banner */}

      {/* Content */}
      <div>{farmList}</div>
    </>
  )
}
