import { ChainId, Currency, WNATIVE } from 'sdk'
import useHttpLocations from 'hooks/useHttpLocations'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'
import React, { FunctionComponent, useMemo } from 'react'

import Logo from '../Logo'
// import Logo, { UNKNOWN_ICON } from '../Logo'

const BLOCKCHAIN = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'binance',
  [ChainId.FANTOM]: 'fantom'
}

// @ts-ignore TYPE NEEDS FIXING
export const getCurrencyLogoUrls = (currency): string[] => {
  const urls: string[] = []

  if (currency.chainId in BLOCKCHAIN) {
    urls.push(
      // @ts-ignore TYPE NEEDS FIXING
      `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${
      // `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${
        currency.address
    }/logo.png`
    )
    urls.push(
      // @ts-ignore TYPE NEEDS FIXING
      `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${
        currency.address
      }/logo.png`
    )
    urls.push(
      // @ts-ignore TYPE NEEDS FIXING
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${
        currency.address
      }/logo.png`
    )
  }
  return urls
}

// const AvalancheLogo = 'https://raw.githubusercontent.com/sushiswap/logos/main/token/avax.jpg'
const EthereumLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/eth.jpg'
const FantomLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/ftm.jpg'
const BinanceLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/ftm.jpg'

const LOGO: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo,
  [ChainId.BSC]: BinanceLogo,
}

export const UNKNOWN_ICON = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/unknown.png'

export interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
}

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({ currency, size = '24px', className, style }) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative || currency?.equals(WNATIVE[currency.chainId])) {
      return [LOGO[currency.chainId], UNKNOWN_ICON]
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

  return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} className={className} style={style} />
}

export default CurrencyLogo