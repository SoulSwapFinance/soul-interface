import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'services/web3'
import { ChainId, NATIVE, ROUTER_ADDRESS, SOUL_ADDRESS, SUMMONER_ADDRESS, Token, WNATIVE } from 'sdk'
import { useTokenContract, useSummonerContract, useZapperContract } from 'hooks/useContract'
import useApprove from 'hooks/useApprove'
import { Tab } from '@headlessui/react'
import {
    FarmItemBox, Text, SubmitButton, Wrap
} from './Styles'
import { classNames, formatNumber, tryParseAmount } from 'functions'
import { usePairInfo, useSummonerPoolInfo, useSummonerUserInfo, useTokenInfo, useUserTokenInfo } from 'hooks/useAPI'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import NavLink from 'components/NavLink'
import FarmInputPanel from './Input'
import QuestionHelper from 'components/QuestionHelper'
import AssetInput from 'components/AssetInput'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { getChainColor } from 'constants/chains'
import { ExternalLink } from 'components/ReusableStyles'
import { CircleStackIcon, CurrencyDollarIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useCurrencyBalance } from 'state/wallet/hooks'
import DoubleCurrencyLogo from 'components/DoubleLogo'


const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

export const ActiveRow = ({ pid, farm, pairType, lpToken, decimals, token0Symbol, token1Symbol, token0Address, token1Address }) => {
    const { account, chainId } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

    const [approved, setApproved] = useState(false)
    const [approvedZap, setZapApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('0')
    const [depositValue, setDepositValue] = useState('0')
    const [zapValue, setZapValue] = useState('0')
    const [zapTokenAddress, setZapTokenAddress] = useState(SOUL_ADDRESS[chainId ?? ChainId.FANTOM])

    const SoulSummonerContract = useSummonerContract()
    const ZapContract = useZapperContract()
    const ZapContractAddress = ZapContract.address

    // const nowTime = new Date().getTime()
    // const startRate = Number(summonerInfo.startRate)

    // const APR = Number(summonerPoolInfo.apr)
    // const liquidity = summonerPoolInfo.tvl

    const { summonerPoolInfo } = useSummonerPoolInfo(pid)
    // pair types //
    const isUnderworldPair = pairType == "lend"
    const isSwapPair = pairType == "swap"

    // for display purposes only //
    const _liquidity = Number(summonerPoolInfo.tvl)
    // for display purposes only //
    const _APR = Number(summonerPoolInfo.apr)

    const allocPoint = summonerPoolInfo.allocPoint
    const lpAddress = summonerPoolInfo.lpAddress
    // const pairStatus = summonerPoolInfo.status

    // const { userInfo } = useUserInfo()
    const { pairInfo } = usePairInfo(lpAddress)
    // assumes 18, since only SOUL-LP farms are eligible for Zap   
    const token0Decimals = Number(pairInfo.token0Decimals)
    const token1Decimals = Number(pairInfo.token1Decimals)
    const assetDecimals = decimals

    const [showOptions, setShowOptions] = useState(false)
    const [openDeposit, setOpenDeposit] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [openWithdraw, setOpenWithdraw] = useState(false)
    const [openZap, setOpenZap] = useState(false)

    // SUMMONER USER INFO //
    const { summonerUserInfo } = useSummonerUserInfo(pid)
    // const stakedBalance = Number(summonerUserInfo.stakedBalance)

    // for display purposes only //
    const _stakedBalance = Number(summonerUserInfo.stakedBalance)
    const _stakedValue = Number(summonerUserInfo.stakedValue)

    const earnedAmount = Number(summonerUserInfo.pendingSoul)
    const earnedValue = Number(summonerUserInfo.pendingValue)
    const lpPrice = Number(summonerUserInfo.lpPrice)
    const withdrawFee = Number(summonerUserInfo.currentRate)
    const walletBalance = Number(summonerUserInfo.walletBalance)

    // const feeAmount = withdrawFee * stakedBalance / 100
    // const withdrawable = stakedBalance - feeAmount
    // const feeValue = feeAmount * lpPrice

    // for display purposes only //
    const _feeAmount = withdrawFee * _stakedBalance / 100
    // for display purposes only //
    const _withdrawable = _stakedBalance - _feeAmount
    // for display purposes only //
    const _feeValue = _feeAmount * lpPrice
    // for display purposes only //
    const _withdrawValue = Number(withdrawValue)

    const hasBalance = Number(walletBalance) > 0
    const isActive = Number(allocPoint) > 0 // pairStatus == "active"
    const assetToken = new Token(chainId, farm.lpAddress, 18)

    const balance = useCurrencyBalance(chainId, account ?? undefined, assetToken)

    const parsedDepositValue = tryParseAmount(depositValue, assetToken)
    // const parsedWithdrawValue = tryParseAmount(withdrawValue, assetToken)

    // COLOR //
    const buttonColor = getChainColor(chainId)
    const buttonTextColor = isSwapPair && isActive ? "white" : "white"
    const textColor = isUnderworldPair ? "text-blue" : !isActive ? "text-pink" : "text-purple"
    // const tokenSymbol = isUnderworldPair ? token0Symbol : "LP"

    // (de)Constructs Tokens //
    const token0 = new Token(chainId, token0Address, token0Decimals)
    const token1 = new Token(chainId, token1Address, token1Decimals)

    const nativeToken0 = farm.token0Symbol == WNATIVE[chainId ?? ChainId.FANTOM].symbol

    // ZAP ADD-ONS //
    const tokenContract = useTokenContract(zapTokenAddress)
    const zapTokenDecimals = Number(useTokenInfo(zapTokenAddress).tokenInfo.decimals)
    const zapTokenSymbol = useTokenInfo(zapTokenAddress).tokenInfo.symbol
    const zapTokenName = useTokenInfo(zapTokenAddress).tokenInfo.name
    const zapToken = new Token(chainId, zapTokenAddress, zapTokenDecimals, zapTokenSymbol, zapTokenName)
    const maxUint = ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1))

    // USER INFO //
    const { userTokenInfo } = useUserTokenInfo(account, zapTokenAddress)
    const selectedTokenDecimals = zapTokenDecimals ? zapTokenDecimals : 18
    const selectedTokenBalance = Number(userTokenInfo.balance) / selectedTokenDecimals // TODO: try erc20BalanceOf(zapTokenAddress)
    const zapTokenBalance = tryParseAmount(selectedTokenBalance.toString(), zapToken)
    const [modalOpen, setModalOpen] = useState(true)

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])
    // runs only on initial render/mount
    useEffect(() => {
        fetchApproval()
    }, [account])

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

    const handleShowZap = (pid) => {
        setOpenZap(!openZap)
    }

    const handleShowConfirmation = (show) => {
        setShowConfirmation(show)
    }

    // const handleMaxDeposit = (pid) => {
    //     const token = new Token(chainId, farm.lpAddress, 18)
    //     const tokenBalance = useCurrencyBalance(chainId, account, token)
    //     setDepositValue(tokenBalance.toString())
    // }

    // checks: approval for summoner to move tokens.
    const fetchApproval = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            // Checks if SoulSummonerContract can move tokens
            const amount = await erc20Allowance(account, SUMMONER_ADDRESS[chainId ?? ChainId.FANTOM])
            if (amount > 0) setApproved(true)
            return amount
        }
    }

    // checks: user's approval for ZapContractAddress to move tokens.
    const fetchZapApproval = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            // Checks if ZapContract can move tokens
            // const amount = await erc20Allowance(account, ZapContractAddress)
            const amount = tokenContract?.allowance(account, ZapContractAddress)
            if (amount > 0) setZapApproved(true)
            return amount
        }
    }

    // enables: summoner tranfers approval.
    const handleApprove = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(SUMMONER_ADDRESS[chainId ?? ChainId.FANTOM])
                await tx?.wait().then(await fetchApproval())
            } catch (e) {
                // alert(e.message)
                console.log(e)
                return
            }
        }
    }

    // approves ZapContractAddress to move selectedToken
    const handleZapApprove = async (tokenContract) => {
        try {
            let tx
            tx = tokenContract?.approve(ZapContractAddress, maxUint)
            await tx?.wait().then(await fetchZapApproval())
        } catch (e) {
            console.log(e)
            return
        }
    }

    // withdraws: lp from summoner
    // const handleWithdraw = async (pid) => {
    //     try {
    //         const tx = await SoulSummonerContract?.withdraw(pid, Number(withdrawValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
    //         await tx?.wait()
    //     } catch (e) {
    //         // alert(e.message)
    //         const tx = await SoulSummonerContract?.withdraw(pid, Number(withdrawValue).toFixed(6).toBigNumber(assetDecimals))
    //         console.log(e)
    //     }
    // }

    // handles: harvest for given pid
    const handleHarvest = async (pid) => {
        try {
            let tx
            tx = await SoulSummonerContract?.deposit(pid, 0)
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }

    // // deposits: selected amount into the summoner
    const handleDeposit = async (pid, amount) => {
        let tx
        try {
            tx = await SoulSummonerContract?.deposit(pid, parsedDepositValue?.quotient.toString())
            // tx = await SoulSummonerContract?.deposit(pid, (Number(depositValue)).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx.wait()
        } catch (e) {
            const smallerValue = Number(depositValue) - 0.000001
            tx = await SoulSummonerContract?.deposit(pid, (Number(smallerValue)).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx.wait()
            console.log(e)
        }
    }

    // handles deposit
    // const handleDeposit = async (pid, amount) => {
    //     try {
    //         const tx = await SoulSummonerContract?.deposit(pid,
    //             parsedDepositValue?.quotient.toString()
    //         )
    //         await tx.wait()
    //         // console.log('depositing: %s:', parsedDepositValue)
    //     } catch (e) {
    //         const smallerValue = Number(depositValue) - 0.000001
    //         let tx = await SoulSummonerContract?.deposit(pid, Number(smallerValue))
    //             // Number(depositValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
    //         // console.log('depositing: %s:', depositValue)
    //         await tx.wait()
    //         // alert(e.message)
    //         console.log(e)
    //     }
    // }

    // // withdraws: selected amount into the summoner
    const handleWithdraw = async (pid, amount) => {
        let tx
        try {
            // tx = await SoulSummonerContract?.withdraw(pid, parsedWithdrawValue?.quotient.toString())
            tx = await SoulSummonerContract?.withdraw(pid, (Number(withdrawValue)).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx.wait()
        } catch (e) {
            const smallerValue = Number(withdrawValue) - 0.000001
            tx = await SoulSummonerContract?.withdraw(pid, (Number(smallerValue)).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx.wait()
            console.log(e)
        }
    }

    // HANDLE ZAP //
    const handleZap = async (zapTokenAddress, lpAddress) => {
        try {
            let tx
            tx = await ZapContract?.zapInToken(zapTokenAddress, Number(zapValue).toFixed(zapTokenDecimals).toBigNumber(zapTokenDecimals), lpAddress, ROUTER_ADDRESS[chainId ?? ChainId.FANTOM], account)
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 justify-center w-full">
                <div className={classNames("bg-dark-900 p-3 m-1 border rounded-2xl", !hasBalance && "border-dark-1000",
                    !isActive ? "hover:border-red"
                        : hasBalance && isActive ? "border-purple animate-pulse"
                            : hasBalance && !isActive ? "hover:border-red border-red"
                                : "hover:border-purple"
                )}
                    onClick={() => handleShowOptions()}
                >
                    <div className={`grid grid-cols-3 w-full`}>
                        <div className="grid span-cols-1 mr-8 justify-center">
                            <div className={`grid grid-cols-1`}>
                                <DoubleCurrencyLogo currency0={token0} currency1={token1} size={42} />
                                {/* <CurrencyLogo currency={token0} size={40} />
                                    <CurrencyLogo currency={token1} size={40} /> */}
                            </div>
                        </div>

                        {/* STAKED VALUE */}
                        {/* <HideOnMobile>
                                <FarmItemBox>
                                    <div className={`justify-center mt-2`}>
                                        {Number(_APR).toString() === '0.00' ? (
                                            <Text padding="0" fontSize="1rem" color="#666">
                                                0
                                            </Text>
                                        ) : (
                                            <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                                ${
                                                    _stakedValue == 0 ? 0
                                                        : _stakedValue.toString(2) == '0.00' ? '<0.00'
                                                            : _stakedValue < 1 && _stakedValue.toString(4) ? _stakedValue.toFixed(4)
                                                                : _stakedValue > 0 ? _stakedValue.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                                    : 0
                                                }
                                            </Text>
                                        )}
                                    </div>
                                </FarmItemBox>
                            </HideOnMobile> */}

                        {/* STAKED OWNERSHIP */}
                        {/* <HideOnSmall>
                                <FarmItemBox>
                                    <div className={`justify-center mt-2`}>
                                        {_stakedValue.toFixed(0).toString() === '0' ? (
                                            <Text padding="0" fontSize="1rem" color="#666">
                                                0%
                                            </Text>
                                        ) : (
                                            <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                                {(_stakedValue / Number(_liquidity) * 100).toFixed(0)}%
                                            </Text>
                                        )}
                                    </div>
                                </FarmItemBox>
                            </HideOnSmall> */}



                        {/* REWARDS VALUE */}
                        {/* <FarmItemBox className="flex">
                                {earnedValue.toFixed(0).toString() === '0' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        ${earnedValue.toFixed(0)}
                                    </Text>
                                )}
                            </FarmItemBox> */}

                        <FarmItemBox className="grid grid-cols-1 ml-8 sm:ml-21">
                            {earnedAmount.toFixed(0).toString() === '0' ? (
                                <Text padding="0" fontSize="1rem" color="#666">
                                    0
                                </Text>
                            ) : (
                                <Text padding="0" fontSize="1rem" color="#B383FF">
                                    {Number(earnedAmount)
                                        .toFixed(0)
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' SOUL'}
                                </Text>
                            )}
                        </FarmItemBox>
                        {/* <FarmItemBox className="flex">
                            <div className={`grid grid-cols-1 justify-center -mr-8 sm:ml-12`}>
                                {Number(_liquidity) === 0 ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        $0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem">
                                        ${Number(_liquidity)
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                    </Text>
                                )}
                            </div>
                        </FarmItemBox> */}
                        {/* % APR */}
                        <FarmItemBox>
                            <div className={`grid grid-cols-1 justify-center ml-32 sm:ml-48 mr-12 mt-1`}>
                                {Number(_APR).toString() === '0.00' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color={Number(_APR) > 0 ? '#4EFF4E' : 'white'}>
                                        {Number(_APR).toFixed()}%
                                    </Text>
                                )}
                            </div>
                        </FarmItemBox>

                    </div>
                </div>
            </div>


            {/*------ DROPDOWN OPTIONS PANEL ------*/}
            {showOptions && !showConfirmation && !openZap && (
                <HeadlessUIModal.Controlled
                    // isCustom={true}
                    chainId={chainId}
                    isOpen={showOptions}
                    onDismiss={() => handleShowOptions()}
                // borderColor={
                //     isUnderworldPair ? 'border-dark-900 hover:border-blue'
                //         : !isActive ? 'border-dark-900 hover:border-red' : 'border-dark-900 hover:border-dark-420'
                // }
                // className={classNames("border",
                //     isActive && isSwapPair ? "hover:border-purple"
                //         : isUnderworldPair ? "hover:border-blue"
                //             : "hover:border-red",
                //     "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >
                    <div className="p-3 space-y-6 bg-dark-900 rounded z-1 relative">
                        <Tab.Group>
                            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
                                <div className="grid grid-cols-2 w-[95%] p-2px bg-dark-900 rounded-2xl">
                                    <Tab
                                        className={({ selected }) =>
                                            `${selected && isActive ? 'border-b-2 border-accent p-2 text-white border-purple rounded-2xl'
                                                : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-red rounded-2xl'
                                                    : 'bg-dark-900 text-white'
                                            }
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border-dark-800 border-2 rounded-2xl
                                        ${!isActive ? "hover:border-red"
                                                : "hover:border-purple"
                                            }`
                                        }
                                    >
                                        {`DEPOSIT`}
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            `${selected && isActive ? 'border-b-2 border-accent p-2 text-white border-purple rounded-2xl'
                                                : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-red rounded-2xl'
                                                    : 'bg-dark-900 text-white rounded-2xl'
                                            } 
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border-dark-800 border-2 border-rounded-2xl
                                                ${!isActive ? "hover:border-red animate-bounce"
                                                : "hover:border-purple"
                                            }`
                                        }
                                    >
                                        {`WITHDRAW`}
                                    </Tab>
                                </div>
                            </Tab.List>

                            {/*------ DEPOSIT TAB PANEL ------*/}
                            <Tab.Panel className={'outline-none'}>

                                <Button variant={'link'} className="absolute top-0 right-0 flex justify-center max-h-[30px] max-w-[30px]">
                                    <QuestionHelper
                                        text={
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex flex-col">
                                                    {withdrawFee == 0 ? (
                                                        <p>
                                                            {`After creating liquidity, navigate to the associated farm to deposit.`}
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            {`After creating liquidity, navigate to the associated farm to deposit.`}
                                                            <br /> <br />
                                                            {`The fee decreases by 1% each day and is NOT affected by depositing more.`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                    />
                                </Button>

                                <div className=
                                    {classNames(
                                        "flex flex-col bg-dark-1000 mb-3 p-3 border-2 border-dark-1000",
                                        !isActive ? "hover:border-red"
                                            : "hover:border-purple",

                                        "w-full space-y-1")

                                    }>

                                    {Number(_stakedBalance) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {`Staked Balance`}
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(_stakedBalance, false, true)} {farm?.lpSymbol}
                                            </Typography>
                                        </div>
                                    )}

                                    {_stakedValue > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {`Staked (USD)`}
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(_stakedValue, true, true)}
                                            </Typography>
                                        </div>
                                    )}

                                    {/* {Number(walletBalance) > 0 && (
                                        <div className="h-px my-6 bg-dark-1000" />
                                    )} */}

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            {`Claimable Rewards`}
                                        </Typography>
                                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(earnedAmount)} SOUL
                                        </Typography>
                                    </div>
                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            {`Rewards (USD)`}
                                        </Typography>
                                        <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(earnedValue, true, true)}
                                        </Typography>
                                    </div>

                                    <div className="h-px my-1 bg-dark-1000" />

                                    {/* WITHDRAWAL FREE */}
                                    {Number(withdrawFee) > 0 && (
                                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border-1 hover:border-purple w-full space-y-1">
                                            <div className="text-white">
                                                <div className="block text-sm md:text-md text-white text-center font-bold p-1 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                                    <span>
                                                        {`Fee Duration: ${Number(withdrawFee).toFixed(0)} days`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="h-px my-6 bg-dark-1000" />
                                    <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-purple w-full space-y-1">
                                        <div className="text-white">
                                            <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                                <span> {formatNumber(Number(_APR), false, true)}% APR</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px my-1 bg-dark-1000" />

                                {/* DEPOSIT: ASSET PANEL */}

                                {hasBalance && isActive &&
                                    <FarmInputPanel
                                        pid={farm.pid}
                                        onUserInput={(value) => setDepositValue(value)}
                                        onMax={() => setDepositValue(balance.toExact())}
                                        value={depositValue}
                                        balance={balance.toExact()}
                                        id={pid}
                                    />
                                }
                                {/* UN-APPROVED // HAS BALANCE */}
                                {/* {!approved && ( */}
                                {hasBalance && isActive && (
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor={buttonColor}
                                        color={buttonTextColor}
                                        margin=".5rem 0 0rem 0"
                                        onClick={() => handleApprove()}>
                                        <div className="flex text-lg gap-2">
                                            {`APPROVE ASSET`}
                                        </div>
                                    </SubmitButton>
                                )}
                                {/* APPROVED */}
                                {/* {approved && hasBalance && isActive && ( */}
                                {/* {hasBalance && isActive && ( */}
                                <SubmitButton
                                    height="2rem"
                                    primaryColor={buttonColor}
                                    color={buttonTextColor}
                                    margin=".5rem 0 0rem 0"
                                    onClick={() =>
                                        handleDeposit(pid, Number(depositValue))
                                    }
                                >
                                    <div className="flex text-lg gap-2">
                                        <CurrencyDollarIcon width={26} className={classNames(`text-white`)} />
                                        {`DEPOSIT ${farm.lpSymbol}`
                                        }
                                    </div>
                                </SubmitButton>
                                {/* )} */}
                                {/* CREATE ASSET PAIR */}
                                {(nativeToken0 && isActive) ? (
                                    <NavLink
                                        href={`/exchange/add/${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${farm.token1Address}`}
                                    >
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            margin=".5rem 0 0rem 0"
                                        >
                                            <TokenPairLink
                                                target="_blank"
                                                rel="noopener"
                                                primaryColor={buttonColor}
                                                color={buttonTextColor}
                                                href=
                                                // [if] token0 is the native token, then only use the address of token1 [else] token0 address
                                                {`/exchange/add/${NATIVE[chainId ?? ChainId.FANTOM].symbol}/${farm.token1Address}`}
                                            >
                                                <div className="flex text-lg gap-2">
                                                    <PlusCircleIcon width={26} className={classNames(`text-white`)} />
                                                    {/* {farm.lpSymbol} */}
                                                    CREATE {farm.lpSymbol} LP
                                                </div>
                                            </TokenPairLink>
                                        </SubmitButton>
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        href={`/exchange/add/${farm.token1Address}/${farm.token0Address}`}
                                    >
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={getChainColor(chainId)}
                                            margin=".5rem 0 0rem 0"
                                        >
                                            <TokenPairLink
                                                target="_blank"
                                                rel="noopener"
                                                href=
                                                {`/exchange/add/${farm.token0Address}/${farm.token1Address}`}
                                            >
                                                <div className="flex text-lg gap-2">
                                                    <CircleStackIcon width={26} className={classNames(`text-white`)} />
                                                    CREATE {farm.lpSymbol} LP
                                                </div>
                                            </TokenPairLink>
                                        </SubmitButton>
                                    </NavLink>
                                )}



                                {/* EARNED */}
                                {earnedAmount > 0 && (
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            // className={'font-bold'}
                                            margin=".5rem 0 0rem 0"
                                            onClick={() =>
                                                handleHarvest(pid)
                                            }
                                        >
                                            <div className="flex text-lg gap-2">
                                                <CircleStackIcon width={26} className={classNames(`text-white`)} />
                                                {`HARVEST YIELD`}
                                            </div>
                                        </SubmitButton>
                                    </Wrap>
                                )}

                                {isSwapPair &&
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            // className={'font-bold'}
                                            margin=".5rem 0 0rem 0"
                                            onClick={() =>
                                                handleShowZap(pid)
                                            }
                                        >
                                            <div className="flex text-lg gap-1">
                                                {/* <Zap width={26} className={classNames(`text-white`} /> */}
                                                {`ZAP`}
                                                <CurrencyDollarIcon width={26} className={classNames(`text-white`)} />
                                                &rarr; {`${farm.lpSymbol}`}
                                            </div>
                                        </SubmitButton>
                                    </Wrap>
                                }
                            </Tab.Panel>
                            {/*------ WITHDRAW TAB PANEL ------*/}
                            <Tab.Panel className={'outline-none'}>
                                <Button variant={'link'} className="absolute top-0 right-0 flex justify-center max-h-[30px] max-w-[30px]">
                                    <QuestionHelper
                                        text={
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex flex-col">
                                                    <p>
                                                        {`Fees decrease by 1% daily, and only increase upon withdrawals.`}
                                                        <br /><br />{`Depositing more is free and does not change your fee.`}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Button>
                                <div className={
                                    classNames(
                                        "flex flex-col mb-3 bg-dark-1000 p-3 border-2 border-dark-1000",
                                        !isActive ? "hover:border-red"
                                            : "hover:border-purple",
                                        "w-full space-y-1")}>

                                    {Number(_stakedBalance) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {`Staked Balance`}
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(_stakedBalance, false, true)} {farm?.lpSymbol}
                                            </Typography>
                                        </div>
                                    )}

                                    {_stakedValue > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {`Value (USD)`}
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(_stakedValue, true, true)}
                                            </Typography>
                                        </div>
                                    )}
                                    {Number(_stakedBalance) > 0 && (
                                        <div className="h-px my-6 bg-dark-1000" />
                                    )}

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            {`Fee Amount`}
                                        </Typography>
                                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(Number(_stakedBalance) - _withdrawable, false, true)} {isUnderworldPair ? token0Symbol : farm.lpSymbol}
                                        </Typography>
                                    </div>

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            {`Value (USD)`}
                                        </Typography>
                                        <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(Number(_feeValue), true, true)}
                                        </Typography>
                                    </div>


                                    <div className="h-px my-6 bg-dark-1000" />
                                    {/* FEE BOX (COLOR-CODED) */}
                                    {Number(withdrawFee) > 0 && (
                                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-red border-1 hover:border-purple w-full space-y-1">
                                            <div className="text-white">
                                                <div className={classNames("block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md",
                                                    "hover:bg-dark-300")}>
                                                    <span>
                                                        {(Number(withdrawFee)).toFixed(0)}% {`FEE`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* WITHDRAWAL FREE */}
                                    {Number(withdrawFee) == 0 && (
                                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-purple w-full space-y-1">
                                            <div className="text-white">
                                                <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                                    <span>
                                                        {(Number(withdrawFee)).toFixed(0)}% {`FEE`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* WITHDRAW: ASSET PANEL */}
                                <FarmInputPanel
                                    pid={farm.pid}
                                    onUserInput={(value) => setWithdrawValue(value)}
                                    onMax={() => setWithdrawValue(_stakedBalance.toString())}
                                    value={withdrawValue}
                                    balance={_stakedBalance.toString()}
                                    id={pid}
                                />
                                <Wrap padding="0" margin="0" display="flex">

                                    <SubmitButton
                                        height="2rem"
                                        primaryColor={buttonColor}
                                        color={buttonTextColor}
                                        margin=".5rem 0 0rem 0"
                                        onClick={() => setShowConfirmation(true)}
                                    >
                                        {`WITHDRAW`} {isUnderworldPair ? token0Symbol : farm.lpSymbol}
                                    </SubmitButton>
                                </Wrap>
                                {/* EARNED */}
                                {earnedAmount > 0 && (
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleHarvest(pid)
                                            }
                                        >
                                            {`HARVEST YIELD`}
                                        </SubmitButton>
                                    </Wrap>
                                )}
                            </Tab.Panel>
                        </Tab.Group>
                    </div>
                </HeadlessUIModal.Controlled>
            )}

            {/*------ ZAP OPTIONS PANEL ------*/}
            {openZap &&
                <HeadlessUIModal.Controlled
                    // isCustom={true}
                    chainId={chainId}
                    isOpen={openZap}
                    onDismiss={() => handleShowZap(pid)}
                // borderColor={
                //     isUnderworldPair ? 'border-dark-900 hover:border-blue'
                //         : !isActive ? 'border-dark-900 hover:border-red' : 'border-dark-900 hover:border-dark-420'
                // }
                // className={classNames("border",
                //     isActive && isSwapPair ? "hover:border-purple"
                //         : isUnderworldPair ? "hover:border-blue"
                //             : "hover:border-red",
                //     "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >

                    {/* ZAP: NATIVE --> LP */}
                    <CurrencySearchModal.Controlled
                        chainId={chainId}
                        open={modalOpen}
                        onDismiss={handleDismissSearch}
                        onCurrencySelect={(value) => setZapTokenAddress(value.wrapped.address)}
                        selectedCurrency={zapToken ?? undefined}
                        allowManageTokenList={false}
                        showSearch={true}
                    />
                    <AssetInput
                        chainId={chainId}
                        currencyLogo={true}
                        currency={zapToken}
                        value={zapValue}
                        onChange={(value) => setZapValue(value)}
                        balance={zapTokenBalance}
                        showBalance={false}
                        showMax={false}
                    />
                    <Wrap padding="0" margin="0" display="flex">
                        <SubmitButton
                            height="2rem"
                            primaryColor={buttonColor}
                            color={"#FFFFFF"}
                            className={'font-bold'}
                            margin=".5rem 0 0rem 0"
                            onClick={() =>
                                setModalOpen(true)
                            }
                        >
                            {`SELECT TOKEN`}
                        </SubmitButton>
                    </Wrap>
                    <div className="my-2 mx-8 mt-3 border border-[#FFFFFF]" />
                    {/* { !approvedZap && */}
                    <Wrap padding="0" margin="0" display="flex">
                        <SubmitButton
                            height="2rem"
                            primaryColor={buttonColor}
                            color={'#FFFFFF'}
                            className={'font-bold'}
                            margin=".5rem 0 0rem 0"
                            onClick={() =>
                                handleZapApprove(tokenContract)
                            }
                        >
                            {`APPROVE ZAP`}
                            {/* {token.symbol} */}
                        </SubmitButton>
                    </Wrap>
                    {/* } */}

                    <Wrap padding="0" margin="0" display="flex">
                        <SubmitButton
                            height="2rem"
                            primaryColor={buttonColor}
                            color={"#FFFFFF"}
                            className={'font-bold'}
                            margin=".5rem 0 0rem 0"
                            onClick={() =>
                                handleZap(zapTokenAddress, lpAddress)
                            }
                        >
                            {`ZAP INTO PAIR`}
                        </SubmitButton>
                    </Wrap>
                    <Typography className={`flex text-center mt-4 sm:mt-6 border border-[${getChainColor(chainId)}] p-2 rounded rounded-2xl`}>
                        {`Mind slippage and loses due to low liquidity. Avoid large amounts, if unsure.`}
                    </Typography>

                </HeadlessUIModal.Controlled>
            }

            {showConfirmation && (
                <HeadlessUIModal.Controlled
                    // isCustom={true}
                    chainId={chainId}
                    isOpen={showConfirmation}
                    onDismiss={() => handleShowConfirmation(false)}
                >
                    <div className="space-y-4">
                        {/* <HeadlessUIModalHeader header={`FYI: Early Withdrawal Fee`} onClose={() => setShowConfirmation(false)} /> */}
                        <Typography variant="sm">
                            {`Since the community proposal passed, an Early Withdrawal Fee is now live (select pairs)`} <b><a href="https://enchant.soulswap.finance/#/proposal/0xb2ede0a82c5efc57f9c097f11db653fb1155cd313dfedd6c87142a42f68465a6">{`details here`}</a></b>.
                            {/* <br/><br/>This means you may withdraw for 0% fees after 14 Days have elapsed.  */}
                            <br /><br />{`This`} <b>{`reduces by 1% daily`}</b>, {`so waiting out the early withdrawal period will enable you to avoid fees.`}

                            <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-purple">
                                {`Estimated Fee Outcomes`}
                            </div>
                            • <b>{`Withdrawal Value`}</b>: {formatNumber(Number(_withdrawValue) * Number(lpPrice), true, true)} <br />
                            • <b>{`Fee Rate`}</b>: {Number(withdrawFee).toFixed(0)}% <br />
                            • <b>{`Fee Amount`}</b>: {formatNumber(Number(withdrawFee) * Number(_withdrawValue) / 100, false, true)} {isUnderworldPair ? token0Symbol : farm.lpSymbol}<br />
                            • <b>{`Fee Value`}</b>: {formatNumber(Number(withdrawFee) * Number(_withdrawValue) * Number(lpPrice) / 100, true, true)}

                            <div className="mt-6 text-center">
                                <i><b>{`Please do not rely on our estimations`}</b></i>.
                            </div>

                            {/* <b>100% of the fee</b> goes towards building our protocol-owned liquidity, which brings about long-term sustainability to our platform. */}
                        </Typography>
                        <Typography variant="sm" className="font-medium text-center">
                            {`QUESTIONS OR CONCERNS?`}
                            <a href="mailto:soulswapfinance@gmail.com">
                                {' '} {`CONTACT US`}
                            </a>
                        </Typography>
                        <Button
                            height="2.5rem"
                            color="purple"
                            onClick={() =>
                                handleWithdraw(pid, Number(withdrawValue))
                            }
                        >
                            {`I UNDERSTAND THESE TERMS`}
                        </Button>
                    </div>
                </HeadlessUIModal.Controlled>
            )}
        </>
    )
}