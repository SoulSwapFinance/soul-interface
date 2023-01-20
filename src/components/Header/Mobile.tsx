
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { ChainId, NATIVE } from 'sdk'
import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import { useActiveWeb3React } from 'services/web3'
import React, { FC, Fragment, useCallback, useState } from 'react'
import { SidebarItem } from './SidebarItem'
import TokenStats from 'components/TokenStats'
import useBar from './useBar'
import { classNames } from 'functions/styling'
import { getChainColor, getChainColorCode } from 'constants/chains'
import LanguageMenu from './useLanguages'
import MobileBar from './MobileBar'
import BinocularsIcon from 'components/Icons/header/BinocularsIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import DropletIcon from 'components/Icons/header/DropletIcon'
import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import BarsIcon from 'components/Icons/header/BarsIcon'
import { useRouter } from 'next/router'
import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
import SoulIcon from 'components/Icons/header/SoulIcon'
import DocsIcon from 'components/Icons/mobile/DocsIcon'
import NftIcon from 'components/Icons/mobile/NftIcon'

const Mobile: FC = () => {
  // const menu = useMenu()
  const bar = useBar()
  const router = useRouter()
  const { asPath } = useRouter()
  // const isLuxor = router.asPath.startsWith('/luxor')

  const { chainId } = useActiveWeb3React()
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [open, setOpen] = useState(false)

  const swapRoute = useCallback(() => {
    router.push(`/exchange/swap`)
  }, [])

  const WHITE = `#FFFFFF`
  // const R = `#FF0000`
  // const O = `#FFA500`
  // const Y = `#FFFF00`
  // const G = `#008000`
  // const B = `#0000FF`
  // const I = `#811FFF`
  // const V = `#EE82EE`
  // const CHAKRAS = [R, O, Y, G, B, I, V]
  const chainColor = getChainColor(chainId)

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
    fillPrimary={open ? WHITE : chainColor}
    fillSecondary={open ? chainColor : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const DROPLET_ICON = <DropletIcon
    fillPrimary={WHITE}
    fillSecondary={chainColor}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const SWAP_ICON = <SwapIcon
    fillPrimary={open ? WHITE : getChainColor(chainId)}
    fillSecondary={open ? getChainColor(chainId) : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const SUN_ICON = <SunMoonIcon
    fillPrimary={open ? chainColor : WHITE}
    fillSecondary={open ? WHITE : chainColor}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const EARN_ICON = <SeedlingIcon
    fillPrimary={open ? WHITE : chainColor}
    fillSecondary={open ? chainColor : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const WALLET_ICON = <WalletIcon
    fillPrimary={open ? WHITE : chainColor}
    fillSecondary={open ? chainColor : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />
  
  const EXPLORE_ICON = <BinocularsIcon
  fillPrimary={open ? WHITE : chainColor}
  fillSecondary={open ? chainColor : WHITE}
  className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />
  
  const LEND_ICON = <LendSkullIcon
    fillPrimary={open ? chainColor : WHITE}
    fillSecondary={open ? WHITE : chainColor}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />
  
  const DOCS_ICON = <DocsIcon
    fillPrimary={open ? WHITE : chainColor}
    fillSecondary={open ? chainColor : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-7 h-7` : `hidden`)}
  />

  const NFT_ICON = <NftIcon
    fillPrimary={open ? chainColor : WHITE}
    fillSecondary={open ? WHITE : chainColor}
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
  const nftPage = asPath.startsWith('/marketplace') || asPath.startsWith('/marketplace/collections')
  const docsPage = asPath.startsWith('/learn')

  const isFarm = asPath.startsWith('/farm') || asPath.startsWith('/summoner')
  const isVault = asPath.startsWith('/autostake')
  const isLuxor = asPath.startsWith('/luxor') || asPath.startsWith('/luxor/dashbord') || asPath.startsWith('/luxor/bonds') || asPath.startsWith('/luxor/stake')

  const isLiquidity = removePage || addPage || poolPage
  const isHome = landingPage
  const isLend = lendPage
  const isDocs = docsPage
  const isNFT = nftPage
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
                    : isDocs ? DOCS_ICON
                      : isNFT ? NFT_ICON
                        : DEFAULT_ICON

  return (
    <>
      <header className="w-full flex mt-3 items-center justify-between min-h-[36px] h-[36px] px-4">
        <div className="flex justify-between flex-grow">

          <div
            className={`grid grid-cols-2 gap-2 `}
            onClick={() => { setOpen(true) }}
          >
              <div
                className={`p-1 hover:bg-dark-900 mt-1 bg-dark-1000 rounded rounded-xl border-[${getChainColor(chainId)}]`}
                onClick={() => { setOpen(true) }}
              > {pageIcon} 
              </div>
              {/* <div
                className={`p-1 hover:bg-dark-900 mt-1 bg-dark-1000 rounded rounded-xl border-[${getChainColor(chainId)}]`}
                onClick={swapRoute}
              > {SOUL_ICON}
              </div>           */}
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
                      <nav className="flex-1 " aria-label="Sidebar">
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
        <div className={`relative top-0 right-2 p-1.5 border border-[${getChainColor(chainId)}] rounded rounded-xl inline-block`}>
          <Web3Network />
        </div>
        {/* WALLET ICON */}
        <div
          className={`relative top-0 right-0 rounded rounded-xl inline-block`}
        >
          <Web3Status />
        </div>
        <MobileBar />
      </header>
    </>
  )
}
{/* <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} /> */ }


export default Mobile