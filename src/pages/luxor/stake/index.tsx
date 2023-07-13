import React, { useEffect, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { Tab } from '@headlessui/react'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { Button, ButtonError } from 'components/Button'
import StableInputPanel from 'components/StableInputPanel'
import { ApprovalState, useApproveCallback, useLuxorStakeHelperContract, useLuxorStakingContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { LUM_ADDRESS, LUXOR_STAKING_ADDRESS, LUXOR_STAKING_HELPER_ADDRESS, max, Token } from 'sdk'
import { LUX_ADDRESS } from 'constants/addresses'
import { tryParseAmount, formatNumber, classNames } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useStakeContract, useWarmupValue } from 'features/luxor/stake/hooks'
import { useActiveWeb3React } from 'services/web3/hooks'
import NavLink from 'components/NavLink'
import { useTokenContract } from 'hooks/useTokenContract'
import { useLuxorPrice } from 'hooks/getPrices'
import { useLuxorInfo, useLuxorUserInfo } from 'hooks/useAPI'
import useSendTransaction from 'hooks/useSendTransaction'
import { isMobile } from 'react-device-detect'
import { LuxorBanner } from 'components/Banner'

export default function Stake() {
  const addTransaction = useTransactionAdder()
  const [stakeValue, setStakeValue] = useState('0')
  const [redeemValue, setRedeemValue] = useState('0')
  // const [epoch, setEpoch] = useState('0')
  const [warmupValue, setWarmupValue] = useState(0)
  const [warmupExpiry, setWarmupExpiry] = useState('0')
  // const [nextRebase, setNextRebase] = useState(0)
  const luxorPrice = useLuxorPrice()
  const { account, chainId } = useActiveWeb3React()
  const { stake, unstake, claim, forfeit } = useStakeContract()
  // const warmupValue = useWarmupValue()
  // console.log('warmupAmount:%s', warmupAmount)

  // const daiToken = new Token(250, getAddress(DAI_ADDRESS[250]), 18, 'DAI')
  const luxorToken = new Token(250, getAddress(LUX_ADDRESS[250]), 9, 'LUX')
  const lumensToken = new Token(250, getAddress(LUM_ADDRESS[250]), 9, 'LUM')
  // const stakeClaimAmount = useStakeClaimAmount(luxorToken)
  // const redeemClaimAmount = useRedeemClaimAmount(luxorToken)

  const lumensBalance = useCurrencyBalance(chainId, account, lumensToken)
  const luxorBalance = useCurrencyBalance(chainId, account, luxorToken)
  // const LuxorWarmupAddress = LUXOR_WARMUP_ADDRESS[250]
  const [lumBalance, setLumBalance] = useState(0)
  const [luxBalance, setLuxBalance] = useState(0)

  const parsedStakeValue = tryParseAmount(stakeValue, luxorToken)
  const parsedRedeemValue = tryParseAmount(redeemValue, luxorToken)
  const { luxorInfo } = useLuxorInfo()
  const epoch = Number(luxorInfo.epoch)
  const hoursPerEpoch = 8
  const warmupEpochs = Number(luxorInfo.warmup)
  const warmupHours = warmupEpochs * hoursPerEpoch
  // console.log('epoch:%s', epoch)
  // CONTRACTS //
  // tokens
  const LumensContract = useTokenContract(LUM_ADDRESS[250])
  const LuxorContract = useTokenContract(LUX_ADDRESS[250])
  // staking
  const StakingHelperContract = useLuxorStakeHelperContract()
  // const StakingContract = useLuxorStakingContract()
  const { luxorUserInfo } = useLuxorUserInfo(account)
  const circulatingLumens = useLuxorInfo().luxorInfo.circulatingLumens
  const nextStakedReward = Number(luxorUserInfo.nextStakedReward)
  const nextWarmupReward = Number(luxorUserInfo.nextWarmupReward)
  const nextReward = Number(luxorUserInfo.nextReward)
  const dailyReward = nextReward * 3
  const dailyRewardUsd = dailyReward * Number(luxorPrice)
  // const epoch = await stakingContract.epoch();
  const stakingReward = luxorUserInfo.distribute;
  const stakingRebase = Number(stakingReward) / Number(circulatingLumens);
  // const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
  const stakingAPY = (Math.pow(1 + stakingRebase, 365 * 3) - 1) * 100

  const nextRebase = Number(luxorInfo.nextRebase) * 1000 // ms (x1000)
  // console.log('nextRebase:%s', nextRebase)
  const nowTime = new Date().getTime()
  // console.log('nowTime:%s', nowTime)
  const remainingSeconds = nextRebase - Number(nowTime)
  // console.log('remainingSecs:%s', remainingSeconds)
  const remainingHours = remainingSeconds / 3_600_000
  const remainingMinutes
    = max(remainingHours * 60, 0)

  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    LUXOR_STAKING_ADDRESS[250]
  )
  const [redeemApprovalState, redeemApprove] = useApproveCallback(
    parsedRedeemValue,
    // LUXOR_STAKING_ADDRESS[250]
    LUXOR_STAKING_HELPER_ADDRESS[chainId | 250]
  )

  const stakeError = !parsedStakeValue
    ? 'Enter Amount'
    : luxorBalance?.lessThan(parsedStakeValue)
      ? 'Insufficient Balance'
      : undefined

  const isStakeValid = !stakeError

  const redeemError = !parsedRedeemValue
    ? 'Enter Amount'
    : lumensBalance?.lessThan(parsedRedeemValue)
      ? 'Insufficient Balance'
      : undefined
  const isRedeemValid = !redeemError

  const {
    sendTx: handleApproveToken,
    isPending: isApprovePending,
    isCompleted: isApproveCompleted,
  } = useSendTransaction(() =>
    LumensContract.approve(LUXOR_STAKING_ADDRESS[chainId | 250], (1_000_000 * 1e9).toString())
  );

  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    fetchBals()
    fetchWarmupInfo()
  }, [])

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        fetchBals()
        fetchWarmupInfo()
      }, 10_000)
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    } catch (err) {
      console.warn(err)
    }
  })

  const fetchBals = async () => {
    try {
      const lumBal = await LumensContract.balanceOf(account)
      const lumBalance = lumBal / 1e9
      console.log('lum:%s', Number(lumBalance))
      setLumBalance(lumBalance)

      const luxBal = await LuxorContract.balanceOf(account)
      const luxBalance = luxBal / 1e9
      console.log('lux:%s', Number(luxBalance))
      setLuxBalance(luxBalance)
      return [lumBalance, luxBalance]
    } catch (err) {
      console.warn(err)
    }
  }

  const fetchWarmupInfo = async () => {
    try {
      // const epoch = await StakingHelperContract.epoch()
      // const currentEpoch = epoch.toString()
      // console.log('warmupValue:%s', currentEpoch)
      // setEpoch(currentEpoch)

      const warmupBal = await StakingHelperContract.warmupValue(account)
      const warmupValue = warmupBal / 1e9
      // console.log('warmupValue:%s', Number(warmupValue))
      setWarmupValue(warmupValue)

      const expiry = await StakingHelperContract.warmupExpiry(account)
      const warmupExpiry = expiry.toString()
      // console.log('warmupExpiry:%s', warmupExpiry)
      setWarmupExpiry(warmupExpiry)

      return [warmupValue, warmupExpiry]
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
      <Head>
        <title>Staking | Luxor</title>
        <meta key="description" name="description" />
      </Head>
      <LuxorBanner chainId={chainId} />
      <div className="flex ml-2 mr-2 mb-4 gap-1 mt-4 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/dashboard'}>
            <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/bonds'}>
            <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Wrap </span>
            </a>
          </NavLink>
        </Button>
      </div>
      <LuxorGlowShadow>
        <div className="p-6 space-y-6 bg-dark-900 rounded z-1 relative">
          <Tab.Group>
            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
              <div className="grid grid-cols-2 w-[95%] rounded-md p-2px gap-1.5 bg-dark-900">
                <Tab
                  className={({ selected }) =>
                    `${selected ? 'border-b-2 border-accent rounded-2xl p-2 text-lg border-yellow text-white' : 'bg-dark-900 text-lg text-white'
                    } flex items-center justify-center px-3 py-1.5 rounded-2xl semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                  }
                >
                  {`Deposit`}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `${selected ? 'border-b-2 border-accent p-2 rounded-2xl text-lg border-yellow text-white' : 'bg-dark-900 text-lg text-white'
                    } flex items-center justify-center px-3 py-1.5 rounded-2xl semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                  }
                >
                  {`Withdraw`}
                </Tab>
              </div>
            </Tab.List>

            <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-yellow w-full space-y-1">
              <div className="text-white">
                <div className="block text-lg font-bold md:text-xl text-white text-center font-bold p-1 -m-4 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                  <span> {formatNumber(stakingAPY)}% APY</span>
                </div>
              </div>
            </div>

            {/* <div className={classNames(dailyReward > 0 && "flex flex-col bg-dark-1000 mb-2 p-3 border border-yellow border-1 hover:border-yellow w-full space-y-1")}>
        <div className="text-white">
          <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> DAILY YIELD: {formatNumber(dailyReward)} LUM ({formatNumber(dailyReward * luxorPrice)})</span>
            </div>
          </div>
        </div>   */}

            <Tab.Panel className={'outline-none'}>

              <StableInputPanel
                value={stakeValue}
                showLogo={false}
                showMaxButton={true}
                onUserInput={(value) => setStakeValue(value)}
                onMax={() =>
                  setStakeValue(luxorBalance.toExact())
                }
                currency={luxorToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-input"
              />

              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex justify-between">
                <Typography className="text-white text-lg" fontFamily={'medium'}>
                  {`Epoch Remaining`}
                </Typography>
                <Typography className="text-yellow text-lg" weight={600} fontFamily={'semi-bold'}>
                  {(remainingMinutes).toFixed()} mins
                </Typography>
              </div>

              <div className="h-px my-2 bg-dark-1000" />

              {/* <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-yellow w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(stakingAPY)}% APY</span>
                    </div>
                </div>
              </div> */}
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Luxor Balance`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {luxBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Deposited Amount`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {lumBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Warmup Period`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {warmupHours} hours
                  </Typography>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {isStakeValid &&
                  (stakeApprovalState === ApprovalState.NOT_APPROVED ||
                    stakeApprovalState === ApprovalState.PENDING) ? (
                  <Button
                    type="filled"
                    color="yellow"
                    className="text-black"
                    onClick={stakeApprove}
                    disabled={stakeApprovalState !== ApprovalState.NOT_APPROVED}
                    style={{ width: '100%' }}
                  >
                    {stakeApprovalState === ApprovalState.PENDING ? (
                      <Dots>{`Approving`}</Dots>
                    ) : (
                      `Approve`
                    )}
                  </Button>
                ) :
                  // Number(stakeClaimAmount.toExact()) === 0 ? 
                  (
                    <ButtonError
                      type="filled"
                      color="yellow"
                      className="text-black text-lg font-bold"
                      onClick={async () => {
                        try {
                          const tx = await stake(BigNumber.from(parsedStakeValue.quotient.toString()))
                          addTransaction(tx, {
                            summary: `Stake LUX`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                      disabled={!isStakeValid || !account}
                      error={!isStakeValid && !!parsedStakeValue}
                      style={{ width: '100%' }}
                    >
                      {stakeError || `Stake Luxor`}
                    </ButtonError>
                  )}
              </div>

              <div className={'mt-6 flex items-center gap-2'}>
                <NavLink
                  href="/swap?inputCurrency=&outputCurrency=0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b"
                >
                  <Button
                    type="filled"
                    color="gold"
                    className="text-black font-bold"
                  >
                    <a className="block"> Acquire Luxor Money </a>
                  </Button>
                </NavLink>
              </div>

            </Tab.Panel>

            <Tab.Panel className={'outline-none'}>
              <StableInputPanel
                value={redeemValue}
                showLogo={isMobile ? false : true}
                showMaxButton={true}
                onUserInput={(value) => setRedeemValue(value)}
                onMax={() => setRedeemValue(lumensBalance.toExact())}
                currency={lumensToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-2 bg-dark-1000" />

              <div className={classNames("flex justify-between", "mb-4")}>
                <Typography className="text-white text-lg" fontFamily={'medium'}>
                  {`Epoch Remaining`}
                </Typography>
                <Typography className="text-yellow text-lg" weight={600} fontFamily={'semi-bold'}>
                  {(remainingMinutes).toFixed()} mins
                </Typography>
              </div>
              {/* <div className="flex justify-between">
    <Typography className="text-white" fontFamily={'medium'}>
      {`Daily Reward`}
    </Typography>
    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
    { dailyReward.toFixed(2) } LUX 
    </Typography>
</div>            */}


              <div className="h-px my-2 bg-dark-1000" />
              {/* <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-yellow w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(stakingAPY)}% APY</span>
                    </div>
                </div>
              </div> */}

              {lumBalance > 0 &&
                <div className={classNames(lumBalance > 0 && "flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1")}>
                  {/* <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1"> */}
                  <div className={classNames(lumBalance > 0 ? "flex text-xl mb-2 font-bold text-yellow" : 'hidden')}> Deposit Details </div>
                  <div className={classNames(lumBalance > 0 ? 'flex justify-between' : 'hidden')}>
                    <Typography className="text-white" fontFamily={'medium'}>
                      {`Staked Balance`}
                    </Typography>
                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber(lumBalance, false, true)} LUX
                    </Typography>
                  </div>
                  <div className={classNames(lumBalance > 0 && 'flex justify-between')}>
                    <Typography className="text-white" fontFamily={'medium'}>
                      {`Next Rebase`}
                    </Typography>
                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber(nextStakedReward, false, true)} LUM
                    </Typography>
                  </div>

                  {/*               
              <div className={classNames(lumBalance > 0 && warmupValue > 0 ? 'flex justify-between' : 'hidden')}>
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Next Rebase`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    { formatNumber(nextReward, false, true) } LUM
                  </Typography>
                </div> */}
                  {/* </div> */}

                  {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                  {`Current Epoch`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  {epoch}
                  </Typography>
                </div> */}

                  {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Epoch Duration`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    { hoursPerEpoch } hours
                  </Typography>
                </div> */}
                  {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Warmup Balance`}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    { warmupAmount }
                  </Typography>
                </div> */}
                </div>
              }
              {warmupValue > 0 &&
                <div className={classNames(warmupValue > 0 && "flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1")}>
                  <div className={classNames(warmupValue > 0 && "flex text-xl mb-2 font-bold text-gold")}> Warmup Details </div>

                  <div className={classNames(warmupValue > 0 && "flex justify-between")}>
                    <Typography className="text-white" fontFamily={'medium'}>
                      {`Locked Balance`}
                    </Typography>
                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                      {warmupValue.toFixed(2)} LUM
                    </Typography>
                  </div>
                  <div className={classNames(warmupValue > 0 ? 'flex justify-between' : 'hidden')}>
                    <Typography className="text-white" fontFamily={'medium'}>
                      {`Next Rebase`}
                    </Typography>
                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber(nextWarmupReward, false, true)} LUM
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-3">
                    <Typography className="text-white" fontFamily={'medium'}>
                      {`Time Remaining`}
                    </Typography>
                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                      {
                        (Number(warmupExpiry) - Number(epoch)) * 8 < 0
                          ? 0 : (Number(warmupExpiry) - Number(epoch)) * 8
                          + ' hours'
                      }
                    </Typography>
                  </div>
                </div>
              }

              <div className="mt-6 flex items-center gap-2">
                <Button variant="outlined" color="yellow" onClick={handleApproveToken}
                  className="text-black text-md font-bold"
                >
                  {isApprovePending
                    ? "Approving"
                    : isApproveCompleted
                      ? "Approved"
                      : "Approve"}
                </Button>

                {Number(warmupExpiry) - Number(epoch) > 0 ? (
                  <><ButtonError
                    variant="filled"
                    color="yellow"
                    className="text-black text-md font-bold"
                    onClick={async () => {
                      try {
                        const tx = await unstake(BigNumber.from(parsedRedeemValue?.quotient.toString()))
                        addTransaction(tx, {
                          summary: `Withdraw LUX`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!isRedeemValid || !account}
                    error={!isRedeemValid && !!parsedRedeemValue}
                    style={{ width: '100%' }}
                  >
                    {redeemError || `Withdraw`}
                  </ButtonError>
                    <Button
                      variant="filled"
                      color="red"
                      className="text-white"
                      onClick={async () => {
                        try {
                          const tx = await forfeit()
                          addTransaction(tx, {
                            summary: `Forfeit LUX`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                      disabled={!account}
                      style={{ width: '100%' }}
                    >
                      {`Forfeit`}
                    </Button></>
                ) : Number(warmupExpiry) < Number(epoch) && Number(warmupValue) > 0 ? (
                  <><ButtonError
                    variant="filled"
                    color="yellow"
                    className="text-black text-md font-bold"
                    onClick={async () => {
                      try {
                        const tx = await unstake(BigNumber.from(parsedRedeemValue?.quotient.toString()))
                        addTransaction(tx, {
                          summary: `Withdraw LUX`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!isRedeemValid || !account}
                    error={!isRedeemValid && !!parsedRedeemValue}
                    style={{ width: '100%' }}
                  >
                    {redeemError || `Withdraw`}
                  </ButtonError>
                    <Button
                      variant="filled"
                      color="green"
                      className="text-black"
                      onClick={async () => {
                        try {
                          const tx = await claim()
                          addTransaction(tx, {
                            summary: `Claim LUX`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                      disabled={!account}
                      style={{ width: '100%' }}
                    >
                      {`Claim`}
                    </Button></>
                ) : (<ButtonError
                  variant="filled"
                  color="yellow"
                  className="text-black text-md font-bold"
                  onClick={async () => {
                    try {
                      const tx = await unstake(BigNumber.from(parsedRedeemValue?.quotient.toString()))
                      addTransaction(tx, {
                        summary: `Withdraw LUX`,
                      })
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                  disabled={!isRedeemValid || !account}
                  error={!isRedeemValid && !!parsedRedeemValue}
                  style={{ width: '100%' }}
                >
                  {redeemError || `Withdraw`}
                </ButtonError>
                )}
              </div>
            </Tab.Panel>
          </Tab.Group>
        </div>
      </LuxorGlowShadow>
    </Container>
  )
}
