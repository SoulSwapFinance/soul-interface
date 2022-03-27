import React, { useEffect, useState } from 'react'

import LendKey from './LendKey'
import AutostakeRowRender from './LendRowRender'
import { LendMarkets } from './Markets'
import { useActiveWeb3React } from 'services/web3'

const LendList = () => {
  const { chainId } = useActiveWeb3React() // account

  const lendList = LendMarkets.map((market) => (
    <AutostakeRowRender
      key={market.mid}
      market={market.mid}
      supplyAddress={market.supplyAddress}
      marketAddresses={market.marketAddresses[chainId]} 
      mid={market.mid}    
    />
  ))

  return (
    <>
      <LendKey />
      <>{lendList}</>
    </>
  )
}

export default LendList
