import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'services/web3'
import { ChainId, NATIVE, ROUTER_ADDRESS, SOUL_ADDRESS, SUMMONER_ADDRESS, Token, WNATIVE } from 'sdk'
import { useTokenContract, useSummonerContract, useZapperContract } from 'hooks/useContract'
import useApprove from 'hooks/useApprove'
import { Tab } from '@headlessui/react'
import {
    FarmContentWrapper, FarmContainer, FarmItem, FarmItemBox, Text, FunctionBox, SubmitButton, Wrap
} from './Styles'
import { classNames, formatNumber, tryParseAmount } from 'functions'
import { usePairInfo, useSummonerInfo, useSummonerPoolInfo, useSummonerUserInfo, useTokenInfo, useUserTokenInfo } from 'hooks/useAPI'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import Modal from 'components/DefaultModal'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import ModalHeader from 'components/Modal/Header'
import NavLink from 'components/NavLink'
import FarmInputPanel from './Input'
import { CurrencyLogo } from 'components/CurrencyLogo'
import QuestionHelper from 'components/QuestionHelper'
// import { useUserInfo } from 'hooks/useAPI'
import AssetInput from 'components/AssetInput'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { getChainColor } from 'constants/chains'
import { ExternalLink } from 'components/ReusableStyles'
import { BriefcaseIcon, CollectionIcon, CurrencyDollarIcon, DatabaseIcon, PlusIcon, SparklesIcon } from '@heroicons/react/outline'

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

const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

export const ActiveRow = ({ pid, farm, lpToken, token0Symbol, token1Symbol, token0Address, token1Address }) => {
    const { account, chainId, library } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)

    const [approved, setApproved] = useState(false)
    const [approvedZap, setZapApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('0')
    const [depositValue, setDepositValue] = useState('0')
    const [zapValue, setZapValue] = useState('0')
    const [zapTokenAddress, setZapTokenAddress] = useState(SOUL_ADDRESS[chainId])

    const SoulSummonerContract = useSummonerContract()
    const ZapContract = useZapperContract()
    const ZapContractAddress = ZapContract.address

    const nowTime = new Date().getTime()
    const { summonerInfo } = useSummonerInfo()
    const startRate = Number(summonerInfo.startRate)

    const { summonerPoolInfo } = useSummonerPoolInfo(pid)
    const liquidity = summonerPoolInfo.tvl
    const apr = summonerPoolInfo.apr
    const allocPoint = summonerPoolInfo.allocPoint
    const lpAddress = summonerPoolInfo.lpAddress
    const pairType = summonerPoolInfo.pairType
    const pairStatus = summonerPoolInfo.status

    // const { userInfo } = useUserInfo()
    const { pairInfo } = usePairInfo(lpAddress)
    // assumes 18, since only SOUL-LP farms are eligible for Zap   
    const assetDecimals = Number(pairInfo.pairDecimals)
    const token0Decimals = Number(pairInfo.token0Decimals)
    const token1Decimals = Number(pairInfo.token1Decimals)

    const [showOptions, setShowOptions] = useState(false)
    const [openDeposit, setOpenDeposit] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [openWithdraw, setOpenWithdraw] = useState(false)
    const [openZap, setOpenZap] = useState(false)

    const { summonerUserInfo } = useSummonerUserInfo(pid)
    const stakedBalance = Number(summonerUserInfo.stakedBalance)
    const stakedValue = Number(summonerUserInfo.stakedValue)
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue
    const lpPrice = Number(summonerUserInfo.lpPrice)
    const firstDepositTime = Number(summonerUserInfo.firstDepositTime)
    const currentRate = Number(summonerUserInfo.currentRate)
    const currentTime = nowTime / 1_000
    const timeDelta = currentTime - firstDepositTime
    const daysElapsed = timeDelta / 86_400
    const withdrawFee
        = chainId == ChainId.FANTOM
            ? (daysElapsed <= 14 ? startRate - daysElapsed
                // staked, but beyond 14 days
                : stakedBalance > 0 ? 0
                    // not staked (to forewarn)
                    : 14)
            : currentRate
    const feeAmount
        = withdrawFee * stakedBalance / 100
    const withdrawable = stakedBalance - feeAmount
    const feeValue = feeAmount * lpPrice
    const walletBalance = Number(summonerUserInfo.walletBalance)
    // const walletValue = Number(walletBalance) * lpPrice
    // const parsedBalance = tryParseAmount(walletBalance.toString(), farm.lpToken)
    // const userBalance = useCurrencyBalance(account, lpToken)
    const hasBalance = Number(walletBalance) > 0
    const isUnderworldPair = pairType == "underworld"
    const isSwapPair = pairType == "farm"
    const isActive = pairStatus == "active"
    const assetToken = new Token(chainId, farm.lpAddress, assetDecimals)
    const parsedDepositValue = tryParseAmount(depositValue, assetToken)

    // COLOR //
    const buttonColor = getChainColor(chainId)
    const buttonTextColor = isSwapPair && isActive ? "white" : "white"
    const textColor = isUnderworldPair ? "text-blue" : !isActive ? "text-pink" : "text-dark-600"
    // const tokenSymbol = isUnderworldPair ? token0Symbol : "LP"

    // (de)Constructs Tokens //
    const token0 = new Token(chainId, token0Address, token0Decimals)
    const token1 = new Token(chainId, token1Address, token1Decimals)

    // Native Keys //
    // const nativeToken0 = farm.token0Symbol == WNATIVE[chainId].symbol
    // const nativeToken1 = farm.token1Symbol == WNATIVE[chainId].symbol 

    const nativeToken0 = farm.token0Symbol == WNATIVE[chainId].symbol

    // Zap Add-Ons //
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

    // checks: approval for summoner to move tokens.
    const fetchApproval = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            // Checks if SoulSummonerContract can move tokens
            const amount = await erc20Allowance(account, SUMMONER_ADDRESS[chainId])
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
                const tx = await erc20Approve(SUMMONER_ADDRESS[chainId])
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
    const handleWithdraw = async (pid) => {
        try {
            const tx = await SoulSummonerContract?.withdraw(pid, Number(withdrawValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            const tx = await SoulSummonerContract?.withdraw(pid, Number(withdrawValue).toFixed(6).toBigNumber(assetDecimals))
            console.log(e)
        }
    }

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
    // const handleDeposit = async (pid) => {
    //     let tx
    //     try {
    //         tx = await SoulSummonerContract?.deposit(pid, Number(depositValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
    //         await tx.wait()
    //     } catch (e) {
    //         const smallerValue = Number(depositValue) - 0.000001
    //         tx = await SoulSummonerContract?.deposit(pid, Number(smallerValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
    //         await tx.wait()
    //         console.log(e)
    //     }
    // }

    // handles deposit
    const handleDeposit = async (pid, amount) => {
        try {
            const tx = await SoulSummonerContract?.deposit(pid, 
                // Number(depositValue).toFixed(assetDecimals).toBigNumber(assetDecimals)
                parsedDepositValue?.quotient.toString()
                )
            await tx.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    // HANDLE ZAP //
    const handleZap = async (zapTokenAddress, lpAddress) => {
        try {
            let tx
            tx = await ZapContract?.zapInToken(zapTokenAddress, Number(zapValue).toFixed(zapTokenDecimals).toBigNumber(zapTokenDecimals), lpAddress, ROUTER_ADDRESS[chainId], account)
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="flex justify-center w-full">
                <FarmContainer>
                    <div className={classNames("bg-dark-900 p-3 border border-blue", !hasBalance && "border-dark-1000",
                        isUnderworldPair ? "hover:border-blue" : !isActive ? "hover:border-pink"
                            : hasBalance && isUnderworldPair ? "hover:border-blue border-blue"
                                : hasBalance && !isUnderworldPair ? "border-dark-600"
                                    : hasBalance && !isActive ? "hover:border-pink border-pink"
                                        : "hover:border-dark-600"
                    )}
                        onClick={() => handleShowOptions()}
                    >
                        <FarmContentWrapper>
                            <div className="items-center">
                                <FarmItemBox>
                                    {Number(allocPoint) != 420 ?
                                        <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} />
                                        :
                                        <CurrencyLogo
                                            currency={token0} // TOKEN0
                                            size={40}
                                        />
                                    }
                                </FarmItemBox>
                            </div>

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
                                                ${
                                                    stakedValue == 0 ? 0
                                                        : stakedValue.toString(2) == '0.00' ? '<0.00'
                                                            : stakedValue < 1 && stakedValue.toString(4) ? stakedValue.toFixed(4)
                                                                : stakedValue > 0 ? stakedValue.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
                                        {stakedValue.toFixed(0).toString() === '0' ? (
                                            <Text padding="0" fontSize="1rem" color="#666">
                                                0%
                                            </Text>
                                        ) : (
                                            <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                                {(stakedValue / Number(liquidity) * 100).toFixed(0)}%
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

                            {/* REWARDS VALUE */}
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
                                        {formatNumber(Number(earnedAmount), false, true)} SOUL
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


            {/*------ DROPDOWN OPTIONS PANEL ------*/}
            {showOptions && (
                <Modal
                    isCustom={true}
                    isOpen={showOptions}
                    onDismiss={() => handleShowOptions()}
                    borderColor={
                        isUnderworldPair ? 'border-dark-900 hover:border-blue'
                            : !isActive ? 'border-dark-900 hover:border-pink' : 'border-dark-900 hover:border-dark-420'
                    }
                    className={classNames("border",
                        isActive && isSwapPair ? "hover:border-dark-600"
                            : isUnderworldPair ? "hover:border-blue"
                                : "hover:border-pink",
                        "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >
                    <div className="p-3 space-y-6 bg-dark-900 rounded z-1 relative">
                        <Tab.Group>
                            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
                                <div className="grid grid-cols-2 w-[95%] rounded-md p-2px bg-dark-900">
                                    <Tab
                                        className={({ selected }) =>
                                            `${selected && !isUnderworldPair && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                : selected && isUnderworldPair ? 'border-b-2 border-accent p-2 text-white border-[#0993EC]'
                                                    : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-pink'
                                                        : 'bg-dark-900 text-white'
                                            }
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 
                  ${isUnderworldPair ? "hover:border-blue"
                                                : !isActive ? "hover:border-pink"
                                                    : "hover:border-dark-600"
                                            }`
                                        }
                                    >
                                        DEPOSIT
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            `${selected && !isUnderworldPair && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                : selected && isUnderworldPair ? 'border-b-2 border-accent p-2 text-white border-[#0993EC]'
                                                    : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-pink'
                                                        : 'bg-dark-900 text-white'
                                            } 
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1
                  ${isUnderworldPair ? "hover:border-blue"
                                                : !isActive ? "hover:border-pink"
                                                    : "hover:border-dark-600"
                                            }`
                                        }
                                    >
                                        WITHDRAW
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
                                                            {`After creating liquidity or lending, navigate to the associated farm to deposit.`}
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            {`After creating liquidity or lending, navigate to the associated farm to deposit.`}
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
                                        "flex flex-col bg-dark-1000 mb-3 p-3 border border-2 border-dark-1000",
                                        isUnderworldPair ? "hover:border-blue"
                                            : !isActive ? "hover:border-pink"
                                                : "hover:border-dark-600",

                                        "w-full space-y-1")

                                    }>
                                    {/* Number(walletBalance) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white font-bold" fontFamily={'medium'}>
                                                Wallet Balance
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(walletBalance, false, true)} {tokenSymbol}
                                            </Typography>
                                        </div>
                                    )
                                    */} 

                                    {/* Number(walletValue) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Balance (USD)
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(walletValue, true, true)}
                                            </Typography>
                                        </div>
                                    )
                                    */}
  
                                      {Number(stakedBalance) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Staked Balance
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(stakedBalance, false, true)} {farm.lpSymbol}
                                            </Typography>
                                        </div>
                                    )}

                                    {stakedValue > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Balance (USD)
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(stakedValue, true, true)}
                                            </Typography>
                                        </div>
                                    )}

                                    {Number(walletBalance) > 0 && (
                                        <div className="h-px my-6 bg-dark-1000" />
                                    )}

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            Claimable Rewards
                                        </Typography>
                                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                            {Number(earnedAmount).toFixed(2)} SOUL
                                        </Typography>
                                    </div>
                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            Rewards (USD)
                                        </Typography>
                                        <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(earnedValue, true, true)}
                                        </Typography>
                                    </div>

                                    <div className="h-px my-1 bg-dark-1000" />

                                    {/* WITHDRAWAL FREE */}
                                    {Number(withdrawFee) > 0 && (
                                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border-1 hover:border-dark-600 w-full space-y-1">
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
                                    <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-dark-600 w-full space-y-1">
                                        <div className="text-white">
                                            <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                                <span> {formatNumber(Number(apr), false, true)}% APR</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="h-px my-1 bg-dark-1000" />

                                {/* DEPOSIT: ASSET PANEL */}

                                {Number(walletBalance) != 0 &&
                                    <FarmInputPanel
                                        pid={farm.pid}
                                        onUserInput={(value) => setDepositValue(value)}
                                        onMax={() => setDepositValue(walletBalance.toString())}
                                        value={depositValue}
                                        balance={walletBalance.toString()}
                                        id={pid}
                                        // token0={token0}
                                        // token1={token1}
                                    />
                                }

                                {/* CREATE ASSET PAIR */}
                                {(nativeToken0 && !isUnderworldPair && isActive && !hasBalance) ? (
                                    <NavLink
                                        href={`/exchange/add/${NATIVE[chainId].symbol}/${farm.token1Address}`}
                                    >
                                        <a>
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
                                                    {`/exchange/add/${NATIVE[chainId].symbol}/${farm.token1Address}`}
                                                >
                                                    <div className="flex text-lg gap-2">
                                                        <CollectionIcon width={26} className={classNames(`text-white`)} />
                                                        {/* {farm.lpSymbol} */}
                                                        ADD LIQUIDITY
                                                    </div>
                                                </TokenPairLink>
                                            </SubmitButton>
                                        </a>
                                    </NavLink>
                                ) : (!hasBalance && !isUnderworldPair &&
                                    <NavLink
                                        href={`/exchange/add/${farm.token1Address}/${farm.token0Address}`}
                                    >
                                        <a>
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
                                                        <PlusIcon width={26} className={classNames(`text-white`)} />
                                                        LIQUIDITY {/* {farm.lpSymbol} */}
                                                    </div>                                            </TokenPairLink>
                                            </SubmitButton>
                                        </a>
                                    </NavLink>
                                )}
                                {/* LEND ASSET */}
                                {isUnderworldPair && (
                                    <NavLink
                                        href=
                                        {`/lend/${lpAddress}`}
                                    >
                                        <SubmitButton
                                            margin=".5rem 0 0rem 0"
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                        >
                                            <div className="flex text-lg gap-2">
                                                <BriefcaseIcon width={26} className={classNames(`text-white`)} />
                                                {`LEND ${token0Symbol}`}
                                            </div>
                                        </SubmitButton>
                                    </NavLink>
                                )}
                                {/* UN-APPROVED */}
                                {!approved && hasBalance && (
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
                                {approved && hasBalance && (
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor={buttonColor}
                                        color={buttonTextColor}
                                        margin=".5rem 0 0rem 0"
                                        onClick={() =>
                                            handleDeposit(pid, depositValue)
                                        }
                                    >
                                        <div className="flex text-lg gap-2">
                                        <CurrencyDollarIcon width={26} className={classNames(`text-white`)} />
                                            DEPOSIT {Number(allocPoint) == 420 ? token0Symbol : farm.lpSymbol}
                                        </div>
                                    </SubmitButton>
                                )}

                                {/* EARNED */}
                                {Number(earnedAmount) > 0 && (
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
                                                <DatabaseIcon width={26} className={classNames(`text-white`)} />
                                                HARVEST SOUL
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
                                            {/* <Zap width={26} className={classNames(`text-white`)} /> */}
                                                ZAP 
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
                                                        Fees decrease by 1% daily, and only increase upon withdrawals.
                                                        <br /><br />Depositing more is free and does not change your fee.
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Button>
                                <div className={
                                    classNames(
                                        "flex flex-col mb-3 bg-dark-1000 p-3 border border-2 border-dark-1000",
                                        isUnderworldPair ? "hover:border-blue"
                                            : !isActive ? "hover:border-pink"
                                                : "hover:border-dark-600",
                                        "w-full space-y-1")}>

                                    {Number(stakedBalance) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Staked Balance
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(stakedBalance, false, true)} {farm.lpSymbol}
                                            </Typography>
                                        </div>
                                    )}

                                    {stakedValue > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Balance (USD)
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(stakedValue, true, true)}
                                            </Typography>
                                        </div>
                                    )}
                                    {Number(stakedBalance) > 0 && (
                                        <div className="h-px my-6 bg-dark-1000" />
                                    )}

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            Maximum Fee
                                        </Typography>
                                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(Number(stakedBalance) - withdrawable, false, true)} {farm.lpSymbol}
                                        </Typography>
                                    </div>

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            Fee (USD)
                                        </Typography>
                                        <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                            {formatNumber(Number(feeValue), true, true)}
                                        </Typography>
                                    </div>


                                    <div className="h-px my-6 bg-dark-1000" />
                                    {/* FEE BOX (COLOR-CODED) */}
                                    {Number(withdrawFee) > 0 && (
                                        <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-red border-1 hover:border-dark-600 w-full space-y-1">
                                            <div className="text-white">
                                                <div className={classNames("block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md",
                                                    "hover:bg-dark-300")}>
                                                    <span>
                                                        {(Number(withdrawFee)).toFixed(0)}% FEE
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* WITHDRAWAL FREE */}
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
                                    onUserInput={(value) => setWithdrawValue(value)}
                                    onMax={() => setWithdrawValue(stakedBalance.toString())}
                                    value={withdrawValue}
                                    balance={stakedBalance.toString()}
                                    id={pid}
                                />
                                <Wrap padding="0" margin="0" display="flex">

                                    <SubmitButton
                                        height="2rem"
                                        primaryColor={buttonColor}
                                        color={buttonTextColor}
                                        margin=".5rem 0 0rem 0"
                                        onClick={ () => setShowConfirmation(true) }
                                    >
                                        WITHDRAW {farm.lpSymbol}
                                    </SubmitButton>

                                </Wrap>
                                {/* EARNED */}
                                {Number(earnedAmount) > 0 && (
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
                                            HARVEST SOUL
                                        </SubmitButton>
                                    </Wrap>
                                )}
                            </Tab.Panel>
                        </Tab.Group>
                    </div>
                </Modal>
            )}

            {/*------ ZAP OPTIONS PANEL ------*/}
            {openZap &&
                <Modal
                    isCustom={true}
                    isOpen={openZap}
                    onDismiss={() => handleShowZap(pid)}
                    borderColor={
                        isUnderworldPair ? 'border-dark-900 hover:border-blue'
                            : !isActive ? 'border-dark-900 hover:border-pink' : 'border-dark-900 hover:border-dark-420'
                    }
                    className={classNames("border",
                        isActive && isSwapPair ? "hover:border-dark-600"
                            : isUnderworldPair ? "hover:border-blue"
                                : "hover:border-pink",
                        "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >

                    {/* ZAP: NATIVE --> LP */}
                    <CurrencySearchModal.Controlled
                        open={modalOpen}
                        onDismiss={handleDismissSearch}
                        onCurrencySelect={(value) => setZapTokenAddress(value.wrapped.address)}
                        selectedCurrency={zapToken ?? undefined}
                        allowManageTokenList={false}
                        showSearch={true}
                    />
                    <AssetInput
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
                            SELECT TOKEN
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
                            APPROVE ZAP
                            {/* {token.symbol} */}
                        </SubmitButton>
                    </Wrap>
                    {/* } */}

                    {/* { approvedZap && */}
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
                            ZAP INTO {farm.lpSymbol}
                        </SubmitButton>
                    </Wrap>
                    {/* } */}

                </Modal>
            }

            {showConfirmation && (
                <Modal isOpen={showConfirmation} onDismiss={
                    () => setShowConfirmation(false)}>
                    <div className="space-y-4">
                        <ModalHeader header={`FYI: Early Withdrawal Fee`} onClose={() => setShowConfirmation(false)} />
                        <Typography variant="sm">
                            Since the community proposal passed, a 14-Day Early Withdrawal Fee is now live: <b><a href="https://enchant.soulswap.finance/#/proposal/0xb2ede0a82c5efc57f9c097f11db653fb1155cd313dfedd6c87142a42f68465a6">details here</a></b>.
                            {/* <br/><br/>This means you may withdraw for 0% fees after 14 Days have elapsed.  */}
                            <br /><br />This <b>reduces by 1% daily</b>, so consider waiting 14 Days prior to withdrawing to avoid fees.

                            <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-dark-600">
                                Estimated Fee Outcomes
                            </div>
                            • <b>Current Rate</b>: {Number(withdrawFee).toFixed(0)}% <br />
                            • <b>Fee Amount</b>: {formatNumber(Number(withdrawFee) * Number(withdrawValue) / 100, false, true)} {farm.lpSymbol}<br />
                            • <b>Fee Value</b>: {formatNumber(Number(withdrawFee) * Number(withdrawValue) * Number(lpPrice) / 100, true, true)}

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
    )
}