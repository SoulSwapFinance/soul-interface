import React from 'react'
// import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import styled from 'styled-components'
import { classNames, featureEnabled, formatNumber } from 'functions'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
// import { useSoulPrice } from 'hooks/getPrices'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { useSoulInfo, useBondInfo, useTokenInfo } from 'hooks/useAPI'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { getChainInfo } from 'constants/chains'
import Image from 'next/image'
import DATA_BANNER from 'assets/branding/data-banner.png'
import TokenStats from 'components/TokenStats'
import { Feature } from 'enums'

export default function Dashboard() {
  const { i18n } = useLingui()
  // const seancePrice = useSeancePrice()
  const { chainId } = useActiveWeb3React()
  const { tokenInfo } = useTokenInfo(SOUL_ADDRESS[chainId])
  // const bondInfo = useBondTVL()

  // let bondsTvl = bondInfo?.reduce((previousValue, currentValue) => {
  //   return previousValue + currentValue?.tvl
  // }, 0)
  // Prices //
  const soulPrice = Number(tokenInfo.price) // usePriceUSD(SOUL_ADDRESS[chainId])

  // GET SOUL ECONOMY BALANCES //
  const { soulInfo } = useSoulInfo()
  const stakedSoul = Number(soulInfo.stakedSoul)
  const soulBalance = Number(soulInfo.SoulBalance)
  const daoSoulValue = Number(soulInfo.SoulBalance) * soulPrice
  const totalSupply = Number(soulInfo.supply)
  const circulatingSupply = Number(totalSupply - soulBalance - stakedSoul)

  // console.log('totalSupply:%s', totalSupply)
  const daoLiquidityValue = Number(soulInfo.totalLiquidityValue)

  // GET RESERVES BALANCES //
  const treasurySoulValue = daoSoulValue
  // const treasuryNativeValue = Number(soulInfo.NativeValue)
  // const treasuryReserveValue = treasurySoulValue + treasuryNativeValue

  // GET LIQUIDITY BALANCES //
  const { bondInfo } = useBondInfo()
  const treasuryLiquidityValue = Number(soulInfo.totalLiquidityValue)
  // const bondedValue = Number(bondsTvl)
  const bondedValue = [ChainId.FANTOM].includes(chainId) ? Number(bondInfo.totalValue) : 0

  // const NativeSoulValue = Number(soulInfo.NativeSoulValue) + Number(bondInfo.NativeSoulValue)
  // const SoulUsdcValue = Number(soulInfo.SoulUsdcValue) + Number(bondInfo.SoulUsdcValue)
  // const NativeEthereumValue = Number(soulInfo.NativeEthereumValue) + Number(bondInfo.NativeEthereumValue)
  // const UsdcDaiValue = Number(soulInfo.UsdcDaiValue) + Number(bondInfo.UsdcDaiValue)
  // const NativeUsdcValue = Number(soulInfo.NativeUsdcValue) + Number(bondInfo.NativeUsdcValue)
  // const NativeBitcoinValueValue = Number(soulInfo.NativeBitcoinValueValue) + Number(bondInfo.NativeBitcoinValueValue)
  // const NativeDaiValue = Number(soulInfo.NativeDaiValue) + Number(bondInfo.NativeDaiValue)
  // const NativeBinanceValue = Number(soulInfo.NativeBinanceValue) + Number(bondInfo.NativeBinanceValue)
  // const NativeSeanceValue = Number(soulInfo.NativeSeanceValue) + Number(bondInfo.NativeSeanceValue)

  // const OtherValue = NativeSeanceValue + NativeBinanceValue + SoulUsdcValue + NativeDaiValue
  // const NativePairsValue = NativeSoulValue + NativeBitcoinValueValue + NativeDaiValue + NativeBinanceValue + NativeSeanceValue + NativeEthereumValue
  // const SoulPairsValue = NativeSoulValue + SoulUsdcValue
  // const SeancePairsValue = NativeSeanceValue
  // const UsdcPairsValue = UsdcDaiValue + NativeUsdcValue + SoulUsdcValue
  // const DaiPairsValue = UsdcDaiValue + NativeDaiValue
  // const BitcoinPairsValue = NativeBitcoinValueValue
  // const BinancePairsValue = NativeBinanceValue
  // const EthereumPairsValue = NativeEthereumValue

  // const SoulComposition = SoulPairsValue / 2
  // const NativeComposition = NativePairsValue / 2
  // const UsdcComposition = UsdcPairsValue / 2
  // const DaiComposition = DaiPairsValue / 2
  // const BitcoinComposition = BitcoinPairsValue / 2
  // const StableComposition = UsdcComposition + DaiComposition
  // const EthereumComposition = EthereumPairsValue / 2
  // const BinanceComposition = BinancePairsValue / 2
  // const SeanceComposition = SeancePairsValue / 2
  // const OtherComposition = BinanceComposition + SeanceComposition

  // calculate Treasury Balances
  // const treasuryValue = treasuryLiquidityValue + treasuryReserveValue
  const treasuryValue = Number(soulInfo.totalValue) + bondedValue
  // const liquidityValue = bondedValue + daoLiquidityValue

  // const liquidityValueData = [
  //   {
  //     "label": "STABLECOINS",
  //     "angle": StableComposition,
  //     "color": "#B445FF",
  //     "percent": ((StableComposition / liquidityValue) * 100).toFixed()
  //   },
  //   {
  //     "label": "FANTOM",
  //     "angle": NativeComposition,
  //     "color": "#B485FF",
  //     "percent": ((NativeComposition / liquidityValue) * 100).toFixed()
  //   },
  //   {
  //     "label": "BTC, ETH, & BNB",
  //     "angle": BitcoinComposition + EthereumComposition + BinanceComposition,
  //     "color": "#B452FF",
  //     "percent": (((BitcoinComposition + EthereumComposition + BinanceComposition) / liquidityValue) * 100).toFixed()
  //   },
  //   {
  //     "label": "SOUL & SEANCE",
  //     "angle": SoulComposition + SeanceComposition,
  //     "color": "#B465FF",
  //     "percent": (((SoulComposition + SeanceComposition) / liquidityValue) * 100).toFixed()
  //   },
  //   // {
  //   //     "label": "ETHEREUM",
  //   //     "angle": EthereumComposition,
  //   //     "color": "#B445FF",
  //   //     "percent": ((EthereumComposition / liquidityValue) * 100).toFixed()
  //   // },
  //   // {
  //   //     "label": "OTHERS",
  //   //     "angle": OtherComposition,
  //   //     "color": "#B445FF",
  //   //     "percent": ((OtherComposition / liquidityValue) * 100).toFixed()
  //   // },
  //   // {
  //   //     "label": "BINANCE",
  //   //     "angle": BinanceComposition,
  //   //     "color": "#B445FF",
  //   //     "percent": ((BinanceComposition / liquidityValue) * 100).toFixed()
  //   // },
  // ]
  let treasuryValueData
  chainId == ChainId.FANTOM ?
    treasuryValueData = [
      {
        "label": "BONDED",
        "angle": bondedValue,
        "color": "#B485FF",
        "percent": ((bondedValue / treasuryValue) * 100).toFixed()
      },
      {
        "label": "LIQUIDITY",
        "angle": treasuryLiquidityValue,
        "color": "#B465FF",
        "percent": ((treasuryLiquidityValue / treasuryValue) * 100).toFixed()
      },
      {
        "label": "SOUL",
        "angle": treasurySoulValue,
        "color": "#B445FF",
        "percent": ((treasurySoulValue / treasuryValue) * 100).toFixed()
      },
      // {
      //   "label": `${NATIVE[chainId].symbol.toUpperCase()} (USD)`,
      //   "angle": treasuryNativeValue,
      //   "color": "#B425FF",
      //   "percent": ((treasuryNativeValue / treasuryValue) * 100).toFixed()
      // },
    ]
    : treasuryValueData = [
      {
        "label": "LIQUIDITY",
        "angle": treasuryLiquidityValue,
        "color": "#B465FF",
        "percent": ((treasuryLiquidityValue / treasuryValue) * 100).toFixed()
      },
      {
        "label": "SOUL",
        "angle": treasurySoulValue,
        "color": "#B445FF",
        "percent": ((treasurySoulValue / treasuryValue) * 100).toFixed()
      },
      // {
      //   "label": `${NATIVE[chainId].symbol.toUpperCase()} (USD)`,
      //   "angle": treasuryNativeValue,
      //   "color": "#B425FF",
      //   "percent": ((treasuryNativeValue / treasuryValue) * 100).toFixed()
      // },
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


//   const HideOnMobile = styled.div`
//   @media screen and (max-width: 900px) {
//     display: none;
//    }
//  `;

  return (
      <DoubleGlowShadowV2>
        <Head>
          <title>Dashboard | Soul</title>
          <meta key="description" name="description" />
        </Head>
        {/* // border-[${getChainColor(chainId)}] bg-dark-1000`}  */}
          <div className={`grid p-1 mt-8 rounded rounded-2xl`} 
          >
          <div
              className={`w-full grid grid-cols-2 p-4 rounded rounded-2xl border border-2 border-purple`}
            >
              <div className={`w-full`}>
              <TokenStats />
              </div>
              <Image src={DATA_BANNER}
                height={180}
                width={1080}
                alt={'economy data page banner'}
              />
            </div>
          <div className={`flex justify-center m-1 p-1`}>
          <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
            </a>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/farms'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Farms</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Bonds</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Vault</span>
            </a>
          </NavLink>
        </Button>
        {featureEnabled(Feature.DEFARM, chainId) &&
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/defarms'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>DeFarms</span>
            </a>
          </NavLink>
        </Button>
        }
      </div>
            <div 
              className="bg-dark-900 p-4 rounded-2xl border border-4 border-dark-700"
            >
              <Typography
                className="text-2xl flex gap-1 justify-center items-center"
                weight={600}
                lineHeight={48}
                textColor="text-accent text-[#FFFFFF]"
                fontFamily={'semi-bold'}
              >
                {i18n._(t`SOUL ECONOMY`).toUpperCase()}
              </Typography>
              <div className="h-px my-4 bg-[#A654DD]" />
              {/* <div>
                <Typography
                  className={'flex text-xl justify-center items-baseline'}
                  fontFamily={'medium'} textColor={'text-white'}>
                  {getChainInfo(chainId, 'NAME')} Market
                </Typography>
                <div className="h-px my-1 mb-3 bg-dark-1000" />
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(soulPrice * totalSupply, true, false, 0)}
                </Typography>
              </div> */}
              <div className="lg:hidden h-px my-4 mb-3 bg-dark-1000" />
              <div>
                <div className="lg:hidden grid grid-cols-2 space-between-3">
                  <Typography
                    className="flex gap-1 text-lg justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Market Price
                  </Typography>
                  <Typography
                    className="flex gap-1 text-lg justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    {getChainInfo(chainId, 'NAME')} Supply
                  </Typography>
                </div>
                <div className="lg:hidden grid grid-cols-2 space-between-3">
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(soulPrice, true, false, 0)}
                  </Typography>
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(totalSupply, false, true)}
                  </Typography>
                </div>
              </div>
              <div>
              </div>
              <div className="h-px my-4 bg-dark-1000" />
              <div>
                <div className="hidden lg:grid lg:grid-cols-2 space-between-3">
                  <Typography
                    className="flex gap-1 text-xl justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Market Price
                  </Typography>
                  <Typography
                    className="flex gap-1 text-lg justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Total Supply
                  </Typography>
                </div>
              </div>
              <div>
                <div className="hidden lg:grid lg:grid-cols-2 space-between-3">
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(soulPrice, true, false, 0)}
                  </Typography>
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(totalSupply, false, true)}
                  </Typography>
                </div>
                <div className="h-px my-4 bg-dark-1000" />
                {/* <div>
                  <Typography
                    className="flex text-2xl justify-center gap-1 items-center"
                    fontFamily={'medium'}
                    textColor={'text-white'}
                  >
                    {i18n._(t`Supply Distribution`)}
                  </Typography>
                  <div className="h-px my-4 bg-dark-1000" />
                </div> */}

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

          {/* <div className="p-1 shadow-4 bg-[#A654DD] rounded-none sm:rounded-8 inline-block w-screen md:w-540"> */}
            <div className="bg-dark-900 p-4 mt-2 rounded-2xl border border-4 border-dark-700">
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
                <div className="lg:hidden grid grid-cols-2 space-between-3">
                  <Typography
                    className="flex gap-1 text-lg justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Owned Assets
                  </Typography>
                  <Typography
                    className="flex gap-1 text-lg justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Owned Liquidity
                  </Typography>
                </div>
                <div className="lg:hidden grid grid-cols-2 space-between-3">
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(treasurySoulValue, true, false, 0)}
                  </Typography>
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(daoLiquidityValue + bondedValue, true, true, 0)}
                  </Typography>
                </div>
              </div>
              <div>
              </div>
              <div className="h-px my-4 bg-dark-1000" />
              <div>
                <div className="hidden lg:grid lg:grid-cols-2 space-between-3">
                  <Typography
                    className="flex gap-1 text-xl justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Owned Assets
                  </Typography>
                  <Typography
                    className="flex gap-1 text-lg justify-center items-center mb-3"
                    lineHeight={48} fontFamily={'medium'}>
                    Owned Liquidity
                  </Typography>
                </div>
              </div>

              <div className="h-px my-4 bg-dark-1000" />

              {/* <div>
                <Typography
                  className="flex text-2xl justify-center gap-1 items-center"
                  fontFamily={'medium'}
                  textColor={'text-white'}
                >
                  {i18n._(t`Treasury Distribution`)}
                </Typography>
                <div className="h-px my-4 bg-dark-1000" />
              </div> */}
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
              {/* <div>
            <Typography
              className="flex mt-8 text-2xl justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Liquidity Composition`)}
            </Typography>
            <div className="h-px my-4 bg-dark-1000" />
          </div> */}
              {/* <div className="flex justify-center flex-col gap-3 sm:flex-row">
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
            </div> */}
            </div>
          </div>
      </DoubleGlowShadowV2>
  )
}
