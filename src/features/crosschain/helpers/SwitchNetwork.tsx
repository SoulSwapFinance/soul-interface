import { useActiveWeb3React } from "services/web3";
import { Chain } from "./Chains";

const switchRequest = (chainId: number = 0xfa) => {
    const { library } = useActiveWeb3React()
    // await library?.send('wallet_switchEthereumChain',[{ chainId: networkDetails.chainId }])
    
    return library?.send( "wallet_switchEthereumChain",[{ chainId: chainId }])
    // method: "wallet_switchEthereumChain",
    // params: [{ chainId: "0x" + chainId.toString(16) }],
    //   });
};

const addChainRequest = (chain: Chain) => {
    const { library } = useActiveWeb3React()
    const nativeToken = chain.tokens.find(t => t.isNative);
        if (!nativeToken) {
            throw new Error("chain must have a native token");
        }
//   return ethereum.request({
  return library.send("wallet_addEthereumChain", [
      {
        chainId: "0x" + chain.chainId.toString(16),
        chainName: chain.longName,
        rpcUrls: chain.rpc,
        blockExplorerUrls: chain.explorers,
        nativeCurrency: {
          name: nativeToken.name,
          symbol: nativeToken.symbol.toUpperCase(),
          decimals: nativeToken.decimals ?? 18,
        },
      },
    ],
  );
};

export const switchNetwork = async (chain: Chain) => {
  if (window.ethereum) {
    try {
      await switchRequest(chain.chainId);
    } catch (error) {
      console.warn("Failed to switch chains:", error);

      /** @ts-ignore */
      if (error.code === 4902) {
        try {
          await addChainRequest(chain);
          await switchRequest(chain.chainId);
        } catch (addError) {
          console.warn("Failed to add a new chain:", error);
        }
      }
    }
  }
};