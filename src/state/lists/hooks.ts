import { AppState } from '..'
// import DEFAULT_TOKEN_LIST from '@soulswap/default-token-list'
import DEFAULT_TOKEN_LIST from '../../constants/token-lists/soulswap.tokenlist.json'
import { TokenList } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from '../../constants/token-lists'
import UNSUPPORTED_TOKEN_LIST from '../../constants/token-lists/sushiswap-v2-unsupported.tokenlist.json'
import { WrappedTokenInfo } from './wrappedTokenInfo'
import { sortByListPriority } from '../../functions/list'
import { useAppSelector } from '../hooks'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export type TokenAddressMap = Readonly<{
  [chainId: number]: Readonly<{
    [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList }
  }>
}>

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>((tokenMap, tokenInfo) => {
    const token = new WrappedTokenInfo(tokenInfo, list)
    if (tokenMap[token.chainId]?.[token.address] !== undefined) {
      console.error(new Error(`Duplicate token! ${token.address}`))
      return tokenMap
    }
    return {
      ...tokenMap,
      [token.chainId]: {
        ...tokenMap[token.chainId],
        [token.address]: {
          token,
          list,
        },
      },
    }
  }, {})
  listCache?.set(list, map)
  return map
}

const TRANSFORMED_DEFAULT_TOKEN_LIST = listToTokenMap(DEFAULT_TOKEN_LIST)

export function useAllLists(): AppState['lists']['byUrl'] {
  return useAppSelector((state) => state.lists.byUrl)
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    1: { ...map1[1], ...map2[1] }, // mainnet
    40: { ...map1[40], ...map2[40] }, // telos
    56: { ...map1[56], ...map2[56] }, // bsc
    250: { ...map1[250], ...map2[250] }, // fantom
    4002: { ...map1[4002], ...map2[4002] }, // fantom testnet
    43114: { ...map1[43114], ...map2[43114] } // avalanche
  }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()
  return useMemo(() => {
    if (!urls) return {}
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            return combineMaps(allTokens, listToTokenMap(current))
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, {})
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useAppSelector((state) => state.lists.activeListUrls)?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url))
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url))
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  return combineMaps(activeTokens, TRANSFORMED_DEFAULT_TOKEN_LIST)
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

  // format into one token address map
  return useMemo(
    () => combineMaps(localUnsupportedListMap, loadedUnsupportedListMap),
    [localUnsupportedListMap, loadedUnsupportedListMap]
  )
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}

// export function useAllMergeBridgeTokenList(key?: string | undefined, chainId?:any): any {
//   const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists)
//   // console.log(lists)
//   const init = {}
//   return useMemo(() => {
//     if (!key || !chainId) return init
//     const current = lists[key]?.[chainId]?.tokenList
//     // console.log(current)
//     if (!current) return init
//     try {
//       // return listsMergeToTokenMap(current)
//       return current
//     } catch (error) {
//       console.error('Could not show token list due to error', error)
//       return init
//     }
//   }, [lists, chainId])
// }