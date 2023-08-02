import React, { useCallback } from 'react'
import Typography from 'components/Typography'
import { Active, Inactive } from './Key'
import { ActiveRow } from './Row'
import { AvalanchePools, FantomPools, InactiveFantomPools, InactiveAvalanchePools } from './Pools'
import { Button } from 'components/Button'
// import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums'
import { useRouter } from 'next/router'
import { classNames } from 'functions'

export const FarmList = () => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()

  // handles: create deFarm
  const handleCreate = useCallback(() => {
    router.push(`/defarms/create`)
  }, [])

  // handles: launch deFarm
  const handleLaunch = useCallback(() => {
    router.push(`/defarms/launch`)
  }, [])

  const ftmList = FantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
    />
  ))

  const avaxList = AvalanchePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
    />
  ))

  const inactiveFtmList = InactiveFantomPools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
    />
  ))

  const inactiveAvaxList = InactiveAvalanchePools.map((farm) => (
    <ActiveRow
      key={farm.pid}
      pid={farm.pid}
    />
  ))

  return (
    <div>
      <div className={`hidden flex ml-2 mt-2 mr-2 mb-4 gap-1 items-center justify-center`}>
        <Button 
            variant={'bordered'}
            color={'purple'}
            className={
                `flex mt-2 font-bold justify-center  border-2 rounded-xl`
              }
            onClick={handleCreate}
          >
            <Typography
              className={`text-white`}
            >
              {`Create Farm`}
            </Typography>
          </Button>
        <Button 
            variant={'bordered'}
            color={'purple'}
            className={
                `flex mt-2 font-bold justify-center border-2 rounded-xl`
              }
            onClick={handleLaunch}
          >
            <Typography
              className={`text-white`}
            >
              {`Launch Campaign`}
            </Typography>
          </Button>
        </div>
      {/* <Typography 
      className="text-2xl bg-dark-1000 mt-6 rounded-2xl border-2 border-dark-600 p-3 font-bold text-center mb-1"
      >Active DeFarms
      </Typography>
      <Active />
      <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</> */}
     {/* <div className={'grid grid-cols-1 mx-1 mt-6 mb-4 gap-2 border bg-avaxRed rounded rounded-lg'}> */}
           {/* <ExternalLink
              href="https://defarms.soulswap.finance/defarms"
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
                  <span> View Retired DeFarms ↗</span>
                </a>
              </SubmitButton>
            </ExternalLink>
            </div> */}
      {/* <div> */}
        <Typography
          className={classNames(chainId == ChainId.AVALANCHE ? 'hidden' : `text-2xl bg-dark-1000 mt-6 rounded-2xl border-2 border-avaxRed p-3 font-bold text-center mb-1`)}
        >
          Retired DeFarms
        </Typography>
        {chainId == ChainId.FANTOM ? <Inactive /> : null}
        {chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList}
       {/* </div>  */}
    </div>
  )
}

export default FarmList

FarmList.Guard = NetworkGuard(Feature.DEFARM)