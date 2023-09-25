import { Popover, Transition } from '@headlessui/react'
import { BarItem, BarItemLeaf, BarItemNode } from 'components/Header/useBar'
import Typography from 'components/Typography'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { classNames } from 'functions'
import { useTouchDeviceMediaQuery } from 'hooks/useDesktopHeaderMediaQuery'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useCallback, useRef } from 'react'
import { useActiveWeb3React } from 'services/web3'

// import { ChevronDownIcon } from '@heroicons/react/24/outline'
// import styled from 'styled-components'

// const HideOnMobile = styled.div`
// @media screen and (max-width: 600px) {
//   display: none;
// }
// `;

interface SidebarItem {
  node: BarItem
}

export const SidebarItem: FC<SidebarItem> = ({ node }) => {
  const router = useRouter()
  const { chainId } = useActiveWeb3React()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const touchDevice = useTouchDeviceMediaQuery()
  const { link } = node as BarItemLeaf
  // const isDesktop = useDesktopHeaderMediaQuery()
  // const isOpen = router.asPath === link

  const handleToggle = useCallback((open, type) => {
    if (!open && type === 'enter') {
      buttonRef?.current?.click()
    } else if (open && type === 'leave') {
      buttonRef?.current?.click()
    }
  }, [])

  if (node && node.hasOwnProperty('link')) {
    // const { link } = node as BarItemLeaf
    // const isOpen = router.asPath === link
    return (
      <Typography
        onClick={() => router.push(link)}
        weight={700}
        variant="sm"
        className={classNames(
          // isOpen ? `border rounded rounded-3xl mr-18 border-${getChainColorCode(chainId)}` : '',
          'hover:text-white font-bold py-2 px-2 rounded flex gap-3'
        )}
      >
        <div className={`flex flex-cols-1 justify-center gap-2 border w-[124px] border-[${getChainColor(chainId)}] hover:border-2 rounded rounded-2xl bg-dark-900`}>
          <div className={`m-1`}>
            {node.icon}
          </div>
          <div className={`mt-2`}>
            {node.title}
          </div>
        </div>
        {/* {isDesktop && node.title} */}
      </Typography>
    )
  }

  return (
    <Popover key={node.key} className="relative flex">
      {({ open }) => (
        <div
          {...(!touchDevice && {
            onMouseEnter: () => handleToggle(open, 'enter'),
            onMouseLeave: () => handleToggle(open, 'leave'),
          })}
        >
          <Popover.Button ref={buttonRef}>
            <Typography
              weight={700}
              variant="sm"
              className={classNames(
                'font-bold py-5 px-2 rounded flex gap-3 items-center')}
            >
              {node.icon}
              {/* {node.title} */}
              {/* <ChevronDownIcon strokeWidth={5} width={12} className={`text-[${getChainColor(chainId)}]`} /> */}
            </Typography>
          </Popover.Button>
          {node.hasOwnProperty('items') && (
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="z-10 w-full justify-center absolute w-24 sm:w-32 translate-y-[-10px] sm:translate-x-[-10px] translate-x-[-2px]">
                <div
                  className={classNames(
                    'shadow-md shadow-black/40 border', `border-${getChainColorCode(chainId)}`, 'rounded overflow-hidden',
                    !touchDevice
                      ? "backdrop-blur-fallback before:z-[-1] before:rounded before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-[20px] bg-dark-900 bg-opacity/[0.02]"
                      : 'bg-dark-800 inset-0'
                  )}
                >
                  {(node as BarItemNode).items.map((leaf) => (
                    <Link key={leaf.key} href={leaf.link}>
                        <Typography
                          variant="sm"
                          weight={700}
                          onClick={() => {
                            router.push(leaf.link).then(() => buttonRef?.current?.click())
                          }}
                          className="relative px-3 text-center py-2 m-1 rounded-lg hover:cursor-pointer hover:text-white hover:bg-white/10"
                        >
                          {leaf.title}
                        </Typography>
                    </Link>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          )}
        </div>
      )}
    </Popover>
  )
}