// import { useEffect, useState } from 'react'
// import { ethers } from 'ethers'

import { BondKey } from './Key'
import BondRowRender from './Row'
import { AllPids } from './Pids'
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
