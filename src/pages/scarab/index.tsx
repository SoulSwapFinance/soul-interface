/* eslint-disable @next/next/link-passhref */
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import Search from '../../components/Search'
import {
  ApprovalState,
  useApproveCallback,
} from '../../hooks'

import { classNames, isAddress, tryParseAmount } from '../../functions'
import NavLink from '../../components/NavLink'
import Link from 'next/link'
import Card from '../../components/Card'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import SoulLogo from '../../components/SoulLogo'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { SCARAB_ADDRESS } from '../../constants'
import useScarab from '../../features/scarab/useScarab'
import { Disclosure } from '@headlessui/react'
import moment from 'moment'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { CurrencyAmount, SEANCE_ADDRESS, SOUL_ADDRESS } from '../../sdk'
import { Button, ButtonConfirmed } from '../../components/Button'
import { getAddress } from '@ethersproject/address'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from '@sushiswap/sdk'

export default function Scarab(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const [tokenAddress, setTokenAddress] = useState(SOUL_ADDRESS[ChainId.FANTOM])
  const token = useToken(isAddress(tokenAddress) ? tokenAddress : undefined)
  const [pendingTx, setPendingTx] = useState(false)
  const addTransaction = useTransactionAdder()
  const [scarabs, setScarabs] = useState([])

  const seance = useCurrency(SEANCE_ADDRESS[ChainId.FANTOM]) || undefined
  const value = CurrencyAmount.fromRawAmount(seance, 1^28)
  const typedDepositValue = value

  const [approvalState, approve] = useApproveCallback(typedDepositValue, SCARAB_ADDRESS[chainId])

  const scarabContract = useScarab()

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  useEffect(() => {
    if (isAddress(tokenAddress)) {
      scarabContract.getScarabsByTokenAddress(tokenAddress).then((r) => {
        if (r.length > 0) {
          setScarabs(r.filter((x) => x.withdrawn == false))
        }
      })
    }
  }, [tokenAddress, scarabContract])

  const handleApprove = useCallback(async () => {
    await approve()
  }, [approve])

  const handleWithdraw = useCallback(
    async (id) => {
      setPendingTx(true)

      try {
        const tx = await scarabContract.withdrawTokens(id)
        addTransaction(tx, {
          summary: `${i18n._(t`Withdraw from Scarab ${id}`)}`,
        })
      } catch (error) {
        console.error(error)
      }
      setPendingTx(false)
    },
    [addTransaction, i18n, scarabContract]
  )

  return (
    <>
      <Head>
        <title>Scarab | Soul</title>
        <meta key="description" name="description" content="Soul Scarab" />
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
                href={'/scarab'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
              >
                <a className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                  {i18n._(t`Claim Scarabs`)}
                </a>
              </NavLink>
              <NavLink
                exact
                href={'/scarab/create'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-purple-dark-900"
              >
                <a className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                  {i18n._(t`Summon Scarabs`)}
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
                {scarabs.length == 0 && isAddress(tokenAddress) && (
                  <div className="flex justify-center items-center col-span-12 lg:justify mt-20">
                    <span>
                      No Scarabs found for this address,{' '}
                      <Link href="/scarab/create">
                        <a className="hover:underline hover:text-purple">click here</a>
                      </Link>{' '}
                      to create one.
                    </span>
                  </div>
                )} */}
                {scarabs.length > 0 && (
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
                  {scarabs.map((scarab, index) => {
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
                                  { '-' + scarab?.recipient.substr(length - 5) }
                                </div>
                                <div className="flex flex-col justify-center">
                                  {CurrencyAmount.fromRawAmount(token, scarab?.amount).toSignificant(6)}
                                </div>
                                <div className="flex flex-col justify-center">
                                  {CurrencyAmount.fromRawAmount(token, scarab?.tribute).toSignificant(6)}
                                </div>
                                <div className="flex flex-col justify-center">
                                  {/* <div className="text-xs text-right md:text-base text-secondary"> */}
                                    {moment.unix(scarab?.unlockTimestamp.toString()).fromNow()}
                                  {/* </div> */}
                                </div>
                                <div className="flex flex-col items-end justify-center">
                                  <div className="text-xs text-right md:text-base text-secondary">
                                  {approvalState !== ApprovalState.APPROVED && (
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
                                    )}
                                    <Button
                                      variant="link"
                                      style={{ width: '100%' }}
                                      onClick={() => handleWithdraw(scarab?.id)}
                                      disabled={
                                        moment.unix(scarab?.unlockTimestamp.toString()).isAfter(new Date()) ||
                                        !account ||
                                        (account && getAddress(account) != getAddress(scarab?.recipient))
                                      }
                                    >
                                      Withdraw
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
