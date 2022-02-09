import { BigNumber } from '@ethersproject/bignumber'
import { formatNumber, formatPercent } from 'functions/format'
import { getUSDString } from 'functions/underworld'

export enum Direction {
  DOWN = -1,
  FLAT = 0,
  UP = 1,
}

interface Line {
  name: string
  from: string
  to: string
  direction: Direction
}

export class TransactionReview extends Array<Line> {
  public add(name: string, from: string, to: string, direction: Direction): this {
    this.push({
      name: name,
      from: from,
      to: to,
      direction: direction,
    })
    return this
  }

  public addTokenAmount(name: string, from: BigNumber, to: BigNumber, token: any): this {
    this.add(
      name,
      formatNumber(from) + ' ' + token.tokenInfo.symbol,
      formatNumber(to) + ' ' + token.tokenInfo.symbol,
      Number(from)==Number(to) ? Direction.FLAT : from < to ? Direction.UP : Direction.DOWN
    )
    return this
  }

  public addUSD(name: string, from: BigNumber, to: BigNumber, token: any): this {
    this.add(
      name,
      formatNumber(getUSDString(Number(from), token), true),
      formatNumber(getUSDString(Number(to), token), true),
      from == to ? Direction.FLAT : Number(from) < Number(to) ? Direction.UP : Direction.DOWN
    )
    return this
  }

  public addPercentage(name: string, from: BigNumber, to: BigNumber): this {
    this.add(
      name,
      formatPercent(from),
      formatPercent(to),
      from == to ? Direction.FLAT : from < to ? Direction.UP : Direction.DOWN
    )
    return this
  }

  public addRate(name: string, from: BigNumber, to: BigNumber, pair: any): this {
    this.add(
      name,
      formatNumber(from.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)),
      formatNumber(to.toFixed(18 + pair.collateral.tokenInfo.decimals - pair.asset.tokenInfo.decimals)),
      from == to ? Direction.FLAT : from < to ? Direction.UP : Direction.DOWN
    )
    return this
  }
}