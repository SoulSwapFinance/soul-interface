import React from 'react'
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
      stakeToken={bond.lpAddress}
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
