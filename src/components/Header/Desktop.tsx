import React, { FC, Fragment, useState } from 'react'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import { Dialog, Transition } from '@headlessui/react'
import { SidebarItem } from './SidebarItem'
// import Image from 'next/image'
import useBar from './useBar'
import { classNames } from 'functions'
import { getChainColor } from 'constants/chains'
import DesktopBar from './DesktopBar'
import LanguageMenu from './useLanguages'
import BarsIcon from 'components/Icons/header/BarsIcon'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const bar = useBar()
  const { chainId } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  // const SOUL_ICON = 
  // <div className={`flex gap-2 mr-2 ml-2`}>
  //   <Image
  //     // src={'/favicon.png'} 
  //     src={`/favicon.ico`}
  //     height={72} width={72}
  //     objectFit="contain"
  //     alt={"soulswap logo"}
  //   />

  //   <Image
  //       // src={'/favicon.png'} 
  //       src={`/SoulSwap-Banner.png`}
  //       height={72} width={224}
  //       objectFit="contain"
  //       alt={"soulswap text banner"}
  //   />
  // </div>

  return (
    <div className={`flex w-full`}>
      <header className={`w-full flex items-center text-white justify-between min-h-[36px] h-[36px] m-1`}>
        {/* <Image
        src={`/title-logo.png`}
        height={300}
        width={300}
        alt={"title logo"}
        /> */}
        <div
          className={`flex bg-dark-1000 mt-6 rounded border p-1.5 border-[${getChainColor(chainId)}] hover:border-2 hover:border-purple rounded-2xl`}
          onClick={() => setOpen(true)}
        >
          
          {/* {SOUL_ICON} */}
          <BarsIcon
              fillPrimary={open ? `${getChainColor(chainId)}` : `#FFFFFF`}
              fillSecondary={open ? `#FFFFFF` : `${getChainColor(chainId)}`}
              className={'w-7 h-7'}
          />
        </div>
        {/* <nav
          className={classNames(`flex mt-6 w-full mx-4`
          )
            // `backdrop-blur-fallback w-full \
            //   h-full before:backdrop-saturate-[1.2] \
            //   before:backdrop-blur-[20px] before:z-[-1] \
            //   before:absolute before:w-full before:h-full mx-4`
          // }>
          {/* <div className={`flex justify-center bg-dark-1000 flex-grow border border-4 border-ftmBlue rounded rounded-2xl`}>
            <div
              className={`flex rounded rounded-2xl bg-dark-1000 gap-1 sm:gap-6 md:gap-18 justify-center items-center`}>
              {menu.map((node) => {
                return <NavigationItem node={node} key={node.key} />
              })}
            </div>
          </div> */}
        {/* </nav> */}

        <Transition.Root
          show={open}
          as={Fragment}>
          <Dialog as="div" className={classNames(`fixed inset-0 overflow-hidden z-20`)} onClose={setOpen}>
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

              <div className={`fixed inset-y-0 left-0 pr-16 max-w-[260px] flex`}>
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
                      <nav className="flex-1 " aria-label="Sidebar">
                        {bar.map((node) => {
                          return <SidebarItem node={node} key={node.key} />
                        })}
                      </nav>
                      <div className="flex items-center justify-start">
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
          {/* <div
            className={`relative top-1.5 right-2 p-0.5 mt-1 bg-dark-1000 border border-[${getChainColor(chainId)}] hover:border-2 hover:border-purple rounded rounded-2xl inline-block`}
          > */}
        <div
          className={`flex bg-dark-1000 mt-6 rounded border p-1.5 border-[${getChainColor(chainId)}] hover:border-2 hover:border-purple rounded-2xl`}
          onClick={() => setOpen(true)}
        >
            <Web3Status 
            />
          </div> 
      </header>
      <DesktopBar />
      </div>
  )
}
<div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />

export default Desktop