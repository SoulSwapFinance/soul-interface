import Search from 'components/Search'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import PairList from 'features/analytics/Pairs/PairList'
import PairTabs from 'features/analytics/Pairs/PairTabs'
import useFuse from 'hooks/useFuse'
import { useOneDayBlock, useOneWeekBlock, useSoulPairs, useTwoDayBlock, useTwoWeekBlock } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { getChainColor, getChainColorCode } from 'constants/chains'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import SwapDropdown from 'features/swap/SwapDropdown'
import { SwapLayoutCard } from 'layouts/SwapLayout'
import ExchangeAnalyticsHeader from 'features/analytics/ExchangeAnalyticsHeader'

export default function Pairs() {
  const [type, setType] = useState<'all' | 'gainers' | 'losers'>('all')

  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })
  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })
  const block2w = useTwoWeekBlock({ chainId, shouldFetch: !!chainId })

  const pairs = useSoulPairs({ chainId })
  const pairs1d = useSoulPairs({ variables: { block: block1d }, shouldFetch: !!block1d, chainId })
  const pairs2d = useSoulPairs({ variables: { block: block2d }, shouldFetch: !!block2d && type !== 'all', chainId }) // No need to fetch if we don't need the data
  const pairs1w = useSoulPairs({ variables: { block: block1w }, shouldFetch: !!block1w, chainId })
  const pairs2w = useSoulPairs({ variables: { block: block2w }, shouldFetch: !!block2w && type !== 'all', chainId })

  const pairsFormatted = useMemo(() => {
    return type === 'all'
      ? pairs?.map((pair) => {
        const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
        const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
            id: pair.id,
          },
          liquidity: pair.reserveUSD,
          volume1d: pair.volumeUSD - pair1d.volumeUSD,
          volume1w: pair.volumeUSD - pair1w.volumeUSD,
        }
      })
      : pairs
        ?.map((pair) => {
          const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
          const pair2d = pairs2d?.find((p) => pair.id === p.id) ?? pair1d
          const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair2d
          const pair2w = pairs2w?.find((p) => pair.id === p.id) ?? pair1w

          return {
            pair: {
              token0: pair.token0,
              token1: pair.token1,
              id: pair.id,
            },
            liquidityChangeNumber1d: pair.reserveUSD - pair1d.reserveUSD,
            liquidityChangePercent1d: (pair.reserveUSD / pair1d.reserveUSD) * 100 - 100,
            liquidityChangeNumber1w: pair.reserveUSD - pair1w.reserveUSD,
            liquidityChangePercent1w: (pair.reserveUSD / pair1w.reserveUSD) * 100 - 100,

            volumeChangeNumber1d: pair.volumeUSD - pair1d.volumeUSD - (pair1d.volumeUSD - pair2d.volumeUSD),
            volumeChangePercent1d:
              ((pair.volumeUSD - pair1d.volumeUSD) / (pair1d.volumeUSD - pair2d.volumeUSD)) * 100 - 100,
            volumeChangeNumber1w: pair.volumeUSD - pair1w.volumeUSD - (pair1w.volumeUSD - pair2w.volumeUSD),
            volumeChangePercent1w:
              ((pair.volumeUSD - pair1w.volumeUSD) / (pair1w.volumeUSD - pair2w.volumeUSD)) * 100 - 100,
          }
        })
        .sort((a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d)
  }, [type, pairs, pairs1d, pairs2d, pairs1w, pairs2w])

  const options = useMemo(
    () => ({
      keys: ['pair.token0.symbol', 'pair.token1.symbol', 'pair.token0.name', 'pair.token1.name'],
      threshold: 0.4,
    }),
    []
  )

  const {
    result: pairsSearched,
    term,
    search,
  } = useFuse({
    data: pairsFormatted,
    options,
  })

  return (
  <Container id="exchange-analytics-pairs-page" maxWidth="2xl" className="space-y-4 mt-4">
      <DoubleGlowShadowV2>
        <SwapLayoutCard>
        <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>
            <SwapDropdown />
            <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>          <AnalyticsContainer>
          <ExchangeAnalyticsHeader />
      <Background background="pools">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Pairs</div>
            <div className="">Click headers to sort by TVL, volume, or fees.</div>
          </div>
          <Search term={term} search={search} />
        </div>
      </Background>
      <PairTabs currentType={type} setType={setType} />
      <div className="px-4 pt-4 lg:px-14">
        <PairList pairs={pairsSearched} type={type} />
      </div>
          </AnalyticsContainer>
        </SwapLayoutCard>
      </DoubleGlowShadowV2>
    </Container>
  )
}