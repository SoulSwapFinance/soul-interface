import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'

import { ChainId, NATIVE } from 'sdk'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'
import React, { FC, Fragment, useCallback, useState } from 'react'
import { NavigationItem } from './NavigationItem'
import { SidebarItem } from './SidebarItem'
import TokenStats from 'components/TokenStats'
import More from './More'
import Container from 'components/Container'
import useMenu from './useMenu'
import useBar from './useBar'
import { classNames } from 'functions'
import Web3Network from 'components/Web3Network'
import LanguageMenu from './useLanguages'
import { getChainColor, getChainColorCode } from 'constants/chains'

// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
// import Image from 'next/image'
// import { useRouter } from 'next/router'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  const bar = useBar()
  // const mobile = useMobileMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)
  // const [showMenu, setShowMenu] = useState(false)
  // const router = useRouter()
  // const handleShowMenu = useCallback(() => {
  //   setSho
  // }, [setShowMenu])

  return (
    <>
      <header className="w-full flex items-center text-white bg-dark-1000 justify-center min-h-[48px] h-[48px] px-4">
        <div className="flex ml-4 justify-between flex-grow">
          <div className={`p-1 bg-${getChainColorCode(chainId)} rounded-full hover:bg-dark-800`}>
            {/* <div className="flex p-2 justify-between"> */}
            <Bars3Icon width={24} className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `bg-${getChainColorCode(chainId)} cursor-pointer rounded rounded-xl` : `hidden`)} onClick={() => setOpen(true)} />
          </div>
          {/* <div className="flex w-6 mr-4 items-center">
                  <NavLink href="/landing">
                    <Image src="/logo.png" alt="Soul" width="48" height="48" />
                  </NavLink>
              </div> 
          */}
        </div>
        <nav
          className={classNames(
            `backdrop-blur-fallback w-full \
              h-full before:backdrop-saturate-[1.2] \
              before:backdrop-blur-[20px] before:z-[-1] \
              before:absolute before:w-full before:h-full mx-4`
          )
          }>
          <Container maxWidth="3xl" className="rounded rounded-4xl text-center items-center justify-center">
            <div
              className="flex rounded rounded-xl gap-1 px-1 sm:gap-4 md:gap-18 justify-center items-center">
              {menu.map((node) => {
                return <NavigationItem node={node} key={node.key} />
              })}
            </div>
          </Container>
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
                  <div className="w-screen max-w-sm">
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
                      </div>
                      <div className="flex items-center justify-start">
                        <LanguageMenu />
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        {/* WALLET ICON */}
        <div
          className={`relative top-0 right-2 border border-[${getChainColor(chainId)}] border-2 rounded rounded-xl inline-block`}
        >
          <Web3Status />
        </div>
        {/* NETWORK ICON */}
        <div className={`relative top-0 right-0 rounded rounded-lg inline-block border border-2 border-[${getChainColor(chainId)}]`}>
          <Web3Network />
        </div>
        <div className={`fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full rounded rounded-xl xl:bg-transparent`}>
          {/* xl:relative // moves to top */}
          <div className="flex items-center w-full space-x-2 justify-end">
            {/* <div
              className={`border border-[${getChainColor(chainId)}] border-2 rounded rounded-xl inline-block`}
            >
              <Web3Status />
            </div> */}
            <div className={`w-auto grid gap-1.5 items-center rounded rounded-xl bg-dark-1000  border-[${getChainColor(chainId)}] whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}>
              {/* {account && chainId && userEthBalance && (
                <>
                  <div className="flex px-2 py-2 text-primary text-bold">
                    {userEthBalance?.toSignificant(4)
                      .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    {NATIVE[chainId].symbol}
                  </div>
                </>
              )} */}
              {/* MORE [...] ICON */}
              <div className={`rounded rounded-md inline-block border border-2 border-[${getChainColor(chainId)}]`}>
                <div className="inline-block justify-center m-1 mr-2">
                  <More />
                </div>
              </div>
              {/* WALLET ICON */}
              {/* <div className={showMenu && account ? `rounded rounded-md inline-block border border-[${getChainColor(chainId)}]` : `hidden`}>
                <Web3Status />
              </div> */}
              {/* NETWORK ICON */}
              {/* <div className={showMenu ? `rounded rounded-md p-2 inline-block border border-2 border-[${getChainColor(chainId)}]` : `hidden`}>
                <Web3Network />
              </div> */}
              {/* FLAG ICON
              <div className={showMenu ? `rounded rounded-md inline-block border border-2 border-[${getChainColor(chainId)}]` : `hidden`}>
                <LanguageMenu />
              </div> */}
              {/* <div
                className={`grid grid-cols items-center justify-center w-full h-8 bg-dark-800 border border-2 border-[${getChainColor(chainId)}] rounded rounded-xl`}
                > */}
              {/* <div
                className={
                  showMenu
                    ? `hidden`
                    : `grid grid-col items-center justify-center w-12 h-8 bg-dark-1000 border border-2 border-[${getChainColor(chainId)}] rounded rounded-lg`
                }>
                <Image
                  alt={"bars arrow up icon"}
                  src={BarsArrowUpIcon}
                  height={20}
                  width={20}
                  onClick={() => setShowMenu(true)}
                />
              </div>
              <div
                className={
                  showMenu
                    ? `grid grid-col items-center justify-center w-full h-8 bg-dark-1000 border border-[${getChainColor(chainId)}] rounded rounded-lg`
                    : `hidden`
                }>
                <Image
                  alt={"bars arrow up icon"}
                  src={BarsArrowDownIcon}
                  height={20}
                  width={20}
                  onClick={() => setShowMenu(false)}
                />
              </div> */}
              {/* // className="inline-block ml-1 justify-center h-4" */}
              {/* <BarsArrowUpIcon className="inline-block ml-1 justify-center h-4" /> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
<div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />

export default Desktop