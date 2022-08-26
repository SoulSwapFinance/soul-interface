import { ChainId, JSBI, Percent } from 'sdk'
import { BigintIsh } from 'sdk/types'

export interface DistributionCampaignBaseConstructoParams {
    startsAt: BigintIsh;
    endsAt: BigintIsh;
    rewards: number[];
    staked: number;
    locked: boolean;
    stakingCap: number;
    address?: string;
}
export declare class DistributionCampaignBase {
    readonly chainId: ChainId;
    readonly address?: string;
    readonly startsAt: BigintIsh;
    readonly endsAt: BigintIsh;
    readonly rewards: number[];
    readonly staked: number;
    readonly duration: BigintIsh;
    readonly locked: boolean;
    readonly stakingCap: number;
    constructor({ startsAt, endsAt, rewards, staked, locked, stakingCap, address, }: DistributionCampaignBaseConstructoParams);
    get remainingDuration(): JSBI;
    get remainingDistributionPercentage(): Percent;
    get remainingRewards(): number[];
    get apy(): Percent;
    get currentlyActive(): boolean;
    get ended(): boolean;
}
