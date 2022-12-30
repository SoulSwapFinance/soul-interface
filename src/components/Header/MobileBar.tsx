import React, { FC, useCallback, useState } from 'react'
import Image from 'next/image'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
import More from './More'
// import Web3Network from 'components/Web3Network'
// import LanguageMenu from './useLanguages'
// import Web3Status from 'components/Web3Status'
import { ChainId } from 'sdk'
import Typography from 'components/Typography'
import { classNames } from 'functions/styling'
// import styled from 'styled-components'
// import { Container } from 'components'
import { Bars3Icon } from '@heroicons/react/24/outline'

const MobileBar: FC = () => {
    const router = useRouter()
    const { account, chainId, library } = useActiveWeb3React()
    const [open, setOpen] = useState(false)

    const typeStyle = `justify-center text-center w-full border border-[${getChainColor(chainId)}] rounded p-2`

    const swapRoute = useCallback(() => {
        router.push(`/exchange/swap`)
    }, [])
    const landingRoute = useCallback(() => {
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
    const lendPage = router.pathname.startsWith('/lend') || router.pathname.startsWith('/borrow')
    const bridgePage = router.pathname.startsWith('/bridge')
    return (
        <div>
            <div className={`fixed bottom-0 left-auto z-10 flex flex-row items-center justify-center w-auto rounded rounded-xl`}>
                {/* xl:relative // moves to top */}
                <div className={`p-1 bg-${getChainColorCode(chainId)} rounded-full hover:bg-dark-800`}>
                    {/* <div className="flex p-2 justify-between"> */}
                    <Bars3Icon width={24} className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `bg-${getChainColorCode(chainId)} cursor-pointer rounded rounded-xl` : `hidden`)} onClick={() => setOpen(true)} />
                </div>
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`fixed bg-dark-1000 bottom-0 left-0 z-10 gap-1 flex justify-between items-center justify-center w-full rounded rounded-lg`}>
                        <Typography
                            className={classNames(typeStyle, swapPage ? `text-white` : `text-[${getChainColor(chainId)}]`, `bg-${swapPage ? getChainColorCode(chainId) : `dark-1000`}`)}
                            onClick={swapRoute}
                        >
                            {`Swap`}
                        </Typography>
                        <Typography
                            className={classNames(typeStyle, farmPage ? `text-white` : `text-[${getChainColor(chainId)}]`, `bg-${farmPage ? getChainColorCode(chainId) : `dark-1000`}`)}
                            onClick={farmRoute}
                        >
                            {`Earn`}
                        </Typography>
                        <div
                            className={`mt-1 m-1 border ${landingPage ? `border-[${getChainColor(chainId)}]` : `border-dark-700`} rounded rounded-xl p-1`}
                            // className={classNames(typeStyle, landingPage ? `text-white` : `text-[${getChainColor(chainId)}]`, `bg-dark-1000`)}
                            onClick={landingRoute}
                        >
                            <Image

                                height={200} width={200} src={'/logo.png'} alt={'soul logo'}
                                className={classNames(typeStyle, landingPage ? `text-white` : `text-[${getChainColor(chainId)}]`, `bg-dark-1000`)}
                            />
                        </div>
                        <Typography
                            className={classNames(typeStyle, lendPage ? `text-white` : `text-[${getChainColor(chainId)}]`, `bg-${lendPage ? getChainColorCode(chainId) : `dark-1000`}`)}
                            onClick={lendRoute}
                        >
                            {`Lend`}
                        </Typography>
                        <Typography
                            className={classNames(typeStyle, bridgePage ? `text-white` : `text-[${getChainColor(chainId)}]`, `bg-${bridgePage ? getChainColorCode(chainId) : `dark-1000`}`)}
                            onClick={bridgeRoute}
                        >
                            {`Bridge`}
                        </Typography>

                        {/* <div className={`inline-block justify-center my-0.5 ml-2 mr-2`}>
                            <More />
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