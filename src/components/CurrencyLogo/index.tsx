import { ChainId, Currency, WNATIVE } from '@soulswap/sdk'
import React, { FunctionComponent, useMemo } from 'react'

import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import useHttpLocations from '../../hooks/useHttpLocations'

export const getTokenLogoURL = (address: string, chainId: ChainId) => {
  let imageURL
  if (chainId === ChainId.MAINNET) {
    imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  } else if (chainId === ChainId.FANTOM) {
    imageURL = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/${address}/logo.png`
  } else if (chainId === ChainId.FANTOM_TESTNET) {
    imageURL = `https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom-testnet/assets/${address}/logo.png`
  }
}

const BLOCKCHAIN = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.FANTOM]: 'fantom',
  // [ChainId.FANTOM_TESTNET]: 'fantom testnet'
}

function getCurrencySymbol(currency) {
  if (currency.symbol === 'WBTC') {
    return 'btc'
  }
  if (currency.symbol === 'WETH') {
    return 'eth'
  }
  return currency.symbol.toLowerCase()
}

function getCurrencyLogoUrls(currency) {
  const urls = []

  urls.push(`https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/${getCurrencySymbol(currency)}.jpg`)
  if (currency.chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/SoulSwapFinance/assets/prod/blockchains/${
        BLOCKCHAIN[currency.chainId]
      }/assets/${currency.address}/logo.png`
    )
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/prod/blockchains/${BLOCKCHAIN[currency.chainId]}/assets/${
        currency.address
      }/logo.png`
    )
  }

  return urls
}

const EthereumLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/eth.jpg'
const FantomLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/ftm.jpg'
// const AvalancheLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/avax.jpg'
// const BinanceCoinLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/bnb.jpg'
// const HarmonyLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/one.jpg'
// const HecoLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/heco.jpg'
// const MaticLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/polygon.jpg'
// const MoonbeamLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/eth.jpg'
// const OKExLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/okt.jpg'
// const xDaiLogo =
//   'https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/xdai/assets/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d/logo.png'
// const CeloLogo = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/celo.jpg'

const logo: { readonly [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.FANTOM]: FantomLogo,
  [ChainId.FANTOM_TESTNET]: FantomLogo
}

interface CurrencyLogoProps {
  currency?: Currency
  size?: string | number
  style?: React.CSSProperties
  className?: string
  squared?: boolean
}

const unknown = 'https://raw.githubusercontent.com/SoulSwapFinance/icons/master/token/unknown.png'

const CurrencyLogo: FunctionComponent<CurrencyLogoProps> = ({
  currency,
  size = '24px',
  style,
  className = '',
  ...rest
}) => {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI || currency.tokenInfo.logoURI : undefined
  )

  const srcs = useMemo(() => {
    if (!currency) {
      return [unknown]
    }

    if (currency.isNative || currency.equals(WNATIVE[currency.chainId])) {
      return [logo[currency.chainId], unknown]
    }

    if (currency.isToken) {
      const defaultUrls = [...getCurrencyLogoUrls(currency)]
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls, unknown]
      }
      return defaultUrls
    }
  }, [currency, uriLocations])

  return <Logo srcs={srcs} width={size} height={size} alt={currency?.symbol} {...rest} />
}

export default CurrencyLogo
