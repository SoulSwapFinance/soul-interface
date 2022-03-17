import React, { Fragment, useState } from 'react'
import Container from '../../components/Container'
import Head from 'next/head'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Image from '../../components/Image'
import { Popover, Tab, Transition } from '@headlessui/react'
import DoubleGlowShadow from 'components/DoubleGlowShadowV2'
import { Button, ButtonError } from '../../components/Button'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { useSwapState } from '../../state/swap/hooks'
import { AutoColumn } from '../../components/Column'
import QuestionHelper from '../../components/QuestionHelper'
import Alert from '../../components/Alert'
import { ApprovalState, useApproveCallback } from '../../hooks'
import { getAddress } from '@ethersproject/address'
import {
  ChainId,
  Token,
  USDC_ADDRESS,
  CurrencyAmount,
  JSBI,
} from 'sdk'
import { SOR_ADDRESS,
    LUX_SOR_ADDRESS } from 'constants/addresses'
import useStableStablecoin from 'hooks/useStablecoin'
import { tryParseAmount, formatCurrencyAmount, formatNumberScale, formatPercent, formatNumber } from '../../functions'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import Dots from '../../components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useStakeClaimAmount, useRedeemClaimAmount, useSorContract } from 'features/stablecoin/hooks'
import { useActiveWeb3React } from 'services/web3/hooks'
import useStablecoin from 'hooks/useStablecoin'

export default function Stablecoin() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  const { independentField } = useSwapState()
  const [stakeValue, setStakeValue] = useState('')
  const [redeemValue, setRedeemValue] = useState('')

  const { account, chainId } = useActiveWeb3React()
  const { stake, redeem, claimSor, claimUsdc } = useSorContract()
  const { data } = useStablecoin()

  if (chainId && chainId === ChainId.ETHEREUM)
    //DELETE
    window.location.href = '/swap'

  const usdcToken = new Token(chainId, getAddress(USDC_ADDRESS[chainId]), 6, 'USDC')
  const sorToken = new Token(chainId, getAddress(SOR_ADDRESS[chainId]), 18, 'SOR')

  const stakeClaimAmount = useStakeClaimAmount(sorToken)
  const redeemClaimAmount = useRedeemClaimAmount(sorToken)

  const maxStakeAmount = data
    ? CurrencyAmount.fromRawAmount(usdcToken, data?.maxStakeAmount)
    : CurrencyAmount.fromRawAmount(usdcToken, JSBI.BigInt('0'))
  const maxRedeemAmount = data
    ? CurrencyAmount.fromRawAmount(sorToken, data?.maxRedeemAmount)
    : CurrencyAmount.fromRawAmount(sorToken, JSBI.BigInt('0'))

  const usdcBalance = useCurrencyBalance(account, usdcToken)
  const sorBalance = useCurrencyBalance(account, sorToken)

  const parsedStakeValue = tryParseAmount(stakeValue, usdcToken)
  const parsedRedeemValue = tryParseAmount(redeemValue, sorToken)

  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    LUX_SOR_ADDRESS[chainId]
  )
  const [redeemApprovalState, redeemApprove] = useApproveCallback(
    parsedRedeemValue,
    LUX_SOR_ADDRESS[chainId]
  )

  const stakeError = !parsedStakeValue
    ? 'Enter an amount'
    : usdcBalance?.lessThan(parsedStakeValue)
    ? 'Insufficient balance'
    : maxStakeAmount?.lessThan(parsedStakeValue)
    ? 'Amount exceeds maximum'
    : undefined
  const isStakeValid = !stakeError

  const redeemError = !parsedRedeemValue
    ? 'Enter an amount'
    : sorBalance?.lessThan(parsedRedeemValue)
    ? 'Insufficient balance'
    : maxRedeemAmount?.lessThan(parsedRedeemValue)
    ? 'Amount exceeding maximum'
    : undefined
  const isRedeemValid = !redeemError

  return (
    chainId &&
    chainId !== ChainId.ETHEREUM && ( //DELETE
      <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
        <Head>
          <title>Stablecoin | Soul</title>
          <meta key="description" name="description" />
        </Head>

        {/*
      <Alert
        message={
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5 leading-5">
                <p>
                  <strong className="text-accent bold">Mint (2 Steps):&nbsp;</strong>
                </p>
                <p>1. Enter in the amount of USDC you would like to deposit and press MINT.</p>
                <p>2. Claim your SOR tokens.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5 leading-5">
                <p>
                  <strong className="text-accent bold">Redeem (2 Steps):&nbsp;</strong>
                </p>
                <p>1. Enter in the amount of SOR you would like to redeem and press Redeem.</p>
                <p>2. Claim your USDC tokens.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5">
                <strong className="text-accent bold">Note:&nbsp;</strong>
                The &ldquo;Approve&ldquo; is only needed when minting for the first time.
              </div>
            </div>
          </div>
        }
        type="information"
      />
      */}

        <DoubleGlowShadow>
          <div className="p-6 space-y-6 rounded z-1 relative">
            <Tab.Group>
              <Tab.List className="flex items-center mb-3 space-x-2 p-3px text-black-70">
                <Tab
                  className={({ selected }) =>
                    `${
                      selected ? 'border-b-2 border-accent text-black dark:text-white-10' : ''
                    } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border-transparent border-1 hover:text-black dark:hover:text-white-10`
                  }
                >
                  {i18n._(t`Mint`)}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `${
                      selected ? 'border-b-2 border-accent text-black dark:text-white-10' : ''
                    } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border-transparent border-1 hover:text-black dark:hover:text-white-10`
                  }
                >
                  {i18n._(t`Redeem`)}
                </Tab>
              </Tab.List>
              <Tab.Panel className={'outline-none'}>
                <Button variant={'link'} color={'gray'} className="absolute top-6 right-4 flex">
                  <QuestionHelper
                    // title={i18n._(t`How it works`)}
                    // width={'small'}
                    text={
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-col">
                          <p>
                            <strong className="text-accent bold">Mint (2 Steps):&nbsp;</strong>
                          </p>
                          <p>
                            <strong className="text-accent bold">1.</strong> Enter in the amount of USDC you would
                            like to deposit and press MINT.
                          </p>
                          <p>
                            <strong className="text-accent bold">2.</strong> Claim your SOR tokens.
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-normal leading-5">
                            <strong className="text-accent bold">Note:&nbsp;</strong>
                            The &ldquo;Approve&ldquo; is only needed when minting for the first time.
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Button>

                <CurrencyInputPanel
                  label={i18n._(t`Input`)}
                  value={stakeValue}
                  showMaxButton={true}
                  onUserInput={(value) => setStakeValue(value)}
                  onMax={() =>
                    setStakeValue(
                      Number(usdcBalance.toExact()) > Number(maxStakeAmount.toExact())
                        ? maxStakeAmount.toExact()
                        : usdcBalance.toExact()
                    )
                  }
                  currency={usdcToken}
                  disableCurrencySelect={true}
                  locked={!account}
                  id="stablecoin-currency-input"
                />
                <AutoColumn justify="space-between" className="py-0 -my-2 sm:py-4">
                  <div className={'flex-start px-4 flex-wrap w-full flex'}>
                    <button className="rounded-full border-2 border-transparent swap-button-shadow dark:shadow-none">
                      <div className="rounded-full p-3px leading-0">
                        <div className="p-4">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.6255 11.0884C16.9501 10.7638 16.9501 10.2375 16.6255 9.91289C16.301 9.58848 15.7752 9.58824 15.4505 9.91236L11.3799 13.9756V4.66732C11.3799 4.20708 11.0068 3.83398 10.5465 3.83398C10.0863 3.83398 9.71322 4.20708 9.71322 4.66732V13.9756L5.65462 9.90978C5.32808 9.58266 4.79811 9.58242 4.47128 9.90925C4.14466 10.2359 4.14466 10.7654 4.47128 11.0921L9.94049 16.5613C10.2752 16.896 10.8179 16.896 11.1526 16.5613L16.6255 11.0884Z"
                              fill="#24FFCA"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </AutoColumn>
                <CurrencyInputPanel
                  label={i18n._(t`Output`)}
                  value={stakeValue}
                  showMaxButton={false}
                  currency={sorToken}
                  disableCurrencySelect={true}
                  locked={true}
                  id="stablecoin-currency-output"
                />
                <div className="h-px my-6 bg-black-80 dark:bg-black-30"></div>
                <div className="flex flex-col w-full space-y-1">
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Max mint per tx`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatCurrencyAmount(maxStakeAmount, 4)} USDC
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Rate`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      1 USDC = 1 SOR
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Minting fee`)} ({data?.mintPermille / 10}%)
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber((Number(stakeValue) * data?.mintPermille) / 1000, false)} USDC
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    {/* <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}> */}
                      {i18n._(t`You will receive`)}
                    {/* </Typography> */}
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber(Number(stakeValue) - (Number(stakeValue) * data?.mintPermille) / 1000, false)}{' '}
                      SOR
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Claimable amount`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatCurrencyAmount(stakeClaimAmount, 4)} SOR
                    </Typography>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  {isStakeValid &&
                  (stakeApprovalState === ApprovalState.NOT_APPROVED ||
                    stakeApprovalState === ApprovalState.PENDING) ? (
                    <Button
                      onClick={stakeApprove}
                      disabled={stakeApprovalState !== ApprovalState.NOT_APPROVED}
                      style={{ width: '50%' }}
                    >
                      {stakeApprovalState === ApprovalState.PENDING ? (
                        <Dots>{i18n._(t`Approving`)}</Dots>
                      ) : (
                        i18n._(t`Approve`)
                      )}
                    </Button>
                  ) : Number(stakeClaimAmount.toExact()) === 0 ? (
                    <ButtonError
                      onClick={async () => {
                        try {
                          const tx = await stake(BigNumber.from(parsedStakeValue.quotient.toString()))
                          addTransaction(tx, {
                            summary: `Mint SOR`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                      disabled={!isStakeValid || !account}
                      error={!isStakeValid && !!parsedStakeValue}
                      style={{ width: '50%' }}
                    >
                      {stakeError || i18n._(t`Mint`)}
                    </ButtonError>
                  ) : (
                    <Button variant="link" color="green" className="flex-1 flex items-center gap-1 justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                          fill="#3CC13B"
                        />
                      </svg>
                      {i18n._(t`Minted`)}
                    </Button>
                  )}
                  <Button
                    onClick={async () => {
                      try {
                        const tx = await claimSor()
                        addTransaction(tx, {
                          summary: `Claim SOR`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!account || Number(stakeClaimAmount.toExact()) === 0}
                    style={{ width: '50%' }}
                  >
                    {i18n._(t`Claim`)}{' '}
                    {Number(stakeClaimAmount.toExact()) !== 0 ? formatCurrencyAmount(stakeClaimAmount, 4) : ''}
                  </Button>

                  {/* <Button variant="filled" color="default" className="flex-1">
                    {i18n._(t`Mint`)}
                    </Button>
                    <Button variant="filled" color="default" disabled={true} className="flex-1">
                    {i18n._(t`Claim`)}
                    </Button> */}

                  {/* <Button variant="link" color="green" className="flex-1 flex items-center gap-1 justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                    fill="#3CC13B"
                    />
                    </svg>
                    {i18n._(t`Minted`)}
                    </Button>
                    <Button variant="filled" color="default" className="flex-1">
                    {i18n._(t`Claim 1200 SOR`)}
                    </Button> */}
                </div>
              </Tab.Panel>
              <Tab.Panel className={'outline-none'}>
                <Button variant={'link'} color={'gray'} className="absolute top-6 right-4 flex">
                  <QuestionHelper
                    // title={i18n._(t`How it works`)}
                    // width={'small'}
                    text={
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-col">
                          <p>
                            <strong className="text-accent bold">Redeem (2 Steps):&nbsp;</strong>
                          </p>
                          <p>
                            <strong className="text-accent bold">1.</strong> Enter in the amount of SOR you would
                            like to redeem and press Redeem.
                          </p>
                          <p>
                            <strong className="text-accent bold">2.</strong> Claim your USDC tokens.
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm font-normal leading-5">
                            <strong className="text-accent bold">Note:&nbsp;</strong>
                            The &ldquo;Approve&ldquo; is only needed when redeeming for the first time.
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Button>

                <CurrencyInputPanel
                  label={i18n._(t`Input`)}
                  value={redeemValue}
                  showMaxButton={true}
                  onUserInput={(value) => setRedeemValue(value)}
                  onMax={() =>
                    setRedeemValue(
                      Number(sorBalance.toExact()) > Number(maxRedeemAmount.toExact())
                        ? maxRedeemAmount.toExact()
                        : sorBalance.toExact()
                    )
                  }
                  currency={sorToken}
                  disableCurrencySelect={true}
                  locked={!account}
                  id="stablecoin-currency-input"
                />

                <AutoColumn justify="space-between" className="py-0 -my-2 sm:py-4">
                  <div className={'flex-start px-4 flex-wrap w-full flex'}>
                    <button
                      className="rounded-full border-2 border-transparent swap-button-shadow dark:shadow-none"
                      onClick={() => {}}
                    >
                      <div className="rounded-full p-3px leading-0">
                        <div className="p-4">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 21 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.6255 11.0884C16.9501 10.7638 16.9501 10.2375 16.6255 9.91289C16.301 9.58848 15.7752 9.58824 15.4505 9.91236L11.3799 13.9756V4.66732C11.3799 4.20708 11.0068 3.83398 10.5465 3.83398C10.0863 3.83398 9.71322 4.20708 9.71322 4.66732V13.9756L5.65462 9.90978C5.32808 9.58266 4.79811 9.58242 4.47128 9.90925C4.14466 10.2359 4.14466 10.7654 4.47128 11.0921L9.94049 16.5613C10.2752 16.896 10.8179 16.896 11.1526 16.5613L16.6255 11.0884Z"
                              fill="#24FFCA"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </AutoColumn>
                <CurrencyInputPanel
                  label={i18n._(t`Output`)}
                  value={redeemValue !== '' ? (Number(redeemValue) * data?.pegPrice).toString() : ''}
                  showMaxButton={false}
                  currency={usdcToken}
                  disableCurrencySelect={true}
                  locked={true}
                  id="stablecoin-currency-output"
                />
                <div className="h-px my-6 bg-black-80 dark:bg-black-30"></div>
                <div className="flex flex-col w-full space-y-1">
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Max redeem per tx`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatCurrencyAmount(maxRedeemAmount, 4)} SOR
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Rate`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      1 SOR = {formatNumber(data?.pegPrice)} USDC
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Redemption fee`)} ({data?.redeemPermille / 10}%)
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber((Number(redeemValue) * data?.redeemPermille) / 1000, false)} USDC
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`You will receive`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {formatNumber(
                        Number(redeemValue) * data?.pegPrice - (Number(redeemValue) * data?.redeemPermille) / 1000,
                        false
                      )}{' '}
                      USDC
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-black-60 dark:text-black-70" fontFamily={'medium'}>
                      {i18n._(t`Claimable amount`)}
                    </Typography>
                    <Typography className="text-black-30 dark:text-white-30" weight={600} fontFamily={'semi-bold'}>
                      {Number(redeemClaimAmount.toExact()) !== 0
                        ? formatNumber(
                            Number(redeemClaimAmount.toExact()) * data?.pegPrice -
                              (Number(redeemClaimAmount.toExact()) * data?.redeemPermille) / 1000,
                            false
                          ) + ' USDC'
                        : '0.00 USDC'}
                    </Typography>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  {isRedeemValid &&
                  (redeemApprovalState === ApprovalState.NOT_APPROVED ||
                    redeemApprovalState === ApprovalState.PENDING) ? (
                    <Button
                      onClick={redeemApprove}
                      disabled={redeemApprovalState !== ApprovalState.NOT_APPROVED}
                      style={{ width: '50%' }}
                    >
                      {redeemApprovalState === ApprovalState.PENDING ? (
                        <Dots>{i18n._(t`Approving`)}</Dots>
                      ) : (
                        i18n._(t`Approve`)
                      )}
                    </Button>
                  ) : Number(redeemClaimAmount.toExact()) === 0 ? (
                    <ButtonError
                      onClick={async () => {
                        try {
                          const tx = await redeem(BigNumber.from(parsedRedeemValue.quotient.toString()))
                          addTransaction(tx, {
                            summary: `Redeem SOR`,
                          })
                        } catch (error) {
                          console.error(error)
                        }
                      }}
                      disabled={!isRedeemValid || !account}
                      error={!isRedeemValid && !!parsedRedeemValue}
                      style={{ width: '50%' }}
                    >
                      {redeemError || i18n._(t`Redeem`)}
                    </ButtonError>
                  ) : (
                    <Button variant="link" color="green" className="flex-1 flex items-center gap-1 justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                          fill="#3CC13B"
                        />
                      </svg>
                      {i18n._(t`Redeemed`)}
                    </Button>
                  )}
                  <Button
                    onClick={async () => {
                      try {
                        const tx = await claimUsdc()
                        addTransaction(tx, {
                          summary: `Claim USDC`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!account || Number(redeemClaimAmount.toExact()) === 0}
                    style={{ width: '50%' }}
                  >
                    {i18n._(t`Claim`)}{' '}
                    {Number(redeemClaimAmount.toExact()) !== 0
                      ? formatNumber(
                          Number(redeemClaimAmount.toExact()) * data?.pegPrice -
                            (Number(redeemClaimAmount.toExact()) * data?.redeemPermille) / 1000,
                          false
                        )
                      : ''}
                  </Button>

                  {/* <Button variant="link" color="green" className="flex-1 flex items-center gap-1 justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                    fill="#3CC13B"
                    />
                    </svg>
                    {i18n._(t`Redeemed`)}
                    </Button>
                    <Button variant="filled" color="default" disabled={true} className="flex-1">
                    {i18n._(t`Claim 100 USDC`)}
                    </Button> */}
                </div>
              </Tab.Panel>
            </Tab.Group>
          </div>
        </DoubleGlowShadow>
      </Container>
    )
  )
}
