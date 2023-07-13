import React, { useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
// import Image from 'components/Image'
// import { Popover, Tab, Transition } from '@headlessui/react'
import { Tab } from '@headlessui/react'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { Button, ButtonError } from 'components/Button'
import StableInputPanel from 'components/StableInputPanel'
import { AutoColumn } from 'components/Column'
import { ApprovalState, useApproveCallback, useWrappedLumensContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { Token, LUM_ADDRESS } from 'sdk'
import { WLUM_ADDRESS } from 'constants/addresses'
import { tryParseAmount } from 'functions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import Dots from 'components/Dots'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'services/web3/hooks'
import NavLink from 'components/NavLink'
import { useLuxorPrice } from 'hooks/getPrices'
// import { useSingleCallResult } from 'state/multicall/hooks'
// import useStablecoin from 'hooks/useStablecoin'
import { useLuxorInfo } from 'hooks/useAPI'
import { LuxorBanner } from 'components/Banner'

export default function Stablecoin() {
  const addTransaction = useTransactionAdder()

  const [wrapValue, setWrapValue] = useState('')
  const [unwrapValue, setUnwrapValue] = useState('')

  const { account, chainId } = useActiveWeb3React()
  // const { data } = useStablecoin()

  const lumensToken = new Token(chainId, getAddress(LUM_ADDRESS[chainId]), 9, 'LUM')
  const wlumToken = new Token(chainId, getAddress(WLUM_ADDRESS[chainId]), 9, 'WLUM')
  // const redeemClaimAmount = useRedeemClaimAmount(wlumToken)

  // const LumensContract = useLumensContract()
  const WrappedLumensContract = useWrappedLumensContract()

  const lumensBalance = useCurrencyBalance(250, account, lumensToken)
  const wlumBalance = useCurrencyBalance(250, account, wlumToken)

  const parsedStakeValue = tryParseAmount(wrapValue, lumensToken)
  const parsedUnwrapValue = tryParseAmount(unwrapValue, wlumToken)

  const { luxorInfo } = useLuxorInfo()
  const wrapIndex = Number(luxorInfo.index)

  const [wrapApprovalState, wrapApprove] = useApproveCallback(
    parsedStakeValue,
    WLUM_ADDRESS[chainId]
  )
  const [unwrapApprovalState, unwrapApprove] = useApproveCallback(
    parsedUnwrapValue,
    WLUM_ADDRESS[chainId]
  )

  const wrapError = !parsedStakeValue
    ? 'Enter Amount'
    : lumensBalance?.lessThan(parsedStakeValue)
      ? 'Insufficient Balance'
      : undefined

  const isWrapValid = !wrapError

  const redeemError = !parsedUnwrapValue
    ? 'Enter Amount'
    : wlumBalance?.lessThan(parsedUnwrapValue)
      ? 'Insufficient Balance'
      : undefined
  const isUnwrapValid = !redeemError

  const luxorPrice = useLuxorPrice()

  return (
    <Container id="stablecoin-page" className="py-4 md:py-8 lg:py-12">
      <LuxorGlowShadow>
        <Head>
          <title>Wrap | Luxor</title>
          <meta key="description" name="description" />
        </Head>
        <LuxorBanner chainId={chainId} />
        <div className="flex ml-2 mr-2 mb-4 mt-4 gap-1 items-center justify-center">
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
            <NavLink href={'/luxor/stake'}>
              <a className="block text-md md:text-xl text-black font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span> Stake </span>
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
                  {`WRAP`}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `${selected ? 'border-b-2 border-accent p-2 border-yellow text-white' : 'bg-dark-900 text-white'
                    } flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-yellow`
                  }
                >
                  {`UNWRAP`}
                </Tab>
              </div>
            </Tab.List>

            {/* WRAPPING TAB */}
            <Tab.Panel className={'outline-none'}>
              <StableInputPanel
                value={wrapValue}
                showLogo={true}
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
                showLogo={true}
                showMaxButton={true}
                currency={wlumToken}
                disableCurrencySelect={true}
                locked={true}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-center">
                  {/* <Typography className="text-white" fontFamily={'medium'}>
                    {`Wrap Rate`}
                  </Typography> */}
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    1 LUM = { (1 / Number(wrapIndex)).toFixed(4)} WLUM
                  </Typography>
                </div>
                {/* <div className="flex justify-between">
                  <Typography className="text-white" fontFamily={'medium'}>
                    {`Receieve`}
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
                      <Dots>{`Approving`}</Dots>
                    ) : (
                      `Approve`
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
                          summary: `Wrap LUM`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!isWrapValid || !account}
                    error={!isWrapValid && !!parsedStakeValue}
                  >
                    {wrapError || `Wrap LUM`}
                  </ButtonError>
                )}
              </div>
            </Tab.Panel>
          
          {/* UNWRAPPING TAB */}
            <Tab.Panel className={'outline-none'}>
              <StableInputPanel
                value={unwrapValue}
                showLogo={true}
                showMaxButton={true}
                onUserInput={(value) => setUnwrapValue(value)}
                onMax={() =>
                  setUnwrapValue(wlumBalance.toExact())
                }
                currency={wlumToken}
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
                value={(Number(unwrapValue) * wrapIndex).toString()}
                showLogo={true}
                showMaxButton={true}
                currency={lumensToken}
                disableCurrencySelect={true}
                locked={true}
                id="stablecoin-currency-output"
              />
              <div className="h-px my-6 bg-dark-1000"></div>
              <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-yellow w-full space-y-1">
                <div className="flex justify-center">
                  {/* <Typography className="text-white" fontFamily={'medium'}>
                    {`Unwrap Rate`}
                  </Typography> */}
                  <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                    1 WLUM = {Number(wrapIndex).toFixed(2)} LUM
                  </Typography>
                </div>
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
                      <Dots>{`Approving`}</Dots>
                    ) : (
                      `Approve`
                    )}
                  </Button>
                ) : (
                  <ButtonError
                    variant="filled" color="yellow"
                    className="text-black"
                    onClick={async () => {
                      try {
                        const tx = await WrappedLumensContract.unwrap(BigNumber.from(parsedUnwrapValue.quotient.toString()))
                        addTransaction(tx, {
                          summary: `Unwrap WLUM`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                    disabled={!isUnwrapValid || !account}
                    error={!isUnwrapValid && !!parsedUnwrapValue}
                  >
                    {wrapError || `Unwrap WLUM`}
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
