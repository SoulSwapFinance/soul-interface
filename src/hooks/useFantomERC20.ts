import { MaxUint256 } from "@ethersproject/constants";
import { send } from "utils/transactions";
import { loadERC20Contract } from "utils/wallet";
import { useActiveWeb3React } from "services/web3";
import { getSigner } from "sdk";
import { useAppDispatch } from "state/hooks";
import { useUserTokenInfo } from "./useAPI";
import { BigNumber } from "@ethersproject/bignumber";

const useFantomERC20 = () => {
  const dispatch = useAppDispatch()
  const { account, chainId, library } = useActiveWeb3React()
  // const tokenBalance = useUserTokenInfo(account, tokenAddress).userTokenInfo.balance
  // const tokenDecimals = useUserTokenInfo(account, tokenAddress).userTokenInfo.decimals
  const provider = library.provider
  const signer = library.getSigner()

  const approve = async (
    contractAddress: string,
    approveAddress: string,
    amount?: string
  ) => {
    if (!account) {
      console.error("[sendTransation] signer not found");
      return;
    }
    if (parseFloat(amount) <= 0) {
      console.error("[sendTransation] amount <= 0");
      return;
    }

    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return send(
      provider,
      () => contract.approve(approveAddress, amount || MaxUint256),
      dispatch
    );
  };

  const allowance = async (
    contractAddress: string,
    approvedAddress: string
  ) => {
    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return contract.allowance(
      account,
      approvedAddress
    );
  };

  const sendTokens = async (
    contractAddress: string,
    toAddress: string,
    amount: string
  ) => {
    if (!getSigner(library, account)) {
      console.error("[sendTransation] signer not found");
      return;
    }
    if (parseFloat(amount) <= 0) {
      console.error("[sendTransation] amount <= 0");
      return;
    }

    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return send(
      provider,
      () => contract.transfer(toAddress, amount),
      dispatch
    );
  };

  const getDecimals = async (contractAddress: string) => {
    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return contract.decimals();
  };

  const estimateGas = async (
    contractAddress: string,
    method: string,
    args: string[]
  ) => {
    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return contract.estimateGas[method](...args);
  };

  const getTokenBalance = async (contractAddress: string) => {
    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return contract.balanceOf(account);
  };

  return {
    approve: async (
      contractAddress: string,
      approveAddress: string,
      amount?: string
    ) => await approve(contractAddress, approveAddress, amount),
    getAllowance: async (contractAddress: string, approveAddress: string) =>
      await allowance(contractAddress, approveAddress),
    sendTokens: async (
      contractAddress: string,
      toAddress: string,
      amount: string
    ) => await sendTokens(contractAddress, toAddress, amount),
    estimateGas: async (
      contractAddress: string,
      method: string,
      args: string[]
    ) => {
      return estimateGas(contractAddress, method, args);
    },
    getTokenBalance,
    getDecimals,
  };
};

export default useFantomERC20;