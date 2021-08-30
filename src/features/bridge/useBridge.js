// import { useActiveWeb3React } from './useActiveWeb3React'
import { ChainId } from '@soulswap/sdk'
import { useAnyswapEthOperaBridge } from '../../hooks/useContract'
import { useCallback } from 'react'

function useBridge() {
  const ethToFtm = useAnyswapEthOperaBridge()
  
  const swapOut = useCallback(async (amount) => {
    if (ChainId.MAINNET) {
      try {
        const result = await ethToFtm?.Swapout(amount)
        return result
      } catch (err) {
        console.log(err)
        return err
      }
    } else {
      console.warn('not connected to ETHEREUM MAINNET (ChainId: 1)')
      alert('not connected to ETHEREUM MAINNET (ChainId: 1)')
    }
  })

  return {
    swapOut,
  }
}

export default useBridge
