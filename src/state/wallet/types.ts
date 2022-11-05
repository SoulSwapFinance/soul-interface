import { CurrencyAmount, Currency } from '../../sdk'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Currency>>