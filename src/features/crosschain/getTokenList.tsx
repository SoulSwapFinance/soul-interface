import { TokenData } from "@0xsquid/sdk"
// import { Chains } from "pages/exchange/crosschain"
// import { useCallback, useState } from "react"
import { AXL_USDC_ADDRESS } from "sdk"
import { AXL_TOKEN, CRV_TOKEN, DAI_TOKEN, EQUAL_TOKEN, ETH_TOKEN, FTM_TOKEN, LINK_TOKEN, MATIC_TOKEN, MIM_TOKEN, MPX_TOKEN, NATIVE_TOKEN, SPELL_TOKEN, SUSHI_TOKEN, USDC_TOKEN, USDT_TOKEN, WBTC_TOKEN, WNATIVE_TOKEN, btcLogo, crvLogo, equalLogo, linkLogo, mimLogo, mpxLogo, spellLogo, sushiLogo, usdcLogo, usdtId, usdtLogo } from "./tokens"

///////////////////////////////
    /*/ ETHEREUM (FROM) /*/
///////////////////////////////

export const from_eth_to_matic: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    DAI_TOKEN[1],
    LINK_TOKEN[1],
    SUSHI_TOKEN[1],
    CRV_TOKEN[1],
]
export const from_eth_to_bsc: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    DAI_TOKEN[1],
    LINK_TOKEN[1],
    SUSHI_TOKEN[1],
    CRV_TOKEN[1],
]
export const from_eth_to_ftm: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    DAI_TOKEN[1],
    LINK_TOKEN[1],
    SUSHI_TOKEN[1],
]
export const from_eth_to_avax: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    USDT_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    DAI_TOKEN[1],
    LINK_TOKEN[1],
    AXL_TOKEN[1],
    SUSHI_TOKEN[1],
]
export const from_eth_to_arbitrum: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    USDT_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    DAI_TOKEN[1],
    CRV_TOKEN[1],
    LINK_TOKEN[1],
    AXL_TOKEN[1],
    SUSHI_TOKEN[1],
]

/////////////////////////////
    /*/ ETHEREUM (TO) /*/
/////////////////////////////

export const to_eth_from_matic: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    LINK_TOKEN[1],
]
export const to_eth_from_bsc: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    LINK_TOKEN[1],
]
export const to_eth_from_ftm: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    MATIC_TOKEN[1],
    CRV_TOKEN[1],
    LINK_TOKEN[1],
]
export const to_eth_from_arbitrum: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    USDT_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    DAI_TOKEN[1],
    CRV_TOKEN[1],
    LINK_TOKEN[1],
    AXL_TOKEN[1],
    SUSHI_TOKEN[1],
]
export const to_eth_from_avax: TokenData[] = [
    NATIVE_TOKEN[1],
    WNATIVE_TOKEN[1],
    USDC_TOKEN[1],
    WBTC_TOKEN[1],
    FTM_TOKEN[1],
    AXL_TOKEN[1],
    USDT_TOKEN[1],
    LINK_TOKEN[1],
]

///////////////////////////////
    /*/ BINANCE (FROM) /*/
///////////////////////////////

export const from_bsc_to_eth: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const from_bsc_to_ftm: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const from_bsc_to_matic: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const from_bsc_to_arbitrum: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const from_bsc_to_avax: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]

///////////////////////////
/*/ BINANCE (TO) /*/
///////////////////////////

export const to_bsc_from_eth: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const to_bsc_from_ftm: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const to_bsc_from_matic: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const to_bsc_from_arbitrum: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]
export const to_bsc_from_avax: TokenData[] = [
    NATIVE_TOKEN[56],
    WNATIVE_TOKEN[56],
    ETH_TOKEN[56],
    WBTC_TOKEN[56],
    LINK_TOKEN[56],
    MATIC_TOKEN[56],
    USDC_TOKEN[56],
    USDT_TOKEN[56],
    AXL_TOKEN[56],
]


////////////////////////////////
    /*/ AVALANCHE (FROM) /*/
////////////////////////////////

export const from_avax_to_eth: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    ETH_TOKEN[43114],
    LINK_TOKEN[43114],
    AXL_TOKEN[43114],
    MIM_TOKEN[43114],
    USDC_TOKEN[43114],
    {
        "chainId": 43114,
        "address": '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // USDC.e
        "name": 'USD Coin',
        "symbol": 'USDC.e',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    WBTC_TOKEN[43114], // WBTC.e
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

export const from_avax_to_bsc: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    ETH_TOKEN[43114],
    LINK_TOKEN[43114],
    AXL_TOKEN[43114],
    MIM_TOKEN[43114],
    USDC_TOKEN[43114],
    {
        "chainId": 43114,
        "address": '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // USDC.e
        "name": 'USD Coin',
        "symbol": 'USDC.e',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    WBTC_TOKEN[43114], // WBTC.e
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

export const from_avax_to_matic: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    ETH_TOKEN[43114],  // WETH.e
    WBTC_TOKEN[43114],  // WBTC.e
    {
        "chainId": 43114,
        "address": '0x152b9d0fdc40c096757f570a51e494bd4b943e50', // BTC.b
        "name": 'Bitcoin',
        "symbol": 'BTC.b',
        "decimals": 8,
        "logoURI": btcLogo,
        "coingeckoId": 'bitcoin-avalanche-bridged-btc-b',
    },
    USDC_TOKEN[43114],  // USDC
    USDT_TOKEN[43114],  // USDt
    // {
    //     "chainId": 43114,
    //     "address": '0xF976ba91b6bb3468C91E4f02E68B37bc64a57e66', // axlUSDT
    //     "name": 'Axelar USDT',
    //     "symbol": 'axlUSDT',
    //     "decimals": 6,
    //     "logoURI": usdtLogo,
    //     "coingeckoId": usdtId,
    // },
    LINK_TOKEN[43114],
    AXL_TOKEN[43114],
    DAI_TOKEN[43114],
    MIM_TOKEN[43114],

]

export const from_avax_to_ftm: TokenData[] = [
   NATIVE_TOKEN[43114],
   WNATIVE_TOKEN[43114],
   ETH_TOKEN[43114],
   LINK_TOKEN[43114],
   USDC_TOKEN[43114],
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
    "address": AXL_USDC_ADDRESS[43114],
    "name": 'Axelar USDC',
    "symbol": 'axlUSDC',
    "decimals": 6,
    "logoURI": usdcLogo,
    "coingeckoId": 'usdc',
},
    MIM_TOKEN[43114],
]

export const from_avax_to_arbitrum: TokenData[] = [
   NATIVE_TOKEN[43114],
   WNATIVE_TOKEN[43114],
   ETH_TOKEN[43114],
   LINK_TOKEN[43114],
   USDC_TOKEN[43114],
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
    "address": AXL_USDC_ADDRESS[43114],
    "name": 'Axelar USDC',
    "symbol": 'axlUSDC',
    "decimals": 6,
    "logoURI": usdcLogo,
    "coingeckoId": 'usdc',
},
    DAI_TOKEN[43114],    
    MIM_TOKEN[43114],
]

//////////////////////////////
    /*/ AVALANCHE (TO) /*/
//////////////////////////////

export const to_avax_from_eth: TokenData[] = [
   NATIVE_TOKEN[43114],
   WNATIVE_TOKEN[43114],
   ETH_TOKEN[43114],
   LINK_TOKEN[43114],
   WBTC_TOKEN[43114],
   {
       "chainId": 43114,
       "address": '0x152b9d0fdc40c096757f570a51e494bd4b943e50', // BTC.b
       "name": 'Bitcoin',
       "symbol": 'BTC.b',
       "decimals": 8,
       "logoURI": btcLogo,
       "coingeckoId": 'bitcoin-avalanche-bridged-btc-b',
   },
   MIM_TOKEN[43114],
   USDC_TOKEN[43114], // USDC
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
        "address": AXL_USDC_ADDRESS[43114], // axlUSDC
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    AXL_TOKEN[43114],
]

export const to_avax_from_bsc: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    ETH_TOKEN[43114],
    LINK_TOKEN[43114],
    MIM_TOKEN[43114],
    USDC_TOKEN[43114],
    {
        "chainId": 43114,
        "address": '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', // USDC.e
        "name": 'USD Coin',
        "symbol": 'USDC.e',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    WBTC_TOKEN[43114], // WBTC.e
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

export const to_avax_from_matic: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    USDC_TOKEN[43114],
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
        "address": AXL_USDC_ADDRESS[43114], // axlUSDC
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    USDT_TOKEN[43114],
    DAI_TOKEN[43114],
    MIM_TOKEN[43114],
    WBTC_TOKEN[43114],  // BTC.e
    {
        "chainId": 43114,
        "address": '0x152b9d0fdc40c096757f570a51e494bd4b943e50', // BTC.b
        "name": 'Bitcoin',
        "symbol": 'BTC.b',
        "decimals": 8,
        "logoURI": btcLogo,
        "coingeckoId": 'bitcoin-avalanche-bridged-btc-b',
    },
    ETH_TOKEN[43114],   // WETH.e
    LINK_TOKEN[43114],  // LINK.e

]

export const to_avax_from_arbitrum: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    WBTC_TOKEN[43114],  // WBTC.e
    ETH_TOKEN[43114],   // WETH.e
    USDC_TOKEN[43114],
    {
        "chainId": 43114,
        "address": AXL_USDC_ADDRESS[43114], // axlUSDC
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    USDT_TOKEN[43114],
    DAI_TOKEN[43114], // DAI.e
    USDT_TOKEN[43114], // USDt
    {
        "chainId": 43114,
        "address": '0xc7198437980c041c805A1EDcbA50c1Ce5db95118', // USDT.e
        "name": 'Tether USD',
        "symbol": 'USDT.e',
        "decimals": 6,
        "logoURI": usdtLogo,
        "coingeckoId": 'tether',
    },
    MIM_TOKEN[43114],
    LINK_TOKEN[43114],
]

export const to_avax_from_ftm: TokenData[] = [
    NATIVE_TOKEN[43114],
    WNATIVE_TOKEN[43114],
    WBTC_TOKEN[43114],  // WBTC.e
    ETH_TOKEN[43114],   // WETH.e
    USDC_TOKEN[43114],
    {
        "chainId": 43114,
        "address": AXL_USDC_ADDRESS[43114], // axlUSDC
        "name": 'Axelar USDC',
        "symbol": 'axlUSDC',
        "decimals": 6,
        "logoURI": usdcLogo,
        "coingeckoId": 'usdc',
    },
    USDT_TOKEN[43114],
    DAI_TOKEN[43114], // DAI.e
    AXL_TOKEN[43114],
    USDT_TOKEN[43114], // USDt
    {
        "chainId": 43114,
        "address": '0xc7198437980c041c805A1EDcbA50c1Ce5db95118', // USDT.e
        "name": 'Tether USD',
        "symbol": 'USDT.e',
        "decimals": 6,
        "logoURI": usdtLogo,
        "coingeckoId": 'tether',
    },
    MIM_TOKEN[43114],
    LINK_TOKEN[43114],
]


/////////////////////////////
    /*/ FANTOM (FROM) /*/
/////////////////////////////

export const from_ftm_to_eth: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],
    WBTC_TOKEN[250],
    MPX_TOKEN[250],
    SPELL_TOKEN[250],
    CRV_TOKEN[250],
    EQUAL_TOKEN[250],
]
export const from_ftm_to_bsc: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],    // axlUSDC
    WBTC_TOKEN[250],    // axlBTC
    ETH_TOKEN[250],     // axlETH
    LINK_TOKEN[250],
    AXL_TOKEN[250],
    MIM_TOKEN[250],
    SUSHI_TOKEN[250],
]
export const from_ftm_to_matic: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],    // axlUSDC
    WBTC_TOKEN[250],    // axlBTC
    ETH_TOKEN[250],     // axlETH
    LINK_TOKEN[250],
    AXL_TOKEN[250],
    MIM_TOKEN[250],
    SUSHI_TOKEN[250],
]
export const from_ftm_to_arbitrum: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],    // axlUSDC
    WBTC_TOKEN[250],    // axlBTC
    ETH_TOKEN[250],     // axlETH
    LINK_TOKEN[250],
    AXL_TOKEN[250],
    MIM_TOKEN[250],
    SUSHI_TOKEN[250],
]
export const from_ftm_to_avax: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],    // axlUSDC
    WBTC_TOKEN[250],    // axlBTC
    ETH_TOKEN[250],    // axlETH
    MPX_TOKEN[250],
    SPELL_TOKEN[250],
    CRV_TOKEN[250],
    AXL_TOKEN[250],
    SUSHI_TOKEN[250],
    LINK_TOKEN[250],
    MIM_TOKEN[250],
    EQUAL_TOKEN[250],
]

///////////////////////////
    /*/ FANTOM (TO) /*/
///////////////////////////

export const to_ftm_from_eth: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],
    ETH_TOKEN[250],
    MIM_TOKEN[250],
    MPX_TOKEN[250],
    EQUAL_TOKEN[250],
    CRV_TOKEN[250],
    SPELL_TOKEN[250],
]
export const to_ftm_from_bsc: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250], // axlUSDC
    MIM_TOKEN[250],
    MPX_TOKEN[250],
    EQUAL_TOKEN[250],
    CRV_TOKEN[250],
    SPELL_TOKEN[250],
]
export const to_ftm_from_matic: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],
    MPX_TOKEN[250],
    EQUAL_TOKEN[250],
    CRV_TOKEN[250],
    LINK_TOKEN[250],
    SPELL_TOKEN[250],
    MIM_TOKEN[250]
]

export const to_ftm_from_arbitrum: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],
    MPX_TOKEN[250],
    EQUAL_TOKEN[250],
    CRV_TOKEN[250],
    LINK_TOKEN[250],
    SPELL_TOKEN[250],
    MIM_TOKEN[250],
]

export const to_ftm_from_avax: TokenData[] = [
    NATIVE_TOKEN[250],
    WNATIVE_TOKEN[250],
    USDC_TOKEN[250],
    MPX_TOKEN[250],
    EQUAL_TOKEN[250],
    CRV_TOKEN[250],
    LINK_TOKEN[250],
    SPELL_TOKEN[250],
    MIM_TOKEN[250],
]

///////////////////////////
    /*/ MATIC (FROM) /*/
///////////////////////////

export const from_matic_to_eth: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    USDC_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    LINK_TOKEN[137],
]
export const from_matic_to_bsc: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    LINK_TOKEN[137],
]
export const from_matic_to_ftm: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
    AXL_TOKEN[137],
]
export const from_matic_to_arbitrum: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
]
export const from_matic_to_avax: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
    AXL_TOKEN[137],
]

/////////////////////////
    /*/ MATIC (TO) /*/
/////////////////////////

export const to_matic_from_eth: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
]
export const to_matic_from_bsc: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
]
export const to_matic_from_ftm: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
]
export const to_matic_from_arbitrum: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
]
export const to_matic_from_avax: TokenData[] = [
    NATIVE_TOKEN[137],
    WNATIVE_TOKEN[137],
    ETH_TOKEN[137],
    WBTC_TOKEN[137],
    USDC_TOKEN[137],
    USDT_TOKEN[137],
    DAI_TOKEN[137],
    LINK_TOKEN[137],
]

///////////////////////////////
    /*/ ARBITRUM (FROM) /*/
///////////////////////////////

export const from_arbitrum_to_eth: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
    AXL_TOKEN[42161],
]
export const from_arbitrum_to_bsc: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
    AXL_TOKEN[42161],
]
export const from_arbitrum_to_matic: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
    AXL_TOKEN[42161],
]
export const from_arbitrum_to_ftm: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
]
export const from_arbitrum_to_avax: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
    AXL_TOKEN[42161],
]

/////////////////////////////
    /*/ ARBITRUM (TO) /*/
/////////////////////////////
export const to_arbitrum_from_eth: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
]
export const to_arbitrum_from_bsc: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
]
export const to_arbitrum_from_matic: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
]
export const to_arbitrum_from_ftm: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
]
export const to_arbitrum_from_avax: TokenData[] = [
    ETH_TOKEN[42161],
    USDC_TOKEN[42161],
    USDT_TOKEN[42161],
    WBTC_TOKEN[42161],
    SUSHI_TOKEN[42161],
    SPELL_TOKEN[42161],
]

const fromLists = {
    [1]: {
        56: from_eth_to_bsc,
        137: from_eth_to_matic,
        250: from_eth_to_ftm,
        42161: from_eth_to_arbitrum,
        43114: from_eth_to_avax,
    },
    [56]: {
        1: from_bsc_to_eth,
        137: from_bsc_to_matic,
        250: from_bsc_to_ftm,
        42161: from_bsc_to_arbitrum,
        43114: from_bsc_to_avax,
    },
    [250]: {
        1: from_ftm_to_eth,
        56: from_ftm_to_bsc,
        137: from_ftm_to_matic,
        42161: from_ftm_to_arbitrum,
        43114: from_ftm_to_avax,
    },
    [137]: {
        1: from_matic_to_eth,
        56: from_matic_to_bsc,
        250: from_matic_to_ftm,
        42161: from_matic_to_arbitrum,
        43114: from_matic_to_avax,
    },
    [42161]: {
        1: from_arbitrum_to_eth,
        56: from_arbitrum_to_bsc,
        137: from_arbitrum_to_matic,
        250: from_arbitrum_to_ftm,
        43114: from_arbitrum_to_avax 
    },
    [43114]: {
        1: from_avax_to_eth,
        56: from_avax_to_bsc,
        137: from_avax_to_matic,
        250: from_avax_to_ftm,
        42161: from_avax_to_arbitrum,
    },
}

const toLists = {
    [1]: {
        56: to_eth_from_bsc,
        137: to_eth_from_matic,
        250: to_eth_from_ftm,
        42161: to_eth_from_arbitrum,
        43114: to_eth_from_avax,
    },
    [56]: {
        1: to_bsc_from_eth,
        137: to_bsc_from_matic,
        250: to_bsc_from_ftm,
        42161: to_bsc_from_arbitrum,
        43114: to_bsc_from_avax,
    },
    [250]: {
        1: to_ftm_from_eth,
        56: to_ftm_from_bsc,
        137: to_ftm_from_matic,
        42161: to_ftm_from_arbitrum,
        43114: to_ftm_from_avax,
    },
    [137]: {
        1: to_matic_from_eth,
        56: to_matic_from_bsc,
        250: to_matic_from_ftm,
        42161: to_matic_from_arbitrum,
        43114: to_matic_from_avax,
    },
    [42161]: {
        1: to_arbitrum_from_eth,
        56: to_arbitrum_from_bsc,
        137: to_arbitrum_from_matic,
        250: to_arbitrum_from_ftm,
        43114: to_arbitrum_from_avax 
    },
    [43114]: {
        1: to_avax_from_eth,
        56: to_avax_from_bsc,
        137: to_avax_from_matic,
        250: to_avax_from_ftm,
        42161: to_avax_from_arbitrum,
    },
}

// interface TokenListInputs {
//     fromChain: Chains[],
//     toChain: Chains[]
// }
const fromTokenList = (fromChain, toChain) => {
    let inputList = from_ftm_to_avax
    inputList = [1, 56, 137, 250, 42161, 43114].includes(fromChain) 
        ? fromLists[fromChain][toChain] 
        : inputList = from_ftm_to_avax

    return inputList

}

const toTokenList = (fromChain, toChain) => {
    let outputList = from_ftm_to_avax
    outputList = [1, 56, 137, 250, 42161, 43114].includes(fromChain) 
        ? toLists[toChain][fromChain] 
        : outputList = from_ftm_to_avax

    return outputList

}

export const getInputList = (fromChain, toChain) => {
    const inputList = fromTokenList(fromChain, toChain)

    return inputList
}

export const getOutputList = (fromChain, toChain) => {
    const outputList = toTokenList(fromChain, toChain)

    return outputList
}
