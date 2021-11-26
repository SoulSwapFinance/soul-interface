import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useSoulSummoner from './hooks/useSoulSummoner'

import FarmHeader from './Header'
import FarmKey from './FarmKey'
import FarmRowRender from './FarmRowRender'
import { CorePids, WithdrawPids } from './Pids'
// import { Wrap, Heading, Text, Button } from './ReusableStyles' // Heading, Text

const StablesList = () => {
  const { chainId, account } = useActiveWeb3React()

  const [totalPending, setTotalReward] = useState(0)

  const { totalPendingRewards } = useSoulSummoner(
    0,
    '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
    '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57',
    '0xa2527Af9DABf3E3B4979d7E0493b5e2C6e63dC57'
  )

  useEffect(() => {
    fetchTotalPending()
  })

  const fetchTotalPending = async () => {
    try {
      const result = await totalPendingRewards()
      const format = Number(result / 10 ** 18).toFixed(2)
      setTotalReward(result)
    } catch (e) {
      console.log(e)
      return e
    }
  }

  // const handleHarvest = async () => {
  //   try {
  //     await harvestAllFarms()
  //   } catch (e) {
  //     console.log(e)
  //     return e
  //   }
  // }

  const farmList = CorePids.map((farm) => (
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
      <FarmHeader/>
      <FarmKey />
      <>{farmList}</>
    </>
  )
}

export default StablesList
