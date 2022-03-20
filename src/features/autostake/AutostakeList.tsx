import { useEffect, useState } from 'react'
// import { ethers } from 'ethers'

import StakeKey from './StakeKey'
import AutostakeRowRender from './AutostakeRowRender'
import { AllPids } from './Pids'
import { useActiveWeb3React } from 'services/web3'

const BondList = () => {
  const { chainId } = useActiveWeb3React() // account

  const stakeList = AllPids.map((bond) => (
    <AutostakeRowRender
      key={bond.pid}
      pid={bond.pid}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddresses[chainId]}
      token1={bond.token1}
      token2={bond.token2}
      bond={bond}
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

export default BondList
