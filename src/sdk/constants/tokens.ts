import { FTM_ADDRESS, USDC_ADDRESS, CHANT_ADDRESS, DAI_ADDRESS, WETH9_ADDRESS, WNATIVE_ADDRESS, SOUL_ADDRESS } from './addresses'

import { ChainId } from '../enums'
import { Token } from '../entities/Token'
import { TokenMap } from '../types/TokenMap'

export const USDC: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, USDC_ADDRESS[ChainId.ETHEREUM], 6, 'USDC', 'USD Coin'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, USDC_ADDRESS[ChainId.ETHEREUM], 6, 'USDC', 'USD Coin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, USDC_ADDRESS[ChainId.FANTOM], 6, 'USDC', 'USD Coin'),
  [ChainId.BSC]: new Token(ChainId.BSC, USDC_ADDRESS[ChainId.BSC], 18, 'USDC', 'USD Coin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, USDC_ADDRESS[ChainId.AVALANCHE], 18, 'USDC', 'USD Coin'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, USDC_ADDRESS[ChainId.MOONRIVER], 6, 'USDC', 'USD Coin'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, USDC_ADDRESS[ChainId.MATIC], 6, 'USDC', 'USD Coin')
}

export const DAI: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, DAI_ADDRESS[ChainId.ETHEREUM], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, DAI_ADDRESS[ChainId.FANTOM], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.BSC]: new Token(ChainId.BSC, DAI_ADDRESS[ChainId.BSC], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, DAI_ADDRESS[ChainId.AVALANCHE], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, DAI_ADDRESS[ChainId.MOONRIVER], 18, 'DAI', 'Dai Stablecoin'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, DAI_ADDRESS[ChainId.MATIC], 18, 'DAI', 'Dai Stablecoin'),
}

export const FTM: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, FTM_ADDRESS[ChainId.ETHEREUM], 18, 'FTM', 'Fantom'),
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
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WETH9_ADDRESS[ChainId.AVALANCHE], 18, 'WETH', 'Wrapped Ether'),
}

export const WNATIVE: TokenMap = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.BSC]: new Token(ChainId.BSC, WNATIVE_ADDRESS[ChainId.BSC], 18, 'WBNB', 'Wrapped BNB'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, WNATIVE_ADDRESS[ChainId.TELOS], 18, 'WTLOS', 'Wrapped Telos'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, WNATIVE_ADDRESS[ChainId.FANTOM], 18, 'WFTM', 'Wrapped Fantom'),
  [ChainId.FANTOM_TESTNET]: new Token(ChainId.FANTOM_TESTNET, WNATIVE_ADDRESS[ChainId.FANTOM_TESTNET], 18, 'WFTM', 'Wrapped Fantom'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, WNATIVE_ADDRESS[ChainId.AVALANCHE], 18, 'WAVAX', 'Wrapped Avalanche'),
  [ChainId.MOONRIVER]: new Token(ChainId.MOONRIVER, WNATIVE_ADDRESS[ChainId.MOONRIVER], 18, 'WMOVR', 'Wrapped Moonriver'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, WNATIVE_ADDRESS[ChainId.MATIC], 18, 'WMATIC', 'Wrapped Matic'),
}

export const SOUL: TokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, SOUL_ADDRESS[ChainId.FANTOM], 18, 'SOUL', 'Soul Power'),
  [ChainId.TELOS]: new Token(ChainId.TELOS, SOUL_ADDRESS[ChainId.TELOS], 18, 'SOUL', 'Soul Power'),
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, SOUL_ADDRESS[ChainId.FANTOM], 18, 'SOUL', 'Soul Power'),
  [ChainId.AVALANCHE]: new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'Soul Power'),
}

export const CHANT: TokenMap = {
  [ChainId.FANTOM]: new Token(ChainId.FANTOM, CHANT_ADDRESS[ChainId.FANTOM], 18, 'CHANT', 'Enchanted Soul'),
}
