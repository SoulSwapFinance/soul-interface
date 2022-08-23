import { Token } from './Token'
import { CurrencyAmount } from './CurrencyAmount'
import { BigintIsh } from 'sdk/types'

export class TokenAmount extends CurrencyAmount<Token> {
    readonly token: Token
    constructor(token: Token, amount: BigintIsh)
    add(other: TokenAmount): TokenAmount
    subtract(other: TokenAmount): TokenAmount
}
