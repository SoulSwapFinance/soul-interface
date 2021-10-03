/* eslint-disable @next/next/link-passhref */
import { useActiveWeb3React, useFuse } from '../../hooks'

import FarmList from '../../features/summoner/FarmList'
import Head from 'next/head'
import Menu from '../../features/summoner/FarmMenu'
import React, { useContext, useState } from 'react'
import { formatNumberScale } from '../../functions'
import { usePositions, useFarms, useDistributorInfo } from '../../features/summoner/hooks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import { SOUL_ADDRESS, WNATIVE } from '../../constants'
import { POOLS } from '../../constants/farms'
import SoulLogo from '../../components/SoulLogo'
import { PriceContext } from '../../contexts/priceContext'
import useSummoner from '../../features/summoner/useSummoner'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useTVL } from '../../hooks/useV2Pairs'
import { getAddress } from '@ethersproject/address'
import { useVaults } from '../../features/vault/hooks'
import Search from '../../components/Search'
import { SEANCE_ADDRESS } from '../../sdk'

export default function Summoner(): JSX.Element {
  const { i18n } = useLingui()
  const router = useRouter()
  const { chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const addTransaction = useTransactionAdder()

  const type = router.query.filter as string

  const positions = usePositions()

  const farms = useFarms()
  const vaults = useVaults()

  const distributorInfo = useDistributorInfo()

  const priceData = useContext(PriceContext)

  const soulPrice = priceData?.['soul']
  const ftmPrice = priceData?.['ftm']
  const seancePrice = priceData?.['seance']

  const tvlInfo = useTVL()

  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
  })

  let summTvl = tvlInfo.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.tvl
  }, 0)

  let summTvlVaults = vaults.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.totalLp / 1e18) * soulPrice
  }, 0)

  const secondsPerDay = 86400
  const secondsPerHour = 3600

  const map = (pool) => {
    pool.owner = 'Soul'
    pool.balance = 0

    const pair = POOLS[chainId][pool.lpToken]


    function getRewards() {
      const rewardPerSecond =
        ((pool.allocPoint / distributorInfo.totalAllocPoint) * distributorInfo.soulPerSecond) / 1e18

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

    //Fix this asap later
    function getTvl(pool) {
      let lpPrice = 0
      let decimals = 18
      if (pool.lpToken == SOUL_ADDRESS[chainId]) {
        lpPrice = soulPrice
        decimals = pair.token0?.decimals
      } else if (pool.lpToken.toLowerCase() == WNATIVE[chainId].toLowerCase()) {
        lpPrice = ftmPrice
      } else if (pool.lpToken.toLowerCase() == SEANCE_ADDRESS[chainId].toLowerCase()) {
        lpPrice = seancePrice
      } else {
        lpPrice = 0
      }

      return Number(pool.totalLp / 10 ** decimals) * lpPrice
    }

    const rewards = getRewards()

    const tvl = getTvl(pool)

    const roiPerSecond =
      rewards.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.rewardPerSecond * currentValue.rewardPrice
      }, 0) / tvl

    const roiPerHour = roiPerSecond * secondsPerHour
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
      farm.pair.token0?.symbol == 'USDC' || farm.pair.token1?.symbol == 'USDC' ||
      farm.pair.token0?.symbol == 'FUSD' || farm.pair.token1?.symbol == 'FUSD' ||
      farm.pair.token0?.symbol == 'fUSDT' || farm.pair.token1?.symbol == 'fUSDT' ||
      farm.pair.token0?.symbol == 'DAI' || farm.pair.token1?.symbol == 'DAI',
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
        <title>Farm | Soul</title>
        <meta key="description" name="description" content="Farm SOUL" />
      </Head>

      <div className="container px-0 mx-auto pb-6">
        <div className={`mb-2 pb-4 grid grid-cols-12 gap-4`}>
          <div className="flex justify-center items-center col-span-12 lg:justify">
            <Link href="/farm">
              <SoulLogo />
            </Link>
          </div>
        </div>
        <DoubleGlowShadowV2 maxWidth={false} opacity={'0.4'}>
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
                        Total Value Locked: {formatNumberScale(summTvl + summTvlVaults, true, 2)}
                      </div>
                      <div className="flex items-center text-center justify-between py-2 text-emphasis">
                        Summoner TVL: {formatNumberScale(summTvl, true, 2)}
                      </div>
                      {positions.length > 0 && (
                        <div className="flex items-center justify-between py-2 text-emphasis">
                        Possessions: {formatNumberScale(valueStaked, true, 2)}
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
                          Possess All (~ {formatNumberScale(allStaked, true, 2)})
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
                        search={(value: string): void => {
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
