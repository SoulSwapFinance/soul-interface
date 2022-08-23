import {
  Currency,
  USD,
  PricedToken,
  CurrencyAmount,
  Token,
  LiquidityMiningCampaign,
  SingleSidedLiquidityMiningCampaign,
  Pair,
  Price,
} from 'sdk'
import { getAddress, parseUnits } from 'ethers/lib/utils'
import { DateTime, Duration } from 'luxon'

import { SubgraphLiquidityMiningCampaign, SubgraphSingleSidedStakingCampaign } from 'apollo/index'
// import { getLpTokenPrice } from './prices'
import { useActiveWeb3React } from 'services/web3'
import { usePairPrice } from 'hooks/usePairData'

export function getRemainingRewardsUSD(
  campaign: LiquidityMiningCampaign,
  // nativeCurrencyUSDPrice: Price<Token, Token> // base, quote
  nativeCurrencyUSDPrice: number
  ): CurrencyAmount<Token> {
  const { chainId } = useActiveWeb3React()
  const remainingRewards = campaign.remainingRewards
  let remainingRewardsUSD
  //ZERO_USD
  for (let i = 0; i < remainingRewards.length; i++) {
    remainingRewardsUSD = remainingRewardsUSD.add(
      CurrencyAmount
      // .usd
      .fromRawAmount(
        USD[chainId],
        parseUnits(
          (Number(remainingRewards[i]) * nativeCurrencyUSDPrice).toFixed(USD[chainId].decimals),
          // remainingRewards[i].nativeCurrencyAmount.multiply(nativeCurrencyUSDPrice).toFixed(USD[chainId].decimals),
          USD[chainId].decimals
        ).toString()
      )
    )
  }
  return remainingRewardsUSD
}

// export function getPairRemainingRewardsUSD(pair: Pair, nativeCurrencyUSDPrice: number): CurrencyAmount {
//   // no liquidity mining campaigns check
//   if (pair.liquidityMiningCampaigns.length === 0) return ZERO_USD
//   return pair.liquidityMiningCampaigns.reduce((accumulator: CurrencyAmount, campaign) => {
//     return accumulator.add(getRemainingRewardsUSD(campaign, nativeCurrencyUSDPrice))
//   }, ZERO_USD)
// }

// export function tokenToPricedTokenAmount(
//   campaign: any,
//   token: Token,
//   amount: string,
//   nativeCurrency: Currency,
//   chainId: number
// ): PricedTokenAmount {
//   const price = new Price({
//     quoteCurrency: token,
//     baseCurrency: nativeCurrency,
//     denominator: parseUnits('1', nativeCurrency.decimals).toString(),
//     numerator: parseUnits(
//       //check thyself before thou wreck thyself
//       new Decimal(campaign.token.derivedNativeCurrency).toFixed(nativeCurrency.decimals),
//       nativeCurrency.decimals
//     ).toString(),
//   })
//   const pricedRewardToken = new PricedToken(
//     chainId,
//     getAddress(token.address),
//     token.decimals,
//     Number(price),
//     token.symbol,
//     token.name
//   )
//   return 
//   // new PricedTokenAmount(
//   //   pricedRewardToken[chainId],
//   //   parseUnits(new Decimal(amount).toFixed(token.decimals), token.decimals).toString()
//   // )
// }
export function toSingleSidedStakeCampaign(
  chainId: number,
  campaign: SubgraphSingleSidedStakingCampaign,
  stakeToken: Token,
  totalSupplyStakeToken: string,
  nativeCurrency: Currency,
  derivedNativeCurrency: string
): SingleSidedLiquidityMiningCampaign {
  const rewards = campaign.rewards.map(reward => {
    const rewardToken = new Token(
      chainId,
      getAddress(reward.token.address),
      parseInt(reward.token.decimals),
      reward.token.symbol,
      reward.token.name
    )

    const rewardTokenPriceNativeCurrency = reward.token.derivedNativeCurrency
    // new Price({
    //   baseCurrency: rewardToken,
    //   quoteCurrency: nativeCurrency,
    //   denominator: parseUnits('1', nativeCurrency.decimals).toString(),
    //   numerator: parseUnits(
    //     new Decimal(reward.token.derivedNativeCurrency).toFixed(nativeCurrency.decimals),
    //     nativeCurrency.decimals
    //   ).toString(),
    // })
    const pricedRewardToken = new PricedToken(
      chainId,
      getAddress(rewardToken.address),
      rewardToken.decimals,
      Number(rewardTokenPriceNativeCurrency),
      rewardToken.symbol,
      rewardToken.name
    )
    return Number(reward.amount)
    // new PricedTokenAmount(
    //   pricedRewardToken[chainId],
    //   parseUnits(new Decimal(reward.amount).toFixed(rewardToken.decimals), rewardToken.decimals).toString()
    // )
  })

  const derivedNative = derivedNativeCurrency
  // new Price({
  //   baseCurrency: stakeToken,
  //   quoteCurrency: nativeCurrency,
  //   denominator: parseUnits('1', nativeCurrency.decimals).toString(),
  //   numerator: parseUnits(
  //     new Decimal(derivedNativeCurrency).toFixed(nativeCurrency.decimals),
  //     nativeCurrency.decimals
  //   ).toString(),
  // })

  // const stakedPricedToken = new PricedToken(
  //   chainId,
  //   getAddress(stakeToken.address),
  //   stakeToken.decimals,
  //   Number(derivedNative),
  //   stakeToken.symbol,
  //   stakeToken.name
  // )

  const staked = 0
  // new PricedTokenAmount(
  //   stakedPricedToken,
  //   parseUnits(campaign.stakedAmount, stakedPricedToken.decimals).toString()
  // )

  return new SingleSidedLiquidityMiningCampaign(
    campaign.startsAt,
    campaign.endsAt,
    stakeToken[chainId],
    rewards,
    staked,
    campaign.locked,
    10,
    // new TokenAmount(
    //   stakeToken[chainId],
    //   campaign.stakingCap
    //   parseUnits(campaign.stakingCap, 
    //     stakeToken[chainId].decimals)
    //     .toString()
    //   ),
    getAddress(campaign.id)
  )
}
export function toLiquidityMiningCampaign(
  chainId: number,
  targetedPair: string,
  targetedPairLpTokenTotalSupply: string,
  targetedPairReserveNativeCurrency: string,
  campaign: SubgraphLiquidityMiningCampaign,
  nativeCurrency: Currency
): LiquidityMiningCampaign {
  const rewards = campaign.rewards.map(reward => {
    const rewardToken = new Token(
      chainId,
      getAddress(reward.token.address),
      parseInt(reward.token.decimals),
      reward.token.symbol,
      reward.token.name
    )

    const rewardTokenPriceNativeCurrency = reward.token.derivedNativeCurrency
    // new Price({
    //   baseCurrency: rewardToken,
    //   quoteCurrency: nativeCurrency,
    //   denominator: parseUnits('1', nativeCurrency.decimals).toString(),
    //   numerator: parseUnits(
    //     new Decimal(reward.token.derivedNativeCurrency).toFixed(nativeCurrency.decimals),
    //     nativeCurrency.decimals
    //   ).toString(),
    // })
    // const pricedRewardToken = new PricedToken(
    //   chainId,
    //   getAddress(rewardToken.address),
    //   rewardToken.decimals,
    //   Number(rewardTokenPriceNativeCurrency),
    //   rewardToken.symbol,
    //   rewardToken.name
    // )
    return reward.amount 
    // new PricedTokenAmount(
    //   pricedRewardToken[chainId],
    //   parseUnits(new Decimal(reward.amount).toFixed(rewardToken.decimals), rewardToken.decimals).toString()
    // )
  })
  const lpTokenPriceNativeCurrency = usePairPrice(targetedPair[chainId])
  // getLpTokenPrice(
  //   targetedPair,
  //   nativeCurrency,
  //   targetedPairLpTokenTotalSupply,
  //   targetedPairReserveNativeCurrency
  // )

  // const stakedPricedToken = new PricedToken(
  //   chainId,
  //   getAddress(targetedPair),
  //   targetedPair,
  //   lpTokenPriceNativeCurrency,
  //   targetedPairSymbol,
  //   targetedPair.liquidityToken.name
  // )
  const staked = campaign.stakedAmount
  //  new PricedTokenAmount(
  //   stakedPricedToken[chainId],
  //   parseUnits(campaign.stakedAmount, stakedPricedToken.decimals).toString()
  // )
  return new LiquidityMiningCampaign({
    startsAt: Number(campaign.startsAt),
    endsAt: Number(campaign.endsAt),
    targetedPair: targetedPair[chainId],
    rewards: [Number(rewards)],
    staked: Number(staked),
    locked: campaign.locked,
    stakingCap: Number(campaign.stakingCap),
    // new TokenAmount(
    //   targetedPair.liquidityToken,
    //   parseUnits(campaign.stakingCap, targetedPair.liquidityToken.decimals).toString()
    // ),
    address: getAddress(campaign.address),
  })
}

export function getStakedAmountUSD(campaign: number, nativeCurrencyUSDPrice: number): number {
  return Number(parseUnits((campaign * Number(nativeCurrencyUSDPrice)).toString()))
  // .toFixed(USD[chainId].decimals), Number(USD[chainId].decimals))
  // .toString()
}

interface SubgraphToken {
  address: string
  symbol: string
  name: string
  decimals: string
}

export interface SubgraphPair {
  address: string
  reserve0: string
  reserve1: string
  reserveNativeCurrency: string
  reserveUSD: string
  totalSupply: string
  token0: SubgraphToken
  token1: SubgraphToken
  liquidityMiningCampaigns: SubgraphLiquidityMiningCampaign[]
}

interface TokenAmountParams {
  token: SubgraphToken
  tokensInCurrentChain: { [address: string]: { token: Token } }
  chainId: number
  reserve: string
}

export const getTokenAmount = ({ token, tokensInCurrentChain, chainId, reserve }: TokenAmountParams) => {
  const tokenChecksummedAddress = getAddress(token.address)
  const tokenA =
    tokensInCurrentChain && tokensInCurrentChain[tokenChecksummedAddress]?.token
      ? tokensInCurrentChain[tokenChecksummedAddress].token
      : new Token(chainId, tokenChecksummedAddress, parseInt(token.decimals, 10), token.symbol, token.name)
  // return new TokenAmount(tokenA[chainId], parseUnits(reserve, token.decimals).toString())
  return reserve
}

interface PairWithLiquidityMiningCampaignParams {
  rawPair: SubgraphPair
  tokensInCurrentChain: { [address: string]: { token: Token } }
  chainId: number
  nativeCurrency: Currency
}

export const getPairWithLiquidityMiningCampaign = ({
  rawPair,
  tokensInCurrentChain,
  chainId,
  nativeCurrency,
}: PairWithLiquidityMiningCampaignParams) => {
  const { reserveNativeCurrency, totalSupply, token0, token1, reserve0, reserve1, liquidityMiningCampaigns } = rawPair

  // const tokenAmountA = getTokenAmount({ token: token0, tokensInCurrentChain, chainId, reserve: reserve0 })
  // const tokenAmountB = getTokenAmount({ token: token1, tokensInCurrentChain, chainId, reserve: reserve1 })

  // const pair = new Pair(tokenAmountA, tokenAmountB)

//   const campaigns = liquidityMiningCampaigns.map(campaign => {
//     return toLiquidityMiningCampaign(
//       chainId,
//       // pair,
//       '',
//       totalSupply,
//       reserveNativeCurrency,
//       campaign,
//       nativeCurrency
//     )
//   })
//   liquidityMiningCampaigns
//   // pair.liquidityMiningCampaigns = campaigns

//   return ''
// }

// export const getLowerTimeLimit = () =>
//   Math.floor(
//     DateTime.utc()
//       .minus(Duration.fromObject({ days: 150 }))
//       .toSeconds()
//   )

// export const getRewardTokenAddressFromPair = (pair: SubgraphPair) =>
//   pair.liquidityMiningCampaigns.flatMap(campaign => campaign.rewards.map(reward => reward.token.address.toLowerCase()))

 interface MiningCampaign {
  campaign: LiquidityMiningCampaign | SingleSidedLiquidityMiningCampaign
  staked: boolean
  nativeCurrencyAmount: number
}

// export const sortActiveCampaigns = (activeCampaigns: MiningCampaign[]) =>
//   activeCampaigns.sort((a, b) => {
//     if (a.campaign.ended && !b.campaign.ended) return -1
//     if (!a.campaign.ended && b.campaign.ended) return 1

//     if (a.staked && !b.staked) return -1
//     if (!a.staked && b.staked) return 1

//     if (
//       a.campaign instanceof SingleSidedLiquidityMiningCampaign &&
//       !(b.campaign instanceof SingleSidedLiquidityMiningCampaign)
//     )
//       return -1

//     if (
//       !(a.campaign instanceof SingleSidedLiquidityMiningCampaign) &&
//       b.campaign instanceof SingleSidedLiquidityMiningCampaign
//     )
//       return 1

//     // Active above upcoming
//     if (a.campaign.currentlyActive && !b.campaign.currentlyActive) return -1
//     if (!a.campaign.currentlyActive && b.campaign.currentlyActive) return 1

//     // TV
//     if (
//       Number(a.campaign.staked
//         // .nativeCurrencyAmount
//         ) 
//       >
//       // .greaterThan
//       Number(b.campaign.staked
//         // .nativeCurrencyAmount
//         )
//       ) return -1
//     if (a.campaign.staked
//         // .nativeCurrencyAmount
//         <
//         // .lessThan(
//           b.campaign.staked
//             // .nativeCurrencyAmount
//             // )
//         ) return 1

//     if (a.campaign.apy > b.campaign.apy) return -1
//     if (a.campaign.apy < b.campaign.apy) return 1

//     return 0
//   })
}

// export const sortExpiredCampaigns = (expiredCampaigns: MiningCampaign[]) =>
//   expiredCampaigns.sort((a, b) => {
//     if (a.campaign.endsAt > b.campaign.endsAt) return -1
//     if (a.campaign.endsAt < b.campaign.endsAt) return 1

//     if (a.campaign.staked > b.campaign.staked) return -1
//     if (a.campaign.staked < b.campaign.staked) return 1
//     // if (a.campaign.staked.nativeCurrencyAmount.greaterThan(b.campaign.staked.nativeCurrencyAmount)) return -1
//     // if (a.campaign.staked.nativeCurrencyAmount.lessThan(b.campaign.staked.nativeCurrencyAmount)) return 1

//     return 0
  // })