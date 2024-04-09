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
import { featureEnabled, formatNumberScale } from 'functions'
import { Button } from 'components/Button'
import { ArrowDownIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { getChainColorCode } from 'constants/chains'
import { useTokenInfo } from 'hooks/useAPI'
// import Image from 'next/image'
// import FARM_BANNER from 'assets/branding/farm-banner.png'
import NavLink from 'components/NavLink'
// import TokenStats from 'components/TokenStats'
import NetworkGuard from 'guards/Network'
import { Feature } from 'enums/Feature'
// import { CustomBanner } from 'components/Banner'
// import DoubleDownIcon from 'components/Icons/mobile/DoubleDownIcon'
// import DoubleUpIcon from 'components/Icons/mobile/DoubleUpIcon'
// import UpDownArrowIcon from 'components/Icons/exchange/UpDownArrowIcon'
// import CrossIcon from 'components/Icons/exchange/CrossIcon'
// import CloseIcon from 'components/CloseIcon'
import Image from 'next/image'
import VerticalMaximize from 'assets/icons/vertical-resize.png'
import Minimize from 'assets/icons/vertical-minimize.png'
// import ExternalLink from 'components/ExternalLink'
// import { SubmitButton } from 'features/bond/Styles'

// import { TwitterBanner } from 'components/Banner'
// import { useRouter } from 'next/router'
// import { TridentHeader } from 'layouts/Trident'
// import { addTransaction } from 'state/transactions/actions'

const Summoner = () => {
  const { account, chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [showBalances, openShowBalances] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)
  const { tokenInfo } = useTokenInfo(SOUL_ADDRESS[chainId ?? ChainId.FANTOM])
  const soulPrice = Number(tokenInfo.price)
  const SummonerContract = useSummonerContract()
  const positions = usePositions()
  const tvl = useTVL()

  // let summTvl = tvl.reduce((previousValue, currentValue) => {
  //   return previousValue + currentValue.tvl
  // }, 0)

  const toggleShowTutorial = () => {
    showTutorial? setShowTutorial(false) : setShowTutorial(true)
  }

  const pendingValue = positions.reduce((previousValue, currentValue) => {
    // console.log('previousValue: %s', currentValue.pendingSoul / 1e18)
    return previousValue + (currentValue.pendingSoul / 1e18) * soulPrice

  }, 0)

  const farmingPools = Object?.keys(POOLS[chainId == ChainId.AVALANCHE ? ChainId.AVALANCHE : ChainId.FANTOM]).map((key) => {
    return { ...POOLS[chainId == ChainId.AVALANCHE ? ChainId.AVALANCHE : ChainId.FANTOM][key], lpToken: key }
  })

  // const pendingRewards = (pendingValue / soulPrice).toFixed(0)

  const allStaked = positions.reduce((previousValue, currentValue) => {
    const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
    // console.log('pool: %s', pool?.lpToken)
    const poolTvl = tvl.find((r) => getAddress(r.lpToken) == pool?.lpToken)
    // console.log('lpToken[%s]: %s', pool.id, poolTvl?.lpPrice)
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
    <div className={`grid grid-cols-1 w-full max-w-2xl justify-center p-1 mt-8 sm:m-8 bg-dark-900 rounded-2xl`}>
      <Head>
        <title>Farm | SoulSwap</title>
        <meta name="description" content="Deposit liquidity pool (LP) tokens to earn SOUL rewards over time as an incentive to help enable trades on our decentralized SoulSwap exchange." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta name="twitter:site" content="@SoulSwapFinance" />
        <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta id="og:image:type" property="og:image:type" content="image/png" />
        <meta id="og:image:type" property="og:image:type" content="630" />
        <meta id="og:image:width" property="og:image:width" content="1200" />
        <meta id="og:description" property="og:description" content="Deposit liquidity pool (LP) tokens to earn SOUL rewards over time as an incentive to help enable trades on our decentralized SoulSwap exchange." />
      </Head>

      {/* <CustomBanner
        chains={[ChainId.FANTOM, ChainId.AVALANCHE]}
        external
        link={'https://www.loom.com/embed/b23f225c5de54c86a6e446e3db8426a0?sid=f307db77-4539-4361-9c91-dca7c6220674'}
        text={'Watch Our Tutorial ↗'}
        textColor={'white'}
        color={'ftmBlue'}
        className={`animate-pulse border-4 border-dark-800 rounded-2xl`}
      /> */}
      <div
        style={{
          display: 'flex',
          // border: '1px solid #821fff',
          borderRadius: '10px',
          paddingBottom: 32,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          cursor: 'pointer',
          justifyContent: 'center',
          // marginBottom:
          // cursor: 'pointer',
          width: '100%',
          height: showTutorial ? '100%' : '10%',
        }}
      >
        <div
            onClick={toggleShowTutorial}
          style={{
            flexDirection: 'row',
            justifyContent:'space-between',
            width: '100%',

          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent:'space-between',
              alignItems: 'center',
              border: showTutorial ? '1px solid grey' : '2px solid #821fff',
              borderRadius: '10px',
              padding: 12,
              fontWeight: 'bold',
              marginBottom: showTutorial ? 12 : 0,
            }}
          >
            { showTutorial ? `Hide Tutorial` : `Show Tutorial` }
          { showTutorial ?
          <Image
          src={Minimize}
          height={32}
          width={32}
          alt="compress icon"
          />
            :
          <Image
          src={VerticalMaximize}
          height={32}
          width={32}
          alt="expand icon"
          />
              // <DoubleDownIcon
              //   className="w-6 h-6 ml-2"
              //   fillPrimary={'#821fff'}   // purple
              //   fillSecondary={'#821fff'} // purple
              // />
          }
            {/* <div>
            </div> */}
          </div>
          <div
            className={!showTutorial ? 'hidden' : 'block'}
          >
            <div style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: "0",
            }}>
              <iframe src="https://www.loom.com/embed/b23f225c5de54c86a6e446e3db8426a0?sid=f307db77-4539-4361-9c91-dca7c6220674"
                // frameBorder={0}
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`flex justify-center m-1 p-1`}>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
            </div>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Vault</span>
            </div>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/bonds'}>
            <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Bonds</span>
            </div>
          </NavLink>
        </Button>
        {featureEnabled(Feature.DEFARM, chainId) &&
          <Button variant="filled" color="purple" size="lg">
            <NavLink href={'/defarms'}>
              <div className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                <span>DeFarms</span>
              </div>
            </NavLink>
          </Button>
        }
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
      {showBalances && account && pendingValue > 0 &&
        // <TridentHeader className="sm:!flex-row justify-center items-center" pattern="bg-bubble">
        // <div>
        <div className="flex justify-center gap-2 mb-4">
          <Button
            color={getChainColorCode(chainId)}
            className={account ? `text-emphasis text-white` : `hidden`}
            variant="outlined"
            size={"sm"}
          >
            {formatNumberScale(allStaked, true)} {' STAKED'}
          </Button>
          {positions.length > 0 && (
            <Button
              color={getChainColorCode(chainId)}
              className="text-emphasis text-white"
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
          {/* <Button
              color={getChainColorCode(chainId)}
              className="text-emphasis text-white"
              variant={'outlined'}
              size={"sm"}
            >
              {formatNumberScale(summTvl, true)} {' '} TOTAL
            </Button> */}
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