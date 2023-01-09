import React, { ReactNode, useMemo } from 'react'
import { CurrencyDollarIcon, UserGroupIcon, MoonIcon, StarIcon } from '@heroicons/react/24/outline'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SOUL_ADDRESS } from 'sdk'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
// import { useRouter } from 'next/router'

// import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
// import { getChainColor } from 'constants/chains'
// import Twitter from 'assets/icons/twitter.png'
// import { TwitterIcon } from 'components/Icon'

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

  // const router = useRouter()
  // const isActive = (activeLinks) => router.asPath.startsWith(activeLinks)

  // const isLuxor = router.asPath.startsWith('/luxor')
  // const isSwap =  router.asPath.startsWith('/swap')
  // const isBond = router.asPath.startsWith('/bonds')
  // const isFarm =  router.asPath.startsWith('/farm')
  // const isStake =  router.asPath.startsWith('/autostake')
  // const isAnalytics =  router.asPath.startsWith('/analytics')
  // const isLending =  router.asPath.startsWith('/lend')
  
  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
      icon: <ArrowsUpDownIcon width={20} 
      className={
        classNames('text-white'
        )} 
        />,
    }

    // If AMM is enabled, replace swap button with a submenu under trade
    /* if (featureEnabled(Feature.AMM, chainId)) {
     tradeMenu = {
       key: 'exchange',
       title: i18n._(t`Exchange`),
       icon: <ArrowsUpDownIcon width={20} />,
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

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const farmItems = {
        key: 'farm',
        title: i18n._(t`Farm`),
        icon: <CurrencyDollarIcon width={20} className={classNames(
          "filter", "text-white"
          // isFarm ? 'text-black' : `text-[${getChainColor(chainId)}]`
          // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
          )} />,
        link: '/farm'
      }
      mainItems.push(farmItems)
    }

    if ([250, 43114].includes(chainId)) {
      const mintItems = {
        key: 'bond',
        title: i18n._(t`Bond`),
        icon: <MoonIcon width={20} className={classNames(
          "filter", "text-white"
          // isBond ? 'text-black' : `text-[${getChainColor(chainId)}]`
          // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
          )} />,
        link: '/bonds'
      }
      mainItems.push(mintItems)
    }

    if ([250, 43114].includes(chainId)) {
      const stakeItems = {
        key: 'stake',
        title: i18n._(t`Stake`),
        icon: <StarIcon width={20} className={classNames(
          "filter", "text-white"
          // isStake ? 'text-black' : `text-[${getChainColor(chainId)}]`
        )} 
        />,
        link: '/autostake'
      }
      mainItems.push(stakeItems)
    }

    if (featureEnabled(Feature.AMM, chainId)) {
      mainItems.push({
          key: 'lending',
          title: i18n._(t`Lend`),
          icon: <ArrowsUpDownIcon width={20} className={classNames(
            "rotate-90 filter", "text-white"
            // isLending ? 'text-black' : `text-[${getChainColor(chainId)}]`
            // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
          )} />,
          link: '/lend'
      })
    }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu