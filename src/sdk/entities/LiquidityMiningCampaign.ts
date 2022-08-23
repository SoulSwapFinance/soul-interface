import { Pair } from '../entities';
import { DistributionCampaignBase } from './DistributionCampaignBase';
export interface LiquidityMiningCampaignConstructorParams {
    startsAt: number;
    endsAt: number;
    targetedPair: string;
    rewards: number[];
    staked: number;
    locked: boolean;
    stakingCap: number;
    address?: string;
}
export declare class LiquidityMiningCampaign extends DistributionCampaignBase {
    readonly targetedPair: Pair;
    constructor({ startsAt, endsAt, targetedPair, rewards, staked, locked, stakingCap, address, }: LiquidityMiningCampaignConstructorParams);
}
