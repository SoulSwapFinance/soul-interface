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
} from './Styles'
// import { formatNumber } from 'functions/format'
import NavLink from 'components/NavLink'
import { Wrap, ClickableText, Heading, Text, ExternalLink } from '../../components/ReusableStyles'
import Modal from '../../components/DefaultModal'
import Typography from '../../components/Typography'
// import { Button } from '../../components/Button'
import ModalHeader from 'components/Modal/Header'
import { useBondUserInfo, useSoulBondInfo } from 'hooks/useAPI'
import { formatNumber, formatPercent, tryParseAmount } from 'functions'
import { useSoulPrice } from 'hooks/getPrices'
import AssetInput from 'components/AssetInput'
import { Token } from 'sdk'

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

  const { deposit, mint } = useSoulBond(pid, lpToken, bond.token1Address, bond.token2Address)
  const { erc20Allowance, erc20Approve } = useApprove(lpToken)

  const [showing, setShowing] = useState(false)
  const [approved, setApproved] = useState(false)
  // const [availableValue, setAvailableValue] = useState(0)
  const [depositValue, setDepositValue] = useState('0')

  // show confirmation view before minting SOUL
  const [showConfirmation, setShowConfirmation] = useState(false)

  const assetAddress = lpToken
  console.log('asset:%s', assetAddress)
  const soulPrice = useSoulPrice()

  // API DATA
  const { soulBondInfo } = useSoulBondInfo(pid)
  const apr = Number(soulBondInfo.apr)
  const { soulBondUserInfo } = useBondUserInfo(pid, account)

  const assetName = soulBondUserInfo.name
  const liquidity = Number(soulBondUserInfo.tvl)
  const lpPrice = Number(soulBondUserInfo.pairPrice)

  const stakedBal = Number(soulBondUserInfo.stakedBalance)
  const unstakedBal = Number(soulBondUserInfo.userBalance)
  const pending = Number(soulBondUserInfo.pendingSoul) / 1e18
  
  const assetToken = new Token(250, assetAddress, 18, assetName)
  const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  
  // CALCULATIONS
  const stakedLpValue = stakedBal * lpPrice
  // const availableValue = unstakedBal * lpPrice
  const pendingValue = pending * soulPrice
  const percOfBond = 100 * stakedBal / liquidity

  /**
   * Runs on initial render/mount and reruns every 2 seconds
   */
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        if (showing) {
          fetchApproval()
        }
      }, 10_000)
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  // const isWFTM = bond.token1Address == '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'

  const dailyRoi
    = (apr / 365)

  const reached
    = formatNumber((100 * pendingValue / stakedLpValue), false, true)

  /**
   * Opens the function panel dropdown
   */
  const handleShow = () => {
    setShowing(!showing)
    if (!showing) {
      fetchApproval()
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
      const tx = await deposit(pid, parsedDepositValue.quotient.toString())
      // await tx.wait()
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
                {bond.token2Address[chainId] && <Wrap className="flex-cols-2">
                  <TokenLogo
                    src={
                      'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                      bond.token1Address[chainId] +
                      '/logo.png'
                    }
                    alt="LOGO"
                    width="38px"
                    height="38px"
                    objectFit="contain"
                    className="rounded-full items-center justify-center text-center"
                  />
                  <TokenLogo
                    src={
                      'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                      bond.token2Address[chainId] +
                      '/logo.png'
                    }
                    alt="LOGO"
                    width="38px"
                    height="38px"
                    objectFit="contain"
                    className="rounded-full items-center justify-center text-center"
                  />
                </Wrap>}
              </TokenPairBox>

              <BondItemBox>
                <Text fontSize=".8rem" color="#FFFFFF">
                  {formatNumber(stakedBal, false, true)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize=".8rem" color="#FFFFFF">
                  {formatPercent(apr)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize=".8rem" color="#FFFFFF">
                  {formatNumber(pending, false, true)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize=".8rem" color="#FFFFFF">
                  {formatPercent(percOfBond)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize=".8rem">
                  {formatNumber(liquidity, true, true)}
                </Text>
              </BondItemBox>

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
                    {/* <Text padding="0" fontSize=".9rem" color="#bbb">
                      Available:&nbsp;
                      { formatNumber(unstakedBal, false, true) }
                      &nbsp;LP &nbsp; { Number(availableValue) !== 0 ? `($${availableValue})` : '' }
                    </Text> */}
                    {/* <ClickableText
                      padding="0"
                      fontSize=".9rem"
                      color="#aaa"
                      // TODO FIX MAX //
                      onClick={() => ( setValue(unstakedBal) )}
                    >
                      MAX
                    </ClickableText> */}
                    <AssetInput
                      currencyLogo={false}
                      currency={assetToken}
                      currencyAddress={assetAddress}
                      value={depositValue}
                      // balance={tryParseAmount(account, assetToken)}
                      showBalance={true}
                      onChange={setDepositValue}
                      showMax={false}
                    />
                  {/* <Input name="stake" id="stake" type="number" placeholder="0.0" min="0" /> */}
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
                            handleDeposit(depositValue)
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
                  <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
                    <Text fontSize=".9rem" padding="0" textAlign="left" color="#aaa">
                      BONDED:&nbsp;
                      {Number(stakedBal) === 0
                        ? '0.000'
                        : Number(stakedBal) < 0.001
                          ? '<0.001'
                          : formatNumber(stakedBal, false, true)
                      }&nbsp;LP
                      <br />
                      VALUE:&nbsp;{Number(stakedLpValue) !== 0 ? `${formatNumber(stakedLpValue, true, true)}` : '0'}
                    </Text>
                    <Text fontSize=".9rem" padding="0" color="#F36FFE" textAlign="right">

                      YTD:&nbsp;{Number(reached) > 0 ? `${formatPercent(reached)}` : '<0.0%'}

                      <br />
                      {dailyRoi > 0
                        ? 'DAILY: ' + dailyRoi.toFixed(2) : 0}%

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
                      MINT SOUL { pendingValue !== 0 ? `(${formatNumber(pendingValue, true, false) })` : '' }
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
            onClick={ () => handleMint() }
          >
            I UNDERSTAND THESE TERMS
          </SubmitButton>
        </div>
      </Modal>
    </>
  )
}

export default BondRowRender
