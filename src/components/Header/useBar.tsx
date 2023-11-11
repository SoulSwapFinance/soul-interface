import React, { ReactNode, useMemo } from 'react'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { getChainColor } from 'constants/chains'
import DropletIcon from 'components/Icons/header/DropletIcon'
import SunMoonIcon from 'components/Icons/header/SunMoonIcon'
import BinocularsIcon from 'components/Icons/header/BinocularsIcon'
import DocsIcon from 'components/Icons/mobile/DocsIcon'
// import NftIcon from 'components/Icons/mobile/NftIcon'
// import ChartIcon from 'components/Icons/exchange/ChartIcon'

// import WalletIcon from 'components/Icons/header/WalletIcon'
// import HomeIcon from 'components/Icons/mobile/HomeIcon'
import SeedlingIcon from 'components/Icons/mobile/SeedlingIcon'
import EarnIcon from 'components/Icons/mobile/EarnIcon'
import SwapIcon from 'components/Icons/exchange/SwapIcon'
import VaultIcon from 'components/Icons/mobile/VaultIcon'
import CauldronIcon from 'components/Icons/mobile/CauldronIcon'
import { ChainId } from 'sdk'

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
  const { chainId } = useActiveWeb3React()

  const WHITE = `#FFFFFF`
  const chainColor = getChainColor(chainId)

  return useMemo(() => {
    if (!chainId) return []

    let tradeMenu: BarItem = {
      key: 'swap',
      link: '/exchange/swap',
      title: 'Swap',
      icon: <SwapIcon
        className={classNames(`w-7 h-7 rounded-md`)}
        // className={classNames(`w-7 h-7 rounded-md`, isExchange ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}] p-0.5` : ``)}
        fillPrimary={WHITE}
        fillSecondary={chainColor}
      />,
    }

    const mainItems: Bar = [tradeMenu]

    // Pools
    mainItems.push({
      key: 'pools',
      link: '/pool',
      title: 'Pool',
      icon: <DropletIcon
        className={classNames(`w-7 h-7 rounded-md`
          // , isLiquidity ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={WHITE}
        fillSecondary={chainColor}
      />,
    })

    // Farm
    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      mainItems.push({
        key: 'farm',
        link: '/farms',
        title: 'Farm',
        icon: <SeedlingIcon
          className={classNames(`w-7 h-7 rounded-md`
            // , isEarn ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
          )}
          fillPrimary={chainColor}
          fillSecondary={WHITE}
        />,
      })
    }

    // Farm
    if (featureEnabled(Feature.DEFARM, chainId)) {
      mainItems.push({
        key: 'farm',
        link: '/defarms',
        title: 'DeFarm',
        icon: <CauldronIcon
          className={classNames(`w-7 h-7 rounded-md`
            // , isEarn ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
          )}
          fillPrimary={chainColor}
          fillSecondary={WHITE}
        />,
      })
    }

    // Bond
    if (featureEnabled(Feature.BONDS, chainId)) {
      mainItems.push({
        key: 'bond',
        link: '/bonds',
        title: 'Bond',
        icon: <EarnIcon
          className={classNames(`w-7 h-7 rounded-md`
            // , isEarn ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
          )}
          fillPrimary={WHITE}
          fillSecondary={chainColor}
        />,
      })
    }

    // Vault
    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      mainItems.push({
        key: 'vault',
        link: '/autostake',
        title: 'Stake',
        icon: <VaultIcon
          className={classNames(`w-7 h-7 rounded-md`
            // , isEarn ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
          )}
          fillPrimary={WHITE}
          fillSecondary={chainColor}
        />,
      })
    }

    // Whitepaper
    mainItems.push({
      key: 'learn',
      link: 'https://docs.soulswap.finance',
      title: 'Learn',
      icon: <DocsIcon
        className={classNames(`w-7 h-7 rounded-md`
          // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={chainColor}
        fillSecondary={WHITE}
      />,
    })

    // Explore
    mainItems.push({
      key: 'explore',
      link: '/explore',
      title: 'Explore',
      icon: <BinocularsIcon
        className={classNames(`w-7 h-7 rounded-md`
          // , isExplore ? `w-8 h-8 border border-4 border-[${getChainColor(chainId)}]` : ``
        )}
        fillPrimary={chainColor}
        fillSecondary={WHITE}
      />,
    })

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId ?? ChainId.FANTOM])
}

export default useMenu