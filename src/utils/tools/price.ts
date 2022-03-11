import { isAddress } from 'functions/validate'
import { useContract } from 'hooks/useContract'
import { getMedian, getMean } from './math'
import ISoulSwapPairABI from 'constants/abis/soulswap/ISoulSwapPair.json'
import { Token, TokenAmount, TradeType } from 'sdk'
import { BigNumber } from '@ethersproject/bignumber'

const DAI = 'DAI'
const USDC = 'USDC'
const TUSD = 'TUSD'

const ZERO = BigNumber.from(0).pow(18)
const ONE = BigNumber.from(1).pow(18)

const USD_STABLECOINS = [DAI, USDC, TUSD]

const USD_STABLECOIN_ADDRESSES = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  '0x8dd5fbCe2F6a956C3022bA3663759011Dd51e73E',
]

function forEachStablecoin(runner) {
  return USD_STABLECOINS.map((stablecoin, index) => runner(index, stablecoin))
}

export interface TokenAmountNormalized {
  token: Token;
  amount: BigNumber;
}
export interface TokenReserves {
  token: Token;
  exchange?: Token;
  ethReserve: TokenAmount;
  tokenReserve: TokenAmount;
}
export interface TokenReservesNormalized {
  token: Token;
  exchange?: Token;
  ethReserve: TokenAmountNormalized;
  tokenReserve: TokenAmountNormalized;
}
export interface EthReserves {
  token: Token;
}

export declare type NormalizedReserves = TokenReservesNormalized | EthReserves;

export interface Rate {
  rate: BigNumber;
  rateInverted: BigNumber;
}

export interface MarketDetails {
  tradeType: TradeType;
  inputReserves: NormalizedReserves;
  outputReserves: NormalizedReserves;
  marketRate: Rate;
}

export declare type OptionalReserves = TokenReserves | EthReserves | undefined;

export declare function getMarketDetails(optionalReservesInput: OptionalReserves, optionalReservesOutput: OptionalReserves): MarketDetails;

export async function getUSDPrice(library) {
  const address = isAddress(library)
  const poolContract = useContract(address || undefined, ISoulSwapPairABI, false)
  
  const reserves = poolContract?.getReserves()
  // return Promise.all(forEachStablecoin((i) => getTokenReserves(USD_STABLECOIN_ADDRESSES[i], library))).then(
  return Promise.all(forEachStablecoin((i) => reserves(USD_STABLECOIN_ADDRESSES[i], library))).then(
    (reserves) => {
      const ethReserves = forEachStablecoin((i) => reserves[i].ethReserve.amount)
      const marketDetails = forEachStablecoin((i) => getMarketDetails(reserves[i], undefined))

      const ethPrices = forEachStablecoin((i) => marketDetails[i].marketRate.rateInverted)

      const [median, medianWeights] = getMedian(ethPrices)
      const [mean, meanWeights] = getMean(ethPrices, ONE)
      const [weightedMean, weightedMeanWeights] = getMean(ethPrices, ethReserves)

      const ethPrice = getMean([median, mean, weightedMean], 1)[0]
      const _stablecoinWeights = [
        getMean([medianWeights[0], meanWeights[0], weightedMeanWeights[0]], ONE)[0],
        getMean([medianWeights[1], meanWeights[1], weightedMeanWeights[1]], ONE)[0],
        getMean([medianWeights[2], meanWeights[2], weightedMeanWeights[2]], ONE)[0],
      ]
      const stablecoinWeights = forEachStablecoin((i, stablecoin) => ({
        [stablecoin]: _stablecoinWeights[i],
      })).reduce((accumulator, currentValue) => ({ ...accumulator, ...currentValue }), {})

      return [ethPrice, stablecoinWeights]
    }
  )
}
