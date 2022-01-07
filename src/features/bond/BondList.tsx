import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BondKey from './BondKey'
import BondRowRender from './BondRowRender'
import { AllPids } from './Pids' // WithdrawPids

const BondList = () => {
  const { chainId } = useActiveWeb3React() // account

  // const withdrawList = WithdrawPids.map((bond) => (
  //   <BondRowRender
  //     key={bond.pid}
  //     pid={bond.pid}
  //     lpSymbol={bond.lpSymbol}
  //     lpToken={bond.lpAddresses[chainId]}
  //     token1={bond.token1}
  //     token2={bond.token2}
  //     bond={bond}
  //   />
  // ))

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
      {/* <br /> */}
      {/* <BondKey withdraw={true}/>
      <>{withdrawList}</> */}
    </>
  )
}

export default BondList
