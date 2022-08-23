import { BigintIsh } from 'sdk/types';
import { PricedTokenAmount, Token, TokenAmount } from '.';
import { DistributionCampaignBase } from './DistributionCampaignBase';
export declare class SingleSidedLiquidityMiningCampaign extends DistributionCampaignBase {
    readonly stakeToken: Token;
    constructor(startsAt: BigintIsh, endsAt: BigintIsh, stakeToken: Token, rewards: PricedTokenAmount[], staked: PricedTokenAmount, locked: boolean, stakingCap: TokenAmount, address?: string);
}
