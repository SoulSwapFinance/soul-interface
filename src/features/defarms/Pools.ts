import { ChainId, SOUL_ADDRESS, USDC_ADDRESS, LUX_ADDRESS, WLUM_ADDRESS, WNATIVE_ADDRESS, SOUL_NATIVE, DAI_ADDRESS, BNB_ADDRESS, SOR_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS, CRV_ADDRESS, GRIMEVO_ADDRESS, FUSD_ADDRESS, USDT_ADDRESS, SOUL_USDC, USDC_NATIVE, BTC_NATIVE, ETH_NATIVE, DAI_USDC, AVAX_ADDRESS, BNB_NATIVE, DAI_NATIVE, BTC_ETH, AVAX_NATIVE, ETH_USDC, BTC_USDC, SOUL, SUMMONER_ADDRESS } from 'sdk'

/*/ rules /*/
// `token0Symbol` && `token1Symbol`: always use "w" prefix
// `depositSymbol`: never use "w" prefix
// `depositSymbol`: always frontload native

// take note of exemptions (usually in lending) //

export const InactiveAvalanchePools = []

export const InactiveFantomPools = []

export const AvalanchePools = []


export const FantomPools = [
  { // 600 
    pid: 3,
    farmAddress: SUMMONER_ADDRESS[ChainId.FANTOM],
    type: 'swap',
    decimals: 18,
    token0Symbol: 'WFTM',
    token1Symbol: 'USDC',
    depositSymbol: 'FTM-USDC',
    rewardSymbol: 'AVAX-SOUL',
    depositAddress: USDC_NATIVE[ChainId.FANTOM],
    rewardAddress: SOUL_ADDRESS[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
]