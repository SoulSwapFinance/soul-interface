import { Dialog, Transition } from '@headlessui/react'
import { MenuAlt1Icon } from '@heroicons/react/outline'
import { NATIVE } from 'sdk'
import useMenu from 'components/Header/useMenu'
import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import useIsCoinbaseWallet from 'hooks/useIsCoinbaseWallet'
import { useActiveWeb3React } from 'services/web3'
import { useETHBalances } from 'state/wallet/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC, Fragment, useState } from 'react'

import { SidebarItem } from './SidebarItem'
// import { NavigationItem } from './NavigationItem'
import LuxorStats from 'components/LuxorStats'
import TokenStats from 'components/TokenStats'
import More from './More'
import useBar from './useBar'
import { useRouter } from 'next/router'
import { classNames } from 'functions/styling'
import { getChainColor } from 'constants/chains'
import { NavigationItem } from './NavigationItem'
import LanguageSwitch from 'components/LanguageSwitch'
// const HEADER_HEIGHT=24

const Mobile: FC = () => {
  const menu = useMenu()
  const bar = useBar()
  const router = useRouter()
  const isLuxor = router.asPath.startsWith('/luxor')

  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)
  // const isCoinbaseWallet = useIsCoinbaseWallet()

  return (
    <>
      <header className="w-full flex mt-3 items-center justify-between min-h-[48px] h-[48px] px-4">
        <div className="flex justify-between flex-grow">
          <div className="mt-5 rounded-full">
            <MenuAlt1Icon width={24} className={classNames(isLuxor ? "hover:text-yellow" : `hover:text-[${getChainColor(chainId)}]`, `text-[${getChainColor(chainId)}]`, "cursor-pointer hover:text-white")} onClick={() => setOpen(true)} />
          </div>
          <div
              className="flex gap-3 px-1 sm:gap-4 md:gap-18 justify-between items-center">
              {menu.map((node) => {
                return <NavigationItem node={node} key={node.key} /> 
              })}
            </div>
          <div className="flex items-center w-12 mr-1">
            <Link href="/landing" passHref={true}>
              <Image src="/logo.png" alt="logo" width="32px" height="32px" />
            </Link>
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-20 overflow-hidden" onClose={setOpen} unmount={false}>
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
                    <div className={classNames("flex flex-col h-full py-2 overflow-x-hidden overflow-y-scroll shadow-xl", "bg-dark-1100")}>
                    <nav className="flex-1 bg-dark-1000 pl-6" aria-label="Sidebar">
                        {bar.map((node) => {
                          return <SidebarItem node={node} key={node.key} />
                        })}
                      </nav>
                      <div className="flex flex-col mt-2 gap-4 px-6">
                        {/* {library && (library.provider.isMetaMask || isCoinbaseWallet) && (
                          <div className="hidden sm:flex">
                          <Web3Network />
                          </div>
                        )} */}

                        <div className="flex items-center justify-start gap-2">
                          {/* <div className="flex items-center w-auto text-sm font-bold border-2 rounded shadow cursor-pointer pointer-events-auto select-none border-dark-800 hover:border-dark-700 bg-dark-900 whitespace-nowrap">
                            {account && chainId && userEthBalance && (
                              <Link href={`/account/${account}`} passHref={true}>
                                <a className="hidden px-3 text-high-emphesis text-bold md:block">
                                  {userEthBalance?.toSignificant(4)} {NATIVE[chainId || 250].symbol}
                                </a>
                              </Link>
                            )}
                            <Web3Status />
                          </div> */}
                        </div>
                        <div className="cols flex-cols-2 inline-block">
                  <Web3Network />
                </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 xl:w-auto bg-dark-1000 hover-bg-dark-900 xl:relative xl:p-0 xl:bg-transparent">
          <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
            {/* {library && library.provider.isMetaMask && ( */}
              <div className="sm:inline-block">
                <LuxorStats />
              </div>
            {/* )} */}
            {/* {library && library.provider.isMetaMask && ( */}
              <div className="sm:inline-block">
                <TokenStats />
              </div>
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
                <div className="inline-block">
                  <More />
                </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
{/* <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} /> */}


export default Mobile