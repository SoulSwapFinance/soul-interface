import React, { useCallback } from 'react'
import Typography from 'components/Typography'
import { Active, Inactive } from './Key'
import { ActiveRow } from './Row'
import { AvalanchePools, FantomPools, InactiveFantomPools, InactiveAvalanchePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
import { t } from '@lingui/macro'
import { i18n } from '@lingui/core'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import { useRouter } from 'next/router'

export const FarmList = () => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  // handles: create deFarm
  const handleCreate = useCallback(() => {
    router.push(`/defarms/create`)
  }, [])

  // handles: launch deFarm
  const handleLaunch = useCallback(() => {
    router.push(`/defarms/launch`)
  }, [])

  const ftmList = FantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
    />
  ))

  const avaxList = AvalanchePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
    />
  ))

  // const inactiveFtmList = InactiveFantomPools.map((farm) => (
  //   <ActiveRow
  //     key={farm.pid}
  //     pid={farm.pid}
  //     farm={farm}
  //   />
  // ))

  // const inactiveAvaxList = InactiveAvalanchePools.map((farm) => (
  //   <ActiveRow
  //     key={farm.pid}
  //     pid={farm.pid}
  //     farm={farm}
  //   />
  // ))

  return (
    <div>
      <div className="flex ml-2 mt-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button 
            variant={'bordered'}
            color={'purple'}
            className={
                `flex mt-2 font-bold justify-center border border-2 
                rounded rounded-xl`
              }
            onClick={handleCreate}
          >
            <Typography
              className={`text-white`}
            >
              {i18n._(t`Create Farm`)}
            </Typography>
          </Button>
        <Button 
            variant={'bordered'}
            color={'purple'}
            className={
                `flex mt-2 font-bold justify-center border border-2 
                rounded rounded-xl`
              }
            onClick={handleLaunch}
          >
            <Typography
              className={`text-white`}
            >
              {i18n._(t`Launch Campaign`)}
            </Typography>
          </Button>
        </div>
      <Typography className="text-2xl bg-dark-1000 mt-6 border border-dark-600 p-3 font-bold text-center">Decentralized Farms</Typography>
      <Active />
      <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</>
      {/* <div>
        <Typography
          className={classNames(chainId == ChainId.AVALANCHE ? 'hidden' : `text-2xl bg-dark-1000 mt-6 border border-pink p-3 font-bold text-center`)}
        >
          Retired Pools
        </Typography>
        {chainId == ChainId.FANTOM ? <Inactive /> : null}
        {chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList}
      </div> */}
    </div>
  )
}

export default FarmList

FarmList.Guard = NetworkGuard(Feature.DEFARM)