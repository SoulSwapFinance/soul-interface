import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
// import { ethers } from 'ethers'
import { useFantomPrice, useLuxorPrice, useTokenPrice } from 'hooks/getPrices'
import { usePairPrice } from 'hooks/usePairData'
import { useActiveWeb3React } from 'services/web3'
// import QuestionHelper from '../../components/QuestionHelper'
import { Token } from 'sdk'
import AssetInput from 'components/AssetInput'
import { useLuxorBondContract } from 'hooks/useContract'
// import { useBondContract, useStakeSharePrice, useStakeRecentProfit, sharesFromSoul } from './useBonds'
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
    SubmitButton,
} from './Styles'
import { Wrap, Text, ExternalLink } from '../../components/ReusableStyles'
import { formatNumber, tryParseAmount } from 'functions'
// import { useCurrencyBalance, useTokenBalance } from 'state/wallet/hooks'
import { useApproveCallback } from 'hooks/useApproveCallback'
import Modal from 'components/Modal/DefaultModal'
import Typography from 'components/Typography'
import ModalHeader from 'components/Modal/Header'
import { useLuxorBondInfo } from 'hooks/useAPI'
import { WFTM_ADDRESS } from 'constants/addresses'

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

const LuxorRowRender = ({ pid, stakeToken, assetAddress, assetName, term, bondAddress, bond }) => {
    const { account, chainId } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(stakeToken)
    const [showing, setShowing] = useState(false)
    const BondContract = useLuxorBondContract()
    const BondContractAddress = BondContract.address
    const [approved, setApproved] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    const token = new Token(chainId, assetAddress, 18)
    const parsedDepositValue = tryParseAmount(depositValue, token)

    const [payout, setStakedBal] = useState(0)
    const [earnedAmount, setEarnedAmount] = useState(0)
    const [unstakedBal, setUnstakedBal] = useState(0)
    
    const LUX_DAI_ADDRESS = '0x46729c2AeeabE7774a0E710867df80a6E19Ef851'
    const LUX_FTM_ADDRESS = '0x951BBB838e49F7081072895947735b0892cCcbCD'
    const LUX_SOR_ADDRESS = '0x622E69B6785311800B0d55D72fF27D91F5518212'
    const SOR_FTM_ADDRESS = '0xdfB2218b48627794711E6cFd72e26c541E456F6F'

    // const [discount, setDiscount] = useState(0)
    // const [bondPrice, setBondPrice] = useState(0)
    // const [available, setAvailabile] = useState(false)
    // const { deposit, withdraw } = useBondContract()
    const luxPrice = useLuxorPrice()
    const assetToken = new Token(250, assetAddress, 18, assetName)
    const wftmPrice = useFantomPrice()
    const luxDaiPrice = usePairPrice(LUX_DAI_ADDRESS) // √
    // console.log('luxDaiPrice:%s', Number(luxDaiPrice))
    const luxFtmPrice = usePairPrice(LUX_FTM_ADDRESS) // √
    const luxSorPrice = usePairPrice(LUX_SOR_ADDRESS) // √
    const sorFtmPrice = usePairPrice(SOR_FTM_ADDRESS) // √
    // console.log('luxSorPrice:%s', Number(luxSorPrice))
    
    let assetPrice = 0
    assetPrice 
        = assetToken.address == WFTM_ADDRESS[250] ? wftmPrice
            : assetToken.address == LUX_DAI_ADDRESS ? luxDaiPrice
            : assetToken.address == LUX_FTM_ADDRESS ? luxFtmPrice
            : assetToken.address == LUX_SOR_ADDRESS ? luxSorPrice
            : assetToken.address == SOR_FTM_ADDRESS ? sorFtmPrice
            : 1
    // const assetPrice = useTokenPrice(assetToken.address)
    // console.log('assetPrice:%s', assetPrice)

    const [approvalState, approve] = useApproveCallback(parsedDepositValue, bond?.address)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showDefaultConfirmation, setShowDefaultConfirmation] = useState(false)
    const [showAvailabilityMsg, setShowAvailabilityMsg] = useState(false)

    const { luxorBondInfo } = useLuxorBondInfo(bondAddress)
    const bondPriceNormal = Number(luxorBondInfo.price) / 1e18
    const discountNormal = Number(luxorBondInfo.discount)
    const luxPriceAdj = luxPrice * 1.25//(delta23 * 100 / assetPrice )
    const bondPrice 
        = bond.assetAddress == SOR_FTM_ADDRESS 
            ?  bondPriceNormal / luxPriceAdj 
            : bond.assetAddress == LUX_FTM_ADDRESS
            ?  bondPriceNormal / 3.5
            : bondPriceNormal
    const deltaSpecial = luxPrice - bondPrice //.78
    // const bondSpecial = bond.assetAddress == SOR_FTM_ADDRESS || bond.assetAddress == LUX_FTM_ADDRESS
    const discount 
        = (bond.assetAddress == SOR_FTM_ADDRESS
          && deltaSpecial > 0)
        ? deltaSpecial / luxPrice * 100
        : (bond.assetAddress == LUX_FTM_ADDRESS
          && deltaSpecial > 0)
        ? deltaSpecial / luxPrice * 100
        : discountNormal
    const status = luxorBondInfo.status
    const maxDebt = Number(luxorBondInfo.maximumDebt)
    const available 
        = maxDebt > 0 && bond.status != 'closed'

    // const remainingDebt = luxorBondInfo.remainingDebt
    // const maximumDebt = luxorBondInfo.maximumDebt
    // const availRatio = Number(remainingDebt) <= 0 ? 0 : Number(remainingDebt) / Number(maximumDebt) * 100
    // const available = Number(remainingDebt) > 0 ? true : false
    // console.log('remainingDebt:%s', remainingDebt)
    // console.log('discount:%s', discount)

    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
        // fetchDiscount()
        fetchEarnings()
        fetchPayout()
        fetchApproval()
    }, [account])

    /**
     * Runs on initial render/mount and reruns every 2 seconds
     */
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                if (showing) {
                    fetchEarnings()
                    fetchApproval()
                }
            }, 5_000)
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
            fetchPayout()
            fetchEarnings()
            fetchApproval()
        }
    }

    /**
     * Checks the Discount Amount
     */
    // const fetchDiscount = async () => {
    //     try {
    //         const result = await BondContract?.bondPriceUsd(bondAddress)
    //         const bondPrice = result / 1e18
    //         // console.log('luxPrice:%s', luxPrice)
    //         // console.log('bondPrice:%s', bondPrice)
    //         setBondPrice(bondPrice)
    //         const diff = Number(luxPrice) - Number(bondPrice)
    //         const disc = diff / luxPrice * 100
    //         const discount = diff <= 0 ? 0 : disc
    //         // console.log('discount:%s', discount)
    //         setDiscount(Number(discount))
    //     } catch (e) {
    //         console.warn(e)
    //     }
    // }

    /**
     * Checks the Availability Amount
     */
    // const fetchAvailability = async () => {
    //     try {
    //         const result1 = await BondContract?.totalDebt(bondAddress)
    //         const totalDebt = result1 / 1e18
    //         const result2 = await BondContract?.maximumDebt(bondAddress)
    //         const maxDebt = result2 / 1e18
    //         // console.log('luxPrice:%s', luxPrice)
    //         // console.log('bondPrice:%s', bondPrice)
    //         const diff = Number(maxDebt) - Number(totalDebt)
    //         const available = diff <= 0 ? false : true
    //         // console.log('discount:%s', discount)
    //         setAvailabile(available)
    //     } catch (e) {
    //         console.warn(e)
    //     }
    // }

    /**
     * Gets the lpToken balance of the user for each pool
     */
    const fetchPayout = async () => {
        if (!account) {
            // alert('connect wallet')
        } else {
            try {
                const result = await BondContract?.bondInfo(bondAddress)
                const payout = result[0] / 1e9
                setStakedBal(Number(payout))
                // console.log('payout:%s', Number(payout))
                const asset = await BondContract.principle(bondAddress)
                const balance = await erc20BalanceOf(account)
                const userBal = balance / 1e18
                // console.log('unstaked:%s', Number(userBal))

                setUnstakedBal(Number(userBal))

                return [payout, userBal]
            } catch (err) {
                console.warn(err)
            }
        }
    }

    /**
    * Gets the earned amount of the user for each pool
    */
    const fetchEarnings = async () => {
        if (!account) {
            // alert('connect wallet')
        } else {
            try {
                const result = await BondContract?.pendingPayout(bondAddress)
                const payout = result / 1e9
                // console.log('profit:%s', payout)

                setEarnedAmount(Number(payout))
                // console.log('payout:%s', Number(payout))

                return [payout]
            } catch (err) {
                console.warn(err)
            }
        }
    }

    /**
     * Checks if the user has approved BondContractAddress to move lpTokens
     */
     const fetchApproval = async () => {
        if (!account) {
        } else {
            // Checks if BondContractAddress can move tokens
            const amount = await erc20Allowance(account, BondContractAddress)
            if (amount > 0) setApproved(true)
            return amount
        }
    }

    /**
     * Approves BondContractAddress to move lpTokens
     */
    const handleApprove = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(BondContractAddress)
                await tx?.wait().then(await fetchApproval())
            } catch (e) {
                // alert(e.message)
                console.log(e)
                return
            }
        }
    }

    // const handleHarvestAll = async () => {
    //     try {
    //         let tx
    //         tx = await BondContract.harvestAll(false)
    //         // await tx?.wait().then(await setPending(pid))
    //         await tx?.wait()
    //     } catch (e) {
    //         // alert(e.message)
    //         console.log(e)
    //     }
    // }

    // /**
    //  * Harvest Shares
    //  */
    const handleClaim = async () => {
        try {
            let tx
            tx = await BondContract?.harvest(bondAddress, false)
            await tx?.wait().then(await fetchEarnings())
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    /**
     * Handles Deposit
     */
    const handleDeposit = async (amount) => {
        try {
            const tx = await BondContract?.deposit(parsedDepositValue?.quotient.toString(), 2, bondAddress)
            await tx.wait()
            await fetchPayout()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    return (
        <>
            <Wrap padding="0" display="flex" justifyContent="center">
                <StakeContainer>
                    { (Number(earnedAmount) > 0 || available) &&
                    <Row onClick={() => handleShow()}>
                        <StakeContentWrapper>
                            <TokenPairBox>
                                { bond.token2Address && <Wrap className="flex-cols-2">
                                    <TokenLogo
                                        src={
                                            'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                                            bond.token1Address +
                                            '/logo.png'
                                        }
                                        alt="LOGO"
                                        width="38px"
                                        height="38px"
                                        objectFit="contain"
                                        className="rounded-full items-center justify-center text-center"
                                    />
                                    <TokenLogo
                                        src={
                                            'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                                            bond.token2Address +
                                            '/logo.png'
                                        }
                                        alt="LOGO"
                                        width="38px"
                                        height="38px"
                                        objectFit="contain"
                                        className="rounded-full items-center justify-center text-center"
                                    />
                                </Wrap>}
                                { !bond.token2Address && <Wrap>
                                    <TokenLogo
                                        src={
                                            'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                                            bond.token1Address +
                                            '/logo.png'
                                        }
                                        alt="LOGO"
                                        width="76px"
                                        height="44px"
                                        objectFit="contain"
                                        className="rounded-full items-center justify-center text-center"
                                    />
                                </Wrap>}
                            </TokenPairBox>
                            
                            <StakeItemBox className="flex">
                                <StakeItem>
                                    {Number(bondPrice).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                            ${                                             
                                                Number(bondPrice).toFixed(2)
                                            }
                                        </Text>
                                    )}
                                </StakeItem>
                            </StakeItemBox>

                            <StakeItemBox className="flex">
                                <StakeItem>
                                    {discount.toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : discount > 0 ? (
                                        <Text padding="0" fontSize="1rem" color="#4EFF4E">
                                            {Number(discount).toFixed(0)}%
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FF4E4E">
                                            {Number(discount).toFixed(0)}%
                                        </Text>
                                    )}
                                </StakeItem>
                            </StakeItemBox>
                            <StakeItemBox className="flex">
                                {Number(payout).toFixed(2).toString() === '0.00' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#4EFF4E">
                                        {formatNumber(payout, false, true)}
                                    </Text>
                                )}
                            </StakeItemBox>
                            <StakeItemBox className="flex" >
                                { 
                                    <Text padding="0" fontSize="1rem">
                                        {term}
                                    </Text>
                                }

                            </StakeItemBox>

                        </StakeContentWrapper>
                    </Row>
                }
                </StakeContainer>
            </Wrap>

            { showing && earnedAmount > 0 && !available &&
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="#3Eff3E"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleClaim()
                                            }
                                        >
                                            CLAIM LUXOR
                                        </SubmitButton>
                                    </Wrap>
            }
            { showing && !available &&
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="red"
                                            color="white"
                                            margin=".5rem 0 .5rem 0"
                                            // onClick={() =>
                                            //     handleClaim()
                                            // }
                                        >
                                            RETIRED BOND
                                        </SubmitButton>
                                    </Wrap>
            }

            { showing && available && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <DetailsContainer>
                        <DetailsWrapper>
                        {/* <Wrap  padding="0" margin="0" justifyContent="center">
                            <div className="grid mt-2 justify-between grid-cols-2 text-center">
                                <b>Deposit Value</b> ~${ Number(Number(assetPrice) * Number(depositValue)).toFixed(0) }
                                <b>Claim Amount</b> ~{ Number(Number(depositValue) * Number(assetPrice) * 0.85 / Number(bondPrice)).toFixed(0) } LUX
                            </div>
                        </Wrap> */}
                    { payout == 0 ? (
                        <FunctionBox>
                            <AssetInput
                                currencyLogo={false}
                                currency={assetToken}
                                currencyAddress={assetAddress}
                                value={depositValue}
                                // balance={tryParseAmount(account, assetToken)}
                                showBalance={true}
                                onChange={setDepositValue}
                                showMax={false}
                            />
                            <Wrap padding="0" margin="0" display="flex" justifyContent="center">
                            {(approved &&
                                Number(unstakedBal) == 0) ? (
                                <TokenPairLink
                                    target="_blank"
                                    rel="noopener"
                                    text-color="#FFB857" // golden orange/yellow
                                    href=
                                    {`https://exchange.soulswap.finance/swap`}
                                >
                                <div className="text-yellow justify-center items-center text-center">
                                CLICK HERE TO ACQUIRE BOND ASSETS</div>
                                </TokenPairLink>
                        ) :
                                // approved (&& available) ?
                                (approved && available) ? (
                                        <SubmitButton
                                            primaryColor="#EDC100"
                                            color="black"
                                            height="2rem"
                                            // onClick={() => handleDeposit(depositValue)}>
                                            onClick={() => setShowDefaultConfirmation(true)}>
                                            DEPOSIT {assetName}
                                        </SubmitButton>
                                    // ) : !available ?
                                    // (    <SubmitButton
                                    //     height="2rem" 
                                    //     primaryColor="#FF3E3E"
                                    //     color="black"
                                    //     onClick={() => setShowAvailabilityMsg(true)}
                                    //     >
                                    //         MAXIMUM REACHED
                                    //     </SubmitButton> 
                                    ) : (
                                        <SubmitButton 
                                        height="2rem" 
                                        primaryColor="#EDC100"
                                        color="black"
                                        onClick={() => handleApprove()}>
                                            APPROVE
                                        </SubmitButton>
                                    )}
                                    </Wrap>
                                </FunctionBox>
                            ) : (
                                <FunctionBox>
                                <Wrap padding="0" display="flex" justifyContent="space-between">
                                </Wrap>
                                    <AssetInput
                                        currencyLogo={false}
                                        currency={assetToken}
                                        currencyAddress={assetAddress}
                                        value={depositValue}
                                        onChange={setDepositValue}
                                        showMax={false}
                                        showBalance={true}
                                    />
                                    { approved && available &&
                                        <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="#EDC100"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                setShowConfirmation(true)
                                            }
                                        >
                                            DEPOSIT {bond?.assetName}
                                        </SubmitButton>
                                    </Wrap>
                                     }
                                    {!available &&
                                        <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="#FF3E3E"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                setShowAvailabilityMsg(true)
                                            }
                                        >
                                            MAXIMUM REACHED
                                        </SubmitButton>
                                    </Wrap>
                                    }
                                    { earnedAmount > 0 &&
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="#3Eff3E"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleClaim()
                                            }
                                        >
                                            CLAIM LUXOR
                                            {/* {earnedAmount !== 0 ? `($${(earnedAmount * soulPrice).toFixed(2)})` : ''} */}
                                        </SubmitButton>
                                    </Wrap>
                                    }
                                {/* <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor="#F4A703"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleHarvestAll()
                                        }
                                    >
                                        HARVEST ALL
                                    </SubmitButton>
                                </Wrap> */}
                                </FunctionBox>
                            )}
                        </DetailsWrapper>
                    </DetailsContainer>
                </Wrap>
            )}
    {/*  MODAL VIEW */}
    <Modal isOpen={showConfirmation} onDismiss={
        () => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Do you still wish to proceed?`} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
          You have an existing mint. Minting will reset your vesting period and forfeit any pending claimable rewards.
            <br /><br />
            We recommend claiming rewards first or using a fresh wallet. 
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <SubmitButton
            height="2.5rem"
            primaryColor="#3Eff3E"
            color="black"
            onClick={() =>
              handleClaim()
            }
          >
            CLAIM REWARDS
          </SubmitButton>
          { available &&
          <SubmitButton
            height="2.5rem"
            primaryColor="#EDC100"
            color="black"
            onClick={() =>
                setShowDefaultConfirmation(true)
            }
          >
            DEPOSIT {assetName}
          </SubmitButton>
        }
        </div>
      </Modal>
            <Modal isOpen={showAvailabilityMsg} onDismiss={
        () => setShowAvailabilityMsg(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Bonding Unavailable`} onClose={() => setShowAvailabilityMsg(false)} />
          <Typography variant="lg">
          We have set limits on each bond in order to manage the inflation rate.
            <br /><br />
            Please select another option to process a bond or harvest rewards, if you have any.
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <SubmitButton
            height="2.5rem"
            primaryColor="#3Eff3E"
            color="black"
            onClick={() =>
              handleClaim()
            }
          >
            CLAIM REWARDS
          </SubmitButton>
          <SubmitButton
            height="2.5rem"
            primaryColor="#FF3E3E"
            color="white"
            onClick={() =>
                setShowAvailabilityMsg(false)
            }
          >
            CLOSE MESSAGE
          </SubmitButton>
        </div>
      </Modal>
    { showDefaultConfirmation && 
    <><Modal isOpen={showDefaultConfirmation} onDismiss={() => setShowDefaultConfirmation(false)}>
                    <div className="space-y-4">
                        <ModalHeader header={`Do you still wish to proceed?`} onClose={() => setShowDefaultConfirmation(false)} />
                        {/* <Typography variant="lg">
                            Given estimates are NOT guarantees. Bond at your own risk. 
                            <br /><br />
                            Please verify with your own calculations before confirming.
                            <br/> <br/>We're only accountable for contract accuracy, however we will  <i>still do our best</i> on the interface.
                        </Typography> */}
                                  <Typography variant="sm">
            <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-yellow">
                Estimated Outcomes
            </div>
            • <b>Deposit Value</b>: ${Number(Number(assetPrice) * Number(depositValue)).toFixed(0)} <br/>
            • <b>Claim Amount</b>: {Number(Number(depositValue) * Number(assetPrice) * 0.95 / Number(bondPrice)).toFixed(0) } LUX

            <div className="mt-6 text-center">
            <i><b>Please do not rely on our estimations</b></i>.
            </div>

            {/* <b>100% of the fee</b> goes towards building our protocol-owned liquidity, which brings about long-term sustainability to our platform. */}
          </Typography>
                        <Typography variant="sm" className="font-medium">
                            QUESTIONS OR CONCERNS?
                            <a href="mailto:soulswapfinance@gmail.com">
                                {' '} CONTACT US
                            </a>
                        </Typography>

                        { available &&
                            <SubmitButton
                                height="2.5rem"
                                primaryColor="#EDC100"
                                color="black"
                                onClick={() => handleDeposit(depositValue)}
                            >
                            I UNDERSTAND, DEPOSIT { assetName }
                            </SubmitButton>
                        }
                    </div>
                </Modal><Modal isOpen={showAvailabilityMsg} onDismiss={() => setShowAvailabilityMsg(false)}>
                        <div className="space-y-4">
                            <ModalHeader header={`Bonding Unavailable`} onClose={() => setShowAvailabilityMsg(false)} />
                            <Typography variant="lg">
                                We have set limits on each bond in order to manage the inflation rate.
                                <br /><br />
                                Please select another option to process a bond or harvest rewards, if you have any.
                            </Typography>
                            <Typography variant="sm" className="font-medium">
                                QUESTIONS OR CONCERNS?
                                <a href="mailto:soulswapfinance@gmail.com">
                                    {' '} CONTACT US
                                </a>
                            </Typography>
                            <SubmitButton
                                height="2.5rem"
                                primaryColor="#3Eff3E"
                                color="black"
                                onClick={() => handleClaim()}
                            >
                                CLAIM REWARDS
                            </SubmitButton>
                            <SubmitButton
                                height="2.5rem"
                                primaryColor="#FF3E3E"
                                color="white"
                                onClick={() => setShowAvailabilityMsg(false)}
                            >
                                CLOSE MESSAGE
                            </SubmitButton>
                        </div>
                    </Modal></>
    }
    </>
    
    )
}

export default LuxorRowRender
