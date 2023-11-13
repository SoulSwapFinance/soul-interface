import { ChainId, Currency, WNATIVE } from 'sdk'
import useHttpLocations from 'hooks/useHttpLocations'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'
import React, { FunctionComponent, useMemo } from 'react'

import Logo from '../Logo'
import { useActiveWeb3React } from 'services/web3'
// import Logo, { UNKNOWN_ICON } from '../Logo'

const BLOCKCHAIN = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'binance',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.MATIC]: 'polygon',
  [ChainId.MOONRIVER]: 'Moonriver',
}

// @ts-ignore TYPE NEEDS FIXING
export const getCurrencyLogoUrls = (currency): string[] => {
  const urls: string[] = []

  // if (currency.chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${
        currency.wrapped.address
    }/logo.png`
    )
  //  }
  return urls
}

// const AvalancheLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/avax.jpg'
const EthereumLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/eth.jpg'
const FantomLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/ftm.jpg'
const BinanceLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/network/bsc.svg'
const AvalancheLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/avalanche/Avalanche.svg'
const TelosLogo = '/images/natives/telos.png'
const PolygonLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/polygon/Polygon.svg'
const BaseLogo = 'https://exchange.soulswap.finance/images/networks/base.svg'
const ArbitrumLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/arbitrum/Arbitrum.png'
const MoonriverLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/moonriver/Moonriver.svg'

const LOGO: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.TELOS]: TelosLogo,
  [ChainId.BSC]: BinanceLogo,
  [ChainId.AVALANCHE]: AvalancheLogo,
  [ChainId.MATIC]: PolygonLogo,
  [ChainId.ARBITRUM]: ArbitrumLogo,
  [ChainId.MOONRIVER]: MoonriverLogo,
  [ChainId.BASE]: BaseLogo,
}

export const UNKNOWN_ICON = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/prod/token/unknown.png'

export interface CurrencyLogoProps {
  currency?: Currency
  size?: number
  style?: React.CSSProperties
  className?: string
}

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({ currency, size = 24, className }) => {
  const { chainId } = useActiveWeb3React()
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative || currency?.equals(WNATIVE[currency.chainId])) {
      return [LOGO[currency.chainId || chainId], UNKNOWN_ICON]
    }

    if (currency?.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)]
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, UNKNOWN_ICON]
      }
      return defaultUrls
    }

    return [UNKNOWN_ICON]
  }, [currency, uriLocations])

  return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} className={className} />
}

export default CurrencyLogo