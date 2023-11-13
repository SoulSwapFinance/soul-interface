import { AVAX_ADDRESS, AXL_ADDRESS, AXL_USDC_ADDRESS, AXL_WBTC_ADDRESS, AXL_WETH_ADDRESS, CRV_ADDRESS, ChainId, DAI_ADDRESS, EQUAL_ADDRESS, FTM_ADDRESS, LINK_ADDRESS, MIM_ADDRESS, MPX_ADDRESS, NATIVE_ADDRESS, SPELL_ADDRESS, SUSHI_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WMATIC_ADDRESS, WNATIVE_ADDRESS } from "sdk"

export type TokenData = {
    chainId: number,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    coingeckoId: string
}

export enum SupportedChains {
    ETHEREUM = 1,
    BSC = 56,
    MATIC = 137,
    FANTOM = 250,
    AVALANCHE = 43114,
    // TELOS = 40,
    BASE = ChainId.BASE,
    ARBITRUM = 42161,
    // MOONRIVER = 1285,
  }

export type TokenMap = { [chainId in SupportedChains]: TokenData }

export const ethLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg"
export const wethLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/weth.svg"
export const wbnbLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/bnb.svg"
export const bnbLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/bnb.svg"
export const ftmLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/fantom.svg"
export const wftmLogo = "https://seeklogo.com/images/F/fantom-ftm-logo-3566C53917-seeklogo.com.png"
export const avaxLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/avalanche.svg"
export const usdcLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/assets/usdc.svg"
export const linkLogo = "https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png?1696502009"
export const btcLogo = "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400"
export const axlLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/axl.svg"
export const equalLogo = "https://assets.coingecko.com/coins/images/28231/standard/hq_png_icon_file.png?1696527232"
export const spellLogo = "https://assets.coingecko.com/coins/images/15861/standard/abracadabra-3.png?1696515477"
export const mpxLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/mpx.svg"
export const crvLogo = "https://assets.coingecko.com/coins/images/12124/standard/Curve.png?1696511967"
export const mimLogo = "https://assets.coingecko.com/coins/images/16786/standard/mimlogopng.png?1696516358"
export const usdtLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdt.svg"
export const sushiLogo = "https://assets.coingecko.com/coins/images/12271/standard/512x512_Logo_no_chop.png?1696512101"
export const daiLogo = "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996"
export const maticLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/polygon.svg"
export const wmaticLogo = "https://assets.coingecko.com/coins/images/14073/small/matic.png?1628852392"
// export const oathLogo = "https://s2.coinmarketcap.com/static/img/coins/64x64/18520.png"

export const ethId = 'ethereum'
export const ftmId = 'fantom'
export const avaxId = 'avalanche-2'
export const maticId =  'matic-network'

export const wbtcId = 'wrapped-bitcoin'
export const usdcId = 'usd-coin'
export const bnbId = 'binancecoin'
export const mimId = 'magic-internet-money'
export const axlId = 'axelar'
export const linkId = 'chainlink'
export const usdtId = 'tether'
export const daiId = 'dai'
export const sushiId = 'sushi'
export const spellId = 'spell-token'
export const crvId = 'curve-dao-token'
export const mpxId = 'mpx'
export const equalId = 'equalizer-dex'

// [.√.]
export const NATIVE_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: NATIVE_ADDRESS,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        logoURI: ethLogo,
        coingeckoId: ethId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: NATIVE_ADDRESS,
        name: 'Binance',
        symbol: 'BNB',
        decimals: 18,
        logoURI: bnbLogo,
        coingeckoId: bnbId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: NATIVE_ADDRESS,
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: maticLogo,
        coingeckoId: maticId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: NATIVE_ADDRESS,
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
        logoURI: ftmLogo,
        coingeckoId: ftmId
    },
    [ChainId.BASE]: {
        chainId: 8453,
        address: NATIVE_ADDRESS,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        logoURI: ethLogo,
        coingeckoId: ethId
    },
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: NATIVE_ADDRESS,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        logoURI: ethLogo,
        coingeckoId: ethId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: NATIVE_ADDRESS,
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
        logoURI: avaxLogo,
        coingeckoId: avaxId
    },
}

// [.√.]
export const WNATIVE_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: WNATIVE_ADDRESS[1],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: WNATIVE_ADDRESS[56],
        name: 'Wrapped BNB',
        symbol: 'WBNB',
        decimals: 18,
        logoURI: bnbLogo,
        coingeckoId: bnbId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: WNATIVE_ADDRESS[137],
        name: 'Wrapped MATIC',
        symbol: 'WMATIC',
        decimals: 18,
        logoURI: maticLogo,
        coingeckoId: maticId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: WNATIVE_ADDRESS[250],
        name: 'Wrapped FTM',
        symbol: 'WFTM',
        decimals: 18,
        logoURI: wftmLogo,
        coingeckoId: ftmId
    },
    [ChainId.ARBITRUM]: undefined,
    [ChainId.BASE]: undefined,
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: WNATIVE_ADDRESS[43114],
        name: 'Wrapped AVAX',
        symbol: 'WAVAX',
        decimals: 18,
        logoURI: avaxLogo,
        coingeckoId: avaxId
    },
}

// [.√.]
export const ETH_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: WNATIVE_ADDRESS[1],
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: WETH_ADDRESS[56],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: WETH_ADDRESS[137],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: AXL_WETH_ADDRESS[250],
        name: 'Axelar WETH',
        symbol: 'axlWETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.BASE]: {
        chainId: 8453,
        address: WETH_ADDRESS[8453],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: WETH_ADDRESS[42161],
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: WETH_ADDRESS[43114],
        name: 'Wrapped ETH',
        symbol: 'WETH.e',
        decimals: 18,
        logoURI: wethLogo,
        coingeckoId: ethId
    },
}

// [.√.]
export const FTM_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: FTM_ADDRESS[1],
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
        logoURI: ftmLogo,
        coingeckoId: ftmId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: FTM_ADDRESS[56],
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
        logoURI: ftmLogo,
        coingeckoId: ftmId
    },
    [ChainId.MATIC]: undefined,
    [ChainId.FANTOM]: {
        chainId: 250,
        address: WNATIVE_ADDRESS[250],
        name: 'Wrapped FTM',
        symbol: 'WFTM',
        decimals: 18,
        logoURI: ftmLogo,
        coingeckoId: ftmId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: undefined,
    [ChainId.AVALANCHE]: undefined
}

// [.√.]
export const AVAX_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: undefined,
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: {
        chainId: 137,
        address: AVAX_ADDRESS[137],
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
        logoURI: avaxLogo,
        coingeckoId: avaxId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: AVAX_ADDRESS[250],
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
        logoURI: avaxLogo,
        coingeckoId: avaxId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: undefined,
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: WNATIVE_ADDRESS[43114],
        name: 'Wrapped AVAX',
        symbol: 'WAVAX',
        decimals: 18,
        logoURI: avaxLogo,
        coingeckoId: avaxId
    }
}

// [.√.]
export const MATIC_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: WMATIC_ADDRESS[1],
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: maticLogo,
        coingeckoId: maticId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: WMATIC_ADDRESS[56],
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: maticLogo,
        coingeckoId: maticId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: WNATIVE_ADDRESS[137],
        name: 'Wrapped MATIC',
        symbol: 'WMATIC',
        decimals: 18,
        logoURI: maticLogo,
        coingeckoId: maticId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: WMATIC_ADDRESS[250],
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
        logoURI: maticLogo,
        coingeckoId: maticId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: undefined,
    [ChainId.AVALANCHE]: undefined,
}
// [.√.]
export const USDC_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: USDC_ADDRESS[1],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: USDC_ADDRESS[56],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: USDC_ADDRESS[137],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: AXL_USDC_ADDRESS[250],
        name: 'Axelar USDC',
        symbol: 'axlUSDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
    [ChainId.BASE]: {
        chainId: 8453,
        address: USDC_ADDRESS[8453],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: USDC_ADDRESS[42161],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: USDC_ADDRESS[43114],
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: usdcLogo,
        coingeckoId: usdcId
    },
}

// [.√.]
export const AXL_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: AXL_ADDRESS[1],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: AXL_ADDRESS[56],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: AXL_ADDRESS[137],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: AXL_ADDRESS[250],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
    [ChainId.BASE]: {
        chainId: 8453,
        address: AXL_ADDRESS[8453],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: AXL_ADDRESS[42161],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: AXL_ADDRESS[43114],
        name: 'Axelar',
        symbol: 'AXL',
        decimals: 6,
        logoURI: axlLogo,
        coingeckoId: axlId
    },
}

// [.√.]
export const WBTC_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: WBTC_ADDRESS[1],
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        logoURI: btcLogo,
        coingeckoId: wbtcId,
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: WBTC_ADDRESS[56],
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        logoURI: btcLogo,
        coingeckoId: wbtcId,
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: WBTC_ADDRESS[137],
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        logoURI: btcLogo,
        coingeckoId: wbtcId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: AXL_WBTC_ADDRESS[250],
        name: 'Axelar BTC',
        symbol: 'axlWBTC',
        decimals: 8,
        logoURI: btcLogo,
        coingeckoId: wbtcId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: WBTC_ADDRESS[42161],
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        logoURI: btcLogo,
        coingeckoId: wbtcId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: WBTC_ADDRESS[43114],
        name: 'Wrapped BTC',
        symbol: 'WBTC.e',
        decimals: 8,
        logoURI: btcLogo,
        coingeckoId: wbtcId
    },

}

// [.√.]
export const LINK_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: LINK_ADDRESS[1],
        name: 'Chainlink Token',
        symbol: 'LINK',
        decimals: 18,
        logoURI: linkLogo,
        coingeckoId: linkId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: LINK_ADDRESS[56],
        name: 'Chainlink Token',
        symbol: 'LINK',
        decimals: 18,
        logoURI: linkLogo,
        coingeckoId: linkId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: LINK_ADDRESS[137],
        name: 'Chainlink Token',
        symbol: 'LINK',
        decimals: 18,
        logoURI: linkLogo,
        coingeckoId: linkId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: LINK_ADDRESS[250],
        name: 'Chainlink Token',
        symbol: 'LINK',
        decimals: 18,
        logoURI: linkLogo,
        coingeckoId: linkId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: LINK_ADDRESS[42161],
        name: 'Chainlink Token',
        symbol: 'LINK',
        decimals: 18,
        logoURI: linkLogo,
        coingeckoId: linkId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: LINK_ADDRESS[43114],
        name: 'Chainlink Token',
        symbol: 'LINK.e',
        decimals: 18,
        logoURI: linkLogo,
        coingeckoId: linkId
    }
}

// [.√.]
export const MIM_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: MIM_ADDRESS[1],
        name: 'Magic Internet Money',
        symbol: 'MIM',
        decimals: 18,
        logoURI: mimLogo,
        coingeckoId: mimId
    },
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: {
        chainId: 137,
        address: MIM_ADDRESS[137],
        name: 'Magic Internet Money',
        symbol: 'MIM',
        decimals: 18,
        logoURI: mimLogo,
        coingeckoId: mimId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: MIM_ADDRESS[250],
        name: 'Magic Internet Money',
        symbol: 'MIM',
        decimals: 18,
        logoURI: mimLogo,
        coingeckoId: mimId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: MIM_ADDRESS[42161],
        name: 'Magic Internet Money',
        symbol: 'MIM',
        decimals: 18,
        logoURI: mimLogo,
        coingeckoId: mimId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: MIM_ADDRESS[43114],
        name: 'Magic Internet Money',
        symbol: 'MIM',
        decimals: 18,
        logoURI: mimLogo,
        coingeckoId: mimId
    },
}

// [.√.]
export const USDT_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: USDT_ADDRESS[1],
        name: 'USD Tether',
        symbol: 'USDT',
        decimals: 6,
        logoURI: usdtLogo,
        coingeckoId: usdtId
    },
    [ChainId.BSC]: {
        chainId: 56,
        address: USDT_ADDRESS[56],
        name: 'USD Tether',
        symbol: 'USDT',
        decimals: 6,
        logoURI: usdtLogo,
        coingeckoId: usdtId
    },
    [ChainId.MATIC]: {
        chainId: 137,
        address: USDT_ADDRESS[137],
        name: 'USD Tether',
        symbol: 'USDT',
        decimals: 6,
        logoURI: usdtLogo,
        coingeckoId: usdtId
    },
    [ChainId.FANTOM]: undefined,
    [ChainId.BASE]: {
        chainId: 8453,
        address: USDT_ADDRESS[8453],
        name: 'USD Tether',
        symbol: 'USDT',
        decimals: 6,
        logoURI: usdtLogo,
        coingeckoId: usdtId,
    },
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: USDT_ADDRESS[42161],
        name: 'USD Tether',
        symbol: 'USDT',
        decimals: 6,
        logoURI: usdtLogo,
        coingeckoId: usdtId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: USDT_ADDRESS[43114],
        name: 'USD Tether',
        symbol: 'USDt',
        decimals: 6,
        logoURI: usdtLogo,
        coingeckoId: usdtId
    },
}

// [.√.]
export const DAI_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: DAI_ADDRESS[1],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        logoURI: daiLogo,
        coingeckoId: daiId
    },
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: {
        chainId: 137,
        address: DAI_ADDRESS[137],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        logoURI: daiLogo,
        coingeckoId: daiId
    },
    [ChainId.FANTOM]: undefined,
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: DAI_ADDRESS[42161],
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        logoURI: daiLogo,
        coingeckoId: daiId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: DAI_ADDRESS[43114],
        name: 'Dai Stablecoin',
        symbol: 'DAI.e',
        decimals: 18,
        logoURI: daiLogo,
        coingeckoId: daiId
    },
}

// [.√.]
export const SUSHI_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: SUSHI_ADDRESS[1],
        name: "SushiToken",
        symbol: "SUSHI",
        decimals: 18,
        logoURI: sushiLogo,
        coingeckoId: sushiId
    },
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: {
        chainId: 137,
        address: SUSHI_ADDRESS[137],
        name: "SushiToken",
        symbol: "SUSHI",
        decimals: 18,
        logoURI: sushiLogo,
        coingeckoId: sushiId
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: SUSHI_ADDRESS[250],
        name: "SushiToken",
        symbol: "SUSHI",
        decimals: 18,
        logoURI: sushiLogo,
        coingeckoId: sushiId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: SUSHI_ADDRESS[42161],
        name: "SushiToken",
        symbol: "SUSHI",
        decimals: 18,
        logoURI: sushiLogo,
        coingeckoId: sushiId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: SUSHI_ADDRESS[43114],
        name: "SushiToken",
        symbol: "SUSHI",
        decimals: 18,
        logoURI: sushiLogo,
        coingeckoId: sushiId
    },
}

// [.√.]
export const SPELL_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: SPELL_ADDRESS[1],
        name: "Spell Token",
        symbol: "SPELL",
        decimals: 18,
        logoURI: spellLogo,
        coingeckoId: spellId
    },
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: undefined,
    [ChainId.FANTOM]: {
        chainId: 250,
        address: SPELL_ADDRESS[250],
        name: "Spell Token",
        symbol: "SPELL",
        decimals: 18,
        logoURI: spellLogo,
        coingeckoId: spellId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: SPELL_ADDRESS[42161],
        name: "Spell Token",
        symbol: "SPELL",
        decimals: 18,
        logoURI: spellLogo,
        coingeckoId: spellId
    },
    [ChainId.AVALANCHE]: {
        chainId: 43114,
        address: SPELL_ADDRESS[43114],
        name: "Spell Token",
        symbol: "SPELL",
        decimals: 18,
        logoURI: spellLogo,
        coingeckoId: spellId
    }
}

// [.√.]
export const CRV_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: {
        chainId: 1,
        address: CRV_ADDRESS[1],
        name: "Curve DAO Token",
        symbol: "CRV",
        decimals: 18,
        logoURI: crvLogo,
        coingeckoId: crvId
    },
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: {
        chainId: 137,
        address: CRV_ADDRESS[137],
        name: "Curve DAO Token",
        symbol: "CRV",
        decimals: 18,
        logoURI: crvLogo,
        coingeckoId: crvId,
    },
    [ChainId.FANTOM]: {
        chainId: 250,
        address: CRV_ADDRESS[250],
        name: "Curve DAO Token",
        symbol: "CRV",
        decimals: 18,
        logoURI: crvLogo,
        coingeckoId: crvId
    },
    [ChainId.BASE]: undefined,
    [ChainId.ARBITRUM]: {
        chainId: 42161,
        address: CRV_ADDRESS[42161],
        name: "Curve DAO Token",
        symbol: "CRV",
        decimals: 18,
        logoURI: crvLogo,
        coingeckoId: crvId
    },
    [ChainId.AVALANCHE]: undefined,
}
// // [...]
export const MPX_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: undefined,
    [ChainId.BSC]: {
        chainId: 56,
        address: MPX_ADDRESS[56],
        name: 'Morphex',
        symbol: 'MPX',
        decimals: 18,
        logoURI: mpxLogo,
        coingeckoId: mpxId
    },
    [ChainId.MATIC]: undefined,
    [ChainId.FANTOM]: {
        chainId: 250,
        address: MPX_ADDRESS[250],
        name: 'Morphex',
        symbol: 'MPX',
        decimals: 18,
        logoURI: mpxLogo,
        coingeckoId: mpxId
    },
    [ChainId.BASE]: undefined,
    [ChainId.AVALANCHE]: undefined,
    [ChainId.ARBITRUM]: undefined,
}

// // [.√.]
export const EQUAL_TOKEN: TokenMap = {
    [ChainId.ETHEREUM]: undefined,
    [ChainId.BSC]: undefined,
    [ChainId.MATIC]: undefined,
    [ChainId.FANTOM]: {
        chainId: 250,
        address: EQUAL_ADDRESS[250],
        name: 'Equalizer',
        symbol: 'EQUAL',
        decimals: 18,
        logoURI: equalLogo,
        coingeckoId: equalId
    },
    [ChainId.BASE]: undefined,
    [ChainId.AVALANCHE]: undefined,
    [ChainId.ARBITRUM]: undefined,
}

// // [...]
// export const MPX_TOKEN: TokenMap = {
//     [ChainId.ETHEREUM]: undefined,
//     [ChainId.BSC]: undefined,
//     [ChainId.MATIC]: undefined,
//     [ChainId.FANTOM]: undefined,
//     [ChainId.AVALANCHE]: undefined,
//     [ChainId.ARBITRUM]: undefined,
// }
