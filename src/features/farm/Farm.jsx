import React, { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { ethers } from 'ethers'

import useSoulSummoner from './useSoulSummoner'
import useLpToken from './useLpToken'

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
  Input,
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

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const { withdraw, deposit, pendingSoul, poolInfo, userInfo } = useSoulSummoner()
  const { approve, allowance } = useLpToken(lpToken)

  const [pending, setPending] = useState(0)
  const [multiplier, setMultiplier] = useState('?')
  const [approved, setApproved] = useState(false)
  const [showing, setShowing] = useState(false)

  const handleShow = () => {
    setShowing(!showing)
  }

  // Used to get non 1e18 numbers and turn them into 1e18
  const parseAmount = (amount) => {
    const parsed = ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(18)).toString()
    return parsed
  }

  // Fetches connected user pending soul
  const fetchPending = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const pending = await pendingSoul(pid)
        const formatted = ethers.utils.formatUnits(pending)
        const parsed = Number(formatted).toFixed().toString()
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

  const fetchApproval = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      // Checks if SoulSummoner can move tokens
      const amount = await allowance(account)
      if (amount > 0) setApproved(true)
      return amount
    }
  }

  const handleApprove = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        await approve()
        await fetchApproval()
      } catch (e) {
        alert(e.message)
        console.log(e)
        return
      }
    }
  }

  // Runs on render
  useEffect(() => {
    fetchMultiplier(pid)
    fetchApproval()
  }, [account])

  // Runs on render + reruns every 3 secs
  useEffect(() => {
    // Checks if any amount is staked in PID
    const staked = userInfo(pid)
    if (account && staked?.[0] !== 0) {
      const timer = setTimeout(() => {
        fetchPending(pid, account)
      }, 3000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

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
            <FunctionBox width="30%">
              <SubmitButton primaryColour="#4afd94" hoverColour="#4afd94" onClick={() => withdraw(pid, 0)}>
                Harvest
              </SubmitButton>
            </FunctionBox>

            <FunctionBox>
              <Input name="stake" id="stake" type="number" placeholder="0.0" min="0" />
              {approved ? (
                <SubmitButton
                  primaryColour="#45b7da"
                  hoverColour="#45b7da"
                  onClick={() => deposit(pid, parseAmount(document.getElementById('stake').value))}
                >
                  Stake
                </SubmitButton>
              ) : (
                <SubmitButton primaryColour="#da9045" hoverColour="#da9045" onClick={() => handleApprove()}>
                  Approve Stake
                </SubmitButton>
              )}
            </FunctionBox>

            <FunctionBox>
              <Input name="unstake" id="unstake" type="number" placeholder="0.0" min="0" />
              <SubmitButton
                primaryColour="#b72b18"
                hoverColour="#b72b18"
                onClick={() => withdraw(pid, parseAmount(document.getElementById('unstake').value))}
              >
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
