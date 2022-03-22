import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'
import { getAddress } from '@ethersproject/address'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
import { Token } from 'sdk'
import { AUTO_STAKE_ADDRESS, SOUL_SUMMONER_ADDRESS } from 'sdk'
import useAutoStake from './useAutoStake'
import { aprToApy } from 'functions/convert'
import { useAutoStakeContract, useSoulSummonerContract } from 'hooks/useContract'
import { useStakeContract, useStakeSharePrice, useStakeRecentProfit, sharesFromSoul } from './hooks'
import useApprove from 'features/bond/hooks/useApprove'
import {
    StakeContainer,
    Row,
    StakeContentWrapper,
    TokenPairBox,
    StakeItemBox,
    StakeItem,
    DetailsContainer,
    DetailsWrapper,
    FunctionBox,
    Input,
    FlexText,
    SubmitButton,
} from './StakeStyles'
import { Wrap, ClickableText, Text, ExternalLink } from '../../components/ReusableStyles'

const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

const TokenLogo = styled(Image)`
  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`

const StakeRowRender = ({ pid, stakeToken, pool }) => {
    const { account, chainId } = useActiveWeb3React()
    // const {
    //     poolInfo,
    //     fetchStakeStats,
    //     userInfo,
    // } = useAutoStake(pid, stakeToken, pool)
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(stakeToken)
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)
    const AutoStakeContract = useAutoStakeContract()
    const SoulSummonerContract = useSoulSummonerContract()
    const SoulSummonerAddress = SOUL_SUMMONER_ADDRESS[chainId]
    const AutoStakeAddress =  AUTO_STAKE_ADDRESS[chainId]
    const [approved, setApproved] = useState(false)
    //   const [confirmed, setConfirmed] = useState(false)
    //   const [receiving, setReceiving] = useState(0)

    const [stakedBal, setStakedBal] = useState(0)
    const [earnedAmount, setEarnedAmount] = useState(0)
    const [unstakedBal, setUnstakedBal] = useState(0)
    const [pending, setPending] = useState(0)

    // show confirmation view before minting SOUL
    const [apy, setApy] = useState()
    const [liquidity, setLiquidity] = useState()
    const { deposit, withdraw } = useStakeContract()

    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
        getApyAndLiquidity()
        fetchBals()
    }, [account])

    /**
     * Runs on initial render/mount and reruns every 2 seconds
     */
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                if (showing) {
                    fetchBals()
                    getApyAndLiquidity()
                    fetchEarnedAmount()
                    fetchApproval()
                }
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
        if (!showing) {
            fetchBals()
            fetchEarnedAmount()
            fetchApproval()
        }
    }

    /**
     * Checks the amount of lpTokens the AutoStakeContract contract holds
     * 
     * pool <Object> : the pool object
     * lpToken : the pool lpToken address
     */
    const getApyAndLiquidity = async () => {
        try {
            const autoStakeBalance = await AutoStakeContract?.soulBalanceOf()
            const totalSoul = ethers.utils.formatUnits(autoStakeBalance)
            const tvl = soulPrice * totalSoul
            
            // APR CALCULATION //
            const rawSummonerBal = await erc20BalanceOf(SoulSummonerAddress)
            const summonerTvl = soulPrice * rawSummonerBal / 1e18
            const soulPerSec = await SoulSummonerContract?.soulPerSecond()
            const soulPerDiem = soulPerSec / 1e18 * 86_400
            const poolInfo = await SoulSummonerContract?.poolInfo(0)
            const alloc = poolInfo?.[1]
            const totalAlloc = await SoulSummonerContract?.totalAllocPoint()
            const percAlloc = alloc / totalAlloc
            const dailySoul = soulPerDiem * percAlloc
            const annualSoul = dailySoul * 365
            const annualRewardsValue = annualSoul * soulPrice
            // const SECONDS_IN_YEAR = 60 * 60 * 24 * 365
            const apr = (annualRewardsValue / summonerTvl) * 100
            const apy = aprToApy(apr * 6) // assumes reinvestments every 4hrs

            setLiquidity(Number(tvl).toFixed(2))
            setApy(Number(apy).toFixed(2))
            // console.log('tvl:%s', Number(tvl))
            // console.log('apy:%s', Number(apy))
        } catch (e) {
            console.warn(e)
        }
    }

    /**
     * Gets the lpToken balance of the user for each pool
     */
    const fetchBals = async () => {
        if (!account) {
            // alert('connect wallet')
        } else {
            try {
                // get total SOUL staked in contract for pid from user
                const staked = await AutoStakeContract?.balanceOf(account)
                const stakedBal = staked / 1e18
                setStakedBal(Number(stakedBal))
                console.log('staked:%s', Number(stakedBal))
                
                // get total SOUL for pid from user bal
                const result2 = await erc20BalanceOf(account)
                const unstaked = ethers.utils.formatUnits(result2)
                setUnstakedBal(Number(unstaked))
                
                return [stakedBal, unstaked]
              } catch (err) {
                console.warn(err)
              }
            }
          }
          
          /**
           * Gets the earned amount of the user for each pool
           */
          const fetchEarnedAmount = async () => {
            if (!account) {
              // alert('connect wallet')
            } else {
              try {
                // get SOUL earned
                const result = await AutoStakeContract?.available()
                const available = result / 1e18
                setEarnedAmount(Number(available))
                console.log('available:%s', Number(available))

                return [available]
            } catch (err) {
                console.warn(err)
            }
        }
    }

    /**
     * Checks if the user has approved AutoStakeContract to move lpTokens
     */
    const fetchApproval = async () => {
        if (!account) {
            alert('Connect Wallet')
        } else {
            // Checks if AutoStakeContract can move tokens
            const amount = await erc20Allowance(account, AutoStakeAddress)
            if (amount > 0) setApproved(true)
            return amount
        }
    }

    /**
     * Approves AutoStakeContract to move lpTokens
     */
    const handleApprove = async () => {
        if (!account) {
            alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(AutoStakeAddress)
                await tx?.wait().then(await fetchApproval())
            } catch (e) {
                // alert(e.message)
                console.log(e)
                return
            }
        }
    }

    // /**
    //  * Withdraw Shares
    //  */
    const handleWithdraw = async (amount, sharePrice) => {
        try {
            let tx
            tx = await withdraw(amount, sharePrice)
            // await tx?.wait().then(await setPending(pid))
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    const handleWithdrawAll = async () => {
        try {
            let tx
            tx = await AutoStakeContract.withdrawAll()
            await tx?.wait().then(await setPending(pid))
            // await tx?.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    // /**
    //  * Harvest Shares
    //  */
    const handleHarvest = async () => {
        try {
            let tx
            tx = await AutoStakeContract?.harvest()
            // await tx?.wait().then(await setPending(pid))
            await tx?.wait().then(await fetchEarnedAmount())
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    /**
     * Deposits Soul
     */
    const handleDeposit = async (amount) => {
        try {
            const tx = await AutoStakeContract?.deposit(account, amount)
            await tx.wait()
            await fetchBals()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    return (
        <>
            <Wrap padding="0" display="flex" justifyContent="center">
                <StakeContainer>
                    <Row onClick={() => handleShow()}>
                        <StakeContentWrapper>
                            <TokenPairBox>
                                <Wrap>
                                    <TokenLogo
                                        src={
                                            'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                                            pool.token1Address[chainId] +
                                            '/logo.png'
                                        }
                                        alt="LOGO"
                                        width="64px"
                                        height="64px"
                                        objectFit="contain"
                                        className="rounded-full items-center justify-center text-center"
                                    />
                                </Wrap>
                            </TokenPairBox>

                            <StakeItemBox>
                                <StakeItem>
                                    {Number(apy).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                            {Number(apy).toFixed()}%
                                        </Text>
                                    )}
                                </StakeItem>
                            </StakeItemBox>

                            <StakeItemBox desktopOnly={true}>
                                {earnedAmount.toString() === '0.00' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        {earnedAmount.toFixed(4)}
                                    </Text>
                                )}
                            </StakeItemBox>
                            {liquidity === '0' ? (
                                <Text padding="0" fontSize="1rem" color="#666">
                                    $0
                                </Text>
                            ) : (
                                <Text padding="0" fontSize="1rem">
                                    ${liquidity}
                                </Text>
                            )}
                        </StakeContentWrapper>
                    </Row>
                </StakeContainer>
            </Wrap>

            {showing && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <DetailsContainer>
                        <DetailsWrapper>
                            {stakedBal == 0 ? (
                                <FunctionBox>
                                    <Wrap padding="0" display="flex" justifyContent="space-between">
                                        <Text padding="0" fontSize="1rem" color="#bbb">
                                            {Number(unstakedBal) === 0
                                                ? '0.000'
                                                : Number(unstakedBal) < 0.001
                                                    ? '<0.001'
                                                    : Number(unstakedBal)
                                                        .toFixed(3)
                                                        .toString()
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            &nbsp;SOUL &nbsp; {Number(unstakedBal * soulPrice) !== 0 ? `($${(unstakedBal * soulPrice).toFixed(3)})` : ''}
                                        </Text>
                                        <ClickableText
                                            padding="0"
                                            fontSize=".9rem"
                                            color="#aaa"
                                            onClick={() => (document.getElementById('stake').value = unstakedBal)}
                                        >
                                            MAX
                                        </ClickableText>
                                    </Wrap>
                                    <Input name="stake" id="stake" type="number" placeholder="0.0" min="0" />
                                    <Wrap padding="0" margin="0" display="flex">
                                        {(approved && Number(unstakedBal) == 0) ?
                                            (
                                                <TokenPairLink
                                                    target="_blank"
                                                    rel="noopener"
                                                    text-color="#F36FFE" // neon purple
                                                    href=
                                                    {`https://exchange.soulswap.finance/swap}`}
                                                >
                                                    BUY SOUL
                                                </TokenPairLink>
                                            ) :
                                            approved ?
                                                (
                                                    <SubmitButton
                                                        height="2.5rem"
                                                        onClick={() =>
                                                            handleDeposit(ethers.utils.parseUnits(document.getElementById('stake').value))
                                                        }
                                                    >
                                                        DEPOSIT SOUL
                                                    </SubmitButton>
                                                ) :
                                                (
                                                    <SubmitButton height="2.5rem" onClick={() => handleApprove()}>
                                                        APPROVE
                                                    </SubmitButton>
                                                )
                                        }
                                    </Wrap>
                                </FunctionBox>
                            ) : (
                                <FunctionBox>
                                    <FlexText>
                                        <ClickableText
                                            padding="0"
                                            fontSize=".9rem"
                                            color="#aaa"
                                            onClick={() => {
                                                document.getElementById('unstake').value = stakedBal
                                            }}
                                        >
                                            MAX
                                        </ClickableText>
                                    </FlexText>
                                    <Input
                                        name="unstake"
                                        id="unstake"
                                        type="number"
                                        placeholder="0.0"
                                        min="0"
                                        onChange={() => stakedBal}
                                    />
                                    <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#aaa">
                                            STAKED:&nbsp;
                                            {Number(stakedBal) === 0
                                                ? '0.000'
                                                : Number(stakedBal) < 0.001
                                                    ? '<0.001'
                                                    : Number(stakedBal)
                                                        .toFixed(3)
                                                        .toString()
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }&nbsp;
                                            <br />
                                            VALUE:&nbsp;{Number(stakedBal * soulPrice) !== 0 ? `$${Number(stakedBal * soulPrice).toFixed(3)}` : '0'}
                                        </Text>
                                    </Wrap>
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2.5rem"
                                            primaryColour="#bbb"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                              handleHarvest()
                                            }
                                        >
                                          {/* TODO: fix below */}
                                            CLAIM SOUL
                                          {earnedAmount !== 0 ? `($${(earnedAmount * soulPrice).toFixed(4)})` : ''}
                                        </SubmitButton>
                                    </Wrap>
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2.5rem"
                                            primaryColour="#bbb"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                             handleWithdrawAll()
                                            }
                                        >
                                          {/* TODO: fix below */}
                                            WITHDRAW ALL
                                        </SubmitButton>
                                    </Wrap>
                                </FunctionBox>
                            )}
                        </DetailsWrapper>
                    </DetailsContainer>
                </Wrap>
            )}
        </>
    )
}

export default StakeRowRender
