import { CurrencyAmount, JSBI, SOUL_ADDRESS, SOUL_SUMMONER_ADDRESS, SOUL_VAULT_ADDRESS, ZERO } from '../../sdk'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import React, { useEffect, useState } from 'react'
import { SOUL, SEANCE } from '../../constants'

import { Button } from '../../components/Button'
import { ChainId } from '../../sdk'
import Head from 'next/head'
import Dots from '../../components/Dots'
import Image from 'next/image'
import { Input as NumericalInput } from '../../components/NumericalInput'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from 'services/web3'
import { useLingui } from '@lingui/react'
import useSoulStakeManual from '../../hooks/useSoulStakeManual'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import useSoulVault from '../../hooks/useSoulVault'

import { ethers } from 'ethers'
import { useSoulSummonerContract } from '../../hooks'
import Typography from '../../components/Typography'
import { SubmitButton } from '../../features/seance/SeanceStyles'
// import Header from 'features/mines/components/Header'
import ModalHeader from 'components/Modal/Header'
import NavLink from 'components/NavLink'
import Modal from 'components/DefaultModal'
import useSoulMine from 'features/mines/hooks/useSoulMine'

const INPUT_CHAR_LIMIT = 18

const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true
  try {
    const ret = await txFunc()
    if (ret?.error) {
      success = false
    }
  } catch (e) {
    console.error(e)
    success = false
  }
  return success
}

const StyledNumericalInput = styled(NumericalInput)`
  caret-color: #e3e3e3;
`

const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
const inactiveTabStyle = `${tabStyle} text-secondary`

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-gradient-to-r from-pink to-purple hover:opacity-90`
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-purple hover:bg-opacity-90`

export default function SoulStake() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  // functions from SoulVault contract we're using
  const { withdraw } = useSoulVault()
  const { enter, leave, harvest } = useSoulStakeManual()

  const { userInfo, fetchStakeStats } = useSoulMine(0, '', '', '')

  const [stakedBal, setStakedBal] = useState('0')
  const soulBalance = useTokenBalance(account ?? undefined, SOUL[250])
  const seanceBalance = useTokenBalance(account ?? undefined, SEANCE[250])

  // show confirmation view before withdrawing SOUL
  const [showConfirmation, setShowConfirmation] = useState(false)
  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const [autoStaking, setAutoStaking] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)

  const balance = activeTab === 0 ? soulBalance : seanceBalance
  const formattedBalance = balance?.toSignificant(4)
  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  // Approve summoner to move funds with `transferFrom`
  const [approvalStateChef, approveMasterchef] = useApproveCallback(parsedAmount, SOUL_SUMMONER_ADDRESS[ChainId.FANTOM])
  const [approvalStateVault, approveVault] = useApproveCallback(parsedAmount, SOUL_VAULT_ADDRESS[chainId])

  const [apr, setApr] = useState('0')
  const [liquidity, setLiquidity] = useState('0')

/**
 * Runs only on initial render/mount
 */
  useEffect(() => {
    getAprAndLiquidity()
  }, [account])

  /**
   * Withdraws SOUL Staked
   */
  const handleWithdraw = async () => {
    try {
      // console.log('minting', amount.toString())
      const tx = await withdraw(balance)
      // await tx.wait()
      // await fetchBals(pid)
    } catch (e) {
      // alert(e.message)
      console.log(e)
    }
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
        tvl
        // .toFixed(0)
        // .toString()
        // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      )
      console.log('tvl:%s', tvl)

      // console.log("apr", farmApr);
      setApr(
        // Number(
        apr
        // )
        // .toFixed(0)
        // .toString()
        // .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      )
      console.log('tvl:%s', apr)
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
        const result1 = await userInfo(0, account)
        const staked = ethers.utils.formatUnits(result1?.[0])
        setStakedBal(staked.toString())
      } catch (err) {
        console.warn(err)
      }
    }
  }

  // SEANCE > STAKED
  const hasMoreSeance =
    seanceBalance?.toFixed(2) > Number(stakedBal)?.toFixed(2)

  // WITHDRAWABLE AMOUNT
  const withdrawable =
    hasMoreSeance ?
      Number(stakedBal)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : !hasMoreSeance ?
        seanceBalance?.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        // STAKED < SEANCE
        : 0

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  const handleClickMax = () => {
    setInput(parsedAmount ? parsedAmount.toSignificant(balance.currency.decimals).substring(0, INPUT_CHAR_LIMIT) : '')
    setUsingBalance(true)
  }

  const insufficientFunds = (balance && balance.equalTo(ZERO)) || parsedAmount?.greaterThan(balance)

  const inputError = insufficientFunds

  const [pendingTx, setPendingTx] = useState(false)

  const buttonDisabled = !input || pendingTx || (parsedAmount && parsedAmount.equalTo(ZERO))

  const handleClickButton = async () => {
    if (buttonDisabled) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      if (activeTab === 0) {
        const approving = autoStaking ? approvalStateVault : approvalStateChef
        if (approving === ApprovalState.NOT_APPROVED) {
          const success = await sendTx(() => approveMasterchef())
          if (!success) {
            setPendingTx(false)
            // setModalOpen(true)
            return
          }
        }
        const success = await sendTx(() => enter(parsedAmount))
        if (!success) {
          setPendingTx(false)
          // setModalOpen(true)
          return
        }
      } else if (activeTab === 1) {
        const success = await sendTx(() => leave(parsedAmount))
        if (!success) {
          setPendingTx(false)
          // setModalOpen(true)
          return
        }
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const handleHarvest = async () => {
    if (buttonDisabled) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)
      const success = await sendTx(() => harvest())
      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }
    }

    handleInput('')
    setPendingTx(false)
  }

  const { pendingSoul } = useSoulSummonerContract()

  const [pending, setPending] = useState('')

  // Runs once (on mount)
  useEffect(() => {
    fetchBals()
  })

  // Runs on render + reruns every second
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending(0)
      }, 10000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  // Fetches connected user pending soul
  const fetchPending = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const pending = ethers.BigNumber.from(await pendingSoul(pid, account)).toString()
        console.log(pending)
        const formatted = ethers.utils.formatUnits(pending.toString())
        console.log(formatted)
        setPending(Number(formatted).toFixed(1).toString())
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Stake | Soul</title>
        <meta
          name="description"
          content="Stake SOUL in return for SEANCE, an interest bearing and fungible ERC20 token designed to share revenue generated by all Soul products."
        />
      </Head>
      {/* <DoubleGlowShadowV2 maxWidth={false} opacity={'0.3'}> */}
      <div className="mb-1 md:mb-2" />
        {/* <Header /> */}
        <div className="flex items-right px-4">
          {/* <NavLink href="/mines?filter=active"> */}
          <NavLink href="/summoner">
            <a className="flex items-center space-x-2 font-medium text-center cursor-pointer text-base hover:text-high-emphesis">
              <span>{i18n._(t`Back to Farms`)}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </NavLink>
        </div>
        <div className="mt-2 mb-1" />
        <div className="flex flex-col w-full min-h-full">
          <div className="flex justify-center mb-6">
            <div className="flex flex-col w-full max-w-xl mt-auto mb-2">
              <div className="flex max-w-lg">

              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-col w-full max-w-xl mx-auto mb-4">
                  <div>
                    {/* <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} /> */}
                    <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
                      {/* STAKING OR UNSTAKING */}
                      <div className="flex w-full rounded h-14 bg-dark-800">
                        <div
                          className="h-full w-6/12 p-0.5"
                          onClick={() => {
                            setActiveTab(0)
                            handleInput('')
                          }}
                        >
                          <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                            <p>{i18n._(t`DEPOSIT`)}</p>
                          </div>
                        </div>
                        <div
                          className="h-full w-6/12 p-0.5"
                          onClick={() => {
                            setActiveTab(1)
                            handleInput('')
                          }}
                        >
                          <div className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}>
                            <p>{i18n._(t`WITHDRAW`)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full mt-6">
                        <p className="font-bold text-large md:text-2xl text-high-emphesis">
                          {autoStaking
                            ? activeTab === 0
                              ? i18n._(t`Stake Auto Reinvesting SOUL`)
                              : i18n._(t`Unstake Auto Reinvesting SOUL`)
                            : activeTab === 0
                            // ? i18n._(t`Stake`)
                            // : i18n._(t`Unstake`)
                          }
                        </p>
                      </div>

                      <StyledNumericalInput
                        value={input}
                        onUserInput={handleInput}
                        className={`w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap${inputError ? ' pl-9 md:pl-12' : ''
                          }`}
                        placeholder=" "
                      />

                      {/* input overlay: */}
                      <div className="relative w-full h-0 pointer-events-none bottom-14">
                        <div
                          className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${inputError ? ' border border-red' : ''
                            }`}
                        >
                          <div className="flex space-x-2 ">
                            {inputError && (
                              <Image
                                className="mr-2 max-w-4 md:max-w-5"
                                src="/error-triangle.svg"
                                alt="error"
                                width="20px"
                                height="20px"
                              />
                            )}
                            <p
                              className={`text-sm md:text-lg font-bold whitespace-nowrap ${input ? 'text-high-emphesis' : 'text-secondary'
                                }`}
                            >
                              {`${input ? input : '0'} ${activeTab === 0 ? 'SOUL' : 'SEANCE'}`}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-secondary md:text-base">
                            <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                              {/* <p>{i18n._(t`Balance`)}:&nbsp;</p> */}
                              <p className="text-base mr-2 font-bold">{
                                Number(formattedBalance)
                                  .toFixed(2)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              </p>
                            </div>
                            <SubmitButton
                              className="px-2 py-1 mr-2 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-purple md:bg-opacity-30 border-secondary md:border-purple rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-purple"
                              onClick={
                                activeTab == 0 ?
                                  handleClickMax
                                  : hasMoreSeance ?
                                  setShowConfirmation
                                    : handleClickMax
                              }
                            >
                              {i18n._(t`MAX`)}
                            </SubmitButton>
                          </div>
                        </div>
                      </div>
                      {(autoStaking
                        ? approvalStateVault === ApprovalState.NOT_APPROVED || approvalStateVault === ApprovalState.PENDING
                        : approvalStateChef === ApprovalState.NOT_APPROVED ||
                        approvalStateChef === ApprovalState.PENDING) && activeTab === 0 ? (
                        <Button
                          className={`${buttonStyle} text-high-emphesis bg-purple hover:bg-opacity-90`}
                          disabled={
                            autoStaking
                              ? approvalStateVault === ApprovalState.PENDING
                              : approvalStateChef === ApprovalState.PENDING
                          }
                          onClick={autoStaking ? approveVault : approveMasterchef}
                        >
                          {autoStaking ? (
                            approvalStateVault === ApprovalState.PENDING
                          ) : approvalStateChef === ApprovalState.PENDING ? (
                            <Dots>{i18n._(t`Approving`)} </Dots>
                          ) : (
                            i18n._(t`Approve`)
                          )}
                        </Button>
                      ) : (
                        <button
                          className={
                            buttonDisabled
                              ? buttonStyleDisabled
                              : !walletConnected
                                ? buttonStyleConnectWallet
                                : insufficientFunds
                                  ? buttonStyleInsufficientFunds
                                  : buttonStyleEnabled
                          }
                          onClick={handleClickButton}
                          disabled={buttonDisabled || inputError}
                        >
                          {!walletConnected
                            ? i18n._(t`Connect Wallet`)
                            : !input
                              ? i18n._(t`Enter Amount`)
                              : insufficientFunds
                                ? i18n._(t`Insufficient Balance`)
                                : activeTab === 0
                                  ? i18n._(t`Confirm Staking`)
                                  : i18n._(t`Confirm Withdrawal`)}
                        </button>
                      )}
                      <p className="mt-3 text-sm text-purple font-bold text-center md:text-base text-primary">WITHDRAWABLE: {' '}
                        {withdrawable}
                      </p>
                    </div>
                  </div>
                </div>
                {/* SIDE BALANCE BOARD */}

                <div className="flex flex-col items-center w-full max-w-xl">
                  <div className="flex flex-col w-full pt-4 pb-5 rounded bg-dark-900">
                    <div className="flex flex-wrap">

                      <div className="flex flex-col flex-grow md:mb-3">
                        <div className="flex items-center text-center ml-4 space-x-4">
                          <Image
                            className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                            src="/images/tokens/seance.png"
                            alt="SEANCE"
                            width={72}
                            height={72}
                          />
                          <div className="flex flex-col justify-center">
                            <p className="text-md items-center text-center font-bold md:text-lg text-high-emphesis">
                              {seanceBalance
                                ? seanceBalance
                                  .toFixed(0)
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : //.toSignificant(5)
                                '-'}
                            </p>
                            <p className="text-center text-md text-purple text-primary font-bold text-primary">SEANCE</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col flex-grow md:mb-3">
                        <div className="flex items-center text-center space-x-4">
                          <Image
                            className="max-w-10 md:max-w-12 mb-1 mt-4 rounded"
                            src="/images/tokens/soul.png"
                            alt="SOUL"
                            width={72}
                            height={72}
                          />
                          <div className="flex flex-col justify-center">
                            <p className="text-md items-center text-center font-bold md:text-lg text-high-emphesis">
                              {Number(stakedBal) === 0
                                ? '0'
                                : Number(stakedBal) < 0
                                  ? '<0'
                                  : Number(stakedBal)
                                    .toFixed(0)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </p>
                            <p className="text-center text-md text-purple text-primary font-bold text-primary">STAKED</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex text-center mt-4 mb-4">
                        <div className="flex text-center items-center ml-4 mr-4 space-x-4">
                          <p className="text-md text-center font-bold md:text-lg text-high-emphesis">
                            <p className="text-md text-center font-bold md:text-lg text-high-emphesis">APR: {' '}
                              {Number(apr) === 0
                                ? '0'
                                : Number(apr) < 0
                                  ? '<0'
                                  : Number(apr)
                                    .toFixed(0)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}%
                            </p>
                          </p>
                          <div className="flex text-center items-center flex-col justify-between">
                            <p className="items-center text-md font-bold md:text-lg text-high-emphesis">
                              TVL: {' '} ${Number(liquidity) === 0
                                ? '0'
                                : Number(liquidity) < 0
                                  ? '<0'
                                  : Number(liquidity)
                                    .toFixed(0)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      className={`${buttonStyle} text-high-emphesis bg-purple opacity-100 hover:bg-opacity-80`}
                      onClick={() => harvest()}
                    >
                      Harvest{' '}
                      {Number(pending)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="self-right mb-3 text-xl font-bold md:text-2xl text-high-emphesis md:mb-4">
            {i18n._(t`Stake SOUL to borrow SEANCE`)}
          </div>
        <div className="max-w-xl pr-3 mb-2 text-sm leading-5">
          {i18n._(t`SEANCE is a receipt for your staked SOUL.
          Use SEANCE to reclaim your SOUL when you want to withdraw.
          You may trade or farm your SEANCE and risk locking your SOUL for all eternity...
          Either way, while staked, you'll earn more SOUL over time.`
          )}
        </div>
        </div>
      {/* </DoubleGlowShadowV2> */}
      <Modal isOpen={showConfirmation} onDismiss={
        () => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Please Read and Confirm`} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
            If you have more SEANCE than you have STAKED, then please read below:
            <br /><br />
            After closing this prompt, please proceed with <b>manually entering</b> any number <b>less than or equivalent to</b> the
            amount denoted as <b>withdrawable</b>, for your convenience.
            <br /><br />
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <SubmitButton
            height="2.5rem"
            onClick={() =>
              setShowConfirmation(false)
            }
          >
            I UNDERSTAND THESE TERMS
          </SubmitButton>
        </div>
      </Modal>
    </div>
  )
}
