import { SOUL_ADDRESS, SOUL_SUMMONER_ADDRESS, SOUL_VAULT_ADDRESS, ZERO } from '../../sdk'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import React, { useEffect, useState } from 'react'
import { SOUL, SEANCE } from '../../constants'
// import Balance from '../../components/Balance'
import { Button } from '../../components/Button'
import { ChainId } from '../../sdk'
import Head from 'next/head'
import Dots from '../../components/Dots'
import Image from 'next/image'
import { Input as NumericalInput } from '../../components/NumericalInput'
// import TransactionFailedModal from '../../components/TransactionFailedModal'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from 'services/web3'
import { useLingui } from '@lingui/react'
import useSoulStakeManual from '../../hooks/useSoulStakeManual'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import useSoulVault from '../../hooks/useSoulVault'
import AccountDetails from '../../components/AccountDetails'
import useSoulSummoner from '../../features/farm/hooks/useSoulSummoner'
import { ethers } from 'ethers'
import { useSoulSummonerContract } from '../../hooks'

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
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`

export default function SoulStake() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  // functions from SoulVault contract we're using
  const {
    // userInfo,
    // totalShares,
    userSharePercOfTotal,
    calculateHarvestSoulRewards,
    userPendingRewards,
    // deposit,
    // withdraw,
    // withdrawAll,
    // harvest,soul
  } = useSoulVault()
  const { enter, leave, harvest } = useSoulStakeManual()

  // ** Require Update: Need to make dynamic by fetching selected chain **
  const soulBalance = useTokenBalance(account ?? undefined, SOUL[chainId])
  const seanceBalance = useTokenBalance(account ?? undefined, SEANCE[chainId])

  // const pendingSoul = userPendingRewards() // amount of soul is pending for user
  // const percOfTotal = userSharePercOfTotal() // user percentage of pool

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

  // Approve masterchef to move funds with `transferFrom`
  const [approvalStateChef, approveMasterchef] = useApproveCallback(
    parsedAmount,
    SOUL_SUMMONER_ADDRESS[ChainId.FANTOM]
  )
  const [approvalStateVault, approveVault] = useApproveCallback(parsedAmount, SOUL_VAULT_ADDRESS[chainId])

  // ---------------------
  //      SOUL VAULT
  // ---------------------
  // const [claiming, setClaiming] = useState(false)
  const [bounty, setBounty] = useState(0)
  // const [userShare, setUserShare] = useState()

  // const userShares = async () => {
  //   const shares = await calculateHarvestSoulRewards()
  //   setUserShare(shares) // TODO: looking to grab only `shares` out of the array
  // }

  // // checks SOUL bounty funds available for harvest
  // const updateBountyStats = async () => {
  //   const pending = await calculateHarvestSoulRewards()
  //   // const formattedPending = pending // TODO: format to `toSignificant(4)`
  //   setBounty(bounty)
  // }

  // // will update bounty stats every 5 seconds
  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     updateBountyStats()  // value
  //   }, 3 * 1000) // delay

  //   // this will clear Timeout
  //   // when component unmount like in willComponentUnmount
  //   // and show will not change to true
  //   return () => {
  //     clearTimeout(timer)
  //   }
  // })

  /**
   * @dev Calls `harvest` func of SoulVault
   */
  // const handleHarvest = async () => {
  //   if (!walletConnected) {
  //     toggleWalletModal()
  //   } else {
  //     setClaiming(true)
  //     const success = await sendTx(() => harvest())
  //     if (!success) {
  //       setClaiming(false)
  //       return
  //     }

  //     setClaiming(false)
  //   }
  // }

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
  // const summonerContract = useSoulSummonerContract()

  const { pendingSoul } = useSoulSummonerContract()

  const [pending, setPending] = useState('')

  // Runs on render + reruns every second
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending(0)
      }, 3000)

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

  // const [apr, setApr] = useState<any>()

  // TODO: DROP AND USE SWR HOOKS INSTEAD
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const results = await soulData.exchange.dayData()
  //     const apr = (((results[1].volumeUSD * 0.05) / data?.bar?.totalSupply) * 365) / (data?.bar?.ratio * soulPrice)

  //     setApr(apr)
  //   }
  //   fetchData()
  // }, [data?.bar?.ratio, data?.bar?.totalSupply, soulPrice])

  return (
    <div>
      <Head>
        <title>Stake | Soul</title>
        <meta
          name="description"
          content="Stake SOUL in return for SEANCE, an interest bearing and fungible ERC20 token designed to share revenue generated by all Soul products."
        />
      </Head>
      <div className="flex flex-col w-full min-h-full">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col w-full max-w-xl mt-auto mb-2">
            <div className="flex max-w-lg">
              <div className="self-end mb-3 text-lg font-bold md:text-2xl text-high-emphesis md:mb-7">
                {i18n._(t`Maximize yield by staking SOUL for SEANCE`)}
              </div>
            </div>
            <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
              {i18n._(t`When your SOUL is staked into the Circle, you receive SEANCE in return for voting rights and a fully composable 
              token that can interact with other protocols. Your SEANCE is continuously compounding, when you unstake you will receive all 
              the originally deposited SOUL, your SOUL harvest rewards, and (soon) fee share.`)}
            </div>
          </div>
          {/* SIDE BALANCE BOARD */}
          {/* <div className="w-full max-w-xl mx-auto md:mx-0 md:ml-6 md:block md:w-72">
            <div className="flex flex-col w-full px-4 pt-6 pb-5 rounded bg-dark-900 md:px-8 md:pt-7 md:pb-9">
              <div className="flex flex-wrap">
                {/* SOUL BOUNTY *}
                <p className="mb-3 text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                  {i18n._(t`Snatch Bounty`)}
                </p>
                <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
                  {i18n._(t`If withdrawing before 72hrs has passed, you will be charged 1% of your stake!`)}
                </div>
                <Button
                  className={`${buttonStyle} text-high-emphesis bg-purple hover:bg-opacity-90`}
                  disabled={walletConnected === !account}
                  onClick={handleHarvest}
                >
                  {claiming ? <Dots>Snatching {bounty} SOUL </Dots> : 
                  
                  <Balance 
                    value = {bounty / (10**18)} 
                    decimals = {4}
                    unit = " SOUL"
                    />
                  
                  }
                </Button>
              </div> 
            </div>
          </div> */}
        </div>
        <div className="flex flex-col justify-center md:flex-row">
          <div className="flex flex-col w-full max-w-xl mx-auto mb-4 md:m-0">
            <div>
              {/* <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} /> */}
              <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
                {/* AUTOMATIC OR MANUAL STAKING */}
                {/* <div className="flex w-full rounded h-14 bg-dark-800">
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      userShares()
                      calculateHarvestSoulRewards()
                      setAutoStaking(false)
                    }}
                  >
                    <div className={!autoStaking ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Manual Reinvesting`)}</p>
                    </div>
                  </div>
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setAutoStaking(true)
                    }}
                  >
                    <div className={autoStaking ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Automatic Reinvesting`)}</p>
                    </div>
                  </div>
                </div>

                <br /> */}
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
                      <p>{i18n._(t`Stake`)}</p>
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
                      <p>{i18n._(t`Unstake`)}</p>
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
                      ? i18n._(t`Stake SOUL`)
                      : i18n._(t`Unstake SOUL`)}
                  </p>
                </div>
                <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
                  {autoStaking
                    ? 'When someone snatches the SOUL bounty, your pending SOUL gets re-invested automatically!'
                    : 'You will need to manually claim and deposit your pending SOUL to re-invest into your stake.'}
                </div>
                <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
                  {autoStaking ? 'When withdrawing before 72hrs has passed, you will be charged 1% of your stake!' : ''}
                </div>

                <StyledNumericalInput
                  value={input}
                  onUserInput={handleInput}
                  className={`w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap${
                    inputError ? ' pl-9 md:pl-12' : ''
                  }`}
                  placeholder=" "
                />

                {/* input overlay: */}
                <div className="relative w-full h-0 pointer-events-none bottom-14">
                  <div
                    className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${
                      inputError ? ' border border-red' : ''
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
                        className={`text-sm md:text-lg font-bold whitespace-nowrap ${
                          input ? 'text-high-emphesis' : 'text-secondary'
                        }`}
                      >
                        {`${input ? input : '0'} ${activeTab === 0 ? 'SOUL' : 'SEANCE'}`}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-secondary md:text-base">
                      <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                        <p>{i18n._(t`Balance`)}:&nbsp;</p>
                        <p className="text-base font-bold">{formattedBalance}</p>
                      </div>
                      <button
                        className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-cyan-blue md:bg-opacity-30 border-secondary md:border-cyan-blue rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-cyan-blue"
                        onClick={handleClickMax}
                      >
                        {i18n._(t`MAX`)}
                      </button>
                    </div>
                  </div>
                </div>
                {(autoStaking
                  ? approvalStateVault === ApprovalState.NOT_APPROVED || approvalStateVault === ApprovalState.PENDING
                  : approvalStateChef === ApprovalState.NOT_APPROVED || approvalStateChef === ApprovalState.PENDING) &&
                activeTab === 0 ? (
                  <Button
                    className={`${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`}
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
              </div>
            </div>
          </div>
          {/* SIDE BALANCE BOARD */}
          <div className="w-full max-w-xl mx-auto md:mx-0 md:ml-6 md:block md:w-72">
            <div className="flex flex-col w-full px-4 pt-6 pb-5 rounded bg-dark-900 md:px-8 md:pt-7 md:pb-9">
              <div className="flex flex-wrap">
                <div className="flex flex-col flex-grow md:mb-14">
                  <p className="mb-3 text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                    {autoStaking ? 'Shares' : i18n._(t`Balance`)}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Image
                      className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                      src="/images/tokens/seance.png"
                      alt="SEANCE"
                      width={64}
                      height={64}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold md:text-lg text-high-emphesis">
                        {seanceBalance ? seanceBalance.toSignificant(4) : '-'}
                      </p>
                      <p className="text-sm md:text-base text-primary">SEANCE</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex mb-3 ml-8 flex-nowrap md:ml-0">
                    <p className="text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                      {i18n._(t`Unstaked`)}
                    </p>
                  </div>
                  <div className="flex items-center ml-8 space-x-4 md:ml-0">
                    <Image
                      className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                      src="/images/tokens/soul.png"
                      alt="SOUL"
                      width={64}
                      height={64}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold md:text-lg text-high-emphesis">
                        {soulBalance ? soulBalance.toSignificant(5) : '-'}
                      </p>
                      <p className="text-sm md:text-base text-primary">SOUL</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className={`${buttonStyle} text-high-emphesis bg-cyan-blue opacity-100 hover:bg-opacity-80`}
                onClick={() => harvest()}
              >
                Harvest {pending}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
