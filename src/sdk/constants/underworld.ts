// import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

// MEDIUM RISK PAIR
export const MINIMUM_TARGET_UTILIZATION = '700000000000000000' // 70%

export const MAXIMUM_TARGET_UTILIZATION = '800000000000000000' // 80%

export const UTILIZATION_PRECISION = '1000000000000000000'

export const FULL_UTILIZATION = '1000000000000000000'

export const FULL_UTILIZATION_MINUS_MAX = Number(FULL_UTILIZATION)
- Number(MAXIMUM_TARGET_UTILIZATION)

export const STARTING_INTEREST_PER_YEAR = 317097920
* 60
* 60
* 24
* 365 // approx 1% APR

export const MINIMUM_INTEREST_PER_YEAR = 79274480
* 60
* 60
* 24
* 365 // approx 0.25% APR

export const MAXIMUM_INTEREST_PER_YEAR = STARTING_INTEREST_PER_YEAR
* 1000 // approx 1000% APR

export const INTEREST_ELASTICITY = '28800000000000000000000000000000000000000' // Half or double in 28800 seconds (8 hours) if linear

export const FACTOR_PRECISION = '1000000000000000000'

import JSBI from 'jsbi';
export declare const ACTION_ADD_ASSET = 1;
export declare const ACTION_REPAY = 2;
export declare const ACTION_REMOVE_ASSET = 3;
export declare const ACTION_REMOVE_COLLATERAL = 4;
export declare const ACTION_BORROW = 5;
export declare const ACTION_GET_REPAY_SHARE = 6;
export declare const ACTION_GET_REPAY_PART = 7;
export declare const ACTION_ACCRUE = 8;
export declare const ACTION_ADD_COLLATERAL = 10;
export declare const ACTION_UPDATE_EXCHANGE_RATE = 11;
export declare const ACTION_COFFIN_DEPOSIT = 20;
export declare const ACTION_COFFIN_WITHDRAW = 21;
export declare const ACTION_COFFIN_TRANSFER = 22;
export declare const ACTION_COFFIN_TRANSFER_MULTIPLE = 23;
export declare const ACTION_COFFIN_SETAPPROVAL = 24;
export declare const ACTION_CALL = 30;
export declare const PROTOCOL_FEE: JSBI;
export declare const PROTOCOL_FEE_DIVISOR: JSBI;
