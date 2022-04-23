import React, { useState, useEffect, useContext, createContext, ReactNode, FC } from 'react'
import styled from 'styled-components'
import { BigNumber, ethers } from 'ethers'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
// import QuestionHelper from '../../components/QuestionHelper'
import { JSBI, Percent, Token } from 'sdk'
import { useRouterContract, useSoulSummonerContract } from 'hooks/useContract'
import useApprove from 'features/bond/hooks/useApprove'
import { Tab } from '@headlessui/react'

import { FarmContentWrapper,
    FarmContainer, FarmItem, FarmItemBox, Text, FunctionBox, SubmitButton, Wrap
} from './Styles'
import { classNames, formatNumber, tryParseAmount } from 'functions'
import { usePairInfo, useSummonerPoolInfo, useSummonerUserInfo } from 'hooks/useAPI'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import Modal from 'components/DefaultModal'
import { Button } from 'components/Button'
import Typography from 'components/Typography'
// import Modal from 'components/Modal/DefaultModal'
import ModalHeader from 'components/Modal/Header'

// import ExternalLink from 'components/ExternalLink'
import NavLink from 'components/NavLink'
import FarmInputPanel from './Input'
import { CurrencyLogo } from 'components/CurrencyLogo'
import QuestionHelper from 'components/QuestionHelper'

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
    const [depositing, setDepositing] = useState(false)

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
    const pairType = summonerPoolInfo.pairType
    const pairStatus = summonerPoolInfo.status
    
    const { pairInfo } = usePairInfo(farm.lpAddresses[250])
    // const lpSymbol = pairInfo.lpSymbol
    // const assetAddress = pairInfo.address
    // console.log(assetAddress)
    const assetDecimals = Number(pairInfo.pairDecimals)
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
    const stakedValue = Number(summonerUserInfo.stakedValue)
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue
    const lpPrice = Number(summonerUserInfo.lpPrice)
    // const timeDelta = summonerUserInfo.timeDelta
    // const secondsRemaining = summonerUserInfo.secondsRemaining
    const withdrawFee = summonerUserInfo.currentRate
    const feeAmount = Number(withdrawFee) * Number(stakedBalance) / 100
    const withdrawable = Number(stakedBalance) - feeAmount
    const feeValue = feeAmount * lpPrice
    const walletBalance = summonerUserInfo.walletBalance
    const walletValue = Number(walletBalance) * Number(lpPrice)
    const parsedBalance = tryParseAmount(walletBalance, farm.lpToken)
    // const userBalance = useCurrencyBalance(account, lpToken)
    const hasBalance = Number(walletBalance) > 0
    const isFarmer = Number(stakedBalance) > 0
    const isUnderworldPair = pairType == "underworld"
    const isSwapPair = pairType == "farm"
    const isActive = pairStatus == "active"

    // COLOR //
    const buttonColor = isUnderworldPair ? "#0993EC" : !isActive ? "#F338C3" : "#B485FF"
    const buttonTextColor = isSwapPair && isActive ? "black" : "white"
    const textColor = isUnderworldPair ? "text-blue" : !isActive ? "text-pink" : "text-dark-600"
    const tokenSymbol = isUnderworldPair ? token0Symbol : "LP"
    
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
            const tx = await SoulSummonerContract?.withdraw(pid, Number(withdrawValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            const tx = await SoulSummonerContract?.withdraw(pid, Number(withdrawValue).toFixed(6).toBigNumber(assetDecimals))
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
            const tx = await SoulSummonerContract?.deposit(pid, Number(depositValue).toFixed(assetDecimals).toBigNumber(assetDecimals))
            await tx.wait()
        } catch (e) {
            const tx = await SoulSummonerContract?.deposit(pid, Number(depositValue).toFixed(6).toBigNumber(assetDecimals))
            // alert(e.message)
            console.log(e)
        }
    }

    return (
        <>
            <div className="flex justify-center w-full">
                <FarmContainer>
                    <div className={classNames("bg-dark-900 p-3 border", !hasBalance && "border-dark-1000",
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
                  `${
                    selected && !isUnderworldPair && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                    : selected && isUnderworldPair ? 'border-b-2 border-accent p-2 text-white border-[#0993EC]' 
                    : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-pink'
                    : 'bg-dark-900 text-white'
                  }
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 
                  ${
                        isUnderworldPair ? "hover:border-blue" 
                        : !isActive ? "hover:border-pink"
                        : "hover:border-dark-600"
                    }`
                }
              >
                DEPOSIT
              </Tab>
              <Tab
                className={({ selected }) =>
                  `${
                      selected && !isUnderworldPair && isActive ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                      : selected && isUnderworldPair ? 'border-b-2 border-accent p-2 text-white border-[#0993EC]' 
                      : selected && !isActive ? 'border-b-2 border-accent p-2 text-white border-pink'
                  : 'bg-dark-900 text-white'                  
                } 
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1
                  ${
                        isUnderworldPair ? "hover:border-blue" 
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

              <Button variant={'link'} color={'purple'} className="absolute top-0 right-0 flex">
                <QuestionHelper
                  text={
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col">
                        <p>
                        After creating liquidity or lending, navigate to the associated farm to deposit. 
                        <br/><br/><b>Note:</b> there's a 14% Early Withdraw Fee, which decreases by 1% daily.
                        </p>
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
                    
                { Number(walletBalance) > 0 && (
                <div className="flex justify-between">
                    <Typography className="text-white font-bold" fontFamily={'medium'}>
                        Wallet Balance
                    </Typography>
                    <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                        { formatNumber(walletBalance, false, true) } { tokenSymbol }
                    </Typography>
                </div>
                )}

                { Number(walletValue) > 0 && (
                    <div className="flex justify-between">
                    <Typography className="text-white" fontFamily={'medium'}>
                            Balance (USD)
                        </Typography>
                        <Typography className={ textColor } weight={600} fontFamily={'semi-bold'}>
                            { formatNumber(walletValue, true, true) }
                        </Typography>
                    </div>
                )}
                
                { Number(walletBalance) > 0 && (
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
                  <Typography className={ textColor } weight={600} fontFamily={'semi-bold'}>
                  { formatNumber(earnedValue, true, true) }
                  </Typography>
                </div>

                <div className="h-px my-1 bg-dark-1000" />

                <div className="h-px my-6 bg-dark-1000" />
                <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-dark-600 w-full space-y-1">
                    <div className="text-white">
                        <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                            <span> { formatNumber(Number(apr), false, true) }% APR</span>
                        </div>
                    </div>
                </div>
              </div>

              <div className="h-px my-1 bg-dark-1000" />

        {/* DEPOSIT: ASSET PANEL */}
        <FarmInputPanel
            pid={ farm.pid }
            onUserInput={ (value) => setDepositValue(value) }
            onMax={ () => setDepositValue(walletBalance) }
            value={ depositValue }
            balance={ walletBalance }
            id={ pid }
            token0={ token0 } 
            token1={ token1 }
        />

            {/* LEND ASSET */}
              { isUnderworldPair && (
                        <SubmitButton
                            height="2rem"
                            primaryColor={ buttonColor }
                            color={ buttonTextColor }
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
            {/* UN-APPROVED */}
            {!approved &&  (
                    <FunctionBox>
                        <Wrap padding="0" margin="0" display="flex">
                            <SubmitButton 
                                height="2rem"
                                primaryColor={ buttonColor }
                                color={ buttonTextColor }
                                margin=".5rem 0 .5rem 0"
                                onClick={() => handleApprove()}>
                                APPROVE { tokenSymbol }
                            </SubmitButton>
                        </Wrap>
                    </FunctionBox>
            )}

            {/* APPROVED */}
            {approved && (
                <SubmitButton
                    height="2rem"
                    primaryColor={ buttonColor }
                    color={ buttonTextColor }
                    margin=".5rem 0 0rem 0"
                    onClick={() =>
                        handleDeposit(pid)
                    }
                >
                    DEPOSIT { tokenSymbol }
                </SubmitButton>
            )}

            {/* EARNED */}
            {Number(earnedAmount) > 0 && (
                <Wrap padding="0" margin="0" display="flex">
                        <SubmitButton
                            height="2rem"
                            primaryColor={ buttonColor }
                            color={ buttonTextColor }
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

        {/*------ WITHDRAW TAB PANEL ------*/}
            <Tab.Panel className={'outline-none'}>

              <div className={
                  classNames(
                    "flex flex-col mb-3 bg-dark-1000 p-3 border border-2 border-dark-1000",
                    isUnderworldPair ? "hover:border-blue" 
                    : !isActive ? "hover:border-pink"
                    : "hover:border-dark-600",                    
                    "w-full space-y-1")}>
                    
                { Number(stakedBalance) > 0 && (
                <div className="flex justify-between">
                        <Typography className="text-white" fontFamily={'medium'}>
                            Staked Balance
                        </Typography>
                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                            {formatNumber(stakedBalance, false, true)} { tokenSymbol }
                        </Typography>
                </div>
                )}

                { Number(stakedValue) > 0 && (
                    <div className="flex justify-between">
                    <Typography className="text-white" fontFamily={'medium'}>
                            Balance (USD)
                        </Typography>
                        <Typography className={ textColor } weight={600} fontFamily={'semi-bold'}>
                            {formatNumber(stakedValue, true, true)}
                        </Typography>
                    </div>
                )}
                { Number(stakedBalance) > 0 && (
                    <div className="h-px my-6 bg-dark-1000" />
                )}

                <div className="flex justify-between">
                    <Typography className="text-white" fontFamily={'medium'}>
                            Maximum Fee
                        </Typography>
                        <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                            { formatNumber(Number(stakedBalance) - withdrawable, false, true) } { tokenSymbol }
                        </Typography>
                </div>
                
                <div className="flex justify-between">
                    <Typography className="text-white" fontFamily={'medium'}>
                            Fee (USD)
                        </Typography>
                        <Typography className={ textColor } weight={600} fontFamily={'semi-bold'}>
                            { formatNumber(Number(feeValue), true, true) }
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
                                { (Number(withdrawFee)).toFixed(0) }% FEE
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
                                { (Number(withdrawFee)).toFixed(0) }% FEE
                            </span>
                        </div>
                    </div>
                </div>
                )}
              </div>
             
            {/* WITHDRAW: ASSET PANEL */}
            <FarmInputPanel
                pid={farm.pid}
                onUserInput={ (value) => setWithdrawValue(value) }
                onMax={ () => setWithdrawValue(stakedBalance) }
                value={ withdrawValue }
                balance={ stakedBalance }
                id={pid}
                token0={token0}
                token1={token1} 
            />
            <Wrap padding="0" margin="0" display="flex">

                <SubmitButton
                    height="2rem"
                    primaryColor={ buttonColor }
                    color={ buttonTextColor }
                    margin=".5rem 0 0rem 0"
                    onClick={() =>
                        // handleWithdraw(pid)
                        setShowConfirmation(true)
                    }
                >
                    WITHDRAW { token0Symbol }
                </SubmitButton>

            </Wrap>
        {/* EARNED */}
            {Number(earnedAmount) > 0 && (
                <Wrap padding="0" margin="0" display="flex">
                        <SubmitButton
                            height="2rem"
                            primaryColor={ buttonColor }
                            color={ buttonTextColor }
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
            • <b>Current Rate</b>: {Number(withdrawFee).toFixed(0)}% <br/>
            • <b>Fee Amount</b>: {formatNumber(Number(withdrawFee)*Number(withdrawValue) / 100, false, true)} {tokenSymbol }<br/>
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