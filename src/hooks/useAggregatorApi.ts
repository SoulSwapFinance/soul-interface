// WIP
import useRestApi from "./useRestApi";
import useApiData from "./useApiData";

// export const ROUTER_ADDRESS = "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52";
export const BRIDGE_ROUTER_ADDRESS = "0x1CcCA1cE62c62F7Be95d4A67722a8fDbed6EEcb4";
// export const ZAPPER_ADDRESS = "0xF0ff07d19f310abab54724a8876Eee71E338c82F";
// export const GELATO_ADDRESS = "0x59e61b95f20e940ac777e88fa2dfa0a6a4c40fa0";
// export const ANYSWAP_ADDRESS = "0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454";
// export const WFTM_ADDRESS = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";

// API Aggregator
export const FTM_ETH = [
  "LINK",
  "SOUL",
  "YFI",
];

// API Anyswap Stables
export const GLOBAL_STABLE = ["anyUSDC", "anyDAI", "anyUSDT", "MIM"]; // For Fantom, Binance and Ethereum
export const FTM_ETH_STABLE = [
  ...GLOBAL_STABLE,
  "anyFTM",
  "anyETH",
  "anyWBTC",
];
export const FTM_AVALANCHE_STABLE = [
  ...GLOBAL_STABLE,
  "anyAVAX",
  "anyETH",
  "anyWBTC",
];
export const BASE_URL = "https://bridgeapi.anyswap.exchange";
export enum MULTICHAIN_METHODS {
  GET_CHAIN_TOKENS = "/v4/tokenlistv4",
}

export const isNativeForDestChain = (tokenid: string, destChainId: number) => {
  if (tokenid === "FTM" && destChainId === 250) return true;
  if (tokenid === "AVAX" && destChainId === 43114) return true;
  if (tokenid === "ETH" && destChainId === 1) return true;

  return false;
};

const useAggregatorApi = () => {
  const { get } = useRestApi(BASE_URL);
  const { apiData } = useApiData();

  const getTokensForChain = (chainId: number) => {
    return get({
      path: MULTICHAIN_METHODS.GET_CHAIN_TOKENS,
      params: [chainId.toString()],
    });
  };

  const getBridgeTokens = async (toChainId: number, fromChainId: number) => {
    const bridgeTokenData = {
      tokensTo:
        apiData[
          `${BASE_URL}${MULTICHAIN_METHODS.GET_CHAIN_TOKENS}/${toChainId}`
        ]?.data || (await getTokensForChain(toChainId)).data,
      tokensFrom:
        apiData[
          `${BASE_URL}${MULTICHAIN_METHODS.GET_CHAIN_TOKENS}/${fromChainId}`
        ]?.data
    };

    let allTokens: arrayBridgeProps[] = [];

    if (bridgeTokenData.tokensFrom && bridgeTokenData.tokensTo) {
      // converts: the object in Array[]
      const arrTo: tokenProps[] = Object.values(bridgeTokenData.tokensTo);
      const arrFrom: tokenProps[] = Object.values(
        bridgeTokenData.tokensFrom
      ); return allTokens
      };    

    return allTokens;
  };

  return {
    getBridgeTokens,
  };
};

export default useAggregatorApi;

export interface arrayBridgeProps {
 fromToken;
 toToken;
}

export interface tokenProps {
  symbol: string;
  name: string;
  decimals: string;
  address: string;
  logoURI: string;
}