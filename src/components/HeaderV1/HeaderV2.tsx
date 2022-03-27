// import Mobile from 'components/Header/Mobile'
// import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
// import React, { FC } from 'react'
// import styled from 'styled-components'

// import Desktop from './Desktop'

// const Header: FC = () => {
//   const isDesktop = useDesktopMediaQuery()

//   return <>{ isDesktop ? <Desktop /> : <Mobile /> }</>
// }

// export default Header
import { ChainId, NATIVE } from '../../sdk'
import { AURA } from '../../constants'
// import React, { useEffect, useState } from 'react'
import React from 'react'
import Image from 'next/image'
import More from './More'
import NavLink from '../NavLink'
import { Popover } from '@headlessui/react'
// import QuestionHelper from '../QuestionHelper'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import { t } from '@lingui/macro'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'

import { useLingui } from '@lingui/react'
import ExternalLink from '../ExternalLink'
import TokenStats from '../TokenStats'
import LuxorStats from 'components/LuxorStats'
import { useActiveWeb3React } from 'services/web3'

function AppBar(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const auraBalance = useTokenBalance(account ?? undefined, AURA[chainId])

  return (
    <header className="flex flex-row justify-between w-screen flex-nowrap">

      <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
        {({ open }) => (
          <>
            <div className="px-3 justify-center sm:px-4 py-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <NavLink 
                    activeClassName="text-dark-600 text-high-emphesis"
                    href="/landing">
                    <Image src="/logo.png" alt="Soul" width="36" height="36" />
                  </NavLink>

                  <div className="flex space-x-2">
                    <div className="flex space-x-2 sm:space-x-3">
                      <NavLink 
                      activeClassName="text-dark-600 text-high-emphesis"
                      href="/exchange/swap">
                        <a
                          id={`swap-nav-link`}
                          className="w-full relative ml-2 sm:ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`SWAP`)}
                        </a>
                      </NavLink>
                      <NavLink 
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/luxor/bonds'}>
                        <a
                          id={`luxor-nav-link`}
                          className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`LUX`)}
                        </a>
                      </NavLink>
                      <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href="/sor">
                        <a
                          id={`sor-nav-link`}
                          className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`SOR`)}
                        </a>
                      </NavLink>
                      <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href="/autostake">
                        <a
                          id={`vault-nav-link`}
                          className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`VAULT`)}
                        </a>
                      </NavLink>
                      {/* {chainId && [ChainId.FANTOM].includes(chainId) && (
                        <NavLink
                        activeClassName="text-dark-600 text-high-emphesis"
                        href="/pool">
                          <a
                            id={`pool-nav-link`}
                            className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                          >
                            {i18n._(t`POOL`)}
                          </a>
                        </NavLink>
                      )} */}
                      {chainId && [ChainId.FANTOM].includes(chainId) && (
                        <NavLink 
                        activeClassName="text-dark-600 text-high-emphesis"
                        href={'/mines?filter=active'}>
                          <a
                            id={`farm-nav-link`}
                            className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                          >
                            {i18n._(t`FARM`)}
                          </a>
                        </NavLink>
                      )}
                      <NavLink 
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/bonds'}>
                        <a
                          id={`bond-nav-link`}
                          className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`BOND`)}
                        </a>
                      </NavLink>
                      <NavLink 
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/analytics'}>
                        <a
                          id={`analytics-nav-link`}
                          className="hidden sm:block w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`DATA`)}
                        </a>
                      </NavLink>
                      <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/explore'}>
                        <a
                          id={`explore-nav-link`}
                          className="w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`EXPLORE`)}
                        </a>
                      </NavLink>
                      <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/lend'}>
                        <a
                          id={`lend-nav-link`}
                          className="hidden sm:block w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`LEND`)}
                        </a>
                      </NavLink>
                      <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/vote'}>
                        <a
                          id={`claims-nav-link`}
                          className="hidden sm:block w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`VOTE`)}
                        </a>
                      </NavLink>
                      <NavLink 
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/launchpad'}>
                        <a
                          id={`launch-nav-link`}
                          className="hidden md:block w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`LAUNCH`)}
                        </a>
                      </NavLink>

                      <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/borrow'}>
                        <a
                          id={`borrow-nav-link`}
                          className="hidden lg:block w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`BORROW`)}
                        </a>
                      </NavLink>
                      {/* <NavLink
                      activeClassName="text-dark-600 text-high-emphesis"
                      href={'/claims'}>
                        <a
                          id={`claims-nav-link`}
                          className="hidden sm:block w-full relative ml-6 md:p-2 hover:text-dark-600 text-high-emphesis"
                        >
                          {i18n._(t`CLAIM`)}
                        </a>
                      </NavLink> */}
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-1 2xl:w-auto bg-dark-1000 2xl:relative 2xl:p-0 2xl:bg-transparent">
                  <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                    {library && library.provider.isMetaMask && (
                      <div className="inline-block">
                        <LuxorStats />
                      </div>
                    )}
                    {library && library.provider.isMetaMask && (
                      <div className="inline-block">
                        <TokenStats />
                      </div>
                    )}
                    <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                      {account && chainId && userEthBalance && (
                        <>
                          <div className="hidden 2xl:flex px-2 py-2 text-primary text-bold">
                            {userEthBalance?.toSignificant(4)
                              .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            {NATIVE[chainId].symbol}
                          </div>
                          {account && chainId && (
                            <>
                              <div className="hidden md:inline px-3 py-2 text-primary text-bold">
                                {auraBalance?.toSignificant(4)
                                  .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                } {'AURA'}
                              </div>
                            </>
                          )}
                        </>
                      )}
                      <Web3Status />
                      {library && library.provider.isMetaMask && (
                        <div className="hidden sm:inline-block">
                          <Web3Network />
                        </div>
                      )}
                    </div>
                    <More />
                  </div>
                </div>
                <div className="flex mr-1 sm:mr-1 2xl:hidden">
                  {/* Mobile Menu Button */}
                  <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                    <span className="sr-only">{i18n._(t`Open Main Menu`)}</span>
                    {open ? (
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </Popover.Button>
                </div>
              </div>
            </div>

            <Popover.Panel className="2xl:hidden">
              <div className="flex flex-col px-10 pt-2 pb-3 space-y-4">

                <ExternalLink href={'https://app.luxor.money'}>
                  <a
                    id={`luxor-nav-extlink`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Luxor Money`)}
                  </a>
                </ExternalLink>

                <ExternalLink href={'https://info.soulswap.finance'}>
                  <a
                    id={`vote-nav-extlink`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`View Charts`)}
                  </a>
                </ExternalLink>

                <ExternalLink href={'https://app.soulswap.finance/vote'}>
                  <a
                    id={`vote-nav-extlink`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Governance`)}
                  </a>
                </ExternalLink>

                <ExternalLink href={'https://docs.soulswap.finance'}>
                  <a
                    id={`links-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Documentation`)}
                  </a>
                </ExternalLink>


                <ExternalLink href={'/tools'}>
                  <a
                    id={`tools-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Explore More`)}
                  </a>
                </ExternalLink>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  )
}

export default AppBar
