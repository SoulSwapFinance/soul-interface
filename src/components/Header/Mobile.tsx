import { Dialog, Transition } from '@headlessui/react'
// import { Bars3Icon } from '@heroicons/react/24/outline'
// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'

import { ChainId, NATIVE } from 'sdk'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'
import React, { FC, Fragment, useCallback, useState } from 'react'
import Image from 'next/image'
// import { NavigationItem } from './NavigationItem'
import { SidebarItem } from './SidebarItem'
import TokenStats from 'components/TokenStats'
// import More from './More'
// import Container from 'components/Container'
import useMenu from './useMenu'
import useBar from './useBar'
import { useRouter } from 'next/router'
import { classNames } from 'functions'
import Web3Network from 'components/Web3Network'
import LanguageMenu from './useLanguages'
import { getChainColor, getChainColorCode } from 'constants/chains'
import MobileBar from './MobileBar'

const HEADER_HEIGHT = 64

const Mobile: FC = () => {
  const menu = useMenu()
  const bar = useBar()
  // const mobile = useMobileMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  // const handleShowMenu = useCallback(() => {
  //   setSho
  // }, [setShowMenu])

  return (
    <>
         <header className="w-full flex mt-3 items-center justify-between min-h-[36px] h-[36px] px-4">
      <div className="flex justify-between flex-grow">

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
              before:absolute before:w-full before:h-full mx-4`
          )
          }>
          {/* <Container maxWidth="3xl" className="rounded rounded-4xl text-center items-center justify-center">
            <div
              className="flex rounded rounded-xl gap-1 px-1 sm:gap-4 md:gap-18 justify-center items-center">
              {menu.map((node) => {
                return <NavigationItem node={node} key={node.key} />
              })}
            </div>
          </Container> */}
        </nav>

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

              <div className="fixed inset-y-0 left-0 pr-16 max-w-[260px] flex">
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
                  <div className="w-sm max-w-sm">
                    <div className={classNames("flex flex-col h-full py-1 overflow-x-hidden overflow-y-scroll shadow-xl",
                      "bg-dark-1100")}>
                      <nav
                        className={classNames("flex-1 py-12 bg-dark-1000 pl-6")} aria-label="Sidebar"
                      /* // className="flex-1 bg-dark-1000 pl-6" aria-label="Sidebar" */
                      >
                        {bar.map((node) => {
                          return <SidebarItem node={node} key={node.key} />
                        })}
                      </nav>
                      <div className="flex w-full justify-center inline-block rounded rounded-xl bg-dark-1000">
                        {[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
                          <TokenStats />
                        }
                      <div className="flex items-center justify-start">
                        <LanguageMenu />
                      </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* NETWORK ICON */}
        <div className={`relative top-0.5 right-2 border border-[${getChainColor(chainId)}] p-1 rounded rounded-lg inline-block`}>
          <Web3Network />
        </div>
        {/* WALLET ICON */}
        <div
          className={`relative top-0.5 right-0 rounded rounded-lg inline-block`}
        >
          <Web3Status />
        </div>
        <MobileBar />
      </header>
    </>
  )
}
<div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />

export default Mobile