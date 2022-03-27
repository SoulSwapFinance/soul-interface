import { BigNumber } from '@ethersproject/bignumber'
import { Pair } from 'sdk'
import { ConstantProductRPool, RPool, RToken } from '@sushiswap/tines'
import { Pool } from '../entities/Pool'
import { ConstantProductPool } from '../entities/ConstantProductPool'
import { Fee } from '../enums/Fee'

export function convertPoolOrPairtoRPool(pool: Pool | Pair): RPool {
  if (pool instanceof ConstantProductPool) {
    return new ConstantProductRPool(
      pool.liquidityToken.address,
      pool.assets[0].wrapped as RToken,
      pool.assets[1].wrapped as RToken,
      pool.fee / 10000,
      BigNumber.from(pool.reserves[0].quotient.toString()),
      BigNumber.from(pool.reserves[1].quotient.toString())
    )
  } else if (pool instanceof Pair) {
    return new ConstantProductRPool(
      pool.liquidityToken.address,
      pool.token0 as RToken,
      pool.token1 as RToken,
      Fee.DEFAULT / 10000,
      BigNumber.from(pool.reserve0.quotient.toString()),
      BigNumber.from(pool.reserve1.quotient.toString())
    )
  } else {
    throw new Error('Unsupported type of pool !!!')
  }
}