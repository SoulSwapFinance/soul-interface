import React, { ReactNode, useMemo } from 'react'
import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon, SunIcon, CurrencyDollarIcon, UserGroupIcon, PlusIcon, MoonIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SOUL_ADDRESS } from 'sdk'
// import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { getChainColor } from 'constants/chains'
import Twitter from 'assets/icons/twitter.png'
export interface MenuItemLeaf {
  key: string
  title?: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const isLuxor = router.asPath.startsWith('/luxor')

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
      icon: <SwitchVerticalIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
    }

    // If AMM is enabled, replace swap button with a submenu under trade
    /* if (featureEnabled(Feature.AMM, chainId)) {
     tradeMenu = {
       key: 'exchange',
       title: i18n._(t`Exchange`),
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
           link: '/cross',
         },
       ],
     }
   } */

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
      const farmItems = {
        key: 'farm',
        title: i18n._(t`Farm`),
        icon: <CurrencyDollarIcon width={20} className={classNames("filter", isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        link: '/farm'
        // items: [
        //   {
        //     key: 'soul-dashboard',
        //     title: i18n._(t`Overview`),
        //     link: '/soul/dashboard',
        //   },
        //   {
        //     key: 'earn',
        //     title: i18n._(t`Rewards`),
        //     link: '/explore'
        //   },
        //   {
        //     key: 'farm',
        //     title: i18n._(t`Summoner`),
        //     link: '/farm'
        //   },
        //   {
        //     key: 'pool',
        //     title: i18n._(t`Liquidity`),
        //     link: '/pool',
        //   },
        //   {
        //     key: 'soul-docs',
        //     title: i18n._(t`Tutorials`),
        //     link: 'https://docs.soulswap.finance/docs/user-guides/exchange/swapping-tokens',
        //   },
        // ],
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.LUXOR, chainId)) {
      const mintItems = {
        key: 'mint',
        title: i18n._(t`Mint`),
        icon: <MoonIcon width={20} className={classNames("filter", isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        link: '/bonds'
      }
      mainItems.push(mintItems)
    }

    if (featureEnabled(Feature.LUXOR, chainId)) {
      const luxorItems = {
        key: 'Luxor',
        title: i18n._(t`Bond`),
        icon: <SunIcon width={20} className={classNames("rotate-90 filter", isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        link: '/luxor/bonds'
        // items: [
        //   {
        //     key: 'luxor-dashboard',
        //     title: i18n._(t`Overview`),
        //     link: '/luxor/dashboard',
        //   },
        //   {
        //     key: 'earn',
        //     title: i18n._(t`Explore`),
        //     link: '/explore',
        //   },
        //   {
        //     key: 'sor',
        //     title: i18n._(t`Stable`),
        //     link: '/luxor/sor',
        //   },
        //   {
        //     key: 'lux-docs',
        //     title: i18n._(t`Tutorials`),
        //     link: 'https://docs.luxor.money',
        //   },
        // ],
      }
      mainItems.push(luxorItems)
    }

    if ([1, 250, 43114].includes(chainId)) {
      const bridgeItem = {
        key: 'bridge',
        title: i18n._(t`Bridge`),
        icon: <GlobeIcon width={20} className={classNames("rotate-90 filter", isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        link: '/cross'
        // items: [
        //   {
        //     key: 'luxor-dashboard',
        //     title: i18n._(t`Overview`),
        //     link: '/luxor/dashboard',
        //   },
        //   {
        //     key: 'earn',
        //     title: i18n._(t`Explore`),
        //     link: '/explore',
        //   },
        //   {
        //     key: 'sor',
        //     title: i18n._(t`Stable`),
        //     link: '/luxor/sor',
        //   },
        //   {
        //     key: 'lux-docs',
        //     title: i18n._(t`Tutorials`),
        //     link: 'https://docs.luxor.money',
        //   },
        // ],
      }
      mainItems.push(bridgeItem)
    }


    if (featureEnabled(Feature.UNDERWORLD, chainId)) {
      //   mainItems.push({
      //     key: 'lending',
      //     title: i18n._(t`Lend`),
      //     icon: <SwitchVerticalIcon width={20} className={classNames("rotate-90 filter", isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
      //     items: [
      //       {
      //         key: 'markets',
      //         title: i18n._(t`Markets`),
      //         link: '/underworld',
      //        },
      //       {
      //         key: 'lend',
      //         title: i18n._(t`Lend`),
      //         link: '/lend',
      //        },
      //       {
      //         key: 'borrow',
      //         title: i18n._(t`Borrow`),
      //         link: '/borrow',
      //        },
      //       {
      //         key: 'underworld-farms',
      //         title: i18n._(t`Farms`),
      //         link: '/summoner',
      //       },
      //       {
      //         key: 'balances',
      //         title: 'Coffinbox',
      //         link: '/balances',
      //       },
      //       {
      //         key: 'borrow-docs',
      //         title: i18n._(t`Tutorials`),
      //         link: 'https://docs.soulswap.finance/docs/user-guides/our-underworld/borrowing-assets',
      //       },
      //     ],
      //   })

    }

    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      let analyticsMenu: MenuItem = {
        key: 'analytics',
        title: i18n._(t`Data`),
        icon: <TrendingUpIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        link: '/info'
        // items: [
        //   {
        //     key: 'dashboard',
        //     title: 'Overview',
        //     link: '/analytics/dashboard',
        //   },
        //   {
        //     key: 'wallet',
        //     title: 'Wallet',
        //     link: '/balances',
        //   },
        //   {
        //     key: 'tokens',
        //     title: 'Tokens',
        //     link: '/analytics/tokens',
        //   },
        //   {
        //     key: 'pairs',
        //     title: 'Pairs',
        //     link: '/analytics/pairs',
        //   },
        // ],
      }
      mainItems.push(analyticsMenu)
    }

    if (featureEnabled(Feature.AMM, chainId)) {
      mainItems.push({
        key: 'socials',
        title: i18n._(t`Follow`),
        icon: <UserGroupIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
        link: `https://twitter.com/${isLuxor ? 'LuxorMoney' : 'SoulSwapFinance'}`,
        // items: [
        //   {
        //     key: 'discord',
        //     title: 'Discord',
        //     link: 'https://discord.com/invite/DQjChB6Wa6',
        //   },
        //   {
        //     key: 'telegram',
        //     title: 'Telegram',
        //     link: 'https://t.me/SoulSwapDeFi',
        //   },
        //   {
        //     key: 'twitter',
        //     title: 'Twitter',
        //     link: `https://twitter.com/${isLuxor ? 'LuxorMoney' : 'SoulSwapFinance'}`,
        //   },
        //   {
        //     key: 'feedback',
        //     title: 'Feedback',
        //     link: '/board',
        //     // link: 'https://soulswap.nolt.io',
        //   },
        //   {
        //     key: 'forum',
        //     title: 'Forum',
        //     link: 'https://forum.soulswap.finance',
        //   },
        //   {
        //     key: 'medium',
        //     title: 'Medium',
        //     link: 'https://soulswapfinance.medium.com',
        //   },
        // ],
      })

    }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu