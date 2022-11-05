import { Interface } from '@ethersproject/abi'
import { ChainId, Currency, CurrencyAmount, JSBI, NATIVE as NATIVE_CURRENCY } from 'sdk'
import ERC20_ABI from 'constants/abis/erc20.json'
import { isAddress } from 'functions/validate'
import { useAllTokens } from 'hooks/Tokens'
import { useMulticall2Contract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { useMultipleContractSingleData, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useMemo } from 'react'

import { TokenBalancesMap } from './types'
import { NATIVE } from 'constants/addresses'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function 
useETHBalances(
  // chainId?: ChainId,
   uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined
} {
  const { chainId } = useActiveWeb3React()
  const multicallContract = useMulticall2Contract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map((address) => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value && chainId)
          memo[address] = CurrencyAmount.fromRawAmount(NATIVE_CURRENCY[chainId], JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, chainId, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  chainId?: ChainId,
  address?: string,
  tokens?: (Currency | undefined)[]
): { data: TokenBalancesMap; loading: boolean } {
  const validatedTokens: Currency[] = useMemo(
    () => tokens?.filter((t?: Currency): t is Currency => isAddress(t?.isNative ? NATIVE : t?.wrapped.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.isNative ? NATIVE : vt.wrapped.address), [validatedTokens])
  const ERC20Interface = new Interface(ERC20_ABI)
  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    [address],
    undefined,
    100_000
  )

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return useMemo(
    () => ({
      data:
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<TokenBalancesMap>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.isNative ? NATIVE : token.wrapped.address] = CurrencyAmount.fromRawAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      loading: anyLoading,
    }),
    [address, validatedTokens, anyLoading, balances]
  )
}

export const serializeBalancesMap = (mapping: Record<string, CurrencyAmount<Currency>>): string => {
  return Object.entries(mapping)
    .map(([address, currencyAmount]) => currencyAmount.serialize())
    .join()
}

export function useTokenBalances(chainId: ChainId, address?: string, tokens?: (Currency | undefined)[]): TokenBalancesMap {
  return useTokenBalancesWithLoadingIndicator(chainId, address, tokens).data
}

// get the balance for a single token/account combo
export function useTokenBalance(chainId: ChainId, account?: string, token?: Currency): CurrencyAmount<Currency> | undefined {
  const tokenBalances = useTokenBalances(chainId, account, [token])
  if (!token) return undefined
  return tokenBalances[token.isNative ? NATIVE : token.wrapped.address]
}

export function useCurrencyBalances(
  chainId: ChainId,
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Currency => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(chainId, account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency?.isToken) return tokenBalances[currency.address]
        if (currency?.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(chainId: ChainId, account?: string, currency?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(chainId, account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(chainId: ChainId): TokenBalancesMap {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  return useTokenBalances(chainId, account ?? undefined, allTokensArray)
}

export function useAllTokenBalancesWithLoadingIndicator(chainId?: ChainId) {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  return useTokenBalancesWithLoadingIndicator(chainId, account ?? undefined, allTokensArray)
}

// TODO: Replace
// get the total owned, unclaimed, and unharvested UNI for account
// export function useAggregateUniBalance(): CurrencyAmount<Currency> | undefined {
//   const { account, chainId } = useActiveWeb3React();

//   const uni = chainId ? UNI[chainId] : undefined;

//   const uniBalance: CurrencyAmount<Currency> | undefined = useTokenBalance(
//     account ?? undefined,
//     uni
//   );
//   const uniUnclaimed: CurrencyAmount<Currency> | undefined =
//     useUserUnclaimedAmount(account);
//   const uniUnHarvested: CurrencyAmount<Currency> | undefined = useTotalUniEarned();

//   if (!uni) return undefined;

//   return CurrencyAmount.fromRawAmount(
//     uni,
//     JSBI.add(
//       JSBI.add(
//         uniBalance?.quotient ?? JSBI.BigInt(0),
//         uniUnclaimed?.quotient ?? JSBI.BigInt(0)
//       ),
//       uniUnHarvested?.quotient ?? JSBI.BigInt(0)
//     )
//   );
// }