import { ethers, BigNumber } from "ethers";

import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@soulswap/sdk'
import { useAnyswapEthOperaBridge } from "../../hooks/useContract";

const useBridge = () => {
  const swapOut = async (amount, account) => {
    const ethToFtm = await useAnyswapEthOperaBridge();

    if (ChainId.MAINNET) {
      try {
        const result = await ethToFtm?.connect(account).Swapout(amount, account);
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
