import React from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { formatNumber } from 'functions'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
import { useFantomPrice, useSeancePrice, useSoulPrice } from 'hooks/getPrices'
import { DAI_ADDRESS } from 'sdk'
import { WFTM_ADDRESS } from 'constants/addresses'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import { useTokenInfo, useSoulInfo } from 'hooks/useAPI'

export default function Dashboard() {
  const { i18n } = useLingui()

  // Prices //
  const soulPrice = useSoulPrice()
  const seancePrice = useSeancePrice()

  // GET SOUL ECONOMY BALANCES //
  const { soulInfo } = useSoulInfo()
  const stakedSoul = Number(soulInfo.stakedSoul)
  const soulBalance = Number(soulInfo.SoulBalance)
  const totalSupply = Number(soulInfo.supply)
  const totalSupplyString = Number(soulInfo.supply).toFixed(0).toString().substring(0,2) + 'M'
  // console.log('totalSupplyString:%s', totalSupplyString)
  const circulatingSupply = totalSupply - soulBalance - stakedSoul
  // console.log('totalSupply:%s', totalSupply)

  // GET RESERVES BALANCES //
  const treasurySoulValue = soulBalance * soulPrice
  const treasuryFantomValue = Number(soulInfo.NativeValue)
  const treasuryReserveValue = treasurySoulValue + treasuryFantomValue

  // GET LIQUIDITY BALANCES //
  const treasuryLiquidityValue = Number(soulInfo.totalLiquidityValue)

  // calculate Treasury Balances
  // const treasuryValue = treasuryLiquidityValue + treasuryReserveValue
  const treasuryValue = Number(soulInfo.totalValue)


  const treasuryValueData = [
    {
        "label": "LIQUIDITY (USD)",
        "angle": treasuryLiquidityValue,
        "color": "#B485FF",
        "percent": ((treasuryLiquidityValue / treasuryValue) * 100).toFixed()
    },
    {
        "label": "SOUL (USD)",
        "angle": treasurySoulValue,
        "color": "#B465FF",
        "percent": ((treasurySoulValue / treasuryValue) * 100).toFixed()
    },
    {
        "label": "FTM (USD)",
        "angle": treasuryFantomValue,
        "color": "#B445FF",
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

  // const toggleCalculatorModal = useToggleCalculatorModal()
  // const toggleStakeModal = useToggleModal(ApplicationModal.STAKE)
  // const toggleSorModal = useToggleModal(ApplicationModal.SOR)
  // const toggleWrapModal = useToggleModal(ApplicationModal.WRAP)

  return (
    <Container id="dashboard-page" className="py-4 space-y-4 md:py-8 max-w-min">
      <DoubleGlowShadowV2>
      <Head>
        <title>Dashboard | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className="flex mb-4 items-center justify-center">
          <div className="grid grid-cols-4 items-center justify-between">
    {/* {/* <div className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleCalculatorModal()}>
        <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-dark-600">
          <Image
              src="/images/calculator.png"
              width="156px"
              height="156px"
              objectFit="contain"
              className="rounded-md"
              alt="calculator"
              />
        </div>
        <CalculatorModal />
    </div>

      <div className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
        onClick={() => toggleStakeModal()}>
          <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-dark-600">
              <Image
                  src="https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c/logo.png"
                  width="156px"
                  height="156px"
                  objectFit="contain"
                  className="rounded-md"
                  alt="lum logo (orange/pink sun)"
                  />
            </div>
            <StakeModal />
      </div>

      <div className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
        onClick={() => toggleWrapModal()}>
          <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-dark-600">
              <Image
                  src="https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208/logo.png"
                  width="156px"
                  height="156px"
                  objectFit="contain"
                  className="rounded-md"
                  alt="wlum logo (purple)"
                  />
            </div>
            <LuxorWrapModal />
      </div>

      <div className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
        onClick={() => toggleSorModal()}>
          <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-dark-600">
              <Image
                  src="https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A/logo.png"
                  width="156px"
                  height="156px"
                  objectFit="contain"
                  className="rounded-md"
                  alt="sor logo (snake with infinity-shaped tail)"
                  />
            </div>
            <SorModal />
      </div> */}
  </div>
      </div>
      <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="deepPurple" size="lg">
          <NavLink href={'/seance'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="blue" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Farm </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="deepPurple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="blue" size="lg">
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Lend </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="deepPurple" size="lg">
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
        <div className="grid grid-cols justify-center">
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
          </div>
        </div>
      </div>
    </DoubleGlowShadowV2>
  </Container>
  )
}
