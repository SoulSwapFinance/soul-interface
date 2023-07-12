import CHAINLINK_TOKENS from 'constants/chainlink/soulswap-chainlink.whitelist.json'
import { ChainId, Currency, NATIVE, Token } from 'sdk'
import { Button } from 'components/Button'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { filterTokens, useSortedTokensByQuery } from 'functions/filtering'
import { isAddress } from 'functions/validate'
import { useAllTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from 'hooks/Tokens'
import useDebounce from 'hooks/useDebounce'
import CurrencyModalView from 'modals/SearchModal/CurrencyModalView'
import { useCurrencyModalContext } from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import React, { KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'

import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import ImportRow from './ImportRow'
import { useTokenComparator } from './sorting'

interface CurrencySearchProps {
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  currencyList?: (string | undefined)[]
  allowManageTokenList?: boolean
}

export function CurrencySearch({
  otherSelectedCurrency,
  showCommonBases,
  currencyList,
  allowManageTokenList = true,
}: CurrencySearchProps) {
  const router = useRouter()
  let allTokens = useAllTokens()
  const { chainId } = useActiveWeb3React()
  const { setView, onDismiss, onSelect, includeNative, showSearch, setImportToken } = useCurrencyModalContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)
  const tokenComparator = useTokenComparator(chainId)

  if (router.asPath.startsWith('/create') && chainId) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      if (CHAINLINK_TOKENS[chainId].find((address) => address === key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  if (currencyList) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      if (currencyList.includes(key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch,
      })
    }
  }, [isAddressSearch])

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)
  const ether = useMemo(() => chainId && NATIVE[chainId], [chainId])
  // && ![ChainId.CELO].includes(chainId)

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if (s === '' || s === 'f' || s === 'ft' || s === 'ftm') {
      return ether ? [ether, ...filteredSortedTokens] : filteredSortedTokens
    }
    return filteredSortedTokens
  }, [debouncedQuery, ether, filteredSortedTokens])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onSelect(currency)
      onDismiss()
    },
    [onSelect, onDismiss]
  )

  // manage focus on modal show
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checkSum = isAddress(input)
    setSearchQuery(checkSum || input)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'ftm' && ether) {
          handleCurrencySelect(ether)
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0])
          }
        }
      }
    },
    [debouncedQuery, ether, filteredSortedTokensWithETH, handleCurrencySelect]
  )

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )

  const handleImport = useCallback(() => {
    if (searchToken) {
      setImportToken(searchToken)
    }

    setView(CurrencyModalView.importToken)
  }, [searchToken, setImportToken, setView])

  return (
    <>
      <HeadlessUiModal.Header onClose={onDismiss} header={`Select Token`} />
      {!currencyList && showSearch && (
        <input
          type="text"
          id="token-search-input"
          placeholder={`Search name or paste address`}
          autoComplete="off"
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className="w-full bg-[rgba(0,0,0,0.2)] border border-dark-800 focus:border-purple rounded placeholder-secondary font-bold text-base p-4 appearance-none"
        />
      )}
      {showCommonBases && <CommonBases />}

      {searchToken && !searchTokenIsAdded && <ImportRow token={searchToken} onClick={handleImport} />}
      <div className="h-full overflow-hidden overflow-y-auto border rounded border-dark-800 bg-[rgba(0,0,0,0.2)]">
        {filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
          <CurrencyList
            chainId={chainId}
            currencies={includeNative ? filteredSortedTokensWithETH : filteredSortedTokens}
            otherListTokens={filteredInactiveTokens}
            otherCurrency={otherSelectedCurrency}
          />
        ) : (
          <Typography weight={700} variant="xs" className="text-secondary flex h-full justify-center items-center">
            {`No results found`}
          </Typography>
        )}
      </div>
      {allowManageTokenList && (
        <div className="flex justify-center">
          <Button
            size="sm"
            id="list-token-manage-button"
            onClick={() => setView(CurrencyModalView.manage)}
            color="blue"
            variant="empty"
          >
            {`Manage Token Lists`}
          </Button>
        </div>
      )}
    </>
  )
}
