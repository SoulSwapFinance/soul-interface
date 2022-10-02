import { Dialog, Transition } from '@headlessui/react'
import { MenuAlt1Icon } from '@heroicons/react/outline'
import { NATIVE } from 'sdk'
// import { InjectedConnector } from '@web3-react/injected-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances, useTokenBalance } from 'state/wallet/hooks'
import React, { FC, Fragment, useState } from 'react'
import Image from 'next/image'

import { NavigationItem } from './NavigationItem'
import { SidebarItem } from './SidebarItem'
import TokenStats from 'components/TokenStats'
import LuxorStats from 'components/LuxorStats'
import More from './More'
// import NavLink from 'components/NavLink'
// import { AURA } from 'constants/tokens'
import Container from 'components/Container'
// import LanguageSwitch from 'components/LanguageSwitch'
// import { NAV_CLASS } from './styles'
import useMenu from './useMenu'
import useBar from './useBar'
import NavLink from 'components/NavLink'
import { useRouter } from 'next/router'
import { classNames } from 'functions'
import Web3Network from 'components/Web3Network'
import Logo from 'components/Logo'
import { getChainColorCode } from 'constants/chains'
// import useMobileMenu from './useMobileMenu'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  const bar = useBar()
  // const mobile = useMobileMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const [open, setOpen] = useState(false)
  const router = useRouter()
  // const isLuxor = router.asPath.startsWith('/luxor')

  // const isCbWallet =
  //   connector instanceof WalletLinkConnector ||
  //   (connector instanceof InjectedConnector && window.walletLinkExtension) ||
  //   window?.ethereum?.isCoinbaseWallet

  return (
    <>
      <header className="w-full flex items-center text-white justify-center border border-dark-1000 min-h-[64px] h-[64px] px-4">
        <div className="flex justify-between flex-grow">
          <div className="p-1 bg-dark-900 rounded-full hover:bg-dark-800">
            {/* <div className="flex p-2 justify-between"> */}
            <MenuAlt1Icon width={24} className={classNames( [1, 250, 43114].includes(chainId) ? 'text-white cursor-pointer' : 'hidden' )} onClick={() => setOpen(true)} />
          </div>
          {/* <div className="flex w-6 mr-4 items-center">
                  <NavLink href="/landing">
                    <Image src="/logo.png" alt="Soul" width="48" height="48" />
                  </NavLink>
                </div> */}
        </div>
        <nav
          className={classNames(
            `backdrop-blur-fallback w-full \
              h-full before:backdrop-saturate-[1.2] \
              before:backdrop-blur-[20px] before:z-[-1] \
              before:absolute before:w-full before:h-full \
              border-b border-${getChainColorCode(chainId)} mx-4`)
              }>
              <Container maxWidth="3xl" className="rounded rounded-4xl text-center items-center justify-center">
            <div
              className="flex gap-1 px-1 sm:gap-4 md:gap-18 justify-left items-center">
              {menu.map((node) => {
                return <NavigationItem node={node} key={node.key} /> 
              })}
              {/* <LanguageSwitch /> */}
            </div>
            </Container>
        </nav>
        {/* <NavLink
          href="/landing"
        >
          <Logo
            srcs={['https://app.soulswap.finance/logo.png']}
            width={'50px'}
            height={'50px'}
          />
        </NavLink> */}

        <Transition.Root 
          show={open} 
            as={Fragment}>
          <Dialog as="div" className={classNames("fixed inset-0 overflow-hidden z-20")} onClose={setOpen}>
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 transition-opacity bg-dark-1000 bg-opacity-80" />
              </Transition.Child>

              <div className="fixed inset-y-0 left-0 pr-10 max-w-[260px] flex">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-[-100%]"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-[-100%]"
                  unmount={false}
                >
                  <div className="w-screen max-w-sm">
                    <div className={classNames("flex flex-col h-full py-1 overflow-x-hidden overflow-y-scroll shadow-xl",
                      "bg-dark-1100")}>
                      <nav className 
                        = {classNames( "flex-1 py-12 bg-dark-1000 pl-6" )} aria-label="Sidebar">
                        {bar.map((node) => {
                          return <SidebarItem node={node} key={node.key} />
                        })}
                      </nav>
                      <div className="flex items-center justify-start gap-2 mt-1">
                        {/* <div className="flex items-center w-auto text-sm font-bold border-2 rounded shadow cursor-pointer pointer-events-auto select-none border-dark-800 hover:border-dark-700 bg-dark-900 whitespace-nowrap">
                            {account && chainId && userEthBalance && (
                              <Link href={`/account/${account}`} passHref={true}>
                                <a className="hidden px-3 text-high-emphesis text-bold md:block">
                                  @ts-ignore
                                  {userEthBalance?.toSignificant(4)} {NATIVE[chainId || 250].symbol}
                                </a>
                              </Link>
                            )}
                            <Web3Status />
                          </div>, */}
                      </div>
                      <div className="cols w-full flex-cols-2 inline-block">
                        <Web3Network />
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full xl:w-auto bg-dark-1000 hover:bg-dark-900 xl:relative xl:p-0 xl:bg-transparent">
          <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
            {/* {library && library.provider.isMetaMask && ( */}
            { chainId == 250 &&
            <div className="sm:inline-block">
              <LuxorStats />
            </div>
            }
            {/* )} */}
            {/* {library && library.provider.isMetaMask && ( */}
         { chainId == 250 &&
            <div className="sm:inline-block">
              <TokenStats />
            </div>
         } 
            {/* )} */}
            <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
              {account && chainId && userEthBalance && (
                <>
                  <div className="hidden 2xl:flex px-2 py-2 text-primary text-bold">
                    {userEthBalance?.toSignificant(4)
                      .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    {NATIVE[chainId].symbol}
                  </div>
                </>
              )}
              {/* {library && library.provider.isMetaMask && ( */}
              <div className="inline-block">
                <Web3Status />
              </div>
              {/* )} */}
              {/* {library && library.provider.isMetaMask && ( */}
              {/* <div className="inline-block">
                  <Web3Network />
                </div> */}
              {/* )} */}
            </div>
            <More />
          </div>
        </div>
      </header>
    </>
  )
}
<div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />

export default Desktop