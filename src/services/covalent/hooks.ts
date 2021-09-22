import {
  getBlock,
  getBlockHeights,
  getChains,
  getChainsStatus,
  getHoldersChanges,
  getLogs,
  getLogsForTopic,
  getNftMetadata,
  getNftTokenIds,
  getNftTransactions,
  getPortfolio,
  getTokenBalances,
  getTokenHolders,
  getTokenMetadata,
  getTransaction,
  getTransfers,
} from './fetchers'

import useSWR from 'swr'

// CLASS A
export function useTokenBalances({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`,
    () => getTokenBalances(chainId, address),
    { }
  )
  return res
}

export function usePortfolio({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/`,
    () => getPortfolio(chainId, address),
    { }
  )
  return res
}

export function useTransfers({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`,
    () => getTransfers(chainId, address),
    {}
  )
  return res
}

export function useBlock({ chainId, blockHeight }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`,
    () => getBlock(chainId, blockHeight),
    {}
  )
  return res
}

export function useBlockHeights({ chainId, startDate, endDate }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`,
    () => getBlockHeights(chainId, startDate, endDate),
    {}
  )
  return res
}

export function useLogs({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`,
    () => getLogs(chainId, address),
    {}
  )
  return res
}

export function useLogsForTopic({ chainId, topic }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`,
    () => getLogsForTopic(chainId, topic),
    {}
  )
  return res
}

export function useNftMetadata({ chainId, address, tokenId }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`,
    () => getNftMetadata(chainId, address, tokenId),
    {}
  )
  return res
}

export function useNftTokenIds({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`,
    () => getNftTokenIds(chainId, address),
    { }
  )
  return res
}

export function useNftTransactions({ chainId, address, tokenId }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`,
    () => getNftTransactions(chainId, address, tokenId),
    { }
  )
  return res
}

export function useHoldersChanges({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`,
    () => getHoldersChanges(chainId, address),
    {}
  )
  return res
}

export function useHolders({ chainId, address }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`,
    () => getTokenHolders(chainId, address),
    {}
  )
  return res
}

export function useTokenMetadata({ chainId, id }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`,
    () => getTokenMetadata(chainId, id),
    {}
  )
  return res
}

export function useTransaction({ chainId, txHash }) {
  const res = useSWR(
    `https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`,
    () => getTransaction(chainId, txHash),
    {}
  )
  return res
}

export function useChains({}) {
  const res = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChains(), {})
  return res
}

export function useChainsStatus({}) {
  const res = useSWR(`https://api.covalenthq.com/v1/chains/status/`, () => getChainsStatus(), {})
  return res
}

// TODO: CLASS B
