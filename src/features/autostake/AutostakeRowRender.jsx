import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'
import { getAddress } from '@ethersproject/address'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
import { Token } from 'sdk'
import { AUTO_STAKE_ADDRESS } from 'sdk'
import useAutoStake from './useAutoStake'
import { useAutoStakeContract } from 'hooks/useContract'
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


// params to render bond with:
// 1. LpToken + the 2 token addresses (fetch icon from folder in)
// 2. totalAlloc / poolAlloc
// 3. userInfo:
//    - amount (in pool)
//    - rewardDebt (owed)

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
    const {
        fetchBondStats,
        userInfo,
    } = useAutoStake(pid, stakeToken, pool)
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(stakeToken)
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)
    // const AutoStakeContract = useAutoStakeContract()
    const AutoStakeAddress =  AUTO_STAKE_ADDRESS[chainId]
    const [approved, setApproved] = useState(false)
    //   const [confirmed, setConfirmed] = useState(false)
    //   const [receiving, setReceiving] = useState(0)

    const [stakedBal, setStakedBal] = useState(0)
    const [unstakedBal, setUnstakedBal] = useState(0)
    const [pending, setPending] = useState(0)

    // show confirmation view before minting SOUL
    const [apr, setApr] = useState()
    const [liquidity, setLiquidity] = useState()
    const { deposit, withdraw } = useStakeContract()

    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
        getAprAndLiquidity()
    }, [account])

    /**
     * Runs on initial render/mount and reruns every 2 seconds
     */
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                if (showing) {
                    fetchBals()
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
            fetchApproval()
        }
    }

    /**
     * Checks the amount of lpTokens the AutoStakeContract contract holds
     * 
     * pool <Object> : the pool object
     * lpToken : the pool lpToken address
     */
    const getAprAndLiquidity = async () => {
        try {
            const result = await fetchBondStats(pid, pool.token1, pool.token2)
            const tvl = result[0]
            const apr = result[1]

            setLiquidity(tvl)
            setApr(apr)
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
                const result1 = await userInfo(pid, account)
                const staked = ethers.utils.formatUnits(result1?.[0])
                setStakedBal(Number(staked))

                // get total SOUL for pid from user bal
                const result2 = await erc20BalanceOf(account)
                const unstaked = ethers.utils.formatUnits(result2)
                setUnstakedBal(Number(unstaked))

                return [staked, unstaked]
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

    /**
     * Deposits Soul
     */
    const handleDeposit = async (amount) => {
        try {
            const tx = await deposit(amount)
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
                                    {Number(apr).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                            {apr}
                                        </Text>
                                    )}
                                </StakeItem>
                            </StakeItemBox>

                            <StakeItemBox desktopOnly={true}>
                                {pending.toString() === '0.00' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        {pending}
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
                                    {/* <button >Max</button> */}
                                    <Wrap padding="0" display="flex" justifyContent="space-between">
                                        <Text padding="0" fontSize="1rem" color="#bbb">
                                            Available:&nbsp;
                                            {Number(unstakedBal) === 0
                                                ? '0.000'
                                                : Number(unstakedBal) < 0.001
                                                    ? '<0.001'
                                                    : Number(unstakedBal)
                                                        .toFixed(3)
                                                        .toString()
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            &nbsp;LP &nbsp; {Number(unstakedBal * soulPrice) !== 0 ? `($${(unstakedBal * soulPrice).toFixed(3)})` : ''}
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
                                            VALUE:&nbsp;{Number(stakedLpValue) !== 0 ? `$${stakedLpValue.toFixed(3)}` : '0'}
                                        </Text>
                                    </Wrap>
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2.5rem"
                                            primaryColour="#bbb"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleWithdraw()
                                            }
                                        >
                                            CLAIM SOUL {pendingValue !== 0 ? `($${pendingValue})` : ''}
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
