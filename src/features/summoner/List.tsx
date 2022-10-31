import React from 'react'
import Typography from 'components/Typography'
import { Active, Inactive, Underworld } from './Key'
import { ActiveRow } from './Row'
import { AvalanchePools, FantomPools, AvalancheLendingPools, FantomLendingPools, InactiveFantomPools, InactiveAvalanchePools } from './Pools'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
import { useSummonerContract } from 'hooks/useContract'
import ExternalLink from 'components/ExternalLink'
import { classNames } from 'functions'
// import { getChainColorCode } from 'constants/chains'
// import { classNames } from 'functions'

export const FarmList = () => {
  const { chainId } = useActiveWeb3React()
  const SummonerContract = useSummonerContract()
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

  const ftmLendList = FantomLendingPools.map((farm) => (
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

  const avaxLendList = AvalancheLendingPools.map((farm) => (
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
      <div className="flex ml-2 mt-2 mr-2 mb-4 gap-1 items-center justify-center">
        <NavLink href={'/soul/dashboard'}>
          <Button variant="filled"
            color={"purple"}
            size="lg">
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Data </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/bonds'}>
          <Button variant="filled"
            color={"purple"}
            size="lg">
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Bond </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/lend'}>
          <Button variant="filled"
            color={"purple"}
            size="lg"
          >
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Lend </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/borrow'}>
          <Button variant="filled"
            color={"purple"}
            size="lg"
          >
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Borrow </span>
            </a>
          </Button>
        </NavLink>
        <NavLink href={'/autostake'}>
          <Button variant="filled"
            color={"purple"}
            size="lg"
          >
            <a className="block text-md md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span> Vault </span>
            </a>
          </Button>
        </NavLink>
      </div>
      <Typography className="text-2xl bg-dark-1000 mt-6 border border-dark-600 p-3 font-bold text-center">SoulSwap Pools</Typography>
      <Active />
      <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</>
      <div>
        <Typography className="text-2xl bg-dark-1000 mt-6 border border-blue p-3 font-bold text-center">Lending Pools</Typography>
        <Underworld />
        {chainId == ChainId.FANTOM ? ftmLendList : avaxLendList}
        <Typography
          className={classNames(chainId == ChainId.AVALANCHE ? 'hidden' : `text-2xl bg-dark-1000 mt-6 border border-pink p-3 font-bold text-center`)}
        >
          Retired Pools
        </Typography>
        {chainId == ChainId.FANTOM ? <Inactive /> : null}
        {chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList}
      </div>
    </div>
  )
}

export default FarmList