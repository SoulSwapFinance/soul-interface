import React, { ReactNode, useMemo } from 'react'
import { ChainId, NATIVE, SOUL_ADDRESS } from 'sdk'
// import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type MobileMenu = MenuItem[]

type UseMobileMenu = () => MobileMenu
const useMobileMenu: UseMobileMenu = () => {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: `Exchange`,
      link: '/exchange/swap',
      // icon: <ArrowsUpDownIcon width={16} />,
    }

    // If limit orders is enabled, replace swap button with a submenu under trade
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      tradeMenu = {
        key: 'trade',
        title: `Swap`,
        // icon: <ArrowsUpDownIcon width={16} />,
        items: [
          {
            key: 'swap',
            title: `Exchange`,
            link: '/exchange/swap',
          },
          {
            key: 'pool',
            title: `Pool`,
            link: '/pool',
          },
          {
            key: 'limit',
            title: `Limit`,
            link: '/limit',
          }
        ],
      }
    }

    const poolMenu = [
      {
        key: 'browse',
        title: `Browse`,
        link: '/pool',
      },
      {
        key: 'add-liquidity',
        title: `Add`,
        link: `/add/${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}`,
      },
      {
        key: 'remove-liquidity',
        title: `Remove`,
      link: `/remove/${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${SOUL_ADDRESS[chainId ?? ChainId.FANTOM]}`,
      },
      {
        key: 'import',
        title: `Import`,
        link: '/find',
      },
    ]

    const mainItems: MobileMenu = [tradeMenu]

    // if (poolMenu.length > 0)
    //   mainItems.push({
    //     key: 'pool',
    //     title: `POOL`,
    //     items: poolMenu,
    //   })

    if (featureEnabled(Feature.SEANCE, chainId)) {
      const farmItems = {
        key: 'Rewards',
        title: `Rewards`,
        items: [
          {
            key: 'farm',
            title: `Farm`,
            link: '/summoner',
          },
          {
            key: 'vault',
            title: `Vault`,
            link: '/autostake',
          },
          {
            key: 'bonds',
            title: `Bond`,
            link: '/bonds',
          },
        ],
      }
      mainItems.push(farmItems)
    }

    if ([ChainId.AVALANCHE].includes(chainId)) {
      const farmItems = {
        key: 'Rewards',
        title: `Rewards`,
        items: [
          {
            key: 'farm',
            title: `Farm`,
            link: '/summoner',
          },
          {
            key: 'vault',
            title: `Vault`,
            link: '/autostake',
          },
          {
            key: 'bonds',
            title: `Bond`,
            link: '/bonds',
          },
        ],
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.AMM, chainId))
     {
      mainItems.push({
        key: 'tools',
        title: `Tools`,
        // icon: <SparklesIcon width={20} className={classNames(`text-[${getChainColor(chainId)}]`} />,
        items: [
        {
          key: 'stream',
          title: `SoulPay`,
          link: 'https://pay.soulswap.finance',
        },
      ]
    })
    }

    if ([ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId)) {
      const learnItems = {
        key: 'Learn',
        title: `Learn`,
        items: [
          {
            key: 'explore',
            title: `Explore`,
            link: '/explore',
          },
          {
            key: 'soul-docs',
            title: `Swap`,
            link: 'https://docs.soulswap.finance/docs/user-guides/exchange/swapping-tokens',
          },
        ],
      }
      mainItems.push(learnItems)
      }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId ?? ChainId.FANTOM])
}

export default useMobileMenu