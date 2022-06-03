// import { AvailableFeeValues } from 'src/constants/available-fee-values';
// import { IframeType } from "./iframe-type";
export type IframeType = 'horizontal' | 'vertical';

export const availableFeeValues = [0.075] as const;

export type AvailableFeeValues = typeof availableFeeValues[number];

export enum BLOCKCHAIN_NAME {
    ETHEREUM = 'eth',
    BINANCE_SMART_CHAIN = 'bsc',
    POLYGON = 'polygon',
    TRON = 'trx',
    XDAI = 'xdai',
    HARMONY = 'harmony',
    FANTOM = 'fantom',
    MOONRIVER = 'moonriver'
}

export type InjectTokensBlockchains = 'eth' | 'bsc' | 'polygon' | 'harmony' | 'avalanche';

export type InjectTokensQuery = Partial<{
    [key in InjectTokensBlockchains as `${key}_tokens`]: string;
}>;

export interface Configuration {
    language?: 'en' | 'ru';
    from?: string;
    to?: string;
    fromChain?: BLOCKCHAIN_NAME;
    toChain?: BLOCKCHAIN_NAME;
    amount?: number;
    iframe?: IframeType;
    hideSelectionFrom?: boolean;
    hideSelectionTo?: boolean;
    slippagePercent?: {
        instantTrades?: number;
        crossChain?: number;
    }
    background?: string;
    theme?: 'dark' | 'light';
    injectTokens?: Partial<Record<InjectTokensBlockchains, string[]>>;
    promoCode?: string;
    fee?: AvailableFeeValues;
    feeTarget?: string;
}