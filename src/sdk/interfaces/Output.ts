import { BigNumber } from '@ethersproject/bignumber';
export interface Output {
    token: string;
    to: string;
    unwrapCoffin: boolean;
    minAmount: BigNumber;
}
