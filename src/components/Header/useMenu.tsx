import React, { ReactNode, useMemo } from 'react'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { getChainColor } from 'constants/chains'
import DropletIcon from 'components/Icons/header/DropletIcon'

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
  const { chainId } = useActiveWeb3React()
  // const { asPath } = useRouter()

  const chainColor = getChainColor(chainId)

  const WHITE = '#FFFFFF'

  return useMemo(() => {
    if (!chainId) return []

  const iconStyle = `p-2 rounded bg-dark-900`


  const POOL_ICON = 
  <div className={iconStyle}>
    <DropletIcon
    fillPrimary={open ? WHITE : chainColor }
    fillSecondary={open ? chainColor : WHITE}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? 
      `cursor-pointer rounded-xl w-8 h-6` : `hidden`)}
  />
  </div>


    const mainItems: Menu = [] // tradeMenu

    if (featureEnabled(Feature.AMM, chainId)) {
      const farmItems = {
        key: 'pool',
        title: `Pool`,
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
    
    // if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
    //   const farmItems = {
    //     key: 'farm',
    //     title: `Farm`,
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
    //     title: `Bond`,
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
    //     title: `Farm`,
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
    //       title: `Stake`,
    //       icon: <BuildingLibraryIcon width={20} className={classNames(
    //         `filter text-white`
    //         )} />,
    //       link: '/autostake'
    //   })
    // }

    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //       key: 'explore',
    //       title: `Paths`,
    //       icon: <MagnifyingGlassCircleIcon width={20} className={classNames(
    //         `filter text-white`
    //       )} />,
    //       link: '/explore'
    //   })
    // }
    // if (featureEnabled(Feature.AMM, chainId)) {
    //   mainItems.push({
    //       key: 'vault',
    //       title: `Vault`,
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
          title: `Learn`,
          // icon: DOCS_ICON,
          // icon: <DocumentIcon width={20} className={classNames(
          //   `filter text-white`
          //   )} />,
          link: '/learn'
      })
    }

    // if (featureEnabled(Feature.ANALYTICS, chainId)) {
    //   mainItems.push({
    //       key: 'data',
    //       title: `Analytics`,
    //       // icon: CHART_ICON,
    //       // icon: <PresentationChartLineIcon width={20} className={classNames(
    //       //   `filter text-white`
    //       //   )} />,
    //       link: '/analytics'
    //   })
    // }


    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId ?? ChainId.FANTOM])
}

export default useMenu