import { Contract } from "@ethersproject/contracts"
import { ERC20_ABI } from "constants/abis/erc20"
import { getContract } from "functions/contract"
import { useActiveWeb3React } from "hooks"
import { useMemo } from "react"
import { WNATIVE } from "sdk"
import ERC20_BYTES32_ABI from 'constants/abis/erc20_bytes32.json'
import PAIR_ABI from '../constants/abis/pair.json'
import WETH9_ABI from '../constants/abis/weth.json'


// returns null on errors
export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
    const { library, account } = useActiveWeb3React()
  
    return useMemo(() => {
      if (!address || !ABI || !library) return null
      try {
        return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    }, [address, ABI, library, withSignerIfPossible, account])
  }
  
  export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
  }
  
  export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId ? WNATIVE[chainId].address : undefined, WETH9_ABI, withSignerIfPossible)
  }
  
  export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
  }
  
  export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(pairAddress, PAIR_ABI, withSignerIfPossible)
  }
  