import React, { useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from 'services/web3'
import { Token } from 'sdk'
import { useSoulSummonerContract } from 'hooks/useContract'
import { Tab } from '@headlessui/react'
import { LendContentWrapper,
    LendContainer, LendItem, LendItemBox, SubmitButton
} from './Styles'
import { classNames, formatNumber, tryParseAmount } from 'functions'
import { useUnderworldPairInfo, useUnderworldUserInfo } from 'hooks/useAPI'
import Modal from 'components/DefaultModal'
import Typography from 'components/Typography'
import NavLink from 'components/NavLink'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { CurrencyLogo } from 'components/CurrencyLogo'

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

export const Row = ({ pair, lpToken }) => {
    const { account, chainId, library } = useActiveWeb3React()

    // const SoulSummonerContract = useSoulSummonerContract()

    const [showOptions, setShowOptions] = useState(false)
    const [openLend, setOpenLend] = useState(false)
    const [openBorrow, setOpenBorrow] = useState(false)
    
    const { underworldPairInfo } = useUnderworldPairInfo(pair.lpAddress)
    // const lpDecimals = Number(underworldPairInfo.decimals)
    // const assetAddress = underworldPairInfo.assetAddress
    const assetSymbol = underworldPairInfo.assetTicker
    const collateralSymbol = underworldPairInfo.collateralTicker
    // const collateralAddress = Number(underworldPairInfo.collateralAddress)
    const assetDecimals = Number(underworldPairInfo.assetDecimals)
    const collateralDecimals = Number(underworldPairInfo.collateralDecimals)
    const assetPrice = Number(underworldPairInfo.assetPrice)
    const collateralPrice = Number(underworldPairInfo.collateralPrice)
    // const interestPerSecond = Number(underworldPairInfo.interestPerSecond) / 1e16
    // const secondsPerYear = 86_400 * 365
    // const apr = interestPerSecond * secondsPerYear
    const { underworldUserInfo } = useUnderworldUserInfo(pair.lpAddress)
    const assetBalance = Number(underworldUserInfo.userAssetBalance) // 10**assetDecimals
    const borrowedAmount = Number(underworldUserInfo.userBorrowPart) / 10**assetDecimals
    const suppliedAmount = Number(underworldUserInfo.userBalance) // 10**lpDecimals
    const collateralAmount = Number(underworldUserInfo.userCollateralShare) / 10**collateralDecimals
    const walletValue = assetBalance * assetPrice
    const borrowedValue = borrowedAmount * assetPrice
    const collateralValue = collateralAmount * collateralPrice
    const suppliedValue = suppliedAmount * assetPrice
    
    const LTV = (1 - (collateralValue - borrowedValue) / collateralValue) * 100
    const leeway = (75 - LTV) / 100

    // const parsedBalance = tryParseAmount(assetBalance, pair.lpToken)
    // const userBalance = useCurrencyBalance(account, lpToken)
    // ONLY USED FOR LOGO //
    const asset = new Token(chainId, pair.assetAddress[chainId] ? pair.assetAddress[chainId] : pair.assetAddress[250], 18)
    const collateral = new Token(chainId, pair.collateralAddress[chainId] ? pair.collateralAddress[chainId] : pair.collateralAddress[250], 18)
    // const pair = new Token(chainId, pair.lpToken.address, 18)
    // console.log('lpAddress:%s', lpAddress)

    /**
     * Opens the function panel dropdowns.
     */
    const handleShowOptions = () => {
        setShowOptions(!showOptions)
        if (showOptions) {
            setOpenLend(false)
            setOpenBorrow(false)
        }
    }

    const handleShowLend = () => {
        setOpenLend(!openLend)
    }
   
    const handleShowBorrow = () => {
        setOpenBorrow(!openBorrow)
    }

    return (
        <>
        <div className="flex justify-center w-xl">

                <LendContainer>
                    <div className={classNames("bg-dark-900 p-4 rounded border hover:border-purple", assetBalance == 0 && "border-dark-1000",
                            assetBalance > 0 && "border-blue"
                    )}
                        onClick={() => handleShowOptions()}
                    >
                    <LendContentWrapper>
                            <div className="items-center">
                                <LendItemBox>
                               {/* <DoubleCurrencyLogo currency0={asset} currency1={collateral} size={40} /> */}
                               <div className="flex space-x-1">
                                <CurrencyLogo currency={asset} size={'40px'} />
                                <CurrencyLogo currency={collateral} size={'18px'} />
                                </div>
                                </LendItemBox>
                            </div>
                          
                            {/* <div className="items-center">
                                <LendItemBox>
                               <CurrencyLogo currency={asset} size={40} />
                                </LendItemBox>
                            </div> */}

                            {/* <div className="items-center">
                                <LendItemBox>
                               <CurrencyLogo currency={collateral} size={40} />
                                </LendItemBox>
                            </div> */}
      {/* <HideOnMobile>
        <LendItemBox>
            <LendItem>
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
            </LendItem>
        </LendItemBox>
    </HideOnMobile> */}
                            {/* 
                            // ASSET TICKER
                                <LendItemBox>
                                    <LendItem>
                                            { assetSymbol }
                                    </LendItem>
                                </LendItemBox>

                            // COLLATERAL TICKER
                                <HideOnMobile>
                                <LendItemBox>
                                    <LendItem>
                                            { collateralSymbol }
                                    </LendItem>
                                </LendItemBox>
                                </HideOnMobile> 
                            */}

                            {/* SUPPLIED AMOUNT */}
                                <LendItemBox>
                                    <LendItem>
                                       { suppliedAmount.toFixed(6).toString() == '0.000000' ? '0'
                                            : formatNumber(suppliedAmount, false, true)
                                        } { ' ' }
                                            { assetSymbol }
                                    </LendItem>
                                </LendItemBox>

                            {/* BORROWED AMOUNT */}
                                <LendItemBox>
                                    <LendItem>
                                       { formatNumber(borrowedAmount, false, true) } { assetSymbol }
                                    </LendItem>
                                </LendItemBox>

                            {/* COLLATERAL AMOUNT */}
                            <HideOnMobile>
                                <LendItemBox>
                                    <LendItem>
                                       { formatNumber(collateralAmount, false, true) } { collateralSymbol }
                                    </LendItem>
                                </LendItemBox>
                            </HideOnMobile>

                            {/* UTILIZATION */}
                            <HideOnMobile>
                                <LendItemBox>
                                    <LendItem>
                                    { formatNumber(LTV, false, true) }%                                    </LendItem>
                                </LendItemBox>
                            </HideOnMobile>

                            {/* STAKED OWNERSHIP */}
                            {/* <HideOnSmall>
                                <LendItemBox>
                                    <LendItem>
                                        {Number(suppliedValue).toFixed(0).toString() === '0' ? (
                                            <Text padding="0" fontSize="1rem" color="#666">
                                                0%
                                            </Text>
                                        ) : (
                                            <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                                {(Number(suppliedValue) / Number(liquidity) * 100).toFixed(0)}%
                                            </Text>
                                        )}
                                    </LendItem>
                                </LendItemBox>
                            </HideOnSmall> */}

                            {/* % APR */}
                            {/* <LendItemBox>
                                <LendItem>
                                    {Number(apr).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                            {Number(apr).toFixed()}%
                                        </Text>
                                    )}
                                </LendItem>
                            </LendItemBox> */}

                            {/* REWARDS VALUE */}
                            {/* <LendItemBox className="flex">
        {Number(earnedValue).toFixed(0).toString() === '0' ? (
            <Text padding="0" fontSize="1rem" color="#666">
                0
            </Text>
        ) : (
            <Text padding="0" fontSize="1rem" color="#F36FFE">
                ${Number(earnedValue).toFixed(0)}
            </Text>
        )}
    </LendItemBox> */}

                            {/* <LendItemBox className="flex">
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
                            </LendItemBox> */}

                        </LendContentWrapper>
                    </div>
                </LendContainer>
            </div>


            {/*------ DROPDOWN OPTIONS PANEL ------*/}
            {showOptions && (
                <Modal
                    isCustom={true}
                    isOpen={showOptions}
                    onDismiss={() => handleShowOptions()}
                    borderColor={'border-dark-900 hover:border-blue'}
                    className={classNames("border hover:border-dark-600", "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >
                    <div className="p-3 space-y-6 bg-dark-900 rounded z-1 relative">
                        <Tab.Group>
                            <Tab.List className="flex items-center justify-center mb-1 space-x-2 p-3px text-white">
                                <div className="grid grid-cols-2 w-[95%] rounded-md p-2px bg-dark-900">
                                    <Tab
                                        className={({ selected }) => `${selected ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                        : 'bg-dark-900 text-white'}
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 
                  ${ "hover:border-dark-600" }`}
                                    >
                                        LEND
                                    </Tab>
                                    <Tab
                                        className={({ selected }) => `${selected ? 'border-b-2 border-accent p-2 text-white border-dark-600'
                                                        : 'bg-dark-900 text-white'} 
                  flex items-center justify-center px-3 py-1.5 semi-bold font-semibold border border-dark-800 border-1 hover:border-dark-600`}
                                    >
                                        BORROW
                                    </Tab>
                                </div>
                            </Tab.List>

                            {/*------ DEPOSIT TAB PANEL ------*/}
                            <Tab.Panel className={'outline-none'}>

                                <div className={classNames(
                                    "flex flex-col bg-dark-1000 mb-3 p-3 border border-2 border-dark-1000",
                                    "hover:border-blue", "w-full space-y-1")}>

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Wallet Balance
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {
                                                    // isFTM
                                                    //     ? formatNumber(nativeBalance, false, true) + ' FTM'
                                                        // : 
                                                        formatNumber(assetBalance, false, true) + ' ' + assetSymbol
                                                }
                                            </Typography>
                                        </div>

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Balance (USD)
                                            </Typography>
                                            <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(walletValue, true, true)}
                                            </Typography>
                                        </div>
                                        
                                        <div className="h-px my-6 bg-dark-1000" />

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Supplied Assets
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(suppliedAmount, false, true)} {assetSymbol}
                                            </Typography>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Supplied (USD)
                                            </Typography>
                                            <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(suppliedValue, true, true)}
                                            </Typography>
                                        </div>

                                    {/* {Number(assetBalance) > 0 && (
                                        <div className="h-px my-6 bg-dark-1000" />
                                    )} */}

                                    {/* <div className="h-px my-1 bg-dark-1000" />

                                    <div className="h-px my-6 bg-dark-1000" />
                                    <div className="flex flex-col bg-dark-1000 mb-2 p-3 border border-green border-1 hover:border-dark-600 w-full space-y-1">
                                        <div className="text-white">
                                            <div className="block text-md md:text-xl text-white text-center font-bold p-1 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                                                <span> {formatNumber(Number(apr), false, true)}% APR</span>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>

                                {/* <div className="h-px my-1 bg-dark-1000" /> */}

                                {/* DEPOSIT: ASSET PANEL */}
                                {/* <FarmInputPanel
                                    pid={pair.pid}
                                    onUserInput={(value) => setDepositValue(value)}
                                    onMax={() => setDepositValue(walletBalance)}
                                    value={depositValue}
                                    balance={walletBalance}
                                    id={pid}
                                    token0={asset}
                                    token1={collateral} /> */}

                                {/* LEND ASSET */}
                                <NavLink
                                    href={`/lend/${pair.lpAddress}`}
                                 >
                                     <SubmitButton
                                        height="2rem"
                                        primaryColor="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                    >
                                       
                                            LEND {assetSymbol}
                                    </SubmitButton>
                                </NavLink>
                                    {/* <SubmitButton
                                                height="2rem"
                                                primaryColor="#B485FF"
                                                color="black"
                                                margin=".5rem 0 .5rem 0"
                                                onClick={() => handleShowLend()}>
                                                LEND {assetSymbol}
                                    </SubmitButton> */}

                                {/* UN-APPROVED */}
                                {/* {!approved && (
                                    <FunctionBox>
                                        <Wrap padding="0" margin="0" display="flex">
                                            <SubmitButton
                                                height="2rem"
                                                primaryColor="#B485FF"
                                                color="black"
                                                margin=".5rem 0 .5rem 0"
                                                onClick={() => handleApprove()}>
                                                APPROVE {pairType == "farm" ? 'LP' : assetSymbol}
                                            </SubmitButton>
                                        </Wrap>
                                    </FunctionBox>
                                )} */}

                                {/* APPROVED */}
                                {/* {approved && (
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor="#B485FF"
                                        color="black"
                                        margin=".5rem 0 0rem 0"
                                        onClick={() => handleDeposit(pid)}
                                    >
                                        DEPOSIT {assetSymbol}
                                    </SubmitButton>
                                )} */}

                            </Tab.Panel>

                            {/*------ WITHDRAW TAB PANEL ------*/}
                            <Tab.Panel className={'outline-none'}>

                                <div className={classNames(
                                    "flex flex-col mb-3 bg-dark-1000 p-3 border border-2 border-dark-1000",
                                     "hover:border-blue", "hover:border-dark-600", "w-full space-y-1")}>
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Borrowed Assets
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(borrowedAmount, false, true)} { assetSymbol }
                                            </Typography>
                                        </div>

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Borrowed (USD)
                                            </Typography>
                                            <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(borrowedValue, true, true)}
                                            </Typography>
                                        </div>

                                    <div className="h-px my-6 bg-dark-1000" />

                                    <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Collateral Provided
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(collateralAmount, false, true)} { collateralSymbol }
                                            </Typography>
                                        </div>

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Collateral (USD)
                                            </Typography>
                                            <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(collateralValue, true, true)}
                                            </Typography>
                                        </div>

                                        <div className="h-px my-6 bg-dark-1000" />


                                        
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Borrow Limit
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(collateralValue * 0.75 / assetPrice, false, true)} { assetSymbol }
                                            </Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Limit (USD)
                                            </Typography>
                                            <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(collateralValue * 0.75, true, true)}
                                            </Typography>
                                        </div>

                                        <div className="h-px my-6 bg-dark-1000" />

                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Borrow Available
                                            </Typography>
                                            <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(100 - LTV, false, true)}%
                                            </Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography className="text-white" fontFamily={'medium'}>
                                                Available (USD)                             
                                            </Typography>
                                            <Typography className="text-dark-600" weight={600} fontFamily={'semi-bold'}>
                                                {formatNumber(leeway * collateralValue, true, true)}
                                            </Typography>
                                        </div>
                                        

                                    {/* FEE BOX (COLOR-CODED) */}
                                    {/* {Number(withdrawFee) > 0 && (
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
                                    )} */}
                                </div>

                                {/* WITHDRAW: ASSET PANEL */}
                                {/* <FarmInputPanel
                                    pid={pair.pid}
                                    onUserInput={(value) => setWithdrawValue(value)}
                                    onMax={() => setWithdrawValue(stakedBalance)}
                                    value={withdrawValue}
                                    balance={stakedBalance}
                                    id={pid}
                                    token0={asset}
                                    token1={collateral} />
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor="#B485FF"
                                        color="black"
                                        margin=".5rem 0 0rem 0"
                                        onClick={() =>
                                            // handleWithdraw(pid)
                                            setShowConfirmation(true)}
                                    >
                                        WITHDRAW {assetSymbol}
                                    </SubmitButton>
                                </Wrap> */}
                                {/* BORROW ASSET */}
                                {/* <SubmitButton
                                    height="2rem"
                                    primaryColor="#B485FF"
                                    color="black"
                                    margin=".5rem 0 .5rem 0"
                                    onClick={() => handleShowBorrow()}>
                                    BORROW {assetSymbol}
                                </SubmitButton> */}
                                 <NavLink
                                    href={`/borrow/${pair.lpAddress}`}
                                 >
                                     <SubmitButton
                                        height="2rem"
                                        primaryColor="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                    >
                                       
                                            BORROW {assetSymbol}
                                    </SubmitButton>
                                </NavLink>
                            </Tab.Panel>
                        </Tab.Group>
                    </div>
                </Modal>
            )}

             {openLend && (
                <Modal
                    isCustom={true}
                    isOpen={openLend}
                    onDismiss={() => handleShowLend()}
                    borderColor={'border-dark-900 hover:border-blue'}
                    className={classNames("border hover:border-dark-600", "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >
                <iframe
                frameBorder={"none"}
				title={"Underworld"}
				src={`https://soul.sh/lend/${pair.lpAddress}`}
				height={'500px'}
                />
                </Modal>
             )}
             {openBorrow && (
                <Modal
                    isCustom={true}
                    isOpen={openBorrow}
                    onDismiss={() => handleShowBorrow()}
                    borderColor={'border-dark-900 hover:border-blue'}
                    className={classNames("border hover:border-dark-600", "p-4 mt-3 mb-3 sm:p-0.5 w-full")}
                >
                <iframe
                frameBorder={"none"}
				title={"Underworld"}
				src={`https://soul.sh/borrow/${pair.lpAddress}`}
				height={'500px'}
                />
                </Modal>
             )}
        </>
)}