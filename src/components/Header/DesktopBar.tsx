import React, { FC, Fragment, useCallback, useState } from 'react'
// import Image from 'next/image'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
// import { Dialog, Transition } from '@headlessui/react'

// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
import More from './More'
// import Web3Network from 'components/Web3Network'
// import LanguageMenu from './useLanguages'
// import Web3Status from 'components/Web3Status'
// import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
// import Typography from 'components/Typography'
import { classNames } from 'functions/styling'
// import { SidebarItem } from './SidebarItem'
// import TokenStats from 'components/TokenStats'
// import LanguageMenu from './useLanguages'
import useBar from './useBar'
// import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
// import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
// import NftIcon from 'components/Icons/mobile/NftIcon'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
// import Web3Network from 'components/Web3Network'
import Typography from 'components/Typography'
import ChartIcon from 'components/Icons/exchange/ChartIcon'
import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
// import { useUserInfo } from "hooks/useAPI"

// interface BarProps {
//     inputCurrency?: Currency
//     outputCurrency?: Currency
//     allowedSlippage?: Percent
// }

const DesktopBar: FC = () => {
    const router = useRouter()
    const { asPath } = useRouter()

    const { chainId } = useActiveWeb3React()
    // const [open, setOpen] = useState(false)
    // const bar = useBar()
    
    // const { userInfo } = useUserInfo()

    // const typeStyle = `justify-center text-center w-full border border-[${getChainColor(chainId)}] rounded p-2`

    const swapRoute = useCallback(() => {
        router.push(`/swap`)
    }, [])
    // const homeRoute = useCallback(() => {
    //     router.push(`/landing`)
    // }, [])
    const walletRoute = useCallback(() => {
        router.push(`/portfolio`)
    }, [])
    const dataRoute = useCallback(() => {
        router.push(`/analytics`)
    }, [])
    const farmRoute = useCallback(() => {
        router.push(`/farm`)
    }, [])
    const luxorRoute = useCallback(() => {
        router.push(`/luxor`)
    }, [])

    const swapPage = router.pathname.startsWith('/swap') || router.pathname.startsWith('/exchange/swap')
    const crossPage = router.pathname.startsWith('/cross') || router.pathname.startsWith('/exchange/cross')
    // const landingPage = router.pathname.startsWith('/landing')
    const portfolioPage = router.pathname.startsWith('/portfolio')
    // const nftPage = router.pathname.startsWith('/marketplace') || router.pathname.startsWith('/marketplace/collections')
    const farmPage = router.pathname.startsWith('/farm') || router.pathname.startsWith('/summoner')
    const bondPage = router.pathname.startsWith('/bond') || router.pathname.startsWith('/bonds')
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
    // const isNFT = nftPage
    const isWallet = portfolioPage
    const isData = dataPage
    const isLuxor = luxorPage
    const isEarn = farmPage || bondPage
    const isExchange = swapPage || crossPage || isPool

    return (
        <div>
            {/* <Transition.Root show={open} as={Fragment}>
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
                                {/* <div className="ml-2">
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
                                </div> //
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root> */}

            <div className={`flex flex-row fixed bottom-0 left-auto z-10 items-center justify-center w-auto rounded-xl`}>
                {/* xl:relative // moves to top */}
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`fixed bg-dark-1000 border-2 border-dark-800 rounded-xl bottom-0 left-0 z-10 gap-1 flex items-center justify-center w-full`}>
                        {/* <div
                            className={classNames(
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                isHome && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={homeRoute}
                        >
                            <HomeIcon
                                fillPrimary={isHome ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isHome ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7'}
                            />
                        </div> */}
                        <div className={`grid ${featureEnabled(Feature.LUXOR, chainId) ?
                        'grid-cols-5' : 'grid-cols-4'} w-full items-center`}>
                        <div
                            className={classNames(
                                `grid grid-cols-2`,
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] w-full justify-center rounded p-0.5`,
                                isExchange && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={swapRoute}
                        >
                            <SwapIcon
                                fillPrimary={isExchange ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isExchange ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7 ml-4 sm:ml-8'}
                            />
                            <Typography className={`grid mt-1`}>
                                { `Swap` }
                            </Typography>
                        </div>
                        {/* {featureEnabled(Feature.LIQUIDITY_MINING, chainId) && */}
                        <div
                            className={classNames(
                                `grid grid-cols-2`,
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] w-full justify-center rounded p-0.5`,
                                isEarn && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={farmRoute}
                        >
                            <SeedlingIcon
                                fillPrimary={isEarn ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isEarn ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7 ml-4 sm:ml-8'}
                            />
                        <Typography className={`grid mt-1`}>
                        { `Earn` }
                        </Typography>
                        </div>
                        {/* } */}
                        {/* {featureEnabled(Feature.ANALYTICS, chainId) && */}
                        <div
                            className={classNames(
                                `grid grid-cols-2`,
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] w-full justify-center rounded p-0.5`,
                                isData && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={dataRoute}
                        >
                            <ChartIcon
                                fillPrimary={isData ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isData ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7 ml-4 sm:ml-8'}
                            />
                            <Typography className={`grid mt-1`}>
                            { `Data` }
                            </Typography>
                        </div>
                        {featureEnabled(Feature.LUXOR, chainId) &&
                        <div
                            className={classNames(
                                `grid grid-cols-2`,
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] w-full justify-center rounded p-0.5`,
                                isLuxor && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={dataRoute}
                        >
                            <SunMoonIcon
                                fillPrimary={isLuxor ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                fillSecondary={isLuxor ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7 ml-4'}
                            />
                            <Typography className={`grid mt-1`}>
                            { `Luxor` }
                            </Typography>
                        </div>
                         }
                        {/* {featureEnabled(Feature.NFT, chainId) &&
                            <div
                                className={classNames(
                                    `hover:border-2 hover:border-[${getChainColor(chainId)}] flex w-full justify-center rounded p-0.5`,
                                    isNFT && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                                onClick={nftRoute}
                            >
                                <NftIcon
                                    fillPrimary={isNFT ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                    fillSecondary={isNFT ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                className={'w-7 h-7 ml-4 sm:ml-8'}
                                />
                                <Typography className={`grid mt-1`}>
                                { `NFT` }
                                </Typography>
                            </div>
                        } */}
                        <div
                            className={classNames(
                                `grid grid-cols-2`,
                                `hover:border-2 hover:border-[${getChainColor(chainId)}] w-full justify-center rounded p-0.5`,
                                isWallet && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                            onClick={walletRoute}
                        >
                            <WalletIcon
                                fillPrimary={isWallet ? `#FFFFFF` : `${getChainColor(chainId)}`}
                                fillSecondary={isWallet ? `${getChainColor(chainId)}` : `#FFFFFF`}
                                className={'w-7 h-7 md:ml-4'}
                            />
                            <Typography className={`grid mt-1 -ml-4 md:-ml-0`}>
                            { `Account` }
                            </Typography>
                        </div>
                    </div>

                        {/* <div
                            className={classNames(
                                `flex w-[36px] h-[36px] justify-center rounded p-0.5`,)}
                        // isLend && `hover:border border-2 border-[${getChainColor(chainId)}]`)}
                        >
                            <More />
                        </div> */}
                        {/* NETWORK ICON */}
                        {/* <div className={`flex mr-2 rounded-lg`}>
                            <Web3Network />
                        </div> */}

                    </div>
                </div>
            </div>
        </div>
    )
}
export default DesktopBar