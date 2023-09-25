import { Popover, Transition } from '@headlessui/react'
import { MenuItem, MenuItemLeaf, MenuItemNode } from 'components/Header/useMenu'
import Typography from 'components/Typography'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { classNames } from 'functions'
import { useTouchDeviceMediaQuery } from 'hooks/useDesktopHeaderMediaQuery'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useCallback, useRef } from 'react'
import { useActiveWeb3React } from 'services/web3'
import styled from 'styled-components'

interface DropdownItem {
  node: MenuItem
}

export const DropdownItem: FC<DropdownItem> = ({ node }) => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  // const isDesktop = useDesktopHeaderMediaQuery()
  const touchDevice = useTouchDeviceMediaQuery()
  const { chainId } = useActiveWeb3React()

  const handleToggle = useCallback((open, type) => {
    if (!open && type === 'enter') {
      buttonRef?.current?.click()
    } else if (open && type === 'leave') {
      buttonRef?.current?.click()
    }
  }, [])

  if (node && node.hasOwnProperty('link')) {
    const { link } = node as MenuItemLeaf
    return (
      <Typography
        onClick={() => router.push(link)}
        weight={700}
        variant="sm"
        className={classNames(
          router.asPath === link ? `text-[${getChainColor(chainId)}]` : '',
          `hover:text-[${getChainColor(chainId)}]`, 'font-bold py-5 px-0 rounded flex gap-3'
        )}
      >
        { node.icon }
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
              className={classNames(open && `text-[${getChainColor(chainId)}]`, 'font-bold py-5 rounded flex items-center')}
            >
          { node.icon }
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
                  {(node as MenuItemNode).items.map((leaf) => (
                    <Link key={leaf.key} href={leaf.link}>
                        <Typography
                          variant="sm"
                          weight={700}
                          onClick={() => {
                            router.push(leaf.link).then(() => buttonRef?.current?.click())
                          }}
                          className={classNames("hover:border relative text-center py-2 m-1 rounded-lg hover:cursor-pointer hover:text-white hover:bg-white/10",
                          `border-${getChainColorCode(chainId)}`
                          )}
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