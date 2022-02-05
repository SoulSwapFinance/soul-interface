// import { useActiveWeb3React } from './useActiveWeb3React'
import { ChainId } from '../../sdk'
import { useAnyswapEthOperaBridge } from '../../hooks/useContract'
import { useCallback } from 'react'

function useBridge() {
  const ethToFtm = useAnyswapEthOperaBridge()
  
  const swapOut = useCallback(async (amount, to) => {
    if (ChainId.ETHEREUM) {
      try {
        const result = await ethToFtm?.Swapout(amount, to)
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
