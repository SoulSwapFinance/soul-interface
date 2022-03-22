import React, { useEffect, useState } from 'react'

import StakeKey from './StakeKey'
import AutostakeRowRender from './AutostakeRowRender'
import { AllPids } from './Pids'
import { useActiveWeb3React } from 'services/web3'

const AutostakeList = () => {
  const { chainId } = useActiveWeb3React() // account

  const stakeList = AllPids.map((pool) => (
    <AutostakeRowRender
      key={pool.pid}
      pid={pool.pid}
      stakeToken={pool.lpAddresses[chainId]}
      pool={pool}
    />
  ))

  return (
    <>
      {/* <BondHeader/> */}
      <StakeKey />
      <>{stakeList}</>
    </>
  )
}

export default AutostakeList
