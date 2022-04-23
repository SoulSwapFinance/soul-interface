/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'

import { useActiveWeb3React } from 'services/web3'

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
// import { formatNumber } from 'functions/format'
import NavLink from 'components/NavLink'
import { Wrap, ClickableText, Heading, Text, ExternalLink } from '../../components/ReusableStyles'
import Modal from '../../components/DefaultModal'
import Typography from '../../components/Typography'
import { Button } from '../../components/Button'
import ModalHeader from 'components/Modal/Header'

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

const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

const TokenLogo = styled(Image)`
  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`

const BondRowRender = ({ pid, lpSymbol, lpToken, token1, token2, bond }) => {
  const { account, chainId } = useActiveWeb3React()

  const {
    // helper contract
    // totalPendingRewards,
    // fetchStakedBals,
    // fetchTokenRateBals,
    // fetchYearlyRewards,
    fetchUserLpTokenAllocInBond,
    fetchBondStats,
    // usdcPrice,
    mint,
    deposit,
    pendingSoul,
    userInfo,
    fetchUserLpValue,
  } = useSoulBond(pid, lpToken, bond.token1Address, bond.token2Address)
  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)

  const [approved, setApproved] = useState(false)
  // const [confirmed, setConfirmed] = useState(false)

  // const [receiving, setReceiving] = useState(0)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)
  const [pending, setPending] = useState(0)

  const [availableValue, setAvailableValue] = useState(0)
  const [stakedLpValue, setStakedLpValue] = useState(0)
  const [pendingValue, setPendingValue] = useState(0)

  // show confirmation view before minting SOUL
  const [showConfirmation, setShowConfirmation] = useState(false)

  // const [earningPerDay, setEarningPerDay] = useState();
  const [percOfBond, setPercOfBond] = useState()
  // const [poolRate, setPoolRate] = useState()

  // const [yearlySoulRewards, setYearlySoulRewards] = useState()
  const [apr, setApr] = useState()
  const [liquidity, setLiquidity] = useState()
  // const [stakedValue, setLiquidityShare] = useState()

  // const moment = new Date()
  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    getAprAndLiquidity()
    // getYearlyPoolRewards()
    fetchPendingValue()
    fetchUserBondAlloc()
  }, [account])

  /**
   * Runs on initial render/mount and reruns every 2 seconds
   */
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPendingValue()
        // getAprAndLiquidity()
        fetchUserBondAlloc()

        if (showing) {
          fetchBals()
          fetchApproval()
        }
      }, 3000)
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  // const isWFTM = bond.token1Address == '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'

  const dailyRoi
    = (apr / 365)
    //   .toFixed(2)
    //   .toString()
    //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const reached
    = (100 * pendingValue / stakedLpValue)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // const term
  //   = (365 / dailyRoi)
  //     .toFixed(2)
  //     .toString()
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // const elapsed
  //   = (dailyRoi / reached) // Return Per Day / % Acheived = Days Elapsed
  //     .toFixed(2)
  //     .toString()
  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

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
   * 
   * bond <Object> : the bond object
   * lpToken : the bond lpToken address
   */
  const getAprAndLiquidity = async () => {
    try {
      const result = await fetchBondStats(pid, bond.token1, bond.token2)
      const tvl = result[0]
      const apr = result[1]

      setLiquidity(Number(tvl).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      setApr(Number(apr))
      // setApr(Number(apr).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
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
        // get total lp tokens staked in contract for pid from user
        const result1 = await userInfo(pid, account)
        const staked = ethers.utils.formatUnits(result1?.[0])
        setStakedBal(staked.toString())

        // get total lp tokens for pid from user bal
        const result2 = await erc20BalanceOf(account)
        const unstaked = ethers.utils.formatUnits(result2)
        setUnstakedBal(unstaked.toString())

        // const tvlShare = tvl
        // const stakedValue = staked * tvlShare
        // const aValue = stakedValue * tvlShare
        // setAvailableValue(aValue.toString())

        // how many much of tokenA there is 
        // ...

        // get value of available, unstaked lp
        const aLpValue = await fetchUserLpValue(pid, token1, token2, result2)
        const f_aLpValue = Number(aLpValue).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // format to 2 decimals + commas
        setAvailableValue(Number(aLpValue).toFixed(2).toString())

        // get value of staked lp (bonded lp)
        // const sLpValue = await fetchLpValue(token1, token2, result1?.[0]); 
        const sLpValue = await fetchUserLpValue(pid, token1, token2, result1?.[0])
        const f_sLpValue = Number(sLpValue).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // format to 2 decimals + commas
        setStakedLpValue(Number(sLpValue).toFixed(2).toString())

        return [staked, unstaked]
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /**
    * Checks the user's alloc of the total staked in the farm
  */
  const fetchUserBondAlloc = async () => {
    const ownership = await fetchUserLpTokenAllocInBond(pid, account)
    const userStakedPercOfSummoner = Number(ownership?.[4])
    if (userStakedPercOfSummoner) setPercOfBond(Number(userStakedPercOfSummoner).toFixed(2))
    else setPercOfBond(0)
  }

  /**
   * Fetches connected user pending soul
   */
  const fetchPendingValue = async () => {
    if (!account) {
      // alert('connect wallet')
    } else {
      try {
        const pendingResult = await pendingSoul(pid, account)
        const formatted = ethers.utils.formatUnits(pendingResult?.[0].toString())
        setPending(Number(formatted).toFixed(2).toString())

        const pendingValue = pending * pendingResult?.[1]
        setPendingValue(Number(pendingValue).toFixed(2).toString())
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
      const tx = await mint(pid)
      // await tx.wait()
      // await fetchBals(pid)
    } catch (e) {
      // alert(e.message)
      console.log(e)
    }
  }

  /**
   * Deposits/stakes lpTokens into bond
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
                    href={`https://exchange.soulswap.finance/add/${bond.token1Address[chainId]}/${bond.token2Address[chainId]}`}
                  >
                    <TokenLogo
                      src={
                        'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                        bond.token1Address[chainId] +
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
                        bond.token2Address[chainId] +
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
                <BondItem>{
                apr 
                ? (apr === 'Infinity' ? '∞%' 
                : apr + '%') 
                : '?'}</BondItem>
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

              <HideOnMobile desktopOnly={true}>
                {percOfBond === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {percOfBond}%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem" color="#FFFFFF">
                    {percOfBond}%
                  </Text>
                )}
              </HideOnMobile>

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
              {stakedBal == 0 ? (
                <FunctionBox>
                  {/* <button >Max</button> */}
                  <Wrap padding="0" display="flex" justifyContent="space-between">
                    <Text padding="0" fontSize=".9rem" color="#bbb">
                      Available:&nbsp;
                      {Number(unstakedBal) === 0
                        ? '0.000'
                        : Number(unstakedBal) < 0.001
                          ? '<0.001'
                          : Number(unstakedBal)
                            .toFixed(3)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      &nbsp;LP &nbsp; {Number(availableValue) !== 0 ? `($${availableValue})` : ''}
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
                    {(approved && Number(unstakedBal) == 0) ?
                      (
                        (bond.token1 == 'FTM' || bond.token2 == 'FTM') ? (
                          <TokenPairLink
                            target="_blank"
                            rel="noopener"
                            color="#F36FFE" // neon purple
                            href=
                            {bond.token1 == 'FTM' ?
                              `https://exchange.soulswap.finance/add/FTM/${bond.token2Address[chainId]}`
                              : `https://exchange.soulswap.finance/add/FTM/${bond.token1Address[chainId]}`
                            }
                          >
                            CLICK HERE TO CREATE {bond.token1}-{bond.token2} PAIR
                          </TokenPairLink>
                        ) :
                          <TokenPairLink
                            target="_blank"
                            rel="noopener"
                            text-color="#F36FFE" // neon purple
                            href=
                            {`https://exchange.soulswap.finance/add/${bond.token1Address[chainId]}/${bond.token2Address[chainId]}`}
                          >
                            CREATE {bond.token1}-{bond.token2} PAIR
                          </TokenPairLink>
                      ) :
                      approved ?
                        (
                          <SubmitButton
                            height="2.5rem"
                            onClick={() =>
                              handleDeposit(ethers.utils.parseUnits(document.getElementById('stake').value))
                            }
                          >
                            DEPOSIT {bond.token1}-{bond.token2} LP
                          </SubmitButton>
                        ) :
                        (
                          <SubmitButton height="2.5rem" onClick={() => handleApprove()}>
                            APPROVE LP
                          </SubmitButton>
                        )

                    }
                  </Wrap>
                </FunctionBox>
              ) : (
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
                  </ClickableText>
                </FlexText>
                <Input
                  name="unstake"
                  id="unstake"
                  type="number"
                  placeholder="0.0"
                  min="0"
                  onChange={() => getWithdrawable()}
                /> */}
                  <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
                  <Text fontSize=".9rem" padding="0" textAlign="left" color="#aaa">
                    BONDED:&nbsp;
                    {Number(stakedBal) === 0
                      ? '0.000'
                      : Number(stakedBal) < 0.001
                        ? '<0.001'
                        : Number(stakedBal)
                          .toFixed(3)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }&nbsp;LP
                    <br/>
                    VALUE:&nbsp;{Number(stakedLpValue) !== 0 ? `$${stakedLpValue}` : '0'}
                  </Text>
                  <Text fontSize=".9rem" padding="0" color="#F36FFE" textAlign="right">
                    
                    YTD:&nbsp;{Number(reached) > 0 ? `${reached}` : '<0.0'}%
                
                    <br/>
                    {/* <br/> */}
                    { dailyRoi > 0 
                    ? 'DAILY: ' + dailyRoi.toFixed(2) : 0                    }%
                    
                  </Text>
                  </Wrap>
                  <Wrap padding="0" margin="0" display="flex">
                    <SubmitButton
                      height="2.5rem"
                      primaryColor="#bbb"
                      color="black"
                      margin=".5rem 0 .5rem 0"
                      onClick={() =>
                        setShowConfirmation(true)
                        // handleMint()
                      }
                    >
                      MINT SOUL {pendingValue !== 0 ? `($${pendingValue})` : ''}
                    </SubmitButton>
                  </Wrap>
                </FunctionBox>
              )}
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      ) : null}
      <Modal isOpen={showConfirmation} onDismiss={
        () => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Are you sure?`} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
            Minting claims your pending rewards and sends your LP tokens to the Treasury.
            <br /><br />
            You may only mint once and you may not add more to an open bond.
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <SubmitButton
            height="2.5rem"
            // onClick={() => handleDeposit(ethers.utils.parseUnits(document.getElementById('stake').value))}
            onClick={() =>
              // setShowConfirmation(true)
              handleMint()
            }
          >
            I UNDERSTAND THESE TERMS
          </SubmitButton>
          {/* <Button
            color="red"
            size="lg"
            onClick={() => {
              if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                setShowConfirmation(false)
              }
              setShowConfirmation(false)
            }}
          >
            <Typography variant="lg" id="confirm-expert-mode">
              { `I UNDERSTAND THESE TERMS` }
            </Typography> */}

          {/* </Button> */}
        </div>
      </Modal>
    </>
  )
}

export default BondRowRender
