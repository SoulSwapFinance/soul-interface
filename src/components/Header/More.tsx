import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { ChainId } from 'sdk'
import ExternalLink from '../ExternalLink'
import { I18n } from '@lingui/core'
// import Image from 'next/image'
import { classNames } from '../../functions/styling'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NavLink from '../NavLink'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
// import Web3Network from 'components/Web3Network'
// import Web3Status from 'components/Web3Status'
import TokenStats from 'components/TokenStats'
import LanguageMenu from './useLanguages'
// import SquareEllipsisIcon from 'components/Icons/mobile/SquareEllipsisIcon'

export default function Menu() {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const blockchainPrefix = chainId
    == ChainId.AVALANCHE ? 'https://avax-info' : 'https://info'

  const items = (i18n: I18n) => [
    {
      name: i18n._(t`Documentation`),
      description: i18n._(t`Read our Full Documentation`),
      href: 'https://docs.soulswap.finance',
      external: true,
    },
    {
      name: i18n._(t`Twitter`),
      description: i18n._(t`Follow us on Twitter`),
      href: 'https://twitter.com/SoulSwapFinance',
      external: true,
    },
    // {
    //   name: i18n._(t`Analytics`),
    //   description: i18n._(t`View our Data.`),
    //   href: `${blockchainPrefix}.soulswap.finance`,
    //   external: true,
    // },
    {
      name: i18n._(t`Resources`),
      description: i18n._(t`Explore our Protocol Links`),
      href: 'https://links.soul.sh',
      external: true,
    },
  ]

  const solutions = items(i18n)

  return (
    <Popover className="relative ml-auto m-0">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? `text-${getChainColorCode(chainId)}` : 'text-secondary',
              `focus:outline-none hover:text-${getChainColorCode(chainId)}`
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className={'w-8 h-8'}
              fill={getChainColor(chainId)}
            >
              <defs>
                {/* <!-- <style>.fa-secondary{opacity:.4}</style> --> */}
              </defs>

              <path
                fill={open ? `${getChainColor(chainId)}` : `#FFFFFF`}
                d="M128 224C145.7 224 160 238.3 160 256C160 273.7 145.7 288 128 288C110.3 288 96 273.7 96 256C96 238.3 110.3 224 128 224zM224 224C241.7 224 256 238.3 256 256C256 273.7 241.7 288 224 288C206.3 288 192 273.7 192 256C192 238.3 206.3 224 224 224zM320 288C302.3 288 288 273.7 288 256C288 238.3 302.3 224 320 224C337.7 224 352 238.3 352 256C352 273.7 337.7 288 320 288z"
              />

              <path
                fill={open ? `#FFFFFF` : `${getChainColor(chainId)}`}
                d="M0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM256 256C256 238.3 241.7 224 224 224C206.3 224 192 238.3 192 256C192 273.7 206.3 288 224 288C241.7 288 256 273.7 256 256zM96 256C96 273.7 110.3 288 128 288C145.7 288 160 273.7 160 256C160 238.3 145.7 224 128 224C110.3 224 96 238.3 96 256zM352 256C352 238.3 337.7 224 320 224C302.3 224 288 238.3 288 256C288 273.7 302.3 288 320 288C337.7 288 352 273.7 352 256z" />
            </svg>
            {/* <svg
              width="16px"
              height="16px"
              className="inline-flex items-center w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              color={getChainColor(chainId)}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg> */}

          </Popover.Button>


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
              className="absolute z-50 w-screen max-w-xs px-2 mt-3 transform -translate-x-full bottom-8 lg:top-12 left-full sm:px-0"
            >
              <div className={classNames(`overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 border border-2 border-[${getChainColor(chainId)}]`)}>
                <div className="relative grid gap-6 px-5 py-6 bg-dark-1000 sm:gap-8 sm:p-8">
                  {solutions.map((item) =>
                    item.external ? (
                      <ExternalLink
                        key={item.name}
                        href={item.href}
                        className="block p-1 -m-3 transition duration-150 ease-in-out text-center rounded-md hover:bg-dark-900"
                      >
                        <p className="text-base font-medium text-high-emphesis">{item.name}</p>
                        <p className="text-sm text-secondary">{item.description}</p>
                      </ExternalLink>
                    ) : (
                      <NavLink key={item.name} href={item.href}>
                        <a className="block p-1 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-900">
                          <p className="text-base font-medium text-high-emphesis">{item.name}</p>
                          <p className="text-sm text-secondary">{item.description}</p>
                        </a>
                      </NavLink>
                    )
                  )}
                </div>
                <div className={`sm:hidden grid grid-cols-2 border border-[${getChainColor(chainId)}] justify-center rounded rounded-md justify-end bg-dark-1000`}>
                <div className={`grid border border-[${getChainColor(chainId)}] justify-center rounded rounded-md justify-end bg-dark-1000`}>
                  <TokenStats />
                </div>
                <div className={`grid border border-[${getChainColor(chainId)}] justify-center rounded rounded-md justify-end bg-dark-1000`}>
                  <LanguageMenu />
                </div>
                </div>
                <div className={`hidden sm:grid border border-[${getChainColor(chainId)}] justify-center rounded rounded-md justify-end bg-dark-1000`}>
                  <LanguageMenu />
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
