import React, { FC, useState } from 'react'
import Image from 'next/image'
import { getChainColor } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
import More from './More'
import Web3Network from 'components/Web3Network'
import LanguageMenu from './useLanguages'
import Web3Status from 'components/Web3Status'

const MobileBar: FC = () => {
    const router = useRouter()
    const isLuxor = router.asPath.startsWith('/luxor')

    const { account, chainId, library } = useActiveWeb3React()
    const [showMenu, setShowMenu] = useState(false)

    // const handleShowMenu = useCallback(() => {
    //     showMenu ? setShowMenu(false) : setShowMenu(true)
    // }, [setShowMenu])

    return (
        <div>
            <div
                className={`border border-[${getChainColor(chainId)}] border-2 rounded rounded-xl inline-block`}
            >
                <Web3Status />
            </div>
            <div className={`fixed bottom-0 left-auto z-10 flex flex-row items-center justify-center w-auto rounded rounded-xl xl:bg-transparent`}>
                {/* xl:relative // moves to top */}
                <div className="flex items-center w-full space-x-2 justify-end">
                    <div className={`fixed bg-white bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full rounded rounded-xl xl:bg-transparent`}>
                        {/* xl:relative // moves to top */}
                        <div className="flex items-center w-full space-x-2 justify-end">
                            <div className={`w-auto grid gap-1.5 items-center rounded rounded-xl bg-dark-1000  border-[${getChainColor(chainId)}] whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`}>
                                {/* MORE [...] ICON */}
                                <div className={showMenu ? `rounded rounded-md inline-block border border-[${getChainColor(chainId)}]` : `hidden`}>
                                    <div className="inline-block justify-center ml-2">
                                        <More />
                                    </div>
                                </div>
                                {/* NETWORK ICON */}
                                <div className={showMenu ? `rounded rounded-md p-2 inline-block border border-2 border-[${getChainColor(chainId)}]` : `hidden`}>
                                    <Web3Network />
                                </div>
                                {/* FLAG ICON */}
                                {/* <div className={showMenu ? `rounded rounded-md inline-block border border-2 border-[${getChainColor(chainId)}]` : `hidden`}>
                                <LanguageMenu />
                            </div> */}
                                <div
                                    className={
                                        showMenu
                                            ? `hidden`
                                            : `grid grid-col items-center justify-center w-12 h-8 bg-dark-1000 border border-2 border-[${getChainColor(chainId)}] rounded rounded-lg`
                                    }>
                                    <Image
                                        alt={"bars arrow up icon"}
                                        src={BarsArrowDownIcon}
                                        height={20}
                                        width={20}
                                        onClick={() => setShowMenu(true)}
                                    />
                                </div>
                                <div
                                    className={
                                        showMenu
                                            ? `grid grid-col items-center justify-center w-full h-8 bg-dark-1000 border border-[${getChainColor(chainId)}] rounded rounded-lg`
                                            : `hidden`
                                    }>
                                    <Image
                                        alt={"bars arrow up icon"}
                                        src={BarsArrowUpIcon}
                                        height={20}
                                        width={20}
                                        onClick={() => setShowMenu(false)}
                                    />
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