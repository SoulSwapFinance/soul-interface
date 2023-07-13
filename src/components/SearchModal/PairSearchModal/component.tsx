import { Pair } from 'sdk'

import React, { ChangeEvent, KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'

import { usePairAtAddress } from 'data/Reserves'
import { useAllPairs } from 'hooks/useAllPairs'
import { CloseIcon, TYPE } from 'theme'
import { isAddress } from 'functions/validate'
import Column from 'components/Column'
import { RowBetween } from 'components/Row'
import { PairList } from '../PairList'
import { PaddedColumn, SearchInput, Separator } from '../shared'
// import { SortButton } from '../SortButton'
// import { filterPairs as filterPairsBySearchQuery } from '../utils/filtering'
// import { usePairsComparator } from 'utils/sorting'
import { Wrapper } from './styles'
import { PairSearchProps } from './types'

export const PairSearch = ({ selectedPair, onPairSelect, onDismiss, isOpen, filterPairs }: PairSearchProps) => {

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const { pairs: allPairs } = useAllPairs()

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchPair = usePairAtAddress(searchQuery)

  // const pairsComparator = usePairsComparator(invertSearchOrder)

  const filteredPairs: Pair[] = useMemo(() => {
    let pairs = allPairs
    if (filterPairs) pairs = allPairs.filter(filterPairs)
    if (isAddressSearch) return searchPair ? [searchPair] : []
    // return filterPairsBySearchQuery(pairs, searchQuery)
  }, [allPairs, filterPairs, isAddressSearch, searchPair, searchQuery])

  // const filteredSortedPairs: Pair[] = useMemo(() => {
    // if (searchPair) return [searchPair]
    // return filteredPairs.sort(pairsComparator)
  // }, [filteredPairs, searchPair, pairsComparator ])

  const handlePairSelect = useCallback(
    (pair: Pair) => {
      onPairSelect(pair)
      onDismiss()
    },
    [onDismiss, onPairSelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  // const handleEnter = useCallback(
    // (e: KeyboardEvent<HTMLInputElement>) => {
      // if (
        // e.key === 'Enter' &&
      //   filteredSortedPairs.length > 0 &&
      //   (((filteredSortedPairs[0].token0.symbol || '') + (filteredSortedPairs[0].token1.symbol || '')).toLowerCase() ===
      //     searchQuery.trim().toLowerCase() ||
      //     filteredSortedPairs.length === 1)
      // ) {
      //   handlePairSelect(filteredSortedPairs[0])
      // }
    // },
    // [filteredSortedPairs, handlePairSelect, searchQuery]
  // )

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  return (
    <Wrapper data-testid="select-a-pair">
      <Column style={{ width: '100%', height: '100%', flex: '1 1' }}>
        <PaddedColumn gap="16px">
          <RowBetween>
            <TYPE.Body fontWeight={500} fontSize={16}>
              Select Pair
            </TYPE.Body>
            <CloseIcon onClick={onDismiss} data-testid="close-search-pair" />
          </RowBetween>
          <SearchInput
            data-testid="search-pair"
            type="text"
            placeholder={'searchPlaceholder'}
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            // onKeyDown={handleEnter}
          />
          <RowBetween>
            <TYPE.Body fontSize="11px" lineHeight="13px" letterSpacing="0.06em">
              NAME
            </TYPE.Body>
            {/* <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} /> */}
          </RowBetween>
        </PaddedColumn>
        <Separator />
        <PairList pairs={[]}
          onPairSelect={handlePairSelect}
        />
      </Column>
    </Wrapper>
  )
}