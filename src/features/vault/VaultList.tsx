import Dots from '../../components/Dots'
import React from 'react'
import VaultListItem from './VaultListItem'

const VaultList = ({ farms }) => {
  return farms ? (
    <>
      <div className="grid grid-cols-5 text-base font-bold text-primary">
        <div className="flex items-center col-span-2 px-4 lg:col-span-1">{`Stake`}</div>
        <div className="flex items-center px-2">{`Lockup`}</div>
        <div className="flex items-center px-2">{`TVL`}</div>
        <div className="items-center justify-start hidden px-2 lg:flex">{`Allocation`}</div>
        <div className="flex items-center justify-end flex px-4">{`APR`}</div>
      </div>
      <div className="flex-col mt-2">
        {farms
          .sort((a, b) => b.allocPoint - a.allocPoint)
          .map((farm, index) => (
            <VaultListItem key={index} farm={farm} />
          ))}
      </div>
    </>
  ) : (
    <div className="w-full py-6 text-center">
      <Dots>{`Loading`}</Dots>
    </div>
  )
}

export default VaultList
