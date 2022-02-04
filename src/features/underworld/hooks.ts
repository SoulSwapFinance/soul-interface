import { defaultAbiCoder } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { ChainId, NATIVE, Token, USD, WNATIVE_ADDRESS } from 'sdk'
import { Fraction } from 'entities'
// import { Feature } from 'enums/Feature'
import {
  accrue,
  accrueTotalAssetWithFee,
  e10,
  easyAmount,
  // featureEnabled,
  getOracle,
  getUSDValue,
  interestAccrue,
  maximum,
  minimum,
  takeFee,
  toAmount,
  toElastic,
  toShare,
  validateChainlinkOracleData,
} from 'functions'
import { useCoffinBoxContract, useBoringHelperContract } from 'hooks'
import { useAllTokens } from 'hooks/Tokens'
import { useCoffinStrategies, useClones } from 'services/graph'
import { useActiveWeb3React, useQueryFilter } from 'services/web3'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useMemo } from 'react'

const UNDERWORLD_ADDRESS = '0x0A497d994E18c581fbdCE5d51A3438D53e3540d6'

const BLACKLISTED_TOKENS = ['0xC6d54D2f624bc83815b49d9c2203b1330B841cA0']
const BLACKLISTED_ORACLES = ['0x8f2CC3376078568a04eBC600ae5F0a036DBfd812']

export function useUnderworldPairAddresses(): string[] {
  const coffinBoxContract = useCoffinBoxContract()
  const { chainId } = useActiveWeb3React()
  const useEvents = chainId && chainId !== ChainId.BSC 
//   && chainId !== ChainId.MATIC && chainId !== ChainId.ARBITRUM
  const allTokens = useAllTokens()
  const events = useQueryFilter({
    chainId,
    contract: coffinBoxContract,
    event: coffinBoxContract && coffinBoxContract.filters.LogDeploy(UNDERWORLD_ADDRESS[chainId]),
    shouldFetch: useEvents 
    // && featureEnabled(Feature.UNDERWORLD, chainId),
  })
  const clones = useClones({ chainId, shouldFetch: !useEvents })
  return (
    useEvents ? events?.map((event) => ({ address: event.args.cloneAddress, data: event.args.data })) : clones
  )?.reduce((previousValue, currentValue) => {
    try {
      const [collateral, asset, oracle, oracleData] = defaultAbiCoder.decode(
        ['address', 'address', 'address', 'bytes'],
        currentValue.data
      )
      if (
        BLACKLISTED_TOKENS.includes(collateral) ||
        BLACKLISTED_TOKENS.includes(asset) ||
        BLACKLISTED_ORACLES.includes(oracle) ||
        !validateChainlinkOracleData(chainId, allTokens[collateral], allTokens[asset], oracleData)
      ) {
        return previousValue
      }
      return [...previousValue, currentValue.address]
    } catch (error) {
      return previousValue
    }
  }, [])
}

export function useUnderworldPairs(addresses = []) {
  const { chainId, account } = useActiveWeb3React()

  const boringHelperContract = useBoringHelperContract()
  const wnative = WNATIVE_ADDRESS[chainId]
  const currency = USD[chainId]
  const allTokens = useAllTokens()

  const pollArgs = useMemo(() => [account, addresses], [account, addresses])

  // TODO: Replace
  const pollUnderworldPairs = useSingleCallResult(boringHelperContract, 'pollUnderworldPairs', pollArgs)?.result?.[0]

  const tokens = useMemo<Token[]>(() => {
    if (!pollUnderworldPairs) {
      return []
    }
    return Array.from(
      pollUnderworldPairs?.reduce((previousValue, currentValue) => {
        const asset = allTokens[currentValue.asset]
        const collateral = allTokens[currentValue.collateral]
        return previousValue.add(asset).add(collateral)
      }, new Set([currency]))
    )
  }, [allTokens, currency, pollUnderworldPairs])

  const strategies = useCoffinStrategies({ chainId })
  
  const getBalancesArgs = useMemo(() => [account, tokens.map((token) => token?.address)], [account, tokens])

  // TODO: Replace
  const balances = useSingleCallResult(boringHelperContract, 'getBalances', getBalancesArgs)?.result?.[0]?.reduce(
    (previousValue, currentValue) => {
      return { ...previousValue, [currentValue[0]]: currentValue }
    },
    {}
  )

  // TODO: Disgusting but until final refactor this will have to remain...
  const pairTokens = tokens
    .filter((token) => balances?.[token.address])
    .reduce((previousValue, currentValue) => {
      const balance = balances[currentValue.address]
      const strategy = strategies?.find((strategy) => strategy.token === currentValue.address.toLowerCase())
      const usd = e10(currentValue.decimals)
      .mul(balances[currency.address].rate
        .div(balance.rate))
      const symbol = currentValue.address === wnative ? NATIVE[chainId].symbol : currentValue.symbol
      return {
        ...previousValue,
        [currentValue.address]: {
          ...currentValue,
          ...balance,
          address: currentValue.address,
          elastic: balance.coffinAmount,
          base: balance.coffinShare,
          strategy,
          usd,
          symbol,
        },
      }
    }, {})

  return useMemo(() => {
    if (!addresses || !tokens || !pollUnderworldPairs) {
      return []
    }
    return addresses.reduce((previousValue, currentValue, i) => {
      if (chainId && pairTokens && balances) {
        // Hack until we instantiate entity here...
        const pair = Object.assign({}, pollUnderworldPairs?.[i])

        pair.address = currentValue
        pair.oracle = getOracle(chainId, pair.oracle, pair.oracle.data)
        pair.asset = pairTokens[pair.asset]
        pair.collateral = pairTokens[pair.collateral]

        pair.elapsedSeconds = BigNumber.from(Date.now()).div('1000').sub(pair.accrueInfo.lastAccrued)

        // Interest per year at last accrue, this will apply during the next accrue
        pair.interestPerYear = pair.accrueInfo.interestPerSecond.mul('60').mul('60').mul('24').mul('365')

        // The total collateral in the market (stable, doesn't accrue)
        pair.totalCollateralAmount = easyAmount(toAmount(pair.collateral, pair.totalCollateralShare), pair.collateral)

        // The total assets unborrowed in the market (stable, doesn't accrue)
        pair.totalAssetAmount = easyAmount(toAmount(pair.asset, pair.totalAsset.elastic), pair.asset)

        // The total assets borrowed in the market right now
        pair.currentBorrowAmount = easyAmount(accrue(pair, pair.totalBorrow.elastic, true), pair.asset)

        // The total amount of assets, both borrowed and still available right now
        pair.currentAllAssets = easyAmount(pair.totalAssetAmount.value.add(pair.currentBorrowAmount.value), pair.asset)

        pair.marketHealth = pair.totalCollateralAmount.value
          .mulDiv(e10(18), maximum(pair.currentExchangeRate, pair.oracleExchangeRate, pair.spotExchangeRate))
          .mulDiv(e10(18), pair.currentBorrowAmount.value)

        pair.currentTotalAsset = accrueTotalAssetWithFee(pair)

        pair.currentAllAssetShares = toShare(pair.asset, pair.currentAllAssets.value)

        // Maximum amount of assets available for withdrawal or borrow
        pair.maxAssetAvailable = minimum(
          pair.totalAsset.elastic.mulDiv(pair.currentAllAssets.value, pair.currentAllAssetShares),
          toAmount(pair.asset, toElastic(pair.currentTotalAsset, pair.totalAsset.base.sub(1000), false))
        )

        pair.maxAssetAvailableFraction = pair.maxAssetAvailable.mulDiv(
          pair.currentTotalAsset.base,
          pair.currentAllAssets.value
        )

        // The percentage of assets that is borrowed out right now
        pair.utilization = e10(18)
        .mul(pair.currentBorrowAmount.value)
        .div(pair.currentAllAssets.value)

        // Interest per year received by lenders as of now
        pair.supplyAPR = takeFee(pair.interestPerYear.mulDiv(pair.utilization, e10(18)))

        // Interest payable by borrowers per year as of now
        pair.currentInterestPerYear = interestAccrue(pair, pair.interestPerYear)

        // Interest per year received by lenders as of now
        pair.currentSupplyAPR = takeFee(pair.currentInterestPerYear.mulDiv(pair.utilization, e10(18)))

        // The user's amount of collateral (stable, doesn't accrue)
        pair.userCollateralAmount = easyAmount(toAmount(pair.collateral, pair.userCollateralShare), pair.collateral)

        // The user's amount of assets (stable, doesn't accrue)
        pair.currentUserAssetAmount = easyAmount(
          pair.userAssetFraction.mulDiv(pair.currentAllAssets.value, pair.totalAsset.base),
          pair.asset
        )

        // The user's amount borrowed right now
        pair.currentUserBorrowAmount = easyAmount(
          pair.userBorrowPart.mulDiv(pair.currentBorrowAmount.value, pair.totalBorrow.base),
          pair.asset
        )

        // The user's amount of assets that are currently lent
        pair.currentUserLentAmount = easyAmount(
          pair.userAssetFraction.mulDiv(pair.currentBorrowAmount.value, pair.totalAsset.base),
          pair.asset
        )

        // Value of protocol fees
        pair.feesEarned = easyAmount(
          pair.accrueInfo.feesEarnedFraction.mulDiv(pair.currentAllAssets.value, pair.totalAsset.base),
          pair.asset
        )

        // The user's maximum borrowable amount based on the collateral provided, using all three oracle values
        pair.maxBorrowable = {
          oracle: pair.userCollateralAmount.value.mulDiv(e10(16).mul('75'), pair.oracleExchangeRate),
          spot: pair.userCollateralAmount.value.mulDiv(e10(16).mul('75'), pair.spotExchangeRate),
          stored: pair.userCollateralAmount.value.mulDiv(e10(16).mul('75'), pair.currentExchangeRate),
        }

        pair.maxBorrowable.minimum = minimum(
          pair.maxBorrowable.oracle,
          pair.maxBorrowable.spot,
          pair.maxBorrowable.stored
        )

        pair.maxBorrowable.safe = pair.maxBorrowable.minimum.mulDiv('95', '100').sub(pair.currentUserBorrowAmount.value)

        pair.maxBorrowable.possible = minimum(pair.maxBorrowable.safe, pair.maxAssetAvailable)

        pair.safeMaxRemovable = Zero

        pair.health = pair.currentUserBorrowAmount.value.mulDiv(e10(18), pair.maxBorrowable.minimum)

        pair.netWorth = getUSDValue(
          pair.currentUserAssetAmount.value.sub(pair.currentUserBorrowAmount.value),
          pair.asset
        ).add(getUSDValue(pair.userCollateralAmount.value, pair.collateral))

        pair.search = pair.asset.symbol + '/' + pair.collateral.symbol

        pair.interestPerYear = {
          value: pair.interestPerYear,
          string: pair.interestPerYear.toFixed(16),
        }

        pair.strategyAPY = {
          asset: {
            value: BigNumber.from(String(Math.floor((pair.asset.strategy?.apy ?? 0) * 1e16))),
            string: String(pair.asset.strategy?.apy ?? 0),
          },
          collateral: {
            value: BigNumber.from(String(Math.floor((pair.collateral.strategy?.apy ?? 0) * 1e16))),
            string: String(pair.collateral.strategy?.apy ?? 0),
          },
        }
        pair.supplyAPR = {
          value: pair.supplyAPR,
          valueWithStrategy: pair.supplyAPR.add(pair.strategyAPY.asset.value),
          string: Fraction.from(pair.supplyAPR, e10(16)).toString(),
          stringWithStrategy: Fraction.from(pair.strategyAPY.asset.value.add(pair.supplyAPR), e10(16)).toString(),
        }
        pair.currentSupplyAPR = {
          value: pair.currentSupplyAPR,
          valueWithStrategy: pair.currentSupplyAPR.add(pair.strategyAPY.asset.value),
          string: Fraction.from(pair.currentSupplyAPR, e10(16)).toString(),
          stringWithStrategy: Fraction.from(
            pair.currentSupplyAPR.add(pair.strategyAPY.asset.value),
            e10(16)
          ).toString(),
        }
        pair.currentInterestPerYear = {
          value: pair.currentInterestPerYear,
          string: Fraction.from(pair.currentInterestPerYear, BigNumber.from(10).pow(16)).toString(),
        }
        pair.utilization = {
          value: pair.utilization,
          string: Fraction.from(pair.utilization, BigNumber.from(10).pow(16)).toString(),
        }
        pair.health = {
          value: pair.health,
          string: Fraction.from(pair.health, e10(16)),
        }
        pair.maxBorrowable = {
          oracle: easyAmount(pair.maxBorrowable.oracle, pair.asset),
          spot: easyAmount(pair.maxBorrowable.spot, pair.asset),
          stored: easyAmount(pair.maxBorrowable.stored, pair.asset),
          minimum: easyAmount(pair.maxBorrowable.minimum, pair.asset),
          safe: easyAmount(pair.maxBorrowable.safe, pair.asset),
          possible: easyAmount(pair.maxBorrowable.possible, pair.asset),
        }

        pair.safeMaxRemovable = easyAmount(pair.safeMaxRemovable, pair.collateral)

        previousValue = [...previousValue, pair]
      }

      return previousValue
    }, [])
  }, [addresses, tokens, pollUnderworldPairs, chainId, pairTokens, balances])

    // return useMemo(
    //   () =>
    //     addresses.reduce((memo, address, i) => {
    //       const value = pairs?.result[0]?.[i]
    //       if (value && chainId) memo = [...memo, value]
    //       return memo
    //     }, []),
    //   [addresses, chainId, pairs]
    // )
}

export function useUnderworldPair(address: string) {
  return useUnderworldPairs([getAddress(address)])[0]
}
