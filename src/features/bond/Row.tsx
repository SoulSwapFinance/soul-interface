/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import BondInputPanel from './Input'
import { useActiveWeb3React } from 'services/web3'
import useSoulBond from './hooks/useSoulBond'
import useApprove from './hooks/useApprove'
import { ChainId, SOUL_BOND_ADDRESS, WNATIVE } from 'sdk'
import {
  BondContainer,
  BondContentWrapper,
  BondItemBox,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  SubmitButton,
} from './Styles'
import { Wrap, Text, ExternalLink } from 'components/ReusableStyles'
import Modal from '../../components/DefaultModal'
import Typography from '../../components/Typography'
import ModalHeader from 'components/Modal/Header'
import { useBondUserInfo, usePairInfo, useUserPairInfo, useSoulBondInfo } from 'hooks/useAPI'
import { classNames, formatNumber, formatPercent, tryParseAmount } from 'functions'
import { useSoulPrice } from 'hooks/getPrices'
import { Token, NATIVE } from 'sdk'
import { getChainColor, getChainColorCode } from 'constants/chains'
import DoubleCurrencyLogo from 'components/DoubleLogo'

const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

// const TokenLogo = styled(Image)`
//   @media screen and (max-width: 400px) {
//     font-size: 1rem;
//     padding-right: 10px;
//   }
// `

const HideOnSmall = styled.div`
@media screen and (max-width: 900px) {
  display: none;
}
`

const HideOnMobile = styled.div`
@media screen and (max-width: 600px) {
  display: none;
}
`

const BondRowRender = ({ pid, lpToken, token0Symbol, token0Address, token1Symbol, token1Address, lpSymbol, bond }) => {
  const { account, chainId } = useActiveWeb3React()

  const { deposit, mint } = useSoulBond(pid, lpToken, bond.token0Address, bond.token1Address)
  const { erc20Allowance, erc20Approve } = useApprove(lpToken)
  const [showing, setShowing] = useState(false)
  const [approved, setApproved] = useState(false)
  const [depositValue, setDepositValue] = useState('0')

  // show confirmation view before minting SOUL
  const [showConfirmation, setShowConfirmation] = useState(false)

  const assetAddress = lpToken
  const soulPrice = useSoulPrice()
  const chain = chainId == ChainId.AVALANCHE ? 'avalanche' : 'fantom'

  // API DATA //
  const { soulBondInfo } = useSoulBondInfo(pid)
  const apr = Number(soulBondInfo.apr)
  const { soulBondUserInfo } = useBondUserInfo(pid, account)
  const { pairUserInfo } = useUserPairInfo(account, assetAddress)
  const assetName = soulBondUserInfo.symbol
  const liquidity = Number(soulBondUserInfo.tvl)
  const lpPrice = Number(soulBondUserInfo.pairPrice)
  const stakedBal = Number(soulBondUserInfo.stakedBalance)
  const unstakedBal = Number(soulBondUserInfo.userBalance)
  const pending = Number(soulBondUserInfo.pendingSoul) / 1e18
  const assetToken = new Token(chainId, assetAddress, 18, assetName)
  const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  const walletBalance = Number(pairUserInfo.userBalance) / 1e18
  const walletValue = walletBalance * lpPrice

  const { pairInfo } = usePairInfo(assetAddress)
  // const assetDecimals = Number(pairInfo.pairDecimals)

  // const token0Symbol = pairInfo.token0Symbol
  const token0Name = pairInfo.token0Name
  
  // const token1Symbol = pairInfo.token1Symbol
  const token1Name = pairInfo.token1Name
  const token0Decimals = Number(pairInfo.token0Decimals)
  const token1Decimals = Number(pairInfo.token1Decimals)
  const token0 = new Token(chainId, bond.token0Address, token0Decimals, token0Symbol, token0Name)
  const token1 = new Token(chainId, bond.token1Address, token1Decimals, token1Symbol, token1Name)
  
  // stakeble if either not yet staked and on Fantom Opera or not on Fantom Opera.
  const isStakeable = chainId == ChainId.FANTOM && stakedBal == 0 || chainId != ChainId.FANTOM

  // CALCULATIONS
  const stakedLpValue = stakedBal * lpPrice
  // const availableValue = unstakedBal * lpPrice
  const pendingValue = pending * soulPrice
  const percOfBond = 100 * stakedLpValue / liquidity

  // initial render/mount & reruns every 2 seconds
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        if (showing) {
          fetchApproval()
        }
      }, 10_000)
      // clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  const dailyRoi = (apr / 365)
  // const nowTime = new Date().toTimeString()
  // const rawMaturity = new Date(nowTime + msTilMaturity)// formatUnixTimestampToDay(nowTime + msTilMaturity)
  const reached = formatNumber((100 * pendingValue / stakedLpValue), false, true)

  const percRemaining = 100 - Number(reached)
  const daysTilMaturity = percRemaining / dailyRoi

  // const msTilMaturity = daysTilMaturity * 86_400_000 // ms
  // const nowTime = new Date().getTime()
  // const maturityTimestamp = nowTime + msTilMaturity
  // const maturityDate = formatDate(new Date(maturityTimestamp))

  // opens dropdown panel
  const handleShow = () => {
    setShowing(!showing)
    if (!showing) {
      fetchApproval()
    }
  }

  // checks approval on LP for SoulBond
  const fetchApproval = async () => {
    if (!account) {
    } else {
      // Checks if SoulBond can move tokens
      const amount = await erc20Allowance(account, SOUL_BOND_ADDRESS[chainId])
      if (amount > 0) setApproved(true)
      return amount
    }
  }

  // approves bond to handle LP
  const handleApprove = async () => {
    if (!account) {
      // alert('Connect Wallet')
    } else {
      try {
        const tx = await erc20Approve(SOUL_BOND_ADDRESS[chainId])
        await tx?.wait().then(await fetchApproval())
      } catch (e) {
        // alert(e.message)
        console.log(e)
        return
      }
    }
  }

  // mints SOUL from bond.
  const handleMint = async () => {
    try {
      const tx = await mint(pid)
      // await tx.wait()
      // await fetchBals(pid)
    } catch (e) {
      // alert(e.message)
      console.log(e)
    }
  }

  // deposits to bond
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

        <BondContainer onClick={() => handleShow()}>
        <div className={classNames("bg-dark-900 p-3 border border-blue", walletBalance > 0 && "border-dark-1000")}>
          <BondContentWrapper>
              <TokenPairLink>
              <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} />
                {/* {bond.token1Address && <Wrap className="flex-cols-2">
                  <TokenLogo
                    src={
                      'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/' + chain + '/assets/' + bond.token0Address + '/logo.png'
                    }
                    alt="LOGO"
                    width="38px"
                    height="38px"
                    objectFit="contain"
                    className="rounded-full items-center justify-center text-center"
                  />
                  <TokenLogo
                    src={
                      'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/' + chain + '/assets/' + bond.token1Address + '/logo.png'
                    }
                    alt="LOGO"
                    width="38px"
                    height="38px"
                    objectFit="contain"
                    className="rounded-full items-center justify-center text-center"
                  />
                </Wrap>} */}
              </TokenPairLink>

              <HideOnMobile>
              <BondItemBox>
                <Text fontSize="1rem" color="#FFFFFF">
                  {formatNumber(stakedLpValue, true, true)}
                </Text>
              </BondItemBox>
              </HideOnMobile>

              <HideOnSmall>
              <BondItemBox>
                <Text fontSize="1rem" color="#FFFFFF">
                  {`${ 
                      // stakedBal && 
                      percOfBond.toFixed(0) 
                    }%`}
                </Text>
              </BondItemBox>
              </HideOnSmall>

              <BondItemBox>
                <Text fontSize="1rem" color="#FFFFFF">
                  {formatPercent(apr)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize="1rem" color="#FFFFFF">
                  {formatPercent(reached)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize="1rem">
                  {formatNumber(liquidity, true, true)}
                </Text>
              </BondItemBox>
            </BondContentWrapper>
              </div>
      </BondContainer>
      </Wrap>

      {showing ? (
        <Wrap padding="0" display="flex" justifyContent="center">
          <DetailsContainer>
            <DetailsWrapper>
              {isStakeable && (
                <FunctionBox>
                {/* DEPOSIT: ASSET PANEL */}
                    <BondInputPanel
                      pid={bond.pid}
                      onUserInput={(value) => setDepositValue(value)}
                      onMax={() => setDepositValue(walletBalance.toString())}
                      value={depositValue}
                      balance={walletBalance.toString()}
                      id={pid}
                      token0={token0}
                      token1={token1}
                      />
   
                  <Wrap padding="0" margin="0" display="flex">
                    {(approved && Number(unstakedBal) == 0) ?
                      (bond.token0Symbol == WNATIVE[chainId].symbol ? (
                          <SubmitButton
                          primaryColor={getChainColor(chainId)}
                          >
                          <TokenPairLink
                            target="_blank"
                            rel="noopener"
                            color={'white'}
                            href=
                            {`https://exchange.soulswap.finance/add/${NATIVE[chainId].symbol}/${bond.token1Address}`}
                          >
                            CREATE {bond.lpSymbol} PAIR
                          </TokenPairLink>
                          </SubmitButton>
                        ) :
                        <SubmitButton
                        primaryColor={getChainColor(chainId)}
                        >
                          <TokenPairLink
                            target="_blank"
                            rel="noopener"
                            color={"white"}
                            href=
                            {`https://exchange.soulswap.finance/add/${bond.token0Address}/${bond.token1Address}`}
                          >
                            CREATE {bond.lpSymbol} PAIR
                          </TokenPairLink>
                      </SubmitButton>
                      ) :
                      approved ?
                        (
                          <SubmitButton
                            height="2.5rem"
                            primaryColor={getChainColor(chainId)}
                            onClick={() =>
                              handleDeposit(depositValue)
                            }
                          >
                            DEPOSIT {bond.lpSymbol} LP
                          </SubmitButton>
                        ) :
                        (
                          <SubmitButton
                            primaryColor={getChainColor(chainId)}
                            height="2.5rem" onClick={() => handleApprove()}>
                            APPROVE LP
                          </SubmitButton>
                        )

                    }
                  </Wrap>
                </FunctionBox>
              )}

              <FunctionBox>
                <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
                  <Text fontSize=".9rem" padding="0" textAlign="left">
                    BONDED:&nbsp;
                    {stakedBal === 0
                      ? '0.000'
                      : stakedBal < 0.001
                        ? '<0.001'
                        : formatNumber(stakedBal, false, true)
                    }&nbsp;LP
                    <br />
                    VALUE:&nbsp;{Number(stakedLpValue) !== 0 ? `${formatNumber(stakedLpValue, true, true)}` : '0'}
                  </Text>
                  <Text fontSize=".9rem" padding="0" color={getChainColorCode(chainId)} textAlign="right">
                    {stakedBal > 0
                      ? `YTD: ${formatPercent(reached)}`
                      : `~${daysTilMaturity.toFixed(0)} Days`
                      // : `MATURITY: ${(maturityDate)}`
                    }
                    <br />
                    {dailyRoi > 0 ? 'DAILY: ' + dailyRoi.toFixed(2) : 0}%
                  </Text>
                </Wrap>
                {stakedBal > 0 &&
                  <Wrap padding="0" margin="0" display="flex">
                    <SubmitButton
                      height="2.5rem"
                      primaryColor="#bbb"
                      color="black"
                      margin=".5rem 0 .5rem 0"
                      onClick={() =>
                        setShowConfirmation(true)
                      }
                    >
                      MINT SOUL {pendingValue !== 0 ? `(${formatNumber(pendingValue, true, false)})` : ''}
                    </SubmitButton>
                  </Wrap>
                }
              </FunctionBox>
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      ) : null}




      {/* CONFIRMATION MODAL */}

      <Modal isOpen={showConfirmation} onDismiss={
        () => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Are you sure?`} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
            {`Minting exits your position and claims your rewards. You are responsible for your decision to mint and agree that you understand these terms. ${chainId == ChainId.FANTOM ? 'You must mint prior to depositing more.' : ''}`
            }
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} SEND EMAIL.
            </a>
          </Typography>
          <SubmitButton
            primaryColor={getChainColor(chainId)}
            height="2.5rem"
            onClick={() => handleMint()}
          >
            I UNDERSTAND & AGREE
          </SubmitButton>
        </div>
      </Modal>
    </>
  )
}

export default BondRowRender
