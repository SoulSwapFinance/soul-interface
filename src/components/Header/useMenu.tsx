import React, { ReactNode, useMemo } from 'react'
import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SOUL_ADDRESS } from 'sdk'
import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Exchange`),
      link: '/swap',
      icon: <SwitchVerticalIcon width={20} />,
    }
 // If AMM is enabled, replace swap button with a submenu under trade
 /* if (featureEnabled(Feature.AMM, chainId)) {
  tradeMenu = {
    key: 'exchange',
    title: i18n._(t`SWAP`),
    icon: <SwitchVerticalIcon width={16} />,
    items: [
      {
        key: 'swap',
        title: i18n._(t`Swap`),
        link: '/swap',
      },
      {
        key: 'bridge',
        title: i18n._(t`Bridge`),
        link: '/bridge',
      },
    ],
  }
} */
    // If limit orders is enabled, replace swap button with a submenu under trade
    if (featureEnabled(Feature.AMM, chainId)) {
      tradeMenu = {
        key: 'trade',
        title: i18n._(t`Exchange`),
        icon: <SwitchVerticalIcon width={20} />,
        items: [
          {
            key: 'swap',
            title: i18n._(t`Swap`),
            link: '/swap',
          },
          {
            key: 'pool',
            title: i18n._(t`Pool`),
            link: '/pool',
          },
          {
            key: 'bridge',
            title: i18n._(t`Bridge`),
            link: 'https://bridge.soulswap.finance',
          },
          {
            key: 'limit',
            title: i18n._(t`Limit`),
            link: '/limit',
          },
          {
            key: 'margin',
            title: i18n._(t`Margin`),
            link: '/margin',
          },
        ],
      }
    }

    const poolMenu = [
      {
        key: 'browse',
        title: i18n._(t`Browse`),
        link: '/pool',
      },
      {
        key: 'add-liquidity',
        title: i18n._(t`Add`),
        link: `/add/FTM/${SOUL_ADDRESS[chainId]}`,
      },
      {
        key: 'remove-liquidity',
        title: i18n._(t`Remove`),
      link: `/remove/FTM/${SOUL_ADDRESS[chainId]}`,
      },
      {
        key: 'import',
        title: i18n._(t`Import`),
        link: '/find',
      },
    ]

    if (featureEnabled(Feature.MIGRATE, chainId)) {
      poolMenu.push({
        key: 'migrate',
        title: i18n._(t`Migrate`),
        link: '/migrate',
      })
    }

    const mainItems: Menu = [tradeMenu]

    // if (poolMenu.length > 0)
    //   mainItems.push({
    //     key: 'pool',
    //     title: i18n._(t`Liquidity`),
    //     items: poolMenu,
    //     icon: <PoolIcon width={20} />,
    //   })

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const learnItems = {
        key: 'Learn',
        title: i18n._(t`Explore`),
        icon: <GlobeIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'explore',
            title: i18n._(t`Explore`),
            link: '/explore',
          },
          {
            key: 'soul-docs',
            title: i18n._(t`Swap`),
            link: 'https://docs.soulswap.finance/docs/user-guides/exchange/swapping-tokens',
          },
          {
            key: 'borrow-docs',
            title: i18n._(t`Borrow`),
            link: 'https://docs.soulswap.finance/docs/user-guides/our-underworld/borrowing-assets',
          },
          {
            key: 'lux-docs',
            title: i18n._(t`Bond`),
            link: 'https://docs.luxor.money',
          },
        ],
      }
      mainItems.push(learnItems)
      }

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const farmItems = {
        key: 'Rewards',
        title: i18n._(t`Accumulate`),
        icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'farm',
            title: i18n._(t`Farm`),
            link: '/mines?filter=active',
          },
          {
            key: 'vault',
            title: i18n._(t`Vault`),
            link: '/autostake',
          },
          {
            key: 'staking',
            title: i18n._(t`Stake`),
            link: '/seance',
          },
          {
            key: 'luxor',
            title: i18n._(t`Luxor`),
            link: '/luxor',
          },
          {
            key: 'sor',
            title: i18n._(t`Stable`),
            link: '/sor',
          },
          {
            key: 'bonds',
            title: i18n._(t`Bond`),
            link: '/bonds',
          },
        ],
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.UNDERWORLD, chainId))
     {
      mainItems.push({
        key: 'lending',
        title: i18n._(t`Borrow`),
        icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'lend',
            title: i18n._(t`Lend`),
            link: '/lend',
          },
          {
            key: 'borrow',
            title: i18n._(t`Borrow`),
            link: '/borrow',
          },
        ],
      })
      
    }

    // if (featureEnabled(Feature.MISO, chainId)) {
    //   mainItems.push({
    //     key: 'launchpad',
    //     title: i18n._(t`Launchpad`),
    //     icon: <RocketIcon width={20} />,
    //     items: [
    //       {
    //         key: 'marketplace',
    //         title: i18n._(t`Marketplace`),
    //         link: '/miso',
    //       },
    //       {
    //         key: 'factory',
    //         title: i18n._(t`Factory`),
    //         link: '/miso/auction',
    //       },
    //     ],
    //   })
    // }

    let analyticsMenu: MenuItem = {
      key: 'analytics',
      title: i18n._(t`Analytics`),
      icon: <TrendingUpIcon width={20} />,
      items: [
        {
          key: 'balances',
          title: 'Coffin',
          link: '/balances',
        },
        {
          key: 'luxor-dashboard',
          title: 'Luxor',
          link: '/dashboard',
        },
        {
          key: 'wallet',
          title: 'Wallet',
          link: '/info/dashboard',
        },
        {
          key: 'dashboard',
          title: 'Data',
          link: '/analytics/dashboard',
        },
        {
          key: 'tokens',
          title: 'Tokens',
          link: '/analytics/tokens',
        },
        {
          key: 'pairs',
          title: 'Pairs',
          link: '/analytics/pairs',
        },
      ],
    }

    // if (featureEnabled(Feature.COFFINBOX, chainId)) {
    //   analyticsMenu.items.push({
    //     key: 'coffinbox',
    //     title: 'CoffinBox',
    //     link: '/analytics/coffinbox',
    //   })
    // }

    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      mainItems.push(analyticsMenu)
    }

    // mainItems.push({
    //   key: 'balances',
    //   title: i18n._(t`Portfolio`),
    //   link: '/balances',
    //   icon: <WalletIcon width={20} />,
    // })

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu