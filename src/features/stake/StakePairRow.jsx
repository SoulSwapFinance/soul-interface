import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ethers } from 'ethers'

import { useActiveWeb3React } from 'services/web3'

import { useSoulSummonerContract } from 'hooks/useContract'
import useApprove from 'features/bond/hooks/useApprove'

import { SOUL_SUMMONER_ADDRESS } from 'constants/addresses'

import {
  FlexText,
  StakeContainer,
  StakeRow,
  StakeContentWrapper,
  TokenPairBox,
  StakeItemBox,
  // StakeItemHeading,
  StakeItem,
  // ShowBtn,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  Input,
  SubmitButton,
} from './StakeStyles'

import { Wrap, ClickableText, Heading, Text, ExternalLink } from './ReusableStyles'

// params to render farm with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

const HideOnMobile = styled(StakeItemBox)`
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

  const {
    // helper contract
    totalPendingRewards,
    fetchYearlyRewards,
    fetchStakedBals,
    fetchTokenRateBals,
    fetchStakeStats,

    fetchUserLpTokenAllocInFarm,
    leaveStaking,
    enterStaking,
    pendingSoul,
    userInfo,
    getFeePercent,
  } = useSoulSummoner(pid, lpToken, farm.token1Address, farm.token2Address)
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)

  const [approved, setApproved] = useState(false)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)
  const [pending, setPending] = useState(0)

  const [earningPerDay, setEarningPerDay] = useState()
  const [percOfFarm, setPercOfFarm] = useState()

  const [yearlySoulRewards, setYearlySoulRewards] = useState()
  const [apr, setApr] = useState()
  const [liquidity, setLiquidity] = useState()

  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    getAprAndLiquidity()
    getYearlyPoolRewards()
    fetchPending()
    fetchUserFarmAlloc()
  }, [account])

  /**
   * Runs on initial render/mount and  reruns every second
   */
  // useEffect(() => {
  //   if (account) {
  //     const timer = setTimeout(() => {
  //       fetchPending()
  //       // getAprAndLiquidity()
  //       fetchUserFarmAlloc()

  //       if (showing) {
  //         fetchBals()
  //         fetchApproval()
  //       }
  //     }, 8000)

  //     // Clear timeout if the component is unmounted
  //     return () => clearTimeout(timer)
  //   }
  // })

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
    if (userStakedPercOfSummoner) setPercOfFarm(Number(userStakedPercOfSummoner).toFixed(2))
    else setPercOfFarm(0)
  }

  const getYearlyPoolRewards = async () => {
    const pidSoulPerYear = await fetchYearlyRewards(pid)
    const dailyRewards = pidSoulPerYear / 10 ** 18 / 365

    setYearlySoulRewards(
      Number(dailyRewards)
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    )
  }

  /**
   * Checks the amount of lpTokens the SoulSummoner contract holds
   * farm <Object> : the farm object
   * lpToken : the farm lpToken address
   */
  const getAprAndLiquidity = async () => {
    try {
      const result = await fetchStakeStats()
      const tvl = result[0]
      const apr = result[1]

      setLiquidity(
        Number(tvl)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      )

      // console.log("apr", farmApr);
      setApr(
        Number(apr)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      )
    } catch (e) {
      console.warn(e)
    }
  }

  /**
   * Gets the lpToken balance of the user for each pool
   */
  const fetchBals = async () => {
    if (!account) {
      // alert('connect wallet')
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
      // alert('connect wallet')
    } else {
      try {
        const pending = await pendingSoul(pid, account)
        const formatted = ethers.utils.formatUnits(pending.toString())
        setPending(Number(formatted).toFixed(2).toString())
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
      alert('Connect Wallet')
    } else {
      // Checks if SoulSummoner can move tokens
      const amount = await erc20Allowance(account, SOUL_SUMMONER_ADDRESS[chainId | 250])
      if (amount > 0) setApproved(true)
      return amount
    }
  }

  /**
   * Approves SoulSummoner to move lpTokens
   */
  const handleApprove = async () => {
    if (!account) {
      alert('Connect Wallet')
    } else {
      try {
        const tx = await erc20Approve(SOUL_SUMMONER_ADDRESS[chainId | 250])
        await tx?.wait().then(await fetchApproval())
      } catch (e) {
        // alert(e.message)
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
      // alert(e.message)
      console.log(e)
    }
  }

  /**
   * Withdraws staked tokens from SoulSummoner farm
   */
  const handleWithdraw = async (amount) => {
    try {
      const tx = await leaveStaking(amount)
      await tx.wait().then(await fetchBals(pid))
    } catch (e) {
      // alert(e.message)
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
      // alert(e.message)
      console.log(e)
    }
  }

  return (
    <>
      <Wrap padding="0" display="flex" justifyContent="center">
        <StakeContainer>
          <StakeRow onClick={() => handleShow()}>
            <StakeContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <Text padding="0" fontSize="1rem" color="#F36FFE">
                    STAKE SOUL
                  </Text>
                  <TokenPair
                    fontSize="1.2rem"
                    target="_blank"
                    // color="purple"
                    // href={`https://exchange.soulswap.finance/add/${farm.token1Address[chainId]}/${farm.token2Address[chainId]}`}
                  >
                    {lpSymbol}
                  </TokenPair>
                </Wrap>
              </TokenPairBox>

              <StakeItemBox>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  APR
                </Text>
                <StakeItem>{apr ? (apr === 'Infinity' ? '∞%' : apr + '%') : '?'}</StakeItem>
              </StakeItemBox>

              <StakeItemBox desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Earned
                </Text>
                {pending === '0' ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem" color='#F36FFE'>
                    {pending}
                  </Text>
                )}
              </StakeItemBox>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Pool Rewards
                </Text>
                {yearlySoulRewards === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {yearlySoulRewards}
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {yearlySoulRewards}
                  </Text>
                )}
              </HideOnMobile>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Ownership
                </Text>
                {percOfFarm === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {percOfFarm}%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem" color='#F36FFE'>
                    {percOfFarm}%
                  </Text>
                )}
              </HideOnMobile>

              <HideOnMobile>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  TVL
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

              {/* <StakeItemBox>
                <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              </StakeItemBox> */}
            </StakeContentWrapper>
          </StakeRow>
        </StakeContainer>
      </Wrap>

      {showing ? (
        <Wrap padding="0" display="flex" justifyContent="center">
          <DetailsContainer>
            <DetailsWrapper>
              <FunctionBox>
                {/* <button >Max</button> */}
                <Wrap padding="0" display="flex" justifyContent="space-between">
                  <Text padding="0" fontSize=".9rem" color="#bbb">
                    Available: &nbsp;
                    {Number(unstakedBal) === 0
                      ? '0.000'
                      : unstakedBal < 0.001
                      ? '<0.001'
                      : Number(unstakedBal)
                          .toFixed(3)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                    Staked: &nbsp;
                    {Number(stakedBal) === 0
                      ? '0.000'
                      : stakedBal < 0.001
                      ? '<0.001'
                      : Number(stakedBal)
                          .toFixed(3)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                    primaryColor="#bbb"
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

import { SummonerPid0 } from '../../constants/StakePids'

export const StakeList = () => {
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
      lpToken={farm.lpAddresses[chainId || 250]}
      token1={farm.token1}
      token2={farm.token2}
      farm={farm}
    />
  ))

  return (
    <>
      <Wrap padding="0 0 2rem 0">
        {/* <Heading fontSize="1.8rem" textAlign="center">
          Stake
        </Heading>
        <Text fontSize="1rem" padding="0" color="#aaa" textAlign="center">
          Stake SOUL to earn the corresponding token.
        </Text> */}
      </Wrap>
      <div>{summonerPid0}</div>
    </>
  )
}
