import React, { useState } from 'react'
import { Wrap } from 'components/ReusableStyles'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import Head from 'next/head'
import FarmList from 'features/summoner/List'
import { POOLS } from 'constants/farms'
import { useTVL } from 'hooks/useV2Pairs'
import { usePositions } from 'features/summoner/hooks'
import { useSummonerContract } from 'hooks'
import { getAddress } from '@ethersproject/address'
import { formatNumberScale } from 'functions'
import { Button } from 'components/Button'
import { XIcon } from '@heroicons/react/solid'
import { ChainId, SOUL_ADDRESS } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { getChainColorCode } from 'constants/chains'
import { useTokenInfo } from 'hooks/useAPI'
import ExternalLink from 'components/ExternalLink'
import { SubmitButton } from 'features/bond/Styles'

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
  
  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
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
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      {showBalances &&
      <div className={`flex flex-row 
      text-white
      justify-end`}>
        <XIcon
          height="24px"
          id="toggle-button"
          onClick={() => openShowBalances(false)}
        />
      </div>
      }
      { showBalances &&
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
              { positions.length > 0 && (
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
      <DoubleGlowShadowV2 opacity="0.6">
        <Container id="farm-page">
       <div        
      className={chainId == ChainId.FANTOM ? 'mb-4' : 'hidden'}
      >
        <SubmitButton
        height= "2rem"
        primaryColor={"#6F1BD9"} 
        size="lg"
        >
        <ExternalLink 
          href = "https://archived.soulswap.finance/farms" 
          target = "_blank" 
          rel="noreferrer"
        >
        <a className="block text-md font-bold md:text-xl text-white text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
          <span> Migrate from Here: Archived Farms </span>
        </a>
        </ExternalLink>
      </SubmitButton>
      </div> 
          {/* <br /> */}
          <Head>
            <title>Farm | Soul</title>
            <meta key="description" name="description" content="Farm" />
          </Head>
          <FarmList />
        </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Summoner