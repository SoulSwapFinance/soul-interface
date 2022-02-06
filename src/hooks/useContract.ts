import {
  ARCHER_ROUTER_ADDRESS,
  MULTICALL2_ADDRESS,
  TRIDENT,
  ZAPPER_ADDRESS,
  ETH_USD_PAIR,
  SOUL_SEANCE_PAIR,
  SOUL_FTM_PAIR,
  SEANCE_USDC_PAIR,
  FTM_USDC_PAIR,
  SCARAB_ADDRESS,
  SAFE_ADDRESS,
  ATOMIC_SWAP_ADDRESS,
  LOCKER_ADDRESS,
  SOUL_USDC_PAIR,
  LUX_ADDRESS,
  WLUM_ADDRESS,
  STOP_LIMIT_ORDER_ADDRESS,
} from '../constants/addresses'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_ETHEREUM_ADDRESS,
} from '../constants/abis/argent-wallet-detector'
import {
  ChainId,
  REAPER_ADDRESS,
  FACTORY_ADDRESS,
  BORING_HELPER_ADDRESS,
  ENCHANT_ADDRESS,
  ENCHANT_HELPER_ADDRESS,
  ROUTER_ADDRESS,
  SOUL_ADDRESS,
  SEANCE_ADDRESS,
  SOUL_SUMMONER_ADDRESS,
  SOUL_VAULT_ADDRESS,
  SOUL_GUIDE_ADDRESS,
  PRICE_HELPER_ADDRESS,
  HARVEST_HELPER_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE,
} from 'sdk'
import {
  COFFIN_BOX_ADDRESS,
  CHAINLINK_ORACLE_ADDRESS,
  UNDERWORLD_ADDRESS,
  SOULSWAP_TWAP_0_ORACLE_ADDRESS,
  SOULSWAP_TWAP_1_ORACLE_ADDRESS,
  SOULSWAP_SWAPPER_ADDRESS,
} from '../constants/underworld'
import { MERKLE_DISTRIBUTOR_ADDRESS } from '../constants'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import ALCX_REWARDER_ABI from '../constants/abis/alcx-rewarder.json'
import CLONE_REWARDER_ABI from '../constants/abis/clone-rewarder.json'
import ARCHER_ROUTER_ABI from '../constants/abis/archer-router.json'
import BASE_SWAPPER_ABI from '../constants/abis/swapper.json'
import ANYSWAP_ERC20_ABI from '../constants/abis/anyswap_erc20.json'
import COFFINBOX_ABI from '../constants/abis/coffinbox.json'
import CHAINLINK_ORACLE_ABI from '../constants/abis/chainlink-oracle.json'
import COMPLEX_REWARDER_ABI from '../constants/abis/complex-rewarder.json'
import { Contract } from '@ethersproject/contracts'
import DASHBOARD_ABI from '../constants/abis/dashboard.json'
import EIP_2612_ABI from '../constants/abis/eip-2612.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ERC20_ABI from '../constants/abis/erc20.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import FACTORY_ABI from '../constants/abis/factory.json'
// import IUniswapV2PairABI from '../constants/abis/uniswap-v2-pair.json'
import ISoulSwapPairABI from '../constants/abis/soulswap/ISoulSwapPair.json'
import UNDERWORLD_ABI from '../constants/abis/underworldpair.json'
import MAKER_ABI from '../constants/abis/maker.json'

// soul
import SOUL_SCARAB_ABI from '../constants/abis/soulswap/scarab.json'
import SOUL_SAFE_ABI from '../constants/abis/soulswap/safe.json'
import SOUL_GUIDE_ABI from '../constants/abis/soul-guide.json' // TODO: update abi
import SOUL_SUMMONER_ABI from '../constants/abis/soulswap/soulsummoner.json' // 28 JUL
import SOULVAULT_ABI from '../constants/abis/soulswap/soulvault.json' // 31 JUL
import LUXOR_ABI from '../constants/abis/soulswap/luxor.json'
import WLUM_ABI from '../constants/abis/soulswap/wlumens.json'
import ENCHANT_ABI from '../constants/abis/soulswap/enchant.json' // 30 OCT
import ENCHANT_HELPER_ABI from '../constants/abis/soulswap/enchant-helper.json' // 30 OCT
import SOUL_ABI from '../constants/abis/soulswap/soulpower.json' // 28 JUL
import SEANCE_ABI from '../constants/abis/soulswap/seance.json' // 28 JUL
import ATOMIC_SWAP_ABI from '../constants/abis/soulswap/atomic-swap.json'
import LAUNCHPAD_ABI from '../constants/abis/soulswap/launchpad.json'
import SUMMONER_HELPER_ABI from '../constants/abis/soulswap/helper.json'
import PRICE_HELPER_ABI from '../constants/abis/soulswap/pricehelper.json'
import BORING_HELPER_ABI from '../constants/abis/soulswap/boring-helper.json'
import HARVEST_HELPER_ABI from '../constants/abis/soulswap/harvest-helper.json'
import COFFIN_BOX_ABI from '../constants/abis/soulswap/coffinbox.json'

// bridge
import anyswapEthOperaBridge_ABI from '../constants/abis/soulswap/bridge/anyswapEthOperaBridge.json'
import ROUTER_ACTION_ABI from '../constants/abis/soulswap/bridge/router-action.json'

// unused
import MEOWSHI_ABI from '../constants/abis/meowshi.json'
import MERKLE_DISTRIBUTOR_ABI from '../constants/abis/merkle-distributor.json'
import MULTICALL2_ABI from '../constants/abis/multicall2.json'
import PENDING_ABI from '../constants/abis/pending.json'
import ROUTER_ABI from '../constants/abis/router.json'
import SAAVE_ABI from '../constants/abis/saave.json'
import SUSHIROLL_ABI from '@sushiswap/core/abi/SushiRoll.json'
// import SOULSWAP_MULTISWAPPER_ABI from '../constants/abis/sushiswapmultiswapper.json'
import SOULSWAP_TWAP_ORACLE_ABI from '../constants/abis/sushiswap-slp-oracle.json'
import TIMELOCK_ABI from '../constants/abis/timelock.json'

import LOCKER_ABI from '../constants/abis/locker.json'

import WETH9_ABI from '../constants/abis/weth.json'
import ZAPPER_ABI from '../constants/abis/zapper.json'
import LIMIT_ORDER_ABI from '../constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from '../constants/abis/limit-order-helper.json'

import { getContract } from '../functions/contract'
import { useActiveWeb3React } from 'services/web3'
import { useMemo } from 'react'
import { getVerifyingContract } from 'limitorderv2-sdk'

const UNI_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

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

export function useAnyswapTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ANYSWAP_ERC20_ABI, withSignerIfPossible)
}

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WNATIVE[chainId].address : undefined, WETH9_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.ETHEREUM ? ARGENT_WALLET_DETECTOR_ETHEREUM_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.ETHEREUM:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useBridgeContract(routerToken?:any, withSignerIfPossible?: boolean): Contract | null {
  return useContract(routerToken ? routerToken : undefined, ROUTER_ACTION_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, ISoulSwapPairABI, withSignerIfPossible)
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useSoulGuideContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_GUIDE_ADDRESS[chainId], SOUL_GUIDE_ABI, false)
}

export function usePendingContract(): Contract | null {
  return useContract('0x9aeadfE6cd03A2b5730474bF6dd79802d5bCD029', PENDING_ABI, false)
}

export function usePriceHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PRICE_HELPER_ADDRESS[chainId], PRICE_HELPER_ABI, false)
}

export function useHarvestHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && HARVEST_HELPER_ADDRESS[chainId], HARVEST_HELPER_ABI, false)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useMulticall2Contract() {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL2_ADDRESS[chainId], MULTICALL2_ABI, false)
}

export function useSoulContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_ADDRESS[chainId], SOUL_ABI, withSignerIfPossible)
}

export function useSeanceContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SEANCE_ADDRESS[chainId], SEANCE_ABI, withSignerIfPossible)
}

export function useETHPairContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ETH_USD_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useScarabContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SCARAB_ADDRESS[chainId], SOUL_SCARAB_ABI, withSignerIfPossible)
}

export function useSafeContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SAFE_ADDRESS[chainId], SOUL_SAFE_ABI, withSignerIfPossible)
}

export function useSoulSeanceContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SEANCE_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useSoulFtmContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_FTM_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useBoringHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId
      ? chainId === ChainId.FANTOM
        ? '0x26bbB91Ade07f995E1c5D1F4A050639763F4C44b'
        : BORING_HELPER_ADDRESS[chainId]
      : undefined,
    BORING_HELPER_ABI,
    false
  )
}

export function useSoulUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_USDC_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useSeanceUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SEANCE_USDC_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useFtmUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FTM_USDC_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useSoulVaultContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_VAULT_ADDRESS[chainId], SOULVAULT_ABI, withSignerIfPossible)
}

export function useEnchantContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ENCHANT_ADDRESS[chainId], ENCHANT_ABI, withSignerIfPossible)
}

export function useLuxorContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUX_ADDRESS[chainId], LUXOR_ABI, withSignerIfPossible)
}

export function useWrappedLumensContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && WLUM_ADDRESS[chainId], WLUM_ABI, withSignerIfPossible)
}

export function useEnchantHelperContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ENCHANT_HELPER_ADDRESS[chainId], ENCHANT_HELPER_ABI, withSignerIfPossible)
}

export function useTridentRouterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  return useContract(chainId && TRIDENT[chainId], FACTORY_ABI, withSignerIfPossible)
  // const router = TRIDENT[chainId]?.[CHAIN_KEY[chainId]]?.contracts.TridentRouter
  // return useContract(router?.address, router?.abi, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SUMMONER_ADDRESS[chainId], SOUL_SUMMONER_ABI, withSignerIfPossible) // 31 JUL (SOUL SUMMONER)
}

export function useConstantProductPoolFactory(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TRIDENT[chainId], FACTORY_ABI, withSignerIfPossible)
  // const factory = TRIDENT[chainId]?.[CHAIN_KEY[chainId]]?.contracts.ConstantProductPoolFactory
  // return useContract(factory?.address, factory?.abi, withSignerIfPossible)
}

export function useStablePoolFactory(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TRIDENT[chainId], FACTORY_ABI, withSignerIfPossible)
  // const factory = TRIDENT[chainId]?.[CHAIN_KEY[chainId]]?.contracts.HybridPoolFactory
  // return useContract(factory?.address, factory?.abi, withSignerIfPossible)
}

export function useSoulSummonerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SUMMONER_ADDRESS[chainId], SOUL_SUMMONER_ABI, withSignerIfPossible)
}

export function useSummonerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SUMMONER_ADDRESS[chainId], SOUL_SUMMONER_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

export function useHelperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && '0xa224a5D96E58E3dae89D0e4775444A329E67774c', SUMMONER_HELPER_ABI, withSignerIfPossible)
}

export function useLockerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LOCKER_ADDRESS[chainId], LOCKER_ABI, withSignerIfPossible)
}

export function useLaunchpadContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && address !== undefined && address !== '' && address, LAUNCHPAD_ABI, withSignerIfPossible)
}

export function useRouterContract(useArcher = false, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  const address = useArcher ? ARCHER_ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[chainId]
  const abi = useArcher ? ARCHER_ROUTER_ABI : ROUTER_ABI

  return useContract(address, abi, withSignerIfPossible)
}

export function useEnchantmentContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ENCHANT_ADDRESS[chainId], ENCHANT_ABI, withSignerIfPossible)
}

export function useMakerContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && REAPER_ADDRESS[chainId], MAKER_ABI, false)
}

export function useReaperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && REAPER_ADDRESS[chainId], MAKER_ABI, false)
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
}

export function useCoffinBoxContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && COFFIN_BOX_ADDRESS[chainId], COFFIN_BOX_ABI, withSignerIfPossible)
}

export function useUnderworldPairContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && UNDERWORLD_ADDRESS[chainId], UNDERWORLD_ABI, withSignerIfPossible)
}

export function useSoulSwapSwapper(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOULSWAP_SWAPPER_ADDRESS[chainId], BASE_SWAPPER_ABI, false)
}

export function useChainlinkOracle(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(CHAINLINK_ORACLE_ADDRESS[chainId], CHAINLINK_ORACLE_ABI, false)
}

// experimental:
export function useSaaveContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x364762C00b32c4b448f39efaA9CeFC67a25603ff', SAAVE_ABI, withSignerIfPossible)
}

export function useSwaave(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xA70e346Ca3825b46EB4c8d0d94Ff204DB76BC289', SAAVE_ABI, withSignerIfPossible)
}

export function useSushiRollContract(version: 'v1' | 'v2' = 'v2'): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.ETHEREUM:
        address = '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B'
        break
    }
  }
  return useContract(address, SUSHIROLL_ABI, true)
}

export function useDashboardContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.ETHEREUM:
        address = '0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF'
        break
    }
  }
  return useContract(address, DASHBOARD_ABI, false)
}

export function useSoulSwapTWAP0Oracle(): Contract | null {
  return useContract(SOULSWAP_TWAP_0_ORACLE_ADDRESS, SOULSWAP_TWAP_ORACLE_ABI)
}

export function useSoulSwapTWAP1Oracle(): Contract | null {
  return useContract(SOULSWAP_TWAP_1_ORACLE_ADDRESS, SOULSWAP_TWAP_ORACLE_ABI)
}

export function useSoulSwapTWAPContract(address?: string): Contract | null {
  const TWAP_0 = useContract(SOULSWAP_TWAP_0_ORACLE_ADDRESS, SOULSWAP_TWAP_ORACLE_ABI)
  const TWAP_1 = useContract(SOULSWAP_TWAP_1_ORACLE_ADDRESS, SOULSWAP_TWAP_ORACLE_ABI)
  if (address === SOULSWAP_TWAP_0_ORACLE_ADDRESS) {
    return TWAP_0
  } else if (address === SOULSWAP_TWAP_1_ORACLE_ADDRESS) {
    return TWAP_1
  }
  return undefined
}

export function useZapperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = ZAPPER_ADDRESS[chainId]
  return useContract(address, ZAPPER_ABI, withSignerIfPossible)
}

export function useSwapUnderlyingContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ROUTER_ACTION_ABI, withSignerIfPossible)
}

export function useComplexRewarderContract(address, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}

export function useAlcxRewarderContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x7519C93fC5073E15d89131fD38118D73A72370F8', ALCX_REWARDER_ABI, withSignerIfPossible)
}

export function useCloneRewarderContract(address, withSignerIfPossibe?: boolean): Contract | null {
  return useContract(address, CLONE_REWARDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(STOP_LIMIT_ORDER_ADDRESS[chainId], LIMIT_ORDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderHelperContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xd63E7D4eB9aB59bf85975c7100a5D92919C4E7E5', LIMIT_ORDER_HELPER_ABI, withSignerIfPossible)
}


// ------- Bridge --------

export function useAnyswapEthOperaBridge(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x5cbe98480a790554403694b98bff71a525907f5d', anyswapEthOperaBridge_ABI, withSignerIfPossible)
}

// ------- Atomic Swap --------

export function useAtomicSwapContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(ATOMIC_SWAP_ADDRESS[chainId], ATOMIC_SWAP_ABI, withSignerIfPossible)
}