import React, { useEffect, useState } from 'react'

import LendKey from './LendKey'
import AutostakeRowRender from './LendRowRender'
import { AllPids } from './Pids'
import { useActiveWeb3React } from 'services/web3'

const LendList = () => {
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
      <LendKey />
      <>{stakeList}</>
    </>
  )
}

export default LendList
