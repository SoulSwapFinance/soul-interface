import {
  ChainId,
  // MULTICALL_ADDRESS,
  FACTORY_ADDRESS,

  SOUL_ADDRESS,
  SOUL_SUMMONER_ADDRESS,
  AUTO_STAKE_ADDRESS,
  SOUL_GUIDE_ADDRESS,
  WNATIVE,
} from 'sdk'

import { Contract } from '@ethersproject/contracts'
import ERC20_ABI from 'constants/abis/erc20.json'
import ERC20_BYTES32_ABI from 'constants/abis/erc20_bytes32.json'
import PAIR_ABI from 'constants/abis/pair.json'
import MULTICALL_ABI from 'constants/abis/multicall.json'
import FACTORY_ABI from 'constants/abis/factory.json'

// soul
import SOUL_GUIDE_ABI from 'constants/abis/multicall.json'
import SOUL_SUMMONER_ABI from 'constants/abis/soulswap/soulsummoner.json' 
import SOUL_BOND_ABI from 'features/bond/constants/abis/soulbond.json' 
import PRICE_HELPER_ABI from 'features/bond/constants/abis/pricehelper.json' 
import SOUL_ABI from 'constants/abis/soulswap/soulpower.json' 

// import PENDING_ABI from 'constants/abis/pending.json'
// import ROUTER_ABI from 'constants/abis/router.json'
// import TIMELOCK_ABI from 'constants/abis/timelock.json'
import WETH9_ABI from 'constants/abis/weth.json'

import { getContract } from 'functions/contract'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'services/web3'
import { MULTICALL_ADDRESS, PRICE_HELPER_ADDRESS, SOUL_BOND_ADDRESS } from 'features/bond/constants'

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

export function useSoulGuideContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_GUIDE_ADDRESS[chainId], SOUL_GUIDE_ABI, false)
}

// export function usePendingContract(): Contract | null {
//   return useContract('0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029', PENDING_ABI, false)
// }

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_ADDRESS[chainId], MULTICALL_ABI, false)
}

export function useSoulContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_ADDRESS[chainId], SOUL_ABI, withSignerIfPossible)
}

export function useSoulBondContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_BOND_ADDRESS[chainId], SOUL_BOND_ABI, withSignerIfPossible)
}

export function useSoulSummonerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SUMMONER_ADDRESS[chainId], SOUL_SUMMONER_ABI, withSignerIfPossible)
}

export function usePriceHelperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PRICE_HELPER_ADDRESS[chainId], PRICE_HELPER_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

// export function useRouterContract(useArcher = false, withSignerIfPossible?: boolean): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   const address = ROUTER_ADDRESS[chainId]
//   const abi = ROUTER_ABI
//   return useContract(address, abi, withSignerIfPossible)
// }

// export function useTimelockContract(): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
// }
