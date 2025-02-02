import React, { FC, Fragment, useCallback } from 'react'

import { getChainColor } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'

import { classNames } from 'functions/styling'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
import Typography from 'components/Typography'

const DesktopBar: FC = () => {
    const router = useRouter()
    const { asPath } = useRouter()

    const { chainId } = useActiveWeb3React()
    const swapRoute = useCallback(() => {
        router.push(`/exchange/swap`)
    }, [])
    const walletRoute = useCallback(() => {
        router.push(`/portfolio`)
    }, [])
    const farmRoute = useCallback(() => {
        router.push(`/farm`)
    }, [])

    const swapPage = router.pathname.startsWith('/swap') || router.pathname.startsWith('/exchange/swap')
    const portfolioPage = router.pathname.startsWith('/portfolio')
    const farmPage = router.pathname.startsWith('/farm') || router.pathname.startsWith('/summoner')
    const bondPage = router.pathname.startsWith('/bond') || router.pathname.startsWith('/bonds')

    // const useSettings = isExchange || isLimit || isPool

    const isRemove = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
    const isAdd = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
    const isPool = isRemove || isAdd
    // const isNFT = nftPage
    const isWallet = portfolioPage
    const isEarn = farmPage || bondPage
    const isExchange = swapPage || isPool

    return (
        <div>

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
                        <div className={`grid ${
                            // chainId == ChainId.FANTOM ? 'grid-cols-5' :
                            'grid-cols-4'} w-full items-center`
                            }
                        >
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
                        {featureEnabled(Feature.LIQUIDITY_MINING, chainId) &&
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
                        }
                    {featureEnabled(Feature.ANALYTICS, chainId) &&
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
                                className={'w-7 h-7 sm:ml-4'}
                            />
                            <Typography className={`grid mt-1 -ml-4 md:-ml-0`}>
                            { `Account` }
                            </Typography>
                        </div>
                    }
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