import { ChainId, NATIVE, SOUL_ADDRESS } from '../../sdk'
// import React, { useEffect, useState } from 'react'
import React from 'react'

// import { ANALYTICS_URL } from '../../constants'
// import Buy from '../../features/ramp'
// import ExternalLink from '../ExternalLink'
import Image from 'next/image'
// import LanguageSwitch from '../LanguageSwitch'
import Link from 'next/link'
import More from './More'
import Exchange from './Exchange'
import Earn from './Earn'
import Farms from './Farms'
import Explore from './Explore'
// import Seance from './Seance'
import NavLink from '../NavLink'
import { Popover } from '@headlessui/react'
import QuestionHelper from '../QuestionHelper'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useETHBalances } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'

// import { ExternalLink, NavLink } from "./Link";
// import { ReactComponent as Burger } from "../assets/images/burger.svg";

function AppBar(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  return (
    <header className="flex flex-row justify-between w-screen flex-nowrap">
    {/* <header className="flex-shrink-0 w-full"> */}
      <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
        {({ open }) => (
          <>
            <div className="px-4 py-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                <NavLink href="/landing">
                  <Image src="/logo.png" alt="Soul" width="40" height="40" />
                </NavLink>
                  {/* <div className="hidden sm:block lg:ml-4"> */}
                    <div className="flex space-x-2">
                    <div className="flex space-x-4">
                      <Exchange />
                      <Farms />
                      <Earn />
                      <Explore />
                      {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href="/exchange/swap">
                         <a
                           id={`swap-nav-link`}
                           className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                           >
                          {i18n._(t`SWAP`)}
                         </a>
                       </NavLink>
                       )}
                       { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      <NavLink href="/pool">
                        <a
                          id={`pool-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          <Image src="https://media.giphy.com/media/N3NpRukvRmnAI/giphy.gif" alt="offering soul" width="30" height="30" />
                          {i18n._(t`POOL`)}
                        </a>
                      </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'/farm'}>
                          <a
                            id={`farm-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                            >
                          <Image src="https://media.giphy.com/media/iH7mGoqPivDybuDc2s/giphy.gif" alt="offering soul" width={30} height={30} />
                            {i18n._(t`FARM`)}
                          </a>
                        </NavLink>
                      )}
                      { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      <NavLink href={'/enchant'}>
                        <a
                          id={`enchant-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          <Image src="https://media.giphy.com/media/hXGy5FTLBPQ4w/giphy.gif" alt="offering soul" width={30} height={30} />
                          {i18n._(t`ENCHANT`)}
                        </a>
                      </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      <NavLink href={'/seance'}>
                        <a
                          id={`stake-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`STAKE`)}
                        </a>
                      </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'https://info.soul.sh'}>
                        <a
                          id={`analytics-nav-link`}
                          className="p-2 text-base text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`Analytics`)}
                        </a>
                        </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href='/charts' target="_blank">
                          <a
                            id={`charts-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            <Image src="https://media.giphy.com/media/dAEerRZK72Ah6Qo3IX/giphy.gif" alt="offering soul" width={30} height={30} />
                            {i18n._(t`ANALYTICS`)}
                          </a>
                        </NavLink>
                      )} */}
                      {/* <Seance /> */}
                      {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href='/scarab/create' target="_blank">
                          <a
                            id={`scarab-nav-link`}
                            // className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                            className="w-full relative ml-6 md:m-0"

                         >
                           <Image src="https://media.giphy.com/media/kBGxL0WetxMC0qCcLj/giphy.gif" alt="offering soul" width={50} height={50} />
                           <br/>
                            SCARAB
                          </a>
                        </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href='/bridge' target="_blank">
                          <a
                            id={`bridge-nav-link`}
                            // className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                            className="w-full relative ml-6 md:m-0"

                         >
                           <Image src="https://media.giphy.com/media/Vi6Eo8cmcYtvWqXOhm/giphy.gif" alt="offering soul" width={50} height={50} />
                           <br/>
                            BRIDGE
                          </a>
                        </NavLink>
                      )} */}

                      {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href='/dashboard' target="_blank">
                          <a
                            id={`bridge-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            <Image src="https://media.giphy.com/media/W0JfDI1ODcNviBOylg/giphy.gif" alt="offering soul" width={30} height={30} />
                            {i18n._(t` DASH`)}
                          </a>
                        </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href='/bridge' target="_blank">

                          <a
                            id={`bridge-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                          <Image src="https://media.giphy.com/media/9vFujGoURHxI9wyAkh/giphy.gif" alt="offering soul" width={30} height={30} />
                            {i18n._(t` BRIDGE`)}
                          </a>
                        </NavLink>
                      )} */}
                      {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'/summoner'}>
                        <a
                          id={`farm-nav-link`}
                          className="p-2 text-base text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          {i18n._(t`Summon`)}
                        </a>
                        </NavLink>
                      {/* {chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                          <>
                            <NavLink href={'/lend'}>
                              <a
                                id={`lend-nav-link`}
                                className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                              >
                                {i18n._(t`Lend`)}
                              </a>
                            </NavLink>
                            <NavLink href={'/borrow'}>
                              <a
                                id={`borrow-nav-link`}
                                className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                              >
                                {i18n._(t`Borrow`)}
                              </a>
                            </NavLink>
                          </>
                        )}
                      {/* {chainId && [ChainId.MAINNET, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <NavLink href={'/user'}>
                          <a
                            id={`bridge-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            {i18n._(t`Dashboard`)}
                          </a>
                        </NavLink>
                      )} */}
                      {/* {chainId === [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                        <Link href={'/ifo'}>
                          <a
                            id={`ifo-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                          >
                            {i18n._(t`Ifo`)}
                          </a>
                        </Link>
                      )} */}
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 lg:w-auto bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                  <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                      { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      library &&
                      library.provider.isMetaMask && ( // TODO: update
                        <>
                          <QuestionHelper text={i18n._(t`Add ENCHANT to your MetaMask wallet`)}>
                            <div
                              className="hidden p-0.5 rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800"
                              onClick={() => {
                                if (library && library.provider.isMetaMask && library.provider.request) {
                                  const params: any = {
                                    type: 'ERC20',
                                    options: {
                                      address: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a',
                                      symbol: 'ENCHANT',
                                      decimals: 18,
                                      image:
                                        'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/enchant.jpg',
                                    },
                                  }
                                  library.provider
                                    .request({
                                      method: 'wallet_watchAsset',
                                      params,
                                    })
                                    .then((success) => {
                                      if (success) {
                                        console.log('Successfully added ENCHANT to MetaMask')
                                      } else {
                                        throw new Error('Something went wrong.')
                                      }
                                    })
                                    .catch(console.error)
                                }
                              }}
                            >
                              <Image
                                src="/images/tokens/enchant.png"
                                alt="ENCHANT"
                                width="40px"
                                height="40px"
                                objectFit="contain"
                                className="rounded-md"
                              />
                            </div>
                          </QuestionHelper>
                        </>
                      ))}
                      { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      library &&
                      library.provider.isMetaMask && ( // TODO: update
                        <>
                          <QuestionHelper text={i18n._(t`Add SEANCE to your MetaMask wallet`)}>
                            <div
                              className="hidden p-0.5 rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800"
                              onClick={() => {
                                if (library && library.provider.isMetaMask && library.provider.request) {
                                  const params: any = {
                                    type: 'ERC20',
                                    options: {
                                      address: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6',
                                      symbol: 'SEANCE',
                                      decimals: 18,
                                      image:
                                        'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/seance.jpg',
                                    },
                                  }
                                  library.provider
                                    .request({
                                      method: 'wallet_watchAsset',
                                      params,
                                    })
                                    .then((success) => {
                                      if (success) {
                                        console.log('Successfully added SEANCE to MetaMask')
                                      } else {
                                        throw new Error('Something went wrong.')
                                      }
                                    })
                                    .catch(console.error)
                                }
                              }}
                            >
                              <Image
                                src="/images/tokens/seance.png"
                                alt="SEANCE"
                                width="40px"
                                height="40px"
                                objectFit="contain"
                                className="rounded-md"
                              />
                            </div>
                          </QuestionHelper>
                        </>
                      ))}

                    {chainId && chainId in SOUL_ADDRESS && library && library.provider.isMetaMask && (
                      <>
                        <QuestionHelper text={i18n._(t`Add SOUL to your MetaMask wallet`)}>
                          <div
                            className="hidden rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                            onClick={() => {
                              const params: any = {
                                type: 'ERC20',
                                options: {
                                  address: SOUL_ADDRESS[chainId],
                                  symbol: 'SOUL',
                                  decimals: 18,
                                  image: 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/soul.jpg',
                                },
                              }
                              if (library && library.provider.isMetaMask && library.provider.request) {
                                library.provider
                                  .request({
                                    method: 'wallet_watchAsset',
                                    params,
                                  })
                                  .then((success) => {
                                    if (success) {
                                      console.log('Successfully added SOUL to MetaMask')
                                    } else {
                                      throw new Error('Something went wrong.')
                                    }
                                  })
                                  .catch(console.error)
                              }
                            }}
                          >
                            <Image
                                src="/images/tokens/soul.png"
                                alt="SOUL"
                                width="40px"
                                height="40px"
                                objectFit="contain"
                                className="rounded-md"
                            />
                          </div>
                        </QuestionHelper>
                      </>
                    )}

                    {library && library.provider.isMetaMask && (
                      <div className="hidden sm:inline-block">
                        <Web3Network />
                      </div>
                    )}

                    <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                      {account && chainId && userEthBalance && (
                        <>
                          <div className="px-3 py-2 text-primary text-bold">
                            {userEthBalance?.toSignificant(4)
                            .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            } {NATIVE[chainId].symbol}
                          </div>
                        </>
                      )}
                      <Web3Status />
                    </div>
                    <div className="hidden md:block">
                      {/* <LanguageSwitch /> */}
                    </div>
                    <More />
                  </div>
                </div>
                <div className="flex -mr-2 sm:hidden">
                  {/* Mobile menu button */}
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
                      // <X title="Close" className="block w-6 h-6" aria-hidden="true" />
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
                      // <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
              </div>
            </div>

            <Popover.Panel className="sm:hidden">
              <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                
              { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/swap'}>
                  <a
                    id={`swap-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Swap`)}
                  </a>
                </Link>
              )}

              { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/pool'}>
                <a
                  id={`pool-nav-link`}
                  className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                  {i18n._(t`Pool`)}
                </a>
              </Link>
              )}

             { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/farm'}>
                  <a
                    id={`farm-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Farm`)}
                  </a>
                </Link>
              )}
                
               {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/enchant'}>
                  <a
                    id={`enchant-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Enchant`)}
                  </a>
                </Link>
              )}

              { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/seance'}>
                <a
                  id={`stake-nav-link`}
                  className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                  {i18n._(t`Seance`)}
                </a>
              </Link>
              )}

              { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/stake'}>
                <a
                  id={`stake-nav-link`}
                  className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                  {i18n._(t`Stake`)}
                </a>
              </Link>
              )} */}

              {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/docs'}>
                <a
                  id={`links-nav-link`}
                  className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                  {i18n._(t`Docs`)}
                </a>
              </Link>
              )} */}

              { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                <Link href={'/tools'}>
                <a
                  id={`tools-nav-link`}
                  className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                  {i18n._(t`More`)}
                </a>
              </Link>
              )}


                    {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      <Link href={'/scarab/create'}>
                  <a
                    id={`scarab-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                    {i18n._(t`Scarab`)}
                  </a>
                </Link>
                )} */}

                {/* { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <Link href={'/charts'}>
                    <a
                      id={`charts-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Analytics`)}
                    </a>
                  </Link>
                )}
                
                { chainId && [ChainId.MAINNET, ChainId.BSC, ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <Link href={'/bridge'}>
                    <a
                      id={`bridge-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Bridge`)}
                    </a>
                  </Link>
                )} */}

                    {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      <Link href={'/user'}>
                  <a
                    id={`history-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                    {i18n._(t`Dashboard`)}
                  </a>
                </Link>
                )} */}
                {/* <Link href={'/vaults'}>
                  <a
                    id={`vaults-nav-link`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Vaults`)}
                  </a>
                </Link> */}
                {/* <Link href={'/bridge'}>
                  <a className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap">
                    {i18n._(t`Bridge`)}
                  </a>
                </Link> */}
                {/* {chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <>
                    <Link href={'/lend'}>
                      <a
                        id={`lend-nav-link`}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {i18n._(t`Lend`)}
                      </a>
                    </Link>

                    <Link href={'/borrow'}>
                      <a
                        id={`borrow-nav-link`}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {i18n._(t`Borrow`)}
                      </a>
                    </Link>
                  </>
                )} */}
                  {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <Link href={'/summoner'}>
                    <a
                      id={`farm-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Summon`)}
                    </a>
                  </Link>
                  )} */}
                  {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                      <ExternalLink
                      id={`analytics-nav-link`}
                      href={ANALYTICS_URL[chainId] || 'https://analytics.soulswap.finance'}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Analytics`)}
                    </ExternalLink>
                  )} */}

                  {/* { chainId && [ChainId.FANTOM, ChainId.FANTOM_TESTNET].includes(chainId) && (
                  <Link href={'/ifo'}>
                    <a
                      id={`stake-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Ifo`)}
                    </a>
                  </Link>
                )} */}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  )
}

export default AppBar
