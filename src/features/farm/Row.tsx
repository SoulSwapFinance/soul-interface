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

import { FarmContentWrapper,
    FarmContainer, FarmItem, FarmItemBox, Text, FunctionBox, SubmitButton, Wrap
} from './Styles'
import { classNames, formatNumber, tryParseAmount } from 'functions'
import { useSummonerPoolInfo, useSummonerUserInfo } from 'hooks/useAPI'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
// import Modal from 'components/DefaultModal'
import { ArrowLeftIcon, XIcon } from '@heroicons/react/solid'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import Swap from 'pages/exchange/swap/[[...tokens]]'
// import ManageSwapPair from './modals/ManageSwapPair'
// import { Deposit } from './modals/Deposit'

// const TokenPairLink = styled(ExternalLink)`
//   font-size: .9rem;
//   padding-left: 10;
// `

const HideOnSmall = styled.div`
@media screen and (max-width: 900px) {
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
    const [showOptions, setShowOptions] = useState(false)
    const [depositing, setDepositing] = useState(false)

    const [approved, setApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('0')
    const [depositValue, setDepositValue] = useState('0')
    const [withdrawable, getWithdrawable] = useState('0')
    
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
    const [openDeposit, setOpenDeposit] = useState(false)
    const [openSwap, setOpenSwap] = useState(false)
    
    const { summonerUserInfo } = useSummonerUserInfo(pid)
    const stakedBalance = summonerUserInfo.stakedBalance
    const stakedValue = summonerUserInfo.stakedValue
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue

    // ONLY USED FOR LOGO //
    const token0 = new Token(chainId, farm.token1Address[chainId], 18)
    const token1 = new Token(chainId, farm.token2Address[chainId], 18)
    // const pair = new Token(chainId, farm.lpToken.address, 18)
    console.log('lpAddress:%s', farm.lpToken)
    
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
    const handleShowOptions = () => {
        setShowOptions(!showOptions)
        if (!showOptions) {
            fetchBals()
            fetchApproval()
        }
    }

    const handleShowDeposit = () => {
        setOpenDeposit(!openDeposit)
        if (!openDeposit) {
            fetchBals()
            fetchApproval()
        }
    }

    const handleShowSwap = () => {
        setOpenSwap(!openSwap)
        if (!openSwap) {
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

    // // /**
    // //  * Withdraw Shares
    // //  */
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

    // // /**
    // //  * Harvest Shares
    // //  */
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

    // /**
    //  * Deposits Soul
    //  */
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
            <div className="flex justify-center w-full">
                <FarmContainer>
                    <div className="bg-dark-1200 border border-dark-900 hover:border-dark-600" onClick={() => handleShowOptions()}>
                        <FarmContentWrapper>

                            <FarmItemBox>
                                <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} />
                            </FarmItemBox>

                        <HideOnMobile>
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
                        </HideOnMobile>

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
            </div>

        {showOptions && (
            // <Wrap padding="0" display="flex" justifyContent="center">
                <div className="flex justify-center w-full mt-2 mb-2 border border-dark-900 hover:border-dark-600">
                <HeadlessUIModal.BorderedContent className="bg-dark-1200 w-full">
                    {/* <div className="relative text-lg text-center font-bold mb-4">
                    { ' ' }
                    <br />
                        <Button
                            // type="button"
                            onClick={() => setShowOptions(false)}
                            className="absolute top-0 right-0 opacity-80 hover:opacity-100 
                            focused:opacity-100 rounded p-1 text-primary hover:text-high-emphesis 
                            focus:text-high-emphesis focus:outline-none focus:ring focus:ring-offset 
                            focus:ring-offset-purple focus:ring-purple"
                        >
                            <XIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    </div> */}

                    {/* USER: NOT STAKED & NO BALANCE */}
                    
                        {/* <FunctionBox>
                        <Wrap padding="0" margin="0" display="flex">                         */}
                    {(Number(stakedBalance) == 0 && Number(unstakedBal) == 0) && (
                        <FunctionBox>
                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton
                                height="2rem"
                                primaryColour="#B485FF"
                                color="black"
                                margin=".5rem 0 .5rem 0"
                                onClick={() => setOpenSwap(true)}
                            >
                                {/* <NavLink
                                    href=
                                    {`/swap`}
                                > */}
                                    {/* <a>  */}
                                        ADD LIQUIDITY   
                                    {/* </a> */}
                                {/* </NavLink> */}
                            </SubmitButton>
                            </Wrap>
                        </FunctionBox>
                    )}
                    {!approved &&  (
                        <FunctionBox>
                            <Wrap padding="0" margin="0" display="flex">
                                <SubmitButton 
                                    height="2rem"
                                    primaryColour="#B485FF"
                                    color="black"
                                    margin=".5rem 0 .5rem 0"
                                    onClick={() => handleApprove()}>
                                    APPROVE {farm.lpSymbol}
                                </SubmitButton>
                            </Wrap>
                        </FunctionBox>
                    )}
                        
                    {approved && (
                        <FunctionBox>
                            <Wrap padding="0" margin="0" display="flex">
                                <SubmitButton
                                height="2rem"
                                primaryColour="#B485FF"
                                color="black"
                                margin=".5rem 0 .5rem 0"
                                onClick={() =>
                                    // handleDeposit(depositValue)
                                    setOpenDeposit(true)
                                }
                                >
                                    DEPOSIT
                                </SubmitButton>
                            </Wrap>
                        </FunctionBox>
                    )}
                        
                        {Number(stakedBalance) == 0 && (
                            <FunctionBox>
                            {/* <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-dark-600 w-full space-y-1"> */}
                                {/* <div className="flex justify-between">
                                    <Typography className="text-white" fontFamily={'medium'}>
                                        Deposited Amount
                                    </Typography>
                                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                        {Number(stakedBalance).toFixed(2)} LP
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography className="text-white" fontFamily={'medium'}>
                                        Deposited Amount
                                    </Typography>
                                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                        {Number(stakedBalance).toFixed(2)} LP
                                    </Typography>
                                </div> */}
                            {/* </div> */}
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColour="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            // handleDeposit(depositValue)
                                            setOpenDeposit(true)
                                            
                                        }
                                    >
                                        DEPOSIT { farm.lpSymbol }
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
                                    WITHDRAW { farm.lpSymbol }
                                </SubmitButton>
                            </Wrap>
                            <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColour="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleHarvest(pid)
                                        }
                                    >
                                        HARVEST {Number(earnedAmount).toFixed(0)} SOUL
                                    </SubmitButton>
                            </Wrap>
                            </FunctionBox>
                            )}
                </HeadlessUIModal.BorderedContent>
            </div>
        )}

{/* DEPOSIT MODAL */}
{openDeposit && (
    // <Wrap padding="0" display="flex" justifyContent="center">
        <HeadlessUIModal.BorderedContent
            // isOpen={openDeposit} 
            // onDismiss={ () => setOpenDeposit(false) }
        >
                    <div className="relative justify-right">
                        <Button
                            // type="button"
                            onClick={() => handleShowDeposit()}
                            className="inline-flex opacity-80 hover:opacity-100 focused:opacity-100 rounded p-1.5 text-primary hover:text-high-emphesis focus:text-high-emphesis focus:outline-none focus:ring focus:ring-offset focus:ring-offset-purple focus:ring-purple"
                        >
                            <ArrowLeftIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    </div>
                        <FunctionBox>
                            <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-700 hover:border-dark-600 w-full space-y-1">
                            <div className="text-xl text-center font-bold mb-3 text-dark-600">
                                Deposit { farm.lpSymbol }
                            </div>
                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    Deposited Amount
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {Number(stakedBalance).toFixed(2)} LP
                                </Typography>
                            </div>
                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    Pending Rewards
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {Number(earnedAmount).toFixed(2)} SOUL
                                </Typography>
                            </div>
                            <div className="h-px my-6 bg-dark-1000" />
                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-dark-600 w-full space-y-1">
                            <div className="text-white">
                                <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                    <span> {formatNumber(Number(apr), false, true)}% APR</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
                
                   </HeadlessUIModal.BorderedContent>
                // </Wrap>
)}

{openSwap && (
    <HeadlessUIModal.BorderedContent>
    {/* //  isOpen={true} onDismiss={() => setOpenSwap(false)}> */}
        <div className="relative justify-right">
                        <Button
                            // type="button"
                            onClick={() => handleShowSwap()}
                            className="inline-flex opacity-80 hover:opacity-100 focused:opacity-100 rounded p-1.5 text-primary hover:text-high-emphesis focus:text-high-emphesis focus:outline-none focus:ring focus:ring-offset focus:ring-offset-purple focus:ring-purple"
                        >
                            <ArrowLeftIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
        </div>
        
        <Swap />
    
    </HeadlessUIModal.BorderedContent>
    )}
        </>
    )
}