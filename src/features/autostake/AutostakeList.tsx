import { useEffect, useState } from 'react'
// import { ethers } from 'ethers'

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
      lpSymbol={pool.lpSymbol}
      lpToken={pool.lpAddresses[chainId]}
      token1={pool.token1}
      token2={pool.token2}
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
