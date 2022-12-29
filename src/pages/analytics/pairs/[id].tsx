// import { DuplicateIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'
import { CurrencyLogo } from 'components/CurrencyLogo'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import ChartCard from 'features/analytics/ChartCard'
import InfoCard from 'features/analytics/InfoCard'
import { LegacyTransactions } from 'features/transactions/Transactions'
import { getExplorerLink } from 'functions/explorer'
import { formatNumber, shortenAddress } from 'functions/format'
import { useCurrency } from 'hooks/Tokens'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { useNativePrice, useOneDayBlock, usePairDayData, useSoulPairs, useTwoDayBlock } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { times } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
import Typography from 'components/Typography'
import { TridentHeader } from 'layouts/Trident'
import { computePairAddress } from 'sdk/functions/computePairAddress'
import { Currency, FACTORY_ADDRESS, NATIVE, Token, WNATIVE_ADDRESS } from 'sdk'

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

interface PairProps {
  inputCurrency?: Currency | Token | undefined
  outputCurrency?: Currency | Token | undefined
}

export default function Pair({ inputCurrency, outputCurrency }: PairProps) {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const id = (inputCurrency && outputCurrency)
    ? inputCurrency && outputCurrency && computePairAddress({
      factoryAddress: FACTORY_ADDRESS[chainId],
      tokenA: inputCurrency?.isToken ? inputCurrency : inputCurrency?.wrapped,
      tokenB: outputCurrency?.isToken ? outputCurrency : outputCurrency?.wrapped,
    }).toLowerCase() // pairAddress
    : (router.query.id as string).toLowerCase() // router string

  // const id = pairAddress ?? (router.query.id as string).toLowerCase()

  const [isCopied, setCopied] = useCopyClipboard()

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId })
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId })

  const pair = useSoulPairs({ chainId, variables: { where: { id } }, shouldFetch: !!chainId })?.[0]
  const pair1d = useSoulPairs({
    chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!chainId && !!block1d,
  })?.[0]
  const pair2d = useSoulPairs({
    chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!chainId && !!block2d,
  })?.[0]

  const pairDayData = usePairDayData({
    chainId,
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
  
  const zeroIsETH = currency0?.wrapped.address == WNATIVE_ADDRESS[chainId]
  const oneIsETH = currency1?.wrapped.address == WNATIVE_ADDRESS[chainId]
  
  const token0Symbol = zeroIsETH ? NATIVE[chainId].symbol : currency0?.wrapped.symbol
  const token1Symbol = oneIsETH ? NATIVE[chainId].symbol : currency1?.wrapped.symbol

  const containsETH = zeroIsETH || oneIsETH

  const PAIR_URL =
    containsETH && zeroIsETH
      ? `${NATIVE[chainId].symbol}/${token1Address}`
      : containsETH && oneIsETH
        ? `${NATIVE[chainId].symbol}/${token0Address}`
        : `${token0Address}/${token1Address}`

  // for info cards
  const liquidityUSDChange = pair?.reserveUSD / pair1d?.reserveUSD

  const volumeUSD1d = pair?.volumeUSD - pair1d?.volumeUSD
  const volumeUSD2d = pair1d?.volumeUSD - pair2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100

  const tx1d = pair?.txCount - pair1d?.txCount
  const tx2d = pair1d?.txCount - pair2d?.txCount
  const tx1dChange = (tx1d / tx2d) * 100 - 100

  const avgTrade1d = volumeUSD1d / tx1d
  const avgTrade2d = volumeUSD2d / tx2d
  const avgTrade1dChange = (avgTrade1d / avgTrade2d) * 100 - 100

  const utilisation1d = (volumeUSD1d / pair?.reserveUSD) * 100
  const utilisation2d = (volumeUSD2d / pair1d?.reserveUSD) * 100
  const utilisation1dChange = (utilisation1d / utilisation2d) * 100 - 100

  return (
    <AnalyticsContainer>
      <div className="relative h-8">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-purple opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics">Dashboard</Link>&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/coffinbox">CoffinBox</Link>&nbsp;
          </div>
          <div className={`text-xs font-bold text-high-emphesis m-1 text-${getChainColorCode(chainId)}`}>
            Pairs&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/tokens">Tokens</Link>&nbsp;
          </div>
        </div>
      </div>
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div className="space-y-4">
          <div className="flex items-center mt-2 space-x-4">
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              size={54}
            />
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {token0Symbol}-{token1Symbol}
            </Typography>
          </div>
          <Typography variant="sm" weight={400}>
            Dive deeper in the analytics of the {token0Symbol}-{token1Symbol} liquidity pool.
          </Typography>
        </div>
      </TridentHeader>
      <div className="px-4 pt-4 space-y-4 lg:px-14">
        <div className="relative h-12">
          <div className="absolute w-full h-full">
            <div className="h-1/3" />
            <div className="opacity-50 w-[210px] h-1/3 bg-gradient-to-r from-blue to-purple" />
          </div>
          <div className="absolute text-3xl font-bold text-high-emphesis">Pool Overview</div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ChartCard
            header="Liquidity"
            subheader={`${token0Symbol}-${token1Symbol}`}
            figure={chartData.liquidity}
            change={chartData.liquidityChange}
            chart={chartData.liquidityChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
          <ChartCard
            header="Volume"
            subheader={`${token0Symbol}-${token1Symbol}`}
            figure={chartData.volume1d}
            change={chartData.volume1dChange}
            chart={chartData.volumeChart}
            defaultTimespan="1W"
            timespans={chartTimespans}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
          <InfoCard text="Liquidity (24h)" number={pair?.reserveUSD} percent={liquidityUSDChange} />
          <InfoCard text="Volume (24h)" number={volumeUSD1d} percent={volumeUSD1dChange} />
          <InfoCard text="Fees (24h)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
        </div>
        <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
          <InfoCard text="Tx (24h)" number={!isNaN(tx1d) ? tx1d : ''} numberType="text" percent={tx1dChange} />
          <InfoCard text="Avg. Trade (24h)" number={avgTrade1d} percent={avgTrade1dChange} />
          <InfoCard
            text="Utilisation (24h)"
            number={utilisation1d}
            numberType="percent"
            percent={utilisation1dChange}
          />
        </div>
        {/* <div className="text-3xl font-bold text-high-emphesis">Information</div> */}
        <NavLink
          href={`/add/${PAIR_URL}`}
        >
          <Button
            size="xs"
            variant="filled"
            color={getChainColorCode(chainId)}
          >
            {`ADD LIQUIDITY`}
          </Button>
        </NavLink>
        <div>
          <div className="px-4 text-sm leading-48px text-high-emphesis">
            <table className="w-full table-fixed">
              <thead className="border-b border-gray-900">
                <tr>
                  <td>
                    {token0Symbol}-{token1Symbol} Address
                  </td>
                  <td>{token0Symbol} Address</td>
                  <td>{token1Symbol} Address</td>
                </tr>
              </thead>
              <tbody className="border-b border-gray-900 ">
                <tr>
                  <td>
                    <div className="flex items-center justify-center w-11/12 space-x-1">
                      {/* <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{pair?.id}</div> */}
                      <Link href={`/analytics/pairs/${pair?.id}`} passHref>
                      <div className={`overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-${getChainColorCode(chainId)}`}>
                          {pair?.id}
                        </div>
                      </Link>
                      <a href={getExplorerLink(chainId, pair?.id, 'token')} target="_blank" rel="noreferrer">
                        <LinkIcon size={16} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center w-11/12 space-x-1">
                      <Link href={`/analytics/tokens/${pair?.token0?.id}`} passHref>
                      <div className={`overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-${getChainColorCode(chainId)}`}>
                          {pair?.token0?.id}
                        </div>
                      </Link>
                      <a href={getExplorerLink(chainId, pair?.token0?.id, 'token')} target="_blank" rel="noreferrer">
                        <LinkIcon size={16} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center w-11/12 space-x-1">
                      <Link href={`/analytics/tokens/${pair?.token1?.id}`} passHref>
                        <div className={`overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap text-${getChainColorCode(chainId)}`}>
                          {pair?.token1?.id}
                        </div>
                      </Link>
                      <a href={getExplorerLink(chainId, pair?.token1?.id, 'token')} target="_blank" rel="noreferrer">
                        <LinkIcon size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <LegacyTransactions pairs={[id]} />
      </div>
    </AnalyticsContainer>
  )
}