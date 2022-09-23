import { ChainId, DAI_ADDRESS, SOUL_ADDRESS, Token, USDC_ADDRESS } from 'sdk'
export const DAI = new Token(ChainId.AVALANCHE,  DAI_ADDRESS[ChainId.AVALANCHE], 18, 'DAI', 'Dai Stablecoin')
export const WBTC = new Token(ChainId.AVALANCHE, '0x50b7545627a5162F82A992c33b87aDc75187B218', 8, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether')
export const SOUL = new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'SoulPower')
export const USDC = new Token(ChainId.AVALANCHE, USDC_ADDRESS[ChainId.AVALANCHE], 6, 'USDC', 'USD Coin')
