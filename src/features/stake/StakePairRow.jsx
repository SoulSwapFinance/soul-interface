import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import useSoulSummoner from '../farm/useSoulSummoner'
import useApprove from '../farm/useApprove'

import { SoulSummonerAddress } from '../farm/constants'

import {
  FlexText,
  FarmContainer,
  FarmRow,
  FarmContentWrapper,
  TokenPairBox,
  FarmItemBox,
  // FarmItemHeading,
  FarmItem,
  // ShowBtn,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  Input,
  SubmitButton,
} from './FarmStyles'

import { Wrap, ClickableText, Heading, Text, ExternalLink } from '../../components/ReusableStyles'

// params to render farm with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

const HideOnMobile = styled(FarmItemBox)`
  @media screen and (max-width: 900px) {
    display: none;
  }
`

const TokenPair = styled(ExternalLink)`
  font-size: 1.2rem;
  padding: 0;

  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`

const StakePairRow = ({ pid, lpSymbol, lpToken, token1, token2, farm }) => {
  const { chainId, account } = useActiveWeb3React()

  const { fetchPid0AprAndLiquidity, fetchUserLpTokenAllocInFarm, enterStaking, leaveStaking, pendingSoul, userInfo } =
    useSoulSummoner(lpToken, farm.token1Address[chainId], farm.token2Address[chainId])
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)

  const [approved, setApproved] = useState(false)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)
  const [pending, setPending] = useState(0)

  // const [earningPerDay, setEarningPerDay] = useState();
  const [percOfFarm, setPercOfFarm] = useState()

  const [apr, setApr] = useState()
  const [liquidity, setLiquidity] = useState()

  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    getAprAndLiquidity()
    fetchPending()
    fetchUserFarmAlloc()
  }, [account])

  /**
   * Runs on initial render/mount and  reruns every second
   */
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending()
        // getAprAndLiquidity()
        // fetchUserFarmAlloc()

        if (showing) {
          fetchBals()
          fetchApproval()
        }
      }, 10000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  /**
   * Opens the function panel dropdown
   */
  const handleShow = () => {
    setShowing(!showing)
    if (!showing) {
      fetchBals()
      fetchApproval()
    }
  }

  /**
   * Checks the user's alloc of the total staked in the farm
   */
  const fetchUserFarmAlloc = async () => {
    const ownership = await fetchUserLpTokenAllocInFarm(pid, account)
    const userStakedPercOfSummoner = Number(ownership?.[4])
    // console.log(userStakedPercOfSummoner, 'userStakedPercOfSummoner')
    if (userStakedPercOfSummoner) setPercOfFarm(Number(userStakedPercOfSummoner).toFixed(2))
    else setPercOfFarm(0)
  }

  /**
   * Checks the amount of lpTokens the SoulSummoner contract holds
   * farm <Object> : the farm object
   * lpToken : the farm lpToken address
   */
  const getAprAndLiquidity = async () => {
    try {
      const result = await fetchPid0AprAndLiquidity()
      const farmApr = result[0]
      const totalLpValue = result[1]

      setLiquidity(Number(totalLpValue).toFixed(0))

      // console.log("apr", farmApr);
      setApr(Number(farmApr).toFixed(0))
    } catch (e) {
      console.warn(e)
    }
  }

  /**
   * Gets the lpToken balance of the user for each pool
   */
  const fetchBals = async () => {
    if (!account) {
      alert('connect wallet')
    } else {
      try {
        const result1 = await userInfo(pid, account)
        const staked = ethers.utils.formatUnits(result1?.[0])
        setStakedBal(staked.toString())

        const result2 = await erc20BalanceOf(account)
        const unstaked = ethers.utils.formatUnits(result2)
        setUnstakedBal(unstaked.toString())

        return [staked, unstaked]
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /**
   * Fetches connected user pending soul
   */
  const fetchPending = async () => {
    if (!account) {
      alert('connect wallet')
    } else {
      try {
        const pending = await pendingSoul(0, account)
        const formatted = ethers.utils.formatUnits(pending.toString())
        setPending(Number(formatted).toFixed(1).toString())
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /**
   * Checks if the user has approved SoulSummoner to move lpTokens
   */
  const fetchApproval = async () => {
    if (!account) {
      alert('connect wallet')
    } else {
      // Checks if SoulSummoner can move tokens
      const amount = await erc20Allowance(account, SoulSummonerAddress)
      if (amount > 0) setApproved(true)
      return amount
    }
  }

  /**
   * Approves SoulSummoner to move lpTokens
   */
  const handleApprove = async () => {
    if (!account) {
      alert('connect wallet')
    } else {
      try {
        const tx = await erc20Approve(SoulSummonerAddress)
        await tx?.wait().then(await fetchApproval())
      } catch (e) {
        alert(e.message)
        console.log(e)
        return
      }
    }
  }

  /**
   * Harvests rewards from SoulSummoner farm
   */
  const handleHarvest = async () => {
    try {
      const tx = await leaveStaking(0)
      await tx?.wait().then(await fetchPending())
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  /**
   * Withdraws staked lpTokens from SoulSummoner farm
   */
  const handleWithdraw = async (amount) => {
    try {
      const tx = await leaveStaking(amount)
      await tx.wait().then(await fetchBals(pid))
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  /**
   * Deposits/stakes lpTokens into SoulSummoner farm
   */
  const handleDeposit = async (amount) => {
    try {
      const tx = await enterStaking(amount)
      await tx.wait().then(await fetchBals(pid))
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  return (
    <>
      <Wrap padding="0" display="flex" justifyContent="center">
        <FarmContainer>
          <FarmRow onClick={() => handleShow()}>
            <FarmContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <Text padding="0" fontSize=".7rem" color="#bbb">
                    Stake/Earn
                  </Text>
                  <TokenPair
                    fontSize="1.2rem"
                    target="_blank"
                    href={`https://app.soulswap.finance/add/${farm.token1Address[4002]}/${farm.token2Address[4002]}`}
                  >
                    {lpSymbol}
                  </TokenPair>
                </Wrap>
              </TokenPairBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  APR
                </Text>
                <FarmItem>{apr ? (apr === 'Infinity' ? '∞%' : apr + '%') : '?'}</FarmItem>
              </FarmItemBox>

              <HideOnMobile>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Tvl
                </Text>
                {liquidity === '0' ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    $0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    ${liquidity}
                  </Text>
                )}
              </HideOnMobile>

              <FarmItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Earned
                </Text>
                {pending === '0.0' ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {pending}
                  </Text>
                )}
              </FarmItemBox>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Ownership
                </Text>
                {percOfFarm === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {percOfFarm}%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {percOfFarm}%
                  </Text>
                )}
              </HideOnMobile>

              {/* <FarmItemBox>
                <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              </FarmItemBox> */}
            </FarmContentWrapper>
          </FarmRow>
        </FarmContainer>
      </Wrap>

      {showing ? (
        <Wrap padding="0" display="flex" justifyContent="center">
          <DetailsContainer>
            <DetailsWrapper>
              <FunctionBox>
                {/* <button >Max</button> */}
                <Wrap padding="0" display="flex" justifyContent="space-between">
                  <Text padding="0" fontSize=".9rem" color="#bbb">
                    Available: {Number(unstakedBal).toFixed(3)}
                  </Text>
                  <ClickableText
                    padding="0"
                    fontSize=".9rem"
                    color="#aaa"
                    onClick={() => (document.getElementById('stake').value = unstakedBal)}
                  >
                    MAX
                  </ClickableText>
                </Wrap>
                <Input name="stake" id="stake" type="number" placeholder="0.0" min="0" />
                <Wrap padding="0" margin="0" display="flex">
                  {approved ? (
                    <SubmitButton
                      height="2.5rem"
                      onClick={() => handleDeposit(ethers.utils.parseUnits(document.getElementById('stake').value))}
                    >
                      Stake
                    </SubmitButton>
                  ) : (
                    <SubmitButton height="2.5rem" onClick={() => handleApprove()}>
                      Approve Stake
                    </SubmitButton>
                  )}
                </Wrap>
              </FunctionBox>

              <FunctionBox>
                <FlexText>
                  <Text padding="0" fontSize=".9rem" color="#bbb">
                    Staked: {Number(stakedBal).toFixed(3)}
                  </Text>
                  <ClickableText
                    padding="0"
                    fontSize=".9rem"
                    color="#aaa"
                    onClick={() => (document.getElementById('unstake').value = stakedBal)}
                  >
                    MAX
                  </ClickableText>
                </FlexText>
                <Input name="unstake" id="unstake" type="number" placeholder="0.0" min="0" />

                <Wrap padding="0" margin="0" display="flex">
                  <SubmitButton
                    height="2.5rem"
                    padding="0"
                    margin=".5rem .6rem .5rem 0"
                    onClick={() => handleHarvest()}
                  >
                    Harvest
                  </SubmitButton>
                  <SubmitButton
                    height="2.5rem"
                    primaryColour="#bbb"
                    color="black"
                    margin=".5rem 0 .5rem .6rem"
                    onClick={() => handleWithdraw(ethers.utils.parseUnits(document.getElementById('unstake').value))}
                  >
                    Unstake
                  </SubmitButton>
                </Wrap>
              </FunctionBox>
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      ) : null}
    </>
  )
}

import { SummonerPid0 } from './StakePids'

export const StakeList = () => {
  const { chainId, account } = useActiveWeb3React()

  // Display token pair - TODO:
  // 1) fetch total farms
  // 2) get lpTokenAddress from calling `poolInfo?.[0]`
  // 3) input into factory to get token1-token2
  // 4) typed out -> [`${token1}`-`${`token2`}`]

  const summonerPid0 = SummonerPid0.map((farm) => (
    <StakePairRow
      key={farm.pid}
      pid={farm.pid}
      lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[chainId]} // TODO: update to 250
      token1={farm.token1}
      token2={farm.token2}
      farm={farm}
    />
  ))

  return (
    <>
      <Wrap padding="0 0 2rem 0">
        <Heading fontSize="1.8rem" textAlign="center">
          Stake
        </Heading>
        <Text fontSize="1rem" padding="0" color="#aaa" textAlign="center">
          Stake SOUL to earn the corresponding token.
        </Text>
      </Wrap>
      <div>{summonerPid0}</div>
    </>
  )
}
