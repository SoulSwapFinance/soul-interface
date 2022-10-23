// import useTransaction from "./useTransaction";
import { send } from "utils/transactions";
import { BigNumber } from "@ethersproject/bignumber";
import { useActiveWeb3React } from "services/web3";
import { getSigner } from "sdk";
import { useAppDispatch } from "state/hooks";

const useFantomNative = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const sendNativeTokens = async (toAddress: string, amount: string) => {
    if (!account) {
      console.error("[sendTransation] signer not found");
      return;
    }
    if (parseFloat(amount) <= 0) {
      console.error("[sendTransation] amount <= 0");
      return;
    }

    return send(
      library?.provider,
      () =>
        getSigner(library, account).sendTransaction({
          to: toAddress,
          value: amount,
        }),
      dispatch
    );
  };

  const sendTx = (
    to: string,
    gasLimit: number,
    gasPrice: number,
    data: any,
    value: string = null
  ) => {
    if (!getSigner(library, account)) {
      console.error("[sendTransation] signer not found");
      return;
    }

    const tx: any = {
      to,
      gasLimit,
      gasPrice,
      data,
      from: account,
    };

    if (value) {
      tx.value = BigNumber.from(value);
    }

    return send(
      library?.provider,
      () =>
        getSigner(library, account).sendTransaction({
          ...tx,
        }),
      dispatch
    );
  };

  const getBalance = (address?: string) => {
    if (!library?.provider) {
      console.error("[getBalance] provider not found");
      return;
    }
    return getBalance(
      address || account
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