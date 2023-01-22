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
// import ExternalLink from 'components/ExternalLink'
import { classNames } from 'functions'
import { getChainColor, getChainColorCode } from 'constants/chains'
// import { getChainColorCode } from 'constants/chains'
// import { classNames } from 'functions'
import Image from 'next/image'
import FARM_BANNER from 'assets/branding/farm-banner.png'
import ExternalLink from 'components/ExternalLink'
import { SubmitButton } from 'features/bond/Styles'

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
  // const handleHarvestAll = async () => {
  //   try {
  //     let tx
  //     tx = SummonerContract?.harvestAll()
  //     await tx?.wait()
  //   } catch (e) {
  //     console.log(e)
  //     return
  //   }
  // }

  return (
    <div className={`grid grid-cols-1 justify-center p-1 sm:m-8 sm:max-w-[90%] md:max-w-[100%] bg-dark-900 rounded rounded-2xl border border-4 border-[${getChainColor(chainId)}]`}>
      <div
            className={
              classNames(chainId == ChainId.FANTOM 
                  ? 'mb-4 rounded rounded-xl bg-purple' 
                  : 'hidden')
              }
          >
            <ExternalLink
              href="https://archived.soulswap.finance/farms"
              target="_blank"
              rel="noreferrer"
            >
              <SubmitButton
                // height="2rem"
                primaryColor={"#7G1BD9"}
                size="xl"
              >
                <a 
                  className="block text-md font-bold md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300"
                >
                  <span> Archived Farms ↗</span>
                </a>
              </SubmitButton>
            </ExternalLink>
          </div>

      
      <div 
            className={`w-full grid grid-cols-2 p-4 border border-2 rounded rounded-2xl bg-dark-900 border-purple`}
            >
            <div className="flex justify-center">
             <div 
              className={`flex border border-2 sm:border-4 border-purple justify-center bg-dark-800 mr-2 ml-2 rounded rounded-2xl w-5/6`}
                >
              <Image src={`/favicon.ico`}
                objectFit={`contain`}
                height={72}
                width={72}
              />
            </div> 
            </div>
            <Image src={FARM_BANNER}
              height={180}
              width={1080}
            />
          </div>
          <div className={`flex justify-center m-1 p-1`}>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>SoulSwap Data </span>
            </a>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Stake</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Mint</span>
            </a>
          </NavLink>
        </Button>
      </div>
      <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-purple font-bold text-center">SoulSwap Pools</Typography>
      <Active />
      <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</>
      <div>
      <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-ftmBlue font-bold text-center">Lending Pools</Typography>
        <Underworld />
        {chainId == ChainId.FANTOM ? ftmLendList : avaxLendList}
        <Typography
          className={
            classNames(
              // chainId == ChainId.AVALANCHE ?
              'hidden'
              // : `text-2xl bg-dark-1000 mt-6 border border-pink p-3 font-bold text-center`
            )}
        >
          Retired Pools
        </Typography>
        {/* chainId == ChainId.FANTOM ? <Inactive /> : null */}
        {/* chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList */}
      </div>
    </div>
  )
}

export default FarmList