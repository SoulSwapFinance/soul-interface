import React, { ReactNode, useMemo } from 'react'
import { SparklesIcon, ArrowsUpDownIcon, ChartBarIcon } from'@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, NATIVE, SOUL_ADDRESS } from 'sdk'
// import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
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
export type MobileMenu = MenuItem[]

type UseMobileMenu = () => MobileMenu
const useMobileMenu: UseMobileMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Exchange`),
      link: '/swap',
      // icon: <ArrowsUpDownIcon width={16} />,
    }

    // If limit orders is enabled, replace swap button with a submenu under trade
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      tradeMenu = {
        key: 'trade',
        title: i18n._(t`Swap`),
        // icon: <ArrowsUpDownIcon width={16} />,
        items: [
          {
            key: 'swap',
            title: i18n._(t`Exchange`),
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
            link: '/cross',
          },
          {
            key: 'limit',
            title: i18n._(t`Limit`),
            link: '/limit',
          }
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
        link: `/add/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
      },
      {
        key: 'remove-liquidity',
        title: i18n._(t`Remove`),
      link: `/remove/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
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

    // const exploreMenu: MenuItemLeaf[] = []
    // if (featureEnabled(Feature.VESTING, chainId)) {
      // exploreMenu.push({
      //   key: 'all',
      //   title: i18n._(t`More`),
      //   link: '/explore',
      // })
    // }

    const mainItems: MobileMenu = [tradeMenu]

    // if (poolMenu.length > 0)
    //   mainItems.push({
    //     key: 'pool',
    //     title: i18n._(t`POOL`),
    //     items: poolMenu,
    //   })

    if (featureEnabled(Feature.SEANCE, chainId)) {
      const farmItems = {
        key: 'Rewards',
        title: i18n._(t`Rewards`),
        items: [
          {
            key: 'farm',
            title: i18n._(t`Farm`),
            link: '/summoner',
          },
          {
            key: 'vault',
            title: i18n._(t`Vault`),
            link: '/autostake',
          },
          {
            key: 'luxor',
            title: i18n._(t`Luxor`),
            link: '/luxor/bonds',
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

    if ([ChainId.AVALANCHE].includes(chainId)) {
      const farmItems = {
        key: 'Rewards',
        title: i18n._(t`Rewards`),
        items: [
          {
            key: 'farm',
            title: i18n._(t`Farm`),
            link: '/summoner',
          },
          {
            key: 'vault',
            title: i18n._(t`Vault`),
            link: '/autostake',
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

    if (featureEnabled(Feature.AMM, chainId))
     {
      mainItems.push({
        key: 'tools',
        title: i18n._(t`Tools`),
        // icon: <SparklesIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        items: [
        {
          key: 'bridge',
          title: i18n._(t`Bridge`),
          link: '/cross',
        },
        {
          key: 'stream',
          title: i18n._(t`SoulPay`),
          link: 'https://pay.soulswap.finance',
        },
      ]
    })
    }
      
    // if (featureEnabled(Feature.MISO, chainId)) {
    //   mainItems.push({
    //     key: 'launchpad',
    //     title: i18n._(t`Launchpad`),
    //     icon: <RocketIcon width={16} />,
    //     items: [
    //       {
    //         key: 'marketplace',
    //         title: i18n._(t`Marketplace`),
    //         link: '/market',
    //       },
    //       {
    //         key: 'factory',
    //         title: i18n._(t`Factory`),
    //         link: '/market/auction',
    //       },
    //     ],
    //   })
    // }

    let analyticsMenu: MenuItem = {
      key: 'analytics',
      title: i18n._(t`Data`),
      // icon: <ChartBarIcon width={16} />,
      items: [
        {
          key: 'portfolio',
          title: 'Coffin',
          link: '/balances',
        },
        {
          key: 'wallet',
          title: 'Wallet',
          link: '/info/dashboard',
        },
        {
          key: 'luxor-dashboard',
          title: 'Luxor',
          link: '/luxor/dashboard',
        },
        {
          key: 'dashboard',
          title: 'Review',
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

    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      mainItems.push(analyticsMenu)
    }

    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) {
      const learnItems = {
        key: 'Learn',
        title: i18n._(t`Learn`),
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
          // {
          //   key: 'lux-docs',
          //   title: i18n._(t`Bond`),
          //   link: 'https://luxor.soulswap.finance',
          // },
        ],
      }
      mainItems.push(learnItems)
      }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMobileMenu