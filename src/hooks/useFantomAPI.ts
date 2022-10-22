import {
    FETCH_ACCOUNT_TRANSACTION_HISTORY,
    FETCH_DELEGATIONS_BY_ADDRESS,
    FETCH_ERC20_ASSETS,
    FETCH_ERC20_TOKEN_LIST,
    FETCH_ERC20_TOKEN_LIST_AND_BALANCE,
    FETCH_FMINT_ACCOUNT_BY_ADDRESS,
    FETCH_GAS_PRICE,
    FETCH_TOKEN_PRICE,
    FETCH_ACCOUNT_BALANCE,
    FETCH_STAKERS,
    FETCH_GOVERNANCE_CONTRACTS,
    FETCH_GOVERNANCE_PROPOSAL,
    FETCH_GOVERNANCE_PROPOSALS,
    FETCH_ESTIMATED_REWARDS,
  } from "features/aggregator/subgraph";
  import { useQuery } from "@apollo/client";
  import { useEffect } from "react";
  import useFantomApiData from "./useFantomAPIData";
import { useActiveWeb3React } from "services/web3";
//   import useWalletProvider from "./useWalletProvider";
  
  export enum FantomApiMethods {
    getAccountBalance = "getAccountBalance",
    getAccountTransactionHistory = "getAccountTransactionHistory",
    getTokenPrice = "getTokenPrice",
    getGasPrice = "getGasPrice",
    getFMintForAccount = "getFMintForAccount",
    getDelegationsForAccount = "getDelegationsForAccount",
    getTokenList = "getTokenList",
    getTokenListForAccount = "getTokenListForAccount",
    getAssetsListForAccount = "getAssetsListForAccount",
    getDelegations = "getDelegations",
    getGovernanceContracts = "getGovernanceContracts",
    getGovernanceProposal = "getGovernanceProposal",
    getGovernanceProposals = "getGovernanceProposals",
    getEstimatedRewards = "getEstimatedRewards",
  }
  const methods: { [key in FantomApiMethods]: any } = {
    [FantomApiMethods.getAccountBalance]: () => FETCH_ACCOUNT_BALANCE,
    [FantomApiMethods.getAccountTransactionHistory]: () =>
      FETCH_ACCOUNT_TRANSACTION_HISTORY,
    [FantomApiMethods.getTokenPrice]: () => FETCH_TOKEN_PRICE,
    [FantomApiMethods.getGasPrice]: () => FETCH_GAS_PRICE,
    [FantomApiMethods.getDelegationsForAccount]: () =>
      FETCH_DELEGATIONS_BY_ADDRESS,
    [FantomApiMethods.getDelegations]: () => FETCH_STAKERS,
    [FantomApiMethods.getFMintForAccount]: () => FETCH_FMINT_ACCOUNT_BY_ADDRESS,
    [FantomApiMethods.getTokenList]: () => FETCH_ERC20_TOKEN_LIST,
    [FantomApiMethods.getTokenListForAccount]: () =>
      FETCH_ERC20_TOKEN_LIST_AND_BALANCE,
    [FantomApiMethods.getAssetsListForAccount]: () => FETCH_ERC20_ASSETS,
    [FantomApiMethods.getGovernanceContracts]: () => FETCH_GOVERNANCE_CONTRACTS,
    [FantomApiMethods.getGovernanceProposals]: (args: any[]) =>
      FETCH_GOVERNANCE_PROPOSALS(...args),
    [FantomApiMethods.getGovernanceProposal]: (args: any[]) =>
      FETCH_GOVERNANCE_PROPOSAL(...args),
    [FantomApiMethods.getEstimatedRewards]: () => FETCH_ESTIMATED_REWARDS,
  };
  
  const useFantomApi = (
    request: FantomApiMethods,
    variables?: any,
    fromAddress?: string,
    pollInterval?: number,
    args?: any[]
  ) => {
    // const { walletContext } = useWalletProvider();
    const { dispatchApiData } = useFantomApiData();
    const { account } = useActiveWeb3React()
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
    //   if (!walletContext.activeWallet.address) 
    {
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
    } [loading, error, data, request, account ]});
        // walletContext.activeWallet.address
  }
  
  export default useFantomApi