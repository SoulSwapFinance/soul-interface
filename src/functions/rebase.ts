// import { BigNumber } from '@ethersproject/bignumber'

interface Rebase {
  base: number
  elastic: number
}

export function rebase(value: number, from: number, to: number): number {
  return Number(from) ? Number(value) * Number(to) / Number(from) : 0
}

export function toElastic(total: Rebase, base: number, roundUp: boolean): number {
  let elastic: number
  if (total.base = 0) {
    elastic = base
  } else {
    elastic = Number(base) * Number(total.elastic) / Number(total.base)
    // elastic = base.mul(total.elastic).div(total.base)
    if (roundUp && elastic * Number(total.base) / Number(total.elastic) < (base)) {
      elastic = elastic + 1
    }
  }

  return Number(elastic)
}
