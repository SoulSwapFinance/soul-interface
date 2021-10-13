import { ChainId } from '../sdk'

type AddressMap = { [chainId: number]: string }

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const ARCHER_ROUTER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x9917C083FF9FbD29Df1367FBF7F2388A9a202431',
}
export const FACTORY_ADDRESS = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x1120e150dA9def6Fe930f4fEDeD18ef57c0CA7eF',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_VAULT_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // TODO: UPDATE?
  [ChainId.FANTOM_TESTNET]: '',
}

export const SCARAB_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  // [ChainId.FANTOM]: '0xbc06b1115B272F4E217Ab2Ff33ad0efB873Be453', // 12 OCT
  // [ChainId.FANTOM]: '0x50a544773e2eD7a3Cb332Fe513f961326b620a21', // 12 OCT
  // [ChainId.FANTOM]: '0x99Add9c96C2E547fE6628Fcfc72F346a07638120', // 12 OCT
  [ChainId.FANTOM]: '0x95533433cD0d96473E20Ad2C3286047FFecca7AA', // 13 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const FAUCET_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_SEANCE_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x8f1E15cD3d5a0bb85B8189d5c6B61BB64398E19b', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_FTM_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const SEANCE_USDC_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x98c678d3c7ebed4a36b84666700d8b5b5ddc1f79', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const FTM_USDC_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // 01 OCT
  [ChainId.FANTOM_TESTNET]: '',
}

export const ETH_USD_PAIR: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x160653F02b6597E7Db00BA8cA826cf43D2f39556', // FTM-USDC
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOUL_SUMMONER_ADDRESS: AddressMap = {
  // [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0xce6ccbB1EdAD497B4d53d829DF491aF70065AB5B', // 20 SEP,
  [ChainId.FANTOM_TESTNET]: '0x70C6A37244feD0Fa4e4148D5ffe38a209dCEd714', // 20 SEP
}

export const ZAPPER_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
  // [ChainId.ROPSTEN]: '0xcff6eF0B9916682B37D80c19cFF8949bc1886bC2',
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xcBE6B83e77cdc011Cc18F6f0Df8444E5783ed982',
  // [ChainId.ROPSTEN]: '0x84d1f7202e0e7dac211617017ca72a2cb5e2b955',
}

export const MULTICALL2_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  // [ChainId.FANTOM]: '0xEd2Fb478f7fCef33E1E1d980a0135789B295a7F5', // 29 AUG
  [ChainId.FANTOM]: '0xf682Cc4468608fC4eFbaD6a06D9BC72e7790075a', // 29 AUG
  [ChainId.FANTOM_TESTNET]: '0x1ACB479bB9D1F73009F85ef5F495E942Bb57f15A', // 7 JUL
}

export const WNATIVE: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', // WFTM
  [ChainId.FANTOM_TESTNET]: '',
 
}
export const SOUL_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0xe2fb177009ff39f52c0134e8007fa0e4baacbd07', // SOUL
  [ChainId.FANTOM_TESTNET]: '',
 
}
export const SEANCE_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x124b06c5ce47de7a6e9efda71a946717130079e6', // SEANCE
  [ChainId.FANTOM_TESTNET]: '',
 
}
export const USDC_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.FANTOM]: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
  [ChainId.FANTOM_TESTNET]: '',
 
}