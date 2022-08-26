import { BigintIsh } from 'sdk/types';
import { Token } from '.';
import { DistributionCampaignBase } from './DistributionCampaignBase';
export declare class SingleSidedLiquidityMiningCampaign extends DistributionCampaignBase {
    readonly stakeToken: Token;
    constructor(startsAt: BigintIsh, endsAt: BigintIsh, stakeToken: Token, rewards: number[], staked: number, locked: boolean, stakingCap: number, address?: string);
}
