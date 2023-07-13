
import { Dialog, Transition } from '@headlessui/react'
import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import React, { FC, Fragment, useCallback, useState } from 'react'
import { SidebarItem } from './SidebarItem'
import useBar from './useBar'
import { classNames } from 'functions/styling'
import { getChainColor, getChainColorCode } from 'constants/chains'
import MobileBar from './MobileBar'
import { useRouter } from 'next/router'
import Image from 'next/image'
import LanguageMenu from './useLanguages'
import TokenStats from 'components/TokenStats'

const Mobile = () => {
  // const menu = useMenu()
  const bar = useBar()
  const router = useRouter()
  // const { asPath } = useRouter()
  // const isLuxor = router.asPath.startsWith('/luxor')

  const { account, chainId } = useActiveWeb3React()
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)
  // const [dropdown, setShowDropdown] = useState(false)

  const swapRoute = useCallback(() => {
    router.push(`/exchange/swap`)
  }, [])
  
  const SOUL_ICON = 
  <div className={`flex gap-2 mr-2 ml-2`}>
    <Image
        // src={'/favicon.png'} 
        src={`/SoulSwap-Banner.png`}
        height={36} width={196}
        // objectFit="contain"
        alt={"soulswap banner"}
    />
  </div>

  return (
    <>
      {/* <header className="w-full flex items-center justify-between border-2 border-ftmBlue min-h-[42px] h-[42px] px-2 bg-purple"> */}
      <header className={`w-full flex items-center text-white justify-between min-h-[36px] h-[36px] m-1`}>
        <div className={`flex justify-between flex-grow`}>
      <div 
          className={`flex bg-dark-1000 mt-6 p-1.5 border-2 border-dark-800 hover:border-purple rounded-2xl`}
        // className={`flex bg-dark-900 mt-6 rounded border p-1.5 border-[${getChainColor(chainId)}] hover:border-2 hover:border-purple rounded-2xl`}
        // className={`absolute left-1 top-1.5 bg-dark-900 rounded border-2 border-ftmBlue hover:border-purple rounded-2xl p-1`}
        // onClick={() => swapRoute()}
        onClick={() => { swapRoute() }}
      >
      {SOUL_ICON}
      {/* {DEFAULT_ICON} */}
      </div>
          {/* <div
            className={`hover:bg-dark-900 p-1 bg-dark-1000 border-2 rounded rounded-2xl 
                border border-[${getChainColor(chainId)}]
                hover:border-purple
                absolute left-2 top-2
                `}
            onClick={() => { setOpen(true) }}
            // onClick={swapRoute}
          >
            // {DEFAULT_ICON}
          </div> */}
        </div>
        {/* <div className={`absolute left-14 top-1.5 border-2 border-[${getChainColor(chainId)}] bg-dark-1000 hover:border-purple rounded rounded-2xl justify-start bg-dark-1000`}>
          <TokenStats />
        </div> */}
        {/* <div
                className={`p-1 hover:bg-dark-900 mt-1 bg-dark-1000 rounded rounded-xl border-[${getChainColor(chainId)}]`}
                onClick={swapRoute}
              > {SOUL_ICON}
              </div>          
        */}
        {/* </div> */}
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
                <Dialog.Overlay className="absolute inset-0 transition-opacity bg-dark-1000 bg-opacity/80" />
              </Transition.Child>
              <div className="fixed inset-y-0 left-0 pr-8 sm:pr-10 max-w-[260px] flex">
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
                  <div className="max-w-sm">
                    <div className={classNames("flex flex-col h-full py-2 overflow-x-hidden overflow-y-scroll shadow-xl", "bg-dark-1100")}>
                      <nav className={`flex-1 bg-dark-900 rounded-2xl`} aria-label="Sidebar">
                        {bar.map((node) => {
                          return <SidebarItem node={node} key={node.key} />
                        })}
                      </nav>
                      <div className={`grid p-0 mt-0.5 items-center justify-center bg-dark-900 rounded-2xl`}>
                      <LanguageMenu />
                      </div>
                      {/* <div className="flex w-full justify-center inline-block rounded rounded-xl bg-dark-1000">
                        {[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) &&
                          <TokenStats />
                        }
                        <div className="flex items-center justify-start">
                          <LanguageMenu />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div
          // className={`grid grid-cols-2 gap-1 mt-6 bg-dark-1000 p-1.5 rounded-2xl`}
          className={`grid grid-cols-3 gap-1 mt-6 bg-dark-1000 p-1.5 rounded-2xl`}
          // onClick={() => setOpen(true)}
        >
            <div
              className={`border-2 ${account ? `border-purple` : `border-avaxRed animate-pulse`} hover:border-purple rounded-2xl`}
            >
              <Web3Status />
            </div>
            {/* TOKEN STATS */}
          <div
            className={`border-2 border-purple rounded-2xl`}
            >
            <TokenStats />
          </div>
              {/* NETWORK ICON */}
            <div
              className={`border-2 ${chainId ? `border-[${getChainColor(chainId)}]` : `border-dark-800`} hover:border-purple p-2 rounded-2xl`}
            >
                <Web3Network />
            </div>
          </div> 
        { /* account &&
        <div
          className={
            classNames(`hover:bg-dark-900 p-1.5 rounded-2xl mt-1.5
                border border-[${getChainColor(chainId)}]
                border-2
                bg-dark-1000
                hover:border-purple
                `,
              dropdown ? `relative top-1.5 right-2` : `relative top-1.5 right-0`)}
          // onClick={() => { setOpen(true) }}
          onClick={() =>
            dropdown ?
              setShowDropdown(false)
              : setShowDropdown(true)
          }
        >
          {dropdown ? RIGHT_ICON : LEFT_ICON}
        </div>
        }
        {!account &&
          <div
            className={`relative top-1.5 right-2 p-0.5 mt-0.5 bg-dark-1000 border border-[${getChainColor(chainId)}] border-2 hover:border-purple rounded-2xl inline-block`}
          >
            <Web3Status />
          </div>

        }
        {dropdown &&
          <div
            className={dropdown ? `grid grid-cols-2` : `hidden`}>
            {/* WALLET ICON  //
            <div
              className={`relative top-2 right-1 p-0.5 bg-dark-1000 border border-[${getChainColor(chainId)}] border-2 hover:border-purple rounded-2xl inline-block`}
            >
              <Web3Status />
            </div>
            {/* NETWORK ICON // 
            <div className={`relative top-2 right-0 p-1.5 bg-dark-1000 border border-[${getChainColor(chainId)}] border-2 hover:border-purple rounded-2xl inline-block`}>
              <Web3Network />
            </div>
          </div>
        } */}
        <MobileBar />
      </header>
    </>
  )
}
{/* <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} /> */ }


export default Mobile