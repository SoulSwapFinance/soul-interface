/* eslint-disable @next/next/link-passhref */
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
// import Search from 'components/Search'
import {
//   ApprovalState,
//   useApproveCallback,
  useManifestationContract,
  useManifesterContract,
} from 'hooks'

import { classNames, isAddress, tryParseAmount } from 'functions'
import NavLink from 'components/NavLink'
import Card from 'components/Card'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { useTransactionAdder } from 'state/transactions/hooks'
import { Disclosure } from '@headlessui/react'
import moment from 'moment'
import { Button, ButtonConfirmed } from 'components/Button'
import { useDeFarmPoolInfo } from 'hooks/useAPI'

// import Link from 'next/link'
// import { useActiveWeb3React } from 'services/web3'
// import { useCurrency, useToken } from 'hooks/Tokens'
// import { CurrencyAmount } from 'sdk'
// import { getAddress } from '@ethersproject/address'
// import { AutoRow } from 'components/Row'
// import Loader from 'components/Loader'
// import { ChainId } from 'sdk'

export default function Manifestations(): JSX.Element {
    const { i18n } = useLingui()
    // const { account, chainId } = useActiveWeb3React()
    const [id, setID] = useState(0)
    const [idSelected, selectID] = useState(false)
    const [delayDays, setDelayDays] = useState(0)
    const [delayDaysSet, selectDelayDays] = useState(false)
    // const token = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
    const [pendingTx, setPendingTx] = useState(false)
    const addTransaction = useTransactionAdder()
    const [manifestations, setManifestations] = useState([])

  const ManifesterContract = useManifesterContract()

  function getAddress(id) {
    const { defarmPoolInfo } = useDeFarmPoolInfo(id)
    const mAddress = defarmPoolInfo.mAddress
    return mAddress
}

  // check if user has gone through approval process, used to show two step buttons, reset on token change
//   const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

//   useEffect(() => {
//     if (approvalState === ApprovalState.PENDING) {
//       setApprovalSubmitted(true)
//     }
//   }, [approvalState, approvalSubmitted])

  useEffect(() => {
    // if (idSelected) {
    ManifesterContract.getInfo(id).then((r) => {
        if (r.length > 0) {
            setManifestations(r)
            // setManifestations(r.filter((x) => (true)))
            console.log({id})
        //   setManifestations(r.filter((x) => x.startTime == 0))
        }
      })
    // }
  }, [id, ManifesterContract])

//   const handleApprove = useCallback(async () => {
//     await approve()
//   }, [approve])

  const handleLaunch = useCallback(
    async (
        id: string, 
        delayDays: Number
    ) => {
      setPendingTx(true)

      try {
        const mAddress = await ManifesterContract.manifestations(id)
        console.log({mAddress})
        const ManifestationContract = useManifestationContract(mAddress)
        const tx = await ManifestationContract.setDelay(delayDays.toString())
        addTransaction(tx, {
          summary: `${i18n._(t`Launch Manifestation ${id}`)}`,
        })
      } catch (error) {
        console.error(error)
      }
      setPendingTx(false)
    },
    [addTransaction, i18n, ManifesterContract]
  )

  return (
    <>
      <Head>
        <title>Manifestations | Soul</title>
        <meta key="description" name="description" content="DeFarm Manifestations" />
      </Head>

      <div className="container px-0 mx-auto pb-6">
        <div className={`mb-2 pb-4 grid grid-cols-12 gap-4`}>
          <div className="flex justify-center items-center col-span-12 lg:justify">
          </div>
        </div>
        <DoubleGlowShadowV2 maxWidth={false} opacity={'0.3'}>
          <div className={`grid grid-cols-12 gap-2 min-h-1/2`}>
            <div className={`col-span-12 flex flex-col md:flex-row md:space-x-2`}>
              <NavLink
                exact
                href={'/defarms'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
              >
                <a className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                  {i18n._(t`View Manifestations`)}
                </a>
              </NavLink>
              <NavLink
                exact
                href={'/defarms/create'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
              >
                <a className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                  {i18n._(t`Summon Manifestation`)}
                </a>
              </NavLink>
            </div>
            <div className={`col-span-12`} style={{ minHeight: '35rem' }}>
              <Card className="h-full rounded bg-dark-900">
                {/* <Search
                  placeholder={'Search by name, symbol or address'}
                  term={tokenAddress}
                  search={(value: string): void => {
                    setTokenAddress(value)
                  }}
                />
                {manifestations.length == 0 && isAddress(tokenAddress) && (
                  <div className="flex justify-center items-center col-span-12 lg:justify mt-20">
                    <span>
                      No Manifestations found for the given ID,{' '}
                      <Link href="/defarms/create">
                        <a className="hover:underline hover:text-purple">click here</a>
                      </Link>{' '}
                      to create one.
                    </span>
                  </div>
                )} */}
                {manifestations.length > 0 && (
                  <div className="grid grid-cols-5 text-base font-bold text-primary mt-10 mb-2">
                    {/* <div className="flex items-center col-span-2 px-2">
                      <div className="hover:text-high-emphesis">{i18n._(t`Token`)}</div>
                    </div> */}
                    <div className="flex items-center ">{i18n._(t`Recipient`)}</div>
                    <div className="flex items-center ">{i18n._(t`Locked`)}</div>
                    <div className="flex items-center ">{i18n._(t`Tribute`)}</div>
                    <div className="flex items-center ">{i18n._(t`Unlock`)}</div>
                    <div className="items-center justify-end px-2 flex ">{i18n._(t``)}</div>
                  </div>
                )}
                <div className="flex-col">
                  {manifestations.map((manifestation, index) => {
                    return (
                      <Disclosure key={index}>
                        {() => (
                          <div className="mb-4">
                            <Disclosure.Button
                              className={classNames(
                                'w-full px-4 py-6 text-left rounded select-none bg-dark-700  text-primary text-sm md:text-lg'
                              )}
                            >
                              <div className="grid grid-cols-5">
                                {/* <div className="flex col-span-2 items-center">
                                  {token?.name} ({token?.symbol})
                                </div> */}
                                <div className="flex flex-col justify-center">
                                 {/* { '-' + manifestation?.mAddress?.substr(length - 5) } */}
                                 {getAddress(index)}
                                </div>
                                <div className="flex flex-col justify-center">
                                    {manifestation?.name}
                                </div>
                                <div className="flex flex-col justify-center">
                                    {manifestation?.symbol}
                                </div>
                                <div className="flex flex-col justify-center">
                                  {/* <div className="text-xs text-right md:text-base text-secondary"> */}
                                    {moment.unix(manifestation?.startTime?.toString()).fromNow()}
                                  {/* </div> */}
                                </div>
                                <div className="flex flex-col items-end justify-center">
                                  <div className="text-xs text-right md:text-base text-secondary">
                                  {/* {approvalState !== ApprovalState.APPROVED && (
                                      <ButtonConfirmed
                                        onClick={handleApprove}
                                        disabled={
                                          approvalState !== ApprovalState.NOT_APPROVED ||
                                          approvalSubmitted // ||
                                          // !allInfoSubmitted
                                        }
                                      >
                                        {approvalState === ApprovalState.PENDING ? (
                                          <div className={'p-2'}>
                                            <AutoRow gap="6px" justify="center">
                                              Approving <Loader stroke="white" />
                                            </AutoRow>
                                          </div>
                                        ) : (
                                          i18n._(t`Approve`)
                                        )}
                                      </ButtonConfirmed>
                                    )} */}
                                    <Button
                                      variant="link"
                                      style={{ width: '100%' }}
                                      onClick={() => handleLaunch(manifestation?.id, delayDays)}
                                      disabled={
                                        // NOTE: ensure delay days has been selected, otherwise it's start immediately //
                                        delayDaysSet
                                        // moment.unix(manifestation?.endTime.toString()).isAfter(new Date())
                                        // || !account
                                        // || (account && getAddress(account) != getAddress(manifestation?.recipient))
                                      }
                                    >
                                      Launch
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Disclosure.Button>
                          </div>
                        )}
                      </Disclosure>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        </DoubleGlowShadowV2>
      </div>
    </>
  )
}
