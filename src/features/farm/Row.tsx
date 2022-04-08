import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
// import QuestionHelper from '../../components/QuestionHelper'
import { SOUL } from 'sdk'
import AssetInput from 'components/AssetInput'
import { useSoulSummonerContract } from 'hooks/useContract'
import useApprove from 'features/bond/hooks/useApprove'
import {
    FarmContainer,
    Row,
    FarmContentWrapper,
    TokenPairBox,
    FarmItemBox,
    FarmItem,
    DetailsContainer,
    DetailsWrapper,
    FunctionBox,
    // FlexText,
    SubmitButton,
} from './Styles'
import { Wrap, Text, ExternalLink } from '../../components/ReusableStyles'
import { tryParseAmount } from 'functions'
import { useSummonerPoolInfo, useSummonerUserInfo } from 'hooks/useAPI'

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

export const ActiveRow = ({ pid, farm, lpToken }) => {
    const { account, chainId } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)
    
    const [approved, setApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('')
    const [depositValue, setDepositValue] = useState('')
    
    const SoulSummonerContract = useSoulSummonerContract()
    const SoulSummonerAddress = SoulSummonerContract.address

    //   const [confirmed, setConfirmed] = useState(false)
    //   const [receiving, setReceiving] = useState(0)
    const parsedDepositValue = tryParseAmount(depositValue, SOUL[250])
    const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[250])

    const [unstakedBal, setUnstakedBal] = useState(0)

    // console.log('earnedAmount:%s', earnedAmount)
    // show confirmation view before minting SOUL
    // const [liquidity, setLiquidity] = useState(0)
    // const balance = useCurrencyBalance(account, SOUL[250])

    const { summonerPoolInfo } = useSummonerPoolInfo(pid)
    const liquidity = summonerPoolInfo.tvl
    const apr = summonerPoolInfo.apr

    const { summonerUserInfo } = useSummonerUserInfo(pid)
    const stakedBal = summonerUserInfo.stakedAmount
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue
    // console.log('earnedSoul:%s', earnedAmount)
    
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
    const handleShow = () => {
        setShowing(!showing)
        if (!showing) {
            fetchBals()
            fetchApproval()
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

    // /**
    //  * Withdraw Shares
    //  */
    const handleWithdraw = async (amount) => {
        try {
            const tx = await SoulSummonerContract?.withdraw(account, parsedWithdrawValue?.quotient.toString())
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
    const handleHarvest = async () => {
        try {
            let tx
            tx = await SoulSummonerContract?.deposit(0)
            await tx?.wait() // .then(await fetchEarnings())
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
            <Wrap padding="0" display="flex" justifyContent="center">
                <FarmContainer>
                    <Row onClick={() => handleShow()}>
                        <FarmContentWrapper>
                            <TokenPairBox>
                                <Wrap>
                                    <TokenLogo
                                        src={
                                            'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                                            farm.token1Address[chainId] +
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
                                            farm.token2Address[chainId] +
                                            '/logo.png'
                                        }
                                        alt="LOGO"
                                        width="38px"
                                        height="38px"
                                        objectFit="contain"
                                        className="rounded-full items-center justify-center text-center"
                                    />
                                </Wrap>
                            </TokenPairBox>

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
                    </Row>
                </FarmContainer>
            </Wrap>

            {showing && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <DetailsContainer>
                        <DetailsWrapper>
                    {Number(stakedBal) == 0 ? (
                        <FunctionBox>
                            <Wrap padding="0" display="flex" justifyContent="space-between">
                                <Text padding="0" fontSize="1rem" color="#bbb">
                                    {Number(unstakedBal) === 0
                                        ? '0.000'
                                        : Number(unstakedBal) < 0
                                        ? '<0'
                                        : Number(unstakedBal)
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    &nbsp;SOUL &nbsp; {Number(unstakedBal * soulPrice) !== 0 ? `($${(unstakedBal * soulPrice).toFixed(0)})` : ''}
                                </Text>
                            </Wrap>
                            <AssetInput
                            currencyLogo={true}
                                currency={SOUL[250]}
                                currencyAddress={SOUL[250].address}
                                value={depositValue}
                                onChange={setDepositValue}
                                showMax={false}
                            />
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
                                ACQUIRE SOUL
                            </TokenPairLink>
                        ) :
                                approved ?
                                    (
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
                                    ) :
                                    (
                                        <SubmitButton height="2rem" onClick={() => handleApprove()}>
                                            APPROVE
                                        </SubmitButton>
                                    )
                                        }
                                    </Wrap>
                                </FunctionBox>
                            ) : (
                                <FunctionBox>
                                    <AssetInput
                                        currencyLogo={true}
                                        currency={SOUL[250]}
                                        currencyAddress={SOUL[250].address}
                                        value={depositValue}
                                        onChange={setDepositValue}
                                        showMax={false}
                                        showBalance={false}
                                    />
                                    <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#FFFFFF">
                                            STAKED:&nbsp;
                                    {Number(stakedBal) === 0
                                        ? '0'
                                        : Number(stakedBal) < 0
                                            ? '<0'
                                            : Number(stakedBal)
                                                .toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                                ({(Number(Number(stakedBal) * Number(soulPrice)) !== 0 
                                                    ? `$${(Number(stakedBal) * Number(soulPrice)).toFixed(0)}` 
                                                    : '0')})
                                            {/* <br /> */}
                                        </Text>
                                        
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#FFFFFF">
                                            BAL:&nbsp;
                                    {Number(unstakedBal) === 0
                                        ? '0'
                                        : Number(unstakedBal) < 0
                                            ? '<0'
                                            : Number(unstakedBal)
                                                .toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                                ({(Number(unstakedBal * soulPrice) !== 0 ? `$${Number(unstakedBal * soulPrice).toFixed(0)}` : '0')})
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
                                            DEPOSIT SOUL
                                        </SubmitButton>
                                    </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColour="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleWithdraw(withdrawValue)
                                        }
                                    >
                                        WITHDRAW
                                    </SubmitButton>
                                </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#bbb"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleHarvest()
                                            }
                                        >
                                            HARVEST {Number(earnedAmount).toFixed(0)} SOUL
                                            {/* {Number(earnedAmount) !== 0 ? `($${(Number(earnedAmount) * soulPrice).toFixed(0)})` : ''} */}
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

export const InactiveRow = ({ pid, farm, lpToken }) => {
    const { account, chainId } = useActiveWeb3React()
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(lpToken)
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)
    
    const [approved, setApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('')
    const [depositValue, setDepositValue] = useState('')
    
    const SoulSummonerContract = useSoulSummonerContract()
    const SoulSummonerAddress = SoulSummonerContract.address

    //   const [confirmed, setConfirmed] = useState(false)
    //   const [receiving, setReceiving] = useState(0)
    const parsedDepositValue = tryParseAmount(depositValue, SOUL[250])
    const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[250])

    const [unstakedBal, setUnstakedBal] = useState(0)

    // console.log('earnedAmount:%s', earnedAmount)
    // show confirmation view before minting SOUL
    // const [liquidity, setLiquidity] = useState(0)
    // const balance = useCurrencyBalance(account, SOUL[250])

    const { summonerPoolInfo } = useSummonerPoolInfo(pid)
    const liquidity = summonerPoolInfo.tvl
    const apr = summonerPoolInfo.apr

    const { summonerUserInfo } = useSummonerUserInfo(pid)
    const stakedBal = summonerUserInfo.stakedAmount
    const earnedAmount = summonerUserInfo.pendingSoul
    const earnedValue = summonerUserInfo.pendingValue
    // console.log('earnedSoul:%s', earnedAmount)
    
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
    const handleShow = () => {
        setShowing(!showing)
        if (!showing) {
            fetchBals()
            fetchApproval()
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

    // /**
    //  * Withdraw Shares
    //  */
    const handleWithdraw = async (amount) => {
        try {
            const tx = await SoulSummonerContract?.withdraw(account, parsedWithdrawValue?.quotient.toString())
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
    const handleHarvest = async () => {
        try {
            let tx
            tx = await SoulSummonerContract?.deposit(0)
            await tx?.wait() // .then(await fetchEarnings())
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
            <Wrap padding="0" display="flex" justifyContent="center">
                <FarmContainer>
                    <Row onClick={() => handleShow()}>
                        <FarmContentWrapper>
                            <TokenPairBox>
                                <Wrap>
                                    <TokenLogo
                                        src={
                                            'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/' +
                                            farm.token1Address[chainId] +
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
                                            farm.token2Address[chainId] +
                                            '/logo.png'
                                        }
                                        alt="LOGO"
                                        width="38px"
                                        height="38px"
                                        objectFit="contain"
                                        className="rounded-full items-center justify-center text-center"
                                    />
                                </Wrap>
                            </TokenPairBox>

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
                    </Row>
                </FarmContainer>
            </Wrap>

            {showing && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <DetailsContainer>
                        <DetailsWrapper>
                    {Number(stakedBal) == 0 ? (
                        <FunctionBox>
                            <Wrap padding="0" display="flex" justifyContent="space-between">
                                <Text padding="0" fontSize="1rem" color="#bbb">
                                    {Number(unstakedBal) === 0
                                        ? '0.000'
                                        : Number(unstakedBal) < 0
                                        ? '<0'
                                        : Number(unstakedBal)
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    &nbsp;SOUL &nbsp; {Number(unstakedBal * soulPrice) !== 0 ? `($${(unstakedBal * soulPrice).toFixed(0)})` : ''}
                                </Text>
                            </Wrap>
                            <AssetInput
                            currencyLogo={true}
                                currency={SOUL[250]}
                                currencyAddress={SOUL[250].address}
                                value={depositValue}
                                onChange={setDepositValue}
                                showMax={false}
                            />
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
                                ACQUIRE SOUL
                            </TokenPairLink>
                        ) :
                                approved ?
                                    (
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
                                    ) :
                                    (
                                        <SubmitButton height="2rem" onClick={() => handleApprove()}>
                                            APPROVE
                                        </SubmitButton>
                                    )
                                        }
                                    </Wrap>
                                </FunctionBox>
                            ) : (
                                <FunctionBox>
                                    <AssetInput
                                        currencyLogo={true}
                                        currency={SOUL[250]}
                                        currencyAddress={SOUL[250].address}
                                        value={depositValue}
                                        onChange={setDepositValue}
                                        showMax={false}
                                        showBalance={false}
                                    />
                                    <Wrap padding="0" margin="0" display="flex" justifyContent="space-between">
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#FFFFFF">
                                            STAKED:&nbsp;
                                    {Number(stakedBal) === 0
                                        ? '0'
                                        : Number(stakedBal) < 0
                                            ? '<0'
                                            : Number(stakedBal)
                                                .toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                                ({(Number(Number(stakedBal) * Number(soulPrice)) !== 0 
                                                    ? `$${(Number(stakedBal) * Number(soulPrice)).toFixed(0)}` 
                                                    : '0')})
                                            {/* <br /> */}
                                        </Text>
                                        
                                        <Text fontSize=".9rem" padding="0" textAlign="left" color="#FFFFFF">
                                            BAL:&nbsp;
                                    {Number(unstakedBal) === 0
                                        ? '0'
                                        : Number(unstakedBal) < 0
                                            ? '<0'
                                            : Number(unstakedBal)
                                                .toFixed(0)
                                                .toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                                ({(Number(unstakedBal * soulPrice) !== 0 ? `$${Number(unstakedBal * soulPrice).toFixed(0)}` : '0')})
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
                                            DEPOSIT SOUL
                                        </SubmitButton>
                                    </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColour="#B485FF"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                                            handleWithdraw(withdrawValue)
                                        }
                                    >
                                        WITHDRAW
                                    </SubmitButton>
                                </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColour="#bbb"
                                            color="black"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() =>
                                                handleHarvest()
                                            }
                                        >
                                            HARVEST {Number(earnedAmount).toFixed(0)} SOUL
                                            {/* {Number(earnedAmount) !== 0 ? `($${(Number(earnedAmount) * soulPrice).toFixed(0)})` : ''} */}
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
