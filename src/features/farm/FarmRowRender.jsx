/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import useSoulSummoner from './hooks/useSoulSummoner'
import useApprove from './hooks/useApprove'
import { MulticallAddress, SoulSummonerAddress, SUMMONER_HELPER_ADDRESS as SummonerHelperAddress } from './constants'
import {
  FlexText,
  FarmContainer,
  FarmRow,
  FarmContentWrapper,
  TokenPairBox,
  FarmItemBox,
  // FarmItemHeading,
  FarmItem,
  ShowBtn,
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

const FarmRowRender = ({ pid, lpSymbol, lpToken, token1, token2, farm }) => {
  const { chainId, account } = useActiveWeb3React()

  const {
    // helper contract
    totalPendingRewards,
    harvestAllFarms,
    fetchYearlyRewards,
    fetchStakedBals,
    fetchTokenRateBals,
    fetchFarmStats,

    fetchUserLpTokenAllocInFarm,
    withdraw,
    deposit,
    pendingSoul,
    userInfo,
    getFeePercent,
  } = useSoulSummoner(pid, lpToken, farm.token1Address, farm.token2Address)
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)

  const [approved, setApproved] = useState(false)

  const [feePercent, setFeePercent] = useState(0)
  const [feeAmount, setFeeAmount] = useState(0)
  const [receiving, setReceiving] = useState(0)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)
  const [pending, setPending] = useState(0)

  // const [earningPerDay, setEarningPerDay] = useState();
  const [percOfFarm, setPercOfFarm] = useState()
  const [poolRate, setPoolRate] = useState()

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
   * Runs on initial render/mount and reruns every 2 seconds
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
      fetchFeePercent()
    }
  }

  const fetchFeePercent = async () => {
    const percent = await getFeePercent(pid)
    percent !== 0 ? setFeePercent(percent / 10 ** 18) : setFeePercent(0)
  }

  const getWithdrawable = async () => {
    const rawAmount = document.getElementById('unstake').value

    if (rawAmount !== 0 && rawAmount !== undefined && rawAmount !== '' && rawAmount !== null) {
      const amount = document.getElementById('unstake').value

      const feePerc = feePercent / 100

      const fee = amount * feePerc
      const receive = amount - fee

      fee !== 0 ? setFeeAmount(fee) : setFeeAmount(0)
      receive !== 0 ? setReceiving(receive) : setReceiving(0)
    } else {
      setFeeAmount(0)
      setReceiving(0)
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
      const result = await fetchFarmStats(pid, farm.token1, farm.token2)
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
   * Gets the emissions rate for a given pool
   */

  // const fetchPoolRate = async () => {
  //   if (!account) {
  //     // alert('connect wallet')
  //   } else {
  //     try {
  //       const allocationPoints = await poolInfo(pid)
  //       const totalAllocation = await totalAllocPoint()

  //       const allocation = ethers.utils.formatUnits(allocationPoints?.[1])
  //       const totalAllocationPoints = ethers.utils.formatUnits(totalAllocation)

  //       const poolRate = Number(250000 / totalAllocationPoints / allocationPoints)

  //       setRate(poolRate.toString())

  //       return [poolRate]

  //     } catch (err) {
  //       console.warn(err)
  //     }
  //   }
  // }

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
      alert('Connect Wallet')
    } else {
      try {
        const tx = await erc20Approve(SoulSummonerAddress)
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
      const tx = await deposit(pid, 0)
      await tx?.wait().then(await fetchPending(pid))
    } catch (e) {
      // alert(e.message)
      console.log(e)
    }
  }

  /**
   * Withdraws staked lpTokens from SoulSummoner farm
   */
  const handleWithdraw = async (amount) => {
    try {
      // console.log('withdrawing', amount.toString())
      const tx = await withdraw(pid, amount)
      await tx.wait()
      await fetchBals(pid)
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
      // console.log('depositing', amount.toString())
      const tx = await deposit(pid, amount)
      await tx.wait()
      await fetchBals(pid)
    } catch (e) {
      // alert(e.message)
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
                  {/* <Text padding="0" fontSize=".7rem" color="#bbb">
                    Token Pair
                  </Text> */}
                  <TokenPair
                    fontSize="1.2rem"
                    target="_blank"
                    color="#F36FFE" // neon purple
                    href={`https://app.soulswap.finance/add/${farm.token1Address[chainId]}/${farm.token2Address[chainId]}`}
                  >
                    {lpSymbol}
                  </TokenPair>
                </Wrap>
              </TokenPairBox>

              <FarmItemBox>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Apr
                </Text>
                <FarmItem>{apr ? (apr === 'Infinity' ? '∞%' : apr + '%') : '?'}</FarmItem>
              </FarmItemBox>

              <FarmItemBox desktopOnly={true}>
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
              </FarmItemBox>

              <HideOnMobile desktopOnly={true}>
                <Text padding="0" fontSize=".7rem" color="#bbb">
                  Daily Rewards
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
                <Text fontSize=".9rem" padding="0" color="#F36FFE">
                  Withdrawal fee: {feePercent}%, decreasing 1% daily until 0%.
                </Text>
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
                <Input
                  name="unstake"
                  id="unstake"
                  type="number"
                  placeholder="0.0"
                  min="0"
                  onChange={() => getWithdrawable()}
                />

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

                <Wrap padding="0">
                  <Wrap padding="0" display="flex">
                    <Text fontSize=".9rem" padding="0" color="#aaa">
                      Fee Amount: {feeAmount}
                    </Text>
                    <Text fontSize=".9rem" padding="0 0 0 6.5rem" color="#aaa">
                      Receiving: {receiving}
                    </Text>
                  </Wrap>
                </Wrap>
              </FunctionBox>
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      ) : null}
    </>
  )
}

export default FarmRowRender
