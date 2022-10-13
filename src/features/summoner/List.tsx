import React from 'react'
import Typography from 'components/Typography'
import { Active, Underworld } from './Key' // Inactive
import { ActiveRow } from './Row'
import { AvalanchePools, FantomPools, AvalancheLendingPools, FantomLendingPools, InactiveFantomPools, InactiveAvalanchePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
import { useSummonerContract } from 'hooks/useContract'
import ExternalLink from 'components/ExternalLink'
// import { getChainColorCode } from 'constants/chains'
// import { classNames } from 'functions'

export const FarmList = () => {
  const { chainId } = useActiveWeb3React()
  const SummonerContract = useSummonerContract()
  const ftmList = FantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
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
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  const ftmLendList = FantomLendingPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  const avaxLendList = AvalancheLendingPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
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
      lpToken={farm.lpAddress}
      token0Symbol={farm.token0Symbol}
      token1Symbol={farm.token1Symbol}
      token0Address={farm.token0Address}
      token1Address={farm.token1Address}
      farm={farm}
    />
  ))

  // harvests: all staked pools (for user)
  const handleHarvestAll = async () => {
    try {
      let tx
      tx = SummonerContract?.harvestAll()
      await tx?.wait()
    } catch (e) {
      console.log(e)
      return
    }
  }

  return (
    <div>
      {/* <Button
        height="2rem"
        variant="bordered" 
        color={"purple"} 
        size="lg"
        onClick={async () => await handleHarvestAll()}>
        <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
          <span> Harvest All </span>
        </a>
      </Button> */}

      <div className="flex ml-2 mt-2 mr-2 mb-4 gap-1 items-center justify-center">
        <Button variant="filled" 
        color={"purple"} 
        size="lg">
          <NavLink href={'/soul/dashboard'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Data </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" 
          color={"purple"} 
        size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Bond </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled"
          color={"purple"}  
        size="lg"
        >
          <NavLink href={'/underworld'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Lend </span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" 
        color={"purple"} 
        // color={getChainColorCode(chainId)} 
        size="lg"
        >
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Vault </span>
            </a>
          </NavLink>
        </Button>
      </div>
      <Typography className="text-2xl bg-dark-1000 mb-3 mt-6 border border-dark-600 p-3 font-bold text-center">SoulSwap Pools</Typography>
      <Active />
      <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</>
        <div>
          <Typography className="text-2xl bg-dark-1000 mb-3 mt-6 border border-blue p-3 font-bold text-center">Lending Pools</Typography>
      <Underworld />
          {chainId == ChainId.FANTOM ? ftmLendList : avaxLendList}
          {/* <Typography 
            className={classNames(chainId == ChainId.AVALANCHE ? 'hidden' : `text-2xl bg-dark-1000 mb-3 mt-6 border border-pink p-3 font-bold text-center`)}
          >
              Retired Pools
            </Typography>
            <Inactive/>
            {chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList} */}
        </div>
    </div>
  )
}

export default FarmList