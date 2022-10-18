import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Tab } from '@headlessui/react'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { Button, ButtonError } from 'components/Button'
import VaultInputPanel from 'components/VaultInputPanel'
import { ApprovalState, useApproveCallback, useAutoStakeContract, useLuxorStakeHelperContract, useLuxorStakingContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { SEANCE_ADDRESS, AUTO_STAKE_ADDRESS, max, Token, SOUL } from 'sdk'
import { SOUL_ADDRESS } from 'constants/addresses'
import { tryParseAmount, formatNumber, classNames } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useStakeContract, useWarmupValue } from 'features/luxor/stake/hooks'
import { useActiveWeb3React } from 'services/web3/hooks'
import NavLink from 'components/NavLink'
import { useTokenContract } from 'hooks/useTokenContract'
import { useLuxorPrice, useSoulPrice } from 'hooks/getPrices'
import { useAutoStakeInfo, useLuxorInfo, useLuxorUserInfo, useUserAutoStakeInfo } from 'hooks/useAPI'
// import useSendTransaction from 'hooks/useSendTransaction'
import { SubmitButton } from 'features/autostake/Styles'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'
import ExternalLink from 'components/ExternalLink'

export default function Stake() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  const [stakeValue, setStakeValue] = useState('0')
  const [warmupValue, setWarmupValue] = useState(0)
  const [warmupExpiry, setWarmupExpiry] = useState('0')
  const { account, chainId } = useActiveWeb3React()
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')
  const parsedDepositValue = tryParseAmount(depositValue, SOUL[chainId])
  const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[chainId])

  const soulPrice = useSoulPrice()
  const AutoStakeContract = useAutoStakeContract()

  const soulToken = new Token(chainId, getAddress(SOUL_ADDRESS[chainId]), 18, 'SOUL')
  const soulBal = useCurrencyBalance(account, soulToken)
  const [seanceBal, setSeanceBalance] = useState(0)
  const [soulBalance, setLuxBalance] = useState(0)

  const parsedStakeValue = tryParseAmount(stakeValue, soulToken)

  // CONTRACTS //
  
  // staking  
  const { autoStakeInfo } = useAutoStakeInfo()
  const { userAutoStakeInfo} = useUserAutoStakeInfo(account)
  

  // STAKING DATA //
  const pricePerShare = Number(autoStakeInfo.pricePerShare)
  const userBalance = Number(userAutoStakeInfo.userBalance)
  const stakedBal = Number(userAutoStakeInfo.stakedBalance)
  const earnedAmount = (pricePerShare * userBalance) - stakedBal

  // const performanceFee = autoStakeInfo.performanceFee
  // const available = autoStakeInfo.available
  // const callFeeRate = autoStakeInfo.callFee
  const bounty = autoStakeInfo.bounty
    
  // AUTOSTAKE DATA //
  const tvl = Number(autoStakeInfo.tvl)
  // const apy = Number(autoStakeInfo.apy)  
  const stakingAPY = (Math.pow(1 + 3, 365 * 3) - 1) * 100

    
  // FEE-RELATED VALUES //
  const nowTime = new Date().getTime()
  const withdrawFeeRate = Number(autoStakeInfo.withdrawFee)
  const feeHours = Number(autoStakeInfo.withdrawFeeHours)
  const feeDuration = Number(autoStakeInfo.withdrawFeePeriod) * 1_000
  const lastDepositTime = Number(userAutoStakeInfo.lastDepositedTime) * 1_000
  const feeExpiration = (lastDepositTime + feeDuration)
  const unlockTime = new Date(feeExpiration).toLocaleString()
  const timeSinceDeposit = nowTime - lastDepositTime / 3_600_000
  // const feeSecondsRemaining = feeExpiration - nowTime
  const remainingSeconds = feeExpiration - Number(nowTime)
  // console.log('remainingSecs:%s', remainingSeconds)
  const remainingHours = remainingSeconds / 3_600_000
  const remainingMinutes = max(remainingHours * 60, 0)
  
  const feeAmount = 
    remainingMinutes == 0 ? 0 : withdrawFeeRate * Number(withdrawValue)

  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    AUTO_STAKE_ADDRESS[chainId]
  )

  const stakeError = !parsedStakeValue
    ? 'Enter Amount'
    : soulBal?.lessThan(parsedStakeValue)
      ? 'Insufficient Balance'
        : undefined

  const isStakeValid = !stakeError  

    // HANDLE DEPOSIT //
     const handleDeposit = async (amount) => {
      try {
          const tx = await AutoStakeContract?.deposit(account, parsedDepositValue?.quotient.toString())
          await tx.wait()
      } catch (e) {
          // alert(e.message)
          console.log(e)
      }
  }
    // HANDLE WITHDRAW //
    const handleWithdraw = async (amount) => {
        try {
            const tx = await AutoStakeContract?.withdraw(account, parsedWithdrawValue?.quotient.toString())
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }


  const handleWithdrawAll = async () => {
    try {
        let tx
        tx = await AutoStakeContract.withdrawAll()
        await tx?.wait()
    } catch (e) {
        // alert(e.message)
        console.log(e)
    }
}


  return (
    <Container id="autostake-page" className="py-4 md:py-8 lg:py-12">
      <Head>
        <title>AutoStake | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Farm </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Lend </span>
            </a>
          </NavLink>
        </Button>
      </div>
      <DoubleGlowShadowV2>
        <div className="p-6 space-y-6 bg-dark-900 rounded z-1 relative">
          <Tab.Group>
            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
            <div className="grid grid-cols-2 w-[95%] rounded-md p-2px bg-dark-900">
            <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-[#b383ff] text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-purple`
                }
              >
                {i18n._(t`Deposit`)}
              </Tab>
              <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-[#b383ff] text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-purple`
                }
              >
                {i18n._(t`Withdraw`)}
              </Tab>
          </div>
            </Tab.List>
            
            <Tab.Panel className={'outline-none'}>
              <VaultInputPanel
                value={stakeValue}
                showLogo={true}
                showMaxButton={true}
                onUserInput={(value) => setStakeValue(value)}
                onMax={() =>
                  setStakeValue(soulBal.toExact())
                }
                currency={soulToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-input"
              />

              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Fee Period Remaining`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  { (remainingMinutes).toFixed() } mins
                  </Typography>
              </div>             
              
              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-purple w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center text-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(stakingAPY)}% APY</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-purple w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited Amount`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {stakedBal.toFixed(0)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Fee Period`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {feeHours} hours
                  </Typography>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                {isStakeValid &&
                  (stakeApprovalState === ApprovalState.NOT_APPROVED ||
                    stakeApprovalState === ApprovalState.PENDING) ? (
                  <Button
                    type="filled"
                    color="purple"
                    className="text-black"
                    onClick={stakeApprove}
                    disabled={stakeApprovalState !== ApprovalState.NOT_APPROVED}
                    style={{ width: '100%' }}
                  >
                    {stakeApprovalState === ApprovalState.PENDING ? (
                      <Dots>{i18n._(t`Approving`)}</Dots>
                    ) : (
                      i18n._(t`Approve`)
                    )}
                  </Button>
                ) : (
                  <SubmitButton
                  height="2rem"
                  primaryColor="#B485FF"
                  color="black"
                  margin=".5rem 0 .5rem 0"
                  onClick={() =>
                      handleDeposit(depositValue)
                  }
              >
                  DEPOSIT
              </SubmitButton>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel className={'outline-none'}>
             <VaultInputPanel
                value={withdrawValue}
                showLogo={true}
                showMaxButton={true}
                onUserInput={(value) => setWithdrawValue(value)}
                onMax={ () => setWithdrawValue(stakedBal.toString()) }
                currency={soulToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-output"
              />
<div className="h-px my-2 bg-dark-1000" />

<div className="flex justify-between">
    <Typography className="text-white" fontFamily={'medium'}>
      {i18n._(t`Fee Period Remaining`)}
    </Typography>
    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
    { (remainingMinutes).toFixed() } mins
    </Typography>
</div>             

<div className="h-px my-2 bg-dark-1000" />

                <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-purple w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center text-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(stakingAPY)}% APY</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-purple w-full space-y-1">
              <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited Amount`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {stakedBal.toFixed(0)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Fee Amount`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {feeAmount.toFixed(2)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Fee Period Ends`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    { unlockTime }
                  </Typography>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                                                     {/* <AssetInput
                                        currencyLogo={true}
                                        currency={SOUL[chainId]}
                                        currencyAddress={SOUL[chainId].address}
                                        value={withdrawValue}
                                        onChange={setWithdrawValue}
                                        showMax={false}
                                        showBalance={false}
                                    /> */}
                                    
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="#B485FF"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleWithdraw(withdrawValue)
                                            }
                                        >
                                            WITHDRAW
                                        </SubmitButton>
              </div>
            </Tab.Panel>
          </Tab.Group>
        </div>
      </DoubleGlowShadowV2>
    </Container>
  )
}

Stake.Guard = NetworkGuard(Feature.SEANCE)