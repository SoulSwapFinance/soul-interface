import Search from 'components/Search'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import ChartCard from 'features/analytics/ChartCard'
import DashboardTabs from 'features/analytics/Dashboard/DashboardTabs'
// import PoolList from 'features/analytics/Farms/FarmList'
import PairList from 'features/analytics/Pairs/PairList'
import TokenList from 'features/analytics/Tokens/TokenList'
import useFuse from 'hooks/useFuse'
import {
  useCoffinBox,
  useDayData,
  useFactory,
  useNativePrice,
  useOneDayBlock,
  useOneWeekBlock,
  useSoulPairs,
  useTokens,
  useTwoDayBlock,
} from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
// import CoffinBox from '../coffinbox'
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'
import { getChainColor, getChainColorCode } from 'constants/chains'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import SwapDropdown from 'features/swap/SwapDropdown'
import { SwapLayoutCard } from 'layouts/SwapLayout'
import ExchangeAnalyticsHeader from 'features/analytics/ExchangeAnalyticsHeader'

const chartTimespans = [
  {
    text: '1W',
    length: 604800,
  },
  {
    text: '1M',
    length: 2629746,
  },
  {
    text: '1Y',
    length: 31556952,
  },
  {
    text: 'ALL',
    length: Infinity,
  },
]

export default function Dashboard(): JSX.Element {
  const [type, setType]
    = useState<'coffin' | 'pairs' | 'tokens'>('pairs')
  // = useState<'pools' | 'pairs' | 'tokens'>('pools')

  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })
  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })

  // For the charts
  const exchange = useFactory({ chainId })
  const exchange1d = useFactory({ chainId, variables: { block: block1d } })
  const exchange2d = useFactory({ chainId, variables: { block: block2d } })

  const dayData = useDayData({ chainId })

  const chartData = useMemo(
    () => ({
      liquidity: exchange?.liquidityUSD,
      liquidityChange: (exchange1d?.liquidityUSD / exchange2d?.liquidityUSD) * 100 - 100,
      liquidityChart: dayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volume1d: exchange?.volumeUSD - exchange1d?.volumeUSD,
      volume1dChange:
        ((exchange?.volumeUSD - exchange1d?.volumeUSD) / (exchange1d?.volumeUSD - exchange2d?.volumeUSD)) * 100 - 100,
      volumeChart: dayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [exchange, exchange1d, exchange2d, dayData]
  )

  // For Top Pairs
  const pairs = useSoulPairs({ chainId })
  const pairs1d = useSoulPairs({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const pairs1w = useSoulPairs({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  const pairsFormatted = useMemo(
    () =>
      // @ts-ignore TYPE NEEDS FIXING
      pairs?.map((pair) => {
        // @ts-ignore TYPE NEEDS FIXING
        const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair
        // @ts-ignore TYPE NEEDS FIXING
        const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d

        return {
          pair: {
            token0: pair.token0,
            token1: pair.token1,
            id: pair.id,
          },
          liquidity: pair.reserveUSD,
          volume1d: pair.volumeUSD - pair1d?.volumeUSD,
          volume1w: pair.volumeUSD - pair1w?.volumeUSD,
        }
      }),
    [pairs, pairs1d, pairs1w]
  )

  // For Top Farms
  //   const farms = useFarmRewards()
  //   const nativePrice = useNativePrice({ chainId })
  //   const farmsFormatted = useMemo(
  //     () =>
  //       farms
  //         ?.map((farm) => ({
  //           pair: {
  //             token0: farm.pair.token0,
  //             token1: farm.pair.token1,
  //             id: farm.pair.id,
  //             name: farm.pair.symbol ?? `${farm.pair.token0.symbol}-${farm.pair.token1.symbol}`,
  //             type: farm.pair.symbol ? 'Underworld Farm' : 'Soul Farm',
  //           },
  //           rewards: farm.rewards,
  //           liquidity: farm.tvl,
  //           apr: {
  //             daily: (farm.roiPerYear / 365) * 100,
  //             monthly: (farm.roiPerYear / 12) * 100,
  //             annual: farm.roiPerYear * 100,
  //           },
  //         }))
  //         .filter((farm) => (farm ? true : false)),
  //     [farms]
  //   )

  // For Top Tokens
  const nativePrice1d = useNativePrice({ chainId, variables: { block: block1d } })
  const nativePrice1w = useNativePrice({ chainId, variables: { block: block1w } })

  const tokens = useTokens({ chainId })
  const tokens1d = useTokens({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const tokens1w = useTokens({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  const tokensFormatted = useMemo(
    () =>
      tokens && tokens1d && tokens1w && nativePrice1d && nativePrice1d && nativePrice1w
        ? // @ts-ignore TYPE NEEDS FIXING
        tokens.map((token) => {
          // @ts-ignore TYPE NEEDS FIXING
          const token1d = tokens1d.find((p) => token.id === p.id) ?? token
          // @ts-ignore TYPE NEEDS FIXING
          const token1w = tokens1w.find((p) => token.id === p.id) ?? token

          return {
            token: {
              id: token.id,
              symbol: token.symbol,
              name: token.name,
            },
            liquidity: token.liquidity * token.derivedETH * nativePrice1d,
            volume1d: token.volumeUSD - token1d.volumeUSD,
            volume1w: token.volumeUSD - token1w.volumeUSD,
            price: token.derivedETH * nativePrice1d,
            change1d: ((token.derivedETH * nativePrice1d) / (token1d.derivedETH * nativePrice1d)) * 100 - 100,
            change1w: ((token.derivedETH * nativePrice1d) / (token1w.derivedETH * nativePrice1w)) * 100 - 100,
            graph: token.dayData
              .slice(0)
              .reverse()
              // @ts-ignore TYPE NEEDS FIXING
              .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
          }
        })
        : [],
    [nativePrice1d, nativePrice1d, nativePrice1w, tokens, tokens1d, tokens1w]
  )

  // For Top Markets
  const nativePrice = useNativePrice({ chainId })

  const tokenIdToPrice = useMemo<
    Map<string, { derivedETH: number; volumeUSD: number; dayData: Array<{ priceUSD: number }> }>
  >(() => {
    return new Map(tokens?.map((token) => [token.id, token]))
  }, [tokens])

  const token1dIdToPrice = useMemo<Map<string, { derivedETH: number; volumeUSD: number }>>(() => {
    return new Map(tokens1d?.map((token) => [token.id, token]))
  }, [tokens1d])

  const token1wIdToPrice = useMemo<Map<string, { derivedETH: number; volumeUSD: number }>>(() => {
    return new Map(tokens1w?.map((token) => [token.id, token]))
  }, [tokens1w])

  const coffinBox = useCoffinBox({ chainId, shouldFetch: featureEnabled(Feature.COFFINBOX, chainId) })

  const coffinBoxTokensFormatted = useMemo<Array<any>>(
    () =>
      (coffinBox?.tokens || [])

        .map(({ id, totalSupplyElastic, decimals, symbol, name }) => {
          const token = tokenIdToPrice.get(id)
          const token1d = token1dIdToPrice.get(id)
          const token1w = token1wIdToPrice.get(id)

          const supply = totalSupplyElastic / Math.pow(10, decimals)
          const tokenDerivedETH = token?.derivedETH
          const price = (tokenDerivedETH ?? 0) * nativePrice
          const tvl = price * supply

          const token1dPrice = (token1d?.derivedETH ?? 0) * nativePrice1d
          const token1wPrice = (token1w?.derivedETH ?? 0) * nativePrice1w

          return {
            token: {
              id,
              symbol,
              name,
            },
            price,
            liquidity: tvl,
            change1d: (price / token1dPrice) * 100 - 100,
            change1w: (price / token1wPrice) * 100 - 100,
            graph: token?.dayData
              .slice(0)
              .reverse()
              .map((day, i) => ({ x: i, y: Number(day.priceUSD) })),
          }
        })
        .filter(Boolean),
    [coffinBox, tokenIdToPrice, nativePrice, token1dIdToPrice, token1wIdToPrice, nativePrice1d, nativePrice1w]
  )

  const { options, data } = useMemo(() => {
    switch (type) {
      // case 'pools':
      //   return {
      //       options: {
      //         keys: [
      //           'pair.token0.id',
      //           'pair.token0.symbol',
      //           'pair.token0.name',
      //           'pair.token1.id',
      //           'pair.token1.symbol',
      //           'pair.token1.name',
      //         ],
      //         threshold: 0.4,
      //       },
      //       data: farmsFormatted,
      // }

      case 'pairs':
        return {
          options: {
            keys: [
              'pair.token0.id',
              'pair.token0.symbol',
              'pair.token0.name',
              'pair.token1.id',
              'pair.token1.symbol',
              'pair.token1.name',
            ],
            threshold: 0.4,
          },
          data: pairsFormatted,
        }

      case 'tokens':
        return {
          options: {
            keys: ['token.id', 'token.symbol', 'token.name'],
            threshold: 0.4,
          },
          data: tokensFormatted,
        }

      case 'coffin':
        return {
          options: {
            keys: ['coffin.token.id', 'coffin.token.symbol', 'coffin.token.name'],
            threshold: 0.4,
          },
          data: coffinBoxTokensFormatted,
        }
    }
  }, [type, pairsFormatted, tokensFormatted])

  const {
    result: searched,
    term,
    search,
  } = useFuse({
    data,
    options,
  })

  return (
	<Container id="exchange-analytics-coffinbox-page" maxWidth="2xl" className="space-y-4 mt-4">
      <DoubleGlowShadowV2>
        <SwapLayoutCard>
        <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>
            <SwapDropdown />
            <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>          <AnalyticsContainer>
            <ExchangeAnalyticsHeader />
            {/* <Background background="dashboard">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Soul Analytics</div>
            <div className="">
              Dive deeper in the analytics of
              <br /> pools, pairs and tokens.
            </div>
          </div>
          <Search term={term} search={search} />
        </div>
      </Background> */}
            <div className="px-4 py-6 space-y-4 lg:px-14">
              {/* <div className="text-center text-2xl font-bold text-high-emphesis">Dashboard Overview</div> */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ChartCard
                  header="TVL"
                  subheader="SOUL AMM"
                  figure={chartData.liquidity}
                  change={chartData.liquidityChange}
                  chart={chartData.liquidityChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
                <ChartCard
                  header="Volume"
                  subheader="SOUL AMM"
                  figure={chartData.volume1d}
                  change={chartData.volume1dChange}
                  chart={chartData.volumeChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
              </div>
            </div>
            <DashboardTabs currentType={type} setType={setType} />
            <div className="px-4 pt-4 lg:px-14">
              {type === 'pairs' && <PairList pairs={searched} type={'all'} />}
              {type === 'tokens' && <TokenList tokens={searched} />}
              {type === 'coffin' && <TokenList tokens={searched} />}
            </div>
          </AnalyticsContainer>
        </SwapLayoutCard>
      </DoubleGlowShadowV2>
    </Container>
  )
}