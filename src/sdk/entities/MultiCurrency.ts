/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `MultiCurrency` is Ether.
 */
export declare class MultiCurrency {
    readonly address?: string;
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    readonly underlying?: any;
    readonly chainId?: any;
    readonly ContractVersion?: any;
    readonly destChains?: any;
    readonly logoUrl?: any;
    readonly price?: any;
    readonly tokenid?: any;
    readonly version?: any;
    readonly routerToken?: any;
    /**
     * The only instance of the base class `MultiCurrency`.
     */
    static readonly ETHER: MultiCurrency;
    /**
     * Constructs an instance of the base class `MultiCurrency`. The only instance of the base class `MultiCurrency` is `MultiCurrency.ETHER`.
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     * @param underlying of is underlying
     * @param chainId of is chainId
     */
    protected constructor(decimals: number, symbol?: string, name?: string, underlying?: any, chainId?: any, ContractVersion?: any, destChains?: any, logoUrl?: any, price?: any, tokenid?: any, version?: any, routerToken?: any);
}
declare const ETHER: MultiCurrency;
export { ETHER };
