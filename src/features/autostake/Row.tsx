import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'
// import { getAddress } from '@ethersproject/address'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
// import { Button } from 'components/Button'
// import QuestionHelper from '../../components/QuestionHelper'
import { SOUL, CHANT, Token } from 'sdk'
import { AUTO_STAKE_ADDRESS, SUMMONER_ADDRESS } from 'sdk'
import { aprToApy } from 'functions/convert'
import AssetInput from 'components/AssetInput'
import { useAutoStakeContract, useSummonerContract } from 'hooks/useContract'
// import { useStakeContract, useStakeSharePrice, useStakeRecentProfit, sharesFromSoul } from './hooks'
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
    Input,
    FlexText,
    SubmitButton,
} from './Styles'
import { Wrap, ClickableText, Text, ExternalLink } from '../../components/ReusableStyles'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { formatNumber, tryParseAmount } from 'functions'
import Modal from 'components/Modal/DefaultModal'
import ModalHeader from 'components/Modal/Header'
import Typography from 'components/Typography'
import { useAutoStakeInfo } from 'hooks/useAPI'
import { getChainColor, getChainColorCode, getChainLogoURL } from 'constants/chains'

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

const StakeRowRender = ({ pid, stakeToken, pool }) => {
    const { account, chainId } = useActiveWeb3React()
    // const {
    //     poolInfo,
    //     fetchStakeStats,
    //     userInfo,
    // } = useAutoStake(pid, stakeToken, pool)
    const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove(stakeToken)
    const soulPrice = useSoulPrice()
    const [showing, setShowing] = useState(false)
    const AutoStakeContract = useAutoStakeContract()
    const SoulSummonerContract = useSummonerContract()
    const SoulSummonerAddress = SUMMONER_ADDRESS[chainId]
    const AutoStakeAddress = AUTO_STAKE_ADDRESS[chainId]
    const [approved, setApproved] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('')
    const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false)
    const [showHarvestConfirmation, setShowHarvestConfirmation] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    //   const [confirmed, setConfirmed] = useState(false)
    //   const [receiving, setReceiving] = useState(0)
    const parsedDepositValue = tryParseAmount(depositValue, SOUL[chainId])
    const parsedWithdrawValue = tryParseAmount(withdrawValue, SOUL[chainId])

    const [stakedBal, setStakedBal] = useState(0)
    const [earnedAmount, setEarnedAmount] = useState(0)
    const [unstakedBal, setUnstakedBal] = useState(0)
    // const [pending, setPending] = useState(0)
    const { autoStakeInfo } = useAutoStakeInfo()
    // const performanceFee = autoStakeInfo.performanceFee
    // const available = autoStakeInfo.available
    // const callFeeRate = autoStakeInfo.callFee
    const bounty = autoStakeInfo.bounty
    const withdrawFee = autoStakeInfo.withdrawFee
    const feeHours = autoStakeInfo.withdrawFeeHours
    const tvl = Number(autoStakeInfo.tvl)
    // const harvestFee = performanceFee + callFee
    // const recentProfit = useStakeRecentProfit()
    // console.log('earnedAmount:%s', earnedAmount)
    // show confirmation view before minting SOUL
    const [apy, setApy] = useState(0)
    // const { deposit, withdraw } = useStakeContract()
    // const balance = useCurrencyBalance(account, SOUL[chainId])
    // const stakedBalance = AutoStakeContract?.balanceOf(account)

    // runs: on initial render/mount
    useEffect(() => {
        getApyAndLiquidity()
        fetchBals()
        fetchApproval()
    }, [account])

    // runs: on initial render/mount & reruns every 2 seconds
    useEffect(() => {
        if (account) {
            const timer = setTimeout(() => {
                if (showing) {
                    fetchBals()
                    getApyAndLiquidity()
                    fetchEarnings()
                    fetchApproval()
                }
            }, 10_000)
            // Clear timeout if the component is unmounted
            return () => clearTimeout(timer)
        }
    })

    // opens: function panel dropdown
    const handleShow = () => {
        setShowing(!showing)
        if (!showing) {
            fetchBals()
            fetchEarnings()
            fetchApproval()
        }
    }

    /**
     * Checks the amount of lpTokens the AutoStakeContract contract holds
     * 
     * pool <Object> : the pool object
     * lpToken : the pool lpToken address
     */
    const getApyAndLiquidity = async () => {
        try {
            const autoStakeBalance = await AutoStakeContract?.soulBalanceOf()
            const totalSoul = ethers.utils.formatUnits(autoStakeBalance)
            const tvl = (Number(soulPrice) * Number(totalSoul)).toFixed(0)

            // APR CALCULATION //
            const rawSummonerBal = await erc20BalanceOf(SoulSummonerAddress)
            const summonerTvl = soulPrice * rawSummonerBal / 1e18
            const soulPerSec = await SoulSummonerContract?.soulPerSecond()
            const soulPerDiem = soulPerSec / 1e18 * 86_400
            const poolInfo = await SoulSummonerContract?.poolInfo(0)
            const alloc = poolInfo?.[1]
            const totalAlloc = await SoulSummonerContract?.totalAllocPoint()
            const percAlloc = alloc / totalAlloc
            const dailySoul = soulPerDiem * percAlloc
            const annualSoul = dailySoul * 365
            const annualRewardsValue = annualSoul * soulPrice
            // const SECONDS_IN_YEAR = 60 * 60 * 24 * 365
            const apr = (annualRewardsValue / summonerTvl) * 100
            const apy = aprToApy(apr * 4) // assumes reinvestments every 6hrs

            setApy(Number(apy))
            // console.log('tvl:%s', Number(tvl))
            // console.log('apy:%s', Number(apy))
        } catch (e) {
            console.warn(e)
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
                // get total SOUL staked in contract for pid from user
                const staked = await AutoStakeContract?.balanceOf(account)
                const stakedBal = staked / 1e18
                setStakedBal(Number(stakedBal))
                // console.log('staked:%s', Number(stakedBal))

                // get total SOUL for pid from user bal
                const result2 = await erc20BalanceOf(account)
                const unstaked = ethers.utils.formatUnits(result2)
                setUnstakedBal(Number(unstaked))

                return [stakedBal, unstaked]
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
                // get SOUL earned
                const result = await AutoStakeContract?.getPricePerFullShare()
                const price = result / 1e18
                const staked = await AutoStakeContract?.balanceOf(account)
                const stakedBal = staked / 1e18

                const shareValue = price * stakedBal
                const profit = shareValue - stakedBal
                // console.log('profit:%s', profit)

                setEarnedAmount(Number(profit))
                // console.log('profit:%s', Number(profit))

                return [profit]
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
            const amount = await erc20Allowance(account, AutoStakeAddress)
            if (amount > 0) setApproved(true)
            return amount
        }
    }

    /**
     * Approves AutoStakeContract to move lpTokens
     */
    const handleApprove = async () => {
        if (!account) {
            // alert('Connect Wallet')
        } else {
            try {
                const tx = await erc20Approve(AutoStakeAddress)
                await tx?.wait().then(await fetchApproval())
            } catch (e) {
                // alert(e.message)
                console.log(e)
                return
            }
        }
    }

    const handleWithdrawAll = async () => {
        try {
            let tx
            tx = await AutoStakeContract.withdrawAll()
            // await tx?.wait().then(await setPending(pid))
            await tx?.wait()
        } catch (e) {
            // alert(e.message)
            console.log(e)
        }
    }

    // handles: reward harvest
    const handleHarvest = async () => {
        try {
            let tx
            tx = await AutoStakeContract?.harvest()
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
            await fetchBals()
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
                            <Wrap>
                            <TokenLogo
                                src={
                                    `${getChainLogoURL(chainId)} +
                                    ${pool.token1Address} +
                                    '/logo.png`
                                }
                                alt="LOGO"
                                width="44px"
                                height="44px"
                                objectFit="contain"
                                className="rounded-full items-center justify-center text-center"
                            />
                            </Wrap>
                        </TokenPairBox>
                <StakeItemBox>
                    <StakeItem>
                        {Number(stakedBal).toString() === '0.00' ? (
                            <Text padding="0" fontSize="1rem" color="#666">
                                0
                            </Text>
                        ) : (
                        <Text padding="0" fontSize="1rem" color="#FFFFFF">
                            {stakedBal.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                        </Text>
                        )}
                    </StakeItem>
                </StakeItemBox>
                <StakeItemBox>
                    <StakeItem>
                        {Number(apy).toString() === '0.00' ? (
                            <Text padding="0" fontSize="1rem" color="#666">
                                0
                            </Text>
                        ) : (
                            <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                {Number(apy).toFixed()}%
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
                    {tvl === 0 ? (
                        <Text padding="0" fontSize="1rem" color="#666">
                            $0
                        </Text>
                    ) : (
                        <Text padding="0" fontSize="1rem">
                            ${Number(tvl).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                    )}

                </StakeItemBox>

            </StakeContentWrapper>
                    </Row>
                </StakeContainer>
            </Wrap>

            {showing && (
                <Wrap padding="0" display="flex" justifyContent="center">
                    <DetailsContainer>
                        <DetailsWrapper>
                    {stakedBal == 0 ? (
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
                                currency={SOUL[chainId]}
                                currencyAddress={SOUL[chainId].address}
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
                                        primaryColor="#B485FF"
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
                                        currencyLogo={false}
                                        currency={SOUL[chainId]}
                                        currencyAddress={SOUL[chainId].address}
                                        value={depositValue}
                                        onChange={setDepositValue}
                                        showMax={false}
                                        showBalance={true}
                                    />

                                    <Wrap padding="0" margin="0" display="flex flex-cols">
                                        <SubmitButton
                                            height="2rem"
                                            primaryColor="#A285FF"
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
                                            primaryColor="#A654DC"
                                            color="white"
                                            margin=".5rem 0 .5rem 0"
                                            onClick={() => setShowHarvestConfirmation(true)
                                            }
                                        >
                                            COMPOUND REWARDS
                                        </SubmitButton>
                                    </Wrap>
                                <Wrap padding="0" margin="0" display="flex">
                                    <SubmitButton
                                        height="2rem"
                                        primaryColor="#ee82ee"
                                        color="black"
                                        margin=".5rem 0 .5rem 0"
                                        onClick={() =>
                            setShowWithdrawConfirmation(true)
                                        }
                                    >
                                        WITHDRAW ALL
                                    </SubmitButton>
                                </Wrap>

                                </FunctionBox>
                            )}
                        </DetailsWrapper>
                    </DetailsContainer>
                </Wrap>
            )}
            <Modal isOpen={showHarvestConfirmation} onDismiss={
        () => setShowHarvestConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Harvest Bounty Rewards`} onClose={() => setShowHarvestConfirmation(false)} />
          <Typography variant="lg">
            Harvesting rewards you with a {formatNumber(bounty, false, true)} SOUL bounty, which goes to your wallet for triggering a reinvestment.
            You must withdraw in order to claim rewards.
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <SubmitButton
            height="2.5rem"
            primaryColor="#A654DC"
            color="white"
            // onClick={() => handleDeposit(ethers.utils.parseUnits(document.getElementById('stake').value))}
            onClick={() =>
              // setShowConfirmation(true)
              handleHarvest()
            }
          >
           ACCEPT {`&`} COMPOUND
          </SubmitButton>
          <SubmitButton
            height="2.5rem"
            primaryColor="#FF3E3E"
            color="white"
            onClick={() =>
                setShowHarvestConfirmation(false)
            }
          >
            CLOSE MESSAGE
          </SubmitButton>
        </div>
      </Modal>
            <Modal isOpen={showWithdrawConfirmation} onDismiss={
        () => setShowWithdrawConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader header={`Are you sure?`} onClose={() => setShowWithdrawConfirmation(false)} />
          <Typography variant="lg">
            Withdrawing prior to a { feeHours }H period incurs a { withdrawFee }% SOUL fee, which goes towards the development of the SoulSwap ecosystem.
          </Typography>
          <Typography variant="sm" className="font-medium">
            QUESTIONS OR CONCERNS?
            <a href="mailto:soulswapfinance@gmail.com">
              {' '} CONTACT US
            </a>
          </Typography>
          <SubmitButton
            height="2.5rem"
            primaryColor={getChainColor(chainId)}
            color="black"
            onClick={() =>
              // setShowConfirmation(true)
              handleWithdrawAll()
            }
          >
           ACCEPT {`&`} WITHDRAW
          </SubmitButton>
          <SubmitButton
            height="2.5rem"
            primaryColor="#FF3E3E"
            color="white"
            onClick={() =>
                setShowWithdrawConfirmation(false)
            }
          >
            CLOSE MESSAGE
          </SubmitButton>
        </div>
      </Modal>
        </>
    )
}

export default StakeRowRender
