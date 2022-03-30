import React from 'react'
import LuxorKey from './LuxorKey'
import ModalKey from './ModalKey'
import LuxorRowRender from './LuxorRowRender'
import ModalRowRender from './ModalRowRender'
import { AllBonds } from './Bonds'

export const LuxList = () => {
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

export const ModalList = () => {
  const luxorList = AllBonds.map((bond) => (
    <ModalRowRender
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
      <ModalKey />
      <>{luxorList}</>
    </>
  )
}
