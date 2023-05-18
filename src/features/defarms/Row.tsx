import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useActiveWeb3React } from 'services/web3'
import { NATIVE, ROUTER_ADDRESS, SOUL_ADDRESS, Token } from 'sdk'
import { useTokenContract, useZapperContract, useManifestationContract } from 'hooks/useContract'
import useApprove from 'hooks/useApprove'
import { Tab } from '@headlessui/react'
import {
    FarmContentWrapper, FarmItemBox, Text, SubmitButton, Wrap
} from './Styles'
import { classNames, formatNumber, formatUnixTimestampToDay, tryParseAmount } from 'functions'
import { useManifestationUserInfo, useTokenInfo, useUserTokenInfo, useManifestationInfo } from 'hooks/useAPI'
import Modal from 'components/DefaultModal'
import ModalHeader from 'components/Modal/Header'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
import NavLink from 'components/NavLink'
import FarmInputPanel from './Input'
import { CurrencyLogo } from 'components/CurrencyLogo'
import QuestionHelper from 'components/QuestionHelper'
import AssetInput from 'components/AssetInput'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { getChainColor } from 'constants/chains'
import { ExternalLink } from 'components/ReusableStyles'
import { CircleStackIcon, CurrencyDollarIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { i18n } from '@lingui/core'
import DoubleCurrencyLogo from 'components/DoubleLogo'

// import { useRouter } from 'next/router'
// import { useCurrencyBalance } from 'state/wallet/hooks'
// import { Route } from 'react-router-dom'
// import Image from 'next/image'

// const HideOnSmall = styled.div`
// @media screen and (max-width: 900px) {
//   display: none;
// }
// `

const HideOnMobile = styled.div`
@media screen and (max-width: 600px) {
  display: none;
}
`

const TokenPairLink = styled(ExternalLink)`
  font-size: .9rem;
  padding-left: 10;
`

export const ActiveRow = ({ pid }) => {
    const { account, chainId } = useActiveWeb3React()
    // const router = useRouter()
    const [approved, setApproved] = useState(false)
    const [approvedZap, setZapApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('0')
    const [depositValue, setDepositValue] = useState('0')
    const [zapValue, setZapValue] = useState('0')
    // const [farmAddress, setFarmAddress] = useState('0xe7A3d3a56b08358f6EB0120eE46b2DD7930c4C26')
    const [zapToken, setZapToken] = useState<Token>()

    // const nowTime = new Date().getTime()
    const [showOptions, setShowOptions] = useState(false)
    const [openDeposit, setOpenDeposit] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [openWithdraw, setOpenWithdraw] = useState(false)
    const [openZap, setOpenZap] = useState(false)

    // DEFARM USER INFO //
    const { manifestationUserInfo } = useManifestationUserInfo(pid)
    const stakedBalance = Number(manifestationUserInfo.stakedBalance)
    const stakedValue = Number(manifestationUserInfo.stakedValue)
    // const lpPrice = Number(manifestationUserInfo.lpPrice)
    const withdrawFee = Number(manifestationUserInfo.currentRate)
    const walletBalance = Number(manifestationUserInfo.walletBalance)
    // const lastWithdrawTime = Number(manifestationUserInfo.lastWithdrawTime)
    // const secondsRemaining = Number(manifestationUserInfo.secondsRemaining)
    // const currentRate = Number(manifestationUserInfo.currentRate)

    const feeAmount = withdrawFee * stakedBalance / 100
    const withdrawable = stakedBalance - feeAmount
    // const feeValue = feeAmount * lpPrice

    // DEFARM POOL INFO //
    const { manifestationInfo } = useManifestationInfo(pid)
    const mAddress = manifestationInfo.mAddress
    const rewardSymbol = manifestationInfo.rewardSymbol
    const liquidity = manifestationInfo.tvl
    const lpPrice = Number(manifestationInfo.lpPrice)
    // const userShare = 
    // const liquidity = Number(manifestationInfo.tvl)
    // const depositedAssets = Number(manifestationInfo.lpBalance)
    // const liquidity = depositedAssets * lpPrice
    // const annualRewards = Number(manifestationInfo.annualRewards)
    // const annualRewardsValue = annualRewards * lpPrice
    // const APR = annualRewardsValue / liquidity
    // const APR = manifestationInfo.apr
    // const logoURI = manifestationInfo.logoURI
    const pairStatus = manifestationInfo.status
    const rewardAddress = manifestationInfo.rewardToken
    const depositAddress = manifestationInfo.lpAddress
    // const stakedValue = stakedBalance * lpPrice
    // const startTime = Number(manifestationInfo.startTime)
    const symbol = manifestationInfo.symbol
    const endTime = Number(manifestationInfo.endTime)
    const hasEnded = endTime < Date.now() / 1_000 // ms -> secs
    const APR = hasEnded ? 0 : Number(manifestationInfo.apr)

    const feeValue = feeAmount * lpPrice
    const hasBalance = Number(walletBalance) > 0
    const isActive = pairStatus == "active" && !hasEnded
    const isEmergency = !isActive
    // const assetToken = new Token(chainId, depositAddress, 18)
    const rewardToken = new Token(chainId, rewardAddress, 18)

    const earnedAmount = isActive ? Number(manifestationUserInfo.pendingRewards) : 0
    const earnedValue = isActive ? Number(manifestationUserInfo.pendingValue) : 0

    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(depositAddress)
    // const balance = useCurrencyBalance(chainId, account ?? undefined, assetToken)
    // const parsedDepositValue = tryParseAmount(depositValue, assetToken)
    // const parsedWithdrawValue = tryParseAmount(withdrawValue, assetToken)

    // COLOR //
    const buttonColor = getChainColor(chainId)
    const buttonTextColor = "white"
    const textColor = !isActive ? "text-avaxRed" : "text-dark-600"

    // PAIR INFO //
    // const token0 = new Token(chainId, WNATIVE_ADDRESS[chainId], 18)
    // const token1 = new Token(chainId, rewardAddress, 18)

    // CONTRACTS //
    // const ManifesterContract = useManifesterContract()
    const ManifestationContract = useManifestationContract(mAddress)
    const ZapContract = useZapperContract()
    const ZapContractAddress = ZapContract.address

    // ZAP ADD-ONS //
    const tokenContract = useTokenContract(zapToken?.wrapped.address)
    const zapTokenDecimals = Number(useTokenInfo(zapToken?.wrapped.address).tokenInfo.decimals)
    const zapTokenSymbol = useTokenInfo(zapToken?.wrapped.address).tokenInfo.symbol
    const zapTokenName = useTokenInfo(zapToken?.wrapped.address).tokenInfo.name
    // const zapToken = new Token(chainId, zapTokenAddress, zapTokenDecimals, zapTokenSymbol, zapTokenName)
    const maxUint = ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1))

    // USER INFO //
    const { userTokenInfo } = useUserTokenInfo(account, zapToken?.wrapped.address)
    const selectedTokenDecimals = zapTokenDecimals ? zapTokenDecimals : 18
    const selectedTokenBalance = Number(userTokenInfo.balance) / selectedTokenDecimals // TODO: try erc20BalanceOf(zapTokenAddress)
    const zapTokenBalance = tryParseAmount(selectedTokenBalance.toString(), zapToken)
    const [modalOpen, setModalOpen] = useState(true)

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])
    // runs only on initial render/mount
    useEffect(() => {
        fetchApproval(mAddress)
        console.log(mAddress)
    }, [account])

    /**
     * Opens the function panel dropdowns.
     */
    const handleShowOptions = () => {
        setShowOptions(!showOptions)
        if (showOptions) {
            fetchApproval(mAddress)
            setOpenDeposit(false)
            setOpenWithdraw(false)
        }
    }

    const handleShowZap = (pid) => {
        setOpenZap(!openZap)
    }

    // checks: approval for defarm to move tokens.
    const fetchApproval = async (manifestationAddress: string) => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            // Checks if ManifestationContract can move tokens
            const amount = await erc20Allowance(account, manifestationAddress)
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

    // enables: defarm tranfers approval.
    const handleApprove = async (manifestationAddress: string) => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(manifestationAddress)
                await tx?.wait().then(await fetchApproval(manifestationAddress))
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

    // handles: harvest for given pid
    const handleHarvest = async () => {
        try {
            let tx
            tx = await ManifestationContract?.harvest()
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }

    // handles: harvest for given pid
    const handleEmergency = async () => {
        try {
            let tx
            tx = await ManifestationContract?.emergencyWithdraw()
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }

    // // deposits: selected amount into the defarm
    const handleDeposit = async (amount) => {
        let tx
        try {
            tx = await ManifestationContract?.deposit((Number(depositValue)).toFixed(18).toBigNumber(18))
            await tx.wait()
        } catch (e) {
            const smallerValue = Number(depositValue) - 0.000001
            tx = await ManifestationContract?.deposit((Number(smallerValue)).toFixed(18).toBigNumber(18))
            await tx.wait()
            console.log(e)
        }
    }

    // runs only on initial render/mount
    // useEffect(() => {
    //     fetchApproval(mAddress)

    // // withdraws: selected amount 
    const handleWithdraw = async (amount) => {
        let tx
        try {
            tx = await ManifestationContract?.withdraw(Number(withdrawValue).toFixed(18).toBigNumber(18))
            await tx.wait()
        } catch (e) {
            const smallerValue = Number(withdrawValue) - 0.000001
            tx = await ManifestationContract?.withdraw(Number(smallerValue).toFixed(18).toBigNumber(18))
            await tx.wait()
            console.log(e)
        }
    }


    // HANDLE ZAP //
    const handleZap = async (zapTokenAddress, depositAddress) => {
        try {
            let tx
            tx = await ZapContract?.zapInToken(zapTokenAddress, Number(zapValue).toFixed(zapTokenDecimals).toBigNumber(zapTokenDecimals), depositAddress, ROUTER_ADDRESS[chainId], account)
            await tx?.wait()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <div className={classNames(" mt-1 bg-dark-900 p-1 sm:p-4 rounded rounded-2xl", stakedBalance > 0 && !isActive && 'border-avaxRed', !hasBalance && "border-dark-1000",
                !isActive ? "hover:border-avaxRed"
                    : hasBalance ? "border-dark-600"
                        : !isActive ? "hover:border-avaxRed"
                            : "hover:border-dark-600"
            )}
                onClick={() => handleShowOptions()}
            >
                <FarmContentWrapper>

                    {/* DEPOSIT LOGO */}
                    <div className="items-center -ml-2 mr-4 sm:mr-24 md:mr-36">
                        <FarmItemBox>
                            <div
                                className={`flex justify-center`}
                            >
                                <DoubleCurrencyLogo
                                    currency0={rewardToken}
                                    currency1={NATIVE[chainId]}
                                    size={40}
                                />
                                {/* <Image 
                                        src={logoURI}
                                        width={40}
                                        height={40}
                                        alt={`logo for defarm reward asset`}
                                        /> */}
                            </div>
                            {/* <DoubleCurrencyLogo currency0={token0} currency1={token1} size={40} /> */}
                        </FarmItemBox>
                    </div>

                    {/* STAKED VALUE */}
                    <HideOnMobile>
                        <FarmItemBox>
                            <div className={'sm:mr-36 md:mr-48'}>
                                {Number(APR).toString() === '0.00' ? (
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
                            </div>
                        </FarmItemBox>
                    </HideOnMobile>

                    {/* % APR */}
                    <FarmItemBox>
                        <div className={'sm:mr-12 md:mr-32'}>
                            {Number(APR).toString() === '0.00' ? (
                                <Text padding="0" fontSize="1rem" color="#666">
                                    0
                                </Text>
                            ) : (
                                <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                    {formatNumber(APR, false, true)}%
                                </Text>
                            )}
                        </div>
                    </FarmItemBox>

                    {/* PENDING REWARDS */}
                    <FarmItemBox className="flex">
                        <div className={'mr-1 sm:mr-8 md:mr-16'}>
                            {/* Here we wait for there to be at least $0.00 rewarded */}
                            {earnedValue.toFixed(1).toString() === '0.0' ? (
                                <div className="flex flex-cols-2 sm:ml-12 gap-3">
                                    {formatNumber(0, true, true)}<CurrencyLogo currency={rewardToken} size={24} />
                                </div>
                            ) : (
                                <div className="flex flex-cols-2 sm:ml-12 gap-2">
                                    {/* We use value here to account for tokens with 1T+ supply (UI) */}
                                    {formatNumber(earnedValue, true, true)}<CurrencyLogo currency={rewardToken} size={24} />
                                </div>
                            )}
                        </div>
                    </FarmItemBox>

                    {/* LIQUIDITY (TVL) */}
                    <FarmItemBox className="flex" >
                        <div
                            className={'mr-4'}
                        >
                            {Number(liquidity) === 0 ? (
                                <Text padding="0" fontSize="1rem" color="#666">
                                    $0
                                </Text>
                            ) : (
                                <div className="flex flex-cols-2 sm:ml-12 gap-1">
                                    ${Number(liquidity)
                                        .toFixed(0)
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                </div>
                            )}
                        </div>
                    </FarmItemBox>
                </FarmContentWrapper>
            </div>

            {/*------ DROPDOWN OPTIONS PANEL ------*/}
            {showOptions && (
                <Modal
                    isCustom={true}
                    isOpen={showOptions}
                    onDismiss={() => handleShowOptions()}
                    borderColor={
                        !isActive ? 'border-dark-900 hover:border-avaxRed' : 'border-dark-900 hover:border-dark-420'
                    }
                    className={classNames("border",
                        isActive ? "hover:border-dark-600"
                            : "hover:border-avaxRed",
                        "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >
                    <div className="p-3 space-y-6 bg-dark-900 rounded z-1 relative">
                        <Tab.Group>
                            {isActive &&
                                <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
                                    <div className={`grid ${isActive ? 'grid-cols-2' : 'grid-cols-1'} w-[95%] rounded-md p-2px bg-dark-900`}>
                                        {isActive &&
                                            <Tab
                                                className={({ selected }) =>
                                                    `${selected && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                        : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-avaxRed'
                                                            : 'bg-dark-900 text-white'
                                                    }
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 
                  ${!isActive ? "hover:border-avaxRed" : "hover:border-dark-600"}`}
                                            >
                                                {i18n._(t`DEPOSIT`)}
                                            </Tab>
                                        }
                                        <Tab
                                            className={({ selected }) =>
                                                `${selected && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                    : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-avaxRed'
                                                        : 'bg-dark-900 text-white'
                                                } 
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1
                  ${!isActive ? "hover:border-avaxRed" : "hover:border-dark-600"}`
                                            }
                                        >
                                            {i18n._(t`WITHDRAW`)}
                                        </Tab>
                                    </div>
                                </Tab.List>
                            }
                            {/*------ DEPOSIT TAB PANEL ------*/}
                            {isActive &&
                                <Tab.Panel className={`outline-none`}>
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
                                            !isActive ? "hover:border-avaxRed"
                                                : "hover:border-dark-600",

                                            "w-full space-y-1")

                                        }>

                                        {Number(stakedBalance) > 0 && (
                                            <div className="flex justify-between">
                                                <Typography className="text-white" fontFamily={'medium'}>
                                                    {i18n._(t`Staked Balance`)}
                                                </Typography>
                                                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                    {formatNumber(stakedBalance, false, true)} {`${symbol}-${NATIVE[chainId].symbol}`}
                                                </Typography>
                                            </div>
                                        )}

                                        {stakedValue > 0 && (
                                            <div className="flex justify-between">
                                                <Typography className="text-white" fontFamily={'medium'}>
                                                    {i18n._(t`Staked (USD)`)}
                                                </Typography>
                                                <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                    {formatNumber(stakedValue, true, true)}
                                                </Typography>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {i18n._(t`Claimable Rewards`)}
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {earnedAmount.toFixed(2)} {rewardSymbol}
                                            </Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {i18n._(t`Rewards (USD)`)}
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(earnedValue, true, true)}
                                            </Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {i18n._(t`End Date`)}
                                            </Typography>
                                            <Typography className={textColor} weight={600} fontFamily={'semi-bold'}>
                                                {formatUnixTimestampToDay(endTime)}
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
                                                    <span> {formatNumber(Number(APR), false, true)}% APR</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px my-1 bg-dark-1000" />
                                    {/* DEPOSIT: ASSET PANEL */}
                                    {Number(walletBalance) != 0 && isActive &&
                                        <FarmInputPanel
                                            pid={pid}
                                            onUserInput={(value) => setDepositValue(value)}
                                            onMax={() => setDepositValue(walletBalance.toString())}
                                            value={depositValue}
                                            balance={walletBalance.toString()}
                                            id={pid}
                                            defarm={true}
                                        />
                                    }

                                    {/* UN-APPROVED */}
                                    {/* {!approved && hasBalance && ( */}
                                    {isActive &&
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            margin=".5rem 0 0rem 0"
                                            onClick={() => handleApprove(mAddress)}>
                                            <div className="flex text-lg gap-2">
                                                {i18n._(t`APPROVE ASSET`)}
                                            </div>
                                        </SubmitButton>
                                    }

                                    {/* APPROVED */}
                                    {hasBalance && isActive && (
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            margin=".5rem 0 0rem 0"
                                            onClick={() =>
                                                handleDeposit(depositValue)
                                            }
                                        >
                                            <div className="flex text-lg gap-2">
                                                <CurrencyDollarIcon width={26} className={classNames(`text-white`)} />
                                                {i18n._(t`DEPOSIT `)} {`${symbol}-${NATIVE[chainId].symbol} LP`}
                                            </div>
                                        </SubmitButton>
                                    )}

                                    {/* CREATE ASSET PAIR */}
                                    {isActive &&
                                        <NavLink
                                            href={`/exchange/add/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`}
                                        // /add/${NATIVE[chainId].symbol}/${assetToken?.wrapped.address}
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
                                                        href={`/exchange/add/${NATIVE[chainId].symbol}/${SOUL_ADDRESS[chainId]}`}
                                                    // /add/${NATIVE[chainId].symbol}/${assetToken?.wrapped.address}
                                                    >
                                                        <div className="flex text-lg gap-2">
                                                            <PlusCircleIcon width={26} className={classNames(`text-white`)} />
                                                            {`CREATE ${symbol}-${NATIVE[chainId].symbol} PAIR`}
                                                        </div>
                                                    </TokenPairLink>
                                                </SubmitButton>
                                            </a>
                                        </NavLink>
                                    }
                                    {/* ZAPPER FUNCTIONALITY */}
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
                                                {i18n._(t`ZAP`)}
                                                <CurrencyDollarIcon width={26} className={classNames(`text-white`)} />
                                                &rarr; {`${symbol}-${NATIVE[chainId].symbol} LP`}
                                            </div>
                                        </SubmitButton>
                                    </Wrap>

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
                                                    handleHarvest()
                                                }
                                            >
                                                <div className="flex text-lg gap-2">
                                                    <CircleStackIcon width={26} className={classNames(`text-white`)} />
                                                    {i18n._(t`HARVEST `)} {symbol}
                                                </div>
                                            </SubmitButton>
                                        </Wrap>
                                    )}
                                </Tab.Panel>
                            }
                            {!isActive &&
                                <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
                                    <div className={`grid ${'grid-cols-1'} w-[95%] rounded-md p-2px bg-dark-900`}>
                                        <Tab
                                            className={({ selected }) =>
                                                `${selected && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                    : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-avaxRed'
                                                        : 'bg-dark-900 text-white'
                                                } 
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1
                  ${!isActive ? "hover:border-avaxRed" : "hover:border-dark-600"}`
                                            }
                                        >
                                            {i18n._(t`EMERGENCY WITHDRAW`)}
                                        </Tab>
                                    {'Forfeits pending rewards.'}
                                    </div>
                                </Tab.List>
                            }

                            {/*------ WITHDRAW TAB PANEL ------*/}
                            <Tab.Panel className={'outline-none'}>
                                <Button variant={'link'} className="absolute top-0 right-0 flex justify-center max-h-[30px] max-w-[30px]">
                                    <QuestionHelper
                                        text={
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex flex-col">
                                                    <p>
                                                        {i18n._(t`Fees decrease by 1% daily, and only increase upon withdrawals.`)}
                                                        <br /><br />{i18n._(t`Depositing more is free and does not change your fee.`)}
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Button>
                                <div className={
                                    classNames(
                                        "flex flex-col mb-3 bg-dark-1000 p-3 border border-2 border-dark-1000",
                                        !isActive ? "hover:border-avaxRed"
                                            : "hover:border-dark-600",
                                        "w-full space-y-1")}>

                                    {Number(stakedBalance) > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {i18n._(t`Staked Balance`)}
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(stakedBalance, false, true)} {symbol}
                                            </Typography>
                                        </div>
                                    )}

                                    {stakedValue > 0 && (
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                {i18n._(t`Balance`)} (USD)
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
                                            {formatNumber(Number(stakedBalance) - withdrawable, false, true)} {symbol}
                                        </Typography>
                                    </div>

                                    <div className="flex justify-between">
                                        <Typography className="text-white" fontFamily={'medium'}>
                                            {i18n._(t`Fee`)} (USD)
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
                                {stakedBalance > 0 && !isEmergency &&
                                <FarmInputPanel
                                pid={pid}
                                onUserInput={(value) => setWithdrawValue(value)}
                                onMax={() => setWithdrawValue(stakedBalance.toString())}
                                value={withdrawValue}
                                balance={stakedBalance.toString()}
                                id={pid}
                                defarm={true}
                                />
                            }

                            {stakedBalance > 0 && !isEmergency &&
                                <Wrap 
                                    padding="0"
                                    margin="0"
                                    display="flex"
                                    >
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor={buttonColor}
                                        color={buttonTextColor}
                                        margin=".5rem 0 0rem 0"
                                        onClick={() => setShowConfirmation(true)}
                                    >
                                        {i18n._(t`WITHDRAW `)} {`${symbol}-${NATIVE[chainId].symbol} LP`}
                                    </SubmitButton>
                                </Wrap>
                            }
                                {/* EARNED */}
                                {earnedAmount > 0 && isActive && (
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleHarvest()
                                            }
                                        >
                                            {i18n._(t`HARVEST`) + ` ${symbol}`}
                                        </SubmitButton>
                                    </Wrap>
                                )}
                                {/* EMERGENCY WITHDRAW */}
                                {stakedBalance > 0 && isEmergency && (
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor={buttonColor}
                                            color={buttonTextColor}
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleEmergency()
                                            }
                                        >
                                            {i18n._(t`EMERGENCY WITHDRAW`)}
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
                        !isActive ? 'border-dark-900 hover:border-avaxRed' : 'border-dark-900 hover:border-dark-420'
                    }
                    className={classNames("border",
                        isActive ? "hover:border-dark-600"
                            : "hover:border-avaxRed",
                        "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >

                    {/* ZAP: NATIVE --> LP */}
                    <CurrencySearchModal.Controlled
                        chainId={chainId}
                        open={modalOpen}
                        onDismiss={handleDismissSearch}
                        onCurrencySelect={(value) => setZapToken(value.wrapped)}
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
                        showMax={true}
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

                    {/* {approvedZap &&  */}
                    <Wrap padding="0" margin="0" display="flex">
                        <SubmitButton
                            height="2rem"
                            primaryColor={buttonColor}
                            color={"#FFFFFF"}
                            className={'font-bold'}
                            margin=".5rem 0 0rem 0"
                            onClick={() =>
                                handleZap(zapToken.wrapped.address, depositAddress)
                            }
                        >
                            ZAP INTO PAIR
                        </SubmitButton>
                    </Wrap>
                    {/* } */}
                    <Typography className={`flex text-center mt-4 sm:mt-6 border border-[${getChainColor(chainId)}] p-2 rounded rounded-2xl`}>
                        {`Mind slippage and loses due to low liquidity. Avoid large amounts, if unsure.`}
                    </Typography>
                </Modal>
            }

            {showConfirmation && (
                <Modal isOpen={showConfirmation} onDismiss={
                    () => setShowConfirmation(false)}>
                    <div className="space-y-4">
                        <ModalHeader header={`FYI: Early Withdrawal Fee`} onClose={() => setShowConfirmation(false)} />
                        <Typography variant="sm">
                            <br /><br /> {i18n._(t`The fee`)} <b> {i18n._(t`reduces by 1% daily`)}</b>,  {i18n._(t`so consider waiting prior to withdrawing to avoid fees.`)}

                            <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-dark-600">
                                {i18n._(t`Estimated Fee Outcomes`)}
                            </div>
                            • <b> {i18n._(t`Current Rate`)}</b>: {Number(withdrawFee).toFixed(0)}% <br />
                            • <b> {i18n._(t`Fee Amount`)}</b>: {formatNumber(Number(withdrawFee) * Number(withdrawValue) / 100, false, true)} {"LP"}<br />
                            • <b> {i18n._(t`Fee Value`)}</b>: {formatNumber(Number(withdrawFee) * Number(withdrawValue) * Number(lpPrice) / 100, true, true)}

                            <div className="mt-6 text-center">
                                <i><b> {i18n._(t`Please do not rely on our estimations`)}</b></i>.
                            </div>

                            {/* <b>100% of the fee</b> goes towards building our protocol-owned liquidity, which brings about long-term sustainability to our platform. */}
                        </Typography>
                        <Typography variant="sm" className="font-medium text-center">
                            {i18n._(t`QUESTIONS OR CONCERNS?`)}
                            <a href="mailto:soulswapfinance@gmail.com">
                                {' '}  {i18n._(t`CONTACT US`)}
                            </a>
                        </Typography>
                        <Button
                            height="2.5rem"
                            color="purple"
                            onClick={() =>
                                handleWithdraw(withdrawValue)
                            }
                        >
                            {i18n._(t`I UNDERSTAND THESE TERMS`)}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    )
}