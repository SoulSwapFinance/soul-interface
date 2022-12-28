import React, { FC, useCallback, useState } from 'react'
import Image from 'next/image'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
import More from './More'
// import Web3Network from 'components/Web3Network'
// import LanguageMenu from './useLanguages'
// import Web3Status from 'components/Web3Status'
import Typography from 'components/Typography'
import { classNames } from 'functions/styling'
import styled from 'styled-components'
// import { Container } from 'components'

const MobileBar: FC = () => {

    const Wrapper = styled.div<{ selected: boolean }>`
	display: flex;
	grid-row-gap: 8px;
	margin-top: 6px;

	background-color: ${({ theme, selected }) =>
            theme.mode === 'dark' ? (selected ? ' #161616;' : '#2d3039;') : selected ? ' #bec1c7;' : ' #dde3f3;'};
	border: ${({ theme }) => (theme.mode === 'dark' ? '1px solid #373944;' : '1px solid #c6cae0;')};
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => (theme.mode === 'dark' ? '#161616;' : '#b7b7b7;;')};
	}
`;

    const Row = styled.div`
	display: flex;

	img {
		width: 24px;
		height: 24px;
		aspect-ratio: 1;
		border-radius: 50%;
		margin-right: 0;
	}
`;
    const router = useRouter()
    const { account, chainId, library } = useActiveWeb3React()
    const typeStyle = `justify-center text-center w-full border border-[${getChainColor(chainId)}] rounded p-2`

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
            <div className={`fixed bottom-0 left-auto z-10 flex flex-row items-center justify-center w-auto rounded rounded-xl`}>
                {/* xl:relative // moves to top */}
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`fixed bg-dark-1000 bottom-0 left-0 z-10 flex justify-between items-center justify-center w-full rounded rounded-lg`}>
                        <Typography
                            className={classNames(typeStyle, `bg-${swapPage ? getChainColorCode(chainId) : `dark-700`}`)}
                            onClick={swapRoute}
                        >
                            {`Swap`}
                        </Typography>
                        <Typography
                            className={classNames(typeStyle, `bg-${farmPage ? getChainColorCode(chainId) : `dark-700`}`)}
                            onClick={farmRoute}
                        >
                            {`Farm`}
                        </Typography>
                        <Typography
                            className={classNames(typeStyle, `bg-${lendPage ? getChainColorCode(chainId) : `dark-700`}`)}
                            onClick={lendRoute}
                        >
                            {`Lend`}
                        </Typography>
                        <Typography
                            className={classNames(typeStyle, `bg-${bridgePage ? getChainColorCode(chainId) : `dark-700`}`)}
                            onClick={bridgeRoute}
                        >
                            {`Bridge`}
                        </Typography>
                        <div className="inline-block justify-center my-0.5 ml-2 mr-2">
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