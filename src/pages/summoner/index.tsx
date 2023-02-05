import React, { useState } from 'react'
// import { Wrap } from 'components/ReusableStyles'
// import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
// import Container from 'components/Container'
import Head from 'next/head'
import FarmList from 'features/summoner/List'
import { POOLS } from 'constants/farms'
import { useTVL } from 'hooks/useV2Pairs'
import { usePositions } from 'features/summoner/hooks'
import { useSummonerContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { classNames, formatNumberScale } from 'functions'
import { Button } from 'components/Button'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { getChainColor, getChainColorCode } from 'constants/chains'
import { useTokenInfo } from 'hooks/useAPI'
import Image from 'next/image'
import FARM_BANNER from 'assets/branding/farm-banner.png'
import NavLink from 'components/NavLink'
import TokenStats from 'components/TokenStats'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'

// import ExternalLink from 'components/ExternalLink'
// import { SubmitButton } from 'features/bond/Styles'

// import { TwitterBanner } from 'components/Banner'
// import { useRouter } from 'next/router'
// import { TridentHeader } from 'layouts/Trident'
// import { addTransaction } from 'state/transactions/actions'
// import { i18n } from '@lingui/core'

const Summoner = () => {
  const { chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [showBalances, openShowBalances] = useState(true)
  const { tokenInfo } = useTokenInfo(SOUL_ADDRESS[chainId])
  const soulPrice = Number(tokenInfo.price)
  const SummonerContract = useSummonerContract()
  const positions = usePositions()
  const tvl = useTVL()

  let summTvl = tvl.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.tvl
  }, 0)

  const pendingValue = positions.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.pendingSoul / 1e18) * soulPrice
  }, 0)

  const farmingPools = Object?.keys(POOLS[chainId == ChainId.AVALANCHE ? ChainId.AVALANCHE : ChainId.FANTOM]).map((key) => {
    return { ...POOLS[chainId == ChainId.AVALANCHE ? ChainId.AVALANCHE : ChainId.FANTOM][key], lpToken: key }
  })

  // const pendingRewards = (pendingValue / soulPrice).toFixed(0)

  const allStaked = positions.reduce((previousValue, currentValue) => {
    const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
    const poolTvl = tvl.find((r) => getAddress(r.lpToken) == pool?.lpToken)
    // console.log('lpToken:%s', poolTvl?.lpPrice)
    return !poolTvl ? previousValue + 0 : previousValue + ((currentValue.amount / 1e18) * poolTvl?.lpPrice)
  }, 0)

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
    <div className={`grid grid-cols-1 justify-center p-1 mt-8 sm:m-8 sm:max-w-[90%] md:max-w-2xl bg-dark-900 rounded rounded-2xl`}>
            <div
              className={`w-full grid grid-cols-2 p-4 rounded rounded-2xl border border-2 border-purple`}
            >
              <div className={`w-full`}>
              <TokenStats />
              </div>
              <Image src={FARM_BANNER}
                height={180}
                width={1080}
                alt={'farm banner'}
              />
            </div>
          <div className={`flex justify-center m-1 p-1`}>
          <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
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
        {showBalances &&
          <div className={`flex flex-row 
      text-white
      justify-end`}>
            <XCircleIcon
              height="24px"
              id="toggle-button"
              onClick={() => openShowBalances(false)}
            />
          </div>
        }
        {showBalances &&
          // <TridentHeader className="sm:!flex-row justify-center items-center" pattern="bg-bubble">
          // <div>
          <div className="flex justify-center gap-2 mb-4">
            <Button
              color={getChainColorCode(chainId)}
              className="text-emphasis"
              variant="outlined"
              size={"sm"}
            >
              {formatNumberScale(allStaked, true)} {' STAKED'}
            </Button>
            {positions.length > 0 && (
              <Button
                color={getChainColorCode(chainId)}
                className="text-emphasis"
                variant="outlined"
                size={"sm"}
                disabled={pendingTx}
                onClick={async () => {
                  setPendingTx(true)
                  try {
                    await handleHarvestAll()
                  } catch (error) {
                    console.error(error)
                  }
                  setPendingTx(false)
                }}
              >
                {`CLAIM ALL ${pendingValue > 0 ? formatNumberScale(pendingValue, true) : ''}`}
              </Button>
            )}
            <Button
              color={getChainColorCode(chainId)}
              className="text-emphasis"
              variant={'outlined'}
              size={"sm"}
            >
              {formatNumberScale(summTvl, true)} {' '} TOTAL
            </Button>
          </div>
          /* // </TridentHeader> */
        }
          <Head>
            <title>Farm | Soul</title>
            <meta key="description" name="description" content="Farm" />
          </Head>
          <FarmList />
        </div>
  )
}

export default Summoner

Summoner.Guard = NetworkGuard(Feature.LIQUIDITY_MINING)