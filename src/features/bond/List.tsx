import React from 'react'
import Typography from 'components/Typography'
import { BondKey } from './Key'
import BondRowRender from './Row'
import { AvalanchePools, FantomPools } from './Pids'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
// import { useSummonerContract } from 'hooks/useContract'
// import ExternalLink from 'components/ExternalLink'
// import { classNames } from 'functions'
import { getChainColor, getChainColorCode } from 'constants/chains'
// import { getChainColorCode } from 'constants/chains'
// import { classNames } from 'functions'
import Image from 'next/image'
import MINT_BANNER from 'assets/branding/mint-banner.png'
import ExternalLink from 'components/ExternalLink'
import { SubmitButton } from 'features/bond/Styles'
import { classNames } from 'functions/styling'

export const BondList = () => {
  const { chainId } = useActiveWeb3React()
  // const SummonerContract = useSummonerContract()
  const ftmList = FantomPools.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      type={bond.type}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token0Symbol={bond.token0Symbol}
      token1Symbol={bond.token1Symbol}
      token0Address={bond.token0Address}
      token1Address={bond.token1Address}
      bond={bond}
    />
  ))

  const avaxList = AvalanchePools.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      type={bond.type}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token0Symbol={bond.token0Symbol}
      token1Symbol={bond.token1Symbol}
      token0Address={bond.token0Address}
      token1Address={bond.token1Address}
      bond={bond}
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
              href="https://soulswapfinance.medium.com/owning-our-liquidity-via-our-innovative-soul-bonds-podl-592c2849ceed"
              target="_blank"
              rel="noreferrer"
            >
              <SubmitButton
                primaryColor={"#7G1BD9"}
                size="xl"
              >
                <a 
                  className="block text-md font-bold md:text-xl text-white font-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300"
                >
                  <span> Read Before Bonding ↗</span>
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
            <Image src={MINT_BANNER}
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
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Summon</span>
            </a>
          </NavLink>
        </Button>
      </div>
      <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-purple font-bold text-center">SoulSwap Pools</Typography>
      <BondKey />
          <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</>
      <div>
      {/* <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-ftmBlue font-bold text-center">Lending Pools</Typography> */}
        {/* chainId == ChainId.FANTOM ? <Inactive /> : null */}
        {/* chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList */}
      </div>
    </div>
    
  )
}

export default BondList