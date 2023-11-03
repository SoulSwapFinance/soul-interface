import { TokenData } from "@0xsquid/sdk"
import { useCallback, useState } from "react"
import { AXL_ADDRESS, AXL_USDC_ADDRESS, AXL_WBTC_ADDRESS, AXL_WETH_ADDRESS, CRV_ADDRESS, EQUAL_ADDRESS, LINK_ADDRESS, MIM_ADDRESS, MPX_ADDRESS, NATIVE_ADDRESS, SPELL_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS, WNATIVE_ADDRESS } from "sdk"

const ethLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/eth.svg"
const avaxLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/avalanche.svg"
const ftmLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/chains/fantom.svg"
const usdcLogo = "https://raw.githubusercontent.com/axelarnetwork/axelar-docs/main/public/images/assets/usdc.svg"
const linkLogo = "https://assets.coingecko.com/coins/images/877/standard/chainlink-new-logo.png?1696502009"
const btcLogo = "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x152b9d0FdC40C096757F570A51E494bd4b943E50/logo.png"
const axlLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/axl.svg"
const equalLogo = "https://assets.coingecko.com/coins/images/28231/standard/hq_png_icon_file.png?1696527232"
const spellLogo = "https://assets.coingecko.com/coins/images/15861/standard/abracadabra-3.png?1696515477"
const mpxLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/mpx.svg"
const crvLogo = "https://assets.coingecko.com/coins/images/12124/standard/Curve.png?1696511967"
const mimLogo = "https://assets.coingecko.com/coins/images/16786/standard/mimlogopng.png?1696516358"
const usdtLogo = "https://raw.githubusercontent.com/0xsquid/assets/main/images/tokens/usdt.svg"


export const from_avax_to_ftm: TokenData[] = [
    {
        "chainId": 43114,
        "address": NATIVE_ADDRESS,
        "name": 'Avalanche',
        "symbol": 'AVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": WNATIVE_ADDRESS[43114],
        "name": 'Wrapped Avalanche',
        "symbol": 'WAVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": WETH_ADDRESS[43114],
        "name": 'Wrapped Ether',
        "symbol": 'WETH.e',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 43114,
        "address": USDC_ADDRESS[43114],
        "name": 'USD Coin',
        "symbol": 'USDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 43114,
        "address": LINK_ADDRESS[43114],
        "name": 'Chainlink Token',
        "symbol": 'LINK.e',
        "decimals": 18,
        "logoURI": linkLogo,
        "coingeckoId": 'chainlink',
    },
    {
        "chainId": 43114,
        "address": '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // USDC.e
        "name": 'USD Coin',
        "symbol": 'USDC.e',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 43114,
        "address": MIM_ADDRESS[43114],
        "name": 'Magic Internet Money',
        "symbol": 'MIM',
        "decimals": 18,
        "logoURI": mimLogo,
        "coingeckoId": 'magic-internet-money',
    },
    {
        "chainId": 43114,
        "address": AXL_USDC_ADDRESS[43114],
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
]

export const from_avax_to_eth: TokenData[] = [
    {
        "chainId": 43114,
        "address": NATIVE_ADDRESS,
        "name": 'Avalanche',
        "symbol": 'AVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": WNATIVE_ADDRESS[43114],
        "name": 'Wrapped Avalanche',
        "symbol": 'WAVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": WETH_ADDRESS[43114],
        "name": 'Wrapped Ether',
        "symbol": 'WETH.e',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 43114,
        "address": USDC_ADDRESS[43114],
        "name": 'USD Coin',
        "symbol": 'USDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 43114,
        "address": LINK_ADDRESS[43114],
        "name": 'Chainlink Token',
        "symbol": 'LINK.e',
        "decimals": 18,
        "logoURI": linkLogo,
        "coingeckoId": 'chainlink',
    },
    {
        "chainId": 43114,
        "address": '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // USDC.e
        "name": 'USD Coin',
        "symbol": 'USDC.e',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 43114,
        "address": MIM_ADDRESS[43114],
        "name": 'Magic Internet Money',
        "symbol": 'MIM',
        "decimals": 18,
        "logoURI": mimLogo,
        "coingeckoId": 'magic-internet-money',
    },
    {
        "chainId": 43114,
        "address": AXL_USDC_ADDRESS[43114],
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 43114,
        "address": AXL_ADDRESS[43114],
        "name": 'Axelar',
        "symbol": 'AXL',
        "decimals": 6,
        "logoURI": axlLogo,
        "coingeckoId": 'axelar',
    },
    {
        "chainId": 43114,
        "address": '0x152b9d0fdc40c096757f570a51e494bd4b943e50', // BTC.b
        "name": 'Bitcoin',
        "symbol": 'BTC.b',
        "decimals": 8,
        "logoURI": btcLogo,
        "coingeckoId": 'bitcoin-avalanche-bridged-btc-b',
    },

]

export const from_eth_to_avax: TokenData[] = [
    {
        "chainId": 1,
        "address": NATIVE_ADDRESS,
        "name": 'Ethereum',
        "symbol": 'Ethereum',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 1,
        "address": USDC_ADDRESS[1],
        "name": 'USD Coin',
        "symbol": 'USDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 1,
        "address": WNATIVE_ADDRESS[1],
        "name": 'Wrapped Ether',
        "symbol": 'WETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    }
]

export const from_eth_to_ftm: TokenData[] = [
    {
        "chainId": 1,
        "address": NATIVE_ADDRESS,
        "name": 'Ethereum',
        "symbol": 'Ethereum',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 1,
        "address": USDC_ADDRESS[1],
        "name": 'USD Coin',
        "symbol": 'USDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 1,
        "address": WNATIVE_ADDRESS[1],
        "name": 'Wrapped Ether',
        "symbol": 'WETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    }
]

export const from_ftm_to_avax: TokenData[] = [
    {
        "chainId": 250,
        "address": NATIVE_ADDRESS,
        "name": 'Fantom',
        "symbol": 'FTM',
        "decimals": 18,
        "logoURI": ftmLogo,
        "coingeckoId": 'fantom',
    },
    {
        "chainId": 250,
        "address": AXL_USDC_ADDRESS[250],
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 250,
        "address": MPX_ADDRESS[250],
        "name": 'Morphex',
        "symbol": 'MPX',
        "decimals": 18,
        "logoURI": mpxLogo,
        "coingeckoId": 'mpx',
    },
    {
        "chainId": 250,
        "address": SPELL_ADDRESS[250],
        "name": 'Spell Token',
        "symbol": 'SPELL',
        "decimals": 18,
        "logoURI": spellLogo,
        "coingeckoId": 'spell-token',
    },
    {
        "chainId": 250,
        "address": CRV_ADDRESS[250],
        "name": 'Curve DAO',
        "symbol": 'CRV',
        "decimals": 18,
        "logoURI": crvLogo,
        "coingeckoId": 'curve-dao-token',
    },
    {
        "chainId": 250,
        "address": EQUAL_ADDRESS[250],
        "name": 'Equalizer',
        "symbol": 'EQUAL',
        "decimals": 18,
        "logoURI": equalLogo,
        "coingeckoId": 'equalizer-dex',
    },
    // {
    //     "chainId": 250,
    //     "address": AXL_WBTC_ADDRESS[250],
    //     "name": 'Axelar BTC',
    //     "symbol": 'axlBTC',
    //     "decimals": 8,
    //     "logoURI": btcLogo,
    //     "coingeckoId": 'bitcoin',
    // }
]

export const from_ftm_to_eth: TokenData[] = [
    {
        "chainId": 250,
        "address": NATIVE_ADDRESS,
        "name": 'Fantom',
        "symbol": 'FTM',
        "decimals": 18,
        "logoURI": ftmLogo,
        "coingeckoId": 'fantom',
    }
]

// TO: AVALANCHE //
export const to_avax_from_eth: TokenData[] = [
    {
        "chainId": 43114,
        "address": NATIVE_ADDRESS,
        "name": 'Avalanche',
        "symbol": 'AVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": WNATIVE_ADDRESS[43114],
        "name": 'Wrapped Avalanche',
        "symbol": 'WAVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },    
]

export const to_avax_from_ftm: TokenData[] = [
    {
        "chainId": 43114,
        "address": NATIVE_ADDRESS,
        "name": 'Avalanche',
        "symbol": 'AVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": WNATIVE_ADDRESS[43114],
        "name": 'Wrapped Avalanche',
        "symbol": 'WAVAX',
        "decimals": 18,
        "logoURI": avaxLogo,
        "coingeckoId": 'avalanche-2',
    },
    {
        "chainId": 43114,
        "address": USDC_ADDRESS[43114],
        "name": 'USD Coin',
        "symbol": 'USDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 43114,
        "address": USDT_ADDRESS[43114],
        "name": 'Tether USD',
        "symbol": 'USDT',
        "decimals": 8,
        "logoURI": usdtLogo,
        "coingeckoId": 'tether',
    },
]

// TO: FANTOM //
export const to_ftm_from_eth: TokenData[] = [
    {
        "chainId": 250,
        "address": NATIVE_ADDRESS,
        "name": 'Fantom',
        "symbol": 'FTM',
        "decimals": 18,
        "logoURI": ftmLogo,
        "coingeckoId": 'fantom',
    },
    {
        "chainId": 250,
        "address": WNATIVE_ADDRESS[250],
        "name": 'Wrapped FTM',
        "symbol": 'WFTM',
        "decimals": 18,
        "logoURI": ftmLogo,
        "coingeckoId": 'fantom',
    },
    {
        "chainId": 250,
        "address": AXL_USDC_ADDRESS[250],
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 250,
        "address": MPX_ADDRESS[250],
        "name": 'Morphex',
        "symbol": 'MPX',
        "decimals": 18,
        "logoURI": mpxLogo,
        "coingeckoId": 'mpx',
    },
    {
        "chainId": 250,
        "address": AXL_WETH_ADDRESS[250],
        "name": 'Axelar ETH',
        "symbol": 'axlETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 250,
        "address": EQUAL_ADDRESS[250],
        "name": 'Equalizer',
        "symbol": 'EQUAL',
        "decimals": 18,
        "logoURI": equalLogo,
        "coingeckoId": 'equalizer-dex',
    },
    {
        "chainId": 250,
        "address": CRV_ADDRESS[250],
        "name": 'Curve DAO',
        "symbol": 'CRV',
        "decimals": 18,
        "logoURI": crvLogo,
        "coingeckoId": 'curve-dao-token',
    },
    {
        "chainId": 250,
        "address": SPELL_ADDRESS[250],
        "name": 'Spell Token',
        "symbol": 'SPELL',
        "decimals": 18,
        "logoURI": spellLogo,
        "coingeckoId": 'spell-token',
    },
    {
        "chainId": 250,
        "address": MIM_ADDRESS[250],
        "name": 'Magic Internet Money',
        "symbol": 'MIM',
        "decimals": 18,
        "logoURI": mimLogo,
        "coingeckoId": 'magic-internet-money',
    },
]

export const to_ftm_from_avax: TokenData[] = [
    {
        "chainId": 250,
        "address": NATIVE_ADDRESS,
        "name": 'Fantom',
        "symbol": 'FTM',
        "decimals": 18,
        "logoURI": ftmLogo,
        "coingeckoId": 'fantom',
    },
    {
        "chainId": 250,
        "address": AXL_USDC_ADDRESS[250],
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    {
        "chainId": 250,
        "address": MPX_ADDRESS[250],
        "name": 'Morphex',
        "symbol": 'MPX',
        "decimals": 18,
        "logoURI": mpxLogo,
        "coingeckoId": 'mpx',
    },
    {
        "chainId": 250,
        "address": EQUAL_ADDRESS[250],
        "name": 'Equalizer',
        "symbol": 'EQUAL',
        "decimals": 18,
        "logoURI": equalLogo,
        "coingeckoId": 'equalizer-dex',
    },
    {
        "chainId": 250,
        "address": CRV_ADDRESS[250],
        "name": 'Curve DAO',
        "symbol": 'CRV',
        "decimals": 18,
        "logoURI": crvLogo,
        "coingeckoId": 'curve-dao-token',
    },
    {
        "chainId": 250,
        "address": SPELL_ADDRESS[250],
        "name": 'Spell Token',
        "symbol": 'SPELL',
        "decimals": 18,
        "logoURI": spellLogo,
        "coingeckoId": 'spell-token',
    },
    {
        "chainId": 250,
        "address": MIM_ADDRESS[250],
        "name": 'Magic Internet Money',
        "symbol": 'MIM',
        "decimals": 18,
        "logoURI": mimLogo,
        "coingeckoId": 'magic-internet-money',
    },
]

// TO: ETHEREUM //
export const to_eth_from_avax: TokenData[] = [
    {
        "chainId": 1,
        "address": NATIVE_ADDRESS,
        "name": 'Ethereum',
        "symbol": 'ETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 1,
        "address": USDT_ADDRESS[1],
        "name": 'Tether USD',
        "symbol": 'USDT',
        "decimals": 6,
        "logoURI": usdtLogo,
        "coingeckoId": 'tether',
    },
    {
        "chainId": 1,
        "address": WNATIVE_ADDRESS[1],
        "name": 'Wrapped ETH',
        "symbol": 'WETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 1,
        "address": WBTC_ADDRESS[1],
        "name": 'Wrapped BTC',
        "symbol": 'WBTC',
        "decimals": 8,
        "logoURI": btcLogo,
        "coingeckoId": 'bitcoin',
    },
    {
        "chainId": 1,
        "address": LINK_ADDRESS[1],
        "name": 'ChainLink Token',
        "symbol": 'LINK',
        "decimals": 18,
        "logoURI": linkLogo,
        "coingeckoId": 'chainlink',
    },
    
]
export const to_eth_from_ftm: TokenData[] = [
    {
        "chainId": 1,
        "address": NATIVE_ADDRESS,
        "name": 'Ethereum',
        "symbol": 'ETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 1,
        "address": USDT_ADDRESS[1],
        "name": 'Tether USD',
        "symbol": 'USDT',
        "decimals": 6,
        "logoURI": usdtLogo,
        "coingeckoId": 'tether',
    },
    {
        "chainId": 1,
        "address": WNATIVE_ADDRESS[1],
        "name": 'Wrapped ETH',
        "symbol": 'WETH',
        "decimals": 18,
        "logoURI": ethLogo,
        "coingeckoId": 'ethereum',
    },
    {
        "chainId": 1,
        "address": WBTC_ADDRESS[1],
        "name": 'Wrapped BTC',
        "symbol": 'WBTC',
        "decimals": 8,
        "logoURI": btcLogo,
        "coingeckoId": 'bitcoin',
    },
    {
        "chainId": 1,
        "address": LINK_ADDRESS[1],
        "name": 'ChainLink Token',
        "symbol": 'LINK',
        "decimals": 18,
        "logoURI": linkLogo,
        "coingeckoId": 'chainlink',
    },
]



const fromTokenList = (fromChain, toChain) => {
    let inputList
    // setInputList(
        fromChain == 43114 ? ( 
            toChain == 250 ? inputList = from_avax_to_ftm : inputList = from_avax_to_eth
        ) : fromChain == 1 ? (
            toChain == 43114 ? inputList = from_eth_to_avax : inputList = from_eth_to_ftm
        ) : fromChain == 250 ? (
            toChain == 43114 ? inputList = from_ftm_to_avax : inputList = from_ftm_to_eth
        ) : inputList = from_ftm_to_avax
 return inputList
}

const toTokenList = (fromChain, toChain) => {
    let outputList
    // setInputList(
        toChain == 43114 ? ( 
            fromChain == 250 ? outputList = to_avax_from_ftm : outputList = to_avax_from_eth
        ) : toChain == 1 ? (
            fromChain == 43114 ? outputList = to_eth_from_avax : outputList = to_eth_from_ftm
        ) : toChain == 250 ? (
            fromChain == 43114 ? outputList = to_ftm_from_avax : outputList = to_ftm_from_eth
        ) : outputList = to_avax_from_ftm
 return outputList
}

export const getInputList = (fromChain, toChain) => {
const inputList = fromTokenList(fromChain, toChain)
console.log('inputList: %s', inputList)

    return inputList
}

export const getOutputList = (fromChain, toChain) => {
    const outputList = toTokenList(fromChain, toChain)
    console.log('outputList: %s', outputList)

    return outputList
}
