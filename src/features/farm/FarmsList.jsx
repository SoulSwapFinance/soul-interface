import FarmRowRender from './FarmRowRender'
import { FarmPids } from './FarmPids'

import { Wrap, Heading, Text } from '../../components/ReusableStyles'

const FarmList = () => {
  // Display token pair - TODO:
  // 1) fetch total farms
  // 2) get lpTokenAddress from calling `poolInfo?.[0]`
  // 3) input into factory to get token1-token2
  // 4) typed out -> [`${token1}`-`${`token2`}`]

  const farmList = FarmPids.map((farm) => (
    <FarmRowRender
      key={farm.pid}
      pid={farm.pid}
      lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[4002]} // TODO: update to 250
      token1={farm.token1}
      token2={farm.token2}
      farm={farm}
    />
  ))

  return (
    <>
      <Wrap padding="0 0 2rem 0">
        <Heading fontSize="1.5rem" textAlign="center">
          Farms
        </Heading>
        <Text fontSize=".9rem" padding="0" color="#aaa" textAlign="center">
          Stake lp tokens to earn SOUL
        </Text>
        <Text fontSize=".8rem" padding="1rem 0 0 0" color="#d1571e" textAlign="center">
          Unstaking from a pool before the fee timer is up results in paying a portion of the withdrawn amount to the
          DAO.
        </Text>
        <Text fontSize=".85rem" padding="0" color="#d1571e" textAlign="center">
          When you stake, the withdrawal fee timer sets to 15%. Each day that goes by, 1% is deducted.
        </Text>
      </Wrap>
      <div>{farmList}</div>
    </>
  )
}

export default FarmList
