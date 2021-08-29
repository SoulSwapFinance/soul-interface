import React, { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import useApproveContract from '../../hooks/useApprove'
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

import { Wrap } from '../../components/ReusableStyles'

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

  const { erc20BalanceOf } = useApproveContract()
  const { withdraw, deposit, pendingSoul, poolInfo, userInfo, soulPerSecond, totalAllocPoint } = useSoulSummoner()
  const { approve, allowance, balanceOf } = useLpToken(lpToken)

  const [stakedBal, setStakedBal] = useState(0)
  const [unstakedBal, setUnstakedBal] = useState(0)

  const [pending, setPending] = useState(0)
  const [apr, setApr] = useState()
  const [liquidity, setLiquidity] = useState()
  const [multiplier, setMultiplier] = useState('?')
  const [approved, setApproved] = useState(false)
  const [showing, setShowing] = useState(false)

  // runs on render
  useEffect(() => {
    fetchMultiplier(pid)
    fetchFarmApr(pid)
    // fetchSummonerTokenBal()
    console.log('apr:', apr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  // Runs on render + reruns every second
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending(pid)
        fetchFarmApr(pid)
      }, 3000)

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer)
    }
  })

  const handleShow = () => {
    setShowing(!showing)
    if (showing) {
      // Checks if any amount is staked in PID
      fetchBals(pid)
      fetchApproval()
    }
  }

  // const fetchStakingApr = async () => {
  // const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  // const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  // const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  // return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
  // }

  // Return the base token price for a farm, from a given pid
  // export const useFtmPriceFromPid = (pid) => {
  // const farm = useFarmFromPid(pid)
  // return farm && new BigNumber(farm.token.ftmPrice)
  // }

  // export const useLpTokenPrice = (symbol) => {
  // const farm = useFarmFromLpSymbol(symbol)
  // const farmTokenPriceInUsd = useFtmPriceFromPid(farm.pid)
  // let lpTokenPrice = BIG_ZERO

  // if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
  //   // Total value of base token in LP
  //   const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
  //   // Double it to get overall value in LP
  //   const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
  //   // Divide total value of all tokens, by the number of LP tokens
  //   const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply))
  //   lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  // }

  // return lpTokenPrice
  // }

  // /!\ Deprecated , use the BUSD hook in /hooks

  // export const usePriceFtmFusd = () => {
  const usePriceFtmFusd = () => {
    const bnbBusdFarm = useFarmFromPid(252)
    return new BigNumber(bnbBusdFarm.quoteToken.busdPrice)
  }

  // export const usePriceSoulFusd = () => {
  const usePriceSoulFusd = () => {
    const soulFtmFarm = useFarmFromPid(2)
    const soulPriceFusdAsString = soulFtmFarm.token.fusdPrice
    const soulPriceFusd = useMemo(() => {
      return new BigNumber(soulPriceFusdAsString)
    }, [soulPriceFusdAsString])

    return soulPriceFusd
  }

  const fetchSummonerTokenBal = async () => {
    const bal = await erc20BalanceOf(lpToken, '0xA65DbEA56E1E202bf03dB5f49ba565fb00Bf9288')
    const formatted = ethers.utils.formatUnits(bal)
    console.log(formatted)
    setLiquidity(Number(formatted).toFixed(0))
  }

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

    // set to soulRewardsApr
    setApr(Number(yearlySoulFarmAlloc).toFixed(0))
    return Number(yearlySoulFarmAlloc).toFixed(0)
  }

  // Fetches pool allocation point and divides by 100 to give `mulitplier`
  const fetchMultiplier = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const poolData = await poolInfo(pid)
        const poolAlloc = poolData?.[1] / BigNumber.from(100)
        setMultiplier(poolAlloc.toString())
      } catch (err) {
        console.log(err)
      }
    }
  }

  //
  const fetchUserFarmAlloc = async () => {}

  // Checks how much the user is receiving in rewards based on their allocation of the pool
  const fetchUserFarmApr = async () => {}

  // Used to get non 1e18 numbers and turn them into 1e18
  const parseAmount = (amount) => {
    const bnAmount = ethers.BigNumber.from(amount).toString()
    const parsed = bnAmount.mul(BigNumber.from(10).pow(18)).toString()
    return parsed
  }

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
        console.log(err)
      }
    }
  }

  // Fetches connected user pending soul
  const fetchPending = async (pid) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const pending = ethers.BigNumber.from(await pendingSoul(pid)).toString()
        console.log(pending)
        const formatted = ethers.utils.formatUnits(pending.toString())
        console.log(formatted)
        setPending(Number(formatted).toFixed(1).toString())
      } catch (err) {
        console.log(err)
      }
    }
  }

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

  const handleApprove = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        const tx = await approve()
        await tx.wait()
        await fetchApproval()
      } catch (e) {
        alert(e.message)
        console.log(e)
        return
      }
    }
  }

  const handleHarvest = async () => {
    try {
      const tx = await withdraw(pid, 0)
      await tx.wait()
      await fetchPending(pid)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  const handleWithdraw = async (amount) => {
    try {
      const tx = await withdraw(pid, amount)
      await tx.wait()
      await fetchBals(pid)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  const handleDeposit = async (amount) => {
    try {
      const tx = await deposit(pid, amount)
      await tx.wait()
      await fetchBals(pid)
    } catch (e) {
      alert(e.message)
      console.log(e)
    }
  }

  return (
    <>
      <FarmContainer>
        <FarmRow>
          <FarmContentWrapper>
            <TokenPairBox>
              {/* 2 token logo combined ? */}
              <TokenPair target="_blank" href={`https://beta.soulswap.finance/add/${token1}/${token2}`}>
                {lpSymbol}
              </TokenPair>
            </TokenPairBox>

            <FarmItemBox desktopOnly={true}>
              <FarmItemHeading>Earned</FarmItemHeading>
              <FarmItem>{pending}</FarmItem>
            </FarmItemBox>

            <FarmItemBox>
              <FarmItemHeading>APR</FarmItemHeading>
              <FarmItem>{apr}%</FarmItem>
            </FarmItemBox>

            <FarmItemBox>
              <FarmItemHeading>TVL</FarmItemHeading>
              <FarmItem>${liquidity}</FarmItem>
            </FarmItemBox>

            <FarmItemBox marginLeft={'100px'} desktopOnly={true}>
              <FarmItemHeading>Multiplier</FarmItemHeading>
              <FarmItem>{multiplier}x</FarmItem>
            </FarmItemBox>

            <FarmItemBox>
              {/* <ShowBtnWrapper> */}
              <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              {/* </ShowBtnWrapper> */}
            </FarmItemBox>
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
                <button onClick={() => (document.getElementById('stake').value = unstakedBal)}>MAX</button>
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
                <button onClick={() => (document.getElementById('unstake').value = stakedBal)}>MAX</button>
              </FlexText>
              <Input name="unstake" id="unstake" type="number" placeholder="0.0" min="0" />

              <Wrap padding="0" margin="0" display="flex">
                <SubmitButton padding="0" onClick={() => handleHarvest()}>
                  Harvest
                </SubmitButton>
                <SubmitButton
                  primaryColour="#bbb"
                  color="black"
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
