import Search from 'components/Search'
import { Feature } from 'enums'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import InfoCard from 'features/analytics/Bar/InfoCard'
import TokenList from 'features/analytics/Tokens/TokenList'
import { featureEnabled } from 'functions/feature'
import { formatNumber } from 'functions/format'
import useFuse from 'hooks/useFuse'
import { useCoffinBox, useNativePrice, useOneDayBlock, useOneWeekBlock, useTokens } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { TridentBody, TridentHeader } from 'layouts/Trident'
import NetworkGuard from 'guards/Network'

function CoffinBox(): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId })

  const nativePrice = useNativePrice({ chainId })
  const nativePrice1d = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const nativePrice1w = useNativePrice({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  // Get exchange data
  const tokens = useTokens({ chainId })
  const tokens1d = useTokens({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })
  const tokens1w = useTokens({ chainId, variables: { block: block1w }, shouldFetch: !!block1w })

  // Creating map to easily reference TokenId -> Token
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

  // Combine CoffinBox Box Tokens with Token data from exchange
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

  const {
    result: searched,
    term,
    search,
  } = useFuse({
    options: {
      keys: ['token.address', 'token.symbol', 'token.name'],
      threshold: 0.4,
    },
    data: coffinBoxTokensFormatted,
  })

  return (
    <AnalyticsContainer>
      <div className="relative h-8 mt-4">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-purple opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics">Dashboard</Link>&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/pairs">Pairs</Link>&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/tokens">Tokens</Link>&nbsp;
          </div>
        </div>
      </div>
      <TridentBody>
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">CoffinBox</div>
            <div className="">Click headers to sort by price or liquidity.</div>
          </div>
          <Search term={term} search={search} />
        </div>
      </TridentBody>
      <div className="py-6 space-y-4 lg:px-14">
        {/* <div className="text-2xl font-bold text-high-emphesis">Overview</div> */}
        <div className="flex flex-row space-x-4 overflow-auto">
          <InfoCard
            text="TVL"
            number={formatNumber(
              coffinBoxTokensFormatted.reduce((prev, curr) => prev + curr.liquidity, 0),
              true,
              false
            )}
          />
          {/* <InfoCard text="Accounts" number={formatNumber(coffinBox?.totalUsers)} /> */}
          <InfoCard text="Tokens" number={coffinBox?.totalTokens} />
          {/* <InfoCard text="Total Underworld Pairs" number={coffinBox?.totalUnderworldPairs} /> */}
          <InfoCard text="Pairs" number={coffinBox?.totalUnderworldPairs > 0 ? coffinBox?.totalUnderworldPairs : 6} />
        </div>
      </div>
      <div className="py-6 space-y-4 text-2xl font-bold text-high-emphesis lg:px-14">Tokens</div>
      <div className="pt-4 lg:px-14">
        <TokenList tokens={searched} enabledColumns={['name', 'liquidity', 'price', 'priceChange']} />
      </div>
    </AnalyticsContainer>
  )
}

export default CoffinBox
CoffinBox.Guard = NetworkGuard(Feature.ANALYTICS)