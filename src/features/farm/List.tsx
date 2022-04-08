import Typography from 'components/Typography'
import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

// import FarmHeader from '../../features/farm/Header'
import { Active, Inactive } from './Key'
import { ActiveRow } from './Row'
import { AllPids, InactivePids } from './Pools'

const FarmList = () => {
  const { chainId } = useActiveWeb3React() // account

  const farmList = AllPids.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      // lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[chainId]}
      // token1={farm.token1}
      // token2={farm.token2}
      farm={farm}
    />
  ))

  const inactiveList = InactivePids.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      // lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[chainId]}
      // token1={farm.token1}
      // token2={farm.token2}
      farm={farm}
    />
  ))

  return (
    <>
      {/* <FarmHeader/> */}
      <Active />
      <>{farmList}</>
      <br />
      <Typography className="text-center text-3xl text-dark-600 mb-2 mt-1">
        Retired Farms
      </Typography>
      <Inactive />
      <>{inactiveList}</>
    </>
  )
}

export default FarmList