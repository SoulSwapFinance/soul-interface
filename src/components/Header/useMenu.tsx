import React, { ReactNode, useMemo } from 'react'
import { CurrencyDollarIcon, UserGroupIcon, MoonIcon, StarIcon, PlusCircleIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { BanknotesIcon, CircleStackIcon, MinusCircleIcon, PhotoIcon, PresentationChartLineIcon, SunIcon } from '@heroicons/react/24/solid'
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

    const mainItems: Menu = [tradeMenu]

    if (featureEnabled(Feature.AMM, chainId)) {
      const farmItems = {
        key: 'pool',
        title: i18n._(t`Pool`),
        icon: <div className={`grid grid-cols-2`}> 
            <PlusCircleIcon width={14} className={classNames(
          `filter text-white mb-2`
          )} />
          <MinusCircleIcon width={14} className={classNames(
          `filter text-white mt-2`
            )} />
            </div>,
        link: '/pool'
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.LUXOR, chainId)) {
      const farmItems = {
        key: 'luxor',
        title: i18n._(t`Luxor`),
        icon: <SunIcon width={20} className={classNames(
          `filter text-white`
          // isFarm ? 'text-black' : `text-[${getChainColor(chainId)}]`
          // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
          )} />,
        link: '/luxor'
      }
      mainItems.push(farmItems)
    }
    
    // if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
    //   const farmItems = {
    //     key: 'farm',
    //     title: i18n._(t`Farm`),
    //     icon: <CurrencyDollarIcon width={20} className={classNames(
    //       "filter", "text-white"
    //       // isFarm ? 'text-black' : `text-[${getChainColor(chainId)}]`
    //       // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
    //       )} />,
    //     link: '/farm'
    //   }
    //   mainItems.push(farmItems)
    // }

    // if ([ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId)) {
    //   const mintItems = {
    //     key: 'bond',
    //     title: i18n._(t`Bond`),
    //     icon: <MoonIcon width={20} className={classNames(
    //       "filter", "text-white"
    //       // isBond ? 'text-black' : `text-[${getChainColor(chainId)}]`
    //       // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
    //       )} />,
    //     link: '/bonds'
    //   }
    //   mainItems.push(mintItems)
    // }

    if ([ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId)) {
      const farmItems = {
        key: 'farm',
        title: i18n._(t`Farm`),
        icon: <CircleStackIcon width={20} className={classNames(
          `filter text-white`
          // isBond ? 'text-black' : `text-[${getChainColor(chainId)}]`
          // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
          )} />,
        link: '/farms'
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.UNDERWORLD, chainId)) {
      mainItems.push({
          key: 'lending',
          title: i18n._(t`Lend`),
          icon: <BanknotesIcon width={20} className={classNames(
            `filter text-white`
            )} />,
          link: '/lend'
      })
    }

    if (featureEnabled(Feature.AMM, chainId)) {
      mainItems.push({
          key: 'whitepaper',
          title: i18n._(t`Docs`),
          icon: <DocumentIcon width={20} className={classNames(
            `filter text-white`
            )} />,
          link: '/learn'
      })
    }

    if (featureEnabled(Feature.NFT, chainId)) {
      mainItems.push({
          key: 'nft',
          title: i18n._(t`Infinity`),
          icon: <PhotoIcon width={20} className={classNames(
            `filter text-white`
            )} />,
          link: '/marketplace'
      })
    }

    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      mainItems.push({
          key: 'data',
          title: i18n._(t`Data`),
          icon: <PresentationChartLineIcon width={20} className={classNames(
            `filter text-white`
            )} />,
          link: '/analytics'
      })
    }
    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //       key: 'explore',
    //       title: i18n._(t`Paths`),
    //       icon: <ArrowsUpDownIcon width={20} className={classNames(
    //         "rotate-90 filter", "text-white"
    //       )} />,
    //       link: '/explore'
    //   })
    // }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu