import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ethers } from 'ethers'
import { useActiveWeb3React } from 'services/web3'
import { SOUL_CIRCLE_ADDRESS } from 'sdk'
import useSoulCircle from './useSoulCircle'
// import useMulticall from "../../hooks/useMulticall";
import useApprove from 'features/bond/hooks/useApprove'

import {
  FlexText,
  FarmContainer,
  Row,
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

import { Wrap, ClickableText, Heading, Text, ExternalLink } from './ReusableStyles'

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

const CircleStakeRow = ({ pid, lpSymbol, lpToken, token1, token2, farm, startTime, endTime }) => {
  const { chainId, account } = useActiveWeb3React()

  const { circlePoolInfo, circleUserInfo, circleDeposit, circleWithdraw, circlePendingRewards, fetchTokenRateBals } =
  useSoulCircle()

  // const { getTimestamp } = useMulticall();
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)

  const [approved, setApproved] = useState(false)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)
  const [pending, setPending] = useState(0)

  // const [earningPerDay, setEarningPerDay] = useState();
  const [ownership, setOwnership] = useState(0)
  const [rewardsPerDay, setRewardsPerDay] = useState(0)
  const [tvl, setTvl] = useState(0)

  // time remaining
  const [endingIn, setEndingIn] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(undefined)

  const [yearlySoulRewards, setYearlySoulRewards] = useState()
  const [apr, setApr] = useState()

  // Runs only on initial render/mount
  useEffect(() => {
    fetchPending()
    fetchStats()
  }, [account])

  // Runs on initial render/mount and  reruns every second
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending()
        fetchStats()

        if (showing) {
          fetchBals()
          fetchApproval()
        }
      }, 10000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  // Opens the function panel dropdown
  const handleShow = () => {
    setShowing(!showing)
    if (!showing) {
      fetchBals()
      fetchApproval()
    }
  }

  //   // Counts down time remianing w/o calls
  //   useEffect(() => {
  //     if (timeRemaining === 0) {
  //       return;
  //     } else {
  //       const timer = setTimeout(() => {
  //         setTimeRemaining(displayTimer - 1);
  //       }, 1000);
  //       // Clear timeout if the component is unmounted
  //       return () => clearTimeout(timer);
  //     }
  //   });

  // Checks the user's alloc of the total staked in the farm
  const fetchStats = async () => {
    const poolInfo = await circlePoolInfo(pid)
    const userInfo = await circleUserInfo(pid)
    // const currentTimestamp = await getTimestamp();
    // console.log("poolInfo", poolInfo);
    console.log('userInfo', userInfo)

    // ownership
    const totalStaked = poolInfo?.[3]
    console.log('totalStaked', totalStaked.toString())

    const userStaked = userInfo?.[0]
    console.log('userStaked', Number(userStaked))
    const ownedPerc = (userStaked / totalStaked) * 100
    ownedPerc !== NaN
      ? ownedPerc < 0.01 && ownedPerc > 0
        ? setOwnership('<0.01')
        : setOwnership(Number(ownedPerc).toFixed(2))
      : setOwnership(0)

    // rewards per day
    const perSecond = poolInfo?.[1]
    const perDay = perSecond * 86400
    const formatted = ethers.utils.formatUnits(perDay.toString())
    setRewardsPerDay(
      Number(formatted)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    )

    // tvl
    const tokenPrices = await fetchTokenRateBals()
    const seancePrice = tokenPrices?.[3]
    const rawTvl = (totalStaked * seancePrice) / 10 ** 18
    setTvl(
      Number(rawTvl)
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    )

    const aprPerc = 365 * rewardsPerDay / rawTvl * 100
    console.log('aprPerc', aprPerc)
    setApr(Number(0).toFixed(0))
    // setApr(Number(aprPerc).toFixed(0))

    // start + end
    // if (startTime > currentTimestamp) {
    //   setTimeRemaining(startTime - currentTimestamp);
    //   setEndingIn(false);
    // } else if (currentTimestamp > startTime && currentTimestamp < endTime) {
    //   setTimeRemaining(endTime - currentTimestamp);
    //   setEndingIn(true);
    // } else {
    //   setTimeRemaining(0);
    // }
  }

  // Gets the lpToken balance of the user for each pool
  const fetchBals = async () => {
    try {
      const userInfo = await circleUserInfo(pid)

      const staked = ethers.utils.formatUnits(userInfo?.[0])
      console.log('staked', staked)
      setStakedBal(staked)

      const unstakedBal = await erc20BalanceOf(account)
      const unstaked = ethers.utils.formatUnits(unstakedBal)
      console.log('unstaked', unstaked)
      setUnstakedBal(unstaked)

      return [staked, unstaked]
    } catch (err) {
      console.warn(err)
    }
  }

  // Fetches connected user pending rewards
  const fetchPending = async () => {
    try {
      const pending = await circlePendingRewards(pid)
      const formatted = ethers.utils.formatUnits(pending.toString())
      formatted !== NaN
        ? formatted < 0.01 && formatted > 0
          ? setPending('<0.01')
          : setPending(
              Number(formatted)
                .toFixed(1)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            )
        : setPending(0)
    } catch (err) {
      console.warn(err)
    }
  }

  // Checks if the user has approved contract to move lpTokens
  const fetchApproval = async () => {
    // Checks if SoulSummoner can move tokens
    const amount = await erc20Allowance(account, SOUL_CIRCLE_ADDRESS[chainId])
    if (amount > 0) setApproved(true)
    return amount
  }

  // Approves contract to move lpTokens
  const handleApprove = async () => {
    try {
      const tx = await erc20Approve(SOUL_CIRCLE_ADDRESS[chainId])
    } catch (e) {
      alert(e.message)
      console.log(e)
      return
    }
  }

  // Harvests rewards from contract farm
  const handleHarvest = async () => {
    try {
      const tx = await circleWithdraw(pid, 0)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  // Withdraws staked lpTokens from contract farm
  const handleWithdraw = async (amount) => {
    try {
      const tx = await circleWithdraw(pid, amount)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  // Deposits/stakes lpTokens into contract farm
  const handleDeposit = async (amount) => {
    try {
      const tx = await circleDeposit(pid, amount)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  return (
    <>
      <Wrap padding="0" display="flex" justifyContent="center">
        <FarmContainer>
          <Row onClick={() => handleShow()}>
            <FarmContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <Text padding='0' fontSize="1.15rem">{lpSymbol}</Text>
                </Wrap>
              </TokenPairBox>

              <FarmItemBox>
                <FarmItem>
                  {apr ? (apr === "Infinity" ? "∞%" : apr + "%") : "?"}
                </FarmItem>
              </FarmItemBox>

              <FarmItemBox desktopOnly={true}>
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
                {rewardsPerDay === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    { 'ENDED' } 
                    {/* rewardsPerDay */}
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    { 'ENDED' }
                    {/* rewardsPerDay */}
                  </Text>
                )}
              </HideOnMobile>

              <HideOnMobile desktopOnly={true}>
                {ownership === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {ownership}%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {ownership}%
                  </Text>
                )}
              </HideOnMobile>

              {/* <HideOnMobile desktopOnly={true}>
                {timeRemaining === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    0%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {endingIn ? "Ends in:" : "Starts in:"} {timeRemaining}s
                  </Text>
                )}
              </HideOnMobile> */}

              <HideOnMobile>
                {tvl === '0' ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    $0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    ${tvl}
                  </Text>
                )}
              </HideOnMobile>

              {/* <FarmItemBox>
                <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              </FarmItemBox> */}
            </FarmContentWrapper>
          </Row>
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
                    primaryColor="#bbb"
                    color="black"
                    margin=".5rem 0 .5rem .6rem"
                    onClick={() => handleWithdraw(ethers.utils.parseUnits(document.getElementById('unstake').value))}
                  >
                    Unstake
                  </SubmitButton>
                </Wrap>
                {/* <Wrap padding="0" margin="0">
                  <Text padding="0 0 0 19.5rem" fontSize="0.8rem" color="#bbb">
                    Must hold 1 SEANCE to unstake 1 SOUL
                  </Text>
                </Wrap> */}
              </FunctionBox>
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      ) : null}
    </>
  )
}

export default CircleStakeRow
