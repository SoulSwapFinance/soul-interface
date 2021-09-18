import FarmRowRender from './FarmRowRender'
import { FarmPids } from './FarmPids'

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
      {/* <Wrap padding="0 0 2rem 0">
        <Heading fontSize="1.5rem" textAlign="center">
          Farms
        </Heading>
        <Text fontSize=".9rem" padding="0" color="#aaa" textAlign="center">
          Stake lp tokens to earn SOUL
        </Text>
      </Wrap> */}
      <div>{farmList}</div>
    </>
  )
}

export default FarmList
