import { ethers } from 'ethers'
import { chainIconUrl } from './utils'

const ethereum = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 1,
	name: 'Ethereum',
	symbol: 'ETH',
	logoURI: chainIconUrl('ethereum'),
	decimals: 18
}

const binance = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 56,
	name: 'Binance',
	symbol: 'BNB',
	logoURI: chainIconUrl('binance'),
	decimals: 18
}

const arbitrum = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 42161,
	name: 'Ethereum',
	symbol: 'ETH',
	logoURI: chainIconUrl('ethereum'),
	decimals: 18
}

const moonriver = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 1285,
	name: 'MoonRiver',
	logoURI: chainIconUrl('moonriver'),
	symbol: 'MOVR',
	decimals: 18
}

const avax = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 43114,
	logoURI: chainIconUrl('avalanche'),
	name: 'Avalanche',
	symbol: 'AVAX',
	decimals: 18
}

const fantom = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 250,
	logoURI: chainIconUrl('fantom'),
	name: 'Fantom',
	symbol: 'FTM',
	decimals: 18
}

const polygon = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 137,
	name: 'Matic',
	symbol: 'MATIC',
	logoURI: chainIconUrl('polygon'),
	decimals: 18
}

export const nativeTokens = [
	ethereum,
	arbitrum,
	binance,
	polygon,
	fantom,
	avax,
	moonriver,
]