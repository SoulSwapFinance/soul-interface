import { useEffect, useState } from 'react'
// import { ethers } from 'ethers'

import BondKey from '../bond/BondKey'
import BondRowRender from '../bond/BondRowRender'
import { AllPids } from '../bond/Pids'
import { useActiveWeb3React } from 'services/web3'

const BondList = () => {
  const { chainId } = useActiveWeb3React() // account

  const bondList = AllPids.map((bond) => (
    <BondRowRender
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
      <BondKey />
      <>{bondList}</>
    </>
  )
}

export default BondList
