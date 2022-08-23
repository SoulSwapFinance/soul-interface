import { PricedToken } from './PricedToken';
import { CurrencyAmount } from './CurrencyAmount';
import { BigintIsh } from 'sdk/types/BigIntIsh';
import { Token, TokenAmount } from 'sdk';

export class PricedTokenAmount extends TokenAmount {
    readonly token: PricedToken;
    constructor(token: PricedToken, amount: BigintIsh);
    get nativeCurrencyAmount(): CurrencyAmount<Token>;
}
