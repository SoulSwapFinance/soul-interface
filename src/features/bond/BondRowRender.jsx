/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import useSoulBond from './hooks/useSoulBond'
import useApprove from './hooks/useApprove'
import { SoulBondAddress } from './constants'
import {
  BondContainer,
  Row,
  BondContentWrapper,
  TokenPairBox,
  BondItemBox,
  BondItem,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  Input,
  SubmitButton,
} from './BondStyles'

import { Wrap, ClickableText, Heading, Text, ExternalLink } from '../../components/ReusableStyles'

// params to render bond with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

const HideOnMobile = styled(BondItemBox)`
  @media screen and (max-width: 900px) {
    display: none;
  }
`

const TokenPair = styled(ExternalLink)`
  font-size: 1.15rem;
  padding: 0;

  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`

const TokenLogo = styled(Image)`
  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`

const BondRowRender = ({ pid, lpSymbol, lpToken, token1, token2, bond }) => {
  const { account } = useActiveWeb3React() // chainId

  const {
    // helper contract
    // totalPendingRewards,
    // fetchStakedBals,
    // fetchTokenRateBals,
    fetchYearlyRewards,
    fetchBondStats,

    fetchUserLpTokenAllocInBond,
    mint,
    deposit,
    pendingSoul,
    userInfo,
  } = useSoulBond(pid, lpToken, bond.token1Address, bond.token2Address)
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)

  const [approved, setApproved] = useState(false)

  const [receiving, setReceiving] = useState(0)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)
  const [pending, setPending] = useState(0)

  // const [earningPerDay, setEarningPerDay] = useState();
  // const [percOfBond, setPercOfBond] = useState()
  // const [poolRate, setPoolRate] = useState()

  // const [yearlySoulRewards, setYearlySoulRewards] = useState()
  const [apr, setApr] = useState()
  const [liquidity, setLiquidity] = useState()

  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    getAprAndLiquidity()
    // getYearlyPoolRewards()
    fetchPending()
    // fetchUserBondAlloc()
  }, [account])

  /**
   * Runs on initial render/mount and reruns every 2 seconds
   */
  // useEffect(() => {
  //   if (account) {
  //     const timer = setTimeout(() => {
  //       fetchPending()
  //       // getAprAndLiquidity()
  //       fetchUserBondAlloc()

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
   * Checks the amount of lpTokens the SoulSummoner contract holds
   * bond <Object> : the bond object
   * lpToken : the bond lpToken address
   */
  const getAprAndLiquidity = async () => {
    try {
      const result = await fetchBondStats(pid, bond.token1, bond.token2)
      const tvl = result[0]
      const apr = result[1]

      setLiquidity(
        Number(tvl)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      )

      // console.log("apr", bondApr);
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
      const amount = await erc20Allowance(account, SoulBondAddress)
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
        const tx = await erc20Approve(SoulBondAddress)
        await tx?.wait().then(await fetchApproval())
      } catch (e) {
        // alert(e.message)
        console.log(e)
        return
      }
    }
  }

  // /**
  //  * Harvests rewards from SoulSummoner bond
  //  */
  // const handleHarvest = async () => {
  //   try {
  //     const tx = await deposit(pid, 0)
  //     await tx?.wait().then(await fetchPending(pid))
  //   } catch (e) {
  //     // alert(e.message)
  //     console.log(e)
  //   }
  // }

  /**
   * Mints SOUL Bond
   */
  const handleMint = async () => {
    try {
      // console.log('minting', amount.toString())
      const tx = await bond(pid)
      await tx.wait()
      // await fetchBals(pid)
    } catch (e) {
      // alert(e.message)
      console.log(e)
    }
  }

  /**
   * Deposits/stakes lpTokens into SoulSummoner bond
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
        <BondContainer>
          <Row onClick={() => handleShow()}>
            <BondContentWrapper>
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
                    href={`https://exchange.soulswap.finance/add/${bond.token1Address[250]}/${bond.token2Address[250]}`}
                  >
                    <TokenLogo
                      src={
                        'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                        bond.token1Address[250] +
                        '/logo.png'
                      }
                      alt="LOGO"
                      width="44px"
                      height="44px"
                      objectFit="contain"
                      className="rounded-full"
                    />
                    <TokenLogo
                      src={
                        'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                        bond.token2Address[250] +
                        '/logo.png'
                      }
                      alt="LOGO"
                      width="44px"
                      height="44px"
                      objectFit="contain"
                      className="rounded-full"
                    />
                    <Text fontWeight="bold" textAlign="center" padding="0" fontSize=".8rem" color="#F36FFE">
                      {lpSymbol}
                    </Text>
                  </TokenPair>
                </Wrap>
              </TokenPairBox>

              <BondItemBox>
                <BondItem>{apr ? (apr === 'Infinity' ? '∞%' : apr + '%') : '?'}</BondItem>
              </BondItemBox>

              <BondItemBox desktopOnly={true}>
                {pending === '0.00' ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem" color="#F36FFE">
                    {pending}
                  </Text>
                )}
              </BondItemBox>

              {/* <HideOnMobile desktopOnly={true}>
                {yearlySoulRewards === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {yearlySoulRewards}
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {yearlySoulRewards}
                  </Text>
                )}
              </HideOnMobile> */}

              {/* <HideOnMobile desktopOnly={true}>
                {percOfBond === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {percOfBond}%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem" color="#F36FFE">
                    {percOfBond}%
                  </Text>
                )}
              </HideOnMobile> */}

              <HideOnMobile>
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

              {/* <BondItemBox>
                <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              </BondItemBox> */}
            </BondContentWrapper>
          </Row>
        </BondContainer>
      </Wrap>

      {showing ? (
        <Wrap padding="0" display="flex" justifyContent="center">
          <DetailsContainer>
            <DetailsWrapper>
              {stakedBal === 0 ? (
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
                        BOND LP
                      </SubmitButton>
                    ) : (
                      <SubmitButton height="2.5rem" onClick={() => handleApprove()}>
                        APPROVE LP
                      </SubmitButton>
                    )}
                  </Wrap>
                </FunctionBox>
              ) : (
                <></>
              )}

              <FunctionBox>
                {/* <FlexText> */}
                {/* <ClickableText
                    padding="0"
                    fontSize=".9rem"
                    color="#aaa"
                    onClick={() => {
                      document.getElementById('unstake').value = stakedBal
                      getWithdrawable()
                    }}
                  >
                    MAX
                  </ClickableText> */}
                {/* </FlexText> */}
                {/* <Input
                  name="unstake"
                  id="unstake"
                  type="number"
                  placeholder="0.0"
                  min="0"
                  onChange={() => getWithdrawable()}
                /> */}

                <Text fontSize=".9rem" padding="0" color="#aaa">
                  Bonded:{' '}
                  {Number(stakedBal)
                    .toFixed(3)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  LP
                </Text>
                <Wrap padding="0" margin="0" display="flex">
                  <SubmitButton
                    height="2.5rem"
                    primaryColour="#bbb"
                    color="black"
                    margin=".5rem 0 .5rem 0"
                    onClick={() =>
                      handleMint(
                        // TODO: handleMint
                        ethers.utils.parseUnits(document.getElementById('unstake').value)
                      )
                    }
                  >
                    MINT SOUL
                  </SubmitButton>
                </Wrap>

                <Wrap padding="0">
                  <Wrap padding="0" display="flex" justifyContent="center">
                    <Text fontSize=".9rem" padding="0" color="#F36FFE">
                      Exchange deposited LP for earned SOUL.
                    </Text>

                    {/* {isBondMode !== 0 ? (
                  <Text fontSize=".9rem" padding="0" color="#F36FFE">
                    Minting sends your LP in exchange for SOUL. 
                  </Text>
                ) : (
                  <Text fontSize=".9rem" padding="0" color="#F36FFE">
                    Minting sends LP in exchange for SOUL. 
                  </Text>
                )} */}
                    {/* <Text fontSize=".9rem" textAlign="center" color="#aaa">
                      Receiving {pending} SOUL
                    </Text> */}
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

export default BondRowRender
