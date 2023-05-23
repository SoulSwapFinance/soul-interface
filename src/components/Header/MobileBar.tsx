import React, { FC, Fragment, useCallback, useState } from 'react'
// import Image from 'next/image'
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
// import Typography from 'components/Typography'
import { classNames } from 'functions/styling'
import { SidebarItem } from './SidebarItem'
import TokenStats from 'components/TokenStats'
import LanguageMenu from './useLanguages'
import useBar from './useBar'
// import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
import NftIcon from 'components/Icons/mobile/NftIcon'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
// import Web3Network from 'components/Web3Network'
// import Web3Status from 'components/Web3Status'
// import ChartIcon from 'components/Icons/exchange/ChartIcon'
// import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
// import DocsIcon from 'components/Icons/mobile/DocsIcon'
// import { useUserInfo } from "hooks/useAPI"

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

    // const typeStyle = `justify-center text-center w-full border border-[${getChainColor(chainId)}] rounded p-2`

    const swapRoute = useCallback(() => {
        router.push(`/swap`)
    }, [])
    const learnRoute = useCallback(() => {
        router.push(`/learn`)
    }, [])
    const walletRoute = useCallback(() => {
        router.push(`/portfolio`)
    }, [])
    const lendRoute = useCallback(() => {
        router.push(`/lend`)
    }, [])
    const farmRoute = useCallback(() => {
        router.push(`/farm`)
    }, [])
    const nftRoute = useCallback(() => {
        router.push(`/marketplace`)
    }, [])
    const dataRoute = useCallback(() => {
        router.push(`/analytics`)
    }, [])
    const luxorRoute = useCallback(() => {
        router.push(`/luxor`)
    }, [])

    const swapPage = router.pathname.startsWith('/swap') || router.pathname.startsWith('/exchange/swap')
    const crossPage = router.pathname.startsWith('/cross') || router.pathname.startsWith('/exchange/cross')
    // const landingPage = router.pathname.startsWith('/landing')
    const learnPage = router.pathname.startsWith('/learn')
    const portfolioPage = router.pathname.startsWith('/portfolio')
    const nftPage = router.pathname.startsWith('/marketplace') || router.pathname.startsWith('/marketplace/collections')
    const farmPage = router.pathname.startsWith('/farm') || router.pathname.startsWith('/summoner')
    const bondPage = router.pathname.startsWith('/bond') || router.pathname.startsWith('/bonds')
    const lendPage = router.pathname.startsWith('/lend') || router.pathname.startsWith('/borrow')
    const dataPage = router.pathname.startsWith('/analytics')
    const luxorPage = router.pathname.startsWith('/luxor')

    // const isExchangeAnalytics
    //     = asPath.startsWith('/exchange/analytics')
    //     || asPath.startsWith('/exchange/analytics/coffinbox')
    //     || asPath.startsWith('/exchange/analytics/dashboard')
    //     || asPath.startsWith('/exchange/analytics/pairs')
    //     || asPath.startsWith('/exchange/analytics/tokens')

    // const isBridge = router.pathname.startsWith('/bridge')

    // const isLimit = router.pathname.startsWith('/limit')
    //   || router.pathname.startsWith('/exchange/limit')

    // const isAggregator = asPath.startsWith('/aggregator')
    //   || asPath.startsWith('/exchange/aggregator')

    // const useSettings = isExchange || isLimit || isPool

    const isRemove = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
    const isAdd = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
    const isPool = isRemove || isAdd
    const isNFT = nftPage
    const isLuxor = luxorPage
    const isWallet = portfolioPage
    const isLend = lendPage
    const isEarn = farmPage || bondPage
    const isLearn = learnPage
    const isData = dataPage || dataPage
    const isExchange = swapPage || crossPage || isPool

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
                                        <div className="flex w-full justify-center rounded-xl bg-dark-1000">
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

            <div className={`fixed bottom-0 left-auto z-10 flex flex-row items-center justify-center w-auto rounded-xl`}>
                {/* xl:relative // moves to top */}
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`flex fixed bg-dark-1000 bottom-0 border-2 border-dark-800 rounded-xl left-0 z-10 gap-1 items-center justify-center w-full`}>
                        {/* <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isHome && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                                onClick={homeRoute}
                                >
                                <HomeIcon
                                fillPrimary={isHome ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isHome ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                                />
                            </div> */}
                        <div
                            className={classNames(
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isExchange && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={swapRoute}
                        >
                            <SwapIcon
                                fillPrimary={isExchange ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isExchange ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                            />
                        </div>
                        <div
                            className={classNames(
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isEarn && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={farmRoute}
                        >
                            <SeedlingIcon
                                fillPrimary={isEarn ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isEarn ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                            />
                        </div>
                        <div
                            className={classNames(
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isLend && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={lendRoute}
                        >
                            <LendSkullIcon
                                fillPrimary={isLend ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isLend ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                            />
                        </div>
                        {/* <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isData && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={dataRoute}
                        >
                            <ChartIcon
                                fillPrimary={isData ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isData ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                            />
                        </div> */}
                        {featureEnabled(Feature.NFT, chainId) &&
                            <div
                                className={classNames(
                                    `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                    isNFT && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                                onClick={nftRoute}
                            >
                                <NftIcon
                                    fillPrimary={isNFT ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                    fillSecondary={isNFT ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                    className={'w-7 h-7'}
                                />
                            </div>
                        }
                        {/* <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isLuxor && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={luxorRoute}
                        >
                            <SunMoonIcon
                                fillPrimary={isLuxor ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isLuxor ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                            />
                        </div> */}
                        {/* <div
                            className={classNames(
                                `hover:border hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isLearn && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={learnRoute}
                        >
                            <DocsIcon
                                fillPrimary={isLearn ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                fillSecondary={isLearn ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                className={'w-7 h-7'}
                            />
                        </div> */}
                        <div
                            className={classNames(
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isWallet && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={walletRoute}
                        >
                            <WalletIcon
                                fillPrimary={isWallet ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                fillSecondary={isWallet ? `${
                                getChainColor(chainId)}` : `#FFFFFF`}
                                className={'w-7 h-7'}
                            />
                        </div>
                        {/* <div
                            className={classNames(
                                `flex w-[36px] h-[36px] justify-center rounded p-0.5`,)}
                        // isLend && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                        >
                            <More />
                        </div> */}

                        {/* NETWORK ICON */}
                        {/* <div className={`flex rounded rounded-lg inline-block`}>
                            <Web3Network />
                        {/* WALLET ICON
                        </div>
                        <div className={`flex mr-2 rounded rounded-lg inline-block`}>
                            <Web3Status />
                        </div> */}
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