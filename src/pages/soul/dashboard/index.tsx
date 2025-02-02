import React from 'react'
// import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
// import styled from 'styled-components'
import { featureEnabled, formatNumber } from 'functions'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { useSoulInfo } from 'hooks/useAPI'
import { useActiveWeb3React } from 'services/web3'
import { getChainInfo } from 'constants/chains'
import Image from 'next/image'
import DATA_BANNER from 'assets/branding/data-banner.png'
import { Feature } from 'enums'

const Dashboard = () => {
  const { chainId } = useActiveWeb3React()

  // GET SOUL ECONOMY BALANCES //
  const { soulInfo } = useSoulInfo()
  const soulPrice = Number(soulInfo.price)
  const stakedSoul = Number(soulInfo.stakedSoul)
  const soulBalance = Number(soulInfo.SoulBalance)
  const treasurySoulValue = Number(soulInfo.SoulBalance) * soulPrice
  const totalSupply = Number(soulInfo.supply)
  const circulatingSupply = Number(totalSupply - soulBalance - stakedSoul)

  // console.log('totalSupply:%s', totalSupply)
  const daoLiquidityValue = Number(soulInfo.totalLiquidityValue)

  // GET RESERVES BALANCES //
  const treasuryNativeValue = Number(soulInfo.NativeValue)
  const treasuryReserveValue = treasurySoulValue + treasuryNativeValue

  // GET LIQUIDITY BALANCES //
  const treasuryLiquidityValue = Number(soulInfo.totalLiquidityValue)

  // calculate Treasury Balances
  const treasuryValue = Number(soulInfo.totalValue)

  let treasuryValueData = [
      {
        "label": "LIQUIDITY",
        "angle": treasuryLiquidityValue,
        "color": "#A485FF",
        "percent": ((treasuryLiquidityValue / treasuryValue) * 100).toFixed()
      },
      {
        "label": "ASSETS",
        "angle": treasuryReserveValue,
        "color": "#A445FF",
        "percent": ((treasuryReserveValue / treasuryValue) * 100).toFixed()
      },
    ]

  const soulSupplyData = [
    {
      angle: circulatingSupply,
      color: '#A485FF',
      label: 'CIRCULATING SUPPLY',
      percent: ((circulatingSupply / totalSupply) * 100).toFixed(),
      text: 'The combined number of SOUL being traded or in public wallets.',
    },
    {
      angle: stakedSoul,
      color: '#A465FF',
      label: 'STAKED SOUL',
      percent: ((stakedSoul / totalSupply) * 100).toFixed(),
      text: 'The portion of supply that is not in circulation as it is currently staking.',
    },
    {
      angle: soulBalance,
      color: '#A445FF',
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
          <title>Dashboard | SoulSwap</title>
          <meta name="description" content="View the SoulSwap economy metrics, such as the circulation and our protocol-owned assets and liquidity." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta name="twitter:site" content="@SoulSwapFinance" />
          <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
          <meta id="og:image:type" property="og:image:type" content="image/png" />
          <meta id="og:image:type" property="og:image:type" content="630" />
          <meta id="og:image:width" property="og:image:width" content="1200" />
          <meta id="og:description" property="og:description" content="View the SoulSwap economy metrics, such as the circulation and our protocol-owned assets and liquidity." />
        </Head>

        <div className={`grid p-1 mt-8 rounded-2xl bg-dark-1000`} 
          >
          <div
              className={`w-full grid grid-cols-1 gap-6 bg-dark-1000 p-4 rounded-2xl border-2 border-purple`}
            >
              <Image src={DATA_BANNER}
                height={180}
                width={1080}
                alt={'economy data page banner'}
              />
            </div>
          <div className={`flex justify-center m-1 p-1`}>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/farms'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Farms</span>
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Bonds</span>
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Vault</span>
            </div>
          </NavLink>
        </Button>
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
                {(`SOUL ECONOMY`).toUpperCase()}
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
              {/* <div className="lg:hidden h-px my-4 mb-3 bg-dark-1000" /> */}
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
              {/* <div className="h-px my-4 bg-dark-1000" /> */}
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
                <div className="h-px my-4" />

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
                {(`SOUL TREASURY`).toUpperCase()}
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
                    {formatNumber(daoLiquidityValue, true, true, 0)}
                  </Typography>
                </div>
                {/* <div className="h-px my-4 bg-dark-1000" /> */}
              </div>
              <div>
              </div>
              {/* <div className="h-px my-4 bg-dark-1000" /> */}
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
              <div className="hidden lg:grid lg:grid-cols-2 space-between-3">
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(treasurySoulValue, true, false, 0)}
                  </Typography>
                  <Typography
                    className={'flex justify-center items-baseline'}
                    variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                    {formatNumber(daoLiquidityValue, true, true, 0)}
                  </Typography>
                </div>

              <div className="h-px my-4" />
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
            </div>
          </div>
      </DoubleGlowShadowV2>
  )
}

export default Dashboard