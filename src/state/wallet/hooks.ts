import { Interface } from '@ethersproject/abi'
import { ChainId, Currency, CurrencyAmount, JSBI, NATIVE, Token, TokenAmount } from 'sdk'
import ERC20_ABI from 'constants/abis/erc20.json'
import { isAddress } from 'functions/validate'
import { useAllTokens } from 'hooks/Tokens'
import { useEthBalanceOfAnotherChain, useTokensBalanceOfAnotherChain } from 'hooks/bridge'

import { useMulticall2Contract, useMulticallContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from 'state/multicall/hooks'
import { useMemo } from 'react'

import { TokenBalancesMap } from './types'
import { NativeCurrencies } from 'constants/tokens'

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  chainId?: ChainId,
  address?: string,
  tokens?: (Token | undefined)[]
): { data: TokenBalancesMap; loading: boolean } {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t.chainId, t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
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
                memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      loading: anyLoading,
    }),
    [address, validatedTokens, anyLoading, balances]
  )
}

export const serializeBalancesMap = (mapping: Record<string, CurrencyAmount<Token>>): string => {
  return Object.entries(mapping)
    .map(([address, currencyAmount]) => currencyAmount.serialize())
    .join()
}

export function useTokenBalances(chainId: ChainId, address?: string, tokens?: (Token | undefined)[]): TokenBalancesMap {
  return useTokenBalancesWithLoadingIndicator(chainId, address, tokens).data
}

// get the balance for a single token/account combo
export function useTokenBalance(chainId: ChainId, account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(chainId, account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

function useETHBalance(): CurrencyAmount<Currency> | undefined {
  const { chainId, account } = useActiveWeb3React()
  const multicallContract = useMulticallContract()

  const addressParam: (string | undefined)[] = useMemo(
    () => (account && isAddress(chainId, account) ? [account] || [undefined] : [undefined]),
    [chainId, account],
  )

  const result = useSingleCallResult(multicallContract, 'getEthBalance', addressParam)
  const value: string | undefined = result?.result?.[0]?.toString?.()

  return useMemo(() => {
    if (value) return CurrencyAmount.fromRawAmount(NativeCurrencies[chainId], JSBI.BigInt(value))
    return undefined
  }, [value, chainId])
}

export function useNativeBalance(customChain?: ChainId): CurrencyAmount<Currency> | undefined {
  const { chainId: currentChain } = useActiveWeb3React()
  const chainId = customChain || currentChain
  const isFetchOtherChain = chainId !== currentChain

  const userEthBalanceAnotherChain = useEthBalanceOfAnotherChain(isFetchOtherChain ? chainId : undefined)
  const userEthBalance = useETHBalance()

  const evmBalance = isFetchOtherChain ? userEthBalanceAnotherChain : userEthBalance
  return evmBalance
}

export function useCurrencyBalances(
  chainId: ChainId,
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(chainId, account, tokens)
  // const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useNativeBalance(chainId)

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

export type TokenAmountLoading = [TokenAmount<Token> | undefined, boolean]
