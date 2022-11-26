import React, { ReactNode, useMemo } from 'react'
import { GlobeIcon, SwitchVerticalIcon, SparklesIcon, TrendingUpIcon, PresentationChartLineIcon, SunIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, NATIVE, SOUL_ADDRESS } from 'sdk'
import { PoolIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { getChainColor } from 'constants/chains'
import { MenuAlt1Icon } from '@heroicons/react/outline'

export interface DropdownItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface DropdownItemNode {
  key: string
  title: string
  items: DropdownItemLeaf[]
  icon: ReactNode
}

export type BarItem = DropdownItemLeaf | DropdownItemNode
export type Bar = BarItem[]

type UseDropdown = () => Bar
const useMenu: UseDropdown = () => {
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
   
   let poolMenu: BarItem = {
      key: 'pool',
      title: i18n._(t`Liquidity`),
      link: '/pool',
      icon: <PoolIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
   }

 // If AMM is enabled, replace swap button with a submenu under trade
if (featureEnabled(Feature.AMM, chainId)) {
  tradeMenu = {
    key: 'swap',
    title: i18n._(t`Swap`),
    icon: <SwitchVerticalIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    items: [
      {
        key: 'exchange',
        title: i18n._(t`Swap`),
        link: '/swap',
      },
      {
        key: 'aggregator',
        title: i18n._(t`Aggregate`),
        link: '/aggregator',
      },
      {
        key: 'limit-orders',
        title: i18n._(t`Limit`),
        link: '/cross',
      },
      {
        key: 'crosschain',
        title: i18n._(t`Cross`),
        link: '/cross',
      },
      {
        key: 'bridge',
        title: i18n._(t`Bridge`),
        link: '/bridge',
      }
    ],
  }
}

if (featureEnabled(Feature.LIQUIDITY, chainId)) {
  poolMenu = {
    key: 'pool',
    title: i18n._(t`Liquidity`),
    icon: <PoolIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    items: [
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
    ],
  }
}

let socialMenu = {
  key: 'socials',
  title: i18n._(t`Socials`),
  icon: <UserGroupIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
  items: [
    {
      key: 'discord',
      title: 'Discord',
      link: 'https://discord.com/invite/DQjChB6Wa6',
    },
    {
      key: 'telegram',
      title: 'Telegram',
      link: 'https://t.me/SoulSwapDeFi',
    },
    {
      key: 'twitter',
      title: 'Twitter',
      link: `https://twitter.com/${ isLuxor ? 'LuxorMoney' : 'SoulSwapFinance' }`,
    },
    {
      key: 'forum',
      title: 'Forum',
      link: 'https://forum.soulswap.finance',
    },
    {
      key: 'medium',
      title: 'Medium',
      link: 'https://soulswapfinance.medium.com',
    },
    {
      key: 'email',
      title: 'Email',
      link: 'mailto:soulswapfinance@gmail.com',
    },
  ],
}

  const mainItems: Bar = [tradeMenu, poolMenu, socialMenu]

    // Balances
    // mainItems.push({
    //   key: 'balances',
    //   title: i18n._(t`Account`),
    //   link: '/balances',
    //   icon: <WalletIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })

    // let exploreMenu: BarItem = {
    //   key: 'explore',
    //   title: i18n._(t`Explore`),
    //   link: '/explore',
    //   icon: <GlobeIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`)} />,
    // }
    //   mainItems.push(exploreMenu)

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu