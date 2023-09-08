import { ChainId, CurrencyAmount, Pair, SOUL, SOUL_ADDRESS, Token } from 'sdk'

import { useMemo } from 'react' // useCallback

import { SubgraphLiquidityMiningCampaign, SubgraphSingleSidedStakingCampaign } from './apollo'
import { PairsFilterType } from 'components/Pool/ListFilter'
// import { useGetLiquidityMiningCampaignsQuery, useGetStakingCampaignsQuery } from ''
// import { useAllTokensFromActiveListsOnCurrentChain } from 'state/lists/hooks'
import {
  // getLowerTimeLimit,
//   getLowerTimeLimit,
//   getTokenAmount,
//   MiningCampaign,
//   sortActiveCampaigns,
//   sortExpiredCampaigns,
  // toLiquidityMiningCampaign,
  toSingleSidedStakeCampaign,
} from 'utils/liquidityMining'
import { useNativeCurrency } from './useNativeCurrency'

import { useActiveWeb3React } from 'services/web3'
import { getTokenList } from 'functions/list'

const DEFAULT_TOKEN_LIST = 'https://raw.githubusercontent.com/soulswapfinance/default-token-list/prod/soulswap.tokenlist.json'

export function useAllMiningCampaigns(pair?: Pair, dataFilter?: PairsFilterType) {
  const token0Address = pair?.token0?.address.toLowerCase()
  const token1Address = pair?.token1?.address.toLowerCase()
  const pairAddress = pair?.liquidityToken.address.toLowerCase()

  const { chainId, account } = useActiveWeb3React()

  // const subgraphAccountId = account?.toLowerCase() ?? ''

  const nativeCurrency = useNativeCurrency()
  const timestamp = useMemo(() => Math.floor(Date.now() / 1000), [])
//   const isUpcoming = useCallback((startTime: BigintIsh) => timestamp < parseInt(startTime.toString()), [timestamp])

  // const memoizedLowerTimeLimit = useMemo(() => getLowerTimeLimit(), [])
  const tokensInCurrentChain = getTokenList(DEFAULT_TOKEN_LIST)
    // = useAllTokensFromActiveListsOnCurrentChain()

  // const {
  //   data: singleSidedCampaigns,
  //   loading: singleSidedLoading,
  //   error: singleSidedCampaignsError,
  // } = useGetStakingCampaignsQuery({
  //   variables: {
  //     userId: subgraphAccountId,
  //   },
  // })

  // const {
  //   data: pairCampaigns,
  //   loading: campaignLoading,
  //   error: campaignError,
  // } = useGetLiquidityMiningCampaignsQuery({
  //   variables: {
  //     userId: subgraphAccountId,
  //   },
  // })

  return useMemo(() => {
    if (
      // singleSidedLoading ||
      !chainId ||
      // campaignLoading ||
      !SOUL[chainId ?? ChainId.FANTOM]
      // || singleSidedCampaignsError ||
      // campaignError ||
      // !singleSidedCampaigns ||
      // !singleSidedCampaigns?.singleSidedStakingCampaigns ||
      // !pairCampaigns ||
      // !pairCampaigns.liquidityMiningCampaigns
    )
    {
      return { loading: true, miningCampaigns: { active: [], expired: [] } }
    }

    // TODO: UPDATE BELOW //
    // const expiredCampaigns: MiningCampaign[] = []
    // const activeCampaigns: MiningCampaign[] = []
    
    // NOTE: BELOW IS TEMPORARY //
    let expiredCampaigns: []
    let activeCampaigns: []
    let pairCampaigns: {
      liquidityMiningCampaigns: [
        campaign: {
          endsAt
          liquidityMiningPositions: []
          stakablePair: { 
            id
            totalSupply
            token0
            token1
          }
        }
      ]
    }
    
  
    for (let i = 0; i < pairCampaigns.liquidityMiningCampaigns.length; i++) {
      const campaign = pairCampaigns.liquidityMiningCampaigns[i]

      if (
        (pairAddress && campaign.stakablePair.id.toLowerCase() !== pairAddress) ||
        (dataFilter === PairsFilterType.MY && campaign.liquidityMiningPositions.length === 0)
      )
        continue

      // const { reserveNativeCurrency, totalSupply, token0, token1, reserve0, reserve1 } = campaign.stakablePair
      const { totalSupply, token0, token1 } = campaign.stakablePair

      let tokenAmountA = CurrencyAmount.fromRawAmount(token0, totalSupply.toString())
      let tokenAmountB = CurrencyAmount.fromRawAmount(token1, totalSupply.toString())

      // const tokenAmountA = getTokenAmount({ token: token0, tokensInCurrentChain, chainId, reserve: reserve0 })
      // const tokenAmountB = getTokenAmount({ token: token1, tokensInCurrentChain, chainId, reserve: reserve1 })
      // const tokenAmountA = getTokenAmount({ token: token0, tokensInCurrentChain, chainId, reserve: reserve0 })
      // const tokenAmountB = getTokenAmount({ token: token1, tokensInCurrentChain, chainId, reserve: reserve1 })

      const pair = new Pair(tokenAmountA, tokenAmountB)
    
    // TODO: UPDATE BELOW //
      // const liquidityCampaign = toLiquidityMiningCampaign(
      //   chainId,
      //   pair,
      //   totalSupply,
      //   reserveNativeCurrency,
      //   campaign as SubgraphLiquidityMiningCampaign,
      //   nativeCurrency
      // )

      const hasStake = campaign.liquidityMiningPositions.length > 0
      const isExpired = false
      // parseInt(campaign.endsAt) < timestamp || parseInt(campaign.endsAt) 
      //   > memoizedLowerTimeLimit
      const isActive = hasStake 
        // TODO: UPDATE BELOW //
        // || liquidityCampaign.currentlyActive 
        // || isUpcoming(campaign.startsAt)

      if (
        dataFilter !== PairsFilterType.SOULSWAP ||
        SOUL_ADDRESS[chainId ?? ChainId.FANTOM].toLowerCase() === token0.address ||
        SOUL_ADDRESS[chainId ?? ChainId.FANTOM].toLowerCase() === token1.address
      ) {
        if (isActive) {
            // TODO: UPDATE BELOW //
            activeCampaigns
            // .push({ campaign: liquidityCampaign, staked: hasStake })
    } else if (isExpired) {
            // TODO: UPDATE BELOW //
          expiredCampaigns
        //   .push({ campaign: liquidityCampaign, staked: hasStake })
        }
      }
    }

    // NOTE: BELOW IS TEMPORARY //
    let stakingCampaigns: {
      singleCampaigns: [
        campaign: {
          endsAt
          singleStakingPositions: []
          stakeToken: {
            id: string
            decimals: string
            symbol: string
            name: string
            totalSupply: string
            derivedNativeCurrency
          }
        }
      ]}

    for (let i = 0; i < stakingCampaigns.singleCampaigns.length; i++) {
      const campaign = stakingCampaigns.singleCampaigns[i]

      if (
        (token0Address &&
          token1Address &&
          campaign.stakeToken.id.toLowerCase() !== token0Address &&
          campaign.stakeToken.id.toLowerCase() !== token1Address) ||
        (dataFilter === PairsFilterType.MY && campaign.singleStakingPositions.length === 0)
      )
        continue

      const stakeToken = new Token(
        chainId,
        campaign.stakeToken.id,
        parseInt(campaign.stakeToken.decimals),
        campaign.stakeToken.symbol,
        campaign.stakeToken.name
      )

      let singleSidedStakeCampaign
      try {
        singleSidedStakeCampaign = toSingleSidedStakeCampaign(
          chainId,
          campaign as unknown as SubgraphSingleSidedStakingCampaign,
          stakeToken,
          campaign.stakeToken.totalSupply,
          nativeCurrency,
          campaign.stakeToken.derivedNativeCurrency
        )
      } catch (e) {
        // TODO: Investigate why `derivedNativeCurrency` is zero
        console.error('Campaign', { campaign })
        continue
      }

      const hasStake = campaign.singleStakingPositions.length > 0
      const isExpired = false
      // parseInt(campaign.endsAt) < timestamp || parseInt(campaign.endsAt) > memoizedLowerTimeLimit

      if (dataFilter !== PairsFilterType.SOULSWAP || SOUL[chainId ?? ChainId.FANTOM].equals(stakeToken)) {
        if (hasStake || singleSidedStakeCampaign.currentlyActive 
            // TODO: UPDATE BELOW //
            // || isUpcoming(singleSidedStakeCampaign.startsAt)
        ) {
            // TODO: UPDATE BELOW //
          activeCampaigns
        //   .unshift({
            // campaign: singleSidedStakeCampaign,
            // staked: hasStake,
        //   })
        } else if (isExpired) {
            // TODO: UPDATE BELOW //
           expiredCampaigns
        // .unshift({
            // campaign: singleSidedStakeCampaign,
            // staked: hasStake,
        //   })
        }
      }
    }

    return {
      loading: false,
      miningCampaigns: {
        // active: sortActiveCampaigns(activeCampaigns),
        // expired: sortExpiredCampaigns(expiredCampaigns),
      },
    }
  }, [
    // singleSidedLoading,
    chainId,
    // campaignLoading,
    // singleSidedCampaignsError,
    // campaignError,
    // singleSidedCampaigns,
    // pairCampaigns,
    pairAddress,
    dataFilter,
    tokensInCurrentChain,
    nativeCurrency,
    timestamp,
    // memoizedLowerTimeLimit,
    SOUL,
    // isUpcoming,
    token0Address,
    token1Address,
  ])
}