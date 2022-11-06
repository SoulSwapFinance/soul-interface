import { useCallback, useState } from "react";
import useInterval from "./useInterval";
import { useActiveWeb3React } from "services/web3";
import { isTransactionCostDependentChain } from "soulswap-limit-orders-lib/dist/utils";

export default function useGasPrice(): number | undefined {
  const { chainId, library } = useActiveWeb3React();
  const [gasPrice, setGasPrice] = useState<number>();

  const gasPriceCallback = useCallback(() => {
    library
      ?.getGasPrice()
      .then((gasPrice) => {
        // add 20%
        setGasPrice(gasPrice.mul(120).div(100).toNumber());
      })
      .catch((error) =>
        console.error(`Failed to get gas price for chainId: ${chainId}`, error)
      );
  }, [chainId, library]);

  useInterval(
    gasPriceCallback,
    chainId && isTransactionCostDependentChain(chainId) ? 15000 : 60000
  );

  return gasPrice;
}
