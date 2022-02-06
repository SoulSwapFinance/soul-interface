import { ChainId } from '../enums';
import { Web3Provider } from '@ethersproject/providers';
export interface Domain {
    name: string;
    chainId: ChainId;
    verifyingContract: string;
}
export interface Message {
    maker: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
    recipient: string;
    startTime: string;
    endTime: string;
    stopPrice: string;
    oracleAddress: string;
    oracleData: string;
}
export interface CoffinApprovalMessage {
    warning: string;
    user: string;
    masterContract: string;
    approved: boolean;
    nonce: number;
}
export declare const getSignature: (message: Message, chainId: ChainId, privateKey: string) => {
    v: number;
    r: string;
    s: string;
};
export declare const getTypedData: (message: Message, chainId: ChainId) => {
    types: {
        EIP712Domain: {
            name: string;
            type: string;
        }[];
        LimitOrder: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    domain: Domain;
    message: Message;
};
export declare const getTypedDataCoffin: (message: CoffinApprovalMessage, chainId: ChainId) => {
    types: {
        EIP712Domain: {
            name: string;
            type: string;
        }[];
        SetMasterContractApproval: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    domain: Domain;
    message: CoffinApprovalMessage;
};
export declare const getTypeHash: (typedData: any) => string;
export declare const getSignatureWithProvider: (message: Message, chainId: ChainId, provider: Web3Provider) => Promise<{
    v: number;
    r: string;
    s: string;
}>;
export declare const getSignatureWithProviderCoffinbox: (message: CoffinApprovalMessage, chainId: ChainId, provider: Web3Provider) => Promise<{
    v: number;
    r: string;
    s: string;
}>;
export declare const getSignatureCoffin: (coffinApproval: CoffinApprovalMessage, chainId: ChainId, privateKey: string) => Promise<{
    v: number;
    r: string;
    s: string;
}>;
