import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { DEFAULT_TXN_DISMISS_MS, NETWORKS_INFO } from 'constants/index'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppJsonRpcProvider, KyberSwapConfig, KyberSwapConfigResponse } from 'services/kyberswap/ksSetting'

import { AppState } from '..'
import { addPopup, ApplicationModal, PopupContent, removePopup, setOpenModal } from './reducer'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
import ethereumInfo from 'constants/networks/eth'
import { createClient } from 'utils/client'

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useTimestampFromBlock(block: number | undefined): number | undefined {
  const { library } = useActiveWeb3React()
  const [timestamp, setTimestamp] = useState<number>()
  useEffect(() => {
    async function fetchTimestamp() {
      if (block) {
        const blockData = await library?.getBlock(block)
        blockData && setTimestamp(blockData.timestamp)
      }
    }
    if (!timestamp) {
      fetchTimestamp()
    }
  }, [block, library, timestamp])
  return timestamp
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector((state: AppState) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal)
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useCloseModals(): () => void {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useSwapApprovalModalToggle(): () => void {
  return useToggleModal(ApplicationModal.SWAP_APPROVAL)
}

export function useNetworkModalToggle(): () => void {
  return useToggleModal(ApplicationModal.NETWORK)
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS)
}

export function useToggleCrossChainMode(): () => void {
  return useToggleModal(ApplicationModal.CROSSCHAIN)
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP)
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP)
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM)
}

export function useToggleDelegateModal(): () => void {
  return useToggleModal(ApplicationModal.DELEGATE)
}

export function useToggleVoteModal(): () => void {
  return useToggleModal(ApplicationModal.VOTE)
}

export function useToggleTokenStatsModal(): () => void {
  return useToggleModal(ApplicationModal.SOUL_STATS) 
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string, removeAfterMs?: number) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (content: PopupContent, key?: string, removeAfterMs?: number) => {
      dispatch(addPopup({ content, key, removeAfterMs: removeAfterMs ?? DEFAULT_TXN_DISMISS_MS }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useAppSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter((item) => item.show), [list])
}

export function useUnderworldApprovalPending(): string {
  return useSelector((state: AppState) => state.application.underworldApprovalPending)
}

const cacheConfig: {
  rpc: { [rpc: string]: AppJsonRpcProvider }
  client: { [subgraphLink: string]: ApolloClient<NormalizedCacheObject> }
} = {
  rpc: {},
  client: {},
}

const cacheCalc: <T extends keyof typeof cacheConfig, U extends typeof cacheConfig[T][string]>(
  type: T,
  value: string,
  fallback: (value: string) => U,
) => U = <T extends keyof typeof cacheConfig, U extends typeof cacheConfig[T][string]>(
  type: T,
  value: string,
  fallback: (value: string) => U,
) => {
  if (!cacheConfig[type][value]) {
    cacheConfig[type][value] = fallback(value)
  }
  return cacheConfig[type][value] as U
}

function getDefaultConfig(chainId: ChainId): KyberSwapConfigResponse {
  const evm = chainId
  return {
    rpc: NETWORKS_INFO[chainId].rpcUrl,
    prochart: false,
    isEnableBlockService: false,
    blockSubgraph: (evm ? NETWORKS_INFO[chainId] : ethereumInfo).defaultBlockSubgraph,
    elasticSubgraph: (evm ? NETWORKS_INFO[chainId] : ethereumInfo).elastic.defaultSubgraph,
    classicSubgraph: (evm ? NETWORKS_INFO[chainId] : ethereumInfo).classic.defaultSubgraph,
    commonTokens: undefined,
  }
}

export const useKyberSwapConfig = (customChainId?: ChainId): KyberSwapConfig => {
  const storeChainId = useAppSelector(state => state.user.chainId) || ChainId.ETHEREUM
  const chainId = customChainId || storeChainId

  const config = useAppSelector(state => state.application.config[chainId] || getDefaultConfig(chainId))

  const readProvider = useMemo(() => {
    return cacheCalc('rpc', config.rpc, rpc => new AppJsonRpcProvider(rpc, chainId))
  }, [config.rpc, chainId])
  const blockClient = useMemo(
    () => cacheCalc('client', config.blockSubgraph, subgraph => createClient(subgraph)),
    [config.blockSubgraph],
  )
  const classicClient = useMemo(
    () => cacheCalc('client', config.classicSubgraph, subgraph => createClient(subgraph)),
    [config.classicSubgraph],
  )
  const elasticClient = useMemo(
    () => cacheCalc('client', config.elasticSubgraph, subgraph => createClient(subgraph)),
    [config.elasticSubgraph],
  )

  return useMemo(() => {
    return {
      rpc: config.rpc,
      isEnableBlockService: config.isEnableBlockService,
      readProvider,
      prochart: config.prochart,
      blockClient,
      elasticClient,
      classicClient,
      connection: undefined,
      commonTokens: config.commonTokens,
    }
  }, [
    config.rpc,
    config.isEnableBlockService,
    config.prochart,
    config.commonTokens,
    readProvider,
    blockClient,
    elasticClient,
    classicClient,
    chainId,
  ])

}