import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Token } from 'sdk'

export default interface LPToken {
  id?: number
  address: string
  tokenA: Token
  tokenB: Token
  totalSupply: BigNumber
  balance: CurrencyAmount<Currency>
  name?: string
  symbol?: string
  decimals?: number
  version?: 'v1' | 'v2'
}