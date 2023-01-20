import React, { ReactNode, useMemo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { getChainColor, getChainColorCode } from 'constants/chains'
import DropletIcon from 'components/Icons/header/DropletIcon'
import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
import WalletIcon from 'components/Icons/header/WalletIcon'
import LendSkullIcon from 'components/Icons/mobile/LendSkullIcon'
import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import BinocularsIcon from 'components/Icons/header/BinocularsIcon'
import DocsIcon from 'components/Icons/mobile/DocsIcon'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import NftIcon from 'components/Icons/mobile/NftIcon'

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

  const WHITE = `#FFFFFF`
  const chainColor = getChainColor(chainId)

  // const isLuxor = router.asPath.startsWith('/luxor')

  return useMemo(() => {
    if (!chainId) return []

    // default show just a home[0] and swap[1]
    // let home: BarItem = {
    //   key: 'home',
    //   link: '/landing',
    //   title: i18n._(t`Home`),
    //   icon: <HomeIcon 
    //   className={classNames(`w-7 h-7 rounded rounded-md`
    //   // , isHome ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
    //   )}
    //   fillPrimary={chainColor}
    //   fillSecondary={WHITE}
    //   />,   
    // }

    // let tradeMenu: BarItem = {
    //   key: 'swap',
    //   link: '/swap',
    //   title: i18n._(t`Swap`),
    //   icon: <SwapIcon
    //     className={classNames(`w-7 h-7 rounded rounded-md`)}
    //     // className={classNames(`w-7 h-7 rounded rounded-md`, isExchange ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}] p-0.5` : ``)}
    //     fillPrimary={WHITE}
    //     fillSecondary={chainColor}
    //   />,
    // }

    const mainItems: Bar = []

    // Pools
    mainItems.push({
      key: 'pools',
      link: '/pool',
      title: i18n._(t`Pool`),
      icon: <DropletIcon
        className={classNames(`w-7 h-7 rounded rounded-md`
          // , isLiquidity ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={WHITE}
        fillSecondary={chainColor}
      />,
    })

    if (featureEnabled(Feature.LUXOR, chainId)) {
      // Bond
      mainItems.push({
        key: 'luxor',
        link: '/luxor/dashboard',
        title: i18n._(t`Luxor`),
        icon: <SunMoonIcon
          className={classNames(`w-7 h-7 rounded rounded-md`
            // , isLuxor ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
          )}
          fillPrimary={WHITE}
          fillSecondary={chainColor}
        />,
      })
    }

    // if (featureEnabled(Feature.BONDS, chainId)) {
    //   // Bond
    //   mainItems.push({
    //     key: 'bond',
    //     link: '/bonds',
    //     title: i18n._(t`Bond`),
    //     icon: <SeedlingIcon
    //       className={classNames(`w-7 h-7 rounded rounded-md`
    //         // , isEarn ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
    //       )}
    //       fillPrimary={chainColor}
    //       fillSecondary={WHITE}
    //     />,
    //   })
    // }

    // // Lend
    // mainItems.push({
    //   key: 'lend',
    //   link: '/lend',
    //   title: i18n._(t`Lend`),
    //   icon: <LendSkullIcon
    //     className={classNames(`w-7 h-7 rounded rounded-md`
    //       // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
    //     )}
    //     fillPrimary={chainColor}
    //     fillSecondary={WHITE}
    //   />,
    // })

    // Whitepaper
    mainItems.push({
      key: 'learn',
      link: '/learn',
      title: i18n._(t`Learn`),
      icon: <DocsIcon
        className={classNames(`w-7 h-7 rounded rounded-md`
          // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={chainColor}
        fillSecondary={WHITE}
      />,
    })

    // Infinity Marketplace
    if (featureEnabled(Feature.NFT, chainId)) {
    mainItems.push({
      key: 'infinity',
      link: '/marketplace',
      title: i18n._(t`NFT`),
      icon: <NftIcon
        className={classNames(`w-7 h-7 rounded rounded-md`
          // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={WHITE}
        fillSecondary={chainColor}
      />,
    })}

    // Explore
    mainItems.push({
      key: 'explore',
      link: '/explore',
      title: i18n._(t`Explore`),
      icon: <BinocularsIcon
        className={classNames(`w-7 h-7 rounded rounded-md`
          // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={chainColor}
        fillSecondary={WHITE}
      />,
    })
    
    // // Balances
    // mainItems.push({
    //   key: 'balances',
    //   link: '/balances',
    //   title: i18n._(t`Account`),
    //   icon: <WalletIcon
    //     className={classNames(`w-7 h-7 rounded rounded-md`
    //       // , isWallet ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
    //     )}
    //     fillPrimary={chainColor}
    //     fillSecondary={WHITE}
    //   />,
    // })

    // Pay
    // mainItems.push({
    //   key: 'pay',
    //   link: 'https://pay.soulswap.finance',
    //   title: i18n._(t`SoulPay`),
    //   icon: <DollarBillIcon 
    //   className={classNames(`w-8 h-8 rounded rounded-md`)}
    //   fillPrimary={chainColor}
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