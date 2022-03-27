import { JSBI } from 'sdk'

export interface AccrueInfo {
  interestPerSecond: JSBI
  lastAccrued: JSBI
  feesEarnedFraction: JSBI
}
