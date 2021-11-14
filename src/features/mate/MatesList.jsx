import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useSoulSummoner from './hooks/useSoulSummoner'

import MateKey from './MateKey'
import MateRowRender from './MateRowRender'
import { MatePids } from './MatePids'
// import { Wrap, Heading, Text, Button } from './ReusableStyles' // Heading, Text

const MateList = () => {
  const { chainId, account } = useActiveWeb3React()

  const [totalPending, setTotalReward] = useState(0)

  const { totalPendingRewards, harvestAllMates } = useSoulSummoner(
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
      setTotalReward(format)
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const handleHarvest = async () => {
    try {
      await harvestAllMates()
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const mateList = MatePids.map((mate) => (
    <MateRowRender
      key={mate.pid}
      pid={mate.pid}
      lpSymbol={mate.lpSymbol}
      lpToken={mate.lpAddresses[250]}
      token1={mate.token1}
      token2={mate.token2}
      mate={mate}
    />
  ))

  return (
    <>
      <MateKey />
      <>{mateList}</>
    </>
  )
}

export default MateList
