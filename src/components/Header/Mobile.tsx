import { Dialog, Transition } from '@headlessui/react'
import { MenuIcon } from '@heroicons/react/outline'
import { NATIVE } from 'sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances, useTokenBalance } from 'state/wallet/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC, Fragment, useState } from 'react'

import { NavigationItem } from './NavigationItem'
import TokenStats from 'components/TokenStats'
import LuxorStats from 'components/LuxorStats'
import More from './More'
import NavLink from 'components/NavLink'
import { AURA } from 'constants/tokens'
import Container from 'components/Container'
import LanguageSwitch from 'components/LanguageSwitch'
import { NAV_CLASS } from './styles'
import useMobileMenu from 'components/Header/useMobileMenu'
import useMenu from 'components/Header/useMenu'

const HEADER_HEIGHT = 64

const Mobile: FC = () => {
  const menu = useMenu()
  const mobileMenu = useMobileMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  
  const [open, setOpen] = useState(false)

  const isCbWallet =
    connector instanceof WalletLinkConnector ||
    (connector instanceof InjectedConnector && window.walletLinkExtension) ||
    window?.ethereum?.isCoinbaseWallet

  return (
    <>      
    <header className="flex flex-row mr-4 ml-4 justify-center w-screen flex-nowrap">
    {/* <div className="flex items-center justify-between">
          </div> */}
        {/* <div className="flex p-2 justify-between"> */}
            {/* <MenuIcon width={20} className="hover:text-white text-white cursor-pointer" onClick={() => setOpen(true)} /> */}
          <nav className={NAV_CLASS}>
          <Container maxWidth="xl" className="mx-auto">
            <div className="flex gap-1 px-4 items-center justify-between">
                {mobileMenu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
                  {/* <LanguageSwitch /> */}
                </div>
          </Container>
        </nav>
        {/* </div> */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 overflow-hidden z-20" onClose={setOpen}>
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
                <Dialog.Overlay className="absolute inset-0 bg-dark-1000 bg-opacity-80 transition-opacity" />
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
                >
                  <div className="w-screen max-w-sm">
                    <div className="h-full flex flex-col py-6 bg-dark-800 shadow-xl overflow-y-scroll overflow-x-hidden">
                      <nav className="flex-1 pl-6" aria-label="Sidebar">
                        {menu.map((node) => {
                          return <NavigationItem node={node} key={node.key} />
                        })}
                      </nav>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 xl:w-auto bg-dark-1000 xl:relative xl:p-0 xl:bg-transparent">
          <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
            {library && library.provider.isMetaMask && (
              <div className="sm:inline-block">
                <LuxorStats />
              </div>
            )}
            {library && library.provider.isMetaMask && (
              <div className="sm:inline-block">
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
      </header>
    </>
  )
}
<div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />

export default Mobile