import React, { useState, useEffect, useContext, createContext, ReactNode, FC } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components'
import { BigNumber, ethers } from 'ethers'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
// import QuestionHelper from '../../components/QuestionHelper'
import { Percent, Token } from 'sdk'
import { useRouterContract, useSoulSummonerContract } from 'hooks/useContract'
import useApprove from 'features/bond/hooks/useApprove'

import { FarmContentWrapper,
    FarmContainer, FarmItem, FarmItemBox, Text, FunctionBox, SubmitButton, Wrap
} from './Styles'
import { calculateGasMargin, calculateSlippageAmount, classNames, formatNumber, tryParseAmount } from 'functions'
import { usePairInfo, useSummonerPoolInfo, useSummonerUserInfo, useUserPairInfo } from 'hooks/useAPI'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
// import Modal from 'components/DefaultModal'
import { ArrowLeftIcon, PlusIcon, XIcon } from '@heroicons/react/solid'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import Modal from 'components/Modal/DefaultModal'
import ModalHeader from 'components/Modal/Header'

import { useExpertModeManager, useUserSlippageToleranceWithDefault } from 'state/user/hooks'
// import ExternalLink from 'components/ExternalLink'
import NavLink from 'components/NavLink'
// import StableInputPanel from 'components/StableInputPanel'
// import CurrencyInputPanel from './Input'
import FarmInputPanel from './Input'
import { CurrencyLogo } from 'components/CurrencyLogo'

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
    const { account, chainId, library } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)
    const soulPrice = useSoulPrice()
    const [depositing, setDepositing] = useState(false)
    const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

    const [approved, setApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('0')
    const [depositValue, setDepositValue] = useState('0')
    
    const SoulSummonerContract = useSoulSummonerContract()
    const SoulSummonerAddress = SoulSummonerContract.address

    const { summonerPoolInfo } = useSummonerPoolInfo(pid)
    const liquidity = summonerPoolInfo.tvl
    const apr = summonerPoolInfo.apr
    const allocPoint = summonerPoolInfo.allocPoint
    const lpAddress = summonerPoolInfo.lpAddress
    
    const { pairUserInfo } = useUserPairInfo(lpAddress)
    const { pairInfo } = usePairInfo(lpAddress)
    // const lpSymbol = pairInfo.lpSymbol
    const assetAddress = pairInfo.address
    // console.log(assetAddress)
    const assetDecimals = pairInfo.pairDecimals
    const unstakedBalance 
    = Number(pairUserInfo.userBalance) 
    / 10**Number(assetDecimals)
    // const assetSymbol = pairInfo.symbol
    
    const token0Symbol = pairInfo.token0Symbol
    const token1Symbol = pairInfo.token1Symbol
    
    const token0Address = pairInfo.token0Address
    const token1Address = pairInfo.token1Address

    const [showOptions, setShowOptions] = useState(false)
    const [openDeposit, setOpenDeposit] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [openWithdraw, setOpenWithdraw] = useState(false)
    
    const { summonerUserInfo } = useSummonerUserInfo(pid)
    const stakedBalance = summonerUserInfo.stakedBalance
    const stakedValue = summonerUserInfo.stakedValue
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue
    const lpPrice = summonerUserInfo.lpPrice
    const pairType = summonerUserInfo.pairType
    // const timeDelta = summonerUserInfo.timeDelta
    // const secondsRemaining = summonerUserInfo.secondsRemaining
    const withdrawFee = summonerUserInfo.currentRate
    const feeAmount = Number(withdrawFee) * Number(stakedBalance) / 100
    const withdrawable = Number(stakedBalance) - feeAmount
    const feeValue = feeAmount * Number(lpPrice)

    const hasBalance = Number(unstakedBalance) > 0
    const isFarmer = Number(stakedBalance) > 0
    const isUnderworldPair = Number(allocPoint) == 420

    // ONLY USED FOR LOGO //
    const token0 = new Token(chainId, farm.token1Address[chainId], 18)
    const token1 = new Token(chainId, farm.token2Address[chainId], 18)
    // const pair = new Token(chainId, farm.lpToken.address, 18)
    // console.log('lpAddress:%s', lpAddress)

    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
        fetchApproval()
    }, [account])

    /**
     * Runs on initial render/mount and reruns
     */
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                // if (showing) {
                    fetchApproval()
                // }
            }, 10000)
            // Clear timeout if the component is unmounted
            return () => clearTimeout(timer)
        }
    })

    /**
     * Opens the function panel dropdowns.
     */
    const handleShowOptions = () => {
        setShowOptions(!showOptions)
        if (showOptions) {
            fetchApproval()
            setOpenDeposit(false)
            setOpenWithdraw(false)
        }
    }

    const handleShowDeposit = () => {
        setOpenDeposit(!openDeposit)
        if (openDeposit) {
            fetchApproval()
        }
    }
   
    const handleShowWithdraw = () => {
        setOpenWithdraw(!openWithdraw)
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

    /**
     * Withdraw Liquidity Asset
     */
    const handleWithdraw = async (pid) => {
        try {
            const tx = await SoulSummonerContract?.withdraw(pid, (Number(withdrawValue) * 10**Number(assetDecimals)).toString())
            // await tx?.wait().then(await setPending(pid))
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    /**
     * Harvest Pending Rewards
     */
    const handleHarvest = async (pid) => {
        try {
            let tx
            tx = await SoulSummonerContract?.deposit(pid, 0)
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    // /**
    //  * Deposits Soul
    //  */
    const handleDeposit = async (pid) => {
        try {
            const tx = await SoulSummonerContract?.deposit(pid, (Number(depositValue) * 10**Number(assetDecimals)).toString())
            await tx.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    return (
        <>
            <div className="flex justify-center w-full">
                <FarmContainer>
                    <div className={classNames("bg-dark-1200 p-3 border", hasBalance ? " hover:border-dark-600 border-dark-600" : "hover:border-dark-600 border-dark-1000")}
                    onClick={() => handleShowOptions()}>
                        <FarmContentWrapper>
                            <div className="items-center">
                                <FarmItemBox>
                                    { Number(allocPoint) != 420 ? <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} />
                                    : <CurrencyLogo currency={token0} 
                                    size = {40} />
                                    }
                                </FarmItemBox>
                            </div>
                        {/* <HideOnMobile>
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
                        </HideOnMobile> */}

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
                                        ${Number(stakedValue) == 0 ? '0' 
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

                            {/* <FarmItemBox className="flex">
                                {Number(earnedValue).toFixed(0).toString() === '0' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        ${Number(earnedValue).toFixed(0)}
                                    </Text>
                                )}
                            </FarmItemBox> */}

                            <FarmItemBox className="flex">
                                {Number(earnedAmount).toFixed(0).toString() === '0' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        {Number(earnedAmount).toFixed(0)}
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
                <div className="flex justify-center p-4 w-full mt-2 mb-2 border border-dark-1000 hover:border-dark-600">
                <HeadlessUIModal.BorderedContent className="bg-dark-1200 w-full">
                {/* USER: NOT STAKED & NOT FARMER */}
                    {!hasBalance && !isFarmer && !isUnderworldPair && (
                        <FunctionBox>
                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton
                                height="2rem"
                                primaryColor="#B485FF"
                                color="black"
                                margin=".5rem 0 .5rem 0"
                                // onClick={() => setOpenSwap(true)}
                            >
                            {(farm?.token1 == 'FTM' || farm?.token2 == 'FTM') ? (
                          <NavLink
                            href=
                            {farm.token1 == 'FTM' ?
                              `/exchange/add/FTM/${token1Address}`
                              : `/exchange/add/FTM/${token0Address}`
                            }
                          >
                            <a>PAIR {farm.lpSymbol}</a>
                          </NavLink>
                        ) : (
                          <NavLink
                            href=
                            {`/add/${farm.token1}/${farm.token2}`}
                          >
                            <a>PAIR {farm.lpSymbol}</a>
                          </NavLink>
                        )}
                      
                            </SubmitButton>
                        
                            </Wrap>
                        </FunctionBox>
                    )}

                    {/* UN-APPROVED */}
                    {!approved &&  (
                        <FunctionBox>
                            <Wrap padding="0" margin="0" display="flex">
                                <SubmitButton 
                                    height="2rem"
                                    primaryColor="#B485FF"
                                    color="black"
                                    margin=".5rem 0 .5rem 0"
                                    onClick={() => handleApprove()}>
                                    APPROVE {farm.lpSymbol}
                                </SubmitButton>
                            </Wrap>
                        </FunctionBox>
                    )}

                    {/* FARMER WITH APPROVAL */}  
                        {approved && isFarmer && (
                            <FunctionBox>
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            openDeposit 
                                                ? setOpenDeposit(false)
                                                : setOpenDeposit(true) 
                                        }
                                    >
                                        DEPOSIT { farm.lpSymbol }
                                    </SubmitButton>
                                </Wrap>
                                <FunctionBox>

                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton
                            height="2rem"
                            primaryColor="#B485FF"
                            color="black"
                            margin=".5rem 0 .5rem 0"
                            onClick={() =>
                                openWithdraw
                                    ? setOpenWithdraw(false)
                                    : setOpenWithdraw(true) 
                            }>
                                    WITHDRAW { farm.lpSymbol }
                                </SubmitButton>
                            </Wrap>
                        </FunctionBox>

                            <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleHarvest(pid)
                                        }
                                    >
                                        HARVEST SOUL
                                    </SubmitButton>
                            </Wrap>
                            </FunctionBox>
                            )}
                </HeadlessUIModal.BorderedContent>
            </div>
        )}

{/* DEPOSIT MODAL */}
{openDeposit && !openWithdraw && (
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
                            <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-1000 hover:border-dark-600 w-full space-y-1">
                            <div className="text-xl text-center font-bold mb-3 text-dark-600">
                                {
                                    Number(allocPoint) != 420
                                    ? `Deposit ${ farm.lpSymbol }`
                                    : `Deposit Supplied ${ token0Symbol }`
                                }
                            </div>
                            {/* <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    Staked (Amount)
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(stakedBalance, false, true)} {farm.lpSymbol}{' '}
                                   
                                </Typography>
                            </div>
                            
                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    Staked (USD)
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                   {formatNumber(stakedValue, true)}
                                </Typography>
                            </div> */}

                            { Number(unstakedBalance) > 0 &&
                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    Balance
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(unstakedBalance, false)} {farm.lpSymbol}
                                </Typography>
                            </div>
                            }

                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    Rewards
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

            {/* DEPOSIT: ASSET PANEL */}
                    <FarmInputPanel
                            pid={farm.pid}
                            onMax={setDepositValue}
                            value={depositValue}
                            balance={unstakedBalance.toString()}
                            onUserInput={setDepositValue}
                            id={pid}
                            // pairSymbol={farm.lpSymbol}
                            token0={token0} 
                            token1={token1} 
                        />
            {/* FARMER WITH NO BALANCE */}
                {!hasBalance && isFarmer && !isUnderworldPair && (
                        <FunctionBox>
                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton
                                height="2rem"
                                primaryColor="#B485FF"
                                color="black"
                                margin=".5rem 0 .5rem 0"
                                // onClick={() => setOpenSwap(true)}
                            >
                            {(token0Symbol == 'WFTM' || token1Symbol == 'WFTM') ? (
                          <NavLink
                            href=
                            {token0Symbol == 'WFTM' ?
                              `/add/FTM/${token1Address}`
                              : `/add/FTM/${token0Address}`
                            }
                          >
                            <a>PAIR {farm.lpSymbol}</a>
                          </NavLink>
                        ) : (
                          <NavLink
                            href=
                            {`/add/${token0Address}/${token1Address}`}
                          >
                            <a>PAIR {farm.lpSymbol}</a>
                          </NavLink>
                        )}
                      
                            </SubmitButton>
                        
                            </Wrap>
                        </FunctionBox>
                    )}

                    { isUnderworldPair && (
                        <SubmitButton
                            height="2rem"
                            primaryColor="#B485FF"
                            color="black"
                            margin=".5rem 0 .5rem 0"
                        >
                             <NavLink
                            href=
                            {`/lend/${lpAddress}`}
                          >
                            <a>LEND {token0Symbol}</a>
                          </NavLink>
                            </SubmitButton>
                    )}
                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton
                                height="2rem"
                                primaryColor="#B485FF"
                                color="black"
                                margin=".5rem 0 .5rem 0"
                                onClick={() =>
                                    handleDeposit(pid)
                                }
                            >
                                DEPOSIT {farm.lpSymbol}
                            </SubmitButton>
                        </Wrap>
                    </FunctionBox>
                
                   </HeadlessUIModal.BorderedContent>
                // </Wrap>
)}

{/* WITHDRAW MODAL */}
{openWithdraw && (
        <HeadlessUIModal.BorderedContent>
                    <div className="relative justify-right">
                        <Button
                            onClick={() => handleShowWithdraw()}
                            className="inline-flex opacity-80 hover:opacity-100 focused:opacity-100 rounded p-1.5 text-primary hover:text-high-emphesis focus:text-high-emphesis focus:outline-none focus:ring focus:ring-offset focus:ring-offset-purple focus:ring-purple"
                        >
                            <ArrowLeftIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    </div>
                        <FunctionBox>
                    
                            <div className="flex flex-col bg-dark-1000 p-3 border border-1 border-dark-1000 hover:border-dark-600 w-full space-y-1">
                            <div className="text-xl text-center font-bold mb-3 text-dark-600">
                                Withdraw { farm.lpSymbol }
                            </div>
                            <div className="flex justify-between">
                            <Typography className="text-white font-bold" fontFamily={'medium'}>
                                    Staked Balance
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(stakedBalance, false, true)} {farm.lpSymbol}
                                </Typography>
                            </div>
                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    {/* Staked (USD) */}
                                </Typography>
                                <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                   {formatNumber(stakedValue, true)}
                                </Typography>
                            </div>

                            <div className = "p-0.5 space-y-4 bg-dark-800"/>

                            <div className="flex justify-between">
                                <Typography className="text-white font-bold" fontFamily={'medium'}>
                                    Maximum Fee
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(Number(stakedBalance) - withdrawable, false, true)} {farm.lpSymbol}
                                </Typography>
                            </div>

                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    {/* Withdrawable (USD) */}
                                </Typography>
                                <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(Number(stakedValue) - (withdrawable * Number(lpPrice)), true, true)}
                                </Typography>
                            </div>
                            
                            <div className = "p-0.5 space-y-4 bg-dark-800"/>

                            {/* <div className="flex justify-between">
                            <Typography className="text-white font-bold" fontFamily={'medium'}>
                                    Withdrawable
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(withdrawable, false, true)} {farm.lpSymbol}
                                </Typography>
                            </div>

                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    // Withdrawable (USD)
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(withdrawable * Number(lpPrice), true, true)}
                                </Typography>
                            </div> 

                            <div className = "p-0.5 space-y-4 mx-[46%] bg-dark-600"/> */}

                            <div className="flex justify-between">
                            <Typography className="text-white font-bold" fontFamily={'medium'}>
                                    Claimable Rewards
                                </Typography>
                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                    {Number(earnedAmount).toFixed(2)} SOUL
                                </Typography>
                            </div>

                            <div className="flex justify-between">
                                <Typography className="text-white" fontFamily={'medium'}>
                                    {/* Pending Rewards */}
                                </Typography>
                                <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                    {formatNumber(earnedValue, true, true)}
                                </Typography>
                            </div>
                            {/* <div className="h-px my-6 bg-dark-1000" /> */}
                        
                        {/* FEE BOX (COLOR-CODED) */}
                        {Number(withdrawFee) > 0 && (
                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-red border-1 hover:border-dark-600 w-full space-y-1">
                            <div className="text-white">
                                <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                    <span> 
                                        {(Number(withdrawFee)).toFixed(2)}% FEE
                                    </span>
                                </div>
                            </div>
                        </div>
                        )}

                        {Number(withdrawFee) == 0 && (
                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-dark-600 w-full space-y-1">
                            <div className="text-white">
                                <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                    <span> 
                                        {(Number(withdrawFee)).toFixed(0)}% FEE
                                    </span>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                {/* WITHDRAW: ASSET PANEL */}
                    <FarmInputPanel
                            pid={farm.pid}
                            onMax={setWithdrawValue}
                            value={withdrawValue}
                            balance={stakedBalance.toString()}
                            onUserInput={setWithdrawValue}
                            id={pid}
                            // pairSymbol={farm.lpSymbol}
                            token0={token0}
                            token1={token1} 
                    />
                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton
                                height="2rem"
                                primaryColor="#B485FF"
                                color="black"
                                margin=".5rem 0 .5rem 0"
                                onClick={() =>
                                    // handleWithdraw(pid)
                                    setShowConfirmation(true)
                                }
                            >
                                WITHDRAW { farm.lpSymbol }
                            </SubmitButton>
                        </Wrap>
                    
                    </FunctionBox>
                </HeadlessUIModal.BorderedContent>
)}

{ showConfirmation && (
<Modal isOpen={showConfirmation} onDismiss={
        () => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`FYI: Early Withdrawal Fee`} onClose={() => setShowConfirmation(false)} />
          <Typography variant="sm">
            Since the community proposal passed, a 14-Day Early Withdrawal Fee is now live: <b><a href="https://enchant.soulswap.finance/#/proposal/0xb2ede0a82c5efc57f9c097f11db653fb1155cd313dfedd6c87142a42f68465a6">details here</a></b>.
            {/* <br/><br/>This means you may withdraw for 0% fees after 14 Days have elapsed.  */}
            <br/><br/>This <b>reduces by 1% daily</b>, so consider waiting 14 Days prior to withdrawing to avoid fees.

            <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-dark-600">
                Estimated Fee Outcomes
            </div>
            • <b>Current Rate</b>: {Number(withdrawFee).toFixed(2)}% <br/>
            • <b>Fee Amount</b>: {formatNumber(Number(withdrawFee)*Number(withdrawValue) / 100, false, true)} {farm.lpSymbol}<br/>
            • <b>Fee Value</b>: {formatNumber(Number(withdrawFee)*Number(withdrawValue) * Number(lpPrice) / 100, true, true)}

            <div className="mt-6 text-center">
            <i><b>Please do not rely on our estimations</b></i>.
            </div>

            {/* <b>100% of the fee</b> goes towards building our protocol-owned liquidity, which brings about long-term sustainability to our platform. */}
          </Typography>
          <Typography variant="sm" className="font-medium text-center">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <Button
            height="2.5rem"
            color="purple"
            onClick={() =>
                handleWithdraw(pid) 
            }
          >
            I UNDERSTAND THESE TERMS
          </Button>
        </div>
      </Modal>
    )}
</>
)}