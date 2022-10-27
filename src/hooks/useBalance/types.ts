import { Amount, Type } from 'soulswap-currency'
import { FundSource } from 'soulswap-hooks'

export type BalanceMap = Record<string, Record<FundSource, Amount<Type> | undefined>> | undefined
