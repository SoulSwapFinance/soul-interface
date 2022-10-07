
import { useEffect, useState } from "react";
import { bridgeNetworks } from "../utils/bridge";
import config from "config/configurations";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useActiveWeb3React } from "services/web3";
// import useWalletProvider from "./useWalletProvider";
// import { Wallet } from "@ethersproject/wallet";

const SUPPORTED_CHAINS = [250, 1, 56, 137, 43114, 42161];
const DEFAULT_PROVIDERS = {
  // 1: getDefaultProvider(),
  1: new JsonRpcProvider("https://rpc.ankr.com/eth"),
  56: new JsonRpcProvider(bridgeNetworks[56].rpc),
  137: new JsonRpcProvider(bridgeNetworks[137].rpc),
  250: new JsonRpcProvider(bridgeNetworks[250].rpc),
  43114: new JsonRpcProvider(bridgeNetworks[43114].rpc),
  42161: new JsonRpcProvider(bridgeNetworks[42161].rpc),
  // 4002: new JsonRpcProvider(config.rpc),
} as any;

const useMultiChain = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const provider = library.provider
  // const signer = library.getSigner()
  const [toChain, setToChain] = useState(null);

  const swapToChain = (chainId: number) => {
    if (provider === "browser") {
      // switchToChain(account, chainId);
      // switchToChain(walletContext.activeWallet.provider, chainId);
    }
  };

  useEffect(() => {
    if (!toChain) return;
    if (!SUPPORTED_CHAINS.includes(toChain)) return;
    if (chainId === toChain) return;
    swapToChain(toChain);

    return () => swapToChain(parseInt(config.chainId));
  }, [toChain, account]);

  return {
    setToChain,
    forceSwap: (chainId: number) => swapToChain(chainId),
    DEFAULT_PROVIDERS,
  };
};

export default useMultiChain;