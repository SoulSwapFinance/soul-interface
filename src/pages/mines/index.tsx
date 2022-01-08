import { InformationCircleIcon } from '@heroicons/react/solid'
import { SOUL_ADDRESS, WNATIVE } from 'sdk'
import Container from 'components/Container'
import ExternalLink from 'components/ExternalLink'
import Search from 'components/Search'
import Typography from 'components/Typography'
import MineList from 'features/mines/MineList'
import Menu from 'features/mines/MineMenu'
import { usePositions, useFarms, useSummonerInfo } from 'features/summoner/hooks'
import { classNames } from 'functions/styling'
import useFarmRewards from 'hooks/useFarmRewards'
import useFuse from 'hooks/useFuse'
import { useActiveWeb3React } from 'services/web3'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { POOLS } from 'constants/farms'
import AVERAGE_BLOCK_TIME from 'constants'
import { usePriceHelperContract } from 'features/bond/hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export default function Farm(): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const [liquidity, setLiquidity] = useState()
  const [apr, setApr] = useState()

  const farms = useFarms()
  const router = useRouter()
  const type = router.query.filter === null ? 'all' : (router.query.filter as string)


  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
  })

  const summonerInfo = useSummonerInfo()
  const positions = usePositions()

  // const FILTER = {
  //   all: (farm) => farm.allocPoint !== '0' && farm.chef,
  //   portfolio: (farm) => farm?.amount && !farm.amount.isZero(),
  //   soul: (farm) => farm.pair.type === PairType.SWAP && farm.allocPoint !== '0',
  // }

  const priceHelperContract = usePriceHelperContract()
  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice)
  console.log(soulPrice)

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice)
  console.log(ftmPrice)
  
  const map = (pool) => {
    pool.owner = 'SoulSwap'
    pool.balance = 0

    const pair = POOLS[chainId][pool.lpToken]

    const secondsPerHour = 60 * 60

    function getRewards() {
      const rewardPerSecond =
        ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 1e18

      const defaultReward = {
        token: 'SOUL',
        icon: '/images/token/soul.png',
        rewardPerSecond,
        rewardPerDay: rewardPerSecond * 86400,
        rewardPrice: soulPrice,
      }

      const defaultRewards = [defaultReward]

      return defaultRewards
    }

    const getAprAndLiquidity = async () => {
      try {
        // const result = await fetchFarmStats(pid, farm.token1, farm.token2)
        const tvl = result[0]
        const apr = result[1]
  
        setLiquidity(tvl
          // Number(tvl)
          //   .toFixed(0)
          //   .toString()
          //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        )
  
        // console.log("apr", farmApr);
        setApr(apr
          // Number(apr)
          //   .toFixed(0)
          //   .toString()
          //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        )
      } catch (e) {
        console.warn(e)
      }
    }

    // Fix this asap later
    function getTvl(pool) {
      let lpPrice = 0
      let decimals = 18
      if (pool.lpToken == SOUL_ADDRESS[chainId]) {
        lpPrice = soulPrice * 1E18
        decimals = pair.token0?.decimals
      } else if (pool.lpToken.toLowerCase() == WNATIVE[chainId]) {
        lpPrice = ftmPrice * 1E18
      // } else if (pool.lpToken.toLowerCase() == SEANCE_ADDRESS[chainId].toLowerCase()) {
      //   lpPrice = seancePrice * 1E18
      // } else {
        lpPrice = 0
      }

      return Number(pool.totalLp) * lpPrice
    }

    const rewards = getRewards()

    const tvl = getAprAndLiquidity()

    const roiPerSecond =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerSecond * currentValue.rewardPrice
      }, 0) / Number(tvl)

    const roiPerHour = roiPerSecond * 60 * 60
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
    my: (farm) => farm?.amount && !farm.amount.isZero(),
    soul: (farm) => farm.pair.token0?.id == SOUL_ADDRESS[chainId] || farm.pair.token1?.id == SOUL_ADDRESS[chainId],
    single: (farm) => !farm.pair.token1,
    fantom: (farm) => farm.pair.token0?.id == WNATIVE[chainId] || farm.pair.token1?.id == WNATIVE[chainId],
    stables: (farm) =>
      farm.pair.token0?.symbol == 'USDC' ||
      farm.pair.token1?.symbol == 'USDC' ||
      farm.pair.token0?.symbol == 'DAI' ||
      farm.pair.token1?.symbol == 'DAI',
  }

  const rewards = useFarmRewards()


  // const data = rewards.filter((farm) => {
  //   return type in FILTER ? FILTER[type](farm) : true
  // })

  const data = farms.map(map).filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
  })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  return (
    <Container id="farm-page" className="grid h-full grid-cols-4 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Farm | Soul</title>
        <meta key="description" name="description" content="Farm SOUL" />
      </Head>
      <div className={classNames('sticky top-0 hidden lg:block md:col-span-1')} style={{ maxHeight: '40rem' }}>
        <Menu
          // term={term}
          // onSearch={(value) => {
          //   search(value)
          // }}
          positionsLength={positions.length}
        />
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
          <MineList farms={filtered} term={term} /> */}
        <div className="flex items-center text-lg font-bold text-high-emphesis whitespace-nowrap">
          Farms{' '}
          <div className="w-full h-0 ml-4 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis md:border-gradient-r-blue-pink-dark-800 opacity-20"></div>
        </div>

        <MineList farms={result} term={term} />
      </div>
    </Container>
  )
}