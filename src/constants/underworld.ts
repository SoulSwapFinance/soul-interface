import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '../sdk'

// Functions that need accrue to be called
export const ACTION_ADD_ASSET = 1
export const ACTION_REPAY = 2
export const ACTION_REMOVE_ASSET = 3
export const ACTION_REMOVE_COLLATERAL = 4
export const ACTION_BORROW = 5
export const ACTION_GET_REPAY_SHARE = 6
export const ACTION_GET_REPAY_PART = 7
export const ACTION_ACCRUE = 8

// Functions that don't need accrue to be called
export const ACTION_ADD_COLLATERAL = 10
export const ACTION_UPDATE_EXCHANGE_RATE = 11

// Function on CoffinBox
export const ACTION_COFFIN_DEPOSIT = 20
export const ACTION_COFFIN_WITHDRAW = 21
export const ACTION_COFFIN_TRANSFER = 22
export const ACTION_COFFIN_TRANSFER_MULTIPLE = 23
export const ACTION_COFFIN_SETAPPROVAL = 24

// Any external call (except to CoffinBox)
export const ACTION_CALL = 30

export const MINIMUM_TARGET_UTILIZATION = BigNumber.from('700000000000000000') // 70%

export const MAXIMUM_TARGET_UTILIZATION = BigNumber.from('800000000000000000') // 80%

export const UTILIZATION_PRECISION = BigNumber.from('1000000000000000000')

export const FULL_UTILIZATION = BigNumber.from('1000000000000000000')

export const FULL_UTILIZATION_MINUS_MAX = FULL_UTILIZATION.sub(MAXIMUM_TARGET_UTILIZATION)

export const STARTING_INTEREST_PER_YEAR = BigNumber.from(317097920)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 1% APR

export const MINIMUM_INTEREST_PER_YEAR = BigNumber.from(79274480)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 0.25% APR

export const MAXIMUM_INTEREST_PER_YEAR = BigNumber.from(317097920000)
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(60))
  .mul(BigNumber.from(24))
  .mul(BigNumber.from(365)) // approx 1000% APR

export const INTEREST_ELASTICITY = BigNumber.from('28800000000000000000000000000000000000000') // Half or double in 28800 seconds (8 hours) if linear

export const FACTOR_PRECISION = BigNumber.from('1000000000000000000')

export const PROTOCOL_FEE = BigNumber.from('10000') // 10%

export const PROTOCOL_FEE_DIVISOR = BigNumber.from('100000')

export const COFFIN_BOX_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0xF539C37275e947F24480fAb9f7e302aE827570b2', // TODO: REVIEW
  [ChainId.FANTOM_TESTNET]: ''
}

export const UNDERWORLD_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '0x94f2ae18250507506C77cefc14EE7B4b95d323B1', // TODO: REVIEW
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOULSWAP_SWAPPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOULSWAP_MULTISWAPPER_ADDRESS: {
  [chainId in ChainId]: string
} = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
}

export const SOULSWAP_MULTI_EXACT_SWAPPER_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '',
}

export const PEGGED_ORACLE_ADDRESS = '0x6cbfbB38498Df0E1e7A4506593cDB02db9001564'

export const SOULSWAP_TWAP_0_ORACLE_ADDRESS = '0x66F03B0d30838A3fee971928627ea6F59B236065'

export const SOULSWAP_TWAP_1_ORACLE_ADDRESS = '0x0D51b575591F8f74a2763Ade75D3CDCf6789266f'

export const CHAINLINK_ORACLE_ADDRESS = '0x00632CFe43d8F9f8E6cD0d39Ffa3D4fa7ec73CFB'

export const SOUL_GUIDE_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '',
  [ChainId.FANTOM]: '',
  [ChainId.FANTOM_TESTNET]: '0x5A6B3Ce2736E9B731Fba73262884016b50c39184',
}
