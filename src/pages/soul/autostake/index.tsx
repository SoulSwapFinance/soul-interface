import React, { useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Tab } from '@headlessui/react'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { Button } from 'components/Button'
import VaultInputPanel from 'components/VaultInputPanel'
import { ApprovalState, useApproveCallback, useAutoStakeContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { AUTO_STAKE_ADDRESS, max, Token, SOUL } from 'sdk'
import { SOUL_ADDRESS } from 'constants/addresses'
import { tryParseAmount, formatNumber } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { useActiveWeb3React } from 'services/web3/hooks'
import NavLink from 'components/NavLink'
import { useSoulPrice } from 'hooks/getPrices'
import { useAutoStakeInfo, useUserAutoStakeInfo } from 'hooks/useAPI'
import { SubmitButton } from 'features/autostake/Styles'

export default function AutoStake() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  const [stakeValue, setStakeValue] = useState('0')
  const { account, chainId } = useActiveWeb3React()
  const [withdrawValue, setWithdrawValue] = useState('0')
  const parsedDepositValue = tryParseAmount(stakeValue, SOUL[250])
  const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[250])

  const soulPrice = useSoulPrice()
  const AutoStakeContract = useAutoStakeContract()

  const soulToken = new Token(250, getAddress(SOUL_ADDRESS[250]), 18, 'SOUL')
  const enchantedToken = new Token(250, '0x083423C61B9373050e62E2A6Ec170e663F9c7BFa', 18, 'CHANT')
  const soulBal = useCurrencyBalance(account, soulToken)
  // const enchantedBal = useCurrencyBalance(account, enchantedToken)

  const parsedStakeValue = tryParseAmount(stakeValue, soulToken)

  // CONTRACTS //
  
  // staking  
  const { autoStakeInfo } = useAutoStakeInfo()
  const { userAutoStakeInfo} = useUserAutoStakeInfo(account)

  // STAKING DATA //
  const pricePerShare = Number(autoStakeInfo.pricePerShare)
  const userBalance = Number(userAutoStakeInfo.userBalance)

  const stakedBal = Number(userAutoStakeInfo.stakedBalance)
  // const stakedValue = pricePerShare * stakedBal
  const stakedValue = soulPrice * stakedBal
  const userDelta = stakedBal - userBalance
  const totalDeduction = stakedBal + userDelta
  const earnedAmount = (pricePerShare * stakedBal) - totalDeduction

    /**
    * Gets the earned amount of the user for each pool
    */
      //           // get SOUL earned
      //           const result = await AutoStakeContract?.getPricePerFullShare()
      //           const price = result / 1e18
      //           const staked = await AutoStakeContract?.balanceOf(account)
      //           const stakedBal = staked / 1e18

      //           const shareValue = price * stakedBal
      //           const profit = shareValue - stakedBal
      //           // console.log('profit:%s', profit)

      //           setEarnedAmount(Number(profit))
      //           // console.log('profit:%s', Number(profit))

      //           return [profit]
      //       } catch (err) {
      //           console.warn(err)
      //       }
        // }
    // }

  // const performanceFee = autoStakeInfo.performanceFee
  // const available = autoStakeInfo.available
  // const callFeeRate = autoStakeInfo.callFee
  const bounty = autoStakeInfo.bounty
    
  // AUTOSTAKE DATA //
  const tvl = Number(autoStakeInfo.tvl)
  const apy = Number(autoStakeInfo.apy)  
  // const stakingAPY = (Math.pow(1 + 3, 365 * 3) - 1) * 100

    
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
    remainingMinutes == 0 ? 0 : withdrawFeeRate * stakedBal // * Number(withdrawValue)

  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    AUTO_STAKE_ADDRESS[250]
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
            const tx = await AutoStakeContract?.withdraw(parsedWithdrawValue?.quotient.toString())
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
      <div className="mt-2 mb-2">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={`/swap?inputCurrency=&outputCurrency=${SOUL_ADDRESS[chainId | 250]}`}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>Market Price: ${Number(soulPrice).toFixed(2)}</span>
            </a>
          </NavLink>
        </Button>
      </div>
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
          <NavLink href={'/seance'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
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
                  {i18n._(t`Ritual Period`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  {feeHours} hours
                </Typography>
              </div>
              
              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-dark-600 border-1 hover:border-purple w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center text-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(apy, false, true)}% APY</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-purple w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(stakedBal, false, true)} SOUL ({ formatNumber(stakedValue, true, true) })
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Pending Rewards`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(earnedAmount, false, true)} SOUL
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
                  primaryColor="#821FFF"
                  color="white"
                  margin=".5rem 0 .5rem 0"
                  onClick={() =>
                      handleDeposit(stakeValue)}
                  >
                  DEPOSIT
              </SubmitButton>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel className={'outline-none'}>
             {/* <VaultInputPanel
                value={withdrawValue}
                showLogo={true}
                showMaxButton={false}
                onUserInput={(value) => setWithdrawValue(value)}
                onMax={ () => setWithdrawValue(soulBal.toExact()) }
                currency={soulToken}
                disableCurrencySelect={true}
                locked={!account}
                id="vault-currency-output"
              /> */}

<div className="h-px my-2 bg-dark-1000" />

<div className="flex justify-between">
    <Typography className="text-white" fontFamily={'medium'}>
      {i18n._(t`Until Salvation`)}
    </Typography>
    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
    { (formatNumber(remainingMinutes, false, true)) } mins
    </Typography>
</div>             

<div className="h-px my-2 bg-dark-1000" />

                <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-dark-600 border-1 hover:border-purple w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center text-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(apy, false, true)}% APY</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-purple w-full space-y-1">
              <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  {formatNumber(stakedBal, false, true)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Sacrifice`)} ({withdrawFeeRate.toFixed(2)}%)
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {feeAmount.toFixed(2)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Salvation`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    { unlockTime }
                  </Typography>
                </div>
              </div>
            <div className="mt-6 flex items-center gap-2">                  
              <SubmitButton
                  height="2rem"
                  primaryColor="#821FFF"
                  color="white"
                  margin=".5rem 0 .5rem 0"
                  onClick={() =>
                      // handleWithdraw(withdrawValue)
                      handleWithdrawAll()
                  }
              >
                  WITHDRAW ALL
              </SubmitButton>
              </div>
            </Tab.Panel>
          </Tab.Group>
        </div>
      </DoubleGlowShadowV2>
    </Container>
  )
}
