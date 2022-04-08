import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

// import FarmHeader from '../../features/farm/Header'
import { Active, Inactive } from './Key'
import { ActiveRow, InactiveRow } from './Row'
import { ActivePools, InactivePools } from './Pools'
import { Button } from 'components/Button'

export const FarmList = () => {
  const { chainId } = useActiveWeb3React() // account

  const farmList = ActivePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      lpToken={farm.lpAddresses[chainId]}
      farm={farm}
    />
  ))

  const inactiveList = InactivePools.map((farm) => (
    <InactiveRow
      key={farm.pid}
      pid={farm.pid}
      lpToken={farm.lpAddresses[chainId]}
      farm={farm}
    />
  ))

  return (
    <>
      {/* <FarmHeader/> */}
      <Active />
      <>{farmList}</>
      <br />
      <Button varient="filled" color="blue" className="mb-5">
      <Typography className="text-center text-3xl text-black mb-2 mt-1">
        Retired Farms
      </Typography>
      </Button>
      <Inactive />
      <>{inactiveList}</>
    </>
  )
}

export default FarmList