import React, { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { ethers } from 'ethers'

import useSoulSummoner from './useSoulSummoner'
import useLpToken from './useLpToken'

import {
  FlexText,
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
import { set } from 'lodash'

// params to render farm with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

// each item will need its own box

const Farm = ({ pid, lpSymbol, lpToken, token1, token2 }) => {
  const { account } = useActiveWeb3React()

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const { withdraw, deposit, pendingSoul, poolInfo, userInfo } = useSoulSummoner()
  const { approve, allowance, balanceOf } = useLpToken(lpToken)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)

  const [pending, setPending] = useState(0)
  const [multiplier, setMultiplier] = useState('?')
  const [approved, setApproved] = useState(false)
  const [showing, setShowing] = useState(false)

  const handleShow = () => {
    // Checks if any amount is staked in PID
    fetchBals(pid)
    setShowing(!showing)
  }

  // Used to get non 1e18 numbers and turn them into 1e18
  const parseAmount = (amount) => {
    const bnAmount = ethers.BigNumber.from(amount)
    const parsed = bnAmount.mul(ethers.BigNumber.from(10).pow(18)).toString()
    return parsed
  }

  const fetchBals = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const result1 = await userInfo(pid)
        const staked = ethers.utils.formatUnits(result1?.[0])
        setStakedBal(staked.toString())

        const result2 = await balanceOf(lpToken)
        const unstaked = ethers.utils.formatUnits(result2)
        setUnstakedBal(unstaked.toString())

        return [staked, unstaked]
      } catch (err) {
        console.log(err)
      }
    }
  }

  // Fetches connected user pending soul
  const fetchPending = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const pending = await pendingSoul(pid)
        const formatted = ethers.utils.formatUnits(pending).toString()
        const parsed = Number(formatted).toFixed(1).toString()
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
      const amount = await allowance()
      if (amount > 0) {
        setApproved(true)
      }
      return amount
    }
  }

  const handleApprove = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const tx = await approve()
        await tx.wait()
        await fetchApproval()
      } catch (e) {
        alert(e.message)
        console.log(e)
        return
      }
    }
  }

  const handleHarvest = async () => {
    try {
      const tx = await withdraw(pid, 0)
      await tx.wait()
      await fetchPending(pid)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  const handleWithdraw = async (amount) => {
    try {
      const parsedAmount = await parseAmount(amount)
      const tx = await withdraw(pid, parsedAmount)
      await tx.wait()
      await fetchBals(pid)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  const handleDeposit = async (amount) => {
    try {
      const parsedAmount = await parseAmount(amount)
      const tx = await deposit(pid, parsedAmount)
      await tx.wait()
      await fetchBals(pid)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  // runs on render
  useEffect(() => {
    fetchMultiplier(pid)
    fetchApproval()
  }, [account])

  // Runs on render + reruns every second
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending(pid)
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
              <TokenPair target="_blank" href={`https://beta.soulswap.finance/add/${token1}/${token2}`}>
                {lpSymbol}
              </TokenPair>
            </TokenPairBox>

            <FarmItemBox>
              <FarmItemHeading>Earned</FarmItemHeading>
              <FarmItem>{pending}</FarmItem>
            </FarmItemBox>

            {/* <FarmItemBox>
              <FarmItemHeading>APR</FarmItemHeading>
              <FarmItem>...%</FarmItem>
            </FarmItemBox> */}

            {/* <FarmItemBox>
              <FarmItemHeading>TVL</FarmItemHeading>
              <FarmItem>$...</FarmItem>
            </FarmItemBox> */}

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
              <SubmitButton primaryColour="#4afd94" hoverColour="#4afd94" onClick={() => handleHarvest()}>
                Harvest
              </SubmitButton>
            </FunctionBox>

            <FunctionBox>
              {/* <button >Max</button> */}
              <FlexText>
                <p>Available: {Number(unstakedBal).toFixed(3)}</p>
                <button onClick={() => (document.getElementById('stake').value = unstakedBal)}>MAX</button>
              </FlexText>
              <Input name="stake" id="stake" type="number" placeholder="0.0" min="0" />
              {approved ? (
                <SubmitButton
                  primaryColour="#45b7da"
                  hoverColour="#45b7da"
                  onClick={() => handleDeposit(document.getElementById('stake').value)}
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
              <FlexText>
                <p>Staked: {Number(stakedBal).toFixed(3)}</p>
                <button onClick={() => (document.getElementById('unstake').value = stakedBal)}>MAX</button>
              </FlexText>
              <Input name="unstake" id="unstake" type="number" placeholder="0.0" min="0" />
              <SubmitButton
                primaryColour="#b72b18"
                hoverColour="#b72b18"
                onClick={() => handleWithdraw(document.getElementById('unstake').value)}
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
      lpSymbol: 'SOUL-WFTM',
      lpAddresses: {
        4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
      },
      token1: '0xf1277d1ed8ad466beddf92ef448a132661956621',
      token2: '0xcf174a6793fa36a73e8ff18a71bd81c985ef5ab5',
    },
    {
      pid: 5,
      lpSymbol: 'SOUL-FUSD',
      lpAddresses: {
        4002: '0xaf02fd55f297f2a591367f6e33dc600ff2be472a',
      },
      token1: '0xf1277d1ed8ad466beddf92ef448a132661956621',
      token2: '0x306557358e20aea124b16a548597897858d13cb2',
    },
    {
      pid: 4,
      lpSymbol: 'FUSD-FETH',
      lpAddresses: {
        4002: '0x0f179c67E3105e848Daf68f331734069bc1aE697',
      },
      token1: '0x306557358e20aea124b16a548597897858d13cb2',
      token2: '0x910a38ce2a26278c3493a95fe83e092ae821df26',
    },
  ]

  const farmList = farms.map((farm) => (
    <Farm
      key={farm.pid}
      pid={farm.pid}
      lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[4002]}
      token1={farm.token1}
      token2={farm.token2}
    />
  ))
  return (
    <>
      {/* Banner */}

      {/* Content */}
      <div>{farmList}</div>
    </>
  )
}
