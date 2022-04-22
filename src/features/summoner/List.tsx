import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

import { SoulSwap, Underworld } from './Key'
import { ActiveRow } from './Row'
import { ActivePools, LendingPools, InactivePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@heroicons/react/outline'
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

  const lendingList = LendingPools.map((farm) => (
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
      <div className="flex justify-end px-4">
        <Button>
          <NavLink href="/seance">
            <a className="flex items-center space-x-2 font-medium text-center text-dark-600 cursor-pointer text-base hover:text-high-emphesis">
              <span>Stake</span>
             <ArrowRightIcon width={18} height={18} className="text-dark-600 hover:text-white" />
            </a>
          </NavLink>
        </Button>
      </div>
     <Typography className="text-2xl mb-12 mt-6 border border-dark-600 p-3 font-bold text-center">SoulSwap Pools</Typography>
        <SoulSwap />
        <>{activeList}</>
      <Typography className="text-2xl mb-12 mt-6 border border-blue p-3 font-bold text-center">Lending Pools</Typography>
        <Underworld />
        <>{lendingList}</>
      <Typography className="text-2xl mb-12 mt-6 border border-pink p-3 font-bold text-center">Inactive Pools</Typography>
        <SoulSwap />
        <>{inactiveList}</>
    </>
  )
}

export default FarmList