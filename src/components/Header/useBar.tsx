import React, { ReactNode, useMemo } from 'react'
import { GlobeAltIcon, DocumentIcon, LinkIcon, ArrowsUpDownIcon, BanknotesIcon, ChartPieIcon, SparklesIcon, PresentationChartLineIcon, SunIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, NATIVE, SOUL_ADDRESS } from 'sdk'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { getChainColor, getChainColorCode } from 'constants/chains'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import DropletIcon from 'components/Icons/header/DropletIcon'
import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
import DollarBillIcon from 'components/Icons/header/DollarBillIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
import BookSparkles from 'components/Icons/mobile/BookSparkles'
import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
import CastleIcon from 'components/Icons/mobile/CastleIcon'
import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import BinocularsIcon from 'components/Icons/header/BinocularsIcon'
export interface BarItemLeaf {
  key: string
  link: string
  title?: string
  icon?: ReactNode
}

export interface BarItemNode {
  key: string
  items: BarItemLeaf[]
  title: string
  icon: ReactNode
}

export type BarItem = BarItemLeaf | BarItemNode
export type Bar = BarItem[]

type UseBar = () => Bar
const useMenu: UseBar = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  // const { asPath } = useRouter()

  // const bondPage = router.pathname.startsWith('/bond') || router.pathname.startsWith('/bonds')
  // const lendPage = router.pathname.startsWith('/lend') || router.pathname.startsWith('/borrow')
  // const luxorPage = router.pathname.startsWith('/luxor') || router.pathname.startsWith('/luxor/bonds') || router.pathname.startsWith('/luxor/dashboard')
  // const bridgePage = router.pathname.startsWith('/bridge')

  // const isExchangeAnalytics
  //     = asPath.startsWith('/exchange/analytics')
  //     || asPath.startsWith('/exchange/analytics/coffinbox')
  //     || asPath.startsWith('/exchange/analytics/dashboard')
  //     || asPath.startsWith('/exchange/analytics/pairs')
  //     || asPath.startsWith('/exchange/analytics/tokens')

  // const isBridge = router.pathname.startsWith('/bridge')

  // const isLimit = router.pathname.startsWith('/limit')
  //   || router.pathname.startsWith('/exchange/limit')

  // const isAggregator = asPath.startsWith('/aggregator')
  //   || asPath.startsWith('/exchange/aggregator')

  // const useSettings = isExchange || isLimit || isPool

  // const removePage = asPath.startsWith('/remove') || asPath.startsWith('/exchange/remove')
  // const addPage = asPath.startsWith('/add') || asPath.startsWith('/exchange/add')
  // const poolPage = asPath.startsWith('/pool') || asPath.startsWith('/pools')
  // const swapPage = asPath.startsWith('/swap') || asPath.startsWith('/exchange/swap')
  // const crossPage = asPath.startsWith('/cross') || asPath.startsWith('/exchange/cross')
  // const bondPage = asPath.startsWith('/bonds')
  // const landingPage = asPath.startsWith('/landing')
  // const lendPage = asPath.startsWith('/lend') || asPath.startsWith('/borrow')
  
  // const isFarm = asPath.startsWith('/farm') || asPath.startsWith('/summoner')
  // const isVault = asPath.startsWith('/autostake')
  // const isLuxor = asPath.startsWith('/luxor') || asPath.startsWith('/luxor/dashbord') || asPath.startsWith('/luxor/bonds') || asPath.startsWith('/luxor/stake')
  
  // const isLiquidity = removePage || addPage || poolPage
  // const isHome = landingPage
  // const isLend = lendPage
  // const isExplore = asPath.startsWith('/explore')
  // const isWallet = asPath.startsWith('/balances') || asPath.startsWith('/portfolio')
  // const isEarn = isFarm || bondPage || isVault
  // const isExchange = swapPage || crossPage

  // const BLACK = `#000000`
  // const GREY = `#C0C0C0`
  const WHITE = `#FFFFFF`

  const R = `#FF0000`
  const O = `#FFA500`
  const Y = `#FFFF00`
  const G = `#008000`
  const B = `#0000FF`
  const I = `#811FFF`
  const V = `#EE82EE`
  const CHAKRAS = [R, O, Y, G, B, I, V]

  // const isLuxor = router.asPath.startsWith('/luxor')

  return useMemo(() => {
    if (!chainId) return []

    // default show just a home[0] and swap[1]
    let home: BarItem = {
      key: 'home',
      link: '/landing',
      title: i18n._(t`Home`),
      icon: <HomeIcon 
      className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
      // , isHome ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
      )}
      fillPrimary={CHAKRAS[0]}
      fillSecondary={WHITE}
      />,   
    }

    // let tradeMenu: BarItem = {
    //   key: 'swap',
    //   link: '/swap',
    //   title: i18n._(t`Swap`),
    //   icon: <SwapIcon 
    //   className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`, isExchange ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}] p-0.5` : ``)}
    //     fillPrimary={isExchange ? CHAKRAS[0] : WHITE}
    //     fillSecondary={isExchange ? WHITE : CHAKRAS[0]}
    //     />,
    // }

    const mainItems: Bar = [home]

    // Pools
    mainItems.push({
      key: 'pools',
      link: '/pool',
      title: i18n._(t`Pool`),
      icon: <DropletIcon 
        className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
        // , isLiquidity ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={WHITE}
        fillSecondary={CHAKRAS[1]}
        />,
    })

    if (featureEnabled(Feature.LUXOR, chainId)) {
      // Bond
      mainItems.push({
        key: 'luxor',
        link: '/luxor/dashboard',
        title: i18n._(t`Luxor`),
        icon: <SunMoonIcon 
        className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
        // , isLuxor ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={WHITE}
        fillSecondary={CHAKRAS[2]}
        />,
      })
    }

    if (featureEnabled(Feature.BONDS, chainId)) {
      // Bond
      mainItems.push({
        key: 'bond',
        link: '/bonds',
        title: i18n._(t`Bond`),
        icon: <SeedlingIcon
        className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
        // , isEarn ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={CHAKRAS[3]}
        fillSecondary={WHITE}
        />,
      })
    }

    // Balances
    mainItems.push({
      key: 'balances',
      link: '/balances',
      title: i18n._(t`Account`),
      icon: <WalletIcon 
      className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
      // , isWallet ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
      )}
      fillPrimary={CHAKRAS[4]}
      fillSecondary={WHITE}
      />,    
    })

    // Explore
    mainItems.push({
      key: 'explore',
      link: '/explore',
      title: i18n._(t`Explore`),
      icon: <BinocularsIcon 
      className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
      // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
      )}
      fillPrimary={CHAKRAS[5]}
      fillSecondary={WHITE}
      />,   
    })

    // Lend
    mainItems.push({
      key: 'lend',
      link: '/lend',
      title: i18n._(t`Lend`),
      icon: <LendSkullIcon 
      className={classNames(`w-7 h-7 rounded rounded-xl p-0.5`
      // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
      )}
      fillPrimary={CHAKRAS[6]}
      fillSecondary={WHITE}
      />,   
    })

    // Pay
    // mainItems.push({
    //   key: 'pay',
    //   link: 'https://pay.soulswap.finance',
    //   title: i18n._(t`SoulPay`),
    //   icon: <DollarBillIcon 
    //   className={classNames(`w-8 h-8 rounded rounded-xl p-0.5`)}
    //   fillPrimary={CHAKRAS[5]}
    //   fillSecondary={WHITE}
    //   />,
    // })

    // Documentation
    // mainItems.push({
    //   key: 'docs',
    //   link: 'https://docs.soulswap.finance',
    //   title: i18n._(t`Tutorials`),
    //   icon: <DocumentIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })

    // Twitter
    // mainItems.push({
    //   key: 'twitter',
    //   link: 'https://twitter.com/SoulSwapFinance',
    //   title: i18n._(t`Twitter`),
    //   icon: <TwitterIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    // })

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