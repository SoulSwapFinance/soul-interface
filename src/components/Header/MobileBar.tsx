import React, { FC, useCallback, useState } from 'react'
import Image from 'next/image'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
import More from './More'
import Web3Network from 'components/Web3Network'
import LanguageMenu from './useLanguages'
import Web3Status from 'components/Web3Status'
import Typography from 'components/Typography'
import { classNames } from 'functions/styling'

const MobileBar: FC = () => {
    const router = useRouter()
    // const isLuxor = router.asPath.startsWith('/luxor')

    const { account, chainId, library } = useActiveWeb3React()
    const [showMenu, setShowMenu] = useState(false)

    // const handleShowMenu = useCallback(() => {
    //     showMenu ? setShowMenu(false) : setShowMenu(true)
    // }, [setShowMenu])
    // const handleAggregatorSwap = useCallback(
    //     () => {
    //       // setShowHeader(false)
    //       router.push(`/exchange/swap/aggregator/${currencies[Field.INPUT].isNative ? NATIVE[chainId].symbol : currencies[Field.INPUT]}/${currencies[Field.OUTPUT].wrapped.address}`)
    //     }, []
    //   )
    const swapRoute = useCallback(() => {
        router.push(`/exchange/swap`)
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
    const farmPage = router.pathname.startsWith('/farm') || router.pathname.startsWith('/summoner')
    const lendPage = router.pathname.startsWith('/lend') || router.pathname.startsWith('/borrow')
    const bridgePage = router.pathname.startsWith('/bridge')
    return (
        <div>
            {/* FLAG ICON */}
            {/* <div 
            //   className={`rounded rounded-md inline-block border border-2 border-[${getChainColor(chainId)}]`}
            className={`relative top-1 right-2 rounded rounded-lg inline-block`}
            >
                <LanguageMenu />
              </div> */}
            <div
                className={`relative top-0 right-0 border border-[${getChainColor(chainId)}] border-2 rounded rounded-xl inline-block`}
            >
                <Web3Status />
            </div>
            <div className={`fixed bottom-0 left-auto z-10 flex flex-row items-center justify-center w-auto rounded rounded-xl`}>
                {/* xl:relative // moves to top */}
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`fixed bg-dark-1000 bottom-0 left-0 z-10 flex flex-row items-center border border-[${getChainColor(chainId)}] border-2 justify-center w-full rounded rounded-lg`}>
                        {/* <Image 
                        src={BarsArrowUpIcon}
                        height={20}
                        width={20}
                        onClick={swapRoute}
                        /> */}
                        <div className={classNames(`flex space-x-2`)}>
                            <Typography
                                className={`justify-center bg-${swapPage ? getChainColorCode(chainId) : `dark-700`} border border-[${getChainColor(chainId)}] rounded p-4 ml-1.5`}
                                onClick={swapRoute}
                            >
                                {`Swap`}
                            </Typography>
                            <Typography
                                className={`justify-center bg-${farmPage ? getChainColorCode(chainId) : `dark-700`} border border-[${getChainColor(chainId)}] rounded p-4`}
                                onClick={farmRoute}
                            >
                                {`Farm`}
                            </Typography>
                            <Typography
                                className={`justify-center bg-${lendPage ? getChainColorCode(chainId) : `dark-700`} border border-[${getChainColor(chainId)}] rounded p-4`}
                                onClick={lendRoute}
                            >
                                {`Lend`}
                            </Typography>
                            <Typography
                                className={`justify-center bg-${bridgePage ? getChainColorCode(chainId) : `dark-700`} border border-[${getChainColor(chainId)}] rounded p-4 mr-0.5`}
                                onClick={bridgeRoute}
                            >
                                {`Bridge`}
                            </Typography>
                        </div>
                        <div className="flex items-center w-full space-x-2 justify-end">
                            <div className={`w-auto grid gap-0.5 items-center rounded rounded-lg bg-dark-1000 border-[${getChainColor(chainId)}] border- whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}>
                                {/* MORE [...] ICON */}
                                <div className={showMenu ? `rounded rounded-md inline-block border border-2 border-[${getChainColor(chainId)}]` : `hidden`}>
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
                                {/* NETWORK ICON */}
                                <div className={`rounded rounded mx-2 my-0.5 w-auto inline-block border border-4 border-[${getChainColor(chainId)}]`}>
                                    <Web3Network />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MobileBar