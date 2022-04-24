import { loadContract } from "../utils/wallet";
import useWalletProvider from "./useWalletProvider";
import { arrayBridgeProps } from "./useBridgeApi";
import { send } from "../utils/transactions";
import useTransaction from "./useTransaction";
import useFantomNative from "./useFantomNative";
import BridgeABI from 'constants/abis/bridge/bridge.json'
import RouterABI from 'constants/abis/bridge/bridgeRouter.json'

const useBridge = () => {
  const { walletContext } = useWalletProvider();
  const { dispatchTx } = useTransaction();
  const { sendNativeTokens } = useFantomNative();

  const getBridgeContract = async (type: string, contractAddress: string) => {
    if (type === "stable") {
      return loadContract(
        contractAddress,
        RouterABI,
        walletContext.activeWallet.signer
      );
    }

    return loadContract(
      contractAddress,
      BridgeABI,
      walletContext.activeWallet.signer
    );
  };

  const executeBridgeTransaction = async (callback: any) => {
    return send(
      walletContext.activeWallet.provider,
      () => callback(),
      dispatchTx
    );
  };

  const bridgeMethod = async (token: arrayBridgeProps, amount: string) => {
    const { ContractAddress, type, DepositAddress } = token;
    const bridgeContract = await getBridgeContract("default", ContractAddress);

    let bridgeMethod = null;
    if (type === "swapOut") {
      console.info("[bridgeMethod] SwapOut");
      bridgeMethod = () =>
        bridgeContract.Swapout(amount, walletContext.activeWallet.address);
    }
    if (type === "transfer") {
      console.info("[bridgeMethod] transfer");
      bridgeMethod = () => bridgeContract.transfer(DepositAddress, amount);
    }

    if (!bridgeMethod) {
      console.warn("[bridgeMethod] unable to build valid bridge method");
      return;
    }

    return executeBridgeTransaction(bridgeMethod);
  };

  const bridgeNativeMethod = async (
    token: arrayBridgeProps,
    amount: string
  ) => {
    console.info("[bridgeNativeMethod]");
    const { DepositAddress } = token;

    return executeBridgeTransaction(() =>
      sendNativeTokens(DepositAddress, amount)
    );
  };

  const bridgeStableMethod = async (
    token: arrayBridgeProps,
    amount: string
  ) => {
    const { router, type, DepositAddress, toChainId } = token;
    const routerContract = await getBridgeContract("stable", router);

    let bridgeMethod = null;
    if (type === "anySwapOutNative(address,address,uint256)") {
      console.info("[bridgeStableMethod] anySwapOutNative");
      bridgeMethod = () =>
        routerContract.anySwapOutNative(
          DepositAddress,
          walletContext.activeWallet.address,
          toChainId,
          { value: amount }
        );
    }
    if (type === "anySwapOut(address,address,uint256,uint256)") {
      console.info("[bridgeStableMethod] anySwapOut");
      bridgeMethod = () =>
        routerContract["anySwapOut(address,address,uint256,uint256)"](
          DepositAddress,
          walletContext.activeWallet.address,
          amount,
          toChainId
        );
    }
    if (type === "anySwapOutUnderlying") {
      console.info("[bridgeStableMethod] anySwapOutUnderlying");
      bridgeMethod = () =>
        routerContract.anySwapOutUnderlying(
          DepositAddress,
          walletContext.activeWallet.address,
          amount,
          toChainId
        );
    }

    if (!bridgeMethod) {
      console.warn("[bridgeStableMethod] unable to build valid bridge method");
      return;
    }

    return executeBridgeTransaction(bridgeMethod);
  };

  return {
    bridgeStableMethod,
    bridgeNativeMethod,
    bridgeMethod,
  };
};

export default useBridge;