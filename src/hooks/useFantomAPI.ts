import { useQuery } from "@apollo/client";
import { FETCH_ACCOUNT_BALANCE, FETCH_ACCOUNT_TRANSACTION_HISTORY, FETCH_ERC20_ASSETS, FETCH_ERC20_TOKEN_LIST, FETCH_ERC20_TOKEN_LIST_AND_BALANCE, FETCH_GAS_PRICE, FETCH_TOKEN_PRICE } from "features/aggregator/subgraph";
import { useEffect } from "react";
import { useActiveWeb3React } from "services/web3";
import useFantomApiData from "./useFantomAPIData";
// import useWalletProvider from "./useWalletProvider";

export enum FantomApiMethods {
  getAccountBalance = "getAccountBalance",
  getAccountTransactionHistory = "getAccountTransactionHistory",
  getTokenPrice = "getTokenPrice",
  getGasPrice = "getGasPrice",
  getTokenList = "getTokenList",
  getTokenListForAccount = "getTokenListForAccount",
  getAssetsListForAccount = "getAssetsListForAccount",
}

const methods: { [key in FantomApiMethods]: any } = {
  [FantomApiMethods.getAccountBalance]: () => FETCH_ACCOUNT_BALANCE,
  [FantomApiMethods.getAccountTransactionHistory]: () =>
    FETCH_ACCOUNT_TRANSACTION_HISTORY,
  [FantomApiMethods.getTokenPrice]: () => FETCH_TOKEN_PRICE,
  [FantomApiMethods.getGasPrice]: () => FETCH_GAS_PRICE,
  [FantomApiMethods.getTokenList]: () => FETCH_ERC20_TOKEN_LIST,
  [FantomApiMethods.getTokenListForAccount]: () =>
    FETCH_ERC20_TOKEN_LIST_AND_BALANCE,
  [FantomApiMethods.getAssetsListForAccount]: () => FETCH_ERC20_ASSETS,
};

const useFantomApi = (
  request: FantomApiMethods,
  variables?: any,
  fromAddress?: string,
  pollInterval?: number,
  args?: any[]
) => {
  // const { walletContext } = useWalletProvider();
  const { account } = useActiveWeb3React()
  const { dispatchApiData } = useFantomApiData();

  const createOptions = () => {
    if (!variables && !pollInterval) return null;

    //TODO polling is not working.. useQuery known bug.
    const options = {} as any;
    if (variables) options.variables = variables;
    if (pollInterval) {
      options.pollInterval = pollInterval;
      options.fetchPolicy = "network-only";
    }
    return options;
  };

  const { loading, error, data, refetch } = useQuery(
    args ? methods[request](args) : methods[request](),
    createOptions()
  );

  useEffect(() => {
    if (!account) {
      return;
    }

    if (request && data) {
      dispatchApiData({
        type: "success",
        address: fromAddress,
        method: request,
        refetch,
        data,
      });
    }
    if (request && error) {
      dispatchApiData({
        type: "error",
        address: fromAddress,
        method: request,
        refetch,
        error,
      });
    }
    if (request && loading) {
      dispatchApiData({
        type: "loading",
        address: fromAddress,
        method: request,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data, request, account]);
};

export default useFantomApi;