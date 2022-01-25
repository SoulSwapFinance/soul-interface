import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from 'sdk'
import Typography from 'components/Typography'
import { useActiveWeb3React } from 'services/web3'
import { useWalletModalToggle } from 'state/application/hooks'
import { useRouter } from 'next/router'
import React, { FC, Fragment, ReactNode, useMemo, useState } from 'react'

const MenuLink: FC<{ href?: string; label: string; onClick?(): void }> = ({ href, label, onClick }) => {
  const router = useRouter()

  if (onClick) {
    return (
      <Menu.Item>
        {({ active }) => {
          return (
            <Typography variant="sm" weight={700} onClick={onClick} className={active ? 'text-white' : 'text-primary'}>
              {label}
            </Typography>
          )
        }}
      </Menu.Item>
    )
  }

  if (href) {
    return (
      <Menu.Item onClick={() => router.push(href)}>
        {({ active }) => {
          return (
            <Typography variant="sm" weight={700} onClick={onClick} className={active ? 'text-white' : 'text-primary'}>
              {label}
            </Typography>
          )
        }}
      </Menu.Item>
    )
  }

  return <></>
}

enum FarmFilter {
  Active = 'Active',
  Deposited = 'Deposited',
  Fantom = 'Fantom',
  SoulSwap = 'SoulSwap',
  Stables = 'Stables',
  Inactive = 'Inactive',
}

const filters: Record<string, FarmFilter> = {
  deposited: FarmFilter.Deposited,
  active: FarmFilter.Active,
  fantom: FarmFilter.Fantom,
  soulswap: FarmFilter.SoulSwap,
  stables: FarmFilter.Stables,
  inactive: FarmFilter.Inactive,
}

const OnsenFilter = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { query } = useRouter()
  const filter = query?.filter as string
  const [selected, setSelected] = useState<FarmFilter>(filters[filter] || FarmFilter.Active)

  const items = useMemo(() => {
    const map: Record<string, ReactNode> = {
      [FarmFilter.Active]: <MenuLink href={'/farm?filter=active'} label={i18n._(t`Active`)} />,
      [FarmFilter.Deposited]: account ? (
        <MenuLink href={'/farm?filter=deposited'} label={i18n._(t`Deposited`)} />
      ) : (
        <MenuLink onClick={toggleWalletModal} label={i18n._(t`Deposited`)} />
      ),
      [FarmFilter.Fantom]:
        chainId === ChainId.FANTOM ? (
          <MenuLink href={'/farm?filter=fantom'} label={i18n._(t`Fantom`)} />
        ) : undefined,
      [FarmFilter.SoulSwap]:
        chainId === ChainId.FANTOM ? (
          <MenuLink href={'/farm?filter=soulswap'} label={i18n._(t`SoulSwap`)} />
        ) : undefined,
      [FarmFilter.Stables]:
        chainId === ChainId.FANTOM ? (
          <MenuLink href={'/farm?filter=stables'} label={i18n._(t`Stables`)} />
        ) : undefined,
      // @ts-ignore TYPE NEEDS FIXING
      [FarmFilter.Inactive]: (
        <MenuLink href={'/farm?filter=inactive'} label={i18n._(t`Inactive`)} />
      )
    }

    return Object.entries(map).reduce<Record<string, ReactNode>>((acc, [k, v]) => {
      if (v && selected !== k) acc[k] = v
      return acc
    }, {})
  }, [account, chainId, i18n, selected, toggleWalletModal])

  return (
    <div className="flex gap-2 items-center w-[180px]">
      <Menu as="div" className="relative inline-block w-full text-left">
        <div>
          <Menu.Button className="w-full px-4 py-2.5 text-sm font-bold bg-transparent border rounded shadow-sm text-primary border-dark-800 hover:bg-dark-900">
            <div className="flex flex-row items-center justify-between">
              <Typography weight={700} variant="sm">
                {selected}
              </Typography>
              <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="absolute w-full z-10 mt-2 border divide-y rounded shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-dark-900 bg-dark-1000 divide-dark-900"
          >
            {Object.entries(items).map(([k, v], index) => (
              <div
                key={index}
                onClick={() => setSelected(k as FarmFilter)}
                className="px-3 py-2 cursor-pointer hover:bg-dark-900/40"
              >
                {v}
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default OnsenFilter