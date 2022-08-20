import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from 'sdk'
import { TokenList } from '@uniswap/token-lists'
import { resolveENSContentHash } from 'functions/ens'
import { getNetworkLibrary } from 'functions/getNetworkLibrary'
import { getTokenList } from 'functions/list'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { fetchTokenList } from 'state/lists/actions'
import { useCallback } from 'react'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!library || chainId !== ChainId.ETHEREUM) {
        if (chainId === ChainId.ETHEREUM) {
          const networkLibrary = getNetworkLibrary()
          if (networkLibrary) {
            return resolveENSContentHash(ensName, networkLibrary)
          }
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              fetchTokenList?.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            )
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}