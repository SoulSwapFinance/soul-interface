// import { DuplicateIcon } from '@heroicons/react/24/outline'
// import { CheckIcon } from '@heroicons/react/24/solid'
import { CurrencyLogo } from 'components/CurrencyLogo'
// import DoubleCurrencyLogo from 'components/DoubleLogo'
// import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
// import Background from 'features/analytics/Background'
import ChartCard from 'features/analytics/ChartCard'
// import InfoCard from 'features/analytics/InfoCard'
// import { LegacyTransactions } from 'features/transactions/Transactions'
// import { getExplorerLink } from 'functions/explorer'
import { formatNumber, shortenAddress } from 'functions/format'
import { useCurrency } from 'hooks/Tokens'
// import useCopyClipboard from 'hooks/useCopyClipboard'
import { useNativePrice, useOneDayBlock, usePairDayData, usePairs, useTwoDayBlock } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { times } from 'lodash'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
// import { ExternalLink as LinkIcon } from 'react-feather'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
// import { getChainColor, getChainColorCode } from 'constants/chains'
// import Typography from 'components/Typography'
// import { TridentHeader } from 'layouts/Trident'
import { computePairAddress } from 'sdk/functions/computePairAddress'
import { ChainId, Currency, FACTORY_ADDRESS, NATIVE, Token, WNATIVE_ADDRESS } from 'sdk'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

const ONE_DAY = 86_400

const chartTimespans = [
  {
    text: 'WEEK',
    length: 604_800,
  },
  {
    text: 'MONTH',
    length: 2629746,
  },
  {
    text: 'YEAR',
    length: ONE_DAY * 365,
  },
  // {
  //   text: '240D',
  //   length: ONE_DAY * 240,
  // },
]

interface PairProps {
  inputCurrency?: Currency | Token | undefined
  outputCurrency?: Currency | Token | undefined
}

function PairChart({ inputCurrency, outputCurrency }: PairProps) {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const id = (inputCurrency && outputCurrency)
    ? inputCurrency && outputCurrency && computePairAddress({
      factoryAddress: FACTORY_ADDRESS[chainId ? chainId : ChainId.FANTOM],
      tokenA: inputCurrency?.isToken ? inputCurrency : inputCurrency?.wrapped,
      tokenB: outputCurrency?.isToken ? outputCurrency : outputCurrency?.wrapped,
    }).toLowerCase() // pairAddress
    : (router.query.id as string)?.toLowerCase() // router string

  // const id = pairAddress ?? (router.query.id as string).toLowerCase()

  // const [isCopied, setCopied] = useCopyClipboard()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const pair = usePairs({ chainId, variables: { where: { id } }, shouldFetch: !!chainId })?.[0]
  const pair1d = usePairs({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!chainId && !!block1d,
  })?.[0]
  const pair2d = usePairs({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!chainId && !!block2d,
  })?.[0]

  const pairDayData = usePairDayData({
    chainId: chainId,
    variables: { where: { pair: id?.toLowerCase() } },
    shouldFetch: !!chainId && !!id,
  })

  const nativePrice = useNativePrice({ chainId, shouldFetch: !!chainId })

  // For the charts
  const chartData = useMemo(
    () => ({
      liquidity: pair?.reserveUSD,
      liquidityChange: (pair?.reserveUSD / pair1d?.reserveUSD) * 100 - 100,
      liquidityChart: pairDayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.reserveUSD) })),

      volume1d: pair?.volumeUSD - pair1d?.volumeUSD,
      volume1dChange: ((pair?.volumeUSD - pair1d?.volumeUSD) / (pair1d?.volumeUSD - pair2d?.volumeUSD)) * 100 - 100,
      volumeChart: pairDayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),
    }),
    [pair, pair1d, pair2d, pairDayData]
  )

  // for logos
  const currency0 = useCurrency(pair?.token0?.id)
  const currency1 = useCurrency(pair?.token1?.id)

  // for links
  const token0Address = currency0?.isToken ? currency0.address : currency0?.wrapped.address
  const token1Address = currency1?.isToken ? currency1.address : currency1?.wrapped.address
  
  const zeroIsETH = currency0?.wrapped.address == WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM]
  const oneIsETH = currency1?.wrapped.address == WNATIVE_ADDRESS[chainId ?? ChainId.FANTOM]
  
  const token0Symbol = zeroIsETH ? NATIVE[chainId ?? ChainId.FANTOM].symbol : currency0?.wrapped.symbol
  const token1Symbol = oneIsETH ? NATIVE[chainId ?? ChainId.FANTOM].symbol : currency1?.wrapped.symbol

  // const containsETH = zeroIsETH || oneIsETH

  // const PAIR_URL =
  //   containsETH && zeroIsETH
  //     ? `${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${token1Address}`
  //     : containsETH && oneIsETH
  //       ? `${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${token0Address}`
  //       : `${token0Address}/${token1Address}`

  // for info cards
  // const liquidityUSDChange = pair?.reserveUSD / pair1d?.reserveUSD

  const volumeUSD1d = pair?.volumeUSD - pair1d?.volumeUSD
  const volumeUSD2d = pair1d?.volumeUSD - pair2d?.volumeUSD
  // const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  const tx1d = pair?.txCount - pair1d?.txCount
  const tx2d = pair1d?.txCount - pair2d?.txCount
  // const tx1dChange = (tx1d / tx2d) * 100 - 100

  const avgTrade1d = volumeUSD1d / tx1d
  const avgTrade2d = volumeUSD2d / tx2d
  // const avgTrade1dChange = (avgTrade1d / avgTrade2d) * 100 - 100

  const utilisation1d = (volumeUSD1d / pair?.reserveUSD) * 100
  const utilisation2d = (volumeUSD2d / pair1d?.reserveUSD) * 100
  // const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  return (
      <div className="px-4 pt-4 space-y-4 lg:px-14 mb-8">
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-sm:grid-cols-${chainId && chainId == ChainId.FANTOM ? '2' : '1'}`}>
          <ChartCard
            header="Liquidity"
            subheader={`${token0Symbol}-${token1Symbol}`}
            figure={chartData.liquidity}
            change={chartData.liquidityChange}
            chart={chartData.liquidityChart}
            defaultTimespan="WEEK"
            timespans={chartTimespans}
          />
          { chainId && chainId == ChainId.FANTOM &&
            <ChartCard
            header="Volume"
            subheader={`${token0Symbol}-${token1Symbol}`}
            figure={chartData.volume1d}
            change={chartData.volume1dChange}
            chart={chartData.volumeChart}
            defaultTimespan="WEEK"
            timespans={chartTimespans}
          />
          }
        </div>
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-${chainId && chainId == ChainId.FANTOM ? '2' : '1'}`}>
          {times(2).map((i) => (
            <div key={i} className="w-full p-6 space-y-2 border rounded bg-dark-1000 border-dark-700">
              <NavLink href={`/analytics/tokens/${[token0Address, token1Address][i]}`}>
                <Button
                  className={`w-full hover:border hover:border-purple`}
                // variant="filled"
                // color={getChainColorCode(chainId)}
                >
                  <div className="flex flex-row items-center space-x-2">
                    <CurrencyLogo size={32} currency={[currency0, currency1][i]} />
                    <div className="text-2xl text-center font-bold">{formatNumber([pair?.reserve0, pair?.reserve1][i])}</div>
                    <div className="text-xl m-1 text-white font-bold">{[pair?.token0, pair?.token1][i]?.symbol}</div>
                  </div>
                </Button>
              </NavLink>
              <div className="font-bold">
                1 {[pair?.token0, pair?.token1][i]?.symbol} = {formatNumber([pair?.token1Price, pair?.token0Price][i])}{' '}
                {[pair?.token1, pair?.token0][i]?.symbol} (
                {formatNumber([pair?.token0, pair?.token1][i]?.derivedETH * nativePrice, true)})
              </div>
            </div>
          ))}
        </div>

      </div>
  )
}

export default PairChart
PairChart.Guard = NetworkGuard(Feature.ANALYTICS)