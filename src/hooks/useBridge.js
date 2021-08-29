import { ethers, BigNumber } from "ethers";

import { useActiveWeb3React } from './useActiveWeb3React'
import { ChainId } from '@soulswap/sdk'
import { useAnyswapEthOperaBridge } from "./useContract";

const useBridge = () => {
  const { account } = useActiveWeb3React()

  const swapOut = async (amount) => {
    const ethToFtm = await useAnyswapEthOperaBridge();

    if (ChainId.MAINNET) {
      try {
        const result = await ethToFtm?.Swapout(amount);
        return result;
      } catch (err) {
        console.log(err);
        return err;
      }
    } else {
      console.warn('not connected to ETHEREUM MAINNET (ChainId: 1)')
      alert('not connected to ETHEREUM MAINNET (ChainId: 1)')
    }
  };

  return {
    swapOut,
  };
};

export default useBridge;
