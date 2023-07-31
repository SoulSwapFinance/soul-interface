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
  SAFE_ADDRESS,
  ATOMIC_SWAP_ADDRESS,
  LUX_ADDRESS,
  TEAM_WALLET_ADDRESS,
  WLUM_ADDRESS,
  SOR_MASTER_ADDRESS,
  SOR_MINTER_ADDRESS,
  STOP_LIMIT_ORDER_ADDRESS,
  LOTTERY_ADDRESS,
  SOR_ADDRESS,
  LUX_TREASURY_ADDRESS,
  SOR_STAKING_REWARDS_ADDRESS,
  SUMMONER_ASSISTANT_ADDRESS,
  OFFCHAIN_AGGREGATOR_ORACLE,
  SPOOKY_ROUTER_ADDRESS,
  SPIRIT_ROUTER_ADDRESS,
} from 'constants/addresses'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_ETHEREUM_ADDRESS,
} from 'constants/abis/argent-wallet-detector'
import {
  ChainId,
  FACTORY_ADDRESS,
  BORING_HELPER_ADDRESS,
  ENCHANT_ADDRESS,
  ENCHANT_HELPER_ADDRESS,
  ROUTER_ADDRESS,
  SOUL_ADDRESS,
  SEANCE_ADDRESS,
  SUMMONER_ADDRESS,
  AUTO_STAKE_ADDRESS,
  SOUL_GUIDE_ADDRESS,
  BALANCES_FETCHER_ADDRESS,
  PRICE_HELPER_ADDRESS,
  HARVEST_HELPER_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE,
  SOUL_CIRCLE_ADDRESS,
  LUX_HELPER_ADDRESS,
  LUXOR_STAKING_ADDRESS,
  LUXOR_STAKING_HELPER_ADDRESS,
  SOULSWAP_TWAP_0_ORACLE_ADDRESS,
  SOULSWAP_TWAP_1_ORACLE_ADDRESS,
  LUM_ADDRESS,
  SOUL_BOND_ADDRESS,
  COFFIN_BOX_ADDRESS,
  SOULSWAP_SWAPPER_ADDRESS,
  CHAINLINK_ORACLE_ADDRESS,
  MERKLE_DISTRIBUTOR_ADDRESS,
  MANIFESTER_ADDRESS,
  MARKET_UPDATER_ADDRESS,
  REFUNDER_ADDRESS,
  LUXOR_REEFUNDER_ADDRESS,
} from 'sdk'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from 'constants/multicall'
import SOUL_BOND_ABI from 'constants/abis/soulbond.json' 
import SOUL_BOND_V2_ABI from 'constants/abis/soulswap/soulbondv2.json'
import ALCX_REWARDER_ABI from 'constants/abis/alcx-rewarder.json'
import CLONE_REWARDER_ABI from 'constants/abis/clone-rewarder.json'
import ARCHER_ROUTER_ABI from 'constants/abis/archer-router.json'
import SPIRIT_ROUTER_ABI from 'constants/abis/spiritswap-router.json'
import BASE_SWAPPER_ABI from 'constants/abis/swapper.json'
import UPDATER_ABI from 'constants/abis/market-updater.json'
import ANYSWAP_ERC20_ABI from 'constants/abis/anyswap_erc20.json'
import SPOOKY_FACTORY_ABI from 'constants/abis/spookyswap-factory.json'
import SOUL_CIRCLE_ABI from 'constants/abis/soulswap/soulcircle.json' 
import LUX_HELPER_ABI from 'constants/abis/lux-bond-helper.json' 
import CHAINLINK_ORACLE_ABI from 'constants/abis/chainlink-oracle.json'
import PRICE_ORACLE_ABI from 'constants/abis/price-oracle.json'
import COMPLEX_REWARDER_ABI from 'constants/abis/complex-rewarder.json'
// import ONCHAIN_AGGREGATOR_ORACLE_ABI from 'constants/abis/onchain-oracle.json'
import OFFCHAIN_AGGREGATOR_ORACLE_ABI from 'constants/abis/offchain-oracle.json'
import { Contract } from '@ethersproject/contracts'
import DASHBOARD_ABI from 'constants/abis/dashboard.json'
import EIP_2612_ABI from 'constants/abis/eip-2612.json'
import ENS_ABI from 'constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from 'constants/abis/ens-public-resolver.json'
import ERC20_ABI from 'constants/abis/erc20.json'
import { ERC20_BYTES32_ABI } from 'constants/abis/erc20'
import FACTORY_ABI from 'constants/abis/factory.json'
import ISoulSwapPairABI from 'constants/abis/soulswap/ISoulSwapPair.json'
import AUTO_STAKE_ABI from 'constants/abis/soulswap/autostake.json'
import UNDERWORLD_ABI from 'constants/abis/underworldpair.json'
import BALANCES_FETCHER_ABI from 'constants/abis/balancesfetcher.json'
import LUXOR_REFUNDER_ABI from 'constants/abis/luxor-refunder.json'

// soul
import SOUL_SAFE_ABI from 'constants/abis/soulswap/safe.json'
import SOUL_GUIDE_ABI from 'constants/abis/soul-guide.json' // TODO: update abi
import REFUNDER_ABI from 'constants/abis/refunder.json'
import SUMMONER_ABI from 'constants/abis/soulswap/soulsummoner.json' // 28 JUL
import SOUL_MANIFESTER_ABI from 'constants/abis/soulswap/soulmanifester.json' 
import FARM_MANIFESTER_ABI from 'constants/abis/soulswap/manifester.json'
import MANIFESTATION_ABI from 'constants/abis/soulswap/manifestation.json'
import LOTTERY_ABI from 'constants/abis/soulswap/lottery.json' // 28 JUL
import LUXOR_ABI from 'constants/abis/soulswap/luxor.json'
import LUXOR_TREASURY_ABI from 'constants/abis/soulswap/luxor-treasury.json'
import TEAM_WALLET_ABI from 'constants/abis/soulswap/team-wallet.json'
import SPOOKY_ROUTER_ABI from 'constants/abis/soulswap/spooky-router.json'
import SOR_STAKING_ABI from 'constants/abis/soulswap/sor-staking.json'
import LUXOR_STAKING_ABI from 'constants/abis/soulswap/luxor-staking.json'
import LUXOR_STAKING_HELPER_ABI from 'constants/abis/soulswap/luxor-staking-helper.json'
import WLUM_ABI from 'constants/abis/soulswap/wlumens.json'
import LUM_ABI from 'constants/abis/soulswap/lumens.json'
import ENCHANT_ABI from 'constants/abis/soulswap/enchant.json' // 30 OCT
import ENCHANT_HELPER_ABI from 'constants/abis/soulswap/enchant-helper.json' // 30 OCT
import SOUL_ABI from 'constants/abis/soulswap/soulpower.json' // 28 JUL
import SEANCE_ABI from 'constants/abis/soulswap/seance.json' // 28 JUL
import ATOMIC_SWAP_ABI from 'constants/abis/soulswap/atomic-swap.json'
import LAUNCHPAD_ABI from 'constants/abis/soulswap/launchpad.json'
import SUMMONER_HELPER_ABI from 'constants/abis/soulswap/helper.json'
import SUMMONER_ASSISTANT_ABI from 'constants/abis/soulswap/assistant.json' 
import PRICE_HELPER_ABI from 'constants/abis/soulswap/pricehelper.json'
import BORING_HELPER_ABI from 'constants/abis/soulswap/boring-helper.json'
import HARVEST_HELPER_ABI from 'constants/abis/soulswap/harvest-helper.json'
import COFFIN_BOX_ABI from 'constants/abis/soulswap/coffinbox.json'
import SOR_MASTER_ABI from 'constants/abis/soulswap/sor-master.json'
import SOR_MINTER_ABI from 'constants/abis/soulswap/sor-minter.json'

// unused
import MERKLE_DISTRIBUTOR_ABI from 'constants/abis/merkle-distributor.json'
import MULTICALL2_ABI from 'constants/abis/multicall2.json'
// import PENDING_ABI from 'constants/abis/pending.json'
import ROUTER_ABI from 'constants/abis/router.json'
import SAAVE_ABI from 'constants/abis/saave.json'
import SOULSWAP_ABI from '@sushiswap/core/abi/SushiRoll.json'
import SOULSWAP_TWAP_ORACLE_ABI from 'constants/abis/sushiswap-slp-oracle.json'
import TIMELOCK_ABI from 'constants/abis/timelock.json'

import WETH9_ABI from 'constants/abis/weth.json'
import ZAPPER_ABI from 'constants/abis/zapper.json'
import LIMIT_ORDER_ABI from 'constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from 'constants/abis/limit-order-helper.json'

import { getContract } from 'functions/contract'
import { useActiveWeb3React } from 'services/web3'
import { useMemo } from 'react'

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

const MULTICALL_ADDRESS = {
  [ChainId.ETHEREUM]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  // [ChainId.GÖRLI]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.MATIC]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.ARBITRUM]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  [ChainId.AVALANCHE]: '0x8C0F842791F03C095b6c633759224FcC9ACe68ea',
  [ChainId.BSC]: '0x47A307e3167820daf22a377D777371753758f59c',
  [ChainId.FANTOM]: '0xB1395e098c0a847CC719Bcf1Fc8114421a9F8232',
  [ChainId.MOONRIVER]: '0x8C8BF5Dea280A1eC68219D66E8A21E60585830F5',
  [ChainId.TELOS]: '0x64e1E895866B3126f8f2E2912B475FDB35b2F315'
}


export function useInterfaceMulticall(): Contract | null | undefined {
  const { chainId } = useActiveWeb3React()
  return useContract(MULTICALL_ADDRESS[chainId], MULTICALL_ABI, false)
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

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, ISoulSwapPairABI, withSignerIfPossible)
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useOffchainAggregatorOracleContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && OFFCHAIN_AGGREGATOR_ORACLE[chainId], OFFCHAIN_AGGREGATOR_ORACLE_ABI, false)
}

export function useSoulGuideContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_GUIDE_ADDRESS[chainId], SOUL_GUIDE_ABI, false)
}

export function useRefunderContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && REFUNDER_ADDRESS[chainId], REFUNDER_ABI, withSignerIfPossible)
}

export function usePriceHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PRICE_HELPER_ADDRESS[chainId], PRICE_HELPER_ABI, false)
}

export function useSorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOR_ADDRESS[chainId], ERC20_ABI, false)
}

export function useHarvestHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && HARVEST_HELPER_ADDRESS[chainId], HARVEST_HELPER_ABI, false)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useBalancesFetcherContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && BALANCES_FETCHER_ADDRESS[chainId], BALANCES_FETCHER_ABI, false)
}

export function useLuxorRefunderContract(): Contract | null {
  return useContract(LUXOR_REEFUNDER_ADDRESS[ChainId.FANTOM], LUXOR_REFUNDER_ABI, true)
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

export function useSafeContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SAFE_ADDRESS[chainId], SOUL_SAFE_ABI, withSignerIfPossible)
}

export function useSoulSeanceContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SEANCE_PAIR[250], ISoulSwapPairABI, withSignerIfPossible)
}

export function useSoulFtmContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_FTM_PAIR[chainId], ISoulSwapPairABI, withSignerIfPossible)
}

export function useBoringHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && BORING_HELPER_ADDRESS[chainId], BORING_HELPER_ABI)
}

export function useSeanceUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SEANCE_USDC_PAIR[250], ISoulSwapPairABI, withSignerIfPossible)
}

export function useFtmUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FTM_USDC_PAIR[250], ISoulSwapPairABI, withSignerIfPossible)
}

export function useEnchantContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ENCHANT_ADDRESS[chainId], ENCHANT_ABI, withSignerIfPossible)
}

export function useLuxorContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUX_ADDRESS[250], LUXOR_ABI, withSignerIfPossible)
}

export function useTeamContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TEAM_WALLET_ADDRESS[chainId], TEAM_WALLET_ABI, withSignerIfPossible)
}

export function useLuxorTreasuryContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUX_TREASURY_ADDRESS[chainId], LUXOR_TREASURY_ABI, withSignerIfPossible)
}

export function useLuxorStakingContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUXOR_STAKING_ADDRESS[chainId], LUXOR_STAKING_ABI, withSignerIfPossible)
}

export function useLuxorStakeHelperContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUXOR_STAKING_HELPER_ADDRESS[250], LUXOR_STAKING_HELPER_ABI, withSignerIfPossible)
}

export function useWrappedLumensContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && WLUM_ADDRESS[250], WLUM_ABI, withSignerIfPossible)
}

export function useLumensContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUM_ADDRESS[250], LUM_ABI, withSignerIfPossible)
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
  return useContract(chainId && SUMMONER_ADDRESS[chainId], 
    chainId == ChainId.FANTOM ? SUMMONER_ABI : SOUL_MANIFESTER_ABI,
    withSignerIfPossible)
}

export function useCircleStakingContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_CIRCLE_ADDRESS[chainId], SOUL_CIRCLE_ABI, withSignerIfPossible)
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

export function useLotteryContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LOTTERY_ADDRESS[chainId], LOTTERY_ABI, withSignerIfPossible)
}

export function useSummonerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SUMMONER_ADDRESS[chainId], SOUL_MANIFESTER_ABI, withSignerIfPossible)
}

export function useManifesterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MANIFESTER_ADDRESS[chainId], FARM_MANIFESTER_ABI, withSignerIfPossible)
}

export function useManifestationContract(address: string, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && address, MANIFESTATION_ABI, withSignerIfPossible)
}

export function useAutoStakeContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && AUTO_STAKE_ADDRESS[chainId], AUTO_STAKE_ABI, withSignerIfPossible)
}

export function useLuxorBondContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LUX_HELPER_ADDRESS[chainId], LUX_HELPER_ABI, withSignerIfPossible)
}

export function useSorMasterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOR_MASTER_ADDRESS[chainId], SOR_MASTER_ABI, withSignerIfPossible)
}

export function useSorMinterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOR_MINTER_ADDRESS[chainId], SOR_MINTER_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

export function useHelperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && '0xa224a5D96E58E3dae89D0e4775444A329E67774c', SUMMONER_HELPER_ABI, withSignerIfPossible)
}

export function useSummonerAssistantContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SUMMONER_ASSISTANT_ADDRESS[chainId], SUMMONER_ASSISTANT_ABI, withSignerIfPossible)
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

export function useSpookyRouterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SPOOKY_ROUTER_ADDRESS[chainId], SPOOKY_ROUTER_ABI, withSignerIfPossible)
}

export function useSpiritRouterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SPIRIT_ROUTER_ADDRESS[chainId], SPIRIT_ROUTER_ABI, withSignerIfPossible)
}

// export function useEnchantmentContract(withSignerIfPossible?: boolean): Contract | null {
//   const { chainId } = useActiveWeb3React()
//   return useContract(chainId && ENCHANT_ADDRESS[chainId], ENCHANT_ABI, withSignerIfPossible)
// }

export function useSorStakingContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOR_STAKING_REWARDS_ADDRESS[chainId], SOR_STAKING_ABI, false)
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
}

export function useCoffinBoxContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && COFFIN_BOX_ADDRESS[chainId], COFFIN_BOX_ABI, withSignerIfPossible)
}

export function useUnderworldPairContract(PAIR_ADDRESS: string, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && PAIR_ADDRESS[chainId], UNDERWORLD_ABI, withSignerIfPossible)
}

export function useSoulSwapSwapper(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOULSWAP_SWAPPER_ADDRESS[chainId], BASE_SWAPPER_ABI, false)
}

export function useChainlinkOracle(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(CHAINLINK_ORACLE_ADDRESS[chainId], CHAINLINK_ORACLE_ABI, false)
}

export function usePriceOracle(oracleAddress: string): Contract | null {
  return useContract(oracleAddress, PRICE_ORACLE_ABI, false)
}

// experimental:
export function useSaaveContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x364762C00b32c4b448f39efaA9CeFC67a25603ff', SAAVE_ABI, withSignerIfPossible)
}

export function useSwaave(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xA70e346Ca3825b46EB4c8d0d94Ff204DB76BC289', SAAVE_ABI, withSignerIfPossible)
}

export function useSoulSwapContract(version: 'v1' | 'v2' = 'v2'): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.ETHEREUM:
        address = '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B'
        break
    }
  }
  return useContract(address, SOULSWAP_ABI, true)
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

export function useSoulSwapTWAPContract(address?: string): Contract | null {
  const { chainId } = useActiveWeb3React()
  const TWAP_0 = useContract(SOULSWAP_TWAP_0_ORACLE_ADDRESS[chainId], SOULSWAP_TWAP_ORACLE_ABI)
  const TWAP_1 = useContract(SOULSWAP_TWAP_1_ORACLE_ADDRESS[chainId], SOULSWAP_TWAP_ORACLE_ABI)
  if (address === SOULSWAP_TWAP_0_ORACLE_ADDRESS[chainId]) {
    return TWAP_0
  } else if (address === SOULSWAP_TWAP_1_ORACLE_ADDRESS[chainId]) {
    return TWAP_1
  }
  return undefined
}

export function useZapperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ZAPPER_ADDRESS[chainId], ZAPPER_ABI, withSignerIfPossible)
}

export function useMarketUpdater(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MARKET_UPDATER_ADDRESS[chainId], UPDATER_ABI, withSignerIfPossible)
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

export function useSoulBondContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_BOND_ADDRESS[chainId], SOUL_BOND_V2_ABI, withSignerIfPossible)
}

// ------- Atomic Swap --------

export function useAtomicSwapContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(ATOMIC_SWAP_ADDRESS[chainId], ATOMIC_SWAP_ABI, withSignerIfPossible)
}

// SoulSwap 
export function useSpookySwapFactoryContract(withSignerIfPossible?: boolean): Contract | null {
return useContract('0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3', SPOOKY_FACTORY_ABI, withSignerIfPossible)
}