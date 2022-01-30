import { ChainId } from '../sdk'

type AddressMap = { [chainId: number]: string }

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const CONTRACT_SCAN = {
  [ChainId.MAINNET]: 'https://etherscan.io/address/',
  [ChainId.FANTOM]: 'https://ftmscan.com/address/',
  [ChainId.FANTOM_TESTNET]: 'https://testnet.ftmscan.com/address/',
}

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const ARCHER_ROUTER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x9917C083FF9FbD29Df1367FBF7F2388A9a202431',
}

export const FACTORY_ADDRESS = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '0xa9EC396a1b709689e98DaB9eAf4f18A913775d39',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.FANTOM_TESTNET]: '',
}

export const ROUTER_ADDRESS = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '0x1b4df4D7E63B125f3a01fd5598E8E8458e519255',
  [ChainId.FANTOM]: '0x6b3d631B87FE27aF29efeC61d2ab8CE4d621cCBF',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_VAULT_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // TODO: UPDATE?
  [ChainId.FANTOM_TESTNET]: '',
}

export const SCARAB_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  // [ChainId.FANTOM]: '0xbc06b1115B272F4E217Ab2Ff33ad0efB873Be453', // 12 OCT
  // [ChainId.FANTOM]: '0x99Add9c96C2E547fE6628Fcfc72F346a07638120', // 12 OCT
  [ChainId.FANTOM]: '0xd07572CEA2cC0dd862aEB95581e3710084357A2b', // 13 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const SAFE_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x497D86E79c28B5fffe7649C2EEE4D5E38bD9FdC2', // 23 DEC
  [ChainId.FANTOM_TESTNET]: '',
}

export const LOCKER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xd21fEDFC0AEf3c640B88FD0e3Ac87a31A8aC486B', // 29 NOV
  [ChainId.FANTOM_TESTNET]: '',
}

export const CLAIM_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xA121b64fd62a99869767650879C5bEc776415a45',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SUMMONER_HELPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa224a5D96E58E3dae89D0e4775444A329E67774c',
  [ChainId.FANTOM_TESTNET]: '',
}

export const FAUCET_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_SUMMONER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // 20 SEP,
  [ChainId.FANTOM_TESTNET]: '0x70C6A37244feD0Fa4e4148D5ffe38a209dCEd714', // 20 SEP
}

export const SOUL_DAO_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1C63C726926197BD3CB75d86bCFB1DaeBcD87250',
  [ChainId.FANTOM_TESTNET]: '',
}

export const LUX_TREASURY_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xDF2A28Cc2878422354A93fEb05B41Bd57d71DB24',
  [ChainId.FANTOM_TESTNET]: '',
}

export const ATOMIC_SWAP_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x7A2C9047085F413f259Bfa2d0E292AD725493F45', // 21 NOV,
  [ChainId.FANTOM_TESTNET]: '',
}

export const TRIDENT: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // TODO: update
  [ChainId.FANTOM_TESTNET]: '',
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  // [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  [ChainId.FANTOM]: '',
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982', // TODO: UPDATE
  [ChainId.FANTOM]: '0xA121b64fd62a99869767650879C5bEc776415a45', // JAN 6TH 2022
}

export const MULTICALL2_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a', // 29 AUG
  [ChainId.FANTOM_TESTNET]: '0x1ACB479bB9D1F73009F85ef5F495E942Bb57f15A', // 7 JUL
}

// TOKENS

export const SOUL_SEANCE_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_FTM_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_USDC_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xC0A301f1E5E0Fe37a31657e8F60a41b14d01B0Ef',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SEANCE_USDC_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x98c678d3c7ebed4a36b84666700d8b5b5ddc1f79', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const FTM_USDC_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const ETH_USD_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // FTM-USDC
  [ChainId.FANTOM_TESTNET]: '',
}

export const WNATIVE: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.FANTOM]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83', // WFTM
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07', // SOUL
  [ChainId.FANTOM_TESTNET]: '',
}

export const SEANCE_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x124B06C5ce47De7A6e9EFDA71a946717130079E6', // SEANCE
  [ChainId.FANTOM_TESTNET]: '',
}

export const ENCHANT_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6a1a8368D607c7a808F7BbA4F7aEd1D9EbDE147a', // ENCHANT
  [ChainId.FANTOM_TESTNET]: '',
}

export const LUX_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b', // LUX
  [ChainId.FANTOM_TESTNET]: '',
}

export const WLUM_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208', // WLUM
  [ChainId.FANTOM_TESTNET]: '',
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC
  [ChainId.FANTOM_TESTNET]: '',
}
export const STOP_LIMIT_ORDER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x0dd184Bec9e43701F76d75D5FFfE246B2DC8d4EA', // TODO
  [ChainId.FANTOM_TESTNET]: '',
}
