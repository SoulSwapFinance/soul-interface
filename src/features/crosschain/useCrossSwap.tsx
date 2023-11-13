import type { TokenData } from "@0xsquid/sdk";
// import { token } from "features/aggregator/adapters/0x";


const useCrossSwap = () => {
    let tokenItem: {
        from: TokenData[];
        to: TokenData[];
    }

    return([tokenItem])
    

    // return [tokenItem]
    // tokenItems: {
    //     from: TokenData[];
    //     to: TokenData[];
    // };
    // onSwapChange: ({ fromChainId, toChainId, fromTokenAddress, toTokenAddress, destinationAddress, }: {
    //     fromChainId?: string | number | undefined;
    //     toChainId?: string | number | undefined;
    //     fromTokenAddress?: string | undefined;
    //     toTokenAddress?: string | undefined;
    //     destinationAddress?: string | undefined;
    // }) => Promise<void>;
    // invertSwaps: () => void;
    // fromPrice: string | undefined;
    // toPrice: number | undefined;
    // fromPriceChanged: (price: string) => void;
    // toToken: TokenData | undefined;
    // fromToken: TokenData | undefined;
    // fromChain: import("@0xsquid/sdk").ChainData | undefined;
    // toChain: import("@0xsquid/sdk").ChainData | undefined;
    // destinationAddress: string | undefined;
};

export default useCrossSwap