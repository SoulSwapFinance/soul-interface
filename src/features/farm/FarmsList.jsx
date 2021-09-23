import FarmRowRender from './FarmRowRender'
import { FarmPids } from './FarmPids'

import { Wrap } from '../../components/ReusableStyles' // Heading, Text 
import useActiveWeb3React from '../../hooks/useActiveWeb3React'


const FarmList = () => {
  const { chainId, account } = useActiveWeb3React()

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
      lpToken={farm.lpAddresses[250]} // TODO: update to 250
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
        {/* <Text fontSize=".9rem" padding="0" color="#aaa" textAlign="center">
          Stake lp tokens to earn SOUL
        </Text> */}
        {/* <Text fontSize=".8rem" padding="1rem 0 0 0" color="#c052ff" textAlign="center">
          Unstaking before the fee is removed leads to paying a portion of the withdrawn amount to the
          DAO.
        </Text> */}
        {/* <Text fontSize=".85rem" padding="0" color="#c052ff" textAlign="center">
          Withdrawal Fee: 14%
          <br />
          Daily Fee Reduction: 1%.
        </Text> */}
      </Wrap>
      <div>{farmList}</div>
    </>
  )
}

export default FarmList
