import React, { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'

import LpTokenABI from '../../constants/abis/uniswap-v2-pair.json'

import useSoulSummoner from './useSoulSummoner'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'

import {
  FarmContainer,
  FarmRow,
  FarmContentWrapper,
  TokenPairBox,
  TokenPair,
  FarmItemBox,
  FarmItemHeading,
  FarmItem,
  ShowBtn,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  SubmitButton,
} from './FarmStyles'

// params to render farm with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

// each item will need its own box

const Farm = ({ pid, lpSymbol, lpToken }) => {
  const { account } = useActiveWeb3React()

  const [showing, setShowing] = useState(false)

  const { withdraw, deposit, harvest, pendingSoul, poolInfo } = useSoulSummoner()

  const [pending, setPending] = useState(0)
  const [multiplier, setMultiplier] = useState('NA')
  const [amount, setAmount] = useState('NA')
  const [usingBalance, setUsingBalance] = useState(false)

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const handleShow = () => {
    setShowing(!showing)
  }

  // Fetches connected user pending soul
  const fetchPending = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const pending = await pendingSoul(pid)
        const parsed = Number(pending).toFixed(2).toString()
        setPending(parsed)
      } catch (err) {
        console.log(err)
      }
    }
  }

  // Fetches pool allocation point and divides by 100 to give `mulitplier`
  const fetchMultiplier = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const poolData = await poolInfo(pid)
        const poolAlloc = poolData?.[1] / BigNumber.from(100)
        setMultiplier(poolAlloc.toString())
      } catch (err) {
        console.log(err)
      }
    }
  }

  // Runs on render
  useEffect(() => {
    fetchMultiplier(pid)
  }, [account])

  // Runs on render + reruns every 3 secs
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending(pid, account)
      }, 3000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  // require: `Approve` token for stake, otherwise show `Stake`
  // earned: `pendingSoul`
  // }

  return (
    <>
      <FarmContainer>
        <FarmRow>
          <FarmContentWrapper>
            <TokenPairBox>
              {/* 2 token logo combined ? */}
              <TokenPair target="_blank" href={`https://testnet.ftmscan.com/address/${lpToken}/#code`}>
                {lpSymbol}
              </TokenPair>
            </TokenPairBox>
            <FarmItemBox>
              <FarmItemHeading>Earned</FarmItemHeading>
              <FarmItem>{pending}</FarmItem>
            </FarmItemBox>
            <FarmItemBox>
              <FarmItemHeading>APR</FarmItemHeading>
              <FarmItem>...%</FarmItem>
            </FarmItemBox>
            <FarmItemBox>
              <FarmItemHeading>TVL</FarmItemHeading>
              <FarmItem>$...</FarmItem>
            </FarmItemBox>
            <FarmItemBox marginLeft={'100px'}>
              <FarmItemHeading>Multiplier</FarmItemHeading>
              <FarmItem>{multiplier}x</FarmItem>
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
              <SubmitButton primaryColour="#4afd94" hoverColour="#4afd94" onClick={() => harvest(pid)}>
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
    <Farm key={farm.pid} pid={farm.pid} lpSymbol={farm.lpSymbol} lpToken={farm.lpAddresses[4002]} />
  ))
  return (
    <>
      {/* Banner */}

      {/* Content */}
      <div>{farmList}</div>
    </>
  )
}
