import React, { ReactNode, useMemo } from 'react'
// import { CurrencyDollarIcon, UserGroupIcon, MoonIcon, StarIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { getChainColor } from 'constants/chains'
import DropletIcon from 'components/Icons/header/DropletIcon'
// import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
// import SoulIcon from 'components/Icons/header/SoulIcon'
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
  // const { asPath } = useRouter()

  const chainColor = getChainColor(chainId)

  // const router = useRouter()
  // const isActive = (activeLinks) => router.asPath.startsWith(activeLinks)

  // const isLuxor = router.asPath.startsWith('/luxor')
  // const isSwap =  router.asPath.startsWith('/swap')
  // const isBond = router.asPath.startsWith('/bonds')
  // const isFarm =  router.asPath.startsWith('/farm')
  // const isStake =  router.asPath.startsWith('/autostake')
  // const isAnalytics =  router.asPath.startsWith('/analytics')
  
  const WHITE = '#FFFFFF'

  return useMemo(() => {
    if (!chainId) return []

  // const removePage = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
  // const addPage = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
  // const poolPage = asPath.startsWith('/pool') || asPath.startsWith('/pools')
  // const swapPage = asPath.startsWith('/swap') || asPath.startsWith('/exchange/swap')
  // const crossPage = asPath.startsWith('/cross') || asPath.startsWith('/exchange/cross')
  // const bondPage = asPath.startsWith('/bonds')
  // const landingPage = asPath.startsWith('/landing')
  // const nftPage = asPath.startsWith('/marketplace') || asPath.startsWith('/marketplace/collections')
  // const docsPage = asPath.startsWith('/learn')

  // const isFarm = asPath.startsWith('/farm') || asPath.startsWith('/summoner')
  // const isVault = asPath.startsWith('/autostake')
  // const isLuxor = asPath.startsWith('/luxor') || asPath.startsWith('/luxor/dashbord') || asPath.startsWith('/luxor/bonds') || asPath.startsWith('/luxor/stake')

  // const isLiquidity = removePage || addPage || poolPage
  // const isHome = landingPage
  // const isLend = lendPage
  // const isDocs = docsPage
  // const isNFT = nftPage
  // const isExplore = explorePage
  // const isExplore = asPath.startsWith('/explore')
  // const isWallet = asPath.startsWith('/balances') || asPath.startsWith('/portfolio')
  // const isEarn = isFarm || bondPage || isVault
  // const isExchange = swapPage || crossPage
  const iconStyle = `p-2 rounded bg-dark-900`

    // const SWAP_ICON = 
    // <div className={iconStyle}>
    //   <SwapIcon
    //   fillPrimary={open ? WHITE : getChainColor(chainId)}
    //   fillSecondary={open ? getChainColor(chainId) : WHITE}
    //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-md w-8 h-6` : `hidden`)}
    //   />
    // </div>

  // const SUN_ICON = 
  // <div className={iconStyle}>
  //   <SunMoonIcon
  //   fillPrimary={open ? WHITE : chainColor }
  //   fillSecondary={open ? chainColor : WHITE }
  //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  //   />
  // </div>
  // const EARN_ICON = 
  // <div className={iconStyle}>
  //   <SeedlingIcon
  //   fillPrimary={open ? WHITE : chainColor }
  //   fillSecondary={open ? chainColor : WHITE}
  //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  // />
  // </div>

  const POOL_ICON = 
  <div className={iconStyle}>
    <DropletIcon
    fillPrimary={open ? WHITE : chainColor }
    fillSecondary={open ? chainColor : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? 
      `cursor-pointer rounded-xl w-8 h-6` : `hidden`)}
  />
  </div>

  // const WALLET_ICON = <WalletIcon
  //   fillPrimary={open ? WHITE : chainColor }
  //   fillSecondary={open ? chainColor : WHITE}
  //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  // />

  // const EXPLORE_ICON = <BinocularsIcon
  // fillPrimary={open ? WHITE : chainColor }
  // fillSecondary={open ? chainColor : WHITE}
  // className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  // />

  // const LEND_ICON = 
  // <div className={
  //   iconStyle
  // }>
  //   <LendSkullIcon
  //   fillPrimary={open ? chainColor : WHITE}
  //   fillSecondary={open ? WHITE : chainColor }
  //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  // />
  // </div>

  // const DOCS_ICON = 
  // <div className={
  //     iconStyle
  //   }>
  //   <DocsIcon
  //   fillPrimary={open ? chainColor : WHITE}
  //   fillSecondary={open ? WHITE : chainColor }
  //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  //   />
  //   </div>

// const VAULT_ICON = 
//   <div className={
//       iconStyle
//     }>
//     <VaultIcon
//     fillPrimary={open ? WHITE : chainColor }
//     fillSecondary={open ? chainColor : WHITE}
//     className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
//     />
//     </div>

// const CHART_ICON = 
//   <div className={
//       iconStyle
//     }>
//     <ChartIcon
//     fillPrimary={open ? WHITE : chainColor }
//     fillSecondary={open ? chainColor : WHITE}
//     className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
//     />
//     </div>

  // const NFT_ICON = <NftIcon
  //   fillPrimary={open ? chainColor : WHITE}
  //   fillSecondary={open ? WHITE : chainColor }
  //   className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded rounded-xl w-8 h-6` : `hidden`)}
  // />

  // const SOUL_ICON = 
  // <div className={classNames(`p-0 rounded rounded-xl bg-dark-900`, `h-6 mb-4 mt-1`)}>
  // <Image 
  //   src={'/favicon.png'} height={36} width={36} 
  //   objectFit={`contain`}
  //   className={'bg-dark-900 rounded rounded-xl'}
  //   alt={"soulswap logo icon"}
  //   />
  //   </div>

    // By default show just a swap button
    // let tradeMenu: MenuItem = {
    //   key: 'swap',
    //   title: i18n._(t`Swap`),
    //   link: '/swap',
    //   icon: SWAP_ICON,
    //   // <ArrowsUpDownIcon width={20} 
    //   // className={
    //   //   classNames('text-white'
    //   //   )} 
    //   //   />,
    // }

    const mainItems: Menu = [] // tradeMenu

    if (featureEnabled(Feature.AMM, chainId)) {
      const farmItems = {
        key: 'pool',
        title: i18n._(t`Pool`),
        // icon: POOL_ICON,
        // icon: <div className={`grid grid-cols-2`}> 
        //     <PlusCircleIcon width={14} className={classNames(
        //   `filter text-white mb-2`
        //   )} />
        //   <MinusCircleIcon width={14} className={classNames(
        //   `filter text-white mt-2`
        //     )} />
        //     </div>,
        link: '/pool'
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.LUXOR, chainId)) {
      const luxorItem = {
        key: 'luxor',
        title: i18n._(t`Luxor`),
        // icon: SUN_ICON,
        link: '/luxor'
      }
      mainItems.push(luxorItem)
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

    // if ([ChainId.FANTOM, ChainId.AVALANCHE].includes(chainId)) {
    //   const farmItems = {
    //     key: 'farm',
    //     title: i18n._(t`Farm`),
    //     icon: EARN_ICON,
    //     // icon: <CircleStackIcon width={20} className={classNames(
    //     //   `filter text-white`
    //     //   // isBond ? 'text-black' : `text-[${getChainColor(chainId)}]`
    //     //   // isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`
    //     //   )} />,
    //     link: '/farms'
    //   }
    //   mainItems.push(farmItems)
    // }

    // if (featureEnabled(Feature.UNDERWORLD, chainId)) {
    //   mainItems.push({
    //       key: 'vault',
    //       title: i18n._(t`Stake`),
    //       icon: <BuildingLibraryIcon width={20} className={classNames(
    //         `filter text-white`
    //         )} />,
    //       link: '/autostake'
    //   })
    // }

    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //       key: 'explore',
    //       title: i18n._(t`Paths`),
    //       icon: <MagnifyingGlassCircleIcon width={20} className={classNames(
    //         `filter text-white`
    //       )} />,
    //       link: '/explore'
    //   })
    // }
    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //       key: 'vault',
    //       title: i18n._(t`Vault`),
    //       icon:
    //         VAULT_ICON,
    //       // icon: <MagnifyingGlassCircleIcon width={20} className={classNames(
    //       //   `filter text-white`
    //       // )} />,
    //       link: '/autostake'
    //   })
    // }

    if (featureEnabled(Feature.AMM, chainId)) {
      mainItems.push({
          key: 'whitepaper',
          title: i18n._(t`Learn`),
          // icon: DOCS_ICON,
          // icon: <DocumentIcon width={20} className={classNames(
          //   `filter text-white`
          //   )} />,
          link: '/learn'
      })
    }

    // if (featureEnabled(Feature.NFT, chainId)) {
    //   mainItems.push({
    //       key: 'nft',
    //       title: i18n._(t`Infinity`),
    //       icon: <PhotoIcon width={20} className={classNames(
    //         `filter text-white`
    //         )} />,
    //       link: '/marketplace'
    //   })
    // }

    // if (featureEnabled(Feature.ANALYTICS, chainId)) {
    //   mainItems.push({
    //       key: 'data',
    //       title: i18n._(t`Analytics`),
    //       // icon: CHART_ICON,
    //       // icon: <PresentationChartLineIcon width={20} className={classNames(
    //       //   `filter text-white`
    //       //   )} />,
    //       link: '/analytics'
    //   })
    // }


    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu