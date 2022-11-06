import { useMemo } from "react";
import { ChainId, GelatoLimitOrders } from "soulswap-limit-orders-lib";
import { useActiveWeb3React } from "services/web3";

export default function useGelatoLimitOrdersLib():
  | GelatoLimitOrders
  | undefined {
  const { chainId, library } = useActiveWeb3React();

  return useMemo(() => {
    try {
      return chainId && library
        ? new GelatoLimitOrders(chainId as ChainId, library?.getSigner())
        : undefined;
    } catch (error: any) {
      console.error(`Could not instantiate LimitOrders: ${error.message}`);
      return undefined;
    }
  }, [chainId, library]);
}
