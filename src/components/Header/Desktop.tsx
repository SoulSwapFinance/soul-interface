import { Dialog, Transition } from '@headlessui/react'
import BarsIcon from 'components/Icons/header/BarsIcon'
import Image from 'next/image'
import { ChainId, NATIVE } from 'sdk'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
// import { useETHBalances } from 'state/wallet/hooks'
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
import { useRouter } from 'next/router'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
import DropletIcon from 'components/Icons/header/DropletIcon'
import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
import BinocularsIcon from 'components/Icons/header/BinocularsIcon'
import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
import SoulIcon from 'components/Icons/header/SoulIcon'
// import NavLink from 'components/NavLink'

// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
// import Image from 'next/image'
// import { useRouter } from 'next/router'

const HEADER_HEIGHT = 64

const Desktop: FC = () => {
  const menu = useMenu()
  const router = useRouter()
  const bar = useBar()
  const { asPath } = useRouter()
  // const mobile = useMobileMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)

  const swapRoute = useCallback(() => {
    router.push(`/exchange/swap`)
  }, [])

  const WHITE = `#FFFFFF`
  const R = `#FF0000`
  const O = `#FFA500`
  const Y = `#FFFF00`
  const G = `#008000`
  const B = `#0000FF`
  const I = `#811FFF`
  const V = `#EE82EE`
  const CHAKRAS = [R, O, Y, G, B, I, V]

  const SOUL_ICON = <SoulIcon
    height={'600px'}
    width={'600px'}
  />

  const DEFAULT_ICON = <BarsIcon
    fillPrimary={open ? WHITE : getChainColor(chainId)}
    fillSecondary={open ? getChainColor(chainId) : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const HOME_ICON = <HomeIcon
    fillPrimary={open ? WHITE : CHAKRAS[0]}
    fillSecondary={open ? CHAKRAS[0] : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const DROPLET_ICON = <DropletIcon
    fillPrimary={WHITE}
    fillSecondary={CHAKRAS[1]}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const SWAP_ICON = <SwapIcon
    fillPrimary={open ? WHITE : getChainColor(chainId)}
    fillSecondary={open ? getChainColor(chainId) : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const SUN_ICON = <SunMoonIcon
    fillPrimary={open ? CHAKRAS[2] : WHITE}
    fillSecondary={open ? WHITE : CHAKRAS[2]}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const EARN_ICON = <SeedlingIcon
    fillPrimary={open ? WHITE : CHAKRAS[3]}
    fillSecondary={open ? CHAKRAS[3] : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const WALLET_ICON = <WalletIcon
    fillPrimary={open ? WHITE : CHAKRAS[4]}
    fillSecondary={open ? CHAKRAS[4] : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const EXPLORE_ICON = <BinocularsIcon
    fillPrimary={open ? WHITE : CHAKRAS[5]}
    fillSecondary={open ? CHAKRAS[5] : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const LEND_ICON = <LendSkullIcon
  fillPrimary={open ? CHAKRAS[6] : WHITE}
  fillSecondary={open ? WHITE : CHAKRAS[6]}
  className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
/>

  const removePage = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
  const addPage = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
  const poolPage = asPath.startsWith('/pool') || asPath.startsWith('/pools')
  const swapPage = asPath.startsWith('/swap') || asPath.startsWith('/exchange/swap')
  const crossPage = asPath.startsWith('/cross') || asPath.startsWith('/exchange/cross')
  const bondPage = asPath.startsWith('/bonds')
  const landingPage = asPath.startsWith('/landing')
  const lendPage = asPath.startsWith('/lend') || asPath.startsWith('/borrow')

  const isFarm = asPath.startsWith('/farm') || asPath.startsWith('/summoner')
  const isVault = asPath.startsWith('/autostake')
  const isLuxor = asPath.startsWith('/luxor') || asPath.startsWith('/luxor/dashbord') || asPath.startsWith('/luxor/bonds') || asPath.startsWith('/luxor/stake')

  const isLiquidity = removePage || addPage || poolPage
  const isHome = landingPage
  const isLend = lendPage
  // const isExplore = explorePage
  const isExplore = asPath.startsWith('/explore')
  const isWallet = asPath.startsWith('/balances') || asPath.startsWith('/portfolio')
  const isEarn = isFarm || bondPage || isVault
  const isExchange = swapPage || crossPage

  const pageIcon =
    isExchange ? SWAP_ICON
      : isEarn ? EARN_ICON
        : isWallet ? WALLET_ICON
          : isHome ? HOME_ICON
            : isLiquidity ? DROPLET_ICON
              : isLuxor ? SUN_ICON
                : isExplore ? EXPLORE_ICON
                  : isLend ? LEND_ICON
                    : DEFAULT_ICON

  return (
    <>
      <header className="w-full flex items-center text-white bg-dark-1000 justify-center min-h-[48px] h-[48px] px-2">

        <nav
          className={classNames(
            `backdrop-blur-fallback w-full \
              h-full before:backdrop-saturate-[1.2] \
              before:backdrop-blur-[20px] before:z-[-1] \
              before:absolute before:w-full before:h-full mx-4`
          )
          }>
          <div className="flex p-1 justify-between flex-grow">
            <div
              className={`grid grid-cols-2 gap-2`}
            >
              <div
                className={`p-1 hover:bg-dark-900 mt-1 bg-dark-1000 rounded rounded-xl border-[${getChainColor(chainId)}]`}
                onClick={() => { setOpen(true) }}
              > {pageIcon} 
              </div>
              <div
                className={`p-1 hover:bg-dark-900 mt-1 bg-dark-1000 rounded rounded-xl border-[${getChainColor(chainId)}]`}
                onClick={swapRoute}
              > {SOUL_ICON}
              </div>
            </div>
            <div
              className="flex rounded rounded-xl bg-dark-900 gap-1 px-1 sm:gap-4 md:gap-18 justify-center items-center">
              {menu.map((node) => {
                return <NavigationItem node={node} key={node.key} />
              })}
            </div>
          </div>
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
                  <div className="max-w-sm">
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
        {/* WALLET ICON */}
        <div
          className={`relative top-0 right-2 rounded rounded-xl inline-block`}
        >
          <Web3Status />
        </div>
        {/* NETWORK ICON */}
        <div className={`relative top-0 right-0 rounded rounded-lg inline-block border border-1 p-1 border-[${getChainColor(chainId)}]`}>
          <Web3Network />
        </div>
        <div className={`fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full rounded rounded-xl xl:bg-transparent`}>
          {/* xl:relative // moves to top */}
          <div className="flex items-center w-full space-x-2 justify-end">
            <div className={`w-auto grid gap-1.5 items-center rounded rounded-xl bg-dark-1000  border-[${getChainColor(chainId)}] whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}>
              {/* MORE [...] ICON */}
              <div className={`rounded rounded-md inline-block`}>
                <More />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
<div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />

export default Desktop