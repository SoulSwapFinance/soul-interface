import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

// import FarmHeader from '../../features/farm/Header'
import { Active } from './Key'
import { ActiveRow } from './Row'
import { ActivePools } from './Pools'
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

  return (
    <>
      {/* <FarmHeader/> */}
      <Active />
      <>{farmList}</>
    </>
  )
}

export default FarmList