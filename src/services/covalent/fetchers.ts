import { ChainId } from '../../sdk'

// CLASS A

const fetcher = (url) => fetch(`${url}?key=ckey_cba3674f2ce5450f9d5dd29058`).then((res) => res.json())

export const getTokenBalances = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`).then((res) => res.json())

export const getPortfolio = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/portfolio_v2/`).then((res) => res.json())

export const getTransfers = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/transfers_v2/`).then((res) => res.json())

export const getBlock = (chainId = ChainId.FANTOM, blockHeight) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/block_v2/${blockHeight}/`).then((res) => res.json())

export const getBlockHeights = (chainId = ChainId.FANTOM, startDate, endDate) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/block_v2/${startDate}/${endDate}/`).then((res) => res.json())

export const getLogs = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/events/address/${address}/`).then((res) => res.json())

export const getLogsForTopic = (chainId = ChainId.FANTOM, topic) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/events/topics/${topic}/`).then((res) => res.json())

export const getNftMetadata = (chainId = ChainId.FANTOM, address, tokenId) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_metadata/${tokenId}/`).then((res) => res.json())

export const getNftTokenIds = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_token_ids/`).then((res) => res.json())

export const getNftTransactions = (chainId = ChainId.FANTOM, address, tokenId) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/nft_transactions/${tokenId}/`).then((res) =>
    res.json()
  )

export const getHoldersChanges = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders_changes/`).then((res) => res.json())

export const getTokenHolders = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/${address}/token_holders/`).then((res) => res.json())

export const getTokenMetadata = (chainId = ChainId.FANTOM, id) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/${id}/`).then((res) => res.json())

export const getTransaction = (chainId = ChainId.FANTOM, txHash) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/trasaction_v2/${txHash}/`).then((res) => res.json())

export const getChains = () => fetch(`https://api.covalenthq.com/v1/chains/`).then((res) => res.json())

export const getChainsStatus = () =>
  fetch(`https://api.covalenthq.com/v1/chains/status/?key=ckey_cba3674f2ce5450f9d5dd290589`).then((res) => res.json())

// TODO: CLASS B
export const getSoulSwapLiquidityTransactions = (chainId = ChainId.FANTOM, address) =>
  fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/stacks/sushiswap/acts/`).then((res) => res.json())
