import { ChainId } from '../enums'
import { JSBI } from 'sdk'

export * from './addresses'
export * from './underworld'
export * from './natives'
export * from './numbers'
export * from './tokens'

export const MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
)

export const INIT_CODE_HASH: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: '0x2d2a1a6740caa0c2e9da78939c9ca5c8ff259bf16e2b9dcbbec714720587df90', // JUN22
  [ChainId.TELOS]: '0x8d5156b1fa4d5924675d6ab8e615754414be695a9ef14a573cdc8069a5ce90ec',
  [ChainId.FANTOM]: '0xf3dcc3c6c6e34d3981dd429ac942301b9ebdd05de1be17f646b55476c44dc951',
  [ChainId.BSC]: '0x2d2a1a6740caa0c2e9da78939c9ca5c8ff259bf16e2b9dcbbec714720587df90', // TODO: update
  [ChainId.AVALANCHE]: '0xab9f67104ee4239d49c6b434dc5d6d76f43412862be0f00a0607199ad505abc6',

 }

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

/**
 * Default maximum slippage tolerance at 3%
 */
 export const maximumSlippage = .03

 
export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  ),
}

export const A_PRECISION = JSBI.BigInt(100)
export const MAX_FEE = JSBI.BigInt(10000)
export const LAMBDA_URL = 'https://9epjsvomc4.execute-api.us-east-1.amazonaws.com/dev'
export const SOCKET_URL = 'wss://hfimt374ge.execute-api.us-east-1.amazonaws.com/dev'

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _25 = JSBI.BigInt(25)
export const SECONDS_IN_YEAR = JSBI.BigInt(31536000)
export const _30 = JSBI.BigInt(30)
export const _100 = JSBI.BigInt(100)
export const _1000 = JSBI.BigInt(1000)
export const _10000 = JSBI.BigInt(10000)

export const defaultSwapFee = _25
export const defaultProtocolFeeDenominator = FIVE
