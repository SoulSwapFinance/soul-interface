import { AddressMap } from '../types'
import { ChainId } from '../enums/ChainId'

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '0xa9EC396a1b709689e98DaB9eAf4f18A913775d39',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.FANTOM_TESTNET]: ''
}

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.FANTOM_TESTNET]: ''
}

export const BORING_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x26bbB91Ade07f995E1c5D1F4A050639763F4C44b',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SEANCE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.FANTOM_TESTNET]: ''
}

export const MASTERCHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const UNDERWORLD_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x94f2ae18250507506C77cefc14EE7B4b95d323B1', // Updated
  [ChainId.FANTOM_TESTNET]: ''
}

export const SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_CIRCLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5063Fc9D759B5b03DD5fBC0B882b5F68CF881C32', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const COFFIN_BOX_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF539C37275e947F24480fAb9f7e302aE827570b2',
  [ChainId.FANTOM_TESTNET]: ''
}

export const CHAINLINK_ORACLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xCDd5Df7146B278c90c572b6c6F933C6b7ce2b41e', // FEB22
  [ChainId.FANTOM_TESTNET]: ''
}

export const ENCHANT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a',
  [ChainId.FANTOM_TESTNET]: ''
}

export const ENCHANT_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x62acBC5E5501374D6e462a095B48003Eaac3593C',
  [ChainId.FANTOM_TESTNET]: ''
}

export const AURA_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1D549636104Cc5cA79773E7D002AfE1FD5A03497',
  [ChainId.FANTOM_TESTNET]: ''
}

export const REAPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: ''
}

export const TIMELOCK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SUMMONER_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_GUIDE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5A6B3Ce2736E9B731Fba73262884016b50c39184', // JUL 27TH
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOULSWAP_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.BSC]: '0x1766733112408b95239aD1951925567CB1203084',
  [ChainId.FANTOM]: '0xb2b22549F6586Cd81054677C6b9413Cea9587fd7', // FEB22
}

export const SOULSWAP_MULTISWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0x545820d5Cc05248da112419fEfb18522c63C8e12',
  [ChainId.BSC]: '0x86c655cAc122e9A2fd9Ae1f79Df27b30E357968c',
  [ChainId.FANTOM]: '0xbA1d9DdC58bD750ab05217b1eDD864FDb495Ab57', // FEB22
}

export const SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.BSC]: '0x1B16149Edaf1EFa6ADE6aEEF33e63C6e08c9bB1B',
  [ChainId.FANTOM]: '0xb988D44aF0065649E05e61B7d35b6121ff2b537E', // FEB22
}

export const PRICE_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x51445B73852952128bFCAE65fdd889881D8d87Bd',
  [ChainId.FANTOM_TESTNET]: ''
}

export const HARVEST_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb9e5f6152b797280c8C3427947780ce5c4a55b08',
  [ChainId.FANTOM_TESTNET]: ''
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [ChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}

export const DAI_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E'
}

export const USD_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: USDC_ADDRESS[ChainId.ETHEREUM],
  [ChainId.BSC]: USDC_ADDRESS[ChainId.BSC],
  [ChainId.FANTOM]: USDC_ADDRESS[ChainId.FANTOM],
}

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: WETH9_ADDRESS[ChainId.ETHEREUM],
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [ChainId.FANTOM_TESTNET]: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.ETHEREUM]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
}