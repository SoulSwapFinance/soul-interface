import { ChainId, Currency, Fee, NATIVE } from 'sdk'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { SOUL } from 'constants/tokens'

const useCurrenciesFromURL = (chainId: ChainId): {
  chainId: ChainId
  currencies: (Currency | undefined)[]
  switchCurrencies: () => Promise<void>
  setURLCurrency: (cur: Currency, index: number) => void
  fee: number
  twap: boolean
} => {
  // const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const currencyA = useCurrency(router.query.tokens?.[0]) || (chainId && NATIVE[chainId ?? ChainId.FANTOM]) || undefined
  const currencyB = useCurrency(router.query.tokens?.[1]) || (chainId && SOUL[250]) || undefined

  const fee = Number(router.query.fee ?? Fee.DEFAULT)
  const twap = router.query.twap !== 'false'

  const switchCurrencies = useCallback(async () => {
    if (!chainId) return

    const nativeSymbol = NATIVE[chainId ?? ChainId.FANTOM].symbol
    let tokens: string[] = []
    if (router.query && router.query.tokens) {
      tokens = [router.query.tokens?.[1], router.query.tokens?.[0]]
    } else {
      tokens = [
        currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address,
        currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address,
      ]
    }

    await router.push({
      pathname: router.pathname,
      query: {
        tokens,
        ...(router.pathname !== '/trident/swap' && {
          fee,
          twap,
        }),
      },
    })
  }, [
    chainId,
    currencyA?.isNative,
    currencyA?.wrapped.address,
    currencyB?.isNative,
    currencyB?.wrapped.address,
    fee,
    router,
    twap,
  ])

  const setURLCurrency = useCallback(
    async (cur: Currency, index: number) => {
      if (!chainId) return

      const nativeSymbol = NATIVE[chainId ?? ChainId.FANTOM].symbol
      let tokens: string[] = [
        currencyA?.isNative ? nativeSymbol : currencyA?.wrapped.address,
        currencyB?.isNative ? nativeSymbol : currencyB?.wrapped.address,
      ]

      if (chainId && router.query?.tokens && router.query?.tokens.length > 0) {
        tokens = [...router.query.tokens]

        // If selected currency is already in URL, switch currencies
        if (tokens[(index + 1) % 2] === (cur.isNative ? nativeSymbol : cur.wrapped.address)) {
          return switchCurrencies()
        }

        const newToken = cur.isNative ? NATIVE[chainId ?? ChainId.FANTOM].symbol : cur.wrapped.address
        if (tokens.includes(newToken)) return // return if token already selected
        tokens[index] = newToken
      }

      if (!router.query?.tokens) {
        tokens[index] =
          index === 1
            ? cur.isNative
              ? nativeSymbol
              : cur?.wrapped.address
            : cur.isNative
            ? nativeSymbol
            : cur?.wrapped.address
      }

      await router.push({
        pathname: router.pathname,
        query: {
          tokens,
          ...(router.pathname !== '/trident/swap' && {
            fee,
            twap,
          }),
        },
      })
    },
    [
      chainId,
      currencyA?.isNative,
      currencyA?.wrapped.address,
      currencyB?.isNative,
      currencyB?.wrapped.address,
      fee,
      router,
      switchCurrencies,
      twap,
    ]
  )

  return useMemo(
    () => ({
      currencies: [currencyA, currencyB],
      chainId,
      setURLCurrency,
      switchCurrencies,
      fee,
      twap,
    }),
    [currencyA, currencyB, setURLCurrency, switchCurrencies, fee, twap]
  )
}

export default useCurrenciesFromURL