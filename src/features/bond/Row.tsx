import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BondInputPanel from './Input'
import { useActiveWeb3React } from 'services/web3'
import useApprove from 'hooks/useApprove'
import { ChainId, LEND_MULTIPLIER, SOUL_ADDRESS, SOUL_BOND_ADDRESS, WNATIVE } from 'sdk'
import {
  BondContainer,
  BondItem,
  // BondContentWrapper,
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
import { Token, NATIVE } from 'sdk'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useSoulBondContract } from 'hooks/useContract'
import { CurrencyLogo } from 'components/CurrencyLogo'

// import { useSoulPrice } from 'hooks/getPrices'
// import DoubleCurrencyLogo from 'components/DoubleLogo'
// import FarmInputPanel from 'features/summoner/Input'

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

const BondRowRender = ({ pid, lpToken, token0Symbol, type, token0Address, token1Symbol, token1Address, lpSymbol, bond }) => {
  const { account, chainId } = useActiveWeb3React()
  const bondContract = useSoulBondContract()

  // const { deposit, mint } = useSoulBond(pid, lpToken, bond.token0Address, bond.token1Address)
  const { erc20Allowance, erc20Approve } = useApprove(lpToken)
  const [showing, setShowing] = useState(false)
  const [approved, setApproved] = useState(false)
  const [depositValue, setDepositValue] = useState('0')

  // show confirmation view before minting SOUL
  const [showMintConfirmation, setShowMintConfirmation] = useState(false)
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false)
  // const [showOptions, setShowOptions] = useState(false)

  const assetAddress = bond.lpAddress
  const soulPrice = Number(useTokenInfo(SOUL_ADDRESS[chainId]).tokenInfo.price)
  // const chain = chainId == ChainId.AVALANCHE ? 'avalanche' : 'fantom'
  // API DATA //
  const { soulBondInfo } = useSoulBondInfo(pid)
  const { soulBondUserInfo } = useBondUserInfo(pid, account)
  const { pairUserInfo } = useUserPairInfo(account, assetAddress)
  const { pairInfo } = usePairInfo(assetAddress)
  const token0Name = pairInfo.token0Name
  const isUnderworldPair = bond.type == "lend"
  const isSwapPair = !isUnderworldPair
  const MULTIPLIER = isSwapPair ? 1 : LEND_MULTIPLIER(chainId, token0Symbol)
  // const APR = Number(soulBondInfo.apr)
  const _APR = Number(soulBondInfo.apr) / MULTIPLIER
  // const assetName = soulBondUserInfo.symbol
  // const liquidity = Number(soulBondUserInfo.tvl)

  // for display purposes only //
  const _liquidity = Number(soulBondUserInfo.tvl) * MULTIPLIER
  const lpPrice = Number(soulBondUserInfo.pairPrice)
  // const stakedBal = Number(soulBondUserInfo.stakedBalance)
  // for display purposes only //
  const _stakedBalance = Number(soulBondUserInfo.stakedBalance) * MULTIPLIER
  // for display purposes only //
  const _stakedValue = _stakedBalance * lpPrice
  const unstakedBal = Number(soulBondUserInfo.userBalance)
  const assetDecimals = Number(pairInfo.pairDecimals)
  const assetDivisor = 10 ** assetDecimals
  const pending = Number(soulBondUserInfo.pendingSoul) / 1e18
  // const assetToken = new Token(chainId, assetAddress, assetDecimals, assetName)
  // const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  const walletBalance = Number(pairUserInfo.userBalance) / assetDivisor
  const _walletBalance = Number(pairUserInfo.userBalance) / assetDivisor * MULTIPLIER

  // const parsedWalletBalance = tryParseAmount(walletBalance, assetToken)
  // const walletValue = walletBalance * lpPrice
  // const assetDecimals = Number(pairInfo.pairDecimals)
  // const token0Symbol = pairInfo.token0Symbol

  // const token1Symbol = pairInfo.token1Symbol
  const token1Name = pairInfo.token1Name
  const token0Decimals = Number(pairInfo.token0Decimals)
  const token1Decimals = Number(pairInfo.token1Decimals)
  const token0 = new Token(chainId, bond.token0Address, token0Decimals, token0Symbol, token0Name)
  const token1 = new Token(chainId, bond.token1Address, token1Decimals, token1Symbol, token1Name)

  // stakeble if either not yet staked and on Fantom Opera or not on Fantom Opera.
  const isStakeable = chainId
    == ChainId.FANTOM && _stakedBalance == 0
    || chainId == ChainId.AVALANCHE

  const depositable
    = chainId == ChainId.FANTOM && pid == '2' ? false
      : true

  // CALCULATIONS
  // const stakedValue = stakedBal * lpPrice
  // const availableValue = unstakedBal * lpPrice
  const pendingValue = pending * soulPrice
  const percOfBond = 100 * _stakedValue / _liquidity

  // initial render/mount & reruns every 2 seconds
  // useEffect(() => {
  //   if (account) {
  //     const timer = setTimeout(() => {
  //       if (showing) {
  //         fetchApproval()
  //       }
  //     }, 30_000)
  //     // clear timeout if the component is unmounted
  //     return () => clearTimeout(timer)
  //   }
  // })

  const dailyRoi = (_APR / 365)
  // const nowTime = new Date().toTimeString()
  // const rawMaturity = new Date(nowTime + msTilMaturity)// formatUnixTimestampToDay(nowTime + msTilMaturity)
  const reached = formatNumber((100 * pendingValue / _stakedValue), false, true)

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

  // // // Deposit
  // const handleDeposit = async (pid, amount) => {
  //   try {
  //     const result = await bondContract?.deposit(pid,
  //       Number(depositValue).toFixed(assetDecimals).toBigNumber(assetDecimals)
  //       // parsedDepositValue.quotient.toString()
  //     )
  //     return result
  //   } catch (e) {
  //     console.log(e)
  //     // alert(e.message)
  //     return e
  //   }
  // }
  // // deposits: selected amount into the bonds
  const handleDeposit = async (pid, amount) => {
    let tx
    try {
      tx = await bondContract?.deposit(
        pid,
        (Number(depositValue) / MULTIPLIER).toFixed(assetDecimals)
          .toBigNumber(assetDecimals)
      )
      await tx.wait()
    } catch (e) {
      const smallerValue = Number(depositValue) - 0.000001
      tx = await bondContract?.deposit(
        pid,
        (Number(smallerValue) / MULTIPLIER).toFixed(assetDecimals)
          .toBigNumber(assetDecimals))
      await tx.wait()
      console.log(e)
    }
  }


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

  return (
    <div className="grid  justify-center">
        <BondContainer onClick={() => handleShow()}>
          <div className={classNames("bg-dark-900 p-2 rounded rounded-2xl border hover:border-2 border-dark-1000 hover:border-ftmBlue", walletBalance > 0 ? `border-[#721ce0]` : '')}>
          {/* <div className={classNames("bg-dark-900 p-3 m-1 mr-8 ml-8 border rounded rounded-2xl border-blue")}> */}
            <div className={`grid grid-cols-4 w-full]`}>
              <div className="items-center">
                <BondItemBox className={`grid ${isUnderworldPair ? `grid-cols-2` : `grid-cols-2`}`}>
                  {isUnderworldPair &&
                    <CurrencyLogo currency={token0} size={50} />
                  }
                  {isUnderworldPair &&
                    <CurrencyLogo currency={token1} size={25} />
                  }
                  {!isUnderworldPair &&
                    <CurrencyLogo currency={token0} size={40} />
                  }
                  {!isUnderworldPair &&
                    <CurrencyLogo currency={token1} size={40} />
                  }
                  {/* {Number(allocPoint) != 220
                      ? <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} />
                      : <CurrencyLogo currency={token0} size={40} />
                  } */}
                </BondItemBox>
              </div>

              {/* <HideOnMobile>
                <BondItemBox>
                  <Text fontSize="1rem" color="#FFFFFF">
                    {/* {`${formatNumber(stakedValue, true, true)}`} //
                    ${_stakedValue == 0 ? 0
                      : _stakedValue.toString(2) == '0.00' ? '<0.00'
                        : _stakedValue < 1 && _stakedValue.toString(4) ? _stakedValue.toFixed(4)
                          : _stakedValue > 0 ? _stakedValue.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : '-'
                    }
                  </Text>
                </BondItemBox>
              </HideOnMobile> */}

              {/* STAKED VALUE */}
              {/* <HideOnMobile>
              <BondItemBox>
                  <BondItem>
                    {Number(_APR).toString() === '0.00' ? (
                      <Text padding="0" fontSize="1rem" color="#666">
                        0
                      </Text>
                    ) : (
                      <Text padding="0" fontSize="1rem" color="#FFFFFF">
                        ${
                          _stakedValue == 0 ? 0
                            : _stakedValue.toString(2) == '0.00' ? '<0.00'
                              : _stakedValue < 1 && _stakedValue.toString(4) ? _stakedValue.toFixed(4)
                                : _stakedValue > 0 ? _stakedValue.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                  : 0
                        }
                      </Text>
                    )}
                  </BondItem>
                </BondItemBox>
              </HideOnMobile> */}

              {/* <HideOnSmall>
                <BondItemBox>
                  <Text fontSize="1rem" color="#FFFFFF">
                    {percOfBond.toFixed(0)}%
                  </Text>
                </BondItemBox>
              </HideOnSmall> */}

              <BondItemBox>
                <Text fontSize="1rem" color="#FFFFFF">
                  {_APR == 0 ? 0
                    : _APR.toString(2) == '0.00' ? '<0.00'
                      : _APR < 1 && _APR.toString(4) ? _APR.toFixed(4)
                        : _APR > 0 ? _APR.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : '-'
                  }%
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize="1rem" color="#FFFFFF">
                  {formatPercent(reached)}
                </Text>
              </BondItemBox>

              <BondItemBox>
                <Text fontSize="1rem">
                  {formatNumber(_liquidity, true, true)}
                </Text>
              </BondItemBox>
            </div>
          </div>
        </BondContainer>

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
                  {isUnderworldPair ? token0Symbol : bond.lpSymbol} 
                </Text> */}
                  {/* DEPOSIT: ASSET PANEL */}
                  {isStakeable && Number(walletBalance) != 0 &&
                    <BondInputPanel
                      pid={bond.pid}
                      onUserInput={(value) => setDepositValue(value)}
                      onMax={() => setDepositValue(_walletBalance.toString())}
                      value={depositValue}
                      balance={_walletBalance.toString()}
                      id={pid}
                    />
                  }
                  <Wrap padding="0" margin="0" display="flex">
                    {(approved && isStakeable && Number(unstakedBal) == 0 && depositable ?
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
                            CREATE {isUnderworldPair ? token0Symbol : bond.lpSymbol} PAIR
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
                            {isUnderworldPair ? `https://exchange.soulswap.finance/lend/${bond.lpAddress}`
                              : `https://exchange.soulswap.finance/add/${bond.token0Address}/${bond.token1Address}`}
                          >
                            {isUnderworldPair ? `LEND ${bond.token0Symbol}` : `CREATE ${isUnderworldPair ? token0Symbol : bond.lpSymbol} PAIR`}
                          </TokenPairLink>
                        </SubmitButton>
                      ) :
                      (approved && isStakeable && depositable) ?
                        (
                          <SubmitButton
                            height="2.5rem"
                            primaryColor={getChainColor(chainId)}
                            onClick={() =>
                              _stakedBalance == 0
                                ? handleDeposit(pid, depositValue)
                                : setShowDepositConfirmation(true)
                            }
                          >
                            DEPOSIT {isUnderworldPair ? token0Symbol : `${bond.lpSymbol} LP`}
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
                    BONDED:&nbsp;
                    {_stakedBalance === 0
                      ? '0.000'
                      : _stakedBalance < 0.001
                        ? '<0.001'
                        : formatNumber(_stakedBalance, false, true)
                    }&nbsp;{isSwapPair ? `LP` : token0Symbol}
                    <br />
                    VALUE:&nbsp;{Number(_stakedValue) !== 0 ? `${formatNumber(_stakedValue, true, true)}` : '0'}
                  </Text>
                  <Text fontSize=".9rem" padding="0" color={getChainColorCode(chainId)} textAlign="right">
                    {_stakedBalance > 0
                      ? `YTD: ${formatPercent(reached)}`
                      : `~${daysTilMaturity.toFixed(0)} Days`
                      // : `MATURITY: ${(maturityDate)}`
                    }
                    <br />
                    {dailyRoi > 0 ? 'DAILY: ' + dailyRoi.toFixed(2) : 0}%
                  </Text>
                </Wrap>
                {_stakedBalance > 0 && showing &&
                  <Wrap padding="0" margin="0" display="flex">
                    <SubmitButton
                      height="2.5rem"
                      primaryColor="#bbb"
                      color="black"
                      margin=".5rem 0 .5rem 0"
                      onClick={() =>
                        setShowMintConfirmation(true)
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

      <Modal isOpen={showMintConfirmation} onDismiss={
        () => setShowMintConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Are you sure?`} onClose={() => setShowMintConfirmation(false)} />
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

      { /* CONFIRMATION MODAL */}
      <Modal isOpen={showDepositConfirmation} onDismiss={
        () => setShowDepositConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Are you sure?`} onClose={() => setShowDepositConfirmation(false)} />
          <Typography variant="lg">
            {`Depositing adds to your position, but forfeits your pending rewards. You are responsible for your decision to deposit more and agree that you understand these terms. ${chainId == ChainId.FANTOM ? 'You must mint prior to depositing more.' : ''}`
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
            onClick={() =>
              handleDeposit(pid, Number(depositValue) / MULTIPLIER)}

          >
            {`UNDERSTOOD & AGREED`}
          </SubmitButton>
        </div>
      </Modal>
    </div>
  )
}

export default BondRowRender