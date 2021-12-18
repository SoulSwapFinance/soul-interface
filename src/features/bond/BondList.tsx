import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
// import useSoulSummoner from '../bond/hooks/useSoulSummoner'

// import BondHeader from '../bond/Header'
import BondKey from '../bond/BondKey'
import BondRowRender from '../bond/BondRowRender'
import { AllPids, WithdrawPids } from '../bond/Pids'
// import { Wrap, Heading, Text, Button } from './ReusableStyles' // Heading, Text

const BondList = () => {
  const { chainId } = useActiveWeb3React() // account

  const withdrawList = WithdrawPids.map((bond) => (
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
