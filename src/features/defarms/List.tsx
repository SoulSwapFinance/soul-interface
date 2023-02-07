import React from 'react'
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

export const FarmList = () => {
  const { chainId } = useActiveWeb3React()
  const ftmList = FantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      farm={farm}
    />
  ))

  const avaxList = AvalanchePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      farm={farm}
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
        <NavLink href={'/soul/dashboard'}>
          <Button variant="filled"
            color={"purple"}
            size="lg">
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> {i18n._(t`Data`)} </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/bonds'}>
          <Button variant="filled"
            color={"purple"}
            size="lg">
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> {i18n._(t`Bond`)} </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/lend'}>
          <Button variant="filled"
            color={"purple"}
            size="lg"
          >
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> {i18n._(t`Lend`)} </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/autostake'}>
          <Button variant="filled"
            color={"purple"}
            size="lg"
          >
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> {i18n._(t`Vault`)} </span>
            </a>
          </Button>
        </NavLink>
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

FarmList.Guard = NetworkGuard(Feature.LIQUIDITY_MINING)