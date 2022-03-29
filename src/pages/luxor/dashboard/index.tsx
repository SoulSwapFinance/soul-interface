import React, { useEffect, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
// import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { formatNumber } from 'functions'
// import DashboardLineGraph from 'components/Dashboard/LineGraph'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
// import QuestionHelper from 'components/QuestionHelper/Helper'
// import useLuxorDashboard from 'hooks/useLuxorDashboard'
// import { AutoSizer } from 'react-virtualized'
// import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useFantomPrice, useLuxorPrice, useWrappedLumPrice } from 'hooks/getPrices'
import { usePairPrice } from 'hooks/usePairData'
// import { useLuxTVL } from 'hooks/useV2Pairs'
import { useSorContract, useLuxorContract, useWrappedLumensContract,  useLuxorStakingContract, useLuxorTreasuryContract, useSorMasterContract } from 'hooks/useContract'
// import { LUX_TREASURY_ADDRESS, WFTM_ADDRESS } from 'constants/addresses'
import { DAI_ADDRESS, LUM_ADDRESS } from 'sdk'
// import useApprove from 'hooks/useApprove'
// import { LUX_ADDRESS } from 'constants/addresses'
import { usePairContract, useTokenContract } from 'hooks/useTokenContract'
import { LUXOR_WARMUP_ADDRESS, WFTM_ADDRESS } from 'constants/addresses'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
// import ExternalLink from 'components/ExternalLink'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { useTokenInfo, useUserInfo, usePairInfo, useSorInfo } from 'hooks/useAPI'

export default function Dashboard() {
  const { i18n } = useLingui()
  // const { luxData } = useLuxorDashboard()
  // const [totalLuxorSupply, setTotalLuxorSupply] = useState(0)
  // const [totalSorSupply, setTotalSorSupply] = useState(0)
  // const [totalWlumSupply, setTotalWlumSupply] = useState(0)
  const [stakedLuxor, setStakedLuxor] = useState(0)
  const [lockedLuxor, setLockedLuxor] = useState(0)
  // const [sorDaiCollateral, setSorDaiCollateral] = useState(0)
  // const [sorLuxCollateral, setSorLuxCollateral] = useState(0)
  // const [sorSorCollateral, setSorSorCollateral] = useState(0)
  // const [pooledLux, setPooledLuxor] = useState(0)
  // const [treasuryLuxFtmBalance, setTreasuryLuxFtmBalance] = useState(0)
  // const [treasuryLuxDaiBalance, setTreasuryLuxDaiBalance] = useState(0)
  // const [treasuryFtmDaiBalance, setTreasuryFtmDaiBalance] = useState(0)
  // const [treasuryInvestmentBalance, setTreasuryInvestmentBalance] = useState(0)
  // const [treasuryLiquidityBalance, setTreasuryLiquidityBalance] = useState(0)
  // const [treasuryReserveBalance, setTreasuryReserveBalance] = useState(0)
  // const [treasuryDaiBalance, setTreasuryDaiBalance] = useState(0)
  // const [treasuryFtmBalance, setTreasuryFtmBalance] = useState(0)
  // const [treasuryLendBalance, setTreasuryLendBalance] = useState(0)
  // const [treasuryLendBalance, setTreasuryLendBalance] = useState(0)
  const LuxFtmContract = usePairContract('0x951BBB838e49F7081072895947735b0892cCcbCD')
  const LuxDaiContract = usePairContract('0x46729c2AeeabE7774a0E710867df80a6E19Ef851')
  const FtmDaiContract = usePairContract('0xf3d6e8ecece8647b456d57375ce0b51b8f0cd40b')
  const WlumFtmContract = usePairContract('0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99')
  
  // KEY CONTRACTS //
  const LuxorStakingContract = useLuxorStakingContract()
  // const SorStakingContract = useSorMasterContract()
  const LuxorTreasuryContract = useLuxorTreasuryContract()
  // const SorContract = useSorContract()
  const LuxorContract = useLuxorContract()
  const WrappedLumensContract = useWrappedLumensContract()
  const LumensContract = useTokenContract(LUM_ADDRESS[250])
  // const DaiContract = useTokenContract(DAI_ADDRESS[250])
  const DaiLendFtmContract = useTokenContract('0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd')
  const FtmLendDaiContract = useTokenContract('0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61')
  // const FtmContract = useTokenContract(WFTM_ADDRESS[250])

  // const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(LuxorContract[250])
  // let sorPegPrice = 1
  let sorMarketPrice = 1.0
  // const sorMarketPrice = useSorPrice()
  const LuxorStakingAddress = LuxorStakingContract?.address
  const LuxorWarmupAddress = LUXOR_WARMUP_ADDRESS[250]
  // const DaiContractAddress = DaiContract?.address
  const WrappedLumensAddress = WrappedLumensContract?.address
  // const SorStakingContractAddress = SorStakingContract?.address
  const LuxorTreasuryAddress = LuxorTreasuryContract?.address
  const LuxorFtmAddress = LuxFtmContract.address
  const DaiLendFtmAddress = DaiLendFtmContract.address
  const FtmLendDaiAddress = FtmLendDaiContract.address

// let luxorCirculatingSupply = 100
  const LuxorDaiAddress = LuxDaiContract.address
  const FtmDaiAddress = FtmDaiContract.address
  const WrappedLumFantomAddress = WlumFtmContract.address
  const LuxorAddress = LuxorContract.address
  
  const luxorSupply = Number(useTokenInfo(LuxorAddress).tokenInfo.supply) / 1e9
  const wlumSupply = Number(useTokenInfo(WrappedLumensAddress).tokenInfo.supply) / 1e9
  
  // const { userInfo } = useUserInfo(LuxorTreasuryAddress, WrappedLumFantomAddress)
  // const ftmWlumBalance = Number(userInfo.value)
  // console.log('lumensSupply:%s', wlumSupply)

  // Calculate Minting Rate
  const startTime = 1638424800000
  const nowTime = new Date().getTime()
  // // daysAgo in (recall: nowTime is in ms)
  const daysAgo = (nowTime - startTime) / 8_640_0000 // ~111 Days √
  // const secondsAgo = daysAgo * 86_400
  const luxorPerDay = luxorSupply / daysAgo

  const luxFtmPrice = usePairPrice(LuxorFtmAddress) // ~190_000 // √
  // console.log('luxorVolume:%s', luxData?.result[1])
  // get the price of key treasury reserves
  const luxDaiPrice = usePairPrice(LuxorDaiAddress) // ~160_000 // √
  const wLumFtmPrice = usePairPrice(WrappedLumFantomAddress) // ~1_6M // √
  const ftmDaiPrice = usePairPrice(FtmDaiAddress) 
  
  const luxorCirculatingSupply = luxorSupply - stakedLuxor - lockedLuxor
  
  // GET SOR STATS
  const sorSorCollateral = Number(useSorInfo().sorInfo.sorSorCollateral)
  const sorLuxCollateral = Number(useSorInfo().sorInfo.sorLuxCollateral)
  const sorDaiCollateral = Number(useSorInfo().sorInfo.sorDaiCollateral)
  const totalSorSupply = Number(useSorInfo().sorInfo.supply)

  // enable damped sor collateral rate
  const sorSorCollateralAdjusted = sorSorCollateral * 0.1
  const totalSorCollateral = sorDaiCollateral + sorLuxCollateral + sorSorCollateralAdjusted

  // const result = useCurrencyBalance(LUX_TREASURY_ADDRESS, LUX_FTM)
  // const luxFtmBalance = result
  // totalSupply of FTM in f/d
  // get the price of key treasury liquidity
  // get the price of key treasury investments

  // Prices //
  const luxorPrice = useLuxorPrice()
  const ftmPrice = useFantomPrice()
  const wlumPrice = useWrappedLumPrice()

  // GET RESERVE BALANCES //
  const FtmBalance = Number(useTokenInfo(WFTM_ADDRESS[250]).tokenInfo.treasuryBalance) / 1e18
  const FtmValue = FtmBalance * ftmPrice
  const DaiValue = Number(useTokenInfo(DAI_ADDRESS[250]).tokenInfo.treasuryBalance) / 1e18
  const treasuryReserveBalance = FtmValue + DaiValue

  // console.log('Ftm Bal:%s', FtmBalance)
  // console.log('Dai Bal:%s', DaiBalance)
  
  // GET LIQUIDITY BALANCES //
  const LuxFtmBalance = Number(usePairInfo(LuxorFtmAddress).pairInfo.treasuryBalance) / 1e18
  const LuxDaiBalance = Number(usePairInfo(LuxorDaiAddress).pairInfo.treasuryBalance) / 1e18
  const LuxFtmValue = LuxFtmBalance * luxFtmPrice
  const LuxDaiValue = LuxDaiBalance * luxFtmPrice
  const treasuryLiquidityBalance = LuxFtmValue + LuxDaiValue
  // console.log('treasuryLiquidityBalance:%s', treasuryLiquidityBalance)
    
  // GET INVESTMENT BALANCES //
  const FtmDaiBalance = Number(usePairInfo(FtmDaiAddress).pairInfo.treasuryBalance) / 1e18
  const FtmWlumBalance = Number(usePairInfo(WrappedLumFantomAddress).pairInfo.treasuryBalance) / 1e18
  const FtmLendDaiBalance = Number(usePairInfo(FtmLendDaiAddress).pairInfo.treasuryBalance) / 1e18
  const DaiLendFtmBalance = Number(usePairInfo(DaiLendFtmAddress).pairInfo.treasuryBalance) / 1e18
  const FtmDaiValue = FtmDaiBalance * ftmDaiPrice
  const FtmWlumValue = FtmWlumBalance * wLumFtmPrice
  const FtmLendDaiValue = FtmLendDaiBalance * 1
  const DaiLendFtmValue = DaiLendFtmBalance * ftmPrice

  const treasuryInvestmentBalance = FtmDaiValue + FtmWlumValue + FtmLendDaiValue + DaiLendFtmValue
  console.log('treasuryInvestmentBalance:%s', treasuryInvestmentBalance)
    
  // calculate Treasury Balances
  const treasuryBalance = treasuryLiquidityBalance + treasuryReserveBalance + treasuryInvestmentBalance

  // calculate floor price
  const luxorFloorPrice = treasuryReserveBalance / (luxorSupply)
    
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
      }, 10000)
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    } catch (err) {
      // console.warn(err)
    }
  })

  /**
   * Gets the lpToken balance of the Treasury for each pool
   */
    const fetchBals = async () => {
        try {
            // get treasury balance of Luxor
            // const data = await LuxorContract?.totalSupply()
            // const totalSupply = data / 1e9
            // setTotalLuxorSupply(Number(totalSupply))
            // console.log('totalSupply:%s', Number(totalSupply))

            // const sorSupply = await SorContract?.totalSupply()
            // const totalSorSupply = Number(sorSupply) / 1e18
            // setTotalSorSupply(Number(totalSorSupply))
            // console.log('totalSorSupply:%s', Number(totalSorSupply))

            // const sorDaiBal = await DaiContract?.balanceOf(SorStakingContractAddress)
            // const sorLuxBal = await LuxorContract?.balanceOf(SorStakingContractAddress)
            // const sorSorBal = await SorContract?.balanceOf(SorStakingContractAddress)

            // const sorDaiCollateral = sorDaiBal / 1e18
            // const sorLuxCollateral = sorLuxBal * luxorPrice / 1e9
            // const sorSorCollateral = sorSorBal / 1e18
            
            // setSorDaiCollateral(Number(sorDaiCollateral))
            // setSorLuxCollateral(Number(sorLuxCollateral))
            // setSorSorCollateral(Number(sorSorCollateral))

            // console.log('sorDaiCollateral:%s', Number(sorDaiCollateral))

            // const wlumSupply = await WrappedLumensContract?.totalSupply()
            // const totalWlumSupply = wlumSupply / 1e9
            // setTotalWlumSupply(Number(totalWlumSupply))
            // console.log('totalSorSupply:%s', Number(totalSorSupply))

            // const daiBal = await DaiContract.balanceOf(LuxorTreasuryAddress)
            // const daiBalance = daiBal / 1e18
            // const ftmBal = await FtmContract.balanceOf(LuxorTreasuryAddress)
            // const ftmBalance = ftmBal / 1e18
            // const totalReserveBalance = daiBalance + (ftmBalance * ftmPrice)
            // console.log('ftmPrice:%s', ftmPrice)
            // console.log('ftmBalance:%s', ftmBalance)

            // setTreasuryDaiBalance(daiBalance)
            // setTreasuryFtmBalance(ftmBalance)
            // setTreasuryReserveBalance(Number(totalReserveBalance))
            // console.log('totalReserveBalance:%s', Number(totalReserveBalance))
 
            // get treasury lend balance //
            // const daiLendBal = await DaiFtmLendContract.balanceOf(LuxorTreasuryAddress)
            // const daiLendBalance = daiLendBal / 1e18
            // const ftmLendBal = await FtmDaiLendContract.balanceOf(LuxorTreasuryAddress)
            // const ftmLendBalance = ftmLendBal / 1e18
            // const totalLendBalance = daiLendBalance + (ftmLendBalance * ftmPrice)
            // setTreasuryLendBalance(Number(totalLendBalance))
            // console.log('totalLendBalance:%s', Number(totalLendBalance))

            // get treasury balance of LUX-FTM
            // const luxFtmBal = await LuxFtmContract.balanceOf(LuxorTreasuryAddress)
            // const luxFtmBalance = luxFtmBal * luxFtmPrice / 1e18
            // setTreasuryLuxFtmBalance(Number(luxFtmBalance))
            // console.log('luxFtmBalance:%s', Number(luxFtmBalance))

            // get treasury balance of LUX-DAI
            // const luxDaiBal = await LuxDaiContract.balanceOf(LuxorTreasuryAddress)
            // const luxDaiBalance = luxDaiBal * luxDaiPrice / 1e18
            // setTreasuryLuxDaiBalance(Number(luxDaiBalance))
            // console.log('luxDaiBalance:%s', Number(luxDaiBalance))

            // get treasury balance of FTM-DAI
            // const ftmDaiBal = await FtmDaiContract.balanceOf(LuxorTreasuryAddress)
            // const ftmDaiBalance = ftmDaiBal * ftmDaiPrice / 1e18
            // console.log('ftmDaiPrice:%s', Number(ftmDaiPrice))
            // console.log('ftmDaiBalance:%s', Number(ftmDaiBalance))
            
            // get treasury balance of FTM-WLUM
            // const wlumFtmBal = await WlumFtmContract.balanceOf(LuxorTreasuryAddress)
            // const wlumFtmBalance = wlumFtmBal * wLumFtmPrice / 1e18
            // console.log('wLumFtmPrice:%s', Number(wLumFtmPrice))
            // console.log('wlumFtmBalance:%s', Number(wlumFtmBalance))
            
            // total investments balance //
            // const InvestmentBalance = totalLendBalance + ftmDaiBalance + wlumFtmBalance
            // setTreasuryInvestmentBalance(Number(InvestmentBalance))

            // const LiquidityBalance = luxDaiBalance + luxFtmBalance
            // setTreasuryLiquidityBalance(LiquidityBalance)

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

            return [totalSorSupply, wlumSupply, luxorSupply, sorDaiCollateral, sorLuxCollateral, sorSorCollateral, luxBalance, warmupBalance]
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
    {
        "label": "LIQUIDITY",
        "angle": treasuryLiquidityBalance,
        "color": "#FFF300",
        "percent": ((treasuryLiquidityBalance / treasuryBalance) * 100).toFixed()
    },
    {
      "label": "RESERVES",
      "angle": treasuryReserveBalance,
      "color": "#FFD300",
      "percent": (((treasuryReserveBalance) / treasuryBalance) * 100).toFixed()
    },
    {
        "label": "INVESTMENTS",
        "angle": treasuryInvestmentBalance,
        "color": "#FFB300",
        "percent": (((treasuryInvestmentBalance) / treasuryBalance) * 100).toFixed()
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
      percent: ((luxorCirculatingSupply / luxorSupply) * 100).toFixed(),
      text: 'The combined number of LUX tokens being traded or in public wallets.',
    },
    {
      angle: stakedLuxor,
      color: '#FFC300',
      label: 'STAKED',
      text: 'The portion of supply that is not in circulation as it is currently staking.',
      percent: ((stakedLuxor / luxorSupply) * 100).toFixed()
      ,
    },
    {
      angle: lockedLuxor,
      color: '#FFE300',
      label: 'WARM-UP',
      text: 'The portion of supply that is not in circulation as it is currently in the warm-up period.',
      percent: ((lockedLuxor/ luxorSupply) * 100).toFixed()
      ,
    },
  ]

  return (
    <Container id="dashboard-page" className="py-4 space-y-4 md:py-8 max-w-min">
      <LuxorGlowShadow>
      <Head>
        <title>Dashboard | Luxor</title>
        <meta key="description" name="description" />
      </Head>
      <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/stake'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/bonds'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Wrap </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="yellow" size="lg">
          <NavLink href={'/luxor/sor'}>
            <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stable </span>
            </a>
          </NavLink>
        </Button>
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
              </div>
         </div>  */}
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
              className={'flex text-xl justify-center items-baseline'}
              fontFamily={'medium'} textColor={'text-white'}>
              Market Capitalization
            </Typography>
            <div className="h-px my-1 mb-3 bg-dark-1000" />
            <Typography
              className={'flex justify-center items-baseline'}
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(luxorPrice * luxorSupply, true, false, 0)}
            </Typography>
          </div>
            <div className="md:hidden h-px my-4 mb-3 bg-dark-1000" />
            <div>
              <div className="md:hidden grid grid-cols-2 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center"
                  lineHeight={48} fontFamily={'medium'}>
                  Luxor Price
                </Typography>
                <Typography
                  className="md:hidden flex gap-1 text-lg justify-center items-center"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
              </div>
              <div className="h-px my-1 mb-3 bg-dark-1000" />
              <div className="md:hidden grid grid-cols-2 space-between-3">
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
          <div>
          <div className="md:hidden h-px my-4 bg-dark-1000" />
            <div className="md:hidden grid grid-cols-2 space-between-3">
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
            <div className="md:hidden h-px my-1 mb-3 bg-dark-1000" />
            <div className="md:hidden grid grid-cols-2 space-between-3">
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(luxorSupply, false)}
            </Typography>
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {luxorPerDay.toFixed()}
               <span className="text-xs leading-5 text-black-50 ml-1">{i18n._(t`/ DAY`).toUpperCase()}</span>
            </Typography>
            </div>
            </div>

            <div className="h-px my-4 bg-dark-1000" />
            <div>
              <div className="hidden md:grid md:grid-cols-4 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center"
                  lineHeight={48} fontFamily={'medium'}>
                  Luxor Price
                </Typography>
                <Typography
                  className="hidden md:flex gap-1 text-lg justify-center items-center"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
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
            </div>
            <div>
              <div className="h-px my-2 mb-3 bg-dark-1000" />
              <div className="hidden md:grid md:grid-cols-4 space-between-3">
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
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(luxorSupply, false)}
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {luxorPerDay.toFixed()}
                  <span className="text-xs leading-5 text-black-50 ml-1">{i18n._(t`/ DAY`).toUpperCase()}</span>
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

          {/* LUXOR DISTRIBUTION CHART */}

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
              className="flex text-2xl justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Treasury Distribution`)}
            </Typography>
            <div className="h-px my-4 bg-dark-1000" />
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

        {/* <div className="p-1 shadow-4 bg-[#FFF300] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
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
              Market Price
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
              className="flex text-2xl justify-center gap-1 items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              {i18n._(t`Collateral Distribution`)}
            </Typography>
          </div>
          <div className="h-px my-4 bg-dark-1000" />

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
          </div> */}

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
          <div className="h-px my-1 justify-center bg-dark-1000" />
            <Typography
              className="flex text-xl gap-1 justify-center items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              Market Capitalization
            </Typography>
            <div className="h-px my-1 justify-center bg-dark-1000" />
            <Typography 
              className="flex gap-1 justify-center items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(wlumPrice * wlumSupply, true, false)}
            </Typography>
          </div>

          <div className="h-px my-4 bg-dark-1000" />
          <div className="grid grid-cols-2 space-between-3">
            <Typography 
              className="flex gap-1 text-lg justify-center items-center"
              lineHeight={48} fontFamily={'medium'}>
              Wrapped Price
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
              <span className="text-xs leading-5 text-black-50 ml-1">{i18n._(t`/ WLUM`).toUpperCase()}</span>
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
        </LuxorGlowShadow>
  </Container>
  )
}
