import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'
import { useLuxorPrice, useSoulPrice, useTokenPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
import QuestionHelper from '../../components/QuestionHelper'
import { AUTO_STAKE_ADDRESS, SOUL_SUMMONER_ADDRESS, SOUL, LUX_HELPER_ADDRESS, Token } from 'sdk'
import AssetInput from 'components/AssetInput'
import { useAutoStakeContract, useLuxorBondContract, useSoulSummonerContract } from 'hooks/useContract'
import { useBondContract, useStakeSharePrice, useStakeRecentProfit, sharesFromSoul } from './useBonds'
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
    FlexText,
    SubmitButton,
} from './Styles'
import { Wrap, Text, ExternalLink } from '../../components/ReusableStyles'
import { formatCurrencyAmount, tryParseAmount } from 'functions'
import { useCurrencyBalance, useTokenBalance } from 'state/wallet/hooks'

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
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)
    const AutoStakeContract = useAutoStakeContract()
    const BondContract = useLuxorBondContract()
    const [approved, setApproved] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    const parsedDepositValue = tryParseAmount(depositValue, SOUL[250])

    const [payout, setStakedBal] = useState(0)
    const [earnedAmount, setEarnedAmount] = useState(0)
    const [unstakedBal, setUnstakedBal] = useState(0)

    // show confirmation view before minting SOUL
    const [discount, setDiscount] = useState(0)
    const [liquidity, setLiquidity] = useState(0)
    const { deposit, withdraw } = useBondContract()
    const luxPrice = useLuxorPrice()
    const assetToken = new Token(250, assetAddress, 18, assetName)
    const tokenPrice = useTokenPrice(assetAddress)

    /**
     * Runs only on initial render/mount
     */
    useEffect(() => {
        fetchDiscount()
        fetchEarnings()
        fetchPayout()
    }, [account])

    /**
     * Runs on initial render/mount and reruns every 2 seconds
     */
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                if (showing) {
                    fetchPayout()
                    fetchDiscount()
                    fetchEarnings()
                }
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
            fetchPayout()
            fetchEarnings()
            fetchDiscount()
            fetchApproval()
        }
    }

    /**
     * Checks the Discount Amount
     */
    const fetchDiscount = async () => {
        try {
            const result = await BondContract?.bondPriceUsd(bondAddress)
            const bondPrice = result / 1e18
            // console.log('luxPrice:%s', luxPrice)
            // console.log('bondPrice:%s', bondPrice)
            const diff = Number(luxPrice) - Number(bondPrice)
            const disc = diff / luxPrice * 100
            const discount = diff <= 0 ? 0 : disc
            // console.log('discount:%s', discount)
            setDiscount(Number(discount))
        } catch (e) {
            console.warn(e)
        }
    }

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
                // const TokenContract = new Token(250, asset, assetName)

                // const erc20BalanceOf = async (address) => {
                //     try {
                //     const result = await asset.balanceOf(address)
                //     return result
                //     } catch (e) {
                //     console.log(e)
                //     // alert(e.message)
                //     }
                // }
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
     * Checks if the user has approved AutoStakeContract to move lpTokens
     */
    const fetchApproval = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            // Checks if AutoStakeContract can move tokens
            const amount = await erc20Allowance(account, bondAddress)
            if (amount > 0) setApproved(true)
            return amount
        }
    }

    /**
     * Approves AutoStakeContract to move lpTokens
     */
    const handleApprove = async () => {
        if (!account) {
            alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(bondAddress)
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
     * Deposits Soul
     */
    const handleDeposit = async (amount) => {
        try {
            const tx = await AutoStakeContract?.deposit(account, parsedDepositValue?.quotient.toString())
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

                            <StakeItemBox>
                                <StakeItem>
                                    {Number(discount).toString() === '0.00' ? (
                                        <Text padding="0" fontSize="1rem" color="#666">
                                            0
                                        </Text>
                                    ) : (
                                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                            {Number(discount).toFixed()}%
                                        </Text>
                                    )}
                                </StakeItem>
                            </StakeItemBox>

                            <StakeItemBox className="flex">
                                {earnedAmount.toFixed(2).toString() === '0.00' ? (
                                    <Text padding="0" fontSize="1rem" color="#666">
                                        0
                                    </Text>
                                ) : (
                                    <Text padding="0" fontSize="1rem" color="#F36FFE">
                                        {earnedAmount.toFixed(2)}
                                    </Text>
                                )}
                            </StakeItemBox>
                            <StakeItemBox className="flex" >
                                { 
                                    <Text padding="0" fontSize="1rem">
                                        {/* {BondContract?.vestingDays(bond.bondAddress)} */}
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
                                showBalance={false}
                                onChange={setDepositValue}
                                showMax={false}
                            />
                             <Wrap padding="0" display="flex" justifyContent="space-between">
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
                                    {/* {Number(unstakedBal * soulPrice) !== 0 ? `($${(unstakedBal * soulPrice).toFixed(0)})` : ''} */}
                                </Text>
                            </Wrap>
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
                            <div className="text-purple justify-center items-center text-center">
                            CLICK HERE TO ACQUIRE BOND ASSETS</div>
                            </TokenPairLink>
                        ) :
                                approved ?
                                    (
                                        <SubmitButton
                                            primaryColour="#B485FF"
                                            color="black"
                                            height="2rem"
                                        >
                                            DEPOSIT {assetName}
                                        </SubmitButton>
                                    ) :
                                    (
                                        <SubmitButton 
                                        height="2rem" 
                                        primaryColour="#B485FF"
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
                                {/* { 'Read Full Details' }
                                    <FlexText>
                                    <QuestionHelper
                                    text={
                                    <div className="flex space-x-2">
                                    <div className="flex flex-col">
                                        <p>
                                            <strong className="text-accent bold">Fee Details:&nbsp;</strong>
                                        </p>
                                        <p>
                                            <strong className="text-accent bold">1.</strong> Harvest Fee: {harvestFee === 0 ? 0 : harvestFee.toFixed(2) === "0.00" ? "<0.00" : harvestFee.toFixed(2)} SOUL
                                        </p>
                                        <p>
                                            <strong className="text-accent bold">2.</strong> Withdraw Fee: {100 / 10000}%
                                        </p>
                                        <p>
                                            <strong className="text-accent bold">3.</strong> Exit Fee Period: 72H
                                        </p>
                                    </div>
                                    </div>
                                    }
                                    />
                                    </FlexText> */}
                                    </Wrap>
                                    <AssetInput
                                        currencyLogo={false}
                                        currency={SOUL[250]}
                                        currencyAddress={SOUL[250].address}
                                        value={depositValue}
                                        onChange={setDepositValue}
                                        showMax={false}
                                        showBalance={false}
                                    />
                                    <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
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
                                        
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#FFFFFF">
                                            BALANCE:&nbsp;
                                    {Number(unstakedBal) === 0
                                        ? '0'
                                        : Number(unstakedBal) < 0
                                            ? '<0'
                                            : Number(unstakedBal)
                                                .toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                                {/* ({(Number(unstakedBal * soulPrice) !== 0 ? `$${Number(unstakedBal * soulPrice).toFixed(0)}` : '0')}) */}
                                            <br />
                                        </Text>
                                    </Wrap>
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
                                            DEPOSIT {bond?.assetName}
                                        </SubmitButton>
                                    </Wrap>
                                    <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#bbb"
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
                                        primaryColour="#B485FF"
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
        </>
    )
}

export default LuxorRowRender
