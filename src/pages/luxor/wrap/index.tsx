import React, { Fragment, useCallback, useEffect, useState } from 'react'
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
import { AutoColumn } from 'components/Column'
import { ApprovalState, useApproveCallback, useLumensContract, useWrappedLumensContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import {
  ChainId,
  Token,
  LUM_ADDRESS,
  CurrencyAmount
} from 'sdk'
import { WLUM_ADDRESS } from 'constants/addresses'
import { tryParseAmount, formatCurrencyAmount, formatNumber } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useSorContract, useFee } from 'features/luxor/stablecoin/hooks'
import { useActiveWeb3React } from 'services/web3/hooks'
// import { useSingleCallResult } from 'state/multicall/hooks'
import NavLink from 'components/NavLink'
import { useLuxorPrice } from 'hooks/getPrices'
// import useStablecoin from 'hooks/useStablecoin'

export default function Stablecoin() {
  const addTransaction = useTransactionAdder()
  const { i18n } = useLingui()
  // const { independentField } = useSwapState()
  const [wrapValue, setWrapValue] = useState('')
  const [redeemValue, setRedeemValue] = useState('')
  const [wrapIndex, setWrapIndex] = useState(0)

  const { account, chainId } = useActiveWeb3React()
  const { wrap } = useLumensContract()
  // const { data } = useStablecoin()

  const lumensToken = new Token(chainId, getAddress(LUM_ADDRESS[chainId]), 9, 'LUM')
  const wlumToken = new Token(chainId, getAddress(WLUM_ADDRESS[chainId]), 9, 'WLUM')
  // const redeemClaimAmount = useRedeemClaimAmount(wlumToken)

  const LumensContract = useLumensContract()
  const WrappedLumensContract = useWrappedLumensContract()

  const lumensBalance = useCurrencyBalance(account, lumensToken)
  const wlumBalance = useCurrencyBalance(account, wlumToken)

  const parsedStakeValue = tryParseAmount(wrapValue, lumensToken)
  const parsedRedeemValue = tryParseAmount(redeemValue, wlumToken)

  
  const [wrapApprovalState, wrapApprove] = useApproveCallback(
    parsedStakeValue,
    WLUM_ADDRESS[chainId]
  )
  const [redeemApprovalState, redeemApprove] = useApproveCallback(
    parsedRedeemValue,
    WLUM_ADDRESS[chainId]
  )

  const wrapError = !parsedStakeValue
    ? 'Enter Amount'
    : lumensBalance?.lessThan(parsedStakeValue)
      ? 'Insufficient Balance'
        : undefined

  const isWrapValid = !wrapError

  const redeemError = !parsedRedeemValue
    ? 'Enter Amount'
    : wlumBalance?.lessThan(parsedRedeemValue)
      ? 'Insufficient Balance'
        : undefined
  const isRedeemValid = !redeemError

  const luxorPrice = useLuxorPrice()
  
    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
      fetchWrapInfo()
    }, [])

    useEffect(() => {
      try {
        const timer = setTimeout(() => {
          fetchWrapInfo()
        }, 3000)
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer)
      } catch (err) {
        console.warn(err)
      }
    })

      const fetchWrapInfo = async () => {
          try {
              const index = await LumensContract.index()
              const wrapIndex = index / 1e9
              // console.log('wrapIndex:%s', Number(wrapIndex))
              setWrapIndex(wrapIndex)
            return [wrapIndex]
          } catch (err) {
              console.warn(err)
          }
      }
      
  return (
    <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
      <LuxorGlowShadow>
      <Head>
        <title>Wrap | Luxor</title>
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
            <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/bonds'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/sor'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stable </span>
            </a>
          </NavLink>
        </Button>
      </div>
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
                {i18n._(t`WRAP`)}
              </Tab>
              <Tab
                className={({ selected }) =>
                  `${selected ? 'border-b-2 border-accent p-2 border-yellow text-white' : 'bg-dark-900 text-white'
                  } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                }
              >
                {i18n._(t`UNWRAP`)}
              </Tab>
          </div>
          {/* WRAPPING TAB */}
          </Tab.List>
            <Tab.Panel className={'outline-none'}>
              <StableInputPanel
                value={wrapValue}
                showMaxButton={true}
                onUserInput={(value) => setWrapValue(value)}
                onMax={() =>
                  setWrapValue(lumensBalance.toExact())
                }
                currency={lumensToken}
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
                value={(Number(wrapValue) / wrapIndex).toString()}
                showMaxButton={true}
                currency={wlumToken}
                disableCurrencySelect={true}
                locked={true}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Rate`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    1 WLUM = {Number(wrapIndex).toFixed(2)} LUM
                  </Typography>
                </div>
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {i18n._(t`Receieve`)}
                  </Typography>
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    {formatNumber((Number(wrapValue) / Number(wrapIndex)), false)} LUM
                  </Typography>
                </div> */}
              </div>
              <div className="mt-6 flex items-center gap-2">
                {isWrapValid &&
                  (wrapApprovalState === ApprovalState.NOT_APPROVED ||
                    wrapApprovalState === ApprovalState.PENDING) ? (
                  <Button
                    color="yellow"
                    type="filled"
                    onClick={wrapApprove}
                    disabled={wrapApprovalState !== ApprovalState.NOT_APPROVED}
                  >
                    {wrapApprovalState === ApprovalState.PENDING ? (
                      <Dots>{i18n._(t`Approving`)}</Dots>
                    ) : (
                      i18n._(t`Approve`)
                    )}
                  </Button>
                ) : (
                  <ButtonError
                    variant="filled" color="yellow"
                    className="text-black"
                    onClick={async () => {
                      try {
                        const tx = await WrappedLumensContract.wrap(BigNumber.from(parsedStakeValue.quotient.toString()))
                        addTransaction(tx, {
                          summary: `Wrap Lumens`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!isWrapValid || !account}
                    error={!isWrapValid && !!parsedStakeValue}
                  >
                    {wrapError || i18n._(t`Wrap`)}
                  </ButtonError>
                )}
              </div>
            </Tab.Panel>
            {/*  */}
          </Tab.Group>
        </div>
      </LuxorGlowShadow>
    </Container>
  )
}
