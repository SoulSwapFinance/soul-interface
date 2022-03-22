import React, { useEffect, useState } from 'react'
import LuxorKey from './LuxorKey'
import LuxorRowRender from './LuxorRowRender'
import { AllBonds } from './Bonds'
import { useActiveWeb3React } from 'services/web3'

const LuxList = () => {
  const { chainId } = useActiveWeb3React() // account
  
  const luxorList = AllBonds.map((bond) => (
    <LuxorRowRender
      key={bond.pid}
      pid={bond.pid}
      assetAddress={bond.assetAddress}
      assetName={bond.assetName}
      stakeToken={bond.assetAddress}
      bondAddress={bond.bondAddress}
      term={bond.term}
      bond={bond}
    />
  ))

  return (
    <>
      <LuxorKey />
      <>{luxorList}</>
    </>
  )
}

export default LuxList
