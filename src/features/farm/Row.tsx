import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
// import QuestionHelper from '../../components/QuestionHelper'
import { SOUL, Token } from 'sdk'
import AssetInput from 'components/AssetInput'
import { useSoulSummonerContract, useSummonerAssistantContract, useSummonerContract } from 'hooks/useContract'
import useApprove from 'features/bond/hooks/useApprove'

import { DetailsContainer, DetailsWrapper, FarmContentWrapper,
    FarmContainer, FarmItem, FarmItemBox, FunctionBox, SubmitButton
} from './Styles'
import { Wrap, Text, ExternalLink } from '../../components/ReusableStyles'
import { tryParseAmount } from 'functions'
import { useSummonerPoolInfo, useSummonerUserInfo } from 'hooks/useAPI'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import Modal from 'components/DefaultModal'
import { XIcon } from '@heroicons/react/solid'
import { Button } from 'components/Button'

const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

// const TokenLogo = styled(Image)`
//   @media screen and (max-width: 400px) {
//     font-size: 1rem;
//     padding-right: 10px;
//   }
// `

const HideOnSmall = styled.div`
@media screen and (max-width: 800px) {
  display: none;
}
`

const HideOnMobile = styled.div`
@media screen and (max-width: 600px) {
  display: none;
}
`

export const ActiveRow = ({ pid, farm, lpToken }) => {
    const { account, chainId } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)

    const [approved, setApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('')
    const [depositValue, setDepositValue] = useState('')
    const [showFarm, setShowFarm] = useState(false)
    
    const SoulSummonerContract = useSoulSummonerContract()
    const SoulSummonerAddress = SoulSummonerContract.address

    //   const [confirmed, setConfirmed] = useState(false)
    //   const [receiving, setReceiving] = useState(0)
    const parsedDepositValue = tryParseAmount(depositValue, SOUL[250])
    const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[250])
    // console.log('earnedAmount:%s', earnedAmount)
    // show confirmation view before minting SOUL
    // const [liquidity, setLiquidity] = useState(0)
    // const balance = useCurrencyBalance(account, SOUL[250])

    const { summonerPoolInfo } = useSummonerPoolInfo(pid)
    const liquidity = summonerPoolInfo.tvl
    const apr = summonerPoolInfo.apr
    const [unstakedBal, setUnstakedBal] = useState(0)

    const { summonerUserInfo } = useSummonerUserInfo(pid)
    const stakedBalance = summonerUserInfo.stakedBalance
    const stakedValue = summonerUserInfo.stakedValue
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue

    // ONLY USED FOR LOGO //
    const tokenA = new Token(chainId, farm.token1Address[chainId], 18)
    const tokenB = new Token(chainId, farm.token2Address[chainId], 18)
    // console.log('earnedSoul:%s', earnedAmount)
    
    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
        fetchBals()
        fetchApproval()
    }, [account])

    /**
     * Runs on initial render/mount and reruns every 2 seconds
     */
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                // if (showing) {
                    fetchBals()
                    fetchApproval()
                // }
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
     * Gets the lpToken balance of the user for each pool
     */
    const fetchBals = async () => {
        if (!account) {
            // alert('connect wallet')
        } else {
            try {
                // get total balance for pid from user balancess
                const result2 = await erc20BalanceOf(account)
                const unstaked = ethers.utils.formatUnits(result2)
                setUnstakedBal(Number(unstaked))

                return [unstaked]
            } catch (err) {
                // console.warn(err)
            }
        }
    }

    /**
     * Checks if the user has approved SoulSummonerAddress to move lpTokens
     */
    const fetchApproval = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            // Checks if SoulSummonerContract can move tokens
            const amount = await erc20Allowance(account, SoulSummonerAddress)
            if (amount > 0) setApproved(true)
            return amount
        }
    }

    /**
     * Approves SoulSummonerAddress to move lpTokens
     */
    const handleApprove = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(SoulSummonerAddress)
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
    const handleWithdraw = async (pid, parsedWithdrawValue) => {
        try {
            const tx = await SoulSummonerContract?.withdraw(pid, parsedWithdrawValue?.quotient.toString())
            // await tx?.wait().then(await setPending(pid))
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    // /**
    //  * Harvest Shares
    //  */
    const handleHarvest = async (pid) => {
        try {
            let tx
            tx = await SoulSummonerContract?.deposit(pid, 0)
            await tx?.wait() // .then(await fetchEarnings())
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
            const tx = await SoulSummonerContract?.deposit(account, parsedDepositValue?.quotient.toString())
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
                <FarmContainer>
                    <div className="bg-dark-900" onClick={() => handleShow()}>
                        <FarmContentWrapper>
                            {/* <TokenPairBox> */}
                                {/* <Wrap> */}
                                <DoubleCurrencyLogo currency0={tokenA} currency1={tokenB} size={40} />
                                {/* </Wrap> */}
                            {/* </TokenPairBox> */}

                            <FarmItemBox>
                                <FarmItem>
                                    {Number(apr).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                        {Number(stakedBalance) == 0 ? '0' 
                                            : Number(stakedBalance).toFixed(0).toString() == '0' ? Number(stakedBalance).toFixed(6)
                                                : Number(stakedBalance)
                                                    .toFixed(0)
                                                    .toString()
                                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        }
                                        </Text>
                                    )}
                                </FarmItem>
                            </FarmItemBox>

                    {/* STAKED VALUE */}
                        <HideOnMobile>
                            <FarmItemBox>
                                <FarmItem>
                                    {Number(apr).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                        {Number(stakedValue) == 0 ? '0' 
                                            : Number(stakedValue).toString(4) == '0.0000' ? '<0.0000'
                                            : Number(stakedValue) < 1 && Number(stakedValue).toString(4)
                                        ? Number(stakedValue).toFixed(4)
                                            : Number(stakedValue) > 0
                                                ? Number(stakedValue).toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    : 0
                                        }
                                        </Text>
                                    )}
                                </FarmItem>
                            </FarmItemBox>
                        </HideOnMobile>

                    {/* STAKED OWNERSHIP */}
                        <HideOnSmall>
                            <FarmItemBox>
                                <FarmItem>
                                    {Number(stakedValue).toFixed(0).toString() === '0' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0%
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                        { (Number(stakedValue) / Number(liquidity) * 100).toFixed(0) }%
                                        </Text>
                                    )}
                                </FarmItem>
                            </FarmItemBox>
                        </HideOnSmall>

                    {/* % APR */}
                            <FarmItemBox>
                                <FarmItem>
                                    {Number(apr).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                            {Number(apr).toFixed()}%
                                        </Text>
                                    )}
                                </FarmItem>
                            </FarmItemBox>

                            <FarmItemBox className="flex">
                                {Number(earnedValue).toFixed(0).toString() === '0' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        ${Number(earnedValue).toFixed(0)}
                                    </Text>
                                )}
                            </FarmItemBox>
                            <FarmItemBox className="flex" >
                                {Number(liquidity) === 0 ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        $0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem">
                                        ${Number(liquidity)
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                    </Text>
                                )}

                            </FarmItemBox>

                        </FarmContentWrapper>
                    </div>
                </FarmContainer>
            </Wrap>

            {showing && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <Modal 
                    isOpen={showing} 
                    onDismiss={
                            () => setShowing(false)
                        }>
                    {/* <SubmitButton
                        height="1.5rem"
                        primaryColour="#FF3E3E"
                        color="white"
                        onClick={() =>
                            setShowFarm(false)
                        }
                    >
                        X
                    </SubmitButton> */}
                    <div className="relative justify-right">
                        <Button
                            // type="button"
                            onClick={() => setShowing(false)}
                            className="inline-flex opacity-80 hover:opacity-100 focused:opacity-100 rounded p-1.5 text-primary hover:text-high-emphesis focus:text-high-emphesis focus:outline-none focus:ring focus:ring-offset focus:ring-offset-purple focus:ring-purple"
                        >
                            <XIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    </div>
                    {Number(stakedBalance) == 0 ? (
                        <FunctionBox>
                            <AssetInput
                                currencyLogo={false}
                                currency={farm.lpAddress}
                                currencyAddress={farm.lpAddress}
                                value={depositValue}
                                onChange={setDepositValue}
                                showMax={false}
                            />
                            <Wrap padding="0" margin="0" display="flex">
                                {(approved && Number(unstakedBal) == 0) ?
                        (
                            <TokenPairLink
                                target="_blank"
                                rel="noopener"
                                text-color="#F36FFE" // neon purple
                                href=
                                {`https://exchange.soulswap.finance/swap`}
                            >
                                ACQUIRE SOUL
                            </TokenPairLink>
                        ) :
                                approved ?
                                    (
                                        <SubmitButton
                                        height="2rem"
                                        primaryColour="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleDeposit(depositValue)
                                        }
                                        >
                                            DEPOSIT SOUL
                                        </SubmitButton>
                                    ) :
                                    (
                                        <SubmitButton height="2rem" onClick={() => handleApprove()}>
                                            APPROVE
                                        </SubmitButton>
                                    )
                                        }
                                    </Wrap>
                                </FunctionBox>
                            ) : (
                                <FunctionBox>
                                    <AssetInput
                                        currencyLogo={true}
                                        currency={SOUL[250]}
                                        currencyAddress={SOUL[250].address}
                                        value={depositValue}
                                        onChange={setDepositValue}
                                        showMax={false}
                                        showBalance={true}
                                    />
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#B485FF"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleDeposit(depositValue)
                                            }
                                        >
                                            DEPOSIT SOUL
                                        </SubmitButton>
                                    </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColour="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleWithdraw(pid, withdrawValue)
                                        }
                                    >
                                        WITHDRAW
                                    </SubmitButton>
                                </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#bbb"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleHarvest(pid)
                                            }
                                        >
                                            HARVEST {Number(earnedAmount).toFixed(0)} SOUL
                                            {/* {Number(earnedAmount) !== 0 ? `($${(Number(earnedAmount) * soulPrice).toFixed(0)})` : ''} */}
                                        </SubmitButton>
                                    </Wrap>

                                </FunctionBox>
                            )}
                        </Modal>
                    {/* </DetailsContainer> */}
                </Wrap>
            )}
        </>
    )
}