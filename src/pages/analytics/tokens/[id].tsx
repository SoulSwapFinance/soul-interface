import { CurrencyLogo } from 'components/CurrencyLogo'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
// import Background from 'features/analytics/Background'
import { Token as ERC20 } from 'sdk'
import ChartCard from 'features/analytics/ChartCard'
import ColoredNumber from 'features/analytics/ColoredNumber'
import InfoCard from 'features/analytics/InfoCard'
import PairList from 'features/analytics/Pairs/PairList'
import { LegacyTransactions } from 'features/transactions/Transactions'
import { getExplorerLink } from 'functions/explorer'
import { formatNumber } from 'functions/format'
import { useCurrency } from 'hooks/Tokens'
import { useTokenContract } from 'hooks/useContract'
import useCopyClipboard from 'hooks/useCopyClipboard'
// import Image from 'next/image'
import {
  useNativePrice,
  useOneDayBlock,
  useOneWeekBlock,
  useTokenDayData,
  useTokenPairs,
  useTokens,
  useTwoDayBlock,
} from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle, ExternalLink as LinkIcon } from 'react-feather'
import { getChainColorCode, getChainInfo, getChainLogoURL } from 'constants/chains'
import { NextSeo } from 'next-seo'
import { TridentHeader } from 'layouts/Trident'
import Typography from 'components/Typography'
import useAddTokenToMetaMask from 'hooks/useAddTokenToMetaMask'
import { Button } from 'components/Button'
import { RowFixed } from 'components/Row'
import { getAddress } from '@ethersproject/address'
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
    length: 2629746,
  },
  {
    text: 'YEAR',
    length: ONE_DAY * 365,
  },
]

interface TokenProps {
  // currency?: Currency | Token | undefined
  tokenAddress?: string | undefined
}

function Token({ tokenAddress }: TokenProps) {
  const router = useRouter()
  
  const id = tokenAddress ?? (router.query.id as string).toLowerCase()

  // const id = (router.query.id as string)?.toLowerCase()
  // const tokenAddress = id

  const { chainId, library } = useActiveWeb3React()
  const [isCopied, setCopied] = useCopyClipboard()

  const [totalSupply, setTotalSupply] = useState(0)
  const [tokenDecimals, setTokenDecimals] = useState(18)
  // const [totalSupply, setTotalSupply] = useState(0)
  const tokenContract = useTokenContract(id)

  useEffect(() => {
    const fetch = async () => {
      /* @ts-ignore TYPE NEEDS FIXING */
      setTotalSupply(await tokenContract.totalSupply())
      setTokenDecimals(await tokenContract.decimals())
    }
    fetch()
  }, [tokenContract, tokenDecimals])

  const block1d = useOneDayBlock({ chainId })
  const block2d = useTwoDayBlock({ chainId })
  const block1w = useOneWeekBlock({ chainId })

  // General data (volume, liquidity)
  const nativePrice = useNativePrice({ chainId })
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

  // Token Pairs
  const tokenPairs = useTokenPairs({ chainId: chainId, variables: { id } })
  const tokenPairs1d = useTokenPairs({
    chainId: chainId,
    variables: { id, block: block1d },
    shouldFetch: !!id && !!block1d,
  })
  const tokenPairs1w = useTokenPairs({
    chainId,
    variables: { id, block: block1w },
    shouldFetch: !!id && !!block1w,
  })

  const tokenPairsFormatted = useMemo(
    () =>
      /* @ts-ignore TYPE NEEDS FIXING */
      tokenPairs?.map((pair) => {
        const pair1d = tokenPairs1d?.find((p) => pair.id === p.id) ?? pair
        const pair1w = tokenPairs1w?.find((p) => pair.id === p.id) ?? pair1d

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
      }),
    [tokenPairs, tokenPairs1d, tokenPairs1w]
  )

  // For the logo
  const currency = useCurrency(token?.id)
  const tokenToAdd = new ERC20(chainId, id, tokenDecimals, token?.symbol, token?.name)

  // For the Info Cards
  const price = token?.derivedETH * nativePrice
  const priceChange = ((token?.derivedETH * nativePrice) / (token1d?.derivedETH * nativePrice1d)) * 100 - 100
  const formattedSupply = totalSupply / 10 ** token?.decimals

  const liquidityUSD = token?.liquidity * token?.derivedETH * nativePrice
  const liquidityUSDChange =
    ((token?.liquidity * price) / (token1d?.liquidity * token1d?.derivedETH * nativePrice1d)) * 100 - 100

  const volumeUSD = token1d?.volumeUSD

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
    variables: { where: { token: id.toLowerCase() } },
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

  const { addToken, success } = useAddTokenToMetaMask(currency)
  const ADDRESS = getAddress(tokenToAdd.address)
  const BASE_URL = getChainLogoURL(chainId)
  const LOGO_URL = `${BASE_URL}/${ADDRESS}/logo.png`
  const SYMBOL = tokenToAdd.symbol
  const DECIMALS = tokenToAdd.decimals
  const TOKEN_NAME = tokenToAdd.name

  const tokenSymbol = currency.wrapped.symbol
  const tokenName = currency.wrapped.name

  return (

    <AnalyticsContainer>
      <NextSeo title={`${token?.symbol} Analytics`} />
      <div className="relative h-8 mt-4">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-purple opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics">Dashboard</Link>&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/pairs">Pairs</Link>&nbsp;
          </div>
          <div className={`text-xs font-bold text-high-emphesis m-1 text-${getChainColorCode(chainId)}`}>
            Tokens&nbsp;
          </div>
        </div>
      </div>
      <TridentHeader className="sm:!flex-row sm:gap-24 justify-center" pattern="bg-bubble">
        <div className="flex justify-center">
          {currency && library?.provider?.isMetaMask && (
            <Button
              color="gradient"
              size="xs"
              onClick={() => {
                const params: any = {
                  type: 'ERC20',
                  options: {
                    address: ADDRESS,
                    symbol: SYMBOL,
                    decimals: DECIMALS,
                    image: LOGO_URL,
                  },
                }
                if (library && library.provider.isMetaMask && library.provider.request) {
                  library.provider
                    .request({
                      method: 'wallet_watchAsset',
                      params,
                    })
                    .then((success) => {
                      if (success) {
                        console.log('Added Successfully')
                      } else {
                        throw new Error('Failed to Add.')
                      }
                    })
                    .catch(console.error)
                }
              }}
              className="w-auto sm:mt-8 sm:mb-8">
              {!success ? (
                <RowFixed className="mx-auto rounded-xl space-x-2">
                  <CurrencyLogo className="bg-dark-1000 rounded-xl p-1"
                    currency={currency} size={60}
                  />
                  <div className="flex items-center space-x-4 md:space-x-8">
                    <Typography variant="h2" className="text-high-emphesis" weight={700}>
                      {tokenName}
                    </Typography>
                  </div>
                  {/* <div className="flex items-center space-x-4 md:space-x-8">
                    <Typography variant="h2" className="text-high-emphesis" weight={700}>
                      ({tokenSymbol})
                    </Typography>
                  </div> */}
                </RowFixed>
              ) : (
                <RowFixed>
                  {`Added ${SYMBOL}`}
                  <CheckCircle className="ml-1.5 text-2xl text-green" size="16px" />
                </RowFixed>
              )}
            </Button>
          )}
        </div>
        {/* <Typography variant="sm" weight={400}>
            Analytics for {token?.name}.
          </Typography> */}
        {/* </div> */}
        <div className="grid grid-cols-1 justify-center space-y-1 space-x-4">
          {/* <div className="flex flex-col"> */}
            <div className="text-center mb-1 text-white text-xl font-bold">Market Price</div>
            <NavLink
              href={`/swap?inputCurrency=&outputCurrency=${id}`}
            >
              <div
                className={`flex bg-dark-800 rounded-2xl justify-center hover:bg-dark-700 mb-4`}
              // size="xs"
              // variant="filled"
              // color={"ftmBlue"}
              >

                <div className="flex justify-center items-center space-x-1">
                  <div className="text-xl items-center font-medium text-high-emphesis">{formatNumber(price ?? 0, true)}</div>
                  <ColoredNumber number={priceChange} percent={true} />
                </div>
              </div>
            </NavLink>
          {/* </div> */}
          {/* <div className="flex flex-col"> */}
            <div className="text-center mb-1 text-white text-xl font-bold">Total Market</div>
            <NavLink
              href={`/swap?inputCurrency=&outputCurrency=${id}`}
            >
              {/* <Button
                size="xs"
                variant="filled"
                color={'black'}
              > */}
              <div
                className={`flex bg-dark-800 rounded-2xl justify-center hover:bg-dark-700`}
              >

                <div className="flex justify-center items-center space-x-1">
                  <div className="text-xl items-center font-medium text-high-emphesis"> {formatNumber(price * formattedSupply ?? 0, true, false)}</div>
                  <ColoredNumber number={priceChange} percent={true} />
                </div>
              </div>
            </NavLink>
          {/* </div> */}
          {/* <div className="flex flex-col">
          <div className="text-center mb-1 text-secondary">Total Market</div>
            <div className="flex items-center space-x-1">
            <div className="text-xl items-center font-medium text-high-emphesis">
                {formatNumber(price * formattedSupply ?? 0, true, false)}
              </div>
              <ColoredNumber number={priceChange} percent={true} />
            </div>
        </div> */}
        </div>
      </TridentHeader>
      <div className="px-4 pt-4 space-y-4 lg:px-14">
        <div className="text-3xl font-bold text-high-emphesis">Overview</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>
        <div className="grid grid-cols-1 gap-4">
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
        <div className="flex flex-row justify-between flex-grow space-x-4 overflow-x-auto">
          <InfoCard text="Liquidity (24H)" number={liquidityUSD} percent={liquidityUSDChange} />
          <InfoCard text="Volume (24H)" number={volumeUSD1d} percent={volumeUSD1dChange} />
          <InfoCard text="Fees (24H)" number={volumeUSD1d * 0.003} percent={volumeUSD1dChange} />
        </div>
        <div className="text-2xl font-bold text-high-emphesis">Information</div>
        <div className="px-4 text-sm leading-48px text-high-emphesis">
          <table className="w-full table-fixed">
            <thead className="border-b border-gray-900">
              <tr>
                <td>Name</td>
                <td>Symbol</td>
                <td>Address</td>
                <td className="flex justify-end w-full">Explorer</td>
              </tr>
            </thead>
            <tbody className="border-b border-gray-900">
              <tr>
                <td>{token?.name}</td>
                <td>{token?.symbol}</td>
                <td>
                  <div className="w-11/12 overflow-hidden cursor-pointer overflow-ellipsis whitespace-nowrap">{id}</div>
                </td>
                <td>
                  <a
                    className={`flex flex-row items-center justify-end space-x-1 text-${getChainColorCode(chainId)}`}
                    href={getExplorerLink(chainId, id, 'token')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div>View</div>
                    <LinkIcon size={16} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          {/* <div className="text-2xl font-bold text-high-emphesis">Top Pairs</div> */}
          <PairList pairs={tokenPairsFormatted} type="all" />
        </div>
        <LegacyTransactions pairs={tokenPairs ? tokenPairs.map((pair) => pair.id) : []} />
      </div>
    </AnalyticsContainer>
  )
}
export default Token
Token.Guard = NetworkGuard(Feature.ANALYTICS)