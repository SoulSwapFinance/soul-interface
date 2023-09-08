// import { CurrencyLogo } from 'components/CurrencyLogo'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
// import Background from 'features/analytics/Background'
import { Currency, Token as ERC20 } from 'sdk'
import ChartCard from 'features/analytics/ChartCard'
// import ColoredNumber from 'features/analytics/ColoredNumber'
// import InfoCard from 'features/analytics/InfoCard'
// import PairList from 'features/analytics/Pairs/PairList'
// import { LegacyTransactions } from 'features/transactions/Transactions'
// import { getExplorerLink } from 'functions/explorer'
// import { formatNumber } from 'functions/format'
// import { useCurrency } from 'hooks/Tokens'
import { useTokenContract } from 'hooks/useContract'
// import useCopyClipboard from 'hooks/useCopyClipboard'
// import Image from 'next/image'
import {
  useNativePrice,
  useOneDayBlock,
  // useOneWeekBlock,
  useTokenDayData,
  // useTokenPairs,
  useTokens,
  useTwoDayBlock,
} from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
// import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
// import { CheckCircle, ExternalLink as LinkIcon } from 'react-feather'
// import { getChainColorCode, getChainInfo, getChainLogoURL } from 'constants/chains'
// import { NextSeo } from 'next-seo'
// import { TridentHeader } from 'layouts/Trident'
// import Typography from 'components/Typography'
// import useAddTokenToMetaMask from 'hooks/useAddTokenToMetaMask'
import { Button } from 'components/Button'
// import { RowFixed } from 'components/Row'
// import { getAddress } from '@ethersproject/address'
import NavLink from 'components/NavLink'
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
    length: 2_629_746,
  },
  {
    text: 'YEAR',
    length: ONE_DAY * 365,
  },
]

interface TokenProps {
  // inputCurrency?: Currency | Token | undefined
  outputCurrency?: Currency | ERC20 | undefined
}

function Token({ outputCurrency }: TokenProps) {
  const router = useRouter()
  const id = outputCurrency?.wrapped.address.toLowerCase()
  // const tokenAddress = id

  const { chainId, library } = useActiveWeb3React()
  // const [isCopied, setCopied] = useCopyClipboard()

  const [totalSupply, setTotalSupply] = useState(0)
  const [tokenDecimals, setTokenDecimals] = useState(18)
  // const [totalSupply, setTotalSupply] = useState(0)
  const tokenContract = useTokenContract(id)

  useEffect(() => {
    const fetch = async () => {
      setTotalSupply(await tokenContract?.totalSupply())
      setTokenDecimals(await tokenContract?.decimals())
    }
    fetch()
  }, [tokenContract, tokenDecimals])

  const block1d = useOneDayBlock({ chainId: chainId })
  const block2d = useTwoDayBlock({ chainId: chainId })
  // const block1w = useOneWeekBlock({ chainId })

  // General data (volume, liquidity)
  const nativePrice = useNativePrice({ chainId: chainId })
  const nativePrice1d = useNativePrice({ chainId, variables: { block: block1d }, shouldFetch: !!block1d })

  const token = useTokens({ chainId: chainId, variables: { where: { id } }, shouldFetch: !!id })?.[0]
  const token1d = useTokens({
    chainId: chainId,
    variables: { block: block1d, where: { id } },
    shouldFetch: !!id && !!block1d,
  })?.[0]
  const token2d = useTokens({
    chainId: chainId,
    variables: { block: block2d, where: { id } },
    shouldFetch: !!id && !!block2d,
  })?.[0]

  // For the logo
  //   const currency = useCurrency(token?.id)
  //   const currency = outputCurrency

  // For the Info Cards
  const price = token?.derivedETH * nativePrice
  //   const priceChange = ((token?.derivedETH * nativePrice) / (token1d?.derivedETH * nativePrice1d)) * 100 - 100
  //   const formattedSupply = totalSupply / 10 ** token?.decimals

  const liquidityUSD = token?.liquidity * token?.derivedETH * nativePrice
  const liquidityUSDChange =
    ((token?.liquidity * price) / (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const volumeUSD1d = token?.volumeUSD - token1d?.volumeUSD
  const volumeUSD2d = token1d?.volumeUSD - token2d?.volumeUSD
  const volumeUSD1dChange = (volumeUSD1d / volumeUSD2d) * 100 - 100
  const priceUSD = token?.priceUSD
  const priceUSD1d = token?.priceUSD - token1d?.priceUSD
  const priceUSD2d = token1d?.priceUSD - token2d?.priceUSD
  const priceUSD1dChange = (priceUSD1d / priceUSD2d) * 100 - 100

  // The Chart
  const tokenDayData = useTokenDayData({
    chainId,
    variables: { where: { token: outputCurrency?.wrapped.address.toLowerCase() } },
    shouldFetch: !!id && !!chainId,
  })

  const chartData = useMemo(
    () => ({
      liquidityChart: tokenDayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.liquidityUSD) })),

      volumeChart: tokenDayData
        ?.sort((a, b) => a.date - b.date)
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.volumeUSD) })),

      priceChart: tokenDayData
        /* @ts-ignore TYPE NEEDS FIXING */
        ?.sort((a, b) => a.date - b.date)
        /* @ts-ignore TYPE NEEDS FIXING */
        .map((day) => ({ x: new Date(day.date * 1000), y: Number(day.priceUSD) })),
    }),
    [tokenDayData]
  )

  return (
    <AnalyticsContainer>
      {/* <NextSeo title={`${token?.name} Analytics`} /> */}
      <div className="px-4 space-y-4 mb-1">
        <div className="grid grid-cols-1 gap-2">
          <ChartCard
            header="Price"
            subheader={token?.symbol}
            figure={price}
            change={priceUSD1dChange}
            chart={chartData.priceChart}
            defaultTimespan="WEEK"
            timespans={chartTimespans}
          />
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ChartCard
            header="Liquidity"
            subheader={token?.symbol}
            figure={liquidityUSD}
            change={liquidityUSDChange}
            chart={chartData.liquidityChart}
            defaultTimespan="WEEK"
            timespans={chartTimespans}
          />
          <ChartCard
            header="Volume"
            subheader={token?.symbol}
            figure={volumeUSD1d}
            change={volumeUSD1dChange}
            chart={chartData.volumeChart}
            defaultTimespan="WEEK"
            timespans={chartTimespans}
          />
        </div> */}

        <NavLink
          href={`/analytics/tokens/${id}`}
          >
          <Button 
            variant="filled" color="purple" size="lg"
            className={`mt-4 mb-2`}
            >
            <div className="block text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              View Token Analytics <span> ↗</span>
            </div>
          </Button>
        </NavLink>
      </div>
    </AnalyticsContainer>
  )
}
export default Token
Token.Guard = NetworkGuard(Feature.ANALYTICS)