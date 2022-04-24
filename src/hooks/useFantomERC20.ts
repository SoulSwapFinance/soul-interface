import { MaxUint256 } from "@ethersproject/constants";
import useWalletProvider from "./useWalletProvider";
import useTransaction from "./useTransaction";
import { send } from "utils/transactions";
import { loadERC20Contract } from "utils/wallet";

const useFantomERC20 = () => {
  const { walletContext } = useWalletProvider();
  const { dispatchTx } = useTransaction();

  const approve = async (
    contractAddress: string,
    approveAddress: string,
    amount?: string
  ) => {
    if (!walletContext.activeWallet.signer) {
      console.error("[sendTransation] signer not found");
      return;
    }
    if (parseFloat(amount) <= 0) {
      console.error("[sendTransation] amount <= 0");
      return;
    }

    const contract = await loadERC20Contract(
      contractAddress,
      walletContext.activeWallet.signer
    );

    return send(
      walletContext.activeWallet.provider,
      () => contract.approve(approveAddress, amount || MaxUint256),
      dispatchTx
    );
  };

  const allowance = async (
    contractAddress: string,
    approvedAddress: string
  ) => {
    const contract = await loadERC20Contract(
      contractAddress,
      walletContext.activeWallet.signer
    );

    return contract.allowance(
      walletContext.activeWallet.address,
      approvedAddress
    );
  };

  const sendTokens = async (
    contractAddress: string,
    toAddress: string,
    amount: string
  ) => {
    if (!walletContext.activeWallet.signer) {
      console.error("[sendTransation] signer not found");
      return;
    }
    if (parseFloat(amount) <= 0) {
      console.error("[sendTransation] amount <= 0");
      return;
    }

    const contract = await loadERC20Contract(
      contractAddress,
      walletContext.activeWallet.signer
    );

    return send(
      walletContext.activeWallet.provider,
      () => contract.transfer(toAddress, amount),
      dispatchTx
    );
  };

  const getDecimals = async (contractAddress: string) => {
    const contract = await loadERC20Contract(
      contractAddress,
      walletContext.activeWallet.provider
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
      walletContext.activeWallet.signer
    );

    return contract.estimateGas[method](...args);
  };

  const getTokenBalance = async (contractAddress: string) => {
    const contract = await loadERC20Contract(
      contractAddress,
      walletContext.activeWallet.signer
    );

    return contract.balanceOf(walletContext.activeWallet.address);
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