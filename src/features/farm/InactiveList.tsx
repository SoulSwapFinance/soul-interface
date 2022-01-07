import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSoulSummoner from './hooks/useSoulSummoner'

import FarmHeader from './Header'
import FarmKey from './FarmKey'
import FarmRowRender from './FarmRowRender'
import { InactivePids } from './Pids'

const tokenMatch = (search: string) => (pairInfo: any) => 
  pairInfo.token1.toLowerCase().includes(search) || pairInfo.token2.toLowerCase().includes(search);

const InactiveList = () => {
  const { chainId } = useActiveWeb3React()

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

  const [filteredPIDs, setFilteredPIDs ] = useState(InactivePids);
  const search = useCallback((val: string) => {
    setFilteredPIDs(InactivePids.filter(tokenMatch(val)))
  }, [InactivePids]);
  
  const farmList = filteredPIDs.map((farm) => (
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
      <FarmHeader search={search} />
      <FarmKey />
      <>{farmList}</>
      <br />
    </>
  )
}

export default InactiveList
