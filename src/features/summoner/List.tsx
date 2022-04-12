import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import { Active } from './Key'
import { ActiveRow } from './Row'
import { ActivePools, InactivePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import Header from 'components/Header'

export const FarmList = () => {
  // const { chainId } = useActiveWeb3React()

  const activeList = ActivePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      lpToken={farm.lpAddresses[250]}
      farm={farm}
    />
  ))

  const inactiveList = InactivePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      lpToken={farm.lpAddresses[250]}
      farm={farm}
    />
  ))

  return (
    <>
     <Typography className="text-2xl mb-12 mt-6 border hover:border-green p-3 font-bold text-center">Active Pools</Typography>
        <Active />
        <>{activeList}</>
      <Typography className="text-2xl mb-12 mt-6 border p-3 hover:border-red font-bold text-center">Retired Pools</Typography>
        <Active />
        <>{inactiveList}</>
    </>
  )
}

export default FarmList