import React, { FC, Fragment, useCallback, useState } from 'react'
// import Image from 'next/image'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
// import { Dialog, Transition } from '@headlessui/react'

// import BarsArrowUpIcon from 'assets/svg/icons/BarsArrowUp.svg'
// import BarsArrowDownIcon from 'assets/svg/icons/BarsArrowDown.svg'
// import More from './More'
// import Web3Network from 'components/Web3Network'
// import LanguageMenu from './useLanguages'
// import Web3Status from 'components/Web3Status'
// import { ChainId, Currency, NATIVE, Percent, SOUL_ADDRESS, USDC_ADDRESS } from 'sdk'
// import Typography from 'components/Typography'
import { classNames } from 'functions/styling'
import { SidebarItem } from './SidebarItem'
// import TokenStats from 'components/TokenStats'
// import LanguageMenu from './useLanguages'
import useBar from './useBar'
// import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
// import NftIcon from 'components/Icons/mobile/NftIcon'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
// import Web3Network from 'components/Web3Network'
import Typography from 'components/Typography'
import ChartIcon from 'components/Icons/exchange/ChartIcon'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'


const DesktopBarV2: FC = () => {
    // const router = useRouter()
    // const { asPath } = useRouter()
    const [open, setOpen] = useState(false)
    const bar = useBar()
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
                            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-dark-1000 bg-opacity/80" />
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
                                <div className="ml-2">
                                    <div className={classNames("flex flex-col h-full py-2 overflow-x-hidden overflow-y-scroll shadow-xl", "bg-dark-1100")}>
                                        <nav className="flex-1 " aria-label="Sidebar">
                                            {bar.map((node) => {
                                                return <SidebarItem node={node} key={node.key} />
                                            })}
                                        </nav>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <div
                className={'absolute left-0 top-4'}
            >
            {/* <Image
                src={'http://exchange.soulswap.finance/favicon.png'}
                height={64}
                width={64}
                alt={'soulswap banner'}
            /> */}
            </div>
        </div>
    )
}
export default DesktopBarV2