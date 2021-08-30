import React, { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ethers } from 'ethers'

import useSoulSummoner from './useSoulSummoner'
import useLpToken from './useLpToken'

import {
  FlexText,
  FarmContainer,
  FarmRow,
  FarmContentWrapper,
  TokenPairBox,
  TokenPair,
  FarmItemBox,
  FarmItemHeading,
  FarmItem,
  ShowBtn,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  Input,
  SubmitButton,
} from './FarmStyles'

import { Wrap, ClickableText } from '../../components/ReusableStyles'

// params to render farm with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

// each item will need its own box

const Farm = ({ pid, lpSymbol, lpToken, token1, token2 }) => {
  const { account } = useActiveWeb3React()

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const { fetchSummonerLpTokens, withdraw, deposit, pendingSoul, poolInfo, userInfo, soulPerSecond, totalAllocPoint } =
    useSoulSummoner(lpToken)
  const { approve, allowance, balanceOf } = useLpToken(lpToken)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)

  const [pending, setPending] = useState(0)
  const [apr, setApr] = useState()
  const [liquidity, setLiquidity] = useState()
  const [approved, setApproved] = useState(false)
  const [showing, setShowing] = useState(false)

  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    fetchFarmApr(pid)
    console.log('apr:', apr)
    fetchSummonerTokenBal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  /**
   * Runs on initial render/mount and  reruns every second
   */
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending(pid)
        fetchFarmApr(pid)
        fetchSummonerTokenBal()
      }, 3000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  /**
   * Opens the function panel dropdown
   */
  const handleShow = () => {
    setShowing(!showing)
    if (showing) {
      // Checks if any amount is staked in PID
      fetchBals(pid)
      fetchApproval()
    }
  }

  /**
   *  Note; How to create this function
   *  - fetch the price of FUSD to SOUL
   *  - use ^ to fetch the price of all other assets w/ SOUL as a pair
   */
  const fetchPriceOfToken = (pid) => {}

  /**
   * Fetches the APR percentage for the `pid`
   */
  const fetchFarmApr = async (pid) => {
    const poolAllocation = await poolInfo(pid)
    const totalAllocation = await totalAllocPoint()
    const poolWeight = poolAllocation?.[1] / totalAllocation

    const soulPerSec = await soulPerSecond()
    const formattedSPS = ethers.utils.formatUnits(soulPerSec.toString())

    // amount of soul allocated to this pool per year
    const yearlySoulFarmAlloc = formattedSPS * 31557600 * poolWeight
    console.log('yearlyAlloc', yearlySoulFarmAlloc)

    // get the total liquidity to calc the current available apr
    // const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)

    // const soulRewardsApr = yearlySoulRewardAlloc.times(soulPriceUsd).div(poolLiquidityUsd).times(100)

    const farmApr = yearlySoulFarmAlloc / liquidity

    // set to soulRewardsApr
    setApr(Number(farmApr).toFixed(0))
    return Number(farmApr).toFixed(0)
  }

  /**
   * Checks the user's alloc of the total staked in the farm
   */
  // const fetchUserFarmAlloc = async () => {}

  /**
   * Checks the amount of lpTokens the SoulSummoner contract holds
   */
  const fetchSummonerTokenBal = async () => {
    try {
      const bal = await fetchSummonerLpTokens()
      console.log('lpTokens', bal.toString())
      const formatted = ethers.utils.formatUnits(bal.toString())
      setLiquidity(Number(formatted).toFixed(0))
    } catch (e) {
      console.warn(e)
    }
  }

  /**
   * Gets the lpToken balance of the user for each pool
   */
  const fetchBals = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const result1 = await userInfo(pid)
        const staked = ethers.utils.formatUnits(result1?.[0])
        setStakedBal(staked.toString())

        const result2 = await balanceOf(lpToken)
        const unstaked = ethers.utils.formatUnits(result2)
        setUnstakedBal(unstaked.toString())

        return [staked, unstaked]
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /**
   * Fetches connected user pending soul
   */
  const fetchPending = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const pending = ethers.BigNumber.from(await pendingSoul(pid)).toString()
        const formatted = ethers.utils.formatUnits(pending.toString())
        setPending(Number(formatted).toFixed(1).toString())
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /**
   * Checks if the user has approved SoulSummoner to move lpTokens
   */
  const fetchApproval = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      // Checks if SoulSummoner can move tokens
      const amount = await allowance()
      if (amount > 0) {
        setApproved(true)
      }
      return amount
    }
  }

  /**
   * Approves SoulSummoner to move lpTokens
   */
  const handleApprove = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const tx = await approve()
        await tx.wait().then(await fetchApproval())
      } catch (e) {
        alert(e.message)
        console.log(e)
        return
      }
    }
  }

  /**
   * Harvests rewards from SoulSummoner farm
   */
  const handleHarvest = async () => {
    try {
      const tx = await withdraw(pid, 0)
      await tx.wait().then(await fetchPending(pid))
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  /**
   * Withdraws staked lpTokens from SoulSummoner farm
   */
  const handleWithdraw = async (amount) => {
    try {
      const tx = await withdraw(pid, amount)
      await tx.wait().then(await fetchBals(pid))
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  /**
   * Deposits/stakes lpTokens into SoulSummoner farm
   */
  const handleDeposit = async (amount) => {
    try {
      const tx = await deposit(pid, amount)
      await tx.wait().then(await fetchBals(pid))
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  return (
    <>
      <FarmContainer>
        <FarmRow onClick={() => handleShow()}>
          <FarmContentWrapper>
            <TokenPairBox>
              {/* 2 token logo combined ? */}
              <Wrap>
                <FarmItemHeading>Token Pair</FarmItemHeading>
                <TokenPair target="_blank" href={`https://app.soulswap.finance/add/${token1}/${token2}`}>
                  {lpSymbol}
                </TokenPair>
              </Wrap>
            </TokenPairBox>

            <FarmItemBox>
              <FarmItemHeading>APR</FarmItemHeading>
              <FarmItem>{apr}%</FarmItem>
            </FarmItemBox>

            <FarmItemBox>
              <FarmItemHeading>TVL</FarmItemHeading>
              <FarmItem>{liquidity}</FarmItem>
            </FarmItemBox>

            <FarmItemBox desktopOnly={true}>
              <FarmItemHeading>Earned</FarmItemHeading>
              <FarmItem>{pending}</FarmItem>
            </FarmItemBox>

            {/* <FarmItemBox>
              <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
            </FarmItemBox> */}
          </FarmContentWrapper>
        </FarmRow>
      </FarmContainer>

      {showing ? (
        <DetailsContainer>
          <DetailsWrapper>
            <FunctionBox>
              {/* <button >Max</button> */}
              <FlexText>
                <p>Available: {Number(unstakedBal).toFixed(3)}</p>
                <ClickableText
                  padding="0"
                  color="#aaa"
                  onClick={() => (document.getElementById('stake').value = unstakedBal)}
                >
                  MAX
                </ClickableText>
              </FlexText>
              <Input name="stake" id="stake" type="number" placeholder="0.0" min="0" />
              <Wrap padding="0" margin="0" display="flex">
                {approved ? (
                  <SubmitButton
                    onClick={() => handleDeposit(ethers.utils.parseUnits(document.getElementById('stake').value))}
                  >
                    Stake
                  </SubmitButton>
                ) : (
                  <SubmitButton onClick={() => handleApprove()}>Approve Stake</SubmitButton>
                )}
              </Wrap>
            </FunctionBox>

            <FunctionBox>
              <FlexText>
                <p>Staked: {Number(stakedBal).toFixed(3)}</p>
                <ClickableText
                  padding="0"
                  color="#aaa"
                  onClick={() => (document.getElementById('unstake').value = stakedBal)}
                >
                  MAX
                </ClickableText>
              </FlexText>
              <Input name="unstake" id="unstake" type="number" placeholder="0.0" min="0" />

              <Wrap padding="0" margin="0" display="flex">
                <SubmitButton padding="0" margin=".5rem .6rem .5rem 0" onClick={() => handleHarvest()}>
                  Harvest
                </SubmitButton>
                <SubmitButton
                  primaryColour="#bbb"
                  color="black"
                  margin=".5rem 0 .5rem .6rem"
                  onClick={() => handleWithdraw(ethers.utils.parseUnits(document.getElementById('unstake').value))}
                >
                  Unstake
                </SubmitButton>
              </Wrap>
            </FunctionBox>
          </DetailsWrapper>
        </DetailsContainer>
      ) : null}
    </>
  )
}

export const FarmList = () => {
  // Display token pair - TODO:
  // 1) fetch total farms
  // 2) get lpTokenAddress from calling `poolInfo?.[0]`
  // 3) input into factory to get token1-token2
  // 4) typed out -> [`${token1}`-`${`token2`}`]
  const farms = [
    {
      pid: 1,
      lpSymbol: 'SOUL-WFTM',
      lpAddresses: {
        4002: '0x10c0AFd7C58916C4025d466E11850c7D79219277',
      },
      token1: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
      token2: '0xcf174a6793fa36a73e8ff18a71bd81c985ef5ab5',
    },
    {
      pid: 5,
      lpSymbol: 'SOUL-FUSD',
      lpAddresses: {
        4002: '0xaf02fd55F297f2a591367F6E33Dc600Ff2Be472A',
      },
      token1: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
      token2: '0x306557358e20AEa124b16a548597897858D13cb2',
    },
    {
      pid: 4,
      lpSymbol: 'FUSD-FETH',
      lpAddresses: {
        4002: '0x0f179c67E3105e848Daf68f331734069bc1aE697',
      },
      token1: '0x306557358e20AEa124b16a548597897858D13cb2',
      token2: '0x910a38cE2a26278c3493A95fe83e092aE821dF26',
    },
  ]

  const farmList = farms.map((farm) => (
    <Farm
      key={farm.pid}
      pid={farm.pid}
      lpSymbol={farm.lpSymbol}
      lpToken={farm.lpAddresses[4002]} // TODO: update to 250
      token1={farm.token1}
      token2={farm.token2}
    />
  ))
  return (
    <>
      {/* Banner */}

      {/* Content */}
      <div>{farmList}</div>
    </>
  )
}
