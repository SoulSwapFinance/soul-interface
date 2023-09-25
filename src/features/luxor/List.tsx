import React from 'react'
import LuxorKey from './Key'
import LuxorRowRender from './Row'
import { FantomBonds } from './Bonds'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'

export const FtmList = () => {
  const { chainId } = useActiveWeb3React()
  const ftmList = FantomBonds.map((bond) => (
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
      <>{chainId == ChainId.FANTOM ? ftmList : null}</>
    </>
  )
}
