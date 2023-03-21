import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { ethers } from 'ethers'
import { useSoulPrice } from 'hooks/getPrices'
import { useActiveWeb3React } from 'services/web3'
import { SOUL } from 'sdk'
import { AUTO_STAKE_ADDRESS, SUMMONER_ADDRESS } from 'sdk'
import { aprToApy } from 'functions/convert'
import AssetInput from 'components/AssetInput'
import { useAutoStakeContract, useSummonerContract } from 'hooks/useContract'
import useApprove from 'hooks/useApprove'
import {
    PostContainer,
    Row,
    PostContentWrapper,
    TokenPairBox,
    PostItemBox,
    PostItem,
    // DetailsContainer,
    // DetailsWrapper,
    // FunctionBox,
    // SubmitButton,
} from './Styles'
import { Wrap, Text, ExternalLink } from '../../components/ReusableStyles'
import { formatNumber, tryParseAmount } from 'functions'
import Modal from 'components/Modal/DefaultModal'
import ModalHeader from 'components/Modal/Header'
import Typography from 'components/Typography'
import { useAutoStakeInfo } from 'hooks/useAPI'
import { getChainColor, getChainLogoURL } from 'constants/chains'

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
    const [showing, setShowing] = useState(false)
    const [withdrawValue, setWithdrawValue] = useState('')
    const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false)
    const [showHarvestConfirmation, setShowHarvestConfirmation] = useState(false)
    const [depositValue, setDepositValue] = useState('')
    const [stakedBal, setStakedBal] = useState(0)
    const [earnedAmount, setEarnedAmount] = useState(0)
    const { autoStakeInfo } = useAutoStakeInfo()
    const [apy, setApy] = useState(0)

    // runs: on initial render/mount
    useEffect(() => {
        // getApyAndLiquidity()
        // fetchBals()
        // fetchApproval()
    }, [account])

    // runs: on initial render/mount & reruns every 2 seconds
    // useEffect(() => {
    //     if (account) {
    //         const timer = setTimeout(() => {
    //             if (showing) {
    //                fetchBals())
    //             }
    //         }, 10_000)
    //         // Clear timeout if the component is unmounted
    //         return () => clearTimeout(timer)
    //     }
    // })

    // opens: function panel dropdown
    const handleShow = () => {
        setShowing(!showing)
        if (!showing) {
            // fetchBals()
            // fetchEarnings()
            // fetchApproval()
        }
    }

    return (
        <>
        <Wrap padding="0" display="flex" justifyContent="center">
            <PostContainer>
                <Row onClick={() => handleShow()}>
                    <PostContentWrapper>
                        <TokenPairBox>
                            <Wrap>
                            <TokenLogo
                                src={
                                    `${getChainLogoURL(chainId)}/${pool.token1Address}/logo.png`
                                }
                                alt="LOGO"
                                width="44px"
                                height="44px"
                                objectFit="contain"
                                className="rounded-full items-center justify-center text-center"
                            />
                            </Wrap>
                        </TokenPairBox>
                <PostItemBox>
                    <PostItem>
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
                    </PostItem>
                </PostItemBox>
                <PostItemBox>
                    <PostItem>
                        {Number(apy).toString() === '0.00' ? (
                            <Text padding="0" fontSize="1rem" color="#666">
                                0
                            </Text>
                        ) : (
                            <Text padding="0" fontSize="1rem" color="#FFFFFF">
                                {Number(apy).toFixed()}%
                            </Text>
                        )}
                    </PostItem>
                </PostItemBox>

                <PostItemBox className="flex">
                    {earnedAmount.toFixed(2).toString() === '0.00' ? (
                        <Text padding="0" fontSize="1rem" color="#666">
                            0
                        </Text>
                    ) : (
                        <Text padding="0" fontSize="1rem" color="#F36FFE">
                            {earnedAmount.toFixed(2)}
                        </Text>
                    )}
                </PostItemBox>
                <PostItemBox className="flex" >
                    {0 === 0 ? (
                        <Text padding="0" fontSize="1rem" color="#666">
                            $0
                        </Text>
                    ) : (
                        <Text padding="0" fontSize="1rem">
                            ${Number(0).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                    )}

                </PostItemBox>

            </PostContentWrapper>
                    </Row>
                </PostContainer>
            </Wrap>
        </>
    )
}

export default StakeRowRender
