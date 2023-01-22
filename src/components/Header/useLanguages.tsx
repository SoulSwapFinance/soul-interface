import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
// import { ChainId } from 'sdk'
// import { I18n } from '@lingui/core'
import Image from 'next/image'
import { classNames } from '../../functions/styling'
import { t } from '@lingui/macro'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import Languages from './Languages'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LanguageMenu() {
    const { chainId } = useActiveWeb3React()
    const hybridStyle = `flex items-center justify-center px-3 py-2.5 rounded rounded-2xl p-2 bg-dark-1000 hover:bg-dark-800 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto`
    const { locale, locales, asPath } = useRouter()

    return (
        <Popover className="relative ml-auto">
            {({ open }) => (
                <>
                    <div>
                        <Popover.Button className={classNames(hybridStyle, ``)}>
                            <Image src={Languages[locale].flag} alt={Languages[locale].language} width={20} height={20} />
                        </Popover.Button>
                    </div>
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-10 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            static
                            className="absolute z-50 w-screen max-w-xs mt-1 transform -translate-x-full top-0 left-72"
                        >
                            <div className={classNames("overflow-hidden w-[40px] items-center justify-center rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border", `border-[${getChainColor(chainId || 250)}]`)}>
                                <div className="grid grid-cols-1 gap-0 py-1 bg-dark-1000">
                                    {locales.map((locale) => {
                                        const { flag, language, abbr, dialect } = Languages[locale]
                                        return (
                                            <Popover.Button key={locale}>
                                                {/* {({ active }) => ( */}
                                                {({ }) => (
                                                    <Link href={asPath} locale={locale}>
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                'group flex items-center px-2 py-1 text-sm focus:bg-dark-1000 rounded'
                                                            )}
                                                        >
                                                            <Image
                                                                className="inline w-3 h-3 mr-1 align-middle"
                                                                src={flag}
                                                                width={20}
                                                                height={20}
                                                                alt={language}
                                                                aria-hidden="true"
                                                            />
                                                            {/* <span className="flex justify-center ml-3">{abbr}</span> */}
                                                            {/* <span className="flex justify-center ml-3">{language}</span> */}
                                                            {dialect && (
                                                                <sup>
                                                                    <small>{dialect}</small>
                                                                </sup>
                                                            )}
                                                        </a>
                                                    </Link>
                                                )}
                                            </Popover.Button>
                                        )
                                    })}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
