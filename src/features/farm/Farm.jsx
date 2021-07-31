import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import useSoulSummoner from './useSoulSummoner'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'

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
  background-color: HSL(267, 30%, 20%);
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
  background-color: HSL(267, 30%, 30%);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
`

const FunctionBox = styled.div`
  padding: 10px;
  width: ${({ width }) => (width ? `${width}` : `100%`)};
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
  background-color: #675c6e;
  color: white;

  &:focus {
    border-color: white;
    /* y axis, x axis, blur, spread, colour */
    /* box-shadow: 0 0 10px 0 white; */
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

const Farm = ({ pid, lpSymbol, lpToken }) => {
  const [showing, setShowing] = useState(false)

  const { harvest, withdraw, deposit, pendingSoul } = useSoulSummoner()

  const [pending, setPending] = useState(0)
  const [amount, setAmount] = useState('')
  const [usingBalance, setUsingBalance] = useState(false)

  // const formattedBalance = balance?.toSignificant(4)
  // const parsedAmount = usingBalance ? usingBalance : tryParseAmount(amount, balance?.currency)

  // const [approvalStateLpToken, approveLpToken] = useApproveCallback(parsedAmount, lpToken)

  const handleShow = () => {
    setShowing(!showing)
  }

  const handlePending = async (pid) => {
    const pending = await pendingSoul(pid)
    const parsed = Number(pending).toFixed(4).toString()
    setPending(parsed)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePending(pid)
    }, 3000)

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer)
  })

  // const fetchPidData = (props) => {
  // use function `poolInfo` & return:
  // - lpAddress[0] the 2 token addresses from factory call (fetch icon from folder in)
  // - allocPoint[1]
  // - accSoulPerShare[3]
  // require: `Approve` token for stake, otherwise show `Stake`
  // earned: `pendingSoul`
  // }

  return (
    <>
      <FarmContainer>
        <FarmRow>
          <FarmContentWrapper>
            <TokenPairBox target="_blank" href={`${lpToken}`}>
              {/* 2 token logo combined ? */}
              <TokenPair>{lpSymbol}</TokenPair>
            </TokenPairBox>
            <FarmItemBox>
              <FarmItemHeading>Earned</FarmItemHeading>
              <FarmItem>{pending}</FarmItem>
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
              <SubmitButton primaryColour="#45b7da" hoverColour="#45b7da" type="Submit">
                Stake
              </SubmitButton>
            </FunctionBox>
            <FunctionBox width="30%">
              <SubmitButton primaryColour="#4afd94" hoverColour="#4afd94" onClick={() => harvest(1)}>
                Harvest
              </SubmitButton>
            </FunctionBox>
            <FunctionBox>
              <Input name="unstake" type="number" placeholder="0.0" />
              <SubmitButton primaryColour="#e63d27" hoverColour="#e63d27" type="Submit">
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
  // Display token pair - TODO:
  // 1) fetch total farms
  // 2) get lpTokenAddress from calling `poolInfo?.[0]`
  // 3) input into factory to get token1-token2
  // 4) typed out -> [`${token1}`-`${`token2`}`]
  const farms = [
    {
      pid: 1,
      lpSymbol: 'SOUL-FTM',
      lpAddresses: {
        4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
      },
      token1: '0xf1277d1ed8ad466beddf92ef448a132661956621',
      token2: '0xcf174a6793fa36a73e8ff18a71bd81c985ef5ab5',
    },
    // {
    //   pid: 2,
    //   lpSymbol: 'SOUL-FUSD',
    //   lpAddresses: {
    //     4002: '',
    //   },
    //   token1: '',
    //   token2: '',
    // },
    // {
    //   pid: 3,
    //   lpSymbol: 'SOUL-PILL',
    //   lpAddresses: {
    //     4002: '',
    //   },
    //   token1: '',
    //   token2: '',
    // },
  ]

  const farmList = farms.map((farm) => (
    <Farm key={farm.pid} pid={farm.pid} lpSymbol={farm.lpSymbol} lpToken={farm.lpSymbol} />
  ))
  return (
    <>
      {/* Banner */}

      {/* Content */}
      <div>{farmList}</div>
    </>
  )
}
