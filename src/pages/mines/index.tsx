// import { InformationCircleIcon } from '@heroicons/react/solid'
import { SOUL_ADDRESS } from 'sdk'
import Container from 'components/Container'
// import ExternalLink from 'components/ExternalLink'
import Search from 'components/Search'
import MineList from 'features/mines/MineList'
import Menu from 'features/mines/components/MineMenu'
// import Header from 'features/mines/components/Header'
// import { classNames } from 'functions/styling'
import useFuse from 'hooks/useFuse'
import { useActiveWeb3React } from 'services/web3'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { POOLS } from 'constants/farms'
// import { useSoulSummonerContract } from 'hooks/useContract'
// import { Button } from 'components/Button'
// import { formatNumberScale } from 'functions'
// import { addTransaction } from 'state/transactions/actions'
// import { getAddress } from '@ethersproject/address'
// import { useTVL } from 'hooks/useV2Pairs'
import { usePrice, useFarms, useSummonerInfo } from 'hooks'
// import { SEANCE_ADDRESS, WNATIVE } from 'constants/addresses'
import { TridentBody, TridentHeader } from 'layouts/Trident'
import Typography from 'components/Typography'
import { useRewards } from 'hooks/useRewards'
// import ExternalLink from 'comp/onents/ExternalLink'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import useFarmRewards from 'hooks/useFarmRewards'
import { usePositions } from 'features/mines/hooks'
import { farmMap } from 'functions'
export default function Mines(): JSX.Element {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const type = router.query.filter === null ? 'active' : (router.query.filter as string)
  const rewards = useFarmRewards()
  const { query, asPath } = useRouter()

  // function useFarms() {
  //   return useSoulFarms(useSoulSummonerContract())
  // }

  const farms = useFarms()

  // const { harvest } = useSummoner()

  // const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
  //   return { ...POOLS[chainId][key], lpToken: key }
  // })

  // const tvlInfo = useTVL()

  const positions = usePositions()

  const FILTER = {
    deposited: (farm) => farm.amount,
    active: (farm) => farm.allocPoint > 0,
    inactive: (farm) => farm.allocPoint == 0,
    soulswap: (farm) => farm.allocPoint > 0
      && (
        farm.pair.token0?.symbol == 'SOUL'
        || farm.pair.token0?.symbol == 'SEANCE'
        || farm.pair.token0?.symbol == 'LUX'
        || farm.pair.token0?.symbol == 'wLUM'

        || farm.pair.token1?.symbol == 'SOUL'
        || farm.pair.token1?.symbol == 'SEANCE'
        || farm.pair.token1?.symbol == 'LUX'
        || farm.pair.token1?.symbol == 'wLUM'
      ),
    single: (farm) => farm.pair.token0 && !farm.pair.token1,
    fantom: (farm) => farm.allocPoint > 0 && (farm.pair.token0?.symbol == 'FTM' || farm.pair.token1?.symbol == 'FTM'),
    stables: (farm) => farm.allocPoint == 200 // since all [active] stables have 200 AP <3
  }

  const summonerInfo = useSummonerInfo()

  const data = useMemo(() => {
    if (farms && summonerInfo) {
      const map = farmMap(chainId);
      const filterValue = asPath.match(/filter=(.*)/);
      const type = !filterValue ? 'active' : (filterValue[1] as string)
      return farms.map(map).filter((farm) => {
        return type in FILTER ? FILTER[type](farm) : true
      })
    }
  }, [farms, asPath, summonerInfo, chainId]);

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  // const allStaked = positions.reduce((previousValue, currentValue) => {
  //   return previousValue + (currentValue.pendingSoul / 1e18) * soulPrice
  // }, 0)

  // const valueStaked = positions.reduce((previousValue, currentValue) => {
  //   const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
  //   const poolTvl = tvlInfo.find((r) => getAddress(r.lpToken) == getAddress(pool?.lpToken))
  //   return previousValue + (currentValue.amount / 1e18) * poolTvl?.lpPrice
  // }, 0)
  
  return (
    <>
      <TridentHeader className="sm:!flex-row justify-left items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`SoulSwap Farms`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Earn fees and rewards by depositing and staking your liquidity tokens (LP) to the platform.`)}
          </Typography>
        </div>
       {/* <div className={`flex items-center justify-between px-2 py-2`}>
        <div className="flex gap-0">
          <Button
            color="blue"
            className="text-emphasis"
            variant="outlined"
            size={"sm"}
          >
            {'YOURS '}
            {formatNumberScale(valueStaked, true, 2)} {' STAKED'}             
            </Button> */}
          {/* {positions.length > 0 && (
            <Button
              color="greydient"
              className="text-emphasis"
              variant="flexed"
              size={"sm"}
              disabled={pendingTx}
              onClick={async () => {
                setPendingTx(true)
                for (const pos of positions) {
                  try {
                    const tx = await harvest(parseInt(pos.id))
                    addTransaction(tx)
                  } catch (error) {
                    console.error(error)
                  }
                }
                setPendingTx(false)
              }}
            >
              CLAIM ALL {formatNumberScale(allStaked, true, 2)}
            </Button>
          )} */}
         {/* <Button
            color="blue"
            className="text-emphasis"
            variant={'outlined'}
            size={"sm"}
          >
            {'TOTAL: '}
            {formatNumberScale(summTvl, true, 2)} {' '} TOTAL
          </Button>
        </div>
        </div> */}
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <Search search={search} term={term} />
            <Menu />
          </div>
          <MineList farms={result} term={term} />
        </div>
      </TridentBody>
    </>
  )
}