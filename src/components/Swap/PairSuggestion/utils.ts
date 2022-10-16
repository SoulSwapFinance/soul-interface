import { ChainId, NATIVE, WNATIVE_ADDRESS } from 'sdk'

import { AllTokenType } from 'hooks/Tokens'
import { getTokenLogoURL } from 'utils'
import { currencyId } from 'utils/currency/currencyId'

import { SuggestionPairData } from './request'
import { useActiveWeb3React } from 'services/web3'

export const isFavoritePair = (favoritePairs: SuggestionPairData[], item: SuggestionPairData) => {
  return favoritePairs.some(({ tokenIn, tokenOut }) => item.tokenIn === tokenIn && item.tokenOut === tokenOut)
}

// address is lowercase
const isTokenInWhiteList = (activeTokens: AllTokenType, address: string, chainId: ChainId) =>
  address.toLowerCase() === WNATIVE_ADDRESS[chainId].toLowerCase() ? true : !!activeTokens[address]

// at least tokenIn or tokeOut not in whitelist
export const isActivePair = (activeTokens: AllTokenType, pair: SuggestionPairData, chainId: ChainId) =>
  isTokenInWhiteList(activeTokens, pair.tokenIn, chainId) && isTokenInWhiteList(activeTokens, pair.tokenOut, chainId)


export const findLogoAndSortPair = (
  activeTokens: AllTokenType,
  list: SuggestionPairData[],
  chainId: ChainId | undefined,
) => {
  return list
    .map(token => {
      // find logo
      if (!token.tokenInImgUrl) {
        token.tokenInImgUrl = getTokenLogoURL(token.tokenIn, chainId)
      }
      if (!token.tokenOutImgUrl) {
        token.tokenOutImgUrl = getTokenLogoURL(token.tokenOut, chainId)
      }
      return token
    })
    .sort((a, b) => {
      // sort token pair in whitelist appear first
      const activeA = [isTokenInWhiteList(activeTokens, a.tokenIn, chainId), isTokenInWhiteList(activeTokens, a.tokenOut, chainId)]
      const activeB = [isTokenInWhiteList(activeTokens, b.tokenIn, chainId), isTokenInWhiteList(activeTokens, b.tokenOut, chainId)]
      return activeA.filter(Boolean).length > activeB.filter(Boolean).length ? -1 : 1
    })
}

export const getAddressParam = (address: string, chainId: ChainId | undefined) =>
  address.toLowerCase() === WNATIVE_ADDRESS[chainId].toLowerCase() && chainId
    ? currencyId(NATIVE[chainId])
    : address
