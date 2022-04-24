import useWalletProvider from "./useWalletProvider";
import useTransaction from "./useTransaction";
import { send } from "utils/transactions";
import { BigNumber } from "@ethersproject/bignumber";

const useFantomNative = () => {
  const { walletContext } = useWalletProvider();
  const { dispatchTx } = useTransaction();

  const sendNativeTokens = async (toAddress: string, amount: string) => {
    if (!walletContext.activeWallet.signer) {
      console.error("[sendTransation] signer not found");
      return;
    }
    if (parseFloat(amount) <= 0) {
      console.error("[sendTransation] amount <= 0");
      return;
    }

    return send(
      walletContext.activeWallet.provider,
      () =>
        walletContext.activeWallet.signer.sendTransaction({
          to: toAddress,
          value: amount,
        }),
      dispatchTx
    );
  };

  const sendTx = (
    to: string,
    gasLimit: number,
    gasPrice: number,
    data: any,
    value: string = null
  ) => {
    if (!walletContext.activeWallet.signer) {
      console.error("[sendTransation] signer not found");
      return;
    }

    const tx: any = {
      to,
      gasLimit,
      gasPrice,
      data,
      from: walletContext.activeWallet.address,
    };

    if (value) {
      tx.value = BigNumber.from(value);
    }

    return send(
      walletContext.activeWallet.provider,
      () =>
        walletContext.activeWallet.signer.sendTransaction({
          ...tx,
        }),
      dispatchTx
    );
  };

  const getBalance = (address?: string) => {
    if (!walletContext.activeWallet.provider) {
      console.error("[getBalance] provider not found");
      return;
    }
    return walletContext.activeWallet.provider.getBalance(
      address || walletContext.activeWallet.address
    );
  };

  return {
    sendNativeTokens: async (toAddress: string, amount: string) =>
      await sendNativeTokens(toAddress, amount),
    sendTx,
    getBalance,
  };
};

export default useFantomNative;