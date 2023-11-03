import { TokenData } from "@0xsquid/sdk";

/**
 * If a component need to display price of a single token
 * @param tokenData
 * @returns
 */
export declare const useTokenPrice: (tokenData: TokenData | undefined) => {
    tokenPrice: import("@tanstack/react-query").UseQueryResult<number, unknown>;
    getUSDValue: (balance: string) => number;
};