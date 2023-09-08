import { ChainId, Pair } from 'sdk'

import { CSSProperties, useCallback } from 'react'
import { Plus, X } from 'react-feather'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Box, Flex, Text } from 'rebass'

import { useActiveWeb3React } from 'services/web3'
import { useIsUserAddedPair } from 'hooks/Tokens'
import { useAllPairs } from 'hooks/useAllPairs'
import { usePairAdder, usePairRemover } from 'state/user/hooks'
import { isPairOnList } from 'utils'
// import { Badge } from '../../Badge'
import DoubleCurrencyLogo from '../../DoubleLogo'
import { TokenPickerItem } from '../shared'

interface PairRowProps {
  pair: Pair
  style: CSSProperties
  onSelect: () => void
  isSelected: boolean
}

interface PairListProps {
  pairs: Pair[]
  otherPair?: Pair | null
  onPairSelect: (pair: Pair) => void
  selectedPair?: Pair | null
}

function pairKey(index: number, data: Pair[]) {
  return data[index].liquidityToken.address
}

const PairRow = ({ pair, onSelect, isSelected, style }: PairRowProps) => {
  const { chainId } = useActiveWeb3React()
  const { pairs: allPairs } = useAllPairs()
  const isOnSelectedList = isPairOnList(allPairs, pair[chainId ?? ChainId.FANTOM])
  const customAdded = useIsUserAddedPair(pair[chainId ?? ChainId.FANTOM])

  const removePair = usePairRemover()
  const addPair = usePairAdder()

  const pairText = `${pair.token0[chainId ?? ChainId.FANTOM]?.symbol || ''}/${pair.token1[chainId ?? ChainId.FANTOM]?.symbol || ''}`

  // only show add or remove buttons if not on selected list
  return (
    <TokenPickerItem
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      alignItems="center"
      px="20px"
    >
      <Box mr="8px">
        <DoubleCurrencyLogo 
          // currency0={pair.token0} 
          // currency1={pair.token1} 
          size={20} 
        />
      </Box>
      <Box>
        <Text title={pairText} fontWeight={500}>
          {pairText}
        </Text>
      </Box>
      <Flex flex="1" px="20px">
        {!isOnSelectedList && (
          <Box>
            {/* <Badge
              label={customAdded ? 'Added by user' : 'Found by address'}
              icon={customAdded ? X : Plus}
              onClick={event => {
                event.stopPropagation()
                if (!chainId) {
                  return
                }
                if (customAdded) {
                  removePair(pair)
                } else {
                  addPair(pair)
                }
              }}
            /> */}
          </Box>
        )}
      </Flex>
    </TokenPickerItem>
  )
}

export const PairList = ({ pairs, selectedPair, onPairSelect }: PairListProps) => {
  const Row = useCallback(
    ({ data, index, style }: { data: any; index: number; style: CSSProperties }) => {
      const pair = data[index]
      const isSelected = Boolean(selectedPair && selectedPair == pair
        // .equals(pair)
        )
      const handleSelect = () => onPairSelect(pair)
      return <PairRow style={style} pair={pair} isSelected={isSelected} onSelect={handleSelect} />
    },
    [onPairSelect, selectedPair]
  )

  return (
    <Flex overflowY="auto" flex="1">
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ width, height }: { width: string | number; height: string | number }) => (
          <>
            <FixedSizeList
              width={width}
              height={height}
              itemData={pairs}
              itemCount={pairs.length}
              itemSize={56}
              itemKey={pairKey}
            >
              {Row}
            </FixedSizeList>
          </>
        )}
      </AutoSizer>
    </Flex>
  )
}