import React from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { formatNumber } from 'functions'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
import { useSeancePrice, useSoulPrice } from 'hooks/getPrices'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { useSoulInfo, useBondInfo } from 'hooks/useAPI'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'

export default function Dashboard() {
  const { i18n } = useLingui()
  const seancePrice = useSeancePrice()
  // const bondInfo = useBondTVL()

  // let bondsTvl = bondInfo?.reduce((previousValue, currentValue) => {
  //   return previousValue + currentValue?.tvl
  // }, 0)
  // Prices //
  const soulPrice = useSoulPrice()
  const { chainId } = useActiveWeb3React()

  // GET SOUL ECONOMY BALANCES //
  const { soulInfo } = useSoulInfo()
  const stakedSoul = Number(soulInfo.stakedSoul)
  const soulBalance = Number(soulInfo.SoulBalance)
  const totalSupply = Number(soulInfo.supply)
  const totalSupplyString = Number(soulInfo.supply).toFixed(0).toString().substring(0,2) + 'M'
  // console.log('totalSupplyString:%s', totalSupplyString)
  const circulatingSupply = totalSupply - soulBalance - stakedSoul
  // console.log('totalSupply:%s', totalSupply)
  const daoLiquidityValue = Number(soulInfo.totalLiquidityValue)

  // GET RESERVES BALANCES //
  const treasurySoulValue = soulBalance * soulPrice
  const treasuryFantomValue = Number(soulInfo.NativeValue)
  // const treasuryReserveValue = treasurySoulValue + treasuryFantomValue
  
  // GET LIQUIDITY BALANCES //
  const { bondInfo } = useBondInfo()
  const treasuryLiquidityValue = Number(soulInfo.totalLiquidityValue)
  // const bondedValue = Number(bondsTvl)
  const bondedValue = Number(bondInfo.totalValue)

  const NativeSoulValue = Number(soulInfo.NativeSoulValue) + Number(bondInfo.NativeSoulValue)
  const SoulUsdcValue = Number(soulInfo.SoulUsdcValue) + Number(bondInfo.SoulUsdcValue)
  const NativeEthereumValue = Number(soulInfo.NativeEthereumValue) + Number(bondInfo.NativeEthereumValue)
  const UsdcDaiValue = Number(soulInfo.UsdcDaiValue) + Number(bondInfo.UsdcDaiValue)
  const NativeUsdcValue = Number(soulInfo.NativeUsdcValue) + Number(bondInfo.NativeUsdcValue)
  const NativeBitcoinValueValue = Number(soulInfo.NativeBitcoinValueValue) + Number(bondInfo.NativeBitcoinValueValue)
  const NativeDaiValue = Number(soulInfo.NativeDaiValue) + Number(bondInfo.NativeDaiValue)
  const NativeBinanceValue = Number(soulInfo.NativeBinanceValue) + Number(bondInfo.NativeBinanceValue)
  const NativeSeanceValue = Number(soulInfo.NativeSeanceValue) + Number(bondInfo.NativeSeanceValue)

  // const OtherValue = NativeSeanceValue + NativeBinanceValue + SoulUsdcValue + NativeDaiValue
  const FantomPairsValue = NativeSoulValue + NativeBitcoinValueValue + NativeDaiValue + NativeBinanceValue + NativeSeanceValue + NativeEthereumValue
  const SoulPairsValue = NativeSoulValue + SoulUsdcValue
  const SeancePairsValue = NativeSeanceValue
  const UsdcPairsValue = UsdcDaiValue + NativeUsdcValue + SoulUsdcValue
  const DaiPairsValue = UsdcDaiValue + NativeDaiValue
  const BitcoinPairsValue = NativeBitcoinValueValue
  const BinancePairsValue = NativeBinanceValue
  const EthereumPairsValue = NativeEthereumValue

  const SoulComposition = SoulPairsValue / 2
  const FantomComposition = FantomPairsValue / 2
  const UsdcComposition = UsdcPairsValue / 2
  const DaiComposition = DaiPairsValue / 2
  const BitcoinComposition = BitcoinPairsValue / 2
  const StableComposition = UsdcComposition + DaiComposition
  const EthereumComposition = EthereumPairsValue / 2
  const BinanceComposition = BinancePairsValue / 2
  const SeanceComposition = SeancePairsValue / 2
  // const OtherComposition = BinanceComposition + SeanceComposition

  // calculate Treasury Balances
  // const treasuryValue = treasuryLiquidityValue + treasuryReserveValue
  const treasuryValue = Number(soulInfo.totalValue) + bondedValue
  const liquidityValue = bondedValue + daoLiquidityValue

  const liquidityValueData = [
    {
      "label": "STABLECOINS",
      "angle": StableComposition,
      "color": "#B445FF",
      "percent": ((StableComposition / liquidityValue) * 100).toFixed()
    },
    {
      "label": "FANTOM",
      "angle": FantomComposition,
      "color": "#B485FF",
      "percent": ((FantomComposition / liquidityValue) * 100).toFixed()
    },
    {
        "label": "BTC, ETH, & BNB",
        "angle": BitcoinComposition + EthereumComposition + BinanceComposition,
        "color": "#B452FF",
        "percent": (((BitcoinComposition + EthereumComposition + BinanceComposition) / liquidityValue) * 100).toFixed()
    },
    {
        "label": "SOUL & SEANCE",
        "angle": SoulComposition + SeanceComposition,
        "color": "#B465FF",
        "percent": (((SoulComposition + SeanceComposition) / liquidityValue) * 100).toFixed()
    },
    // {
    //     "label": "ETHEREUM",
    //     "angle": EthereumComposition,
    //     "color": "#B445FF",
    //     "percent": ((EthereumComposition / liquidityValue) * 100).toFixed()
    // },
    // {
    //     "label": "OTHERS",
    //     "angle": OtherComposition,
    //     "color": "#B445FF",
    //     "percent": ((OtherComposition / liquidityValue) * 100).toFixed()
    // },
    // {
    //     "label": "BINANCE",
    //     "angle": BinanceComposition,
    //     "color": "#B445FF",
    //     "percent": ((BinanceComposition / liquidityValue) * 100).toFixed()
    // },
  ]

  const treasuryValueData = [
    {
        "label": "BONDED (USD)",
        "angle": bondedValue,
        "color": "#B485FF",
        "percent": ((bondedValue / treasuryValue) * 100).toFixed()
    },
    {
        "label": "LIQUIDITY (USD)",
        "angle": treasuryLiquidityValue,
        "color": "#B465FF",
        "percent": ((treasuryLiquidityValue / treasuryValue) * 100).toFixed()
    },
    {
        "label": "SOUL (USD)",
        "angle": treasurySoulValue,
        "color": "#B445FF",
        "percent": ((treasurySoulValue / treasuryValue) * 100).toFixed()
    },
    {
        "label": "FTM (USD)",
        "angle": treasuryFantomValue,
        "color": "#B425FF",
        "percent": ((treasuryFantomValue / treasuryValue) * 100).toFixed()
    },
  ]

  const soulSupplyData = [
    {
      angle: circulatingSupply,
      color: '#B485FF',
      label: 'CIRCULATING SUPPLY',
      percent: ((circulatingSupply / totalSupply) * 100).toFixed(),
      text: 'The combined number of SOUL being traded or in public wallets.',
    },
    {
      angle: stakedSoul,
      color: '#B465FF',
      label: 'STAKED SOUL',
      percent: ((stakedSoul / totalSupply) * 100).toFixed(),
      text: 'The portion of supply that is not in circulation as it is currently staking.',
    },
    {
      angle: soulBalance,
      color: '#B445FF',
      label: 'PROTOCOL OWNED',
      percent: ((soulBalance / totalSupply) * 100).toFixed(),
      text: 'The portion of supply that is not in circulation as it is currently in our reserves.',
    },
  ]


const HideOnMobile = styled.div`
  @media screen and (max-width: 900px) {
    display: none;
   }
 `;

  return (
    <Container id="dashboard-page" className="py-4 space-y-4 md:py-8 max-w-min">
      <DoubleGlowShadowV2>
      <Head>
        <title>Dashboard | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className="grid grid-cols justify-center">
<HideOnMobile>
      <div className="py-1 mb-1 mt-3 ml-3 mr-3 bg-dark-600" />
        <div className="py-1 mb-1 ml-3 mr-3  bg-purple" />
        <Typography variant="h1" className="text-center mt-4 mb-4 text-dark-600" component="h1">
          SOULSWAP FINANCE
        </Typography>
        <div className="py-1 mt-1 ml-3 mr-3 bg-dark-600" />
        <div className="py-1 mt-1 ml-3 mr-3 mb-3 bg-purple" />
        </HideOnMobile>

      <div className="flex ml-4 mr-4 mb-4 gap-1 items-center justify-center">
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/seance'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Farm </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg" className={chainId == ChainId.FANTOM ? '' : 'hidden'}>
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Lend </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Vault </span>
            </a>
          </NavLink>
        </Button>

        </div>
      <div className="flex text-center items-center">
      {/* <Applications /> */}
      </div>
      {/* <div className="block">
      </div>
      <div className="inline-block column-count-1 xl:column-count-2">
        <div className="p-6 shadow-4 bg-dark-1000 rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 mb-6 xl:mr-1.5">
          <Typography 
            // variant="md" 
            weight={600} lineHeight={28} textColor="text-accent" 
            fontFamily={'semi-bold'}
            >
            {i18n._(t`SoulSwap Details`)}
          </Typography>
          <div>
            <Typography
              className="flex gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Total Value Locked`)}
              <QuestionHelper
                width={'small'}
                text={<div className="flex flex-col space-y-2">The sum of all assets staked in Soul protocol.</div>}
              />
            </Typography>
            <Typography variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(tvl, true)}
            </Typography>
          </div>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => <DashboardLineGraph width={width} height={110} data={tvlData} theme={'dark'} />}
            </AutoSizer>
          </div>
          <div className="h-px my-1 bg-dark-1000" />
          <div>
            <Typography
              className="flex gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`24h Trading Volume`)}
              <QuestionHelper
                width={'small'}
                text={
                  <div className="flex flex-col space-y-2">
                    The sum of all trades that have occurred on SoulSwap in the last 24 hours.
                  </div>
                }
              />
            </Typography>
            <Typography variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(volume, true)}
            </Typography>
          </div>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => <DashboardLineGraph width={width} height={110} data={tradingVolumeData} theme={'dark'} />}
            </AutoSizer>
          </div>
          <div className="h-px my-1 bg-dark-1000" />
          <div>
            <Typography
              className="flex gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Market Cap`)}
            </Typography>
            <Typography variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(soulMarketCap, true)}
            </Typography>
          </div>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => <DashboardLineGraph width={width} height={110} data={marketCapData} theme={'dark'} />}
            </AutoSizer>
              </div>
            </div>  */}


        <div className="p-1 shadow-4 bg-[#A654DD] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
          <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            // variant="md"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`SOUL ECONOMY`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#A654DD]" />
          <div>
            <Typography 
              className={'flex text-xl justify-center items-baseline'}
              fontFamily={'medium'} textColor={'text-white'}>
              Market Capitalization
            </Typography>
            <div className="h-px my-1 mb-3 bg-dark-1000" />
            <Typography
              className={'flex justify-center items-baseline'}
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               { formatNumber(soulPrice * totalSupply, true, false, 0) }
            </Typography>
          </div>
            <div className="md:hidden h-px my-4 mb-3 bg-dark-1000" />
            <div>
              <div className="md:hidden grid grid-cols-2 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Soul Price
                </Typography>
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Seance Price
                </Typography>
              </div>

              <div className="md:hidden grid grid-cols-2 space-between-3">
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  { formatNumber(soulPrice, true, false, 0) }
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  { formatNumber(seancePrice, true, false, 0) }
                </Typography>
              </div>
            </div>
          <div>
          <div className="md:hidden h-px my-4 bg-dark-1000" />
            <div className="md:hidden grid grid-cols-2 space-between-3">
            <Typography 
              className="flex gap-1 text-lg justify-center items-center mb-3"
              lineHeight={48} fontFamily={'medium'}>
              Current Supply
            </Typography>
            <Typography 
              className="flex gap-1 text-lg justify-center items-center mb-3"
              lineHeight={48} fontFamily={'medium'}>
               Maximum Supply
            </Typography>
            </div>
            <div className="md:hidden grid grid-cols-2 space-between-3">
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               { totalSupplyString }
            </Typography>
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {'250M'}
            </Typography>
            </div>
            </div>

            <div className="h-px my-4 bg-dark-1000" />
            <div>
              <div className="hidden md:grid md:grid-cols-4 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Soul Price
                </Typography>
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Seance Price
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Total Supply
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Max Supply
                </Typography>
              </div>
            </div>
            <div>
              <div className="hidden md:grid md:grid-cols-4 space-between-3">
              <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  { formatNumber(soulPrice, true, false, 0) }
                </Typography>
              <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  { formatNumber(seancePrice, true, false, 0) }
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  { totalSupplyString }
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  { '250M' }
                </Typography>
              </div>
              <div className="h-px my-4 bg-dark-1000" />
              <div>
                <Typography
                  className="flex text-2xl justify-center gap-1 items-center"
                  fontFamily={'medium'}
                  textColor={'text-white'}
                >
                  {i18n._(t`Supply Distribution`)}
                </Typography>
                <div className="h-px my-4 bg-dark-1000" />
              </div>

          {/* SOUL DISTRIBUTION CHART */}

          <div className="flex justify-center flex-col sm:flex-row">
              <DashboardDonutChart width={200} data={soulSupplyData} />
              <DashboardChartLegend
                data={soulSupplyData}
                hasInfo={true}
                currency={'SOUL'}
                leadingCurrency={false}
                theme={'dark'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-1 shadow-4 bg-[#A654DD] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
          <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`SOUL TREASURY`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#A654DD]" />
          <div>
            <Typography
              className="flex text-2xl justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              Protocol Balance
            </Typography>
            <div className="h-px my-2 bg-dark-1000" />
            <Typography 
              className="flex justify-center gap-1 items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(treasuryValue, true)}
            </Typography>
          </div>
          <div>
            {/* <AutoSizer disableHeight>
              {({ width }) => (
                <DashboardLineGraph width={width} height={110} data={treasuryValueData} theme={'dark'} />
              )}
            </AutoSizer> */}
          </div>

          <div className="h-px my-4 bg-dark-1000" />

          <div>
            <Typography
              className="flex text-2xl justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Treasury Distribution`)}
            </Typography>
            <div className="h-px my-4 bg-dark-1000" />
          </div>
          <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardDonutChart width={200} data={treasuryValueData} />
            <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardChartLegend
              data={treasuryValueData}
              hasInfo={false}
              currency={'$'}
              leadingCurrency={true}
              theme={'dark'}
            />
              </div>
            </div>
          <div>
            <Typography
              className="flex mt-8 text-2xl justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Liquidity Composition`)}
            </Typography>
            <div className="h-px my-4 bg-dark-1000" />
          </div>
          <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardDonutChart width={200} data={liquidityValueData} />
            <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardChartLegend
              data={liquidityValueData}
              hasInfo={false}
              currency={'$'}
              leadingCurrency={true}
              theme={'dark'}
            />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoubleGlowShadowV2>
  </Container>
  )
}
