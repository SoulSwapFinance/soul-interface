import React, { useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

// import FarmHeader from '../../features/farm/Header'
import FarmKey from './FarmKey'
import FarmRowRender from './FarmRowRender'
import { AllPids } from './Pools'

const FarmList = () => {
  const { chainId } = useActiveWeb3React() // account

  const farmList = AllPids.map((farm) => (
    <FarmRowRender
      key={farm.pid}
      pid={farm.pid}
      lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[chainId]}
      token1={farm.token1}
      token2={farm.token2}
      farm={farm}
    />
  ))

  return (
    <>
      {/* <FarmHeader/> */}
      <FarmKey />
      <>{farmList}</>
      <br />
      {/* <FarmKey withdraw={true}/>
      <>{inactiveList}</> */}
    </>
  )
}

export default FarmList