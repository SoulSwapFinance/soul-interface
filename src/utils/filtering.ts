import { ChainId, Token } from 'sdk'
import { isAddress } from 'functions/validate'
import { TokenInfo } from 'state/lists/wrappedTokenInfo'

const alwaysTrue = () => true

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends Token | TokenInfo>(chainId: ChainId, search: string): (tokens: T) => boolean {
  const searchingAddress = isAddress(chainId, search)

  if (searchingAddress) {
    const lower = searchingAddress.toLowerCase()
    return (t: T) => ('isToken' in t ? searchingAddress === t.address : lower === t.address.toLowerCase())
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) return alwaysTrue

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return ({ name, symbol }: T): boolean => Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
}

export function filterTokens<T extends Token | TokenInfo>(tokens: T[], chainId: ChainId, search: string): T[] {
  return tokens.filter(createTokenFilterFunction(chainId, search))
}

export function filterTokensWithExactKeyword<T extends Token | TokenInfo>(tokens: T[], chainId: ChainId, search: string): T[] {
  const result = filterTokens(tokens, chainId, search)
  if (isAddress(chainId, search)) return result
  const filterExact = result.filter(e => (e.symbol ? e.symbol.toLowerCase() === search.toLowerCase() : true)) // Exact Keyword
  return filterExact.length ? filterExact : result
}

export const filterTruthy = <T>(array: (T | undefined | null | false)[]): T[] => {
  return array.filter(Boolean) as T[]
}
