import React, { ReactNode, useMemo } from 'react'
import { ArrowsUpDownIcon, 
  // LinkIcon, SparklesIcon, PresentationChartLineIcon, SunIcon, CurrencyDollarIcon, UserGroupIcon, 
  } from '@heroicons/react/24/outline'
import { Currency, NATIVE, SOUL_ADDRESS } from 'sdk'
import { PoolIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { getChainColor } from 'constants/chains'
// import { Bars3Icon } from '@heroicons/react/24/outline'

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

const getQuery = (input?: Currency, output?: Currency) => {
  const { chainId } = useActiveWeb3React()
  if (!input && !output) return
  if (input && !output) {
    return { inputCurrency: input || NATIVE[chainId].symbol }
  } else if (input && output) {
    return { inputCurrency: input, outputCurrency: output }
  }
}

type UseDropdown = () => Bar
const useMenu: UseDropdown = () => {
  const { chainId } = useActiveWeb3React()
  // const router = useRouter()
  const { asPath } = useRouter()
  const isRemove = asPath.startsWith('/remove')
  // const isCrossChain = asPath.startsWith('/swap')
  const isSwap = asPath.startsWith('/exchange') || asPath.startsWith('/swap') 
  || asPath.startsWith('/limit') || asPath.startsWith('/add') || asPath.startsWith('/remove')
  // const query = getQuery(inputCurrency, outputCurrency)

return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: BarItem = {
      key: 'swap',
      title: `Swap`,
      link: '/swap',
      icon: <ArrowsUpDownIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    }
   
   let poolMenu: BarItem = {
      key: 'pool',
      title: `Liquidity`,
      link: '/pool',
      icon: <PoolIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
   }

 // If AMM is enabled, replace swap button with a submenu under trade
if (featureEnabled(Feature.AMM, chainId)) {
  tradeMenu = {
    key: 'swap',
    title: `Swap`,
    icon: <ArrowsUpDownIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    link: `/exchange/swap/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
    // items: [
      // {
      //   key: 'exchange',
      //   title: `Swap`,
      //   link: `/swap/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
      // },
      // {
      //   key: 'aggregator',
      //   title: `Aggregate`,
      //   link: '/aggregator',
      // },
      // {
      //   key: 'limit',
      //   title: `Limit`,
      //   link: `/limit/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
      // }
    // ],
  }
}

if (featureEnabled(Feature.LIQUIDITY, chainId)) {
  poolMenu = {
    key: 'liquidity',
    title: `Liquidity`,
    icon: <PoolIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`)} />,
    link: `/add/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
    // items: [
    //   {
    //     key: 'pool',
    //     title: `Pool`,
    //     link: `/add/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`,
    //   },
    //   {
    //     key: 'import',
    //     title: `Import`,
    //     link: '/find',
    //   },
    // ],
  }
}

// let socialMenu = {
//   key: 'socials',
//   title: `Socials`,
//   icon: <UserGroupIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`} />,
//   items: [
//     {
//       key: 'discord',
//       title: 'Discord',
//       link: 'https://discord.gg/soulswap',
//     },
//     {
//       key: 'telegram',
//       title: 'Telegram',
//       link: 'https://t.me/SoulSwapDeFi',
//     },
//     {
//       key: 'twitter',
//       title: 'Twitter',
//       link: `https://twitter.com/${ isLuxor ? 'LuxorMoney' : 'SoulSwapFinance' }`,
//     },
//     {
//       key: 'forum',
//       title: 'Forum',
//       link: 'https://forum.soulswap.finance',
//     },
//     {
//       key: 'medium',
//       title: 'Medium',
//       link: 'https://soulswapfinance.medium.com',
//     },
//     {
//       key: 'email',
//       title: 'Email',
//       link: 'mailto:soulswapfinance@gmail.com',
//     },
//   ],
// }

let dataMenu = {
  key: 'data',
  title: `Data`,
  icon: <WalletIcon width={20} className={classNames(`text-[${getChainColor(chainId)}])`)} />,
  items: [
    // {
    //   key: 'account',
    //   title: 'Account',
    //   link: '/info/dashboard',
    // },
    {
      key: 'balances',
      title: 'Balances',
      link: '/balances',
    },
    {
      key: 'positions',
      title: 'Positions',
      link: '/pools',
    },
  ]
}

  const mainItems: Bar = [tradeMenu, poolMenu, dataMenu]

    // Balances
    // mainItems.push({
    //   key: 'balances',
    //   title: `Account`,
    //   link: '/balances',
      
    // })

    // let exploreMenu: BarItem = {
    //   key: 'explore',
    //   title: `Explore`,
    //   link: '/explore',
    //   icon: <GlobeIcon width={20} className={classNames(isLuxor ? "text-yellow" : `text-[${getChainColor(chainId)}]`} />,
    // }
    //   mainItems.push(exploreMenu)

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId])
}

export default useMenu