import React, { useEffect, useMemo, useState } from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
// import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { formatNumber } from 'functions'
import styled from 'styled-components'
// import DashboardLineGraph from 'components/Dashboard/LineGraph'
import DashboardDonutChart from 'components/Dashboard/DonutChart'
import DashboardChartLegend from 'components/Dashboard/ChartLegend'
// import QuestionHelper from 'components/QuestionHelper/Helper'
// import useLuxorDashboard from 'hooks/useLuxorDashboard'
// import { AutoSizer } from 'react-virtualized'
// import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useFantomPrice, useLuxorPrice, useWrappedLumPrice } from 'hooks/getPrices'
import { usePairPrice } from 'hooks/usePairData'
import { LuxorBanner } from 'components/Banner'
// import { useLuxTVL } from 'hooks/useV2Pairs'
import { useSorContract, useLuxorContract, useWrappedLumensContract,  useLuxorStakingContract, useLuxorTreasuryContract, useSorMasterContract } from 'hooks/useContract'
// import { LUX_TREASURY_ADDRESS, WFTM_ADDRESS } from 'constants/addresses'
import { DAI_ADDRESS, SOR_ADDRESS, LUM_ADDRESS } from 'sdk'
// import useApprove from 'hooks/useApprove'
// import { LUX_ADDRESS } from 'constants/addresses'
import { usePairContract, useTokenContract } from 'hooks/useTokenContract'
import { LUXOR_WARMUP_ADDRESS, WFTM_ADDRESS } from 'constants/addresses'
import NavLink from 'components/NavLink'
import { Button } from 'components/Button'
// import ExternalLink from 'components/ExternalLink'
import LuxorGlowShadow from 'components/LuxorGlowShadow'
import { useTokenInfo, useUserInfo, usePairInfo, useSorInfo, useLuxorInfo, useUserTokenInfo, usePriceUSD } from 'hooks/useAPI'
// import { ArrowRightIcon } from '@heroicons/react/outline'
import { I18n } from '@lingui/core'
// import Link from 'next/link'
import Image from 'next/image'
// import { t } from '@lingui/macro'
// import Calculator from 'components/Calculator'
import { useToggleCalculatorModal, useToggleModal } from 'state/application/hooks'
import CalculatorModal from 'modals/CalculatorModal'
import { ApplicationModal } from 'state/application/actions'
import StakeModal from 'modals/StakeModal'
import SorModal from 'modals/SorModal'
import LuxorBondsModal from 'modals/LuxorBondsModal'
import LuxorWrapModal from 'modals/LuxorWrapModal'

export default function Dashboard() {
  const { i18n } = useLingui()
  // const { luxData } = useLuxorDashboard()
  const LuxFtmContract = usePairContract('0x951BBB838e49F7081072895947735b0892cCcbCD')
  const LuxDaiContract = usePairContract('0x46729c2AeeabE7774a0E710867df80a6E19Ef851')
  const FtmDaiContract = usePairContract('0xf3d6e8ecece8647b456d57375ce0b51b8f0cd40b')
  const WlumFtmContract = usePairContract('0xa670C1E02c7AE8B3D575293bfA1F7eBa90F81C99')
  const LuxSorContract = usePairContract('0x622E69B6785311800B0d55D72fF27D91F5518212')

  // KEY CONTRACTS //
  // const LuxorStakingContract = useLuxorStakingContract()
  const SorStakingContract = useSorMasterContract()
  // const LuxorTreasuryContract = useLuxorTreasuryContract()
  const SorContract = useSorContract()
  const LuxorContract = useLuxorContract()
  const WrappedLumensContract = useWrappedLumensContract()
  // const LumensContract = useTokenContract(LUM_ADDRESS[250])
  // const DaiContract = useTokenContract(DAI_ADDRESS[250])
  const DaiLendFtmContract = useTokenContract('0xF4Bfdd73FE65D1B46b9968A24443A77ab89908dd')
  const FtmLendDaiContract = useTokenContract('0xFD9BE6a83c7e9cFF48f6D9a3036bb6b20598ED61')
  // const FtmContract = useTokenContract(WFTM_ADDRESS[250])
  // const LuxorStakingAddress = LuxorStakingContract?.address
  // const LuxorWarmupAddress = LUXOR_WARMUP_ADDRESS[250]
  // const DaiContractAddress = DaiContract?.address
  const WrappedLumensAddress = WrappedLumensContract?.address
  const SorStakingContractAddress = SorStakingContract?.address
  // const LuxorTreasuryAddress = LuxorTreasuryContract?.address
  const LuxorFtmAddress = LuxFtmContract.address
  const DaiLendFtmAddress = DaiLendFtmContract.address
  const FtmLendDaiAddress = FtmLendDaiContract.address

// let luxorCirculatingSupply = 100
  const LuxorDaiAddress = LuxDaiContract.address
  const FtmDaiAddress = FtmDaiContract.address
  const WrappedLumFantomAddress = WlumFtmContract.address
  const LuxorAddress = LuxorContract.address
  const LuxSorAddress = LuxSorContract.address
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
  const luxSorPrice = usePairPrice(LuxSorAddress)
  const wLumFtmPrice = usePairPrice(WrappedLumFantomAddress) // ~1_6M // √
  const ftmDaiPrice = usePairPrice(FtmDaiAddress) 
    
  // GET SOR STATS
  const { sorInfo } = useSorInfo()
  const { userTokenInfo } = useUserTokenInfo('0x000000000000000000000000000000000000dead', '0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A')
  // console.log('burned:%s', burnedSupply)
  // const sorSorCollateral = Number(sorInfo.sorCollateral)
  // console.log('sorSorCollateral:%s', sorSorCollateral)
  const sorLuxCollateral = Number(sorInfo.luxorCollateralValue)
  const sorWrappedLumensCollateral = Number(sorInfo.wlumCollateralValue)
  // console.log('sorLuxCollateral:%s', sorLuxCollateral)
  const sorDaiCollateral = Number(sorInfo.daiCollateral)
  // dampens the value of SOR collateral
  // const sorSorCollateralAdjusted = Number(sorInfo.sorCollateral) * 0.1
  const burnedSupply = Number(userTokenInfo.balance) / 1e18 // √ ~100
  const totalSorSupply = Number(sorInfo.supply) - burnedSupply
  // console.log('sorLuxCollateral:%s', sorLuxCollateral)
  const totalSorCollateral = sorDaiCollateral + sorLuxCollateral + sorWrappedLumensCollateral
  // console.log('totalSorCollateral:%s', totalSorCollateral)

  // const result = useCurrencyBalance(LUX_TREASURY_ADDRESS, LUX_FTM)
  // const luxFtmBalance = result
  // totalSupply of FTM in f/d
  // get the price of key treasury liquidity
  // get the price of key treasury investments

  // Prices //
  const luxorPrice = useLuxorPrice()
  const ftmPrice = useFantomPrice()
  const wlumPrice = useWrappedLumPrice()
  const sorBackingPrice = totalSorCollateral / totalSorSupply
  const sorMarketPrice = Number(useTokenInfo('0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A').tokenInfo.price)
  const sorMarketCap
    = sorMarketPrice >= sorBackingPrice
    ? sorMarketPrice * totalSorSupply
    : sorBackingPrice * totalSorSupply

  // GET RESERVE BALANCES //
  const FtmBalance = Number(useTokenInfo(WFTM_ADDRESS[250]).tokenInfo.luxorTreasuryBalance) / 1e18
  const FtmValue = FtmBalance * ftmPrice
  const DaiValue = Number(useTokenInfo(DAI_ADDRESS[250]).tokenInfo.luxorTreasuryBalance) / 1e18
  const SorValue = Number(useTokenInfo(SOR_ADDRESS[250]).tokenInfo.luxorTreasuryBalance) / 1e18
  // console.log('SorValue', SorValue)
  const treasuryReserveBalance = FtmValue + DaiValue + SorValue
  // console.log('treasuryReserveBalance', treasuryReserveBalance)
  
  // GET LUXOR ECONOMY BALANCES //
  const { luxorInfo } = useLuxorInfo()
  const stakedLuxor = Number(luxorInfo.stakingBalance)
  // console.log('staked', stakedLuxor)
  const lockedLuxor = Number(luxorInfo.warmupBalance)
  const luxorCollateral = Number(sorInfo.luxorCollateral) 
  const wrappedCollateral = Number(sorInfo.wlumCollateral) 
  const storedCollateral = luxorCollateral + wrappedCollateral
  const storedLuxor = storedCollateral
  // console.log('lockedLuxor', lockedLuxor)
  // console.log('SorValue', SorValue)
  const wrapIndex = Number(luxorInfo.index)

  const luxorCirculatingSupply = luxorSupply - stakedLuxor - lockedLuxor - storedLuxor
  // console.log('Ftm Bal:%s', FtmBalance)
  // console.log('Dai Bal:%s', DaiBalance)
  
  // GET LIQUIDITY BALANCES //
  const LuxFtmBalance = Number(usePairInfo(LuxorFtmAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const LuxSorBalance = Number(usePairInfo(LuxSorAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const LuxFtmValue = LuxFtmBalance * luxFtmPrice
  const LuxSorValue = LuxSorBalance * luxSorPrice
  const treasuryLiquidityBalance = LuxFtmValue + LuxSorValue
  // console.log('LuxSorBalance:%s', LuxSorBalance)
  // console.log('LuxSorValue:%s', LuxSorValue)
  // console.log('treasuryLiquidityBalance:%s', treasuryLiquidityBalance)

  // GET INVESTMENT BALANCES //
  const FtmDaiBalance = Number(usePairInfo(FtmDaiAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const FtmWlumBalance = Number(usePairInfo(WrappedLumFantomAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const FtmLendDaiBalance = Number(usePairInfo(FtmLendDaiAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const DaiLendFtmBalance = Number(usePairInfo(DaiLendFtmAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const LuxDaiBalance = Number(usePairInfo(LuxorDaiAddress).pairInfo.luxorTreasuryBalance) / 1e18
  const LuxDaiValue = LuxDaiBalance * luxDaiPrice

  const FtmDaiValue = FtmDaiBalance * ftmDaiPrice
  const FtmWlumValue = FtmWlumBalance * wLumFtmPrice
  const FtmLendDaiValue = FtmLendDaiBalance * 1
  const DaiLendFtmValue = DaiLendFtmBalance * ftmPrice

  const treasuryInvestmentBalance = FtmDaiValue + LuxDaiValue + FtmWlumValue + FtmLendDaiValue + DaiLendFtmValue
  // console.log('treasuryInvestmentBalance:%s', treasuryInvestmentBalance)
    
  // calculate Treasury Balances
  const treasuryBalance = treasuryLiquidityBalance + treasuryReserveBalance + treasuryInvestmentBalance

  // calculate floor price
  const luxorFloorPrice = treasuryReserveBalance / (luxorSupply - storedLuxor)

    // const treasuryRevenueCollateralDark = [
    //     {
    //         "label": "SOR Fees",
    //         "angle": 262551.9545530003,
    //         "color": "#343846",
    //         "percent": "58"
    //     },
    //     {
    //         "label": "DEX Fees",
    //         "angle": 98779.83032261429,
    //         "color": "#9BA9D2",
    //         "percent": "22"
    //     },
    //     {
    //         "label": "Others",
    //         "angle": 35264.236397269706,
    //         "color": "#4B5164",
    //         "text": "",
    //         "percent": "8"
    //     }
    // ]

    const sorCollateralData = [
      {
          "angle": sorDaiCollateral,
          "color": "#FFB300",
          "label": "DAI Collateral",
          "percent": (sorDaiCollateral / totalSorCollateral * 100).toFixed()
      },
      {
          "angle": sorLuxCollateral,
          "color": "#FFD300",
          "label": "LUX Collateral",
          "percent": (sorLuxCollateral / totalSorCollateral * 100).toFixed()
      },
      {
          "angle": sorWrappedLumensCollateral,
          "color": "#FFD300",
          "label": "WLUM Collateral",
          "percent": (sorWrappedLumensCollateral / totalSorCollateral * 100).toFixed()
      },
      // {
      //     "angle": sorSorCollateral,
      //     "color": "#F5D100",
      //     "label": "Sor Collateral",
      //     "percent": (sorSorCollateral / totalSorCollateral * 100).toFixed()
      // }
  ]

  const treasuryBalanceData = [
    {
        "label": "LIQUIDITY",
        "angle": treasuryLiquidityBalance,
        "color": "#FFA300",
        "percent": ((treasuryLiquidityBalance / treasuryBalance) * 100).toFixed()
    },
    {
      "label": "RESERVES",
      "angle": treasuryReserveBalance,
      "color": "#FFC300",
      "percent": (((treasuryReserveBalance) / treasuryBalance) * 100).toFixed()
    },
    {
        "label": "INVESTMENTS",
        "angle": treasuryInvestmentBalance,
        "color": "#FFE300",
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
    //     "color": "#F5D100",
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
      color: '#FFB300',
      label: 'STAKED',
      text: 'The portion of supply that is not in circulation as it is currently staking.',
      percent: ((stakedLuxor / luxorSupply) * 100).toFixed()
      ,
    },
    {
      angle: lockedLuxor,
      color: '#FFC300',
      label: 'WARM-UP',
      text: 'The portion of supply not in circulation as it is currently in the warm-up period.',
      percent: ((lockedLuxor / luxorSupply) * 100).toFixed()
      ,
    },
    {
      angle: storedLuxor,
      color: '#FFD300',
      label: 'SOR BACKING',
      text: 'The portion of supply not in circulation as it is currently locked into the SOR contract as backing value.',
      percent: ((storedLuxor / luxorSupply) * 100).toFixed()
      ,
    },
  ]

  // const toggleCalculatorModal = useToggleCalculatorModal()
  // const toggleStakeModal = useToggleModal(ApplicationModal.STAKE)
  // const toggleSorModal = useToggleModal(ApplicationModal.SOR)
  // const toggleWrapModal = useToggleModal(ApplicationModal.WRAP)
  
const HideOnMobile = styled.div`
  @media screen and (max-width: 900px) {
    display: none;
   }
 `;


  return (
    <Container id="dashboard-page" className="py-4 space-y-4 md:py-8 max-w-min">
      {/* <LuxorBanner /> */}
      <LuxorGlowShadow>
      <Head>
        <title>Dashboard | Luxor</title>
        <meta key="description" name="description" />
      </Head>
      {/* <div className="flex mb-4 items-center justify-center"> */}
          {/* <div className="grid grid-cols-4 items-center justify-between w-full">
    <div className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleCalculatorModal()}>
        <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
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
          <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
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
          <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
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
          <div className="grid items-center text-center grid-flow-cols py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
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
      </div>
  </div> */}
      {/* </div> */}

      <div className="grid grid-cols ml-3 mr-3 justify-center">
    <HideOnMobile>
      <div className="py-1 mb-1 mt-3 ml-3 mr-3 bg-yellow" />
        <div className="py-1 mb-1 ml-3 mr-3 bg-gold" />
        <Typography variant="h1" className="text-center mt-4 mb-4 text-yellow" component="h1">
          LUXOR MONEY
        </Typography>
        <div className="py-1 mt-1 ml-3 mr-3 bg-yellow" />
        <div className="py-1 mt-1 mb-3 ml-3 mr-3 bg-gold" />
</HideOnMobile>
      <div className="flex ml-4 mr-4 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="gold" size="lg">
          <NavLink href={'/luxor/stake'}>
            <a className="block text-lg md:text-xl text-black text-primary p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="gold" size="lg">
          <NavLink href={'/luxor/bonds'}>
            <a className="block text-lg md:text-xl text-black text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="gold" size="lg">
          <NavLink href={'/luxor/wrap'}>
            <a className="block text-lg md:text-xl text-black text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Wrap </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="gold" size="lg">
          <NavLink href={'/luxor/sor'}>
            <a className="block text-lg md:text-xl text-black text-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stable </span>
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

        <div className="p-1 shadow-4 bg-[#F5D100] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
          <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`LUXOR ECONOMY`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#F5D100]" />
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
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Luxor Price
                </Typography>
                <Typography
                  className="md:hidden flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
              </div>

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
              className="flex gap-1 text-lg justify-center items-center mb-3"
              lineHeight={48} fontFamily={'medium'}>
              Luxor Supply
            </Typography>
            <Typography 
              className="flex gap-1 text-lg justify-center items-center mb-3"
              lineHeight={48} fontFamily={'medium'}>
               Emissions Rate
            </Typography>
            </div>
            <div className="md:hidden grid grid-cols-2 space-between-3">
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(luxorSupply, false)}
            </Typography>
            <Typography 
            className={'flex justify-center items-baseline'}
            variant={'h1'} lineHeight={48} fontFamily={'medium'}>
              { formatNumber(luxorPerDay, false, true) }
               <span className="text-xs leading-5 text-black-50 ml-1">{i18n._(t`/ DAY`).toUpperCase()}</span>
            </Typography>
            </div>
            </div>

            <div className="h-px my-4 bg-dark-1000" />
            <div>
              <div className="hidden md:grid md:grid-cols-4 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Market Price
                </Typography>
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Total Supply
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Emissions Rate
                </Typography>
              </div>
            </div>
            <div>
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
                  { formatNumber(luxorPerDay, false, true) }
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

      <div className="p-1 shadow-4 bg-[#F5D100] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
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
          <div className="h-px my-4 bg-[#F5D100]" />
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

        <div className="p-1 shadow-4 bg-[#F5D100] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
        <div className="bg-dark-1000 p-4">
        <Typography
            className="text-2xl flex gap-1 justify-center items-center"
            weight={600}
            lineHeight={48}
            textColor="text-accent text-[#FFFFFF]"
            fontFamily={'semi-bold'}
          >
            {i18n._(t`SOR STABLECOIN`).toUpperCase()}
          </Typography>
          <div className="h-px my-4 bg-[#F5D100]" />
          <div>
            <Typography
              className="flex gap-1 text-xl justify-center items-center"
              fontFamily={'medium'}
              textColor={'text-white'}
            >
              Market Capitalization
            </Typography>
            <div className="h-px my-1 justify-center bg-dark-1000" />
            <Typography 
              className="flex gap-1 justify-center items-center"
              variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(sorMarketCap, true, false)}
            </Typography>
          </div>

          <div className="h-px my-4 bg-dark-1000" />
          <div>
            <div className="hidden md:grid md:grid-cols-4 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Market Price
                </Typography>
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Total Supply
                </Typography>
                <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-3"
                  lineHeight={48} fontFamily={'medium'}>
                  Total Collateral
                </Typography>
            </div>


            <div className="hidden md:grid md:grid-cols-4 space-between-3">
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(sorMarketPrice, true, false, 0)}
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(sorBackingPrice, true, false)}
                </Typography>
                <Typography
                className={'flex justify-center items-baseline'}
                variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(totalSorSupply, false, true)}
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(totalSorCollateral, true, true)}
                </Typography>
            </div>

            <div className="md:hidden grid grid-cols-2 space-between-3">
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-2"
                  lineHeight={48} fontFamily={'medium'}>
                  Market Price
                </Typography>
                <Typography
                  className="flex gap-1 text-xl justify-center items-center mb-2"
                  lineHeight={48} fontFamily={'medium'}>
                  Backing Price
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(sorMarketPrice, true, false, 0)}
                </Typography>
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(sorBackingPrice, true, false)}
                </Typography>
            </div>
          </div>

          <div className="md:hidden h-px my-4 bg-dark-1000" />
            
            <div className="md:hidden grid grid-cols-2 space-between-3">
              <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-2"
                  lineHeight={48} fontFamily={'medium'}>
                  Total Supply
              </Typography>
              <Typography
                  className="flex gap-1 text-lg justify-center items-center mb-2"
                  lineHeight={48} fontFamily={'medium'}>
                  Total Collateral
              </Typography>
              <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(totalSorSupply, false, true)}
              </Typography>
              <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
                  {formatNumber(totalSorCollateral, true, true)}
              </Typography>
            </div>

          {/* <div className="grid grid-cols-2 space-between-3">
                <Typography
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               { formatNumber(sorMarketPrice, true, true) }
                </Typography>
                <Typography 
                  className={'flex justify-center items-baseline'}
                  variant={'h1'} lineHeight={48} fontFamily={'medium'}>
               {formatNumber(totalSorSupply, false, true)}{' '}
              <span className="text-sm leading-5 text-black-50 ml-2">{i18n._(t`SOR`).toUpperCase()}</span>
            </Typography>
          </div> */}
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
          </div>

        <div className="p-1 shadow-4 bg-[#F5D100] rounded-none sm:rounded-8 space-y-5 inline-block w-screen md:w-540 ml-3 mr-3 mb-6">
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
          <div className="h-px my-4 bg-[#F5D100]" />

          {/* <div>
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
          </div> */}

          {/* <div className="h-px my-4 bg-dark-1000" /> */}
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
               {/* {formatNumber(wlumPrice / luxorPrice, false, false)} */}
                  { formatNumber(wrapIndex, false, true) }
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
