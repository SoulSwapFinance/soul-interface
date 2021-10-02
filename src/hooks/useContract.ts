import {
  ARCHER_ROUTER_ADDRESS,
  MULTICALL2_ADDRESS,
  ZAPPER_ADDRESS,
  ETH_USD_PAIR,
  SOUL_SEANCE_PAIR,
  SOUL_FTM_PAIR,
  SEANCE_USDC_PAIR,
  FANTOM_USDC_PAIR,
  LOCKER_ADDRESS
} from '../constants/addresses'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector'
import {
  ChainId,
  MAKER_ADDRESS,
  FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  SPELL_ADDRESS,
  SOUL_ADDRESS,
  SOUL_SUMMONER_ADDRESS,
  SOULVAULT_ADDRESS,
  SOUL_GUIDE_ADDRESS,
  SOULSWAP_SWAPPER_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE,
} from '@soulswap/sdk'
import {
  COFFIN_BOX_ADDRESS,
  CHAINLINK_ORACLE_ADDRESS,
  UNDERWORLD_ADDRESS,
  // SOUL_GUIDE_ADDRESS,
  SOULSWAP_TWAP_0_ORACLE_ADDRESS,
  SOULSWAP_TWAP_1_ORACLE_ADDRESS,
} from '../constants/kashi'
import { MERKLE_DISTRIBUTOR_ADDRESS } from '../constants'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import ALCX_REWARDER_ABI from '../constants/abis/alcx-rewarder.json'
import CLONE_REWARDER_ABI from '../constants/abis/clone-rewarder.json'
import ARCHER_ROUTER_ABI from '../constants/abis/archer-router.json'
import BASE_SWAPPER_ABI from '../constants/abis/swapper.json'
import BENTOBOX_ABI from '../constants/abis/bentobox.json'
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
import IUniswapV2PairABI from '../constants/abis/uniswap-v2-pair.json'
import KASHIPAIR_ABI from '../constants/abis/kashipair.json'
import MAKER_ABI from '../constants/abis/maker.json'
import SOUL_LOCKER_ABI from '../constants/abis/soul-locker.json' // todo

// soul
import SOUL_GUIDE_ABI from '../constants/abis/soul-guide.json' // TODO: update abi
import SOUL_SUMMONER_ABI from '../constants/abis/soulswap/soulsummoner.json' // 28 JUL
import SOULVAULT_ABI from '../constants/abis/soulswap/soulvault.json' // 31 JUL
import SPELL_ABI from '../constants/abis/soulswap/spell.json' // 28 JUL
import SOUL_ABI from '../constants/abis/soulswap/soulpower.json' // 28 JUL

// bridge
import anyswapEthOperaBridge_ABI from '../constants/abis/soulswap/bridge/anyswapEthOperaBridge.json'

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
import UNI_FACTORY_ABI from '../constants/abis/uniswap-v2-factory.json'
import WETH9_ABI from '../constants/abis/weth.json'
import ZAPPER_ABI from '../constants/abis/zapper.json'
import LIMIT_ORDER_ABI from '../constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from '../constants/abis/limit-order-helper.json'

import { getContract } from '../functions/contract'
import { useActiveWeb3React } from './useActiveWeb3React'
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

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WNATIVE[chainId].address : undefined, WETH9_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      // case ChainId.GÖRLI:
      // case ChainId.ROPSTEN:
      // case ChainId.RINKEBY:
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
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
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

export function useETHPairContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && ETH_USD_PAIR[chainId], IUniswapV2PairABI, withSignerIfPossible)
}

export function useLockerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && LOCKER_ADDRESS[chainId], SOUL_LOCKER_ABI, withSignerIfPossible)
}

export function useSoulSeanceContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SEANCE_PAIR[chainId], IUniswapV2PairABI, withSignerIfPossible)
}

export function useSoulFantomContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_FTM_PAIR[chainId], IUniswapV2PairABI, withSignerIfPossible)
}

export function useSeanceUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SEANCE_USDC_PAIR[chainId], IUniswapV2PairABI, withSignerIfPossible)
}

export function useFantomUsdcContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FANTOM_USDC_PAIR[chainId], IUniswapV2PairABI, withSignerIfPossible)
}

export function useSoulVaultContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOULVAULT_ADDRESS[chainId], SOULVAULT_ABI, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SUMMONER_ADDRESS[chainId], SOUL_SUMMONER_ABI, withSignerIfPossible) // 31 JUL (SOUL SUMMONER)
}

export function useSoulSummonerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOUL_SUMMONER_ADDRESS[chainId], SOUL_SUMMONER_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && FACTORY_ADDRESS[chainId], FACTORY_ABI, false)
}

export function useRouterContract(useArcher = false, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  const address = useArcher ? ARCHER_ROUTER_ADDRESS[chainId] : ROUTER_ADDRESS[chainId]
  const abi = useArcher ? ARCHER_ROUTER_ABI : ROUTER_ABI

  return useContract(address, abi, withSignerIfPossible)
}

export function useSpellBoundContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SPELL_ADDRESS[chainId], SPELL_ABI, withSignerIfPossible)
}

export function useMakerContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MAKER_ADDRESS[chainId], MAKER_ABI, false)
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && TIMELOCK_ADDRESS[chainId], TIMELOCK_ABI, false)
}

export function useBentoBoxContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && COFFIN_BOX_ADDRESS[chainId], BENTOBOX_ABI, withSignerIfPossible)
}

export function useKashiPairContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && UNDERWORLD_ADDRESS[chainId], KASHIPAIR_ABI, withSignerIfPossible)
}

export function useKashiPairCloneContract(address: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, KASHIPAIR_ABI, withSignerIfPossible)
}

export function useSoulSwapSwapper(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && SOULSWAP_SWAPPER_ADDRESS[chainId], BASE_SWAPPER_ABI, false)
}

export function useChainlinkOracle(): Contract | null {
  return useContract(CHAINLINK_ORACLE_ADDRESS, CHAINLINK_ORACLE_ABI, false)
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
      case ChainId.MAINNET:
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
      case ChainId.MAINNET:
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

export function useQuickSwapFactoryContract(): Contract | null {
  return useContract(
    '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    [
      {
        type: 'constructor',
        stateMutability: 'nonpayable',
        payable: false,
        inputs: [
          {
            type: 'address',
            name: '_feeToSetter',
            internalType: 'address',
          },
        ],
      },
      {
        type: 'event',
        name: 'PairCreated',
        inputs: [
          {
            type: 'address',
            name: 'token0',
            internalType: 'address',
            indexed: true,
          },
          {
            type: 'address',
            name: 'token1',
            internalType: 'address',
            indexed: true,
          },
          {
            type: 'address',
            name: 'pair',
            internalType: 'address',
            indexed: false,
          },
          {
            type: 'uint256',
            name: '',
            internalType: 'uint256',
            indexed: false,
          },
        ],
        anonymous: false,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'allPairs',
        inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
        name: 'allPairsLength',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [{ type: 'address', name: 'pair', internalType: 'address' }],
        name: 'createPair',
        inputs: [
          {
            type: 'address',
            name: 'tokenA',
            internalType: 'address',
          },
          {
            type: 'address',
            name: 'tokenB',
            internalType: 'address',
          },
        ],
        constant: false,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'feeTo',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'feeToSetter',
        inputs: [],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'view',
        payable: false,
        outputs: [{ type: 'address', name: '', internalType: 'address' }],
        name: 'getPair',
        inputs: [
          { type: 'address', name: '', internalType: 'address' },
          { type: 'address', name: '', internalType: 'address' },
        ],
        constant: true,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [],
        name: 'setFeeTo',
        inputs: [
          {
            type: 'address',
            name: '_feeTo',
            internalType: 'address',
          },
        ],
        constant: false,
      },
      {
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        outputs: [],
        name: 'setFeeToSetter',
        inputs: [
          {
            type: 'address',
            name: '_feeToSetter',
            internalType: 'address',
          },
        ],
        constant: false,
      },
    ],
    false
  )
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

export function useMeowshiContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', MEOWSHI_ABI, withSignerIfPossible)
}

export function useLimitOrderContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(getVerifyingContract(chainId), LIMIT_ORDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderHelperContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xe2f736B7d1f6071124CBb5FC23E93d141CD24E12', LIMIT_ORDER_HELPER_ABI, withSignerIfPossible)
}


// ------- Bridge --------

export function useAnyswapEthOperaBridge(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x5cbe98480a790554403694b98bff71a525907f5d', anyswapEthOperaBridge_ABI, withSignerIfPossible)
}