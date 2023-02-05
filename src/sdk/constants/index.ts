import { ChainId } from '../enums'
import { Currency, JSBI } from 'sdk'

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


const DAI_FTM_MARKET = '0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd'
const DAI_BNB_MARKET = '0xbDa9204e6D596feCf9bd48108723F9BDAa2019f6'
const FTM_DAI_MARKET = '0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61'
const DAI_ETH_MARKET = '0x9fA5de19495331E13b443F787B90CdD22B32263d'
// const DAI_BTC_MARKET = '0xaf28730165634A56434ca7f0B302CC54F862046F'

let defaultMultiplier = 1

export const LEND_MULTIPLIER = (chainId: ChainId, pairAddress: string) => {
  // let lentSymbol = lentAsset.wrapped.symbol
  if (chainId == ChainId.FANTOM) {
    pairAddress == DAI_FTM_MARKET || pairAddress == DAI_BNB_MARKET || pairAddress == FTM_DAI_MARKET
          ? defaultMultiplier = 4
            : pairAddress == DAI_ETH_MARKET
              ? defaultMultiplier = 2
                : defaultMultiplier = 1
    return defaultMultiplier
  } else return 1
}