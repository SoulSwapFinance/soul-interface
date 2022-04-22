import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ArrowDownIcon } from '@heroicons/react/solid'
import Image from 'components/Image'
// import { Popover, Tab, Transition } from '@headlessui/react'
// import { useSwapState } from 'state/swap/hooks'
// import Alert from 'components/Alert'
// import { useSingleCallResult } from 'state/multicall/hooks'
// import useStablecoin from 'hooks/useStablecoin'
import { Tab } from '@headlessui/react'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { Button, ButtonError } from 'components/Button'
import StableInputPanel from 'components/StableInputPanel'
// import AssetInput from 'components/AssetInput'
// import { AutoColumn } from 'components/Column'
// import QuestionHelper from 'components/QuestionHelper'
import { ApprovalState, useApproveCallback, useLuxorStakeHelperContract, useLuxorStakingContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { ChainId, LUM_ADDRESS, LUXOR_STAKING_ADDRESS, LUXOR_STAKING_HELPER_ADDRESS, max, Token } from 'sdk'
import { LUXOR_WARMUP_ADDRESS, LUX_ADDRESS } from 'constants/addresses'
import { tryParseAmount, formatCurrencyAmount, formatNumberScale, formatPercent, formatNumber } from 'functions'
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
import Calculator from 'components/Calculator'

export default function Stake() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  const [stakeValue, setStakeValue] = useState('0')
  const [redeemValue, setRedeemValue] = useState('0')
  // const [epoch, setEpoch] = useState('0')
  const [warmupValue, setWarmupValue] = useState(0)
  const [warmupExpiry, setWarmupExpiry] = useState('0')
  // const [warmupPeriod, setWarmupPeriod] = useState(0)
  // const [nextRebase, setNextRebase] = useState(0)
  const luxorPrice = useLuxorPrice()
  const { account, chainId } = useActiveWeb3React()
  const { stake, unstake, claim, forfeit } = useStakeContract()
  // const warmupValue = useWarmupValue()
  // console.log('warmupAmount:%s', warmupAmount)

  // if (chainId && chainId === ChainId.ETHEREUM)
  //   // DELETE
  // window.location.href = '/swap'

  // const daiToken = new Token(chainId, getAddress(DAI_ADDRESS[chainId]), 18, 'DAI')
  const luxorToken = new Token(chainId, getAddress(LUX_ADDRESS[chainId]), 9, 'LUX')
  const lumensToken = new Token(chainId, getAddress(LUM_ADDRESS[chainId]), 9, 'LUM')
  // const stakeClaimAmount = useStakeClaimAmount(luxorToken)
  // const redeemClaimAmount = useRedeemClaimAmount(luxorToken)

  const lumensBalance = useCurrencyBalance(account, lumensToken)
  const luxorBalance = useCurrencyBalance(account, luxorToken)
  // const LuxorWarmupAddress = LUXOR_WARMUP_ADDRESS[250]
  const [lumBalance, setLumBalance] = useState(0)
  const [luxBalance, setLuxBalance] = useState(0)

  const parsedStakeValue = tryParseAmount(stakeValue, luxorToken)
  const parsedRedeemValue = tryParseAmount(redeemValue, luxorToken)
  const { luxorInfo } = useLuxorInfo()
  const epoch = Number(luxorInfo.epoch)
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
  // console.log('remainingMinutes:%s', remainingMinutes)

  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    LUXOR_STAKING_ADDRESS[chainId]
  )
  const [redeemApprovalState, redeemApprove] = useApproveCallback(
    parsedRedeemValue,
    LUXOR_STAKING_ADDRESS[chainId]
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
      }, 3000)
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
    <Container id="staking-page" className="py-4 md:py-8 lg:py-12">
      <Head>
        <title>Staking | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className="mt-2 mb-2">
        <Button variant="filled" color="yellow" size="lg">
            <div className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>Market Price: ${Number(luxorPrice).toFixed(2)}</span>
            </div>
        </Button>
      </div>
      <LuxorGlowShadow>
        <div className="p-6 space-y-6 bg-dark-900 rounded z-1 relative">
          <Tab.Group>
            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
            <div className="grid grid-cols-2 w-[95%] rounded-md p-2px bg-dark-900">
            <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-yellow text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                }
              >
                {i18n._(t`Deposit`)}
              </Tab>
              <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-yellow text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                }
              >
                {i18n._(t`Withdraw`)}
              </Tab>
          </div>
            </Tab.List>
            
            <Tab.Panel className={'outline-none'}>
              
              <StableInputPanel
                value={stakeValue}
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
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Remaining`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  { (remainingMinutes).toFixed() } mins
                  </Typography>
              </div>             

              <div className="h-px my-2 bg-dark-1000" />

              <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-yellow w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center text-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(stakingAPY)}% APY</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Balance`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {luxBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {lumBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Warmup`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  24 hours
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
                      <Dots>{i18n._(t`Approving`)}</Dots>
                    ) : (
                      i18n._(t`Approve`)
                    )}
                  </Button>
                ) : 
                // Number(stakeClaimAmount.toExact()) === 0 ? 
                (
                  <ButtonError
                  type="filled"
                  color="yellow"
                  className="text-black"
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
                    {stakeError || i18n._(t`Stake`)}
                  </ButtonError>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel className={'outline-none'}>
             <StableInputPanel
                value={redeemValue}
                showLogo={false}
                showMaxButton={true}
                onUserInput={(value) => setRedeemValue(value)}
                onMax={ () => setRedeemValue(lumensBalance.toExact()) }
                currency={lumensToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-output"
              />
           
           <div className="h-px my-2 bg-dark-1000" />

            <div className="flex justify-between">
                <Typography className="text-white" fontFamily={'medium'}>
                  {i18n._(t`Remaining`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                { (remainingMinutes).toFixed() } mins
                </Typography>
            </div>             

            <div className="h-px my-2 bg-dark-1000" />        
              
              <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-yellow w-full space-y-1">
                <div className="text-white">
                    <div className="block text-md md:text-xl text-white text-center text-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> {formatNumber(stakingAPY)}% APY</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
              <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {lumBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Warmup`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {warmupValue.toFixed(2)} LUX
                  </Typography>

                </div>
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                  {i18n._(t`Current Epoch`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                  {epoch}
                  </Typography>
                </div> */}
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Remaining`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {
                      (Number(warmupExpiry) - Number(epoch)) * 8 < 0
                      ? 0 : (Number(warmupExpiry) - Number(epoch)) * 8
                      + ' hours'
                    }
                  </Typography>
                </div>
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Epoch Duration`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {'8hrs'}
                  </Typography>
                </div> */}
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Warmup Balance`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {warmupAmount}
                  </Typography>
                </div> */}
              </div>
              <div className="mt-6 flex items-center gap-2">
                {isRedeemValid &&
                  (redeemApprovalState === ApprovalState.NOT_APPROVED ||
                    redeemApprovalState === ApprovalState.PENDING) ? (
                  <Button
                    variant="filled"
                    color="yellow"
                    className="text-black"
                    onClick={redeemApprove}
                    disabled={redeemApprovalState !== ApprovalState.NOT_APPROVED}
                    style={{ width: '100%' }}
                  >
                    {redeemApprovalState === ApprovalState.PENDING ? (
                      <Dots>{i18n._(t`Approving`)}</Dots>
                    ) : (
                      i18n._(t`Approve`)
                    )}
                  </Button>
                ) : Number(warmupExpiry) - Number(epoch) > 0 ? (
                  <><ButtonError
                      variant="filled"
                      color="yellow"
                      className="text-black"
                      onClick={async () => {
                        try {
                          const tx = await unstake(BigNumber.from(parsedRedeemValue?.quotient.toString()))
                          addTransaction(tx, {
                            summary: `Withdraw LUX`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      } }
                      disabled={!isRedeemValid || !account}
                      error={!isRedeemValid && !!parsedRedeemValue}
                      style={{ width: '100%' }}
                    >
                      {redeemError || i18n._(t`Withdraw`)}
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
                      } }
                      disabled={!account}
                      style={{ width: '100%' }}
                    >
                        {i18n._(t`Forfeit`)}
                      </Button></>
                ) : Number(warmupExpiry) < Number(epoch) && Number(warmupValue) > 0 ? (
                  <><ButtonError
                      variant="filled"
                      color="yellow"
                      className="text-black"
                      onClick={async () => {
                        try {
                          const tx = await unstake(BigNumber.from(parsedRedeemValue?.quotient.toString()))
                          addTransaction(tx, {
                            summary: `Withdraw LUX`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      } }
                      disabled={!isRedeemValid || !account}
                      error={!isRedeemValid && !!parsedRedeemValue}
                      style={{ width: '100%' }}
                    >
                      {redeemError || i18n._(t`Withdraw`)}
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
                      } }
                      disabled={!account}
                      style={{ width: '100%' }}
                    >
                        {i18n._(t`Claim`)}
                      </Button></>
                ) : ( <ButtonError
                    variant="filled"
                    color="yellow"
                    className="text-black"
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
                    {redeemError || i18n._(t`Withdraw`)}
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
