import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BondInputPanel from './Input'
import { useActiveWeb3React } from 'services/web3'
import useApprove from 'hooks/useApprove'
import { ChainId, SOUL_ADDRESS, SOUL_BOND_ADDRESS, WNATIVE } from 'sdk'
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
import Modal from 'components/DefaultModal'
import Typography from '../../components/Typography'
import ModalHeader from 'components/Modal/Header'
import { useBondUserInfo, usePairInfo, useUserPairInfo, useSoulBondInfo, useTokenInfo } from 'hooks/useAPI'
import { classNames, formatNumber, formatPercent, tryParseAmount } from 'functions'
import { useSoulPrice } from 'hooks/getPrices'
import { Token, NATIVE } from 'sdk'
import { getChainColor, getChainColorCode } from 'constants/chains'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { useSoulBondContract } from 'hooks/useContract'
import FarmInputPanel from 'features/summoner/Input'

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
  const bondContract = useSoulBondContract()

  // const { deposit, mint } = useSoulBond(pid, lpToken, bond.token0Address, bond.token1Address)
  const { erc20Allowance, erc20Approve } = useApprove(lpToken)
  const [showing, setShowing] = useState(false)
  const [approved, setApproved] = useState(false)
  const [depositValue, setDepositValue] = useState('0')

  // show confirmation view before minting SOUL
  const [showConfirmation, setShowConfirmation] = useState(false)
  // const [showOptions, setShowOptions] = useState(false)

  const assetAddress = bond.lpAddress
  const soulPrice = Number(useTokenInfo(SOUL_ADDRESS[chainId]).tokenInfo.price)
  // const chain = chainId == ChainId.AVALANCHE ? 'avalanche' : 'fantom'

  // API DATA //
  const { soulBondInfo } = useSoulBondInfo(pid)
  const apr = Number(soulBondInfo.apr)
  const { soulBondUserInfo } = useBondUserInfo(pid, account)
  const { pairUserInfo } = useUserPairInfo(account, assetAddress)
  const { pairInfo } = usePairInfo(assetAddress)
  // todo: temp-fix
  const temporaryBoost = pid == '4'
  const temporaryBoostMultiplier = 3.5
  const assetName = soulBondUserInfo.symbol
  const liquidity
    = temporaryBoost
      ? Number(soulBondUserInfo.tvl) * temporaryBoostMultiplier
      : Number(soulBondUserInfo.tvl)
  const lpPrice = Number(soulBondUserInfo.pairPrice)
  const stakedBal = Number(soulBondUserInfo.stakedBalance)
  const unstakedBal = Number(soulBondUserInfo.userBalance)
  const assetDecimals = Number(pairInfo.pairDecimals)
  const assetDivisor = 10 ** assetDecimals
  const pending = Number(soulBondUserInfo.pendingSoul) / 1e18
  const assetToken = new Token(chainId, assetAddress, assetDecimals, assetName)
  const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  const walletBalance = Number(pairUserInfo.userBalance) / assetDivisor
  // const parsedWalletBalance = tryParseAmount(walletBalance, assetToken)
  // const walletValue = walletBalance * lpPrice

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
  const stakedLpValue = temporaryBoost
    ? stakedBal * lpPrice * temporaryBoostMultiplier
    : stakedBal * lpPrice
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

  // // Deposit
  const handleDeposit = async (pid, amount) => {
    try {
      const result = await bondContract?.deposit(pid,
        Number(depositValue).toFixed(assetDecimals).toBigNumber(assetDecimals)
        // parsedDepositValue.quotient.toString()
      )
      return result
    } catch (e) {
      console.log(e)
      alert(e.message)
      return e
    }
  }

  // // Withdraw
  // const mint = async (pid) => {
  //   try {
  //     let result = await bondContract?.bond(pid)
  //     return result
  //   } catch (e) {
  //     alert(e.message)
  //     console.log(e)
  //     return e
  //   }
  // }

  // handles deposit
  // const handleDeposit = async (pid, amount) => {
  //   try {
  //       const tx = await bondContract?.deposit(pid, depositValue)
  //       await tx.wait()
  //   } catch (e) {
  //       // alert(e.message)
  //       console.log(e)
  //   }
  // }
  
  // mints SOUL from bond.
  const handleMint = async () => {
    try {
      const tx = await bondContract.bond(pid)
      // await tx.wait()
      // await fetchBals(pid)
    } catch (e) {
      // alert(e.message)
      console.log(e)
    }
  }

  // deposits to bond
  // const handleDeposit = async (amount) => {
  //   try {
  //     // console.log('depositing', amount.toString())
  //     const tx = await deposit(pid, parsedDepositValue.quotient.toString())
  //     // await tx.wait()
  //   } catch (e) {
  //     // alert(e.message)
  //     console.log(e)
  //   }
  // }

  return (
    <>
      <Wrap padding="0" display="flex" justifyContent="center">
        <BondContainer onClick={() => handleShow()}>
          <div className={classNames("bg-dark-900 p-2 border border-dark-1000", walletBalance > 0 ? `border-dark-${getChainColorCode(chainId)}` : '')}>
            <BondContentWrapper>
              <TokenPairLink>
                <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} />
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
                  {`${formatNumber(apr, false, false)}%`}
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

      {showing && (
        <Wrap padding="0" display="flex" justifyContent="center">
          <DetailsContainer>
            <DetailsWrapper>
              <Modal
                isCustom={true}
                isOpen={showing}
                onDismiss={() => handleShow()}
              >
                <FunctionBox>
                  {/* <Text className="flex justify-center text-2xl font-bold"> 
                  {bond.lpSymbol} 
                </Text> */}
                  {/* DEPOSIT: ASSET PANEL */}
                  {isStakeable && Number(walletBalance) != 0 &&
                    <BondInputPanel
                      pid={bond.pid}
                      onUserInput={(value) => setDepositValue(value)}
                      onMax={() => setDepositValue(walletBalance?.toString())}
                      value={depositValue}
                      balance={walletBalance.toString()}
                      id={pid}
                    />
                  }
                  <Wrap padding="0" margin="0" display="flex">
                    {(approved && isStakeable && Number(unstakedBal) == 0) ?
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
                      (approved && isStakeable ?
                        (
                          <SubmitButton
                            height="2.5rem"
                            primaryColor={getChainColor(chainId)}
                            onClick={() =>
                              handleDeposit(pid, depositValue)
                            }
                          >
                            DEPOSIT {bond.lpSymbol} LP
                          </SubmitButton>
                        ) :
                        (!approved && isStakeable &&
                          <SubmitButton
                            primaryColor={getChainColor(chainId)}
                            height="2.5rem" onClick={() => handleApprove()}>
                            APPROVE LP
                          </SubmitButton>
                        )

                      )}
                  </Wrap>
                </FunctionBox>

                <Wrap padding="0.5rem" margin="0.25rem" display="flex" justifyContent="space-between">
                  <Text fontSize=".9rem" padding="0" textAlign="left">
                    DEPOSIT:&nbsp;
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
                {stakedBal > 0 && showing &&
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
              </Modal>
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      )}

      { /* CONFIRMATION MODAL */}

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
            {`UNDERSTOOD & AGREED`}
          </SubmitButton>
        </div>
      </Modal>
    </>
  )
}

export default BondRowRender
