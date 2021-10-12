/* eslint-disable @next/next/link-passhref */
import { useActiveWeb3React } from '../../hooks'
import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import Search from '../../components/Search'
import { classNames, isAddress } from '../../functions'
import NavLink from '../../components/NavLink'
import Link from 'next/link'
import Card from '../../components/Card'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import SoulLogo from '../../components/SoulLogo'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useScarab from '../../features/scarab/useScarab'
import { Disclosure } from '@headlessui/react'
import moment from 'moment'
import { useToken } from '../../hooks/Tokens'
import { CurrencyAmount } from '../../sdk'
import Button from '../../components/Button'
import { getAddress } from '@ethersproject/address'

export default function Scarab(): JSX.Element {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [recipientAddress, setRecipientAddress] = useState(undefined)
  const recipient = isAddress(recipientAddress) ? recipientAddress : undefined
  const [pendingTx, setPendingTx] = useState(false)
  const addTransaction = useTransactionAdder()

  const [scarabs, setScarabs] = useState([])

  const scarabContract = useScarab()

  useEffect(() => {
    if (isAddress(recipientAddress)) {
      scarabContract.getDepositsByRecipient(recipientAddress).then((r) => {
        if (r.length > 0) {
          setScarabs(r.filter((x) => x.withdrawn == false))
        }
      })
    }
  }, [recipientAddress, scarabContract])

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
            {/* <Link href="/farm"> */}
              {/* <SoulLogo /> */}
            {/* </Link> */}
          </div>
        </div>
        <DoubleGlowShadowV2 maxWidth={false} opacity={'0.3'}>
          <div className={`grid grid-cols-12 gap-2 min-h-1/2`}>
            <div className={`col-span-12 flex flex-col md:flex-row md:space-x-2`}>
              <NavLink
                exact
                href={'/scarab'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-yellow-dark-900"
              >
                <a className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                  {i18n._(t`Search Scarabs`)}
                </a>
              </NavLink>
              <NavLink
                exact
                href={'/scarab/create'}
                activeClassName="font-bold bg-transparent border rounded text-high-emphesis border-transparent border-gradient-r-yellow-dark-900"
              >
                <a className="flex items-center justify-between px-6 py-2 text-base font-bold border border-transparent rounded cursor-pointer">
                  {i18n._(t`Summon Scarabs`)}
                </a>
              </NavLink>
            </div>
            <div className={`col-span-12`} style={{ minHeight: '35rem' }}>
              <Card className="h-full bg-dark-900 z-4">
                <Search
                  placeholder={'Search by recipient address'}
                  term={recipientAddress}
                  search={(value: string): void => {
                    setRecipientAddress(value)
                  }}
                />
                {scarabs.length == 0 && isAddress(recipientAddress) && (
                  <div className="flex justify-center items-center col-span-12 lg:justify mt-20">
                    <span>
                      No scarabs found for this user address,{' '}
                      <Link href="/scarab/create">
                        <a className="hover:underline hover:text-purple">click here</a>
                      </Link>{' '}
                      to create one.
                    </span>
                  </div>
                )}
                {scarabs.length > 0 && (
                  <div className="grid grid-cols-5 text-base font-bold text-primary mt-10 mb-2">
                    <div className="flex items-center col-span-2 px-2">
                      <div className="hover:text-high-emphesis">{i18n._(t`Token`)}</div>
                    </div>
                    <div className="flex items-center ">{i18n._(t`Amount Locked`)}</div>
                    <div className="items-center justify-end px-2 flex ">{i18n._(t`Unlock Date`)}</div>
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
                                <div className="flex col-span-2 items-center">
                                  {recipient?.address} ({recipient?.address})
                                </div>
                                <div className="flex flex-col justify-center">
                                  {CurrencyAmount.fromRawAmount(recipient, scarab?.amount).toSignificant(6)}
                                </div>
                                <div className="flex flex-col items-end justify-center">
                                  <div className="text-xs text-right md:text-base text-secondary">
                                    {moment.unix(scarab?.unlockTimestamp.toString()).fromNow()}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end justify-center">
                                  <div className="text-xs text-right md:text-base text-secondary">
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
