import React, { ReactNode, useMemo } from 'react'
import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon, SunIcon, CurrencyDollarIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SOUL_ADDRESS } from 'sdk'
import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'

export interface BarItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface BarItemNode {
  key: string
  title: string
  items: BarItemLeaf[]
  icon: ReactNode
}

export type BarItem = BarItemLeaf | BarItemNode
export type Bar = BarItem[]

type UseBar = () => Bar
const useMenu: UseBar = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: BarItem = {
      key: 'swap',
      title: i18n._(t`Exchange`),
      link: '/swap',
      icon: <SwitchVerticalIcon width={20} className="text-white" />,
    }
  
 // If AMM is enabled, replace swap button with a submenu under trade
 /* if (featureEnabled(Feature.AMM, chainId)) {
  tradeMenu = {
    key: 'exchange',
    title: i18n._(t`SWAP`),
    icon: <SwitchVerticalIcon width={20} />,
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
    // if (featureEnabled(Feature.AMM, chainId)) {
    //   tradeMenu = {
    //     key: 'trade',
    //     title: i18n._(t`Exchange`),
    //     icon: <SwitchVerticalIcon width={20} className="text-dark-600" />,
    //     items: [
    //       {
    //         key: 'swap',
    //         title: i18n._(t`Swap`),
    //         link: '/swap',
    //       },
    //       {
    //         key: 'pool',
    //         title: i18n._(t`Pool`),
    //         link: '/pool',
    //       },
    //       {
    //         key: 'bridge',
    //         title: i18n._(t`Bridge`),
    //         link: 'https://bridge.soulswap.finance',
    //       },
    //       {
    //         key: 'limit',
    //         title: i18n._(t`Limit`),
    //         link: '/limit',
    //       },
    //       {
    //         key: 'margin',
    //         title: i18n._(t`Margin`),
    //         link: '/margin',
    //       },
    //     ],
    //   }
    // }

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

    const mainItems: Bar = [tradeMenu]

    if (poolMenu.length > 0)
      mainItems.push({
        key: 'pool',
        title: i18n._(t`Liquidity`),
        items: poolMenu,
        icon: <PoolIcon width={20} className="text-blue" />,
      })

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const farmItems = {
        key: 'SoulSwap',
        title: i18n._(t`SoulSwap`),
        icon: <CurrencyDollarIcon width={20} className="text-deepPurple filter" />,
        items: [
          {
            key: 'farm',
            title: i18n._(t`Farms`),
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
            key: 'bonds',
            title: i18n._(t`Bonds`),
            link: '/bonds',
          },
          {
            key: 'bridge',
            title: i18n._(t`Bridge`),
            link: 'https://bridge.soulswap.finance',
          },
          {
            key: 'soul-docs',
            title: i18n._(t`Tutorial`),
            link: 'https://docs.soulswap.finance/docs/user-guides/exchange/swapping-tokens',
          },
          {
            key: 'soul-follow',
            title: i18n._(t`Follow`),
            link: 'https://twitter.com/SoulSwapFinance',
          },
        ],
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const learnItems = {
        key: 'Luxor',
        title: i18n._(t`Luxor`),
        icon: <SunIcon width={20} className="rotate-90 text-yellow filter" />,
        items: [
          {
            key: 'luxor-dashboard',
            title: i18n._(t`Overview`),
            link: '/luxor/dashboard',
          },
          {
            key: 'luxor-bonds',
            title: i18n._(t`Bonds`),
            link: '/luxor/bonds',
          },
          {
            key: 'sor',
            title: i18n._(t`Stable`),
            link: '/luxor/sor',
          },
          {
            key: 'luxor-staking',
            title: i18n._(t`Stake`),
            link: '/luxor/stake',
          },
          {
            key: 'luxor-wrap',
            title: i18n._(t`Wrap`),
            link: '/luxor/wrap',
          },
          {
            key: 'luxor-calculator',
            title: i18n._(t`Calculator`),
            link: '/luxor/calculator',
          },
          {
            key: 'luxor-docs',
            title: i18n._(t`Tutorial`),
            link: 'https://docs.luxor.money',
          },
          {
            key: 'luxor-follow',
            title: i18n._(t`Follow`),
            link: 'https://twitter.com/LuxorMoney',
          },
        ],
      }
      mainItems.push(learnItems)
      }
    
      if (featureEnabled(Feature.UNDERWORLD, chainId))
      {
       mainItems.push({
         key: 'lending',
         title: i18n._(t`Lending`),
         icon: <SwitchVerticalIcon width={20} className="rotate-90 text-pink filter" />,
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
            {
              key: 'underworld-farms',
              title: i18n._(t`Mines`),
              link: '/mines?filter=lending',
            },
            {
              key: 'balances',
              title: 'Coffinbox',
              link: '/balances',
            },
            {
              key: 'borrow-docs',
              title: i18n._(t`Tutorials`),
              link: 'https://docs.soulswap.finance/docs/user-guides/our-underworld/borrowing-assets',
            },
         ],
       })
       
     }

    if (featureEnabled(Feature.AMM, chainId))
     {
      mainItems.push({
        key: 'analytics',
        title: i18n._(t`Analytics`),
        icon: <TrendingUpIcon width={20} className="text-red" />,
        items: [
          {
            key: 'wallet',
            title: 'Wallet',
            link: '/info/dashboard',
          },
          {
            key: 'dashboard',
            title: 'Overview',
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
      })
      
    }

    let exploreMenu: BarItem = {
      key: 'explore',
      title: i18n._(t`Explore`),
      link: '/explore',
      icon: <GlobeIcon width={20} className="text-green" />,
    }
      mainItems.push(exploreMenu)

      
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

    // Balances
    mainItems.push({
      key: 'balances',
      title: i18n._(t`Portfolio`),
      link: '/balances',
      icon: <WalletIcon width={20} className="text-dark-600" />,
    })
    

    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //     key: 'academy',
    //     title: i18n._(t`Academy`),
    //     icon: <RocketIcon width={20} className="text-dark-600" />,
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
    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu