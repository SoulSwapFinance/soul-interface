import { FTM_ADDRESS, USDC_ADDRESS, CHANT_ADDRESS, DAI_ADDRESS, WETH9_ADDRESS, WNATIVE_ADDRESS, SOUL_ADDRESS, LZ_USDC_ADDRESS, MULTI_USDC_ADDRESS, FRAX_ADDRESS, WBTC_ADDRESS, USDT_ADDRESS, MULTI_WBTC_ADDRESS, WETH_ADDRESS, MULTI_DAI_ADDRESS, MPX_ADDRESS, AXL_USDC_ADDRESS } from './addresses'

import { ChainId } from '../enums'
import { Token } from '../entities/Token'
import { TokenMap } from '../types/TokenMap'

export const USDC: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, USDC_ADDRESS[ChainId.ETHEREUM], 6, 'USDC', 'USD Coin'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, USDC_ADDRESS[ChainId.ETHEREUM], 6, 'USDC', 'USD Coin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, USDC_ADDRESS[ChainId.FANTOM], 6, 'USDC', 'USD Coin (Axelar)'),
  [ChainId.BSC]: new Token(ChainId.BSC, USDC_ADDRESS[ChainId.BSC], 18, 'USDC', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, USDC_ADDRESS[ChainId.AVALANCHE], 6, 'USDC', 'USD Coin'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, USDC_ADDRESS[ChainId.MOONRIVER], 6, 'USDC', 'USD Coin'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, USDC_ADDRESS[ChainId.ARBITRUM], 6, 'USDC', 'USD Coin'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, USDC_ADDRESS[ChainId.MATIC], 6, 'USDC', 'USD Coin')
}

export const USDT: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, USDT_ADDRESS[ChainId.ETHEREUM], 6, 'USDT', 'Tether USD'),
}

export const MULTI_USDC: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MULTI_USDC_ADDRESS[ChainId.FANTOM], 6, 'mUSDC', 'USDC (Multichain)'),
}

export const MULTI_DAI: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MULTI_DAI_ADDRESS[ChainId.FANTOM], 18, 'DAI', 'DAI (Multichain)'),
}

export const AXL_USDC: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, AXL_USDC_ADDRESS[ChainId.FANTOM], 6, 'axlUSDC', 'USD Coin (Axelar)'),
}

export const LZ_USDC: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, LZ_USDC_ADDRESS[ChainId.FANTOM], 6, 'lzUSDC', 'USDC (LayerZero)'),
}

export const FRAX: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, FRAX_ADDRESS[ChainId.FANTOM], 18, 'FRAX', 'Frax'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, FRAX_ADDRESS[ChainId.AVALANCHE], 18, 'FRAX', 'Frax'),
}

export const DAI: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, DAI_ADDRESS[ChainId.ETHEREUM], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, DAI_ADDRESS[ChainId.FANTOM], 18, 'DAI', 'DAI (Axelar)'),
  [ChainId.BSC]: new Token(ChainId.BSC, DAI_ADDRESS[ChainId.BSC], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, DAI_ADDRESS[ChainId.AVALANCHE], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, DAI_ADDRESS[ChainId.MOONRIVER], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, DAI_ADDRESS[ChainId.MATIC], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, DAI_ADDRESS[ChainId.ARBITRUM], 18, 'DAI', 'Dai Stablecoin'),
}

export const MDAI: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MULTI_DAI_ADDRESS[ChainId.FANTOM], 18, 'mDAI', 'DAI (Multichain)'),
}

export const FTM: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, FTM_ADDRESS[ChainId.ETHEREUM], 18, 'FTM', 'Fantom'),
}

export const SOUL: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, SOUL_ADDRESS[ChainId.ETHEREUM], 18, 'SOUL', 'Soul Power'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, SOUL_ADDRESS[ChainId.TELOS], 18, 'SOUL', 'Soul Power'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, SOUL_ADDRESS[ChainId.FANTOM], 18, 'SOUL', 'Soul Power'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'Soul Power'),
}

export const WBTC: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, WBTC_ADDRESS[ChainId.ETHEREUM], 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, WBTC_ADDRESS[ChainId.FANTOM], 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WBTC_ADDRESS[ChainId.AVALANCHE], 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, WBTC_ADDRESS[ChainId.ARBITRUM], 8, 'WBTC', 'Wrapped BTC'),
}

export const WETH: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, WETH_ADDRESS[ChainId.ETHEREUM], 18, 'WETH', 'Wrapped ETH'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, WETH_ADDRESS[ChainId.FANTOM], 18, 'WETH', 'Wrapped ETH'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WETH_ADDRESS[ChainId.AVALANCHE], 18, 'WETH', 'Wrapped ETH'),
}

export const MULTI_WBTC: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MULTI_WBTC_ADDRESS[ChainId.FANTOM], 8, 'WBTC', 'Wrapped BTC'),
}

export const MPX: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, MPX_ADDRESS[ChainId.FANTOM], 8, 'MPX', 'Morphex'),
}

export const USD: TokenMap = {
  ...USDC,
}

export const WETH9: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, WETH9_ADDRESS[ChainId.ETHEREUM], 18, 'WETH', 'Wrapped Ether'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, WETH9_ADDRESS[ChainId.TELOS], 18, 'WETH', 'Wrapped Ether'),
  [ChainId.BSC]: new Token(ChainId.BSC, WETH9_ADDRESS[ChainId.BSC], 18, 'WETH', 'Wrapped Ether'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, WETH9_ADDRESS[ChainId.FANTOM], 18, 'WETH', 'Wrapped Ether'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WETH9_ADDRESS[ChainId.AVALANCHE], 18, 'WETH', 'Wrapped Ether'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, WETH9_ADDRESS[ChainId.MOONRIVER], 18, 'WETH', 'Wrapped Ether'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, WETH9_ADDRESS[ChainId.ARBITRUM], 18, 'WETH', 'Wrapped Ether'),
}
export const WNATIVE: TokenMap = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.BSC]: new Token(ChainId.BSC, WNATIVE_ADDRESS[ChainId.BSC], 18, 'WBNB', 'Wrapped BNB'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, WNATIVE_ADDRESS[ChainId.TELOS], 18, 'WTLOS', 'Wrapped Telos'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, WNATIVE_ADDRESS[ChainId.FANTOM], 18, 'WFTM', 'Wrapped Fantom'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WNATIVE_ADDRESS[ChainId.AVALANCHE], 18, 'WAVAX', 'Wrapped Avalanche'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, WNATIVE_ADDRESS[ChainId.MOONRIVER], 18, 'WMOVR', 'Wrapped Moonriver'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, WNATIVE_ADDRESS[ChainId.MATIC], 18, 'WMATIC', 'Wrapped Matic'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, WNATIVE_ADDRESS[ChainId.ARBITRUM], 18, 'WETH', 'Wrapped Ether'),
}