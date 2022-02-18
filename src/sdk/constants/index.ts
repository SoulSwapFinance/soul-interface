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

// export const INIT_CODE_HASH: string =
//   '0xf3dcc3c6c6e34d3981dd429ac942301b9ebdd05de1be17f646b55476c44dc951' // 1 OCT 

export const INIT_CODE_HASH: { [chainId: number]: string } = {
  [ChainId.ETHEREUM]: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
  [ChainId.FANTOM]: '0xf3dcc3c6c6e34d3981dd429ac942301b9ebdd05de1be17f646b55476c44dc951',
  [ChainId.BSC]: '0x2d2a1a6740caa0c2e9da78939c9ca5c8ff259bf16e2b9dcbbec714720587df90',
 }

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

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
