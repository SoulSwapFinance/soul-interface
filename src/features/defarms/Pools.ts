import { ChainId, SOUL_ADDRESS, USDC_ADDRESS, LUX_ADDRESS, WLUM_ADDRESS, WNATIVE_ADDRESS, SOUL_NATIVE, DAI_ADDRESS, BNB_ADDRESS, SOR_ADDRESS, WETH_ADDRESS, WBTC_ADDRESS, CRV_ADDRESS, GRIMEVO_ADDRESS, FUSD_ADDRESS, USDT_ADDRESS, SOUL_USDC, USDC_NATIVE, BTC_NATIVE, ETH_NATIVE, DAI_USDC, AVAX_ADDRESS, BNB_NATIVE, DAI_NATIVE, BTC_ETH, AVAX_NATIVE, ETH_USDC, BTC_USDC, SOUL, SUMMONER_ADDRESS } from 'sdk'
import { useDeFarmPoolInfo } from 'hooks/useAPI'
/*/ rules /*/
// `token0Symbol` && `token1Symbol`: always use "w" prefix
// `depositSymbol`: never use "w" prefix
// `depositSymbol`: always frontload native
// take note of exemptions (usually in lending) //

export const InactiveAvalanchePools = []

export const InactiveFantomPools = []

export const AvalanchePools = []

export const FantomPools = [
  {
    pid: 0,
    // logoURI: 'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07/logo.png',
    token0Symbol: 'WFTM',
    token1Symbol: 'REWARD',
    depositSymbol: 'FTM-USDC',
    rewardSymbol: "TOKEN",
    depositAddress: USDC_NATIVE[ChainId.FANTOM],
    rewardAddress: SOUL_ADDRESS[ChainId.FANTOM],
    token0Address: WNATIVE_ADDRESS[ChainId.FANTOM],
    token1Address: USDC_ADDRESS[ChainId.FANTOM],
  },
]