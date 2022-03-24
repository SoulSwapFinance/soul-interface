import React, { useEffect, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { ethers } from 'ethers'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { formatNumber, formatPercent } from 'functions'
import DashboardLineGraph from 'components/Dashboard/LineGraph'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
import QuestionHelper from 'components/QuestionHelper/Helper'
// import useLuxorDashboard from 'hooks/useLuxorDashboard'
// import { AutoSizer } from 'react-virtualized'
// import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useFantomPrice, useLuxorPrice, useTokenPrice, useWrappedLumPrice } from 'hooks/getPrices'
import { usePairBalance, usePairPrice } from 'hooks/usePairData'
// import { useLuxTVL } from 'hooks/useV2Pairs'
import { useSorContract, useLuxorContract, useWrappedLumensContract,  useLuxorStakingContract, useLuxorTreasuryContract, useSorMasterContract } from 'hooks/useContract'
import { useTokenBalance } from 'state/wallet/hooks' 
// import { LUX_TREASURY_ADDRESS, WFTM_ADDRESS } from 'constants/addresses'
import { WFTM } from 'constants/tokens'
import { DAI_ADDRESS, LUM_ADDRESS, Token } from 'sdk'
// import useApprove from 'hooks/useApprove'
// import { LUX_ADDRESS } from 'constants/addresses'
import { usePairContract, useTokenContract } from 'hooks/useTokenContract'
import { LUXOR_WARMUP_ADDRESS, FTM_DAI_ADDRESS, WFTM_ADDRESS } from 'constants/addresses'

export default function Dashboard() {
  const { i18n } = useLingui()
  // const { luxData } = useLuxorDashboard()

  const [totalLuxorSupply, setTotalLuxorSupply] = useState(0)
  const [totalSorSupply, setTotalSorSupply] = useState(0)
  const [totalWlumSupply, setTotalWlumSupply] = useState(0)
  const [stakedLuxor, setStakedLuxor] = useState(0)
  const [lockedLuxor, setLockedLuxor] = useState(0)
  const [sorDaiCollateral, setSorDaiCollateral] = useState(0)
  const [sorLuxCollateral, setSorLuxCollateral] = useState(0)
  const [sorSorCollateral, setSorSorCollateral] = useState(0)
  // const [pooledLux, setPooledLuxor] = useState(0)
  const [treasuryLuxFtmBalance, setTreasuryLuxFtmBalance] = useState(0)
  const [treasuryLuxDaiBalance, setTreasuryLuxDaiBalance] = useState(0)
  const [treasuryFtmDaiBalance, setTreasuryFtmDaiBalance] = useState(0)
  const [treasuryLiquidityBalance, setTreasuryLiquidityBalance] = useState(0)
  const [treasuryDaiBalance, setTreasuryDaiBalance] = useState(0)
  const [treasuryFtmBalance, setTreasuryFtmBalance] = useState(0)
  const [treasuryLendBalance, setTreasuryLendBalance] = useState(0)
  const LuxFtmContract = usePairContract('0x951BBB838e49F7081072895947735b0892cCcbCD')
  const LuxDaiContract = usePairContract('0x46729c2AeeabE7774a0E710867df80a6E19Ef851')
  const FtmDaiContract = usePairContract('0xf3d6e8ecece8647b456d57375ce0b51b8f0cd40b')
  const WlumFtmContract = usePairContract('0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99')
  
  // KEY CONTRACTS //
  const LuxorStakingContract = useLuxorStakingContract()
  const SorStakingContract = useSorMasterContract()
  const LuxorTreasuryContract = useLuxorTreasuryContract()
  const SorContract = useSorContract()
  const LuxorContract = useLuxorContract()
  const WrappedLumensContract = useWrappedLumensContract()
  const LumensContract = useTokenContract(LUM_ADDRESS[250])
  const DaiContract = useTokenContract(DAI_ADDRESS[250])
  const DaiFtmLendContract = useTokenContract('0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd')
  const FtmDaiLendContract = useTokenContract('0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61')
  const FtmContract = useTokenContract(WFTM_ADDRESS[250])

  // const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(LuxorContract[250])
  let sorPegPrice = 1
  let sorMarketPrice = 1.0
  // const sorMarketPrice = useSorPrice()

  const LuxorStakingAddress = LuxorStakingContract?.address
  const LuxorWarmupAddress = LUXOR_WARMUP_ADDRESS[250]
  const DaiContractAddress = DaiContract?.address
  const WrappedLumensAddress = WrappedLumensContract?.address
  const SorStakingContractAddress = SorStakingContract?.address
  const LuxorTreasuryAddress = LuxorTreasuryContract?.address
  const LuxorFtmAddress = LuxFtmContract.address

// let luxorCirculatingSupply = 100
  const LuxorDaiAddress = LuxDaiContract.address
  const FtmDaiAddress = FtmDaiContract.address
  const WrappedLumFantomAddress = WlumFtmContract.address

  // Calculate Minting Rate
  const startTime = 1638424800000
  const nowTime = new Date().getTime()
  
  // // daysAgo in (recall: nowTime is in ms)
  const daysAgo = (nowTime - startTime) / 8_640_0000 // ~111 Days √
  // const secondsAgo = daysAgo * 86_400
  const luxorPerDay = totalLuxorSupply / daysAgo
  
  // DUMMIES //
  // let volume = 640774.2467250191
  // let sorAvailableCollateral = 100
  // let sorDaiCollateral = 100
  // let sorLuxCollateral = 100

  const luxFtmPrice = usePairPrice(LuxorFtmAddress) // ~190_000 // √
  // console.log('luxorVolume:%s', luxData?.result[1])
  // get the price of key treasury reserves
  const luxDaiPrice = usePairPrice(LuxorDaiAddress) // ~160_000 // √
  const wLumFtmPrice = usePairPrice(WrappedLumFantomAddress) // ~1_6M // √
  const ftmDaiPrice = usePairPrice(FtmDaiAddress) 

  const luxorCirculatingSupply = totalLuxorSupply - stakedLuxor - lockedLuxor
  
  // enable damped sor collateral rate
  const sorSorCollateralAdjusted = sorSorCollateral * 0.1
  const totalSorCollateral = sorDaiCollateral + sorLuxCollateral + sorSorCollateralAdjusted

  // calculate Treasury Balances
  const treasuryInvestmentBalance = treasuryLendBalance
  const treasuryReserveBalance = treasuryDaiBalance + treasuryFtmBalance
  const treasuryBalance = treasuryLiquidityBalance + treasuryReserveBalance + treasuryInvestmentBalance
  
  // calculate floor price
  const luxorFloorPrice = treasuryReserveBalance / totalLuxorSupply

  // const result = useCurrencyBalance(LUX_TREASURY_ADDRESS, LUX_FTM)
  // const luxFtmBalance = result
  // totalSupply of FTM in f/d
  // get the price of key treasury liquidity
  // get the price of key treasury investments

  // Prices //
  const luxorPrice = useLuxorPrice()
  const ftmPrice = useFantomPrice()
  const wlumPrice = useWrappedLumPrice()

/**
 * Runs only on initial render/mount
 */
  useEffect(() => {
    fetchBals()
  }, [])

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        fetchBals()
      }, 3000)
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    } catch (err) {
      console.warn(err)
    }
  })

  /**
   * Gets the lpToken balance of the Treasury for each pool
   */
    const fetchBals = async () => {
        try {
            // get treasury balance of Luxor
            const data = await LuxorContract?.totalSupply()
            const totalSupply = data / 1e9
            setTotalLuxorSupply(Number(totalSupply))
            console.log('totalSupply:%s', Number(totalSupply))

            const sorSupply = await SorContract?.totalSupply()
            const totalSorSupply = sorSupply / 1e18
            setTotalSorSupply(Number(totalSorSupply))
            // console.log('totalSorSupply:%s', Number(totalSorSupply))

            const sorDaiBal = await DaiContract?.balanceOf(SorStakingContractAddress)
            const sorLuxBal = await LuxorContract?.balanceOf(SorStakingContractAddress)
            const sorSorBal = await SorContract?.balanceOf(SorStakingContractAddress)
            
            const sorDaiCollateral = sorDaiBal / 1e18
            const sorLuxCollateral = sorLuxBal * luxorPrice / 1e9
            const sorSorCollateral = sorSorBal / 1e18
            
            setSorDaiCollateral(Number(sorDaiCollateral))
            setSorLuxCollateral(Number(sorLuxCollateral))
            setSorSorCollateral(Number(sorSorCollateral))

            console.log('sorDaiCollateral:%s', Number(sorDaiCollateral))

            const wlumSupply = await WrappedLumensContract?.totalSupply()
            const totalWlumSupply = wlumSupply / 1e9
            setTotalWlumSupply(Number(totalWlumSupply))
            // console.log('totalSorSupply:%s', Number(totalSorSupply))

            const daiBal = await DaiContract.balanceOf(LuxorTreasuryAddress)
            const daiBalance = daiBal / 1e18
            const ftmBal = await FtmContract.balanceOf(LuxorTreasuryAddress)
            const ftmBalance = ftmBal / 1e18
            const totalReserveBalance = daiBalance + (ftmBalance * ftmPrice)
            setTreasuryDaiBalance(daiBalance)
            setTreasuryFtmBalance(ftmBalance)
            // setTreasuryReserveBalance(Number(totalReserveBalance))
            console.log('totalReserveBalance:%s', Number(totalReserveBalance))
 
            // get treasury lend balance (wip)
            const daiLendBal = await DaiFtmLendContract.balanceOf(LuxorTreasuryAddress)
            const daiLendBalance = daiLendBal / 1e18
            const ftmLendBal = await FtmDaiLendContract.balanceOf(LuxorTreasuryAddress)
            const ftmLendBalance = ftmLendBal / 1e18
            const totalLendBalance = daiLendBalance + (ftmLendBalance * ftmPrice)
            setTreasuryLendBalance(Number(totalLendBalance))
            console.log('totalReserveBalance:%s', Number(totalReserveBalance))

            // get treasury balance of LUX-FTM
            const luxFtmBal = await LuxFtmContract.balanceOf(LuxorTreasuryAddress)
            const luxFtmBalance = luxFtmBal * luxFtmPrice / 1e18
            // setTreasuryLuxFtmBalance(Number(luxFtmBalance))
            // console.log('luxFtmBalance:%s', Number(luxFtmBalance))

            // get treasury balance of LUX-DAI
            const luxDaiBal = await LuxDaiContract.balanceOf(LuxorTreasuryAddress)
            const luxDaiBalance = luxDaiBal * luxDaiPrice / 1e18
            setTreasuryLuxDaiBalance(Number(luxDaiBalance))
            // console.log('luxFtmBalance:%s', Number(luxFtmBalance))
            
            // get treasury balance of FTM-DAI
            const ftmDaiBal = await FtmDaiContract.balanceOf(LuxorTreasuryAddress)
            const ftmDaiBalance = ftmDaiBal * ftmDaiPrice / 1e18
            setTreasuryFtmDaiBalance(Number(ftmDaiBalance))
            // console.log('luxFtmBalance:%s', Number(luxFtmBalance))
            
            const LiquidityBalance = luxDaiBalance + luxFtmBalance
            setTreasuryLiquidityBalance(LiquidityBalance)

            // get staked balance of Luxor
            const data3 = await LuxorContract.balanceOf(LuxorStakingAddress)
            const luxBalance = data3 / 1e9
            setStakedLuxor(Number(luxBalance))
            // console.log('luxBalance:%s', Number(luxBalance))

            // get warmup balance of Luxor
            const lumBalance = await LumensContract.balanceOf(LuxorWarmupAddress)
            const warmupBalance = lumBalance / 1e9
            setLockedLuxor(Number(warmupBalance))
            // console.log('warmupBalance:%s', Number(warmupBalance))

            return [totalSorSupply, totalWlumSupply, totalSupply, sorDaiCollateral, sorLuxCollateral, sorSorCollateral, daiBalance, ftmBalance, luxFtmBalance, totalReserveBalance, luxBalance, warmupBalance, ftmDaiBalance, LiquidityBalance]
        } catch (err) {
            console.warn(err)
        }
    }

    // const treasuryRevenueCollateralDark = [
        // {
        //     "label": "SOR Fees",
        //     "angle": 262551.9545530003,
        //     "color": "#343846",
        //     "percent": "58"
        // },
        // {
        //     "label": "DEX Fees",
        //     "angle": 98779.83032261429,
        //     "color": "#9BA9D2",
        //     "percent": "22"
        // },
        // {
        //     "label": "Others",
        //     "angle": 35264.236397269706,
        //     "color": "#4B5164",
        //     "text": "",
        //     "percent": "8"
        // }
    // ]

    const sorCollateralData = [
      // {
      //     "angle": sorAvailableCollateral,
      //     "color": "#FFA300",
      //     "label": "Available Collateral"
      // },
      {
          "angle": sorDaiCollateral,
          "color": "#FFB300",
          "label": "Dai Collateral",
          "percent": (sorDaiCollateral / totalSorCollateral * 100).toFixed()
      },
      {
          "angle": sorLuxCollateral,
          "color": "#FFD300",
          "label": "Luxor Collateral",
          "percent": (sorLuxCollateral / totalSorCollateral * 100).toFixed()
      },
      {
          "angle": sorSorCollateralAdjusted,
          "color": "#FFF300",
          "label": "Sor Collateral",
          "percent": (sorSorCollateralAdjusted / totalSorCollateral * 100).toFixed()
      }
  ]

  const treasuryBalanceData = [
    // {
    //     "label": "LUX-FTM",
    //     "angle": treasuryLuxFtmBalance,
    //     "color": "#FFA300",
    //     // "text": "",
    //     "percent": ((treasuryLuxFtmBalance / treasuryBalance) * 100).toFixed()
    // },
    // {
    //     "label": "LUX-DAI",
    //     "angle": treasuryLuxDaiBalance,
    //     "color": "#FFB300",
    //     "percent": ((treasuryLuxDaiBalance / treasuryBalance) * 100).toFixed()
    // },
    // {
    //     "label": "FTM-DAI",
    //     "angle": treasuryFtmDaiBalance,
    //     "color": "#FFC300",
    //     "percent": ((treasuryFtmDaiBalance / treasuryBalance) * 100).toFixed()
    // },
    {
        "label": "LIQUIDITY",
        "angle": treasuryLiquidityBalance,
        "color": "#FFF300",
        "percent": ((treasuryLiquidityBalance / treasuryBalance) * 100).toFixed()
    },
    {
      "label": "RESERVES",
      "angle": treasuryFtmBalance + treasuryDaiBalance,
      "color": "#FFD300",
      "percent": (((treasuryFtmBalance + treasuryDaiBalance) / treasuryBalance) * 100).toFixed()
    },
    {
        "label": "INVESTMENTS",
        "angle": treasuryFtmDaiBalance + treasuryLendBalance,
        "color": "#FFB300",
        "percent": (((treasuryFtmDaiBalance + treasuryLendBalance) / treasuryBalance) * 100).toFixed()
    },
    // {
    //     "label": "FTM",
    //     "angle": treasuryFtmBalance,
    //     "color": "#FFD300",
    //     "percent": ((treasuryFtmBalance / treasuryBalance) * 100).toFixed()
    // },
    // {
    //     "label": "DAI",
    //     "angle": treasuryDaiBalance,
    //     "color": "#FFE300",
    //     "percent": ((treasuryDaiBalance / treasuryBalance) * 100).toFixed()
    // },
    // {
    //     "label": "LENDING",
    //     "angle": treasuryLendBalance,
    //     "color": "#FFF300",
    //     "percent": ((treasuryLendBalance / treasuryBalance) * 100).toFixed()
    // }
  ]

  const luxorSupplyData = [
    {
      angle: luxorCirculatingSupply,
      color: '#FFA300',
      label: 'CIRCULATING',
      percent: ((luxorCirculatingSupply / totalLuxorSupply) * 100).toFixed(),
      text: 'The combined number of LUX tokens being traded or in public wallets.',
    },
    {
      angle: stakedLuxor,
      color: '#FFB300',
      label: 'STAKED',
      text: 'The portion of supply that is not in circulation as it is currently staking.',
      percent: ((stakedLuxor / totalLuxorSupply) * 100).toFixed()
      ,
    },
    {
      angle: lockedLuxor,
      color: '#FFD300',
      label: 'WARM-UP',
      text: 'The portion of supply that is not in circulation as it is currently in the warm-up period.',
      percent: ((lockedLuxor/ totalLuxorSupply) * 100).toFixed()
      ,
    },
  ]

  return (
    <Container id="dashboard-page" className="py-4 space-y-4 md:py-8 max-w-min">
      <Head>
        <title>Dashboard | Luxor</title>
        <meta key="description" name="description" />
      </Head>

      {/* <div className="block"> */}
        {/* <Link href= ad_location} passHref>
          <AdSection />
        </Link>
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
                text={<div className="flex flex-col space-y-2">The sum of all assets staked in Luxor protocol.</div>}
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
               {formatNumber(luxorMarketCap, true)}
            </Typography>
          </div>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => <DashboardLineGraph width={width} height={110} data={marketCapData} theme={'dark'} />}
            </AutoSizer>
              </div> */}
        {/* </div>  */}
        <div className="grid grid-cols justify-center">
        <div className="p-1 shadow-4 bg-[#FFF300] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
          <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            // variant="md"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`LUXOR ECONOMY`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#FFF300]" />
          <div>
            <Typography 
              className={'flex text-lg justify-center items-baseline'}
              fontFamily={'medium'} textColor={'text-white'}>
              {i18n._(t`Market Capitalization`)}
            </Typography>
            <div className="h-px my-1 mb-3 bg-dark-1000" />
            <Typography
              className={'flex justify-center items-baseline'}
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(luxorPrice * totalLuxorSupply, true, false, 0)}
            </Typography>
          </div>
            <div className="h-px my-4 mb-3 bg-dark-1000" />
            <div>
              <div className="grid grid-cols-2 space-between-3">
                <Typography
                  className="flex gap-1 text-lg justify-center items-center"
                  lineHeight={48} fontFamily={'medium'}>
                  Market Price
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
              </div>
              <div className="h-px my-1 mb-3 bg-dark-1000" />
              <div className="grid grid-cols-2 space-between-3">
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(luxorPrice, true, false, 0)}
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(luxorFloorPrice, true, false, 0)}
                </Typography>
              </div>
            </div>
          <div className="h-px my-4 bg-dark-1000" />
          <div>
            <div className="grid grid-cols-2 space-between-3">
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
              Luxor Supply
            </Typography>
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
               Emissions Rate
            </Typography>
            </div>
            <div className="h-px my-1 mb-3 bg-dark-1000" />
            <div className="grid grid-cols-2 space-between-3">
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(totalLuxorSupply, false)}
            </Typography>
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {luxorPerDay.toFixed()}
               <span className="text-sm leading-5 text-black-50 ml-2">{i18n._(t`DAILY`).toUpperCase()}</span>
            </Typography>
            </div>
            <div className="h-px my-4 bg-dark-1000" />
            <div>
            <Typography
              className="flex text-lg justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Luxor Supply Distribution`)}
            </Typography>
            <div className="h-px my-2 bg-dark-1000" />
          </div>
            <div className="flex justify-center flex-col sm:flex-row">
              <DashboardDonutChart width={200} data={luxorSupplyData} />
              <DashboardChartLegend
                data={luxorSupplyData}
                hasInfo={true}
                currency={'LUX'}
                leadingCurrency={false}
                theme={'dark'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-1 shadow-4 bg-[#FFF300] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
          <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`LUXOR TREASURY`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#FFF300]" />
          <div>
            <Typography
              className="flex justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Protocol Balance`)}
            </Typography>
            <div className="h-px my-1 bg-dark-1000" />
            <Typography 
              className="flex justify-center gap-1 items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(treasuryBalance, true)}
            </Typography>
          </div>
          <div>
            {/* <AutoSizer disableHeight>
              {({ width }) => (
                <DashboardLineGraph width={width} height={110} data={treasuryBalanceData} theme={'dark'} />
              )}
            </AutoSizer> */}
          </div>

          <div className="h-px my-4 bg-dark-1000" />

          <div>
            <Typography
              className="flex text-lg justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Luxor Treasury Distribution`)}
            </Typography>
            <div className="h-px my-2 bg-dark-1000" />
          </div>
          <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardDonutChart width={200} data={treasuryBalanceData} />
            <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardChartLegend
              data={treasuryBalanceData}
              hasInfo={false}
              currency={'$'}
              leadingCurrency={true}
              theme={'dark'}
            />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="p-6 shadow-4 bg-dark-1000 rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 mb-6 xl:ml-1.5">
          <Typography
            className="flex gap-1 items-center"
            // variant="md"
            weight={600}
            lineHeight={28}
            textColor="text-accent"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`Protocol Revenue`)}
          </Typography>

          <div>
            <Typography
              className="flex gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Total Revenue`)}
              <QuestionHelper
                width={'large'}
                text={
                  <div className="flex flex-col space-y-2">
                    Total income generated from strategic investments and protocol fees.
                  </div>
                }
              />
            </Typography>
            <Typography variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(treasuryRevenue, true, false)}
            </Typography>
          </div>
           <div className="flex flex-col sm:flex-row">
            <DashboardDonutChart width={200} data={treasuryRevenueCollateralDark} />
            <DashboardChartLegend
              data={treasuryRevenueCollateralDark}
              hasInfo={false}
              currency={'$'}
              leadingCurrency={true}
              theme={'dark'}
            />
          </div>
          <div className="h-px my-1 bg-dark-1000 hidden" />
          <div className="hidden">
            <Typography
              className="flex gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Predicted Daily Revenue`)}
            </Typography>
            <Typography variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(luxorPrice, false, false, 0)}
            </Typography>
          </div>
        </div> */}

        <div className="p-1 shadow-4 bg-[#FFF300] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
        <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            // variant="md"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`SOR STABLECOIN`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#FFF300]" />
          <div>
            <Typography
              className="flex gap-1 justify-center items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              Market Capitalization
            </Typography>
            <div className="h-px my-1 justify-center bg-dark-1000" />
            <Typography 
              className="flex gap-1 justify-center items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(sorMarketPrice * totalSorSupply, true, false)}
            </Typography>
          </div>

          <div className="h-px my-4 bg-dark-1000" />
          <div className="grid grid-cols-2 space-between-3">
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
              Market Rate
            </Typography>
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
              Total Supply
            </Typography>
            </div>

            <div className="h-px my-1 mb-3 bg-dark-1000" />

          <div className="grid grid-cols-2 space-between-3">
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(totalSorCollateral / totalSorSupply, true, false)}
                </Typography>
                <Typography 
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {totalSorSupply.toFixed(2)}{' '}
              <span className="text-sm leading-5 text-black-50 ml-2">{i18n._(t`SOR`).toUpperCase()}</span>
            </Typography>
          </div>
          <div className="h-px my-4 bg-dark-1000" />
          <div>
            <Typography
              className="flex text-lg justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Sor Collateral Data`)}
            </Typography>
          </div>
          <div className="h-px my-2 bg-dark-1000" />

          <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardDonutChart width={200} data={sorCollateralData} />
          <div className="flex justify-center flex-col gap-3 sm:flex-row">
            <DashboardChartLegend
              data={sorCollateralData}
              hasInfo={false}
              currency={'$'}
              leadingCurrency={true}
              theme={'dark'}
            />
              </div>
            </div>
            </div>
          </div>

        <div className="p-1 shadow-4 bg-[#FFF300] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
        <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`WRAPPED LUMENS`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#FFF300]" />

          <div>
            <Typography
              className="flex gap-1 justify-center items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Market Capitalization`)}
            </Typography>
            <div className="h-px my-1 justify-center bg-dark-1000" />
            <Typography 
              className="flex gap-1 justify-center items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(wlumPrice * totalWlumSupply, true, false)}
            </Typography>
          </div>

          <div className="h-px my-4 bg-dark-1000" />
          <div className="grid grid-cols-2 space-between-3">
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
              Market Price
            </Typography>
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
              Wrapped Ratio
            </Typography>
            </div>
            <div className="h-px my-2 bg-dark-1000" />
            <div className="grid grid-cols-2 space-between-3">
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(wlumPrice, true, false)}
                </Typography>
                <Typography 
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(wlumPrice / luxorPrice, false, false)}
              <span className="text-sm leading-5 text-black-50 ml-2">{i18n._(t`PER WLUM`).toUpperCase()}</span>
            </Typography>
               
          </div>
          {/* <div>
            <Typography
              className="flex gap-1 justify-center items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Market Price`)}
            </Typography>
            <div className="h-px my-1 bg-dark-1000" />
            <Typography 
              className="flex gap-1 justify-center items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(wlumPrice, true, false)}
            </Typography>
          </div>
          <div className="h-px my-1 bg-dark-1000" />
          <div>
            <Typography
              className="flex gap-1 justify-center items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`WLUM:LUX Ratio`)}
            </Typography>
            <div className="h-px my-1 bg-dark-1000" />
            <Typography 
              className="flex gap-1 justify-center items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(wlumPrice / luxorPrice, false, false)}
            </Typography>
            </div> */}
          </div>
        </div>
        </div>
    {/* </div> */}
  </Container>
  )
}
