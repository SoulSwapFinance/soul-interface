import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useSoulSummoner from './hooks/useSoulSummoner'

import FarmRowRender from './FarmRowRender'
import { FarmPids } from './FarmPids'
import { Wrap, Heading, Text, Button } from '../../components/ReusableStyles' // Heading, Text

const FarmList = () => {
  const { chainId, account } = useActiveWeb3React()

  const [totalPending, setTotalReward] = useState(0)

  const { totalPendingRewards, harvestAllFarms } = useSoulSummoner(
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
      await harvestAllFarms()
    } catch (e) {
      console.log(e)
      return e
    }
  }

  const farmList = FarmPids.map((farm) => (
    <FarmRowRender
      key={farm.pid}
      pid={farm.pid}
      lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[250]}
      token1={farm.token1}
      token2={farm.token2}
      farm={farm}
    />
  ))

  return (
    <>
      <Wrap padding="0 0 2rem 0">
        {/* <Heading fontSize="1.5rem" textAlign="center">
          Farms
        </Heading> */}
        {/* <Text fontSize="1rem" padding="0" color="#aaa" textAlign="center">
          Each farm withdraw, no matter how small, resets the fee percentage.
        </Text> */}

        {/* <Text fontSize=".9rem" padding="1rem 0 0 0" color="#F36FFE" textAlign="center">
          Total Pending Rewards: { 
          Number(totalPending)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
        </Text> */}
        {/* <Wrap display='flex' justifyContent='center'>
          <Button onClick={() => handleHarvest()}>Harvest Rewards</Button>
        </Wrap> */}
      </Wrap>
      <div>{farmList}</div>
    </>
  )
}

export default FarmList
