import { ChainId, Fraction, Percent } from 'sdk'

export const UNDERWORLD_NETWORKS = [
  ChainId.AVALANCHE,
  ChainId.FANTOM,
  // ChainId.BSC,
]

export const LTV = new Fraction(75, 100)
export const DEFAULT_BORROW_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)
export const PADDING = new Fraction(95, 100)