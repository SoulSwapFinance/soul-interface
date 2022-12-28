import React, { ReactNode, useMemo } from 'react'
import { GlobeIcon, DocumentIcon, LinkIcon, SwitchVerticalIcon, SparklesIcon, TrendingUpIcon, PresentationChartLineIcon, SunIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, NATIVE, SOUL_ADDRESS } from 'sdk'
import { DiscordIcon, PoolIcon, RedditIcon, TelegramIcon, TokenomicsIcon, TwitterIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { getChainColor } from 'constants/chains'

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
  const router = useRouter()
  const isLuxor = router.asPath.startsWith('/luxor')

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: BarItem = {
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
      icon: <SwitchVerticalIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    }

    // If AMM is enabled, replace swap button with a submenu under trade
    /* if (featureEnabled(Feature.AMM, chainId)) {
     tradeMenu = {
       key: 'exchange',
       title: i18n._(t`Swap`),
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
    // If limit orders is enabled, replace swap button with a submenu under trade
    // if (featureEnabled(Feature.AMM, chainId)) {
    //   tradeMenu = {
    //     key: 'trade',
    //     title: i18n._(t`Exchange`),
    //     icon: <SwitchVerticalIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
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
    //         link: '/cross',
    //       },
    //       {
    //         key: 'limit',
    //         title: i18n._(t`Limit`),
    //         link: '/limit',
    //       },
    //     ],
    //   }
    // }

    // const poolMenu = [
    //   {
    //     key: 'browse',
    //     title: i18n._(t`Positions`),
    //     link: '/pool',
    //   },
    //   {
    //     key: 'add-liquidity',
    //     title: i18n._(t`Provide`),
    //     link: `/add/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
    //   },
    //   {
    //     key: 'remove-liquidity',
    //     title: i18n._(t`Remove`),
    //   link: `/remove/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
    //   },
    //   {
    //     key: 'import',
    //     title: i18n._(t`Import`),
    //     link: '/find',
    //   },
    // ]

    // if (featureEnabled(Feature.MIGRATE, chainId)) {
    //   poolMenu.push({
    //     key: 'migrate',
    //     title: i18n._(t`Migrate`),
    //     link: '/migrate',
    //   })
    // }

    const mainItems: Bar = [tradeMenu]

    // Pools
    mainItems.push({
      key: 'pools',
      title: i18n._(t`Pool`),
      link: '/pool',
      icon: <PoolIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })

    // if (poolMenu.length > 0)
    //   mainItems.push({
    //     key: 'pool',
    //     title: i18n._(t`Pool`),
    //     items: poolMenu,
    //     icon: <PoolIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    //   })

    // if ([ChainId.AVALANCHE].includes(chainId)) {
    //   const farmItems = {
    //     key: 'earn',
    //     title: i18n._(t`Earn`),
    //     icon: <CurrencyDollarIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    //     items: [
    //       // {
    //       //   key: 'soul-dashboard',
    //       //   title: i18n._(t`Overview`),
    //       //   link: '/soul/dashboard',
    //       // },
    //       // {
    //       //   key: 'cross',
    //       //   title: i18n._(t`Cross`),
    //       //   link: '/cross',
    //       // },
    //       {
    //         key: 'farm',
    //         title: i18n._(t`Farms`),
    //         link: '/summoner',
    //       },
    //       {
    //         key: 'vault',
    //         title: i18n._(t`Vault`),
    //         link: '/autostake',
    //       },
    //       {
    //         key: 'bonds',
    //         title: i18n._(t`Bonds`),
    //         link: '/bonds',
    //       },
    //       // {
    //       //   key: 'soul-docs',
    //       //   title: i18n._(t`Tutorial`),
    //       //   link: 'https://docs.soulswap.finance/docs/user-guides/exchange/swapping-tokens',
    //       // },
    //     ],
    //   }
    //   mainItems.push(farmItems)
    // }

    if (featureEnabled(Feature.BONDS, chainId)) {
      // Bond
      mainItems.push({
        key: 'bond',
        title: i18n._(t`Bond`),
        link: '/bonds',
        icon: <CurrencyDollarIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
      })
    }

    if (featureEnabled(Feature.UNDERWORLD, chainId)) {
      // Lend
      mainItems.push({
        key: 'lend',
        title: i18n._(t`Lend`),
        link: '/lend',
        icon: <SwitchVerticalIcon width={20} className={classNames("rotate-90", `text-[${getChainColor(chainId)}]`)} />,
      })
    }

    // if (featureEnabled(Feature.UNDERWORLD, chainId))
    // {
    //  mainItems.push({
    //    key: 'lending',
    //    title: i18n._(t`Lend`),
    //    icon: <SwitchVerticalIcon width={20} className={classNames("rotate-90", `text-[${getChainColor(chainId)}]`)} />,
    //    items: [
    //     //  {
    //     //    key: 'markets',
    //     //    title: i18n._(t`Markets`),
    //     //    link: '/underworld',
    //     //   },
    //       {
    //         key: 'lend',
    //         title: i18n._(t`Lend`),
    //         link: '/lend',
    //       },
    //       // {
    //       //   key: 'borrow',
    //       //   title: i18n._(t`Borrow`),
    //       //   link: '/borrow',
    //       // },
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
    //       // {
    //       //   key: 'borrow-docs',
    //       //   title: i18n._(t`Tutorial`),
    //       //   link: 'https://docs.soulswap.finance/docs/user-guides/our-underworld/borrowing-assets',
    //       // },
    //    ],
    //  })

    //  }

    // if (featureEnabled(Feature.AMM, chainId))
    //  {
    //   mainItems.push({
    //     key: 'analytics',
    //     title: i18n._(t`Data`),
    //     icon: <PresentationChartLineIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    //     items: [
    //       {
    //         key: 'wallet',
    //         title: 'Wallet',
    //         link: '/info/dashboard',
    //       },
    //       {
    //         key: 'dashboard',
    //         title: 'Overview',
    //         link: '/analytics/dashboard',
    //       },
    //       {
    //         key: 'tokens',
    //         title: 'Tokens',
    //         link: '/analytics/tokens',
    //       },
    //       {
    //         key: 'pairs',
    //         title: 'Pairs',
    //         link: '/analytics/pairs',
    //       },
    //     ],
    //   })

    // }

    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //     key: 'socials',
    //     title: i18n._(t`Follow`),
    //     icon: <UserGroupIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    //     items: [
    //       // {
    //       //   key: 'discord',
    //       //   title: 'Discord',
    //       //   link: 'https://discord.gg/soulswap',
    //       // },
    //       // {
    //       //   key: 'telegram',
    //       //   title: 'Telegram',
    //       //   link: 'https://t.me/SoulSwapDeFi',
    //       // },
    //       // {
    //       //   key: 'twitter',
    //       //   title: 'Twitter',
    //       //   link: `https://twitter.com/${ isLuxor ? 'LuxorMoney' : 'SoulSwapFinance' }`,
    //       // },
    //       {
    //         key: 'forum',
    //         title: 'Forum',
    //         link: 'https://forum.soulswap.finance',
    //       },
    //       {
    //         key: 'medium',
    //         title: 'Medium',
    //         link: 'https://soulswapfinance.medium.com',
    //       },
    //       {
    //         key: 'email',
    //         title: 'Email',
    //         link: 'mailto:soulswapfinance@gmail.com',
    //       },
    //     ],
    //   })

    // }

    // Explore
    mainItems.push({
      key: 'explore',
      title: i18n._(t`Explore`),
      link: '/explore',
      icon: <GlobeIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })

    // Links
    mainItems.push({
      key: 'links',
      title: i18n._(t`Links`),
      link: 'https://links.soul.sh',
      icon: <LinkIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })

    // // Explore
    // mainItems.push({
    //   key: 'explore',
    //   title: i18n._(t`Explore`),
    //   link: '/explore',
    //   icon: <GlobeIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })

    // Dashboard
    mainItems.push({
      key: 'dashboard',
      title: i18n._(t`Economy`),
      link: '/dashboard',
      icon: <TokenomicsIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })

    // Balances
    mainItems.push({
      key: 'balances',
      title: i18n._(t`Account`),
      link: '/balances',
      icon: <WalletIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })
    // Documentation
    mainItems.push({
      key: 'docs',
      title: i18n._(t`Tutorials`),
      link: 'https://docs.soulswap.finance',
      icon: <DocumentIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })

    // Twitter
    mainItems.push({
      key: 'twitter',
      title: i18n._(t`Twitter`),
      link: 'https://twitter.com/SoulSwapFinance',
      icon: <TwitterIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    })

    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //     key: 'tools',
    //     title: i18n._(t`Tools`),
    //     icon: <SparklesIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    //     items: [
    //       {
    //         key: 'data',
    //         title: i18n._(t`Data`),
    //         link: '/analytics',
    //         // link: '/info',
    //       },
    //       // {
    //       //   key: 'bridge',
    //       //   title: i18n._(t`Bridge`),
    //       //   link: '/bridge',
    //       // },
    //       {
    //         key: 'stream',
    //         title: i18n._(t`Stream`),
    //         link: 'https://pay.soulswap.finance',
    //       },
    //       {
    //         key: 'vote',
    //         title: i18n._(t`Vote`),
    //         link: 'https://enchant.soulswap.finance',
    //       },
    //       {
    //         key: 'request',
    //         title: i18n._(t`Request`),
    //         link: 'https://soulswap.nolt.io',
    //       },
    //     ]
    //   })
    // }

    // // Discord
    // mainItems.push({
    //   key: 'discord',
    //   title: i18n._(t`Discord`),
    //   link: 'https://discord.gg/soulswap',
    //   icon: <DiscordIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })

    // // Telegram
    // mainItems.push({
    //   key: 'telegram',
    //   title: i18n._(t`Telegram`),
    //   link: 'https://t.me/SoulSwapDeFi',
    //   icon: <TelegramIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })

    // // Reddit
    // mainItems.push({
    //   key: 'reddit',
    //   title: i18n._(t`Reddit`),
    //   link: 'https://www.reddit.com/r/SoulSwapDeFi',
    //   icon: <RedditIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })


    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu