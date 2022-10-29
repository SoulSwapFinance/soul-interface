import { useCallback, useMemo, useState } from 'react'

export enum FundSource {
  WALLET = 'WALLET',
  COFFINBOX = 'COFFINBOX',
}

export const useFundSourceToggler = (initialValue?: FundSource) => {
  const [fundSource, setFundSource] = useState<FundSource | undefined>(initialValue)

  const toggle = useCallback(() => {
    setFundSource((prevState) => (prevState === FundSource.COFFINBOX ? FundSource.WALLET : FundSource.COFFINBOX))
  }, [])

  return useMemo(
    () => ({
      value: fundSource,
      fromWallet: fundSource === FundSource.WALLET,
      fromCoffinbox: fundSource === FundSource.COFFINBOX,
      toggle,
      setValue: setFundSource,
    }),
    [fundSource, toggle]
  )
}
