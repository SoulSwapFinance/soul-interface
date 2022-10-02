import React, { useEffect, useState } from 'react'
import { ChainId } from 'sdk'
import StakeKey from './Key'
import AutostakeRowRender from './Row'
import { AvalanchePools, FantomPools } from './Pids'
import { useActiveWeb3React } from 'services/web3'

const AutostakeList = () => {
  const { chainId } = useActiveWeb3React() // account

  const ftmList = FantomPools.map((pool) => (
    <AutostakeRowRender
      key={pool.pid}
      pid={pool.pid}
      stakeToken={pool.lpAddress}
      pool={pool}
    />
  ))
  
  const avaxList = AvalanchePools.map((pool) => (
    <AutostakeRowRender
      key={pool.pid}
      pid={pool.pid}
      stakeToken={pool.lpAddress}
      pool={pool}
    />
  ))
  
  return (
    <>
      {/* <BondHeader/> */}
      <StakeKey />
      <>{chainId == ChainId.AVALANCHE ? avaxList : ftmList}</>
    </>
  )
}

export default AutostakeList
