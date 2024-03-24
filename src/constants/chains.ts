import { ChainId } from 'sdk'
// import { useActiveWeb3React } from 'services/web3'
export enum SupportedChainId {
  ETHEREUM = ChainId.ETHEREUM,
  TELOS = ChainId.TELOS,
  BSC = ChainId.BSC,
  FANTOM = ChainId.FANTOM,
  AVALANCHE = ChainId.AVALANCHE,
  ARBITRUM = ChainId.ARBITRUM,
  BLAST = ChainId.BLAST,
  MOONRIVER = ChainId.MOONRIVER,
  MATIC = ChainId.MATIC
}

export function getChainColor(chainId: number) {
  let color = '#1969FF'
  chainId == ChainId.FANTOM ? color = `#1969FF`
    : chainId == ChainId.AVALANCHE ? color = `#E84142`
      : chainId == ChainId.ETHEREUM ? color = `#627EEA`
        : chainId == ChainId.BSC ? color = `#F0B90B`
          : chainId == ChainId.MATIC ? color = `#8247E5`
            : chainId == ChainId.ARBITRUM ? color = `#4698FA`
              : chainId == ChainId.BLAST ? color = `#FCFC05`
                : chainId == ChainId.MOONRIVER ? color = `#53CBC9`
                  : `#1969FF`

  return color
}

export function getChainColorCode(chainId: number) {
  let colorCode = 'ftmBlue'
  chainId == ChainId.FANTOM ? colorCode = `ftmBlue`
    : chainId == ChainId.AVALANCHE ? colorCode = `avaxRed`
      : chainId == ChainId.ETHEREUM ? colorCode = `ethBlue`
        : chainId == ChainId.BSC ? colorCode = `binanceGold`
          : chainId == ChainId.MATIC ? colorCode = `maticPurple`
            : chainId == ChainId.ARBITRUM ? colorCode = `arbitrumBlue`
              : chainId == ChainId.BLAST ? colorCode = `blastYellow`
                : chainId == ChainId.MOONRIVER ? colorCode = `moonriverTeal`
                  : `ftmBlue`

  return colorCode
}

export function getChainLogoURL(chainId: number) {
  let logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets'
  chainId == ChainId.FANTOM ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets'
    : chainId == ChainId.AVALANCHE ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/avalanche/assets'
      : chainId == ChainId.ETHEREUM ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/ethereum/assets'
        : chainId == ChainId.BSC ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/binance/assets'
          : chainId == ChainId.MATIC ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/polygon/assets'
            : chainId == ChainId.ARBITRUM ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/arbitrum/assets'
              : chainId == ChainId.BLAST ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/blast/assets'
                : chainId == ChainId.MOONRIVER ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/moonriver/assets'
                  : 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets'

  return logoURL
}

export function getChainLogo(chainId: number) {
  let logoURL = '/images/networks/fantom-white.svg'
  chainId == ChainId.FANTOM ? logoURL = '/images/networks/fantom-white.svg'
    : chainId == ChainId.AVALANCHE ? logoURL = '/images/networks/avalanche.svg'
      : chainId == ChainId.ETHEREUM ? logoURL = '/images/networks/ethereum-white.svg'
        : chainId == ChainId.BSC ? logoURL = '/images/networks/binance.svg'
          : chainId == ChainId.MATIC ? logoURL = '/images/networks/polygon.svg'
            : chainId == ChainId.ARBITRUM ? logoURL = '/images/networks/arbitrum.svg'
              : chainId == ChainId.BLAST ? logoURL = '/images/networks/blast.svg'
                : chainId == ChainId.MOONRIVER ? logoURL = '/images/networks/moonriver.svg'
                  : '/images/networks/fantom-white.svg'

  return logoURL
}

export function getChainInfo(chainId: number, option: string) {
  let output = ''
  if (chainId == ChainId.FANTOM) {
    option == 'NETWORK' ? output = 'Fantom Opera'
      : option == 'NAME' ? output = 'Fantom'
        : option == 'SYMBOL' ? output = 'FTM'
          : output = ''
  } else if (chainId == ChainId.AVALANCHE) {
    option == 'NETWORK' ? output = 'Avalanche Network'
      : option == 'NAME' ? output = 'Avalanche'
        : option == 'SYMBOL' ? output = 'AVAX'
          : output = ''
   } else if (chainId == ChainId.ETHEREUM) {
    option == 'NETWORK' ? output = 'Ethereum Network'
      : option == 'NAME' ? output = 'Ethereum'
        : option == 'SYMBOL' ? output = 'ETH'
          : output = ''
    } else if (chainId == ChainId.BLAST) {
    option == 'NETWORK' ? output = 'Blast'
      : option == 'NAME' ? output = 'Blast'
        : option == 'SYMBOL' ? output = 'BLAST'
          : output = ''
    } else if (chainId == ChainId.BSC) {
    option == 'NETWORK' ? output = 'Binance Smart Chain'
      : option == 'NAME' ? output = 'Binance'
        : option == 'SYMBOL' ? output = 'BSC'
          : output = ''
    } else if (chainId == ChainId.MATIC) {
    option == 'NETWORK' ? output = 'Polygon (Matic)'
      : option == 'NAME' ? output = 'Polygon'
        : option == 'SYMBOL' ? output = 'MATIC'
          : output = '' 
    } else if (chainId == ChainId.BASE) {
    option == 'NETWORK' ? output = 'Base'
      : option == 'NAME' ? output = 'Base'
        : option == 'SYMBOL' ? output = 'BASE'
          : output = ''
    } else if (chainId == ChainId.ARBITRUM) {
    option == 'NETWORK' ? output = 'Arbitrum One'
      : option == 'NAME' ? output = 'Arbitrum'
        : option == 'SYMBOL' ? output = 'ARB'
          : output = ''
    } else if (chainId == ChainId.MOONRIVER) {
    option == 'NETWORK' ? output = 'Moonriver'
      : option == 'NAME' ? output = 'Moonriver'
        : option == 'SYMBOL' ? output = 'MOVR'
          : output = ''
    }

  return output
}