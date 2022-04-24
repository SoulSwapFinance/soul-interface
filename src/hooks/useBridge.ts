import { loadContract } from "utils/wallet";
import { arrayBridgeProps } from "./useBridgeApi";
// import { send } from "utils/transactions";
// import useTransaction from "./useTransaction";
// import useFantomNative from "./useFantomNative";
import BridgeABI from 'constants/abis/bridge/bridge.json'
import RouterABI from 'constants/abis/bridge/bridgeRouter.json'
import { useActiveWeb3React } from "services/web3";
import { getProviderOrSigner } from "sdk";

const useBridge = () => {
  const { account, chainId, library} = useActiveWeb3React()
  // const { dispatchTx } = useTransaction();
  // const { sendNativeTokens } = useFantomNative();

  const getBridgeContract = async (type: string, contractAddress: string) => {
    if (type === "stable") {
      return loadContract(
        contractAddress,
        RouterABI,
        library?.getSigner()
      );
    }

    return loadContract(
      contractAddress,
      BridgeABI,
      library?.getSigner()
      );
  };

  // todo: FIX
  const executeBridgeTransaction = async (callback: any) => {
    // return send(
      // getProviderOrSigner(library),
      // () => callback(),
      // dispatchTx
    // );
  };

  const bridgeMethod = async (token: arrayBridgeProps, amount: string) => {
    const { ContractAddress, type, DepositAddress } = token;
    const bridgeContract = await getBridgeContract("default", ContractAddress);

    let bridgeMethod = null;
    if (type === "swapOut") {
      console.info("[bridgeMethod] SwapOut");
      bridgeMethod = () =>
        bridgeContract.Swapout(amount, account);
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

    // TODO: FIX
    return
    // return executeBridgeTransaction(() =>
      // sendNativeTokens(DepositAddress, amount)
    // );
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
          account,
          toChainId,
          { value: amount }
        );
    }
    if (type === "anySwapOut(address,address,uint256,uint256)") {
      console.info("[bridgeStableMethod] anySwapOut");
      bridgeMethod = () =>
        routerContract["anySwapOut(address,address,uint256,uint256)"](
          DepositAddress,
          account,
          amount,
          toChainId
        );
    }
    if (type === "anySwapOutUnderlying") {
      console.info("[bridgeStableMethod] anySwapOutUnderlying");
      bridgeMethod = () =>
        routerContract.anySwapOutUnderlying(
          DepositAddress,
          account,
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