import { AddressMap } from '../types'
import { ChainId } from '../enums/ChainId'

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '0xa9EC396a1b709689e98DaB9eAf4f18A913775d39',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.FANTOM_TESTNET]: ''
}

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.FANTOM_TESTNET]: ''
}

export const LIMIT_ORDER_HELPER_ADDRESS: AddressMap = {
  // [ChainId.MATIC]: '0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12',
  // [ChainId.AVALANCHE]: '0x889ec9e19C1598358899fCA4879011686c3d4045',
  [ChainId.FANTOM]: '0xBf28dD7C3B863eae035eBf535B1B214070E8ddBf',
}

// TODO: update
export const STOP_LIMIT_ORDER_ADDRESS: AddressMap = {
  // [ChainId.KOVAN]: '0xce9365dB1C99897f04B3923C03ba9a5f80E8DB87',
  // [ChainId.MATIC]: '0x1aDb3Bd86bb01797667eC382a0BC6A9854b4005f',
  // [ChainId.AVALANCHE]: '0xf6f9c9DB78AF5791A296c4bF34d59E0236E990E0',
  [ChainId.FANTOM]: '0x0dd184Bec9e43701F76d75D5FFfE246B2DC8d4EA',
}

export const SOUL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SEANCE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.FANTOM_TESTNET]: ''
}

export const MASTERCHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const UNDERWORLD_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '', // TODO
  [ChainId.FANTOM_TESTNET]: ''
}

export const SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_SUMMONER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_CIRCLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5063Fc9D759B5b03DD5fBC0B882b5F68CF881C32', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_VAULT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // Summoner
  [ChainId.FANTOM_TESTNET]: ''
}

export const COFFIN_BOX_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xD25354e20b5Ed0D5E0A2193993E3dd6e4f42B4f7',
  [ChainId.FANTOM_TESTNET]: ''
}

export const CHAINLINK_ORACLE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB', // TODO: update
  [ChainId.FANTOM_TESTNET]: ''
}

export const ENCHANT_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a',
  [ChainId.FANTOM_TESTNET]: ''
}

export const ENCHANT_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x62acBC5E5501374D6e462a095B48003Eaac3593C',
  [ChainId.FANTOM_TESTNET]: ''
}

export const AURA_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1D549636104Cc5cA79773E7D002AfE1FD5A03497',
  [ChainId.FANTOM_TESTNET]: ''
}

export const REAPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: ''
}

export const TIMELOCK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SUMMONER_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.FANTOM_TESTNET]: ''
}

export const SOUL_GUIDE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x5A6B3Ce2736E9B731Fba73262884016b50c39184', // JUL 27TH
  [ChainId.FANTOM_TESTNET]: ''
}

export const PRICE_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x51445B73852952128bFCAE65fdd889881D8d87Bd',
  [ChainId.FANTOM_TESTNET]: ''
}

export const HARVEST_HELPER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xb9e5f6152b797280c8C3427947780ce5c4a55b08',
  [ChainId.FANTOM_TESTNET]: ''
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  // [ChainId.ROPSTEN]: '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C',
  // [ChainId.KOVAN]: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
  // [ChainId.MATIC]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  [ChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  // [ChainId.HARMONY]: '0x985458E523dB3d53125813eD68c274899e9DfAb4',
  // [ChainId.HECO]: '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B',
  // [ChainId.OKEX]: '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85',
  // [ChainId.XDAI]: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
  // [ChainId.ARBITRUM]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  // [ChainId.AVALANCHE]: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
  // [ChainId.MOONRIVER]: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
}

export const DAI_ADDRESS: AddressMap = {
  [ChainId.FANTOM]: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E'
}

export const USD_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: USDC_ADDRESS[ChainId.MAINNET],
  // [ChainId.ROPSTEN]: USDC_ADDRESS[ChainId.ROPSTEN],
  // [ChainId.KOVAN]: USDC_ADDRESS[ChainId.KOVAN],
  // [ChainId.MATIC]: USDC_ADDRESS[ChainId.MATIC],
  [ChainId.FANTOM]: USDC_ADDRESS[ChainId.FANTOM],
  [ChainId.BSC]: USDC_ADDRESS[ChainId.BSC],
  // [ChainId.HARMONY]: USDC_ADDRESS[ChainId.HARMONY],
  // [ChainId.HECO]: USDC_ADDRESS[ChainId.HECO],
  // [ChainId.OKEX]: USDC_ADDRESS[ChainId.OKEX],
  // [ChainId.XDAI]: USDC_ADDRESS[ChainId.XDAI],
  // [ChainId.ARBITRUM]: USDC_ADDRESS[ChainId.ARBITRUM],
  // [ChainId.AVALANCHE]: USDC_ADDRESS[ChainId.AVALANCHE],
  // [ChainId.MOONRIVER]: USDC_ADDRESS[ChainId.MOONRIVER],
  // [ChainId.CELO]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
}

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  // [ChainId.ROPSTEN]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  // [ChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  // [ChainId.GÖRLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  // [ChainId.KOVAN]: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  // [ChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  // [ChainId.ARBITRUM_TESTNET]: '0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b',
  // [ChainId.MATIC]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  // [ChainId.OKEX]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  // [ChainId.HECO]: '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD',
  // [ChainId.HARMONY]: '0x6983D1E6DEf3690C4d616b13597A09e6193EA013',
  // [ChainId.XDAI]: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  // [ChainId.AVALANCHE]: '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
}

export const WNATIVE_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: WETH9_ADDRESS[ChainId.MAINNET],
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [ChainId.FANTOM_TESTNET]: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  // [ChainId.BSC_TESTNET]: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  // [ChainId.ROPSTEN]: WETH9_ADDRESS[ChainId.ROPSTEN],
  // [ChainId.RINKEBY]: WETH9_ADDRESS[ChainId.RINKEBY],
  // [ChainId.GÖRLI]: WETH9_ADDRESS[ChainId.GÖRLI],
  // [ChainId.KOVAN]: WETH9_ADDRESS[ChainId.KOVAN],
  // [ChainId.ARBITRUM]: WETH9_ADDRESS[ChainId.ARBITRUM],
  // [ChainId.ARBITRUM_TESTNET]: WETH9_ADDRESS[ChainId.ARBITRUM_TESTNET],
  // [ChainId.MATIC]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  // [ChainId.MATIC_TESTNET]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  // [ChainId.XDAI]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  // [ChainId.MOONBEAM_TESTNET]: '0xe73763DB808ecCDC0E36bC8E32510ED126910394',
  // [ChainId.AVALANCHE]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  // [ChainId.AVALANCHE_TESTNET]: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
  // [ChainId.HECO]: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
  // [ChainId.HECO_TESTNET]: '0x5B2DA6F42CA09C77D577a12BeaD0446148830687',
  // [ChainId.HARMONY]: '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a',
  // [ChainId.HARMONY_TESTNET]: '0x7a2afac38517d512E55C0bCe3b6805c10a04D60F',
  // [ChainId.OKEX]: '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15',
  // [ChainId.OKEX_TESTNET]: '0x2219845942d28716c0F7C605765fABDcA1a7d9E0',
  // [ChainId.CELO]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  // [ChainId.PALM]: '0xF98cABF0a963452C5536330408B2590567611a71',
  // [ChainId.MOONRIVER]: '0xf50225a84382c74CbdeA10b0c176f71fc3DE0C4d',
  // [ChainId.FUSE]: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629',
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  // [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
}