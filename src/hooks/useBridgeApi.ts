import useRestApi from "./useRestApi";
import useApiData from "./useApiData";

export const ROUTER_ADDRESS = "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52";
export const BRIDGE_ROUTER_ADDRESS =
  "0x1CcCA1cE62c62F7Be95d4A67722a8fDbed6EEcb4";
export const ZAPPER_ADDRESS = "0xF0ff07d19f310abab54724a8876Eee71E338c82F";
export const GELATO_ADDRESS = "0x59e61b95f20e940ac777e88fa2dfa0a6a4c40fa0";
export const ANYSWAP_ADDRESS = "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454";
export const WFTM_ADDRESS = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";

// API Anyswap
export const FTM_ETH = [
  "LINK",
  "COVER",
  "CRV",
  "FRAX",
  "ICE",
  "BAND",
  "WOOFY",
  "SOUL",
  "YFI",
  "YEL",
  "SNX",
  "METRIC",
];
export const FTM_BNB = ["BNB", "BUSD", "START", "BIFI", "BISON"];
export const FTM_MATIC = ["MATIC", "SAVG"];
export const FTM_AVAX = ["SOUL"];

// API Anyswap Stables
export const GLOBAL_STABLE = ["anyUSDC", "anyDAI", "anyUSDT", "MIM"]; // For Fantom, Binance and Ethereum
export const FTM_ETH_STABLE = [
  ...GLOBAL_STABLE,
  "anyFTM",
  "anyETH",
  "anyWBTC",
];
export const FTM_MATIC_STABLE = [...GLOBAL_STABLE, "anyWBTC", "anyETH"];
export const FTM_AVALANCHE_STABLE = [
  ...GLOBAL_STABLE,
  "anyAVAX",
  "anyETH",
  "anyWBTC",
];
export const FTM_ARBRITRUM_STABLE = ["MIM", "anyUSDC", "anyEURS"];
export const FTM_BSC_STABLE = [
  ...GLOBAL_STABLE,
  "anyETH",
  "anyWBTC",
  "anyFTM",
  "anyAVAX",
];

export const MULTICHAIN_URL = "https://bridgeapi.anyswap.exchange";
export enum MULTICHAIN_METHODS {
  GET_CHAIN_TOKENS = "/v2/serverInfo",
  GET_STABLE_TOKENS = "/v3/serverinfoV3",
  GET_TX_STATUS = "/v2/history/details",
  // ANNOUNCE_TX = "/v2/reswaptxns?hash=0xa63e6e3a86718d710658ef1445c6bd604752086ae68908ffac39a686db6b815g&srcChainID=250&destChainID=137",
}

const isNativeForDestChain = (tokenid: string, destChainId: number) => {
  if (tokenid === "FTM" && destChainId === 250) return true;
  if (tokenid === "AVAX" && destChainId === 43114) return true;
  if (tokenid === "BNB" && destChainId === 56) return true;
  if (tokenid === "MATIC" && destChainId === 137) return true;
  if (tokenid === "ETH" && destChainId === 1) return true;

  return false;
};

const useBridgeApi = () => {
  const { get } = useRestApi(MULTICHAIN_URL);
  const { apiData } = useApiData();

  const isIncluded = (srcChain: string, destChain: string, symbol: string) => {
    const isFTM = srcChain === "250" || destChain === "250";
    const isEth = srcChain === "1" || destChain === "1";
    const isAVAX = srcChain === "43114" || destChain === "43114";
    const isBNB = srcChain === "56" || destChain === "56";
    const isPolygon = srcChain === "137" || destChain === "137";

    if (isFTM && isEth && FTM_ETH.includes(symbol)) return true;
    if (isFTM && isBNB && FTM_BNB.includes(symbol)) return true;
    if (isFTM && isAVAX && FTM_AVAX.includes(symbol)) return true;
    if (isFTM && isPolygon && FTM_MATIC.includes(symbol)) return true;

    return false;
  };

  const getTokensForChain = (chainId: number) => {
    return get({
      path: MULTICHAIN_METHODS.GET_CHAIN_TOKENS,
      params: [chainId.toString()],
    });
  };

  const getStableTokensForChain = (chainId: number) => {
    return get({
      path: MULTICHAIN_METHODS.GET_STABLE_TOKENS,
      queryParams: [
        ["chainId", chainId.toString()],
        ["version", "all"],
      ],
      slug: chainId.toString(),
    });
  };

  // const announceTransaction = (
  //   hash: string,
  //   fromChain: number,
  //   toChain: number
  // ) => {
  //   return get({
  //     path: MULTICHAIN_METHODS.ANNOUNCE_TX,
  //     queryParams: [
  //       ["hash", hash],
  //       ["srcChainID", fromChain],
  //       ["destChainID", toChain],
  //     ],
  //   });
  // };

  const getTransactionStatus = (hash: string) => {
    return get({
      path: MULTICHAIN_METHODS.GET_TX_STATUS,
      queryParams: [["params", hash]],
    });
  };

  const getBridgeTokens = async (toChainId: number, fromChainId: number) => {
    const stablesData =
      apiData[
        `${MULTICHAIN_URL}${MULTICHAIN_METHODS.GET_STABLE_TOKENS}-${fromChainId}`
      ]?.data || (await getStableTokensForChain(fromChainId)).data;

    const bridgeTokenData = {
      tokensTo:
        apiData[
          `${MULTICHAIN_URL}${MULTICHAIN_METHODS.GET_CHAIN_TOKENS}/${toChainId}`
        ]?.data || (await getTokensForChain(toChainId)).data,
      tokensFrom:
        apiData[
          `${MULTICHAIN_URL}${MULTICHAIN_METHODS.GET_CHAIN_TOKENS}/${fromChainId}`
        ]?.data || (await getTokensForChain(fromChainId)).data,
      stableTokens: stablesData
        ? {
            ...stablesData.STABLEV3,
            ...stablesData.NATIVE,
            ...stablesData.UNDERLYINGV2,
          }
        : null,
    };

    let allTokens: arrayBridgeProps[] = [];

    if (bridgeTokenData.stableTokens) {
      const stableTokensArr: stableProps[] = Object.values(
        bridgeTokenData.stableTokens
      );
      const stableArrFilter = stableTokensArr.filter((token) => {
        const { tokenid: tokenId } = token;
        const chainToId = toChainId;
        const chainFromId = fromChainId;

        const isFantom = chainToId === 250 || chainFromId === 250;
        const isEthereum = chainToId === 1 || chainFromId === 1;
        const isBinance = chainToId === 56 || chainFromId === 56;
        const isPolygon = chainToId === 137 || chainFromId === 137;
        const isAvalanche = chainToId === 43114 || chainFromId === 43114;
        const isArbitrum = chainToId === 42161 || chainFromId === 42161;

        if (isFantom && isPolygon) {
          return FTM_MATIC_STABLE.includes(tokenId);
        }
        if (isFantom && isAvalanche) {
          return FTM_AVALANCHE_STABLE.includes(tokenId);
        }
        if (isFantom && isBinance) {
          return FTM_BSC_STABLE.includes(tokenId);
        }
        if (isFantom && isEthereum) {
          return FTM_ETH_STABLE.includes(tokenId);
        }
        if (isFantom && isArbitrum) {
          return FTM_ARBRITRUM_STABLE.includes(tokenId);
        }

        return false;
      });

      const stableFormatedArr = stableArrFilter.map((token) => {
        const {
          logoUrl,
          underlying,
          destChains,
          router,
          routerABI,
          anyToken,
          address,
          version,
        } = token;
        const id = toChainId;
        const isNative =
          version === "NATIVE" &&
          routerABI ===
            "anySwapOutNative(anytoken,toAddress,toChainID,{value: amount})";
        const isNativeTo =
          version === "NATIVE" &&
          isNativeForDestChain(underlying.symbol, toChainId);
        const isUnderlying = (destChains as any)[id]?.underlying;

        return {
          name: underlying ? underlying.name : anyToken.name,
          symbol: underlying
            ? underlying.symbol === "WFTM"
              ? "FTM"
              : underlying.symbol
            : anyToken.symbol,
          symbolTo: isUnderlying ? isUnderlying.symbol : anyToken.symbol,
          logoUrl,
          MaximumSwap: Number((destChains as any)[id]?.MaximumSwap),
          MinimumSwap: Number((destChains as any)[id]?.MinimumSwap),
          MinimumSwapFee: Number((destChains as any)[id]?.MinimumSwapFee),
          MaximumSwapFee: Number((destChains as any)[id]?.MaximumSwapFee),
          SwapFeeRate: Number((destChains as any)[id]?.SwapFeeRatePerMillion),
          BigValueThreshold: Number((destChains as any)[id]?.BigValueThreshold),
          Decimals: underlying ? underlying.decimals : anyToken.decimals,
          ContractAddress: underlying ? underlying.address : address,
          DepositAddress: anyToken.address,
          DepositAddressTo: (destChains as any)[id]?.anyToken.address,
          ContractAddressTo: (destChains as any)[id]?.address,
          DecimalsTo: (destChains as any)[id]?.anyToken.decimals,
          router,
          routerABI,
          type: isNative
            ? "anySwapOutNative(address,address,uint256)"
            : underlying
            ? "anySwapOutUnderlying"
            : "anySwapOut(address,address,uint256,uint256)",
          toChainId: id,
          fromChainId: fromChainId,
          needApprove: isNative ? "false" : "true",
          balance: null,
          isNative: isNative ? "true" : "false",
          isNativeTo: isNativeTo ? "true" : "false",
          version,
        };
      });

      allTokens = [...allTokens, ...stableFormatedArr];
    }

    if (bridgeTokenData.tokensFrom && bridgeTokenData.tokensTo) {
      // Here we convert the object in Array
      const arrTo: bridgeTokensProp[] = Object.values(bridgeTokenData.tokensTo);
      const arrFrom: bridgeTokensProp[] = Object.values(
        bridgeTokenData.tokensFrom
      );

      // Filter the token with the network "from" & "to", then return the allowed arrays
      const arrToFilter = arrTo.filter((token) => {
        const { srcChainID, destChainID, symbol } = token;
        if (
          Number(srcChainID) === fromChainId &&
          Number(destChainID) === toChainId
        ) {
          return isIncluded(srcChainID, destChainID, symbol);
        }
        return false;
      });
      const arrFromFilter = arrFrom.filter((token) => {
        const { srcChainID, destChainID, symbol } = token;
        if (
          Number(srcChainID) === toChainId &&
          Number(destChainID) === fromChainId
        ) {
          return isIncluded(srcChainID, destChainID, symbol);
        }
        return false;
      });

      // Removed the token with same symbol
      const arrToRepeats = arrToFilter.filter((token, index, arr) => {
        return (
          index ===
          arr.findIndex((t) => {
            return t.symbol === token.symbol;
          })
        );
      });
      const arrFromRepeats = arrFromFilter.filter((token, index, arr) => {
        return index === arr.findIndex((t) => t.symbol === token.symbol);
      });

      // Formated the token with a standard data
      const arrToFormatedArr = arrToRepeats.map((token) => {
        const { name, symbol, logoUrl, SrcToken, DestToken } = token;
        const {
          BigValueThreshold,
          Decimals,
          ContractAddress,
          DepositAddress,
          MaximumSwap,
          MinimumSwapFee,
          MaximumSwapFee,
          SwapFeeRate,
          MinimumSwap,
          Symbol,
        } = SrcToken;
        const nativeBNB = fromChainId === 56 && Symbol === "BNB";

        return {
          name,
          symbol,
          symbolTo: DestToken.Symbol,
          logoUrl,
          Decimals,
          ContractAddress,
          DepositAddress,
          BigValueThreshold,
          MaximumSwap,
          MinimumSwap,
          MinimumSwapFee,
          MaximumSwapFee,
          SwapFeeRate,
          type: "transfer",
          toChainId: toChainId,
          fromChainId: fromChainId,
          needApprove: "false",
          router: BRIDGE_ROUTER_ADDRESS,
          DepositAddressTo: "",
          ContractAddressTo: DestToken.ContractAddress,
          DecimalsTo: Decimals,
          balance: null,
          isNative: nativeBNB ? "true" : "false",
          isNativeTo: "false",
        };
      });

      const arrFromFormatedArr = arrFromRepeats.map((token) => {
        const { name, symbol, logoUrl, DestToken, SrcToken } = token;
        const {
          BigValueThreshold,
          Decimals,
          ContractAddress,
          IsDelegateContract,
          DelegateToken,
          MaximumSwap,
          MinimumSwapFee,
          MaximumSwapFee,
          SwapFeeRate,
          MinimumSwap,
        } = DestToken;

        return {
          name,
          symbol,
          symbolTo: DestToken.Symbol,
          logoUrl,
          Decimals,
          ContractAddress: IsDelegateContract ? DelegateToken : ContractAddress,
          DepositAddress: "",
          BigValueThreshold,
          MaximumSwap,
          MinimumSwap,
          MinimumSwapFee,
          MaximumSwapFee,
          SwapFeeRate,
          type: "swapOut",
          toChainId: toChainId,
          fromChainId: fromChainId,
          needApprove: IsDelegateContract ? "true" : "false",
          router: IsDelegateContract ? ContractAddress : BRIDGE_ROUTER_ADDRESS,
          DepositAddressTo: "",
          ContractAddressTo: SrcToken.ContractAddress,
          DecimalsTo: Decimals,
          balance: null,
          isNative: "false",
          isNativeTo: "false",
        };
      });

      allTokens = [...allTokens, ...arrFromFormatedArr, ...arrToFormatedArr];
    }

    return allTokens;
  };

  return {
    // announceTransaction,
    getBridgeTokens,
    getTransactionStatus,
  };
};

export default useBridgeApi;

export interface arrayBridgeProps {
  name: string;
  symbol: string;
  symbolTo: string;
  logoUrl: string;
  Decimals: number;
  DecimalsTo: number;
  ContractAddress: string | undefined;
  ContractAddressTo: string | undefined;
  DepositAddress: string | undefined;
  DepositAddressTo: string | undefined;
  BigValueThreshold: number | undefined;
  MaximumSwap: number | undefined;
  MinimumSwap: number | undefined;
  MinimumSwapFee: number | undefined;
  MaximumSwapFee: number | undefined;
  SwapFeeRate: number | undefined;
  type: string;
  toChainId: number;
  fromChainId: number;
  needApprove: string;
  router: string;
  balance: string | null;
  isNative: string;
  isNativeTo: string;
  version?: string;
}

export interface stableProps {
  address: string;
  anyToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  chainId: string;
  destChains: {
    1: {
      BigValueThreshold: number;
      MaximumSwap: string;
      MaximumSwapFee: string;
      MinimumSwap: string;
      MinimumSwapFee: string;
      SwapFeeRatePerMillion: number;
      address: string;
      underlying: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      anyToken: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      swapfeeon: number;
    };
    56: {
      BigValueThreshold: number;
      MaximumSwap: string;
      MaximumSwapFee: string;
      MinimumSwap: string;
      MinimumSwapFee: string;
      SwapFeeRatePerMillion: number;
      address: string;
      underlying: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      anyToken: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      swapfeeon: number;
    };
    137: {
      BigValueThreshold: number;
      MaximumSwap: string;
      MaximumSwapFee: string;
      MinimumSwap: string;
      MinimumSwapFee: string;
      SwapFeeRatePerMillion: number;
      address: string;
      underlying: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      anyToken: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      swapfeeon: number;
    };
    250: {
      BigValueThreshold: number;
      MaximumSwap: string;
      MaximumSwapFee: string;
      MinimumSwap: string;
      MinimumSwapFee: string;
      SwapFeeRatePerMillion: number;
      address: string;
      underlying: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      anyToken: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      swapfeeon: number;
    };
  };
  logoUrl: string;
  price: number;
  router: string;
  tokenid: string;
  underlying: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  version: string;
  routerABI: string;
}

export interface bridgeTokensProp {
  DestToken: {
    BigValueThreshold: number;
    ContractAddress: string;
    DcrmAddress: string;
    Decimals: number;
    Description: string;
    DisableSwap: boolean;
    ID: string;
    IsDelegateContract: boolean;
    MaximumSwap: number;
    MaximumSwapFee: number;
    MinimumSwap: number;
    MinimumSwapFee: number;
    Name: string;
    PlusGasPricePercentage: number;
    SwapFeeRate: number;
    Symbol: string;
    DelegateToken?: string;
  };
  PairID: string;
  SrcToken: {
    BigValueThreshold: number;
    ContractAddress: string;
    DepositAddress?: string;
    DcrmAddress: string;
    Decimals: number;
    Description: string;
    DisableSwap: boolean;
    ID: string;
    IsDelegateContract: boolean;
    MaximumSwap: number;
    MaximumSwapFee: number;
    MinimumSwap: number;
    MinimumSwapFee: number;
    Name: string;
    PlusGasPricePercentage: number;
    SwapFeeRate: number;
    Symbol: string;
  };
  symbol: string;
  destChainID: string;
  logoUrl: string;
  name: string;
  srcChainID: string;
}