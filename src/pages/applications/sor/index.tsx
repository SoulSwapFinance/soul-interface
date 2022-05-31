import React, { Fragment, useCallback, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ArrowDownIcon } from '@heroicons/react/solid'
// import Image from 'components/Image'
import { Tab } from '@headlessui/react'
// import { Popover, Tab, Transition } from '@headlessui/react'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { Button, ButtonError } from 'components/Button'
import StableInputPanel from 'components/StableInputPanel'
import { useSwapState } from 'state/swap/hooks'
import { AutoColumn } from 'components/Column'
import QuestionHelper from 'components/QuestionHelper'
import Alert from 'components/Alert'
import { ApprovalState, useApproveCallback, useSorMasterContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import {
  ChainId,
  Token,
  DAI_ADDRESS,
  CurrencyAmount
} from 'sdk'
import {
  SOR_ADDRESS,
  SOR_MASTER_ADDRESS
} from 'constants/addresses'
import { tryParseAmount, formatCurrencyAmount, formatNumberScale, formatPercent, formatNumber } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useStakeClaimAmount, useRedeemClaimAmount, useSorContract, useFee, useRedeemFee } from 'features/luxor/stablecoin/hooks'
import { useActiveWeb3React } from 'services/web3/hooks'
// import { useSingleCallResult } from 'state/multicall/hooks'
import NavLink from 'components/NavLink'
import { useLuxorPrice } from 'hooks/getPrices'
// import useStablecoin from 'hooks/useStablecoin'

export default function Sor() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  const { independentField } = useSwapState()
  const [stakeValue, setStakeValue] = useState('')
  const [redeemValue, setRedeemValue] = useState('')

  const { account, chainId } = useActiveWeb3React()
  const { stake, redeem, claimSor, claimDai } = useSorContract()

  if (chainId && chainId === ChainId.ETHEREUM)
    // DELETE
  window.location.href = '/swap'

  const daiToken = new Token(chainId, getAddress(DAI_ADDRESS[chainId]), 18, 'DAI')
  const sorToken = new Token(chainId, getAddress(SOR_ADDRESS[chainId]), 18, 'SOR')
  const sorMasterContract = useSorMasterContract()
  const stakeClaimAmount = useStakeClaimAmount(sorToken)
  const redeemClaimAmount = useRedeemClaimAmount(sorToken)

  // previously data imports //
  const mintPermille = useFee()
  const redeemPermille = useRedeemFee()
  const pegPrice = 0.985
  const maxStakeAmount = CurrencyAmount.fromRawAmount(daiToken, 8000000000000000000000)
  const maxRedeemAmount = CurrencyAmount.fromRawAmount(daiToken, 20000000000000000000000)
  // const maxStakeAmount = CurrencyAmount.fromRawAmount(daiToken, 0)
  // const maxRedeemAmount = CurrencyAmount.fromRawAmount(daiToken, 0)

  const daiBalance = useCurrencyBalance(account, daiToken)
  const sorBalance = useCurrencyBalance(account, sorToken)

  const parsedStakeValue = tryParseAmount(stakeValue, daiToken)
  const parsedRedeemValue = tryParseAmount(redeemValue, sorToken)
  
  const [stakeApprovalState, stakeApprove] = useApproveCallback(
    parsedStakeValue,
    SOR_MASTER_ADDRESS[chainId]
  )
  const [redeemApprovalState, redeemApprove] = useApproveCallback(
    parsedRedeemValue,
    SOR_MASTER_ADDRESS[chainId]
  )

  const stakeError = !parsedStakeValue
    ? 'Enter Data'
    : daiBalance?.lessThan(parsedStakeValue)
      ? '> Balance'
      : maxStakeAmount?.lessThan(parsedStakeValue)
        ? 'Exceeds Max'
        : undefined

  const isStakeValid = !stakeError

  const redeemError = !parsedRedeemValue
    ? 'Enter Data'
    : sorBalance?.lessThan(parsedRedeemValue)
      ? '> Balance'
      : maxRedeemAmount?.lessThan(parsedRedeemValue)
        ? 'Exceeds Max'
        : undefined
  const isRedeemValid = !redeemError

  const luxorPrice = useLuxorPrice()
  
  return (
    <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
      <LuxorGlowShadow>
      <Head>
        <title>Stablecoin | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className="mt-2 mb-2">
        <Button variant="filled" color="yellow" size="lg">
            <div className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span>Market Price: ${Number(luxorPrice).toFixed(2)}</span>
            </div>
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
                <p>2. Claim SOR.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5 leading-5">
                <p>
                  <strong className="text-accent bold">How to Redeem:&nbsp;</strong>
                </p>
                <p>1. Enter in the amount of SOR you would like to redeem and press Redeem.</p>
                <p>2. Claim DAI.</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-normal leading-5">
                <strong className="text-accent bold">Note:&nbsp;</strong>
                Approval needed once.
              </div>
            </div>
          </div>
        }
        type="information"
      /> */}

        <div className="p-6 space-y-6 bg-dark-900 rounded z-1 relative">
          <Tab.Group>
            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
            {/* <div className="grid grid-cols-2 w-[95%] rounded-md p-2px bg-dark-900"> */}
            <div className="grid grid-cols w-[95%] rounded-md p-2px bg-dark-900">
            <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-yellow text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                }
              >
                {i18n._(t`MINT SOR`)}
              </Tab>
              {/* <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-yellow text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                }
              >
                {i18n._(t`REDEEM`)}
              </Tab> */}
          </div>
            </Tab.List>
            <Tab.Panel className={'outline-none'}>
              <Button variant={'link'} color={'yellow'} className="absolute top-0 right-0 flex">
                <QuestionHelper
                  // title={i18n._(t`How it works`)}
                  // width={'small'}
                  text={
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col">
                        <p>
                          <strong className="text-accent bold">1.</strong> Enter DAI to deposit.
                        </p>
                        <p>
                          <strong className="text-accent bold">2.</strong> Click MINT.
                        </p>
                        <p>
                          <strong className="text-accent bold">3.</strong> Claim SOR.
                        </p>
                      </div>
                    </div>
                  }
                />
              </Button>

              <StableInputPanel
                value={stakeValue}
                showMaxButton={true}
                onUserInput={(value) => setStakeValue(value)}
                onMax={() =>
                  setStakeValue(
                    Number(daiBalance.toExact()) > Number(maxStakeAmount.toExact())
                      ? maxStakeAmount.toExact()
                      : daiBalance.toExact()
                  )
                }
                currency={daiToken}
                disableCurrencySelect={true}
                locked={!account}
                id="stablecoin-currency-input"
              />
              <AutoColumn justify="space-between" className="py-2 -my-4 py-4">
                <div className="flex justify-center -mt-0 -mb-0 z-0">
                  <div
                    role="button"
                    className="p-1.5 rounded-full bg-dark-1000 border shadow-md border-dark-700 hover:border-yellow"
                  >
                    <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
                  </div>
                </div>
              </AutoColumn>
              <StableInputPanel
                // label={i18n._(t`Output`)}
                value={stakeValue}
                showMaxButton={true}
                currency={sorToken}
                disableCurrencySelect={true}
                locked={true}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Max Mint`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatCurrencyAmount(maxStakeAmount, 4)} DAI
                  </Typography>
                </div>
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Rate`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    1:1 DAI
                  </Typography>
                </div> */}
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Fee`)} ({mintPermille / 10}%)
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber((Number(stakeValue) * mintPermille) / 1000, false)} DAI
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                  {i18n._(t`Receive`)}
                  </Typography> 
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(Number(stakeValue) - (Number(stakeValue) * mintPermille) / 1000, false)}{' '}
                    SOR
                  </Typography>
                </div>
                
                {Number(stakeClaimAmount.toExact()) !== 0 &&
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Claimable`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatCurrencyAmount(stakeClaimAmount, 4)} SOR
                  </Typography>
                </div>
                }
              </div>
              <div className="mt-6 flex items-center gap-2">
                {isStakeValid &&
                  (stakeApprovalState === ApprovalState.NOT_APPROVED ||
                    stakeApprovalState === ApprovalState.PENDING) ? (
                  <Button
                    color="yellow"
                    type="filled"
                    className="text-black"
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
                    variant="filled" color="yellow"
                    className="text-black"
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
                  <Button variant="filled" color="gray" 
                  className="flex-1 flex items-center gap-1 justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                        fill="#EE82EE"
                      />
                    </svg>
                    {i18n._(t`Minted`)}
                  </Button>
                )}
                <Button
                  variant="filled" color="yellow"
                  className="text-black"
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

                {/* <Button variant="filled" color="gray" className="flex-1 flex items-center gap-1 justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                    fill="#EE82EE"
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

              <StableInputPanel
                // label={i18n._(t`Input`)}
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

                <AutoColumn justify="space-between" className="py-2 -my-4 py-4">
                <div className="flex justify-center -mt-0 -mb-0 z-0">
                  <div
                    role="button"
                    className="p-1.5 rounded-full bg-dark-800 border shadow-md border-dark-700 hover:border-yellow"
                  >
                    <ArrowDownIcon width={14} className="text-high-emphesis hover:text-white" />
                  </div>
                </div>
              </AutoColumn>
              <StableInputPanel
                // label={i18n._(t`Output`)}
                value={redeemValue !== '' ? (Number(redeemValue) * pegPrice).toString() : ''}
                showMaxButton={false}
                currency={daiToken}
                disableCurrencySelect={true}
                locked={true}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Max`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatCurrencyAmount(maxRedeemAmount, 4)} SOR
                  </Typography>
                </div>
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Rate`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(pegPrice)} DAI
                  </Typography>
                </div> */}
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Fee`)} ({redeemPermille / 10}%)
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber((Number(redeemValue) * redeemPermille) / 1000, false)} DAI
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Receive`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber(
                      Number(redeemValue) * pegPrice - (Number(redeemValue) * redeemPermille) / 1000,
                      false
                    )}{' '}
                    DAI
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Claimable`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {Number(redeemClaimAmount.toExact()) !== 0
                      ? formatNumber(
                        Number(redeemClaimAmount.toExact()) * pegPrice -
                        (Number(redeemClaimAmount.toExact()) * redeemPermille) / 1000,
                        false
                      ) + ' DAI'
                      : '0.00 DAI'}
                  </Typography>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                {isRedeemValid &&
                  (redeemApprovalState === ApprovalState.NOT_APPROVED ||
                    redeemApprovalState === ApprovalState.PENDING) ? (
                  <Button
                    variant="filled" color="yellow"
                    className="text-black"
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
                  variant="filled" color="yellow"
                  className="text-black"
                    onClick={async () => {
                      try {
                        const tx = await redeem(BigNumber.from(parsedRedeemValue?.quotient.toString()))
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
                  <Button variant="filled" color="yellow" className="flex-1 flex items-center gap-1 justify-center">
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
                  variant="filled" color="yellow"
                  className="text-black"
                  onClick={async () => {
                    try {
                      const tx = await claimDai()
                      addTransaction(tx, {
                        summary: `Claim DAI`,
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
                      Number(redeemClaimAmount.toExact()) * pegPrice -
                      (Number(redeemClaimAmount.toExact()) * redeemPermille) / 1000,
                      false
                    )
                    : ''}
                </Button>

                {/* <Button variant="filled" color="yellow" className="flex-1 flex items-center gap-1 justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                    d="M8.99991 16.17L5.53492 12.705C5.14515 12.3152 4.51356 12.3141 4.12242 12.7025C3.72932 13.0928 3.7282 13.7283 4.11992 14.12L8.99991 19L20.2947 7.70513C20.6842 7.31568 20.6842 6.68425 20.2947 6.2948C19.9054 5.90548 19.2743 5.90533 18.8847 6.29447L8.99991 16.17Z"
                    fill="#3CC13B"
                    />
                    </svg>
                    {i18n._(t`Redeemed`)}
                    </Button>
                    <Button variant="filled" color="yellow" disabled={true} className="text-black flex-1">
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
