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
import { AutoColumn } from 'components/Column'
// import QuestionHelper from 'components/QuestionHelper'
import { ApprovalState, useApproveCallback, useLuxorStakeHelperContract, useLuxorStakingContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { ChainId, LUM_ADDRESS, LUXOR_STAKING_ADDRESS, LUXOR_STAKING_HELPER_ADDRESS, Token } from 'sdk'
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

export default function Stablecoin() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  const [stakeValue, setStakeValue] = useState('0')
  const [redeemValue, setRedeemValue] = useState('0')
  const [epoch, setEpoch] = useState('0')
  const [warmupValue, setWarmupValue] = useState(0)
  const [warmupExpiry, setWarmupExpiry] = useState('0')
  // const [warmupPeriod, setWarmupPeriod] = useState(0)
  // const [nextRebase, setNextRebase] = useState(0)
  const luxorPrice = useLuxorPrice()
  const { account, chainId } = useActiveWeb3React()
  const { stake, unstake, claim, forfeit } = useStakeContract()
  // const warmupValue = useWarmupValue()
  // console.log('warmupAmount:%s', warmupAmount)

  if (chainId && chainId === ChainId.ETHEREUM)
    // DELETE
  window.location.href = '/swap'

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
  
  // CONTRACTS //
  // tokens
  const LumensContract = useTokenContract(LUM_ADDRESS[250])
  const LuxorContract = useTokenContract(LUX_ADDRESS[250])
  // staking
  const StakingHelperContract = useLuxorStakeHelperContract()
  // const StakingContract = useLuxorStakingContract()

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
    : luxorBalance?.lessThan(parsedRedeemValue)
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
            const epoch = await StakingHelperContract.epoch()
            const currentEpoch = epoch.toString()
            console.log('warmupValue:%s', currentEpoch)
            setEpoch(currentEpoch)

            const warmupBal = await StakingHelperContract.warmupValue(account)
            const warmupValue = warmupBal / 1e9
            console.log('warmupValue:%s', Number(warmupValue))
            setWarmupValue(warmupValue)

            const expiry = await StakingHelperContract.warmupExpiry(account)
            const warmupExpiry = expiry.toString()
            console.log('warmupExpiry:%s', warmupExpiry)
            setWarmupExpiry(warmupExpiry)
 
          return [warmupValue, warmupExpiry]
        } catch (err) {
            console.warn(err)
        }
    }

  return (
    <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
      <Head>
        <title>Stablecoin | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className="mt-2 mb-2">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/swap?inputCurrency=&outputCurrency=0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>Market Price: ${Number(luxorPrice).toFixed(2)}</span>
            </a>
          </NavLink>
        </Button>
        </div>
      <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/dashboard'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Dashboard </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/sor'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stablecoin </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/bond'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bonds </span>
            </a>
          </NavLink>
        </Button>
      </div>
      {/* <Alert
        message={
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5 leading-5">
                <p>
                  <strong className="text-accent bold">How to Mint:&nbsp;</strong>
                </p>
                <p>1. Enter in the amount of DAI you would like to deposit and press MINT.</p>
                <p>2. Claim your SOR tokens.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5 leading-5">
                <p>
                  <strong className="text-accent bold">How to Redeem:&nbsp;</strong>
                </p>
                <p>1. Enter in the amount of SOR you would like to redeem and press Redeem.</p>
                <p>2. Claim your DAI tokens.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5">
                <strong className="text-accent bold">Note:&nbsp;</strong>
                Approval is only needed once.
              </div>
            </div>
          </div>
        }
        type="information"
      /> */}

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
              {/* <Button variant={'link'} color={'yellow'} className="absolute top-0 right-0 flex">
                <QuestionHelper
                  // title={i18n._(t`How it works`)}
                  // width={'small'}
                  text={
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col">
                        <p>
                            <strong className="text-accent bold">Stake:&nbsp;</strong>
                          </p>
                        <p>
                          <strong className="text-accent bold">1.</strong> Enter DAI to deposit.
                        </p>
                        <p>
                          <strong className="text-accent bold">2.</strong> Click Stake.
                        </p>
                        <p>
                          <strong className="text-accent bold">3.</strong> Claim your SOR tokens.
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-normal leading-5">
                          <strong className="text-accent bold">Note:&nbsp;</strong>
                          Approval is only needed once.
                        </div>
                      </div>
                      <div className="flex flex-col">
                          <div className="text-sm font-normal leading-5">
                            <strong className="text-accent bold">Note:&nbsp;</strong>
                            Approval is only needed once.
                          </div>
                        </div>
                    </div>
                  }
                />
              </Button> */}

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
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Luxor Balance`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {luxBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited Amount`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {lumBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Warmup Period`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    { 21 } Epochs
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
              {/* <Button variant={'link'} color={'yellow'} className="absolute top-0 right-0 flex">
                <QuestionHelper
                  text={
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col">
                        <p>
                            <strong className="text-accent bold">Redeem:&nbsp;</strong>
                          </p>
                        <p>
                          <strong className="text-accent bold">1.</strong> Enter SOR to redeem.
                        </p>
                        <p>
                          <strong className="text-accent bold">2.</strong> Enter SOR to redeem.
                        </p>
                        <p>
                          <strong className="text-accent bold">3.</strong> Claim your DAI.
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-normal leading-5">
                          <strong className="text-accent bold">Note:&nbsp;</strong>
                          Approval is only needed once.
                        </div>
                      </div>
                    </div>
                  }
                />
              </Button> */}

              <StableInputPanel
                value={redeemValue}
                showMaxButton={true}
                onUserInput={(value) => setRedeemValue(value)}
                onMax={ () => setRedeemValue(lumensBalance.toExact()) }
                currency={luxorToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-input"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
              <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Deposited Amount`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {lumBalance.toFixed(2)} LUX
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Warmup Balance`)}
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
                    {i18n._(t`Warmup Remaining`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {(Number(warmupExpiry) - Number(epoch)) * 8 + ' hours'}
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
                ) : (
                // Number(redeemClaimAmount.toExact()) === 0 ? 
                  <ButtonError
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
                )
                }
                {/* <Button
                  variant="filled"
                  color="yellow"
                  onClick={async () => {
                    try {
                      const tx = await claimDai()
                      addTransaction(tx, {
                        summary: `Claim LUX`,
                      })
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                  disabled={!account || Number(redeemClaimAmount.toExact()) === 0}
                  style={{ width: '100%' }}
                >
                  {i18n._(t`Claim`)}{' '}
                  {Number(redeemClaimAmount.toExact()) !== 0
                    ? formatNumber(
                      Number(redeemClaimAmount.toExact()) * pegPrice -
                      (Number(redeemClaimAmount.toExact()) * redeemPermille) / 1000,
                      false
                    )
                    : ''}
                </Button> */}

                {/* <Button variant="filled" color="yellow" className="flex-1 flex items-center gap-1 justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                    fill="#3CC13B"
                    />
                    </svg>
                    {i18n._(t`Redeemed`)}
                    </Button>
                    <Button variant="filled" color="yellow" disabled={true} className="flex-1">
                    {i18n._(t`Claim 100 DAI`)}
                    </Button> */}
              </div>
            </Tab.Panel>
          </Tab.Group>
        </div>
      </LuxorGlowShadow>
    </Container>
  )
}
