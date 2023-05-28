import React from 'react'
import Typography from 'components/Typography'
import { Active } from './Key'
import { ActiveRow } from './Row'
import { AvalanchePools, FantomPools
 , InactiveFantomPools, InactiveAvalanchePools 
} from './Pools'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'

export const FarmList = () => {
  const { chainId } = useActiveWeb3React()
  // const SummonerContract = useSummonerContract()
  const ftmList = FantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      decimals={farm.decimals}
      pairType={farm.type}
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  const avaxList = AvalanchePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      decimals={farm.decimals}
      pairType={farm.type}
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  const inactiveFtmList = InactiveFantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      decimals={farm.decimals}
      pairType={farm.type}
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  const inactiveAvaxList = InactiveAvalanchePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      decimals={farm.decimals}
      pairType={farm.type}
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  return (
    <div>
    <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-purple font-bold text-center">SoulSwap Pools</Typography>
        <Active />
      {chainId == ChainId.AVALANCHE ? avaxList : ftmList}
      {[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) && <Typography className="text-2xl bg-dark-1000 mb-2 rounded-2xl m-1 p-4 border border-avaxRed font-bold text-center">Retired Pools</Typography>}
        {[ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) && <Active />}
      {chainId == ChainId.AVALANCHE ? inactiveAvaxList : inactiveFtmList}
  </div>
)
}

export default FarmList

FarmList.Guard = NetworkGuard(Feature.LIQUIDITY_MINING)