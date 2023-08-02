import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import BondInputPanel from './Input'
import { useActiveWeb3React } from 'services/web3'
import useApprove from 'hooks/useApprove'
import { ChainId, LEND_MULTIPLIER, ROUTER_ADDRESS, SOUL_ADDRESS, SOUL_BOND_ADDRESS, WNATIVE } from 'sdk'
import { ethers } from 'ethers'

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
import { useBondUserInfo, usePairInfo, useUserPairInfo, useSoulBondInfo, useTokenInfo, useUserTokenInfo } from 'hooks/useAPI'
import { classNames, formatNumber, formatPercent, tryParseAmount } from 'functions'
import { Token, NATIVE } from 'sdk'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useSoulBondContract, useTokenContract, useZapperContract } from 'hooks/useContract'
import { CurrencyLogo } from 'components/CurrencyLogo'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import AssetInput from 'components/AssetInput'

// import { useSoulPrice } from 'hooks/getPrices'
// import DoubleCurrencyLogo from 'components/DoubleLogo'
// import FarmInputPanel from 'features/summoner/Input'

const TokenPairLink = styled(ExternalLink)`
  font-size: 1rem;
  padding-left: 10;
`

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
  const isSwapPair = true
  // const APR = Number(soulBondInfo.apr)
  const _APR = Number(soulBondInfo.apr)
  // const assetName = soulBondUserInfo.symbol
  // const liquidity = Number(soulBondUserInfo.tvl)

  // for display purposes only //
  const _liquidity = Number(soulBondUserInfo.tvl)
  const lpPrice = Number(soulBondUserInfo.pairPrice)
  // const stakedBal = Number(soulBondUserInfo.stakedBalance)
  // for display purposes only //
  const _stakedBalance = Number(soulBondUserInfo.stakedBalance)
  // for display purposes only //
  const _stakedValue = _stakedBalance * lpPrice
  const unstakedBal = Number(soulBondUserInfo.userBalance)
  const assetDecimals = Number(pairInfo.pairDecimals)
  const assetDivisor = 10 ** assetDecimals
  const pending = Number(soulBondUserInfo.pendingSoul) / 1e18
  // const assetToken = new Token(chainId, assetAddress, assetDecimals, assetName)
  // const parsedDepositValue = tryParseAmount(depositValue, assetToken)
  const walletBalance = Number(pairUserInfo.userBalance) / assetDivisor
  const _walletBalance = Number(pairUserInfo.userBalance) / assetDivisor

  const hasBalance = unstakedBal > 0
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

  // stakeble always meow.
  const isStakeable = true
  // chainId
  //   == ChainId.FANTOM && _stakedBalance == 0
  //   || chainId == ChainId.AVALANCHE

  const depositable = true
  // = chainId == ChainId.FANTOM && pid == '2' ? false
  //   : Number(pid) >= 10 ? false
  //   : true

  // CALCULATIONS
  // const stakedValue = stakedBal * lpPrice
  // const availableValue = unstakedBal * lpPrice
  const pendingValue = pending * soulPrice
  // const percOfBond = 100 * _stakedValue / _liquidity

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
  const isActive = dailyRoi > 0

  // const msTilMaturity = daysTilMaturity * 86_400_000 // ms
  // const nowTime = new Date().getTime()
  // const maturityTimestamp = nowTime + msTilMaturity
  // const maturityDate = formatDate(new Date(maturityTimestamp))

  // opens dropdown panel
  const handleShowOptions = () => {
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

  {/* ZAP SETTINGS */ }
  const [approvedZap, setZapApproved] = useState(false)
  const [zapValue, setZapValue] = useState('0')
  const [zapTokenAddress, setZapTokenAddress] = useState(SOUL_ADDRESS[chainId])
  const [openZap, setOpenZap] = useState(false)

  const ZapContract = useZapperContract()
  const ZapContractAddress = ZapContract.address



  // ZAP ADD-ONS //
  const tokenContract = useTokenContract(zapTokenAddress)
  const zapTokenDecimals = Number(useTokenInfo(zapTokenAddress).tokenInfo.decimals)
  const zapTokenSymbol = useTokenInfo(zapTokenAddress).tokenInfo.symbol
  const zapTokenName = useTokenInfo(zapTokenAddress).tokenInfo.name
  const zapToken = new Token(chainId, zapTokenAddress, zapTokenDecimals, zapTokenSymbol, zapTokenName)
  const maxUint = ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1))

  // USER INFO //
  const { userTokenInfo } = useUserTokenInfo(account, zapTokenAddress)
  const selectedTokenDecimals = zapTokenDecimals ? zapTokenDecimals : 18
  const selectedTokenBalance = Number(userTokenInfo.balance) / selectedTokenDecimals // TODO: try erc20BalanceOf(zapTokenAddress)
  const zapTokenBalance = tryParseAmount(selectedTokenBalance.toString(), zapToken)
  const [modalOpen, setModalOpen] = useState(true)


  const handleShowZap = (pid) => {
    setOpenZap(!openZap)
  }

  // checks: user's approval for ZapContractAddress to move tokens.
  const fetchZapApproval = async () => {
    if (!account) {
      // alert('Connect Wallet')
    } else {
      // Checks if ZapContract can move tokens
      // const amount = await erc20Allowance(account, ZapContractAddress)
      const amount = tokenContract?.allowance(account, ZapContractAddress)
      if (amount > 0) setZapApproved(true)
      return amount
    }
  }

  // approves ZapContractAddress to move selectedToken
  const handleZapApprove = async (tokenContract) => {
    try {
      let tx
      tx = tokenContract?.approve(ZapContractAddress, maxUint)
      await tx?.wait().then(await fetchZapApproval())
    } catch (e) {
      console.log(e)
      return
    }
  }

  // HANDLE ZAP //
  const handleZap = async (zapTokenAddress, lpAddress) => {
    try {
      let tx
      tx = await ZapContract?.zapInToken(zapTokenAddress, Number(zapValue).toFixed(zapTokenDecimals).toBigNumber(zapTokenDecimals), lpAddress, ROUTER_ADDRESS[chainId], account)
      await tx?.wait()
    } catch (e) {
      console.log(e)
    }
  }

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])
  // runs only on initial render/mount
  useEffect(() => {
    fetchApproval()
  }, [account])


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
        (Number(depositValue)).toFixed(assetDecimals)
          .toBigNumber(assetDecimals)
      )
      await tx.wait()
    } catch (e) {
      const smallerValue = Number(depositValue) - 0.000001
      tx = await bondContract?.deposit(
        pid,
        (Number(smallerValue)).toFixed(assetDecimals)
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
    <div className="flex justify-center w-full">
      <BondContainer className={``}>
        <div className={classNames(`bg-dark-900 p-2 m-1 border rounded-2xl border-blue`, !hasBalance && "border-dark-1000",
          // : !isActive ? "hover:border-pink"
          hasBalance && isActive ? "border-purple"
            : hasBalance && !isActive ? "hover:border-pink border-pink"
              : "hover:border-purple"
        )}
          onClick={() => handleShowOptions()}
        >
          <div className={`flex w-full`}>
            <div className="grid grid-cols-1 md:mr-16 justify-center">
              <div className={`grid grid-cols-2`}>
                <CurrencyLogo currency={token0} size={40} />
                <CurrencyLogo currency={token1} size={40} />
              </div>
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
            <HideOnMobile>
              <BondItemBox>
                <div className={`justify-center mt-2 md:mr-16`}>
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
                </div>
              </BondItemBox>
            </HideOnMobile>

            {/* STAKED OWNERSHIP */}
            {/* <HideOnSmall>
                <BondItemBox>
                  <Text fontSize="1rem" color="#FFFFFF">
                    {percOfBond.toFixed(0)}%
                  </Text>
                </BondItemBox>
              </HideOnSmall> */}

            {/* APR */}
            <BondItemBox>
              <div className={`justify-center md:mr-8`}>
                <Text fontSize="1rem" color="#4EFF4E"> {/* neonGreen */}
                  {_APR == 0 ? 0
                    : _APR.toString(2) == '0.00' ? '<0.00'
                      : _APR < 1 && _APR.toString(4) ? _APR.toFixed(4)
                        : _APR > 0 ? _APR.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : '-'
                  }%
                </Text>
              </div>
            </BondItemBox>

            {/* <HideOnMobile> */}
            <BondItemBox>
              <BondItem>
                <Text fontSize="1rem" color="#FFFFFF">
                  {formatPercent(reached)}
                </Text>
              </BondItem>
            </BondItemBox>
            {/* </HideOnMobile> */}

            <BondItemBox>
              <Text fontSize="1rem">
                {formatNumber(_liquidity, true, true)}
              </Text>
            </BondItemBox>
          </div>
        </div>

        {showing && (
          <DetailsContainer>
            <DetailsWrapper>
              <Modal
                // isCustom={true}
                isOpen={showing}
                onDismiss={() => handleShowOptions()}
              >
                <FunctionBox>
                  {/* <Text className="flex justify-center text-2xl font-bold"> 
                  {isUnderworldPair ? token0Symbol : bond.lpSymbol} 
                </Text> */}
                  {/* DEPOSIT: ASSET PANEL */}
                  {isStakeable && depositable && Number(walletBalance) != 0 &&
                    <BondInputPanel
                      pid={bond.pid}
                      onUserInput={(value) => setDepositValue(value)}
                      onMax={() => setDepositValue(_walletBalance.toString())}
                      value={depositValue}
                      balance={_walletBalance.toString()}
                      id={pid}
                    />
                  }
                  {/* CREATE BUTTON */}
                  {isStakeable && depositable && unstakedBal <= 1 &&
                    <Wrap padding="0" margin="0" display="flex">
                      <SubmitButton
                        height="2rem"
                        primaryColor={getChainColor(chainId)}
                        margin=".5rem 0 0rem 0"
                      >
                        <TokenPairLink
                          target="_blank"
                          rel="noopener"
                          color={"white"}
                          href=
                          {
                            bond.token0Symbol == WNATIVE[chainId].symbol
                              ? `https://exchange.soulswap.finance/add/${NATIVE[chainId].symbol}/${bond.token1Address}`
                              : `https://exchange.soulswap.finance/add/${bond.token0Address}/${bond.token1Address}`}
                        >
                          {`CREATE ${bond.lpSymbol} PAIR`}
                        </TokenPairLink>
                      </SubmitButton>
                    </Wrap>
                  }
                  {/* APPROVE BUTTON */}
                  {!approved && isStakeable && depositable && unstakedBal > 0 &&
                    <Wrap padding="0" margin="0" display="flex">
                      <SubmitButton
                        height="2rem"
                        primaryColor={getChainColor(chainId)}
                        margin=".5rem 0 0rem 0"
                        onClick={() => handleApprove()}>
                        {`APPROVE LP`}
                      </SubmitButton>
                    </Wrap>
                  }
                  {/* DEPOSIT BUTTON */}
                  {approved && isStakeable && depositable && unstakedBal > 0 &&
                    <Wrap padding="0" margin="0" display="flex">
                      <SubmitButton
                        height="2rem"
                        margin=".5rem 0 0rem 0"
                        primaryColor={getChainColor(chainId)}
                        onClick={() =>
                          _stakedBalance == 0
                            ? handleDeposit(pid, depositValue)
                            : setShowDepositConfirmation(true)
                        }
                      >
                        DEPOSIT {`${bond.lpSymbol} LP`}
                      </SubmitButton>
                    </Wrap>
                  }
                  {/* ZAP BUTTON */}
                  {isStakeable && depositable &&
                    <Wrap padding="0" margin="0" display="flex">
                      <SubmitButton
                        height="2rem"
                        primaryColor={getChainColor(chainId)}
                        // color={}
                        // className={'font-bold'}
                        margin=".5rem 0 0rem 0"
                        onClick={() =>
                          handleShowZap(pid)
                        }
                      >
                        <div className="flex text-lg gap-1">
                          {/* <Zap width={26} className={classNames(`text-white`} /> */}
                          {`ZAP INTO `}
                          {/* <CurrencyDollarIcon width={26} className={classNames(`text-white`)} /> */}
                          {/* &rarr;  */}
                          {`${bond.lpSymbol}`}
                        </div>
                      </SubmitButton>
                    </Wrap>
                  }
                </FunctionBox>

                <Wrap padding="0.5rem" margin="0.25rem" display="flex" justifyContent="space-between">
                  <Text fontSize=".9rem" padding="0" textAlign="left">
                    {'ENDS: Q1 2025'}
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
        )}

        { /* CONFIRMATION MODAL */}

        <Modal isOpen={showMintConfirmation} onDismiss={
          () => setShowMintConfirmation(false)}>
          <div className="space-y-4">
            <ModalHeader header={`Are you sure?`} onClose={() => setShowMintConfirmation(false)} />
            <Typography variant="lg">
              {`Minting exits your position and claims your rewards. You are responsible for your decision to mint and agree that you understand these terms.`
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

        {/*------ ZAP OPTIONS PANEL ------*/}
        {openZap &&
          <Modal
            isCustom={true}
            isOpen={openZap}
            onDismiss={() => handleShowZap(pid)}
            borderColor={'border-dark-900 hover:border-dark-420'}
            className={classNames("border", "hover:border-dark-600",
              "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
          >

            {/* ZAP: NATIVE --> LP */}
            <CurrencySearchModal.Controlled
              chainId={chainId}
              open={modalOpen}
              onDismiss={handleDismissSearch}
              onCurrencySelect={(value) => setZapTokenAddress(value.wrapped.address)}
              selectedCurrency={zapToken ?? undefined}
              allowManageTokenList={false}
              showSearch={true}
            />
            <AssetInput
              chainId={chainId}
              currencyLogo={true}
              currency={zapToken}
              value={zapValue}
              onChange={(value) => setZapValue(value)}
              // onMax={() => setZapValue(zapValue)}
              balance={zapTokenBalance}
              showBalance={false}
              showMax={false}
            />
            <Wrap padding="0" margin="0" display="flex">
              <SubmitButton
                height="2rem"
                primaryColor={getChainColor(chainId)}
                // color={"#FFFFFF"}
                className={'font-bold'}
                margin=".5rem 0 0rem 0"
                onClick={() =>
                  setModalOpen(true)
                }
              >
                {`SELECT TOKEN`}
              </SubmitButton>
            </Wrap>
            <div className="my-2 mx-8 mt-3 border border-[#FFFFFF]" />
            {/* { !approvedZap && */}
            <Wrap padding="0" margin="0" display="flex">
              <SubmitButton
                height="2rem"
                primaryColor={getChainColor(chainId)}
                color={'#FFFFFF'}
                className={'font-bold'}
                margin=".5rem 0 0rem 0"
                onClick={() =>
                  handleZapApprove(tokenContract)
                }
              >
                {`APPROVE ZAP`}
                {/* {token.symbol} */}
              </SubmitButton>
            </Wrap>

            <Wrap padding="0" margin="0" display="flex">
              <SubmitButton
                height="2rem"
                primaryColor={getChainColor(chainId)}
                color={"#FFFFFF"}
                className={'font-bold'}
                margin=".5rem 0 0rem 0"
                onClick={() =>
                  handleZap(zapTokenAddress, bond.lpAddress)
                }
              >
                {`ZAP INTO PAIR`}
              </SubmitButton>
            </Wrap>
            <Typography className={`flex text-center mt-4 sm:mt-6 border border-[${getChainColor(chainId)}] p-2 rounded rounded-2xl`}>
              {`Mind slippage and loses due to low liquidity. Avoid large amounts, if unsure.`}
            </Typography>

          </Modal>
        }

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
                handleDeposit(pid, Number(depositValue))}

            >
              {`UNDERSTOOD & AGREED`}
            </SubmitButton>
          </div>
        </Modal>
      </BondContainer>
    </div>


  )
}

export default BondRowRender