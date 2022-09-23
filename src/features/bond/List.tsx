// import { useEffect, useState } from 'react'
// import { ethers } from 'ethers'

import { BondKey } from './Key'
import BondRowRender from './Row'
import { AvalanchePids, FantomPids } from './Pids'
import { useActiveWeb3React } from 'services/web3'

const BondList = () => {
  const { chainId } = useActiveWeb3React() // account

  const ftmList = FantomPids.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token1={bond.token1}
      token2={bond.token2}
      bond={bond}
    />
  ))
  
  const avaxList = AvalanchePids.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token1={bond.token1}
      token2={bond.token2}
      bond={bond}
    />
  ))

  return (
    <>
      {/* <BondHeader/> */}
      <BondKey />
      <>{ chainId == 43114 ? avaxList : ftmList }</>
    </>
  )
}

export default BondList
