import React, { FC, Fragment, useCallback, useState } from 'react'
import Image from 'next/image'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'

// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
import More from './More'
// import Web3Network from 'components/Web3Network'
// import LanguageMenu from './useLanguages'
// import Web3Status from 'components/Web3Status'
import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
import Typography from 'components/Typography'
import { classNames } from 'functions/styling'
// import styled from 'styled-components'
// import { Container } from 'components'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { SidebarItem } from './SidebarItem'
import TokenStats from 'components/TokenStats'
import LanguageMenu from './useLanguages'
import useBar from './useBar'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import NavLink from 'components/NavLink'
import BookSparkles from 'components/Icons/mobile/BookSparkles'
import { currencyId } from 'functions/currency'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import VaultIcon from 'components/Icons/mobile/VaultIcon'
import CauldronIcon from 'components/Icons/mobile/CauldronIcon'
import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'

interface BarProps {
    inputCurrency?: Currency
    outputCurrency?: Currency
    allowedSlippage?: Percent
}

const MobileBar: FC<BarProps> = ({ inputCurrency, outputCurrency }) => {
    const router = useRouter()
    const { asPath } = useRouter()

    const { account, chainId, library } = useActiveWeb3React()
    const [open, setOpen] = useState(false)
    const bar = useBar()

    const typeStyle = `justify-center text-center w-full border border-[${getChainColor(chainId)}] rounded p-2`

    const swapRoute = useCallback(() => {
        router.push(`/exchange/swap`)
    }, [])
    const homeRoute = useCallback(() => {
        router.push(`/landing`)
    }, [])
    const lendRoute = useCallback(() => {
        router.push(`/lend`)
    }, [])
    const farmRoute = useCallback(() => {
        router.push(`/farm`)
    }, [])
    const bridgeRoute = useCallback(() => {
        router.push(`/bridge`)
    }, [])

    const swapPage = router.pathname.startsWith('/swap') || router.pathname.startsWith('/exchange')
    const landingPage = router.pathname.startsWith('/landing')
    const farmPage = router.pathname.startsWith('/farm') || router.pathname.startsWith('/summoner')
    const bondPage = router.pathname.startsWith('/bond') || router.pathname.startsWith('/bonds')
    const lendPage = router.pathname.startsWith('/lend') || router.pathname.startsWith('/borrow')
    const bridgePage = router.pathname.startsWith('/bridge')

    const isRemove = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
    const isAdd = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
    const isPool = isRemove || isAdd
    const isHome = landingPage
    const isLend = lendPage
    const isEarn = farmPage || bondPage

    const isExchangeAnalytics
        = asPath.startsWith('/exchange/analytics')
        || asPath.startsWith('/exchange/analytics/coffinbox')
        || asPath.startsWith('/exchange/analytics/dashboard')
        || asPath.startsWith('/exchange/analytics/pairs')
        || asPath.startsWith('/exchange/analytics/tokens')

    // const isBridge = router.pathname.startsWith('/bridge')

    // const isLimit = router.pathname.startsWith('/limit')
    //   || router.pathname.startsWith('/exchange/limit')

    // const isAggregator = asPath.startsWith('/aggregator')
    //   || asPath.startsWith('/exchange/aggregator')

    const isCross = router.pathname.startsWith('/cross')
        || router.pathname.startsWith('/exchange/cross')

    const isExchange = router.pathname.startsWith('/swap')
        || router.pathname.startsWith('/exchange/swap')

    // const useSettings = isExchange || isLimit || isPool

    const soulEnabled = [ChainId.FANTOM, ChainId.AVALANCHE, ChainId.ETHEREUM].includes(chainId)

    const activeStyle = `border border-[${getChainColor(chainId)}] rounded`
    const style = `text-secondary bg-white rounded rounded-xl border border-[${getChainColor(chainId)}]`
    const homeStyle = isHome ? activeStyle : style
    const swapStyle = isExchange ? activeStyle : style
    // const poolStyle = isPool ? activeStyle : style
    // const ecoStyle = isAggregator ? activeStyle : style
    // const bridgeStyle = isBridge ? activeStyle : style
    // const chartStyle = isExchangeAnalytics ? activeStyle : style
    // const crossStyle = isCross ? activeStyle : style

    return (
        <div>
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
                                <div className="ml-2 max-w-sm">
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

            <div className={`fixed bottom-0 left-auto z-10 flex flex-row items-center justify-center w-auto rounded rounded-xl`}>
                {/* xl:relative // moves to top */}
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`fixed bg-dark-1000 bottom-0 left-0 z-10 gap-1 flex justify-between items-center justify-center w-full`}>
                        <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isHome && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={homeRoute}
                        >
                            <BookSparkles
                                fillPrimary={isHome ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isHome ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-8 h-8'}
                            />
                        </div>
                        <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isExchange && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={swapRoute}
                        >
                            <SwapIcon
                                fillPrimary={isExchange ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isExchange ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-8 h-8'}
                            />
                        </div>
                        <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isEarn && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={farmRoute}
                        >
                            <CauldronIcon
                                fillPrimary={isEarn ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isEarn ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-8 h-8'}
                            />
                        </div>
                        <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isLend && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={lendRoute}
                        >
                            <LendSkullIcon
                                fillPrimary={isLend ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isLend ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-8 h-8'}
                            />
                        </div>
                        
                        <div className={`inline-block justify-center my-0.5 mr-2`}>
                            <More />
                        </div>
                        {/* <div className="flex items-center w-full space-x-2 justify-end"> */}
                        {/* <div className={`w-auto grid gap-0.5 items-center rounded rounded-lg bg-dark-1000 border-[${getChainColor(chainId)}] border- whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}> */}
                        {/* MORE [...] ICON */}
                        {/* <div className={showMenu ? `rounded rounded-md inline-block border border-2 border-[${getChainColor(chainId)}]` : `hidden`}>
                                    <div className="inline-block justify-center my-0.5 ml-2 mr-2">
                                        <More />
                                    </div>
                                </div>
                                <div
                                    className={
                                        showMenu
                                            ? `hidden`
                                            : `grid grid-col items-center my-0.5 justify-center mx-1 w-12 h-8 bg-dark-1000 border border-2 border-[${getChainColor(chainId)}] rounded rounded-lg`
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
                                            ? `grid grid-col items-center my-0.5 justify-center mx-1 w-12 h-8 bg-dark-1000 border border-2 border-[${getChainColor(chainId)}] rounded rounded-lg`
                                            : `hidden`
                                    }>
                                    <Image
                                        alt={"bars arrow down icon"}
                                        src={BarsArrowDownIcon}
                                        height={20}
                                        width={20}
                                        onClick={() => setShowMenu(false)}
                                    />
                                </div>
                            </div>

                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MobileBar