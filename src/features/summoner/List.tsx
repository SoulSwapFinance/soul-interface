import React from 'react'
import Typography from 'components/Typography'

import { Active, Inactive, Underworld } from './Key'
import { ActiveRow } from './Row'
import { ActivePools, LendingPools, InactivePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { ArrowRightIcon } from '@heroicons/react/outline'

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
<div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" color="deepPurple" size="lg">
          <NavLink href={'/seance'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Stake </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="blue" size="lg">
          <NavLink href={'/soul/dashboard'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Dashboard </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="deepPurple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="blue" size="lg">
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Lend </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="deepPurple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
            <span> Vault </span>
            </a>
          </NavLink>
        </Button>
      </div>
     <Typography className="text-2xl bg-dark-1000 mb-3 mt-6 border border-dark-600 p-3 font-bold text-center">SoulSwap Pools</Typography>
        <Active />
        <>{activeList}</>
      <Typography className="text-2xl bg-dark-1000 mb-3 mt-6 border border-blue p-3 font-bold text-center">Lending Pools</Typography>
        <Underworld />
        <>{lendingList}</>
      <Typography className="text-2xl bg-dark-1000 mb-3 mt-6 border border-pink p-3 font-bold text-center">Retired Pools</Typography>
        <Inactive />
        <>{inactiveList}</>
    </>
  )
}

export default FarmList