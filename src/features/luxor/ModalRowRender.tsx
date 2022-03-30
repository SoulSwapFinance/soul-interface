import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
// import { ethers } from 'ethers'
import { useLuxorPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
// import QuestionHelper from '../../components/QuestionHelper'
import { SOUL, Token } from 'sdk'
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
} from './ModalStyles'
import { Wrap, Text, ExternalLink } from '../../components/ReusableStyles'
import { formatPercent, tryParseAmount } from 'functions'
// import { useCurrencyBalance, useTokenBalance } from 'state/wallet/hooks'
import { useApproveCallback } from 'hooks/useApproveCallback'
import Modal from 'components/Modal/DefaultModal'
import Typography from 'components/Typography'
import ModalHeader from 'components/Modal/Header'
import { useLuxorBondInfo, useUserInfo } from 'hooks/useAPI'

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

    // const [discount, setDiscount] = useState(0)
    // const [bondPrice, setBondPrice] = useState(0)
    // const [available, setAvailabile] = useState(false)
    // const { deposit, withdraw } = useBondContract()
    const luxPrice = useLuxorPrice()
    const assetToken = new Token(250, assetAddress, 18, assetName)
    const [approvalState, approve] = useApproveCallback(parsedDepositValue, bond?.address)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showAvailabilityMsg, setShowAvailabilityMsg] = useState(false)

    const { luxorBondInfo } = useLuxorBondInfo(bondAddress)
    const bondPrice = Number(luxorBondInfo.price) / 1e18
    const discount = luxorBondInfo.discount
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
            }, 5000)
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
                console.log('unstaked:%s', Number(userBal))

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
                console.log('profit:%s', payout)

                setEarnedAmount(Number(payout))
                console.log('payout:%s', Number(payout))

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

    const handleHarvestAll = async () => {
        try {
            let tx
            tx = await BondContract.harvestAll(false)
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
    const handleClaim = async () => {
        try {
            let tx
            tx = await BondContract?.harvest(bondAddress, true)
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
                                            ${Number(bondPrice).toFixed(2)}
                                        </Text>
                                    )}
                                </StakeItem>
                            </StakeItemBox>

                            <StakeItemBox className="flex">
                                <StakeItem>
                                    {Number(discount).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : Number(discount) > 0 ? (
                                        <Text padding="0" fontSize="1rem" color="#4EFF4E">
                                            {Number(discount).toFixed()}%
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FF4E4E">
                                            {Number(discount).toFixed()}%
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
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        ${Number(payout * luxPrice).toFixed(0)}
                                    </Text>
                                )}
                            </StakeItemBox>
                            {/* <StakeItemBox className="flex">
                                {earnedAmount.toFixed(2).toString() === '0.00' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        {earnedAmount.toFixed(2)}
                                    </Text>
                                )}
                            </StakeItemBox> */}
                            {/* <StakeItemBox className="flex text-center">
                                {
                                // availRatio === 0 ? (
                                //     <Text padding="0" fontSize="1rem" color="#666">
                                //         0
                                //     </Text>
                                // ) : 
                                Number(availRatio) >= 65 ? (
                                    <Text padding="0" fontSize="1rem" color="#4EFF4E">
                                        {availRatio.toFixed()}%
                                    </Text>
                                ) : Number(availRatio) >= 25 ? (
                                    <Text padding="0" fontSize="1rem" color="#FFF14E">
                                        {availRatio.toFixed()}%
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#FF4E4E">
                                        {availRatio.toFixed()}%
                                    </Text>                                
                                )}
                            </StakeItemBox> */}
                            <StakeItemBox className="flex" >
                                { 
                                    <Text padding="0" fontSize="1rem">
                                        {term}
                                    </Text>
                                }

                            </StakeItemBox>

                        </StakeContentWrapper>
                    </Row>
                </StakeContainer>
            </Wrap>

            {showing && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <DetailsContainer>
                        <DetailsWrapper>
                    {payout == 0 ? (
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
                             {/* <Wrap padding="0" display="flex" justifyContent="space-between">
                                <Text padding="0" fontSize="1rem" color="#bbb">
                                    BALANCE:&nbsp;{Number(unstakedBal) === 0
                                        ? '0.000'
                                        : Number(unstakedBal) < 0
                                        ? '<0'
                                        : Number(unstakedBal)
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    &nbsp;{assetName}&nbsp;
                                    {Number(unstakedBal * soulPrice) !== 0 ? `($${(unstakedBal * soulPrice).toFixed(0)})` : ''}
                                </Text>
                            </Wrap> */}
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
                                // approved && available
                                   approved ? (
                                        <SubmitButton
                                            primaryColour="#EDC100"
                                            color="black"
                                            height="2rem"
                                            onClick={() => handleDeposit(depositValue)}>
                                            DEPOSIT {assetName}
                                        </SubmitButton>
                                    // ) : !available ?
                                    // (    <SubmitButton
                                    //     height="2rem" 
                                    //     primaryColour="#FF3E3E"
                                    //     color="black"
                                    //     onClick={() => setShowAvailabilityMsg(true)}
                                    //     >
                                    //         MAXIMUM REACHED
                                    //     </SubmitButton> 
                                    ) : (
                                        <SubmitButton 
                                        height="2rem" 
                                        primaryColour="#EDC100"
                                        color="black"
                                        onClick={() => handleApprove()}>
                                            APPROVE
                                        </SubmitButton>
                                    )
                                        }
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
                                    {/* <Wrap padding="0" margin="0" display="flex" justifyContent="end">
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#FFFFFF">
                                            PAYOUT:&nbsp;
                                    {Number(payout) === 0
                                        ? '0'
                                        : Number(payout) < 0
                                            ? '<0'
                                            : Number(payout)
                                                .toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                                ({(Number(payout * luxPrice) !== 0 ? `$${Number(payout * luxPrice).toFixed(0)}` : '0')})
                                        </Text>
                                        <TokenPairLink
                                                target="_blank"
                                                rel="noopener"
                                                href=
                                                {`https://ftmscan.com/address/${bond.bondAddress}/#code`}
                                                >
                                            <div className="text-yellow text-md justify-center items-center text-center">
                                            VIEW CONTRACT</div>
                                        </TokenPairLink>
                                    </Wrap> */}
                                    {/* {available && */}
                                        <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#EDC100"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                setShowConfirmation(true)
                                            }
                                        >
                                            DEPOSIT {bond?.assetName}
                                        </SubmitButton>
                                    </Wrap>
                                    {/* } */}
                                    {/* {!available &&
                                        <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#FF3E3E"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                setShowAvailabilityMsg(true)
                                            }
                                        >
                                            MAXIMUM REACHED
                                        </SubmitButton>
                                    </Wrap>
                                    } */}
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#3Eff3E"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleClaim()
                                            }
                                        >
                                            CLAIM {`&`} STAKE
                                            {/* {earnedAmount !== 0 ? `($${(earnedAmount * soulPrice).toFixed(2)})` : ''} */}
                                        </SubmitButton>
                                    </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColour="#F4A703"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleHarvestAll()
                                        }
                                    >
                                        HARVEST ALL
                                    </SubmitButton>
                                </Wrap>

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
            primaryColour="#3Eff3E"
            color="black"
            onClick={() =>
              handleClaim()
            }
          >
            CLAIM REWARDS
          </SubmitButton>
          <SubmitButton
            height="2.5rem"
            primaryColour="#EDC100"
            color="black"
            onClick={() =>
              handleDeposit(depositValue)
            }
          >
            DEPOSIT {assetName}
          </SubmitButton>
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
            primaryColour="#3Eff3E"
            color="black"
            onClick={() =>
              handleClaim()
            }
          >
            CLAIM REWARDS
          </SubmitButton>
          <SubmitButton
            height="2.5rem"
            primaryColour="#FF3E3E"
            color="white"
            onClick={() =>
                setShowAvailabilityMsg(false)
            }
          >
            CLOSE MESSAGE
          </SubmitButton>
        </div>
      </Modal>
    </>
    )
}

export default LuxorRowRender
