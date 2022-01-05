import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, useEffect } from 'react'

import ExternalLink from '../ExternalLink'
import { I18n } from '@lingui/core'
import Image from 'next/image'
import { classNames } from '../../functions/styling'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NavLink from '../NavLink'
import { Link } from 'react-feather'

const items = (i18n: I18n) => [
  {
    name: i18n._(t`Soul`),
    href: '/farm',
    farm: true,
    stake: false,
    bonds: false,
    // circles: false,
  },
  {
    name: i18n._(t`Stake`),
    href: '/seance',
    farm: false,
    stake: true,
    bonds: false,
    // circles: false,
  },
  // {
  //   name: i18n._(t`Circles`),
  //   href: '/circles',
  //   farm: false,
  //   stake: false,
  //   bonds: false,
  //   circles: true,
  // },
  {
    name: i18n._(t`Enchant`),
    href: '/bonds',
    farm: false,
    stake: false,
    bonds: true,
    // circles: false,
  },
]


export default function Menu() {
  const { i18n } = useLingui()
  const solutions = items(i18n)
  // Runs on render + reruns every second
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
      }, 20)
      
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  return (
    <Popover as="nav">

      {({ open }) => (
        <>
          <Popover.Button>
            EARN
          </Popover.Button>
          
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel flex-direction="column" className="bottom-12 lg:top-12 left-full sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="absolute grid gap-6 px-5 py-6 bg-dark-900 sm:gap-6 sm:p-6">
                  {solutions.map((item) =>
                    item.farm ? (
                      <NavLink key={item.name} href={item.href}>
                        <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                          FARM
                        </a>
                      </NavLink>
                    ) : 
                    item.stake ? (
                      <NavLink key={item.name} href={item.href}>
                        <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                          STAKE
                        </a>
                      </NavLink>
                    ) 
                    // : item.circles ? (
                    //   <NavLink key={item.name} href={item.href}>
                    //     <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                    //       CIRCLES
                    //     </a>
                    //   </NavLink>
                    // ) 
                    : item.bonds ? (
                      <NavLink key={item.name} href={item.href}>
                        <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                          BOND
                        </a>
                      </NavLink>
                    ) : (
                      ''
                    )
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>

        </>

      )
    }
    </Popover>
  )
}
