/* eslint-disable @next/next/link-passhref */
import React, { useContext, useState } from 'react'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { getAddress } from '@ethersproject/address'

import { useActiveWeb3React, useFuse } from '../../hooks'
import { formatNumberScale } from '../../functions'
import { usePositions, useFarms, useSummonerInfo } from '../../features/summoner/hooks'
import { useRouter } from 'next/router'
import Card from '../../components/Card'
import { Button } from '../../components/Button'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import FarmList from '../../features/summoner/FarmList'
import Menu from '../../features/summoner/FarmMenu' // todo ?
import { SOUL_ADDRESS, AVERAGE_BLOCK_TIME, WNATIVE, SEANCE_ADDRESS } from '../../constants'
import { POOLS } from '../../constants/farms'
// import { PriceContext } from '../../contexts/priceContext'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useTVL } from '../../hooks/useV2Pairs'
// import { useVaults } from '../../features/vault/hooks'
import Search from '../../components/Search'
import useSummoner from '../../features/summoner/useSummoner'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { usePriceHelperContract } from '../../features/bond/hooks/useContract'
import { formatCurrency } from '../../modals/TokensStatsModal'

export default function FarmV2() {
  const { i18n } = useLingui()
  const router = useRouter()
  const { chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const addTransaction = useTransactionAdder()
  const [liquidity, setLiquidity] = useState()
  const [apr, setApr] = useState()

  const type = router.query.filter

  const positions = usePositions()

  const farms = useFarms()
  // const vaults = useVaults()

  console.log('farms')
  console.log(farms)

  const summonerInfo = useSummonerInfo()

  const priceHelperContract = usePriceHelperContract()
  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice)
  console.log(soulPrice)

  // const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  // const soulPrice = Number(rawSoulPrice)
  // console.log('soul price:%s', soulPrice)

  const rawFtmPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'])?.result
  console.log(Number(rawFtmPrice))
  const ftmPrice = Number(rawFtmPrice)
  console.log(ftmPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  console.log(Number(rawSeancePrice))
  const seancePrice = Number(rawSeancePrice)
  console.log(seancePrice)

  const tvlInfo = useTVL()

  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
  })

  let summTvl = tvlInfo.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.tvl
  }, 0)

  // let summTvlVaults = vaults.reduce((previousValue, currentValue) => {
  //   return previousValue + (currentValue.totalLp / 1e18) * soulPrice
  // }, 0)

  // const blocksPerDay = 86400 / Number(AVERAGE_BLOCK_TIME[chainId])
  const secondsPerDay = 86400

  const map = (pool) => {
    pool.owner = 'SoulSwap'
    pool.balance = 0

    const pair = POOLS[chainId][pool.lpToken]

    const blocksPerHour = 3600 / AVERAGE_BLOCK_TIME[chainId]
    const secondsPerHour = 60 * 60

    function getRewards() {
      const rewardPerSecond =
        ((pool.allocPoint / Number(summonerInfo.totalAllocPoint)) * Number(summonerInfo.soulPerSecond)) / 1e18

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

    const getAprAndLiquidity = async () => {
      try {
        const result = await fetchFarmStats(pid, farm.token1, farm.token2)
        const tvl = result[0]
        const apr = result[1]
  
        setLiquidity(
          Number(tvl)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        )
  
        // console.log("apr", farmApr);
        setApr(
          Number(apr)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        )
      } catch (e) {
        console.warn(e)
      }
    }

    // // Fix this asap later
    // function getTvl(pool) {
    //   let lpPrice = 0
    //   let decimals = 18
    //   if (pool.lpToken == SOUL_ADDRESS[chainId]) {
    //     lpPrice = soulPrice * 1E18
    //     decimals = pair.token0?.decimals
    //   } else if (pool.lpToken.toLowerCase() == WNATIVE[chainId].toLowerCase()) {
    //     lpPrice = ftmPrice * 1E18
    //   } else if (pool.lpToken.toLowerCase() == SEANCE_ADDRESS[chainId].toLowerCase()) {
    //     lpPrice = seancePrice * 1E18
    //   } else {
    //     lpPrice = 0
    //   }

    //   return Number(pool.totalLp) * lpPrice
    // }

    const rewards = getRewards()

    const tvl = getAprAndLiquidity()

    const roiPerSecond =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerSecond * currentValue.rewardPrice
      }, 0) / tvl

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

  const data = farms.map(map).filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
  })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol', 'pair.token0.name', 'pair.token1.name'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  const allStaked = positions.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.pendingSoul / 1e18) * soulPrice
  }, 0)

  const valueStaked = positions.reduce((previousValue, currentValue) => {
    const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
    const poolTvl = tvlInfo.find((r) => getAddress(r.lpToken) == getAddress(pool?.lpToken))
    return previousValue + (currentValue.amount / 1e18) * poolTvl?.lpPrice
  }, 0)

  const { harvest } = useSummoner()
  return (
    <>
      <Head>
        <title>Summoner V2 | SoulSwap</title>
        <meta key="description" name="description" content="Farm SOUL" />
      </Head>

      <div className="container px-0 mx-auto sm:pb-16 sm:pt-16">
        <DoubleGlowShadowV2 maxWidth={false}>
          <div className={`grid grid-cols-12 gap-2 min-h-1/2`}>
            <div className={`col-span-12`}>
              <Card className="bg-dark-900 z-4">
                <div className={`grid grid-cols-12 md:space-x-4 space-y-4 md:space-y-0 `}>
                  <div className={`col-span-12 md:col-span-3 space-y-4`}>
                    <div className={`hidden md:block`}>
                      <Menu
                        term={term}
                        onSearch={(value) => {
                          search(value)
                        }}
                        positionsLength={positions.length}
                      />
                    </div>
                    <div className={`flex flex-col items-center justify-between px-6 py-6 `}>
                      <div className="flex items-center text-center justify-between py-2 text-emphasis">
                        {/* Total Value Locked: {formatNumberScale(summTvl + summTvlVaults, true, 2)} */}
                        TOTAL VALUE (TVL): {formatNumberScale(summTvl, true, 2)}
                      </div>
                      {/* <div className="flex items-center text-center justify-between py-2 text-emphasis">
                        Farms TVL: {formatNumberScale(summTvl, true, 2)}
                      </div> */}
                      {positions.length > 0 && (
                        <div className="flex items-center justify-between py-2 text-emphasis">
                          DEPOSITED VALUE: {formatNumberScale(valueStaked, true, 2)}
                        </div>
                      )}
                      {positions.length > 0 && (
                        <Button
                          color="gradient"
                          className="text-emphasis"
                          variant={'flexed'}
                          size={'nobase'}
                          disabled={pendingTx}
                          onClick={async () => {
                            setPendingTx(true)
                            for (const pos of positions) {
                              try {
                                const tx = await harvest(parseInt(pos.id))
                                addTransaction(tx, {
                                  summary: `${i18n._(t`Harvest`)} SOUL`,
                                })
                              } catch (error) {
                                console.error(error)
                              }
                            }
                            setPendingTx(false)
                          }}
                        >
                          HARVEST ALL: {formatNumberScale(allStaked / 1E18, true, 2)}
                        </Button>
                      )}
                    </div>
                    <div className={`md:hidden`}>
                      <Menu
                        term={term}
                        onSearch={(value) => {
                          search(value)
                        }}
                        positionsLength={positions.length}
                      />
                    </div>
                  </div>
                  <div className={`col-span-12 md:col-span-9 py-4 md:px-6 md:py-4 rounded`}>
                    <div className={'mb-8 px-1 md:px-0'}>
                      <Search
                        className={'bg-dark-800 rounded border border-dark-800'}
                        placeholder={'Search by name, symbol or address'}
                        term={term}
                        search={(value) => {
                          search(value)
                        }}
                      />
                    </div>
                    <FarmList farms={result} term={term} filter={FILTER} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </DoubleGlowShadowV2>
      </div>
    </>
  )
}