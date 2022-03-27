import { ENCHANT_ADDRESS, ZERO } from '../../sdk'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import React, { useEffect, useState } from 'react'
import { ENCHANT, SEANCE } from '../../constants'
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
import useSeanceStakeManual from '../../hooks/useSeanceStakeManual'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import EnchantBanner from '../../components/EnchantBanner'
import useEnchant from '../../hooks/useEnchant'
// import useEnchantHelper from '../../hooks/useEnchant'
import { ethers } from 'ethers'

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

export default function Enchant() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  // functions from Enchantment contract we're using
  const { enter, leave } = useSeanceStakeManual()
  const { enchantedSeance, totalShares, userBalance } = useEnchant()
  // ** Require Update: Need to make dynamic by fetching selected chain **
  const [stakedBalance, setStakedBal] = useState('')
  // const [pendingRewards, setPendingRewards] = useState('')
  const [enchanted, setEnchantedSeance] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const seanceBalance = useTokenBalance(account ?? undefined, SEANCE[chainId])
  const enchantBalance = useTokenBalance(account ?? undefined, ENCHANT[chainId])

  const walletConnected = !!account
  // const toggleWalletModal = useWalletModalToggle()

  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)
  const [usingSeanceBalance, setUsingSeanceBalance] = useState(false)

  const balance = activeTab === 0 ? seanceBalance : enchantBalance
  const formattedBalance = balance?.toSignificant(4)

  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  // Approve enchantment to move funds with `transferFrom`
  const [approvalStateEnchant, approveEnchant] = useApproveCallback(parsedAmount, ENCHANT_ADDRESS[ChainId.FANTOM])
  // const [approvalStateVault, approveVault] = useApproveCallback(parsedAmount[chainId])

  // ---------------------
  //      ENCHANTMENT
  // ---------------------
  // const [bounty, setBounty] = useState(0)
  

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
      // toggleWalletModal()
    } else {
      setPendingTx(true)

      if (activeTab === 0) {
        const approving = approvalStateEnchant
        if (approving === ApprovalState.NOT_APPROVED) {
          const success = await sendTx(() => approveEnchant())
          if (!success) {
            setPendingTx(false)
            return
          }
        }
        const success = await sendTx(() => enter(parsedAmount))
        if (!success) {
          setPendingTx(false)
          return
        }
      } else if (activeTab === 1) {
        const success = await sendTx(() => leave(parsedAmount))
        if (!success) {
          setPendingTx(false)
          return
        }
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const [pending, setPending] = useState('')

  // Runs once (on mount)
  useEffect(() => {
    fetchStakedBalance()
    fetchEnchantedSeance()
    fetchTotalSupply()
  })

  // Runs on render + reruns every second
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        setPending(account)
      }, 10000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  const fetchStakedBalance = async () => {
    if (!walletConnected) {
      // toggleWalletModal()
    } else {
      try {
        const staked = ethers.BigNumber.from(await userBalance()).toString()
        // console.log(staked)
        const stakedBalance = ethers.utils.formatUnits(staked.toString())
        // console.log(stakedBalance)
        setStakedBal(Number(stakedBalance).toFixed(2).toString())

        return stakedBalance
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const fetchEnchantedSeance = async () => {
    if (!walletConnected) {
      // toggleWalletModal()
    } else {
      try {
        const bal = ethers.BigNumber.from(await enchantedSeance()).toString()
        // console.log(staked)
        const enchanted = ethers.utils.formatUnits(bal.toString())
        // console.log(stakedBalance)
        setEnchantedSeance(Number(enchanted).toFixed(1).toString())

        return enchanted
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const share = Number(stakedBalance) / Number(totalSupply)
  const payable = Number(share) * Number(enchanted)
  const rewards = Number(payable) - Number(stakedBalance)

  const fetchTotalSupply = async () => {
    if (!walletConnected) {
      // toggleWalletModal()
    } else {
      try {
        const supply = ethers.BigNumber.from(await totalShares()).toString()
        // console.log(staked)
        const totalSupply = ethers.utils.formatUnits(supply.toString())
        // console.log(stakedBalance)
        setTotalSupply(Number(totalSupply).toFixed(1).toString())

        return totalSupply
      }
      catch (err) {
        console.log(err)
      }
    }
  }


  // const [apr, setApr] = useState<any>()

  // TODO: DROP AND USE SWR HOOKS INSTEAD
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const results = await soulData.exchange.dayData()
  //     const apr = (((results[1].volumeUSD * 0.05) / data?.enchant?.totalSupply) * 365) / (data?.enchant?.ratio * seancePrice)

  //     setApr(apr)
  //   }
  //   fetchData()
  // }, [data?.enchant?.ratio, data?.enchant?.totalSupply, seancePrice])

  return (
    <div>
      <Head>
        <title>Stake | Seance</title>
        <meta
          name="description"
          content="Stake SEANCE in return for ENCHANT, an interest bearing and fungible ERC20 token designed to share revenue generated by all Soul products."
        />
      </Head>
      <DoubleGlowShadowV2 maxWidth={false} opacity={'0.3'}>
        <EnchantBanner />
        <div className="flex flex-col w-full min-h-full">
          <div className="flex justify-center mb-6">
            <div className="flex flex-col w-full max-w-xl mt-auto mb-2">
              <br/><br/>
              <div className="flex max-w-lg">
                <div className="self-end mb-3 text-lg font-bold md:text-2xl text-high-emphesis md:mb-7">
                 Enchant Has Been Discontinued
                </div>
              </div>
                <div className="max-w-lg pr-4 mb-2 text-md leading-5 md:text-base md:mb-4 md:pr-0">
                  <b>Enchant rewards have been discontinued</b>. 
                  We have begun implenting a new measure, including buying back and burning Soul. 
                  <br/><br/>Full details regarding the proposal passed on December 25th, 2021, may be found 
                  <b>
                    <a href="https://forum.soulswap.finance/t/proposal-remove-enchant/159" target="_blank" rel="noreferrer"> here</a>
                  </b>.
                  Please exit before February 2022, which is when the UI will no longer be accessible for an easy exit, requiring directly interacting with the smart contract.
              </div>
            </div>
           
          </div>
          <div className="flex flex-col justify-center md:flex-row">
            <div className="flex flex-col w-full max-w-xl mx-auto mb-4 md:m-0">
              <div>
                {/* <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} /> */}
                <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
                <br />
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
                        <p>{i18n._(t`ENCHANT`)}</p>
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
                        <p>{i18n._(t`EXIT`)}</p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex items-center justify-between w-full mt-6">
                    <p className="font-bold text-large md:text-2xl text-high-emphesis">
                      {activeTab === 0
                        ? i18n._(t`Stake`)
                        : i18n._(t`Unstake`)}
                    </p>
                  </div> */}
                  {/* <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0"> */}
                    {/* {'You will need to manually claim and deposit your pending SEANCE to re-invest into your stake.'} */}
                  {/* </div> */}
                  <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
                    {''}
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
                          {`${input ? input : '0'} ${activeTab === 0 ? 'SEANCE' : 'ENCHANT'}`}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-secondary md:text-base">
                        <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                          <p>{i18n._(t`Balance`)}:&nbsp;</p>
                          <p className="text-base font-bold">{
                            Number(formattedBalance)
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                          </p>
                        </div>
                        <button
                          className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-purple md:bg-opacity-30 border-secondary md:border-purple rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-purple"
                          onClick={handleClickMax}
                        >
                          {i18n._(t`MAX`)}
                        </button>
                      </div>
                    </div>
                  </div>
                  {(approvalStateEnchant === ApprovalState.NOT_APPROVED ||
                      approvalStateEnchant === ApprovalState.PENDING) && activeTab === 0 ? (
                    <Button
                      className={ `${buttonStyle} text-high-emphesis bg-purple hover:bg-opacity-90` }
                      disabled={ approvalStateEnchant === ApprovalState.PENDING }
                      onClick={ approveEnchant }
                    >
                      { approvalStateEnchant === ApprovalState.PENDING ? (
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
                        ? i18n._(t`Confirm Enchantment`)
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
                  
                  <div className="flex flex-col flex-grow md:mb-6">
                    {/* <p className="mb-3 text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                      {i18n._(t`Staked`)}
                    </p> */}
                    <div className="flex items-center ml-8 space-x-4 md:ml-0">
                      <Image
                        className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                        src="/images/tokens/enchant.png"
                        alt="ENCHANT"
                        width={42}
                        height={42}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-bold md:text-lg text-high-emphesis">
                            { Number(stakedBalance) === 0
                              ? '0.00'
                              :  Number(stakedBalance) < 0.01
                              ? '<0.01'
                              :  Number(stakedBalance)
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </p>
                        <p className="text-sm md:text-base text-primary">SHARES</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow md:mb-6">
                    {/* <p className="mb-3 text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                      {i18n._(t`Reward`)}
                    </p> */}
                    <div className="flex items-center ml-8 space-x-4 md:ml-0">
                      <Image
                        className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                        src="/images/tokens/seance.png"
                        alt="SEANCE"
                        width={42}
                        height={42}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-bold md:text-lg text-high-emphesis">
                            { payable === 0
                              ? '0.00'
                              :  Number(payable) < 0.01
                              ? '<0.01'
                              :  Number(payable)
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </p>
                        <p className="text-sm md:text-base text-primary">REWARDS</p>
                      </div>
                    </div>
                    <br/><br/>
                    {/* <div className="flex items-center ml-8 space-x-4 md:ml-0">
                        <p className="text-sm font-bold md:text-lg text-high-emphesis">
                            { Number(totalSupply)=== 0
                              ? '0.000'
                              :  Number(totalSupply) < 0.001
                              ? '<0.001'
                              :  Number(totalSupply)
                                .toFixed(3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </p>
                        <p className="text-sm md:text-base text-primary">ENCHANT</p>
                    </div>
                    
                    <div className="flex items-center ml-8 space-x-4 md:ml-0">
                        <p className="text-sm font-bold md:text-lg text-high-emphesis">
                            { Number(enchanted)=== 0
                              ? '0.000'
                              :  Number(enchanted) < 0.001
                              ? '<0.001'
                              :  Number(enchanted)
                                .toFixed(3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </p>
                        <p className="text-sm md:text-base text-primary">SEANCE</p>
                    </div> */}
                    <div className="flex flex-col flex-grow md:mb-6">

                    <div className="flex items-center ml-8 space-x-4 md:ml-0">
                          <p className="text-sm md:text-base text-primary">RATE</p>
                        <p className="text-sm font-bold md:text-lg text-high-emphesis">
                            { (Number(enchanted) / Number(totalSupply))=== 0
                              ? '0.000000'
                              :  (Number(enchanted) / Number(totalSupply)) < 0.001
                              ? '<0.000001'
                              :  (Number(enchanted) / Number(totalSupply))
                                .toFixed(6)
                                .toString()
                                .replace(/\B(?=(\d{7})+(?!\d))/g, ',')}
                        </p>

                    {/* <div className="flex items-center ml-8 space-x-4 md:ml-0">
                        <p className="text-sm font-bold md:text-lg text-high-emphesis">
                            { share === 0
                              ? '0.0'
                              : share < 0.1
                              ? '<0.1'
                              : (share * 100)
                                .toFixed(1)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}%
                        </p>
                        <p className="text-sm md:text-base text-primary">OWN</p> */}
                     {/* </div> */}
                     </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DoubleGlowShadowV2>
    </div>
  )
}
