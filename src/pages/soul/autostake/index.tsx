import React, { useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { Tab } from '@headlessui/react'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { Button } from 'components/Button'
import VaultInputPanel from 'components/VaultInputPanel'
import { ApprovalState, useApproveCallback, useAutoStakeContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { AUTO_STAKE_ADDRESS, max, Token, SOUL, ChainId } from 'sdk'
import { SOUL_ADDRESS } from 'constants/addresses'
import { tryParseAmount, formatNumber, classNames, featureEnabled } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import Dots from 'components/Dots'
import { useActiveWeb3React } from 'services/web3/hooks'
import NavLink from 'components/NavLink'
import { useAutoStakeInfo, useTokenInfo, useUserAutoStakeInfo } from 'hooks/useAPI'
import { SubmitButton } from 'features/autostake/Styles'
import Image from 'next/image'
import STAKE_BANNER from 'assets/branding/stake-banner.png'
import { Feature } from 'enums'

const AutoStake = () => {
  const [stakeValue, setStakeValue] = useState('0')
  const { account, chainId } = useActiveWeb3React()
  // const [withdrawValue, setWithdrawValue] = useState('0')
  const parsedDepositValue = tryParseAmount(stakeValue, SOUL[chainId ?? ChainId.FANTOM])
  // const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[chainId ?? ChainId.FANTOM])
  const soulPrice = Number(useTokenInfo(SOUL_ADDRESS[chainId ?? ChainId.FANTOM]).tokenInfo.price)
  const AutoStakeContract = useAutoStakeContract()

  const soulToken = new Token(chainId, getAddress(SOUL_ADDRESS[chainId ?? ChainId.FANTOM]), 18, 'SOUL')
  const soulBal = useCurrencyBalance(chainId, account, soulToken)
  // const enchantedBal = useCurrencyBalance(account, enchantedToken)

  const parsedStakeValue = tryParseAmount(stakeValue, soulToken)

  // CONTRACTS //

  // staking  
  const { autoStakeInfo } = useAutoStakeInfo()
  const { userAutoStakeInfo } = useUserAutoStakeInfo(account)

  // STAKING DATA //
  const pricePerShare = Number(autoStakeInfo.pricePerShare)
  const userBalance = Number(userAutoStakeInfo.userBalance)


  const stakedBal = Number(userAutoStakeInfo.stakedBalance)
  // const stakedValue = pricePerShare * stakedBal
  
  const userDelta = stakedBal - userBalance
  const totalDeduction = stakedBal + userDelta
  
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
  // const bounty = autoStakeInfo.bounty

  // AUTOSTAKE DATA //
  // const tvl = Number(autoStakeInfo.tvl)
  const apy = Number(autoStakeInfo.apy) * 3 // since re-invests every 8H
  // const stakingAPY = (Math.pow(1 + 3, 365 * 3) - 1) * 100


  // FEE-RELATED VALUES //
  const nowTime = new Date().getTime()
  const withdrawFeeRate = Number(autoStakeInfo.withdrawFee)
  const feeHours = Number(autoStakeInfo.withdrawFeeHours)
  const feeDays = feeHours / 24
  const feeDuration = Number(autoStakeInfo.withdrawFeePeriod) * 1_000
  const lastDepositTime = Number(userAutoStakeInfo.lastDepositedTime) * 1_000
  const feeExpiration = (lastDepositTime + feeDuration)
  const unlockTime = new Date(feeExpiration).toLocaleString()
  // const timeSinceDeposit = nowTime - lastDepositTime / 3_600_000
  // const feeSecondsRemaining = feeExpiration - nowTime
  const remainingSeconds = feeExpiration - Number(nowTime)
  // console.log('remainingSecs:%s', remainingSeconds)
  const remainingHours = max(remainingSeconds / 3_600_000, 0)
  const remainingMinutes = max(Number(remainingHours) * 60, 0)

  const feeAmount = remainingMinutes == 0 ? 0 : withdrawFeeRate * stakedBal / 100 // * Number(withdrawValue)

  // complete stake data (user)
  const earnedAmount = (pricePerShare * stakedBal) - totalDeduction
  const earnedAmountDisplay = feeAmount > 0 ? 0 : (pricePerShare * stakedBal) - totalDeduction
  const earnedValue = feeAmount > 0 ? 0 : soulPrice * earnedAmountDisplay

  const stakedAmount = stakedBal - earnedAmountDisplay
  const stakedValue = soulPrice * stakedAmount

  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    AUTO_STAKE_ADDRESS[chainId ?? ChainId.FANTOM]
  )

  const stakeError =
    !account ? 'Connect Wallet'
      : !parsedStakeValue ? 'Enter Amount'
        : soulBal?.lessThan(parsedStakeValue)
          ? 'Insufficient Balance'
          : undefined

  const isStakeValid = !stakeError

  // HANDLE HARVEST //
  // const handleHarvest = async () => {
  //   try {
  //     let tx
  //     tx = await AutoStakeContract?.harvest()
  //     await tx?.wait()
  //   } catch (e) {
  //     // alert(e.message)
  //     console.log(e)
  //   }
  // }

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
  // const handleWithdraw = async (amount) => {
  //   try {
  //     const tx = await AutoStakeContract?.withdraw(parsedWithdrawValue?.quotient.toString())
  //     await tx?.wait()
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

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
    <Container id="autostake-page" className={`p-0.5 mt-6 sm:mt-12 rounded-2xl bg-dark-900`}>
         <Head>
          <title>Vault | SoulSwap</title>
          <meta name="description" content="Stake SOUL in our autocompounding vault and earn more SOUL over time." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="Stake SOUL in our autocompounding vault and earn more SOUL over time." />
        </Head>

      <div className={`flex m-6 border-4 p-4 border-dark-800 rounded-2xl`} >
        <Image src={STAKE_BANNER}
          height={96}
          width={480}
          alt={'autostake banner'}
        />
      </div>
      <div className={`flex justify-center m-1 p-1`}>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
            </div>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Farms</span>
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Bonds</span>
            </div>
          </NavLink>
        </Button>
      </div>
      <DoubleGlowShadowV2>
        <div className="p-6 space-y-6 bg-dark-900 rounded z-1 relative">
          <Tab.Group>
            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
              <div className="grid grid-cols-2 w-[95%] p-2px border rounded-lg border-dark-800 bg-dark-800">
                <Tab
                  className={({ selected }) =>
                    `${selected ? 'border-2 border-accent rounded-lg p-2 bg-purple border-purple text-white' : 'bg-dark-800 text-white'
                    } flex items-center justify-center rounded-lg px-3 py-1.5 semi-bold font-semibold hover:border-2 hover:border-purple`
                  }
                >
                  {`Deposit`}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `${selected ? 'border-2 border-accent rounded-lg p-2 bg-purple border-purple text-white' : 'bg-dark-800 text-white'
                    } flex items-center justify-center rounded-lg px-3 py-1.5 semi-bold font-semibold hover:border-2 hover:border-purple`
                  }
                >
                  {`Withdraw`}
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

              <div className={`flex justify-between m-3`}>
                <Typography className={`text-white`} fontFamily={'medium'}>
                  {`Ritual (Fee) Duration`}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  {feeDays} days
                </Typography>
              </div>
              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex flex-col bg-dark-1000 p-3 border border-dark-700 hover:border-purple w-full space-y-1 rounded-2xl">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Staked`}
                  </Typography>
                  <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                    {formatNumber(stakedAmount, false, true)} SOUL ({formatNumber(stakedValue, true, true)})
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Rewards`}
                  </Typography>
                  <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                    {formatNumber(earnedAmountDisplay, false, true)} SOUL ({formatNumber(earnedValue, true, true)})
                  </Typography>
                </div>

                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Compound Bounty`}
                  </Typography>
                  <Typography className="text-white" weight={400} fontFamily={'semi-bold'}>
                    {formatNumber(bounty, false, true)} SOUL
                  </Typography>
                </div> */}
              </div>
              <div className="flex flex-col bg-dark-1000 mb-2 mt-4 lp-3 border border-green hover:border-purple w-full space-y-1 rounded-2xl">
                {/* <div
                className={`flex justify-center rounded-2xl p-2 mb-4`}
              > */}
                <Typography
                  className={'flex text-md text-center justify-center text-green mt-2 mb-2'}>
                  {`Vault auto-magically reinvests (up to 3x daily).`}
                </Typography>
                {/* </div> */}
                <div className={`border border-green`} />
                <div className={`text-white`}>
                  <div className={`block mt-1 mb-0.5 text-md md:text-xl text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300`}>
                    <span> {formatNumber(apy, false, true)}% APY</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                {isStakeValid &&
                  (stakeApprovalState === ApprovalState.NOT_APPROVED ||
                    stakeApprovalState === ApprovalState.PENDING) && (
                    <SubmitButton
                      height="2rem"
                      color="white"
                      primaryColor="#821FFF"
                      onClick={stakeApprove}
                      disabled={stakeApprovalState !== ApprovalState.NOT_APPROVED}
                      margin=".5rem 0 .5rem 0"
                    // style={{ width: '100%' }}
                    >
                      {stakeApprovalState === ApprovalState.PENDING ? (
                        <Dots>{`Approving`}</Dots>
                      ) : (
                        `APPROVE`
                      )}
                    </SubmitButton>
                  )}
                <SubmitButton
                  height="2rem"
                  primaryColor="#821FFF"
                  color="white"
                  margin=".5rem 0 .5rem 0"
                  disabled={!isStakeValid}
                  onClick={() =>
                    handleDeposit(stakeValue)}
                >
                  {isStakeValid ? `Submit Deposit` : stakeError}
                </SubmitButton>
                {/* <SubmitButton
                  height="2rem"
                  primaryColor="#821FFF"
                  color="white"
                  margin=".5rem 0 .5rem 0"
                  onClick={() =>
                    handleHarvest()}
                    >
                    COMPOUND
                  </SubmitButton> */}
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
                  {`Until Salvation`}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  {Number(remainingHours) > 0 ? remainingHours.toFixed(0) : 0} hours
                </Typography>
              </div>

              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-dark-600 hover:border-purple w-full space-y-1 rounded-2xl">
                <div className="text-white">
                  <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                    <span> {formatNumber(apy, false, true)}% APY</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-dark-700 hover:border-purple w-full space-y-1 rounded-2xl">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Amount`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(stakedBal, false, true)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {/* {`Sacrifice`} ({withdrawFeeRate.toFixed(2)}%) */}
                    {`Sacrifice`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(feeAmount, false, true)} SOUL
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Salvation`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {unlockTime}
                  </Typography>
                </div>
              </div>
              {stakedBal > 0 &&
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
              }
            </Tab.Panel>
          </Tab.Group>
        </div>
      </DoubleGlowShadowV2>
    </Container>
  )
}

export default AutoStake
