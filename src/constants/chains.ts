import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
export enum SupportedChainId {
  ETHEREUM = 1,
  TELOS = 40,
  BSC = 56,
  FANTOM = 250,
  AVALANCHE = 43114,
  MOONRIVER = 1285,
  MATIC = 137
  // FANTOM_TESTNET = 4002,
}

export function getChainColor(chainId: number) {
  let color = '#1969FF'
  chainId== 250 ? color = `#1969FF`
    : chainId == 43114 ? color = `#E84142`
      : chainId == 1 ? color = `#627EEA`
        : chainId == 56 ? color = `#F0B90B`
        : chainId == 137 ? color = `#8247E5`
          : chainId == 1285 ? color = `#53CBC9`
            : `#1969FF`

  return color
}

export function getChainColorCode(chainId: number) {
  let colorCode = 'ftmBlue'
  chainId == 250 ? colorCode = `ftmBlue`
  : chainId == 43114 ? colorCode = `avaxRed`
  : chainId == 1 ? colorCode = `ethBlue`
  : chainId == 56 ? colorCode = `binanceGold`
  : chainId == 137 ? colorCode = `maticPurple`
  : chainId == 1285 ? colorCode = `moonriverTeal`
  : `ftmBlue`
  
  return colorCode
}

export function getChainLogoURL(chainId: number) {
  let logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/'
  chainId== 250 ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/'
    : chainId == 43114 ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/avalanche/assets/'
      : chainId == 1 ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/ethereum/assets/'
        : chainId == 56 ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/'
        : chainId == 137 ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/'
          : chainId == 1285 ? logoURL = 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/'
            : 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/'

  return logoURL
}

export function getChainInfo(chainId: number, option: string) {
let output: string

  chainId == ChainId.FANTOM ? (
    option == 'NETWORK' ? output = 'Fantom Opera'
      : option == 'NAME' ? output = 'Fantom'
        : option == 'SYMBOL' ? output = 'FTM'
          : output =  ''
    ) : chainId == ChainId.AVALANCHE ? (
      option == 'NETWORK' ? output = 'Avalanche'
        : option == 'NAME' ? output = 'Avalanche'
          : option == 'SYMBOL' ? output = 'AVAX'
            : output =  ''
      ) : chainId == ChainId.ETHEREUM ? (
        option == 'NETWORK' ? output = 'Ethereum'
          : option == 'NAME' ? output = 'Avalanche'
            : option == 'SYMBOL' ? output = 'AVAX'
              : output =  ''
        ) : output = ''
  
  return output
}