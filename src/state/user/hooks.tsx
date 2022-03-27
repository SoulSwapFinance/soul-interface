import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { keccak256 } from '@ethersproject/solidity'
import {
  COFFIN_BOX_ADDRESS,
  CHAINLINK_ORACLE_ADDRESS,
  computePairAddress,
  Currency,
  FACTORY_ADDRESS,
  JSBI,
  UNDERWORLD_ADDRESS,
  Pair,
  Percent,
  Token,
} from 'sdk'
import { CHAINLINK_PRICE_FEED_MAP } from 'config/oracles/chainlink'
import { BASES_TO_TRACK_LIQUIDITY_FOR } from 'config/routing'
import { e10 } from 'functions'
import { useAllTokens } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { AppState } from 'state'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import flatMap from 'lodash/flatMap'
import { useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import { shallowEqual, useSelector } from 'react-redux'

import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  toggleURLWarning,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  updateUserUseOpenMev,
  updateUserDarkMode,
} from './actions'

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useIsExpertMode(): boolean {
  return useAppSelector((state) => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useAppDispatch()

  const singleHopOnly = useAppSelector((state) => state.user.userSingleHopOnly)

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      ReactGA.event({
        category: 'Routing',
        action: newSingleHopOnly ? 'enable single hop' : 'disable single hop',
      })
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch]
  )

  return [singleHopOnly, setSingleHopOnly]
}

export function useSetUserSlippageTolerance(): (slippageTolerance: Percent | 'auto') => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (userSlippageTolerance: Percent | 'auto') => {
      let value: 'auto' | number
      try {
        value =
          userSlippageTolerance === 'auto' ? 'auto' : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient)
      } catch (error) {
        value = 'auto'
      }
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance: value,
        })
      )
    },
    [dispatch]
  )
}

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | 'auto' {
  const userSlippageTolerance = useAppSelector((state) => {
    return state.user.userSlippageTolerance
  })

  return useMemo(
    () => (userSlippageTolerance === 'auto' ? 'auto' : new Percent(userSlippageTolerance, 10_000)),
    [userSlippageTolerance]
  )
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>((state) => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    // @ts-ignore TYPE NEEDS FIXING
    return Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch]
  )
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state: AppState) => state.user.URLWarningVisible)
}

export function useURLWarningToggle(): () => void {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch])
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  if (tokenA.chainId !== tokenB.chainId) throw new Error('Not matching chain IDs')
  if (tokenA.equals(tokenB)) throw new Error('Tokens cannot be equal')
  if (!FACTORY_ADDRESS[tokenA.chainId]) throw new Error('No V2 factory address on this chain')

  return new Token(
    tokenA.chainId,
    computePairAddress({ factoryAddress: FACTORY_ADDRESS[tokenA.chainId], tokenA, tokenB }),
    18,
    'UNI-V2',
    'Uniswap V2'
  )
}

const computeOracleData = (collateral: Currency, asset: Currency) => {
  const oracleData = ''

  // @ts-ignore TYPE NEEDS FIXING
  const mapping = CHAINLINK_PRICE_FEED_MAP[asset.chainId]

  for (const address in mapping) {
    mapping[address].address = address
  }

  let multiply = AddressZero
  let divide = AddressZero

  const multiplyMatches: any = Object.values(mapping).filter(
    (m: any) => m.from === asset.wrapped.address && m.to === collateral.wrapped.address
  )

  let decimals = 0

  if (multiplyMatches.length) {
    const match = multiplyMatches[0]
    multiply = match.address!
    decimals = 18 + match.decimals - match.toDecimals + match.fromDecimals
  } else {
    const divideMatches: any = Object.values(mapping).filter(
      (m: any) => m.from === collateral.wrapped.address && m.to === asset.wrapped.address
    )
    if (divideMatches.length) {
      const match = divideMatches[0]
      divide = match.address!
      decimals = 36 - match.decimals - match.toDecimals + match.fromDecimals
    } else {
      const mapFrom = Object.values(mapping).filter((m: any) => m.from === asset.wrapped.address)
      const mapTo = Object.values(mapping).filter((m: any) => m.from === collateral.wrapped.address)
      const match: any = mapFrom
        .map((mfrom: any) => ({
          mfrom: mfrom,
          mto: mapTo.filter((mto: any) => mfrom.to === mto.to),
        }))
        .filter((path) => path.mto.length)
      if (match.length) {
        multiply = match[0].mfrom.address!
        divide = match[0].mto[0].address!
        decimals = 18 + match[0].mfrom.decimals - match[0].mto[0].decimals - collateral.decimals + asset.decimals
      } else {
        return ''
      }
    }
  }

  return defaultAbiCoder.encode(['address', 'address', 'uint256'], [multiply, divide, e10(decimals)])
}

export const computeUnderworldPairAddress = ({
  collateral,
  asset,
  oracle,
  oracleData,
}: {
  collateral: Token
  asset: Token
  oracle: string
  oracleData: string
}): string => {
  return getCreate2Address(
    COFFIN_BOX_ADDRESS[collateral.chainId],
    keccak256(
      ['bytes'],
      [
        defaultAbiCoder.encode(
          ['address', 'address', 'address', 'bytes'],
          [collateral.address, asset.address, oracle, oracleData]
        ),
      ]
    ),
    keccak256(
      ['bytes'],
      [
        '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' +
          UNDERWORLD_ADDRESS[collateral.chainId].substring(2) +
          '5af43d82803e903d91602b57fd5bf3',
      ]
    )
  )
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toUnderworldLiquidityToken([collateral, asset]: [Token, Token]): Token {
  if (collateral.chainId !== asset.chainId) throw new Error('Not matching chain IDs')
  if (collateral.equals(asset)) throw new Error('Tokens cannot be equal')
  if (!COFFIN_BOX_ADDRESS[collateral.chainId]) throw new Error('No CoffinBox factory address on this chain')
  if (!UNDERWORLD_ADDRESS[collateral.chainId]) throw new Error('No Underworld address on this chain')
  // console.log({
  //   collateral,
  //   asset,
  //   oracle: CHAINLINK_ORACLE_ADDRESS[collateral.chainId],
  //   oracleData: computeOracleData(collateral, asset),
  // })
  const oracleData = computeOracleData(collateral, asset)
  if (!oracleData) return
  return new Token(
    collateral.chainId,
    computeUnderworldPairAddress({
      collateral,
      asset,
      oracle: CHAINLINK_ORACLE_ADDRESS[collateral.chainId],
      oracleData: computeOracleData(collateral, asset),
    }),
    18,
    'KM',
    'Underworld Medium Risk'
  )
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? [chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  } else {
                    return [base, token]
                  }
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId]
  )

  // pairs saved by users
  const savedSerializedPairs = useAppSelector(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(),
    [generatedPairs, pinnedPairs, userPairs]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const allowedSlippage = useUserSlippageTolerance()
  return useMemo(
    () => (allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage),
    [allowedSlippage, defaultSlippageTolerance]
  )
}

/**
 * Returns a boolean indicating if the user has enabled OpenMEV protection.
 */
export function useUserOpenMev(): [boolean, (newUseOpenMev: boolean) => void] {
  const dispatch = useAppDispatch()

  // @ts-ignore TYPE NEEDS FIXING
  const useOpenMev = useSelector<AppState, AppState['user']['useOpenMev']>((state) => state.user.userUseOpenMev)

  const setUseOpenMev = useCallback(
    (newUseOpenMev: boolean) => dispatch(updateUserUseOpenMev({ userUseOpenMev: newUseOpenMev })),
    [dispatch]
  )

  return [useOpenMev, setUseOpenMev]
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useAppSelector(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  )

  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}