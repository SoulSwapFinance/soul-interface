
import { Chef, PairType } from '../../features/summoner/enum'
import { useActiveWeb3React, useFuse } from '../../hooks'

import Container from '../../components/Container'
import FarmList from '../../features/summoner/FarmList'
import Head from 'next/head'
import Menu from '../../features/summoner/FarmMenu'
import React, { useContext } from 'react'
import Search from '../../components/Search'
import { classNames } from '../../functions'
import useFarmRewards from '../../hooks/useFarmRewards'
import { useFarms, usePositions, useSummonerInfo } from '../../features/summoner/hooks'
import { useRouter } from 'next/router'
import { filter } from 'lodash'
import { SEANCE_ADDRESS, SOUL_ADDRESS, WNATIVE } from '../../sdk'
import { PriceContext } from '../../contexts/priceContext'
import { useTVL } from '../../hooks/useV2Pairs'
import { POOLS } from '../../constants/farms'
import { getAddress } from 'ethers/lib/utils'
import useSummoner from '../../features/summoner/useSummoner'
// import Provider from '../../features/kashi/context'

// export default function Summoner(): JSX.Element {
const Summoner = () => {
  const { chainId } = useActiveWeb3React()

  const WFTM_ADDRESS = '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'
  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

  const positions = usePositions()
  const farms = useFarms()
  // const vaults = useVaults()

  const summonerInfo = useSummonerInfo()

  const priceData = useContext(PriceContext)

  const soulPrice = priceData?.['soul']
  const ftmPrice = priceData?.['ftm']
  const seancePrice = priceData?.['seance']
  
  const tvlInfo = useTVL()

  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
  })

  let sumTvl = tvlInfo.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.tvl
  }, 0)

  // let sumTvlVaults = vaults.reduce((previousValue, currentValue) => {
  // return previousValue + (currentValue.totalLp / 1e18) * soulPrice // todo: fix
  // }, 0)

  const secondsPerDay = 86400
  const secondsPerHour = 3600

  const map = (pool) => {
    pool.owner = 'Soul'
    pool.balance = 0

    const pair = POOLS[chainId][pool.lpToken]


    function getRewards() {
      const rewardPerSecond =
        ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 10**18

      const defaultReward = {
        token: 'SOUL',
        icon: '/images/token/soul.png',
        rewardPerSecond,
        rewardPerDay: rewardPerSecond * secondsPerDay,
        rewardPrice: soulPrice,
      }

      const defaultRewards = [defaultReward]

      return defaultRewards
    }

    // Fix this asap later
    function getTvl(pool) {
      let lpPrice = 0
      let decimals = 18
      if (pool.lpToken == SOUL_ADDRESS[chainId]) {
        lpPrice = soulPrice
        decimals = pair.token0?.decimals
      } else if (pool.lpToken.toLowerCase() == WFTM_ADDRESS.toLowerCase()) {
        lpPrice = ftmPrice
      } else if (pool.lpToken.toLowerCase() == SEANCE_ADDRESS[chainId].toLowerCase()) {
        lpPrice = seancePrice
      } else {
        lpPrice = 0
      }

      return Number(pool.totalLp / 10 ** decimals) * lpPrice // todo: fix
    }

    const rewards = getRewards()

    const tvl = getTvl(pool)

    const roiPerSecond =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerSecond * currentValue.rewardPrice
      }, 0) / tvl

    const roiPerHour = roiPerSecond * 3600
    const roiPerDay = roiPerHour * 24
    const roiPerMonth = roiPerDay * 30
    const roiPerYear = roiPerDay * 365

    const position = positions.find((position) => position.id === pool.id)

    return {
      ...pool,
      ...position,
      pair: {
        ...pair,
        decimals: 18,
      },
      roiPerSecond,
      roiPerHour,
      roiPerDay,
      roiPerMonth,
      roiPerYear,
      rewards,
      tvl,
      secondsPerHour,
    }
  }

  const FILTER = {
    my: (farm) => farm?.amount, // && !farm.amount.isZero(),
    soul: (farm) => farm.pair.token0?.symbol == 'SOUL' || farm.pair.token1?.symbol == 'SOUL',
    single: (farm) => !farm.pair.token1,
    fantom: (farm) => farm.pair.token0?.id == WNATIVE[chainId] || farm.pair.token1?.id == WNATIVE[chainId]
            || farm.pair.token0?.symbol == 'FTM' || farm.pair.token1?.symbol == 'FTM',
    stables: (farm) =>
      farm.pair.token0?.symbol == 'USDC' && (farm.pair.token1?.symbol == 'fUSDT' || farm.pair.token1?.symbol == 'FUSD' || farm.pair.token1?.symbol == 'DAI') ||
      farm.pair.token0?.symbol == 'fUSDT' && (farm.pair.token1?.symbol == 'USDC' || farm.pair.token1?.symbol == 'FUSD' || farm.pair.token1?.symbol == 'DAI') ||
      farm.pair.token0?.symbol == 'FUSD' && (farm.pair.token1?.symbol == 'USDC' || farm.pair.token1?.symbol == 'fUSDT' || farm.pair.token1?.symbol == 'DAI') ||
      farm.pair.token0?.symbol == 'DAI' && (farm.pair.token1?.symbol == 'gFUSDT' || farm.pair.token1?.symbol == 'USDC' || farm.pair.token1?.symbol == 'fUSDT' || farm.pair.token1?.symbol === 'FUSD')
  }

  const data = farms.map(map).filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
    return farm
  })

  // const data = useFarmRewards().filter((farm) => {
  //   return type in FILTER ? FILTER[type](farm) : true
  // })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  const allStaked = positions.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.pendingSoul / 1E18) * soulPrice
  }, 0)

  const valueStaked = positions.reduce((previousValue, currentValue) => {
    const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
    const poolTvl = tvlInfo.find((r) => getAddress(r.lpToken) == getAddress(pool?.lpToken))
    return previousValue + (currentValue.amount) * poolTvl?.lpPrice
  }, 0)

  const { harvest } = useSummoner()

  return (
    <Container id="farm-page" className="grid h-full grid-cols-4 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Farm | Soul</title>
        <meta key="description" name="description" content="Farm SOUL" />
      </Head>
      <div className={classNames('sticky top-0 hidden lg:block md:col-span-1')} style={{ maxHeight: '40rem' }}>
        {/* <Menu positionsLength={positions.length} /> */}
        <Menu positionsLength={positions.length} onSearch={''} term={''} />
      </div>
      <div className={classNames('space-y-6 col-span-4 lg:col-span-3')}>
        <Search
          search={search}
          term={term}
          inputProps={{
            className:
              'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
          }}
        />

        {/* <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
            Ready to Stake{' '}
            <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
          </div>
          <FarmList farms={result} term={term} filter={FILTER} /> */}

        <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
          Farms{' '}
          <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
        </div>

        <FarmList farms={result} term={term} filter={FILTER} />
      </div>
    </Container>
  )
}

export default Summoner