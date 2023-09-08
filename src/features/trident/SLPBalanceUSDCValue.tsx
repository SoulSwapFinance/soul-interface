import { ChainId, ConstantProductPool, CurrencyAmount, Token, USDC } from 'sdk'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import { useActiveWeb3React } from 'services/web3'
import { useTokenBalance } from 'state/wallet/hooks'
import { FC, ReactNode } from 'react'

interface _SLPBalanceProps {
  sum: CurrencyAmount<Token>
  amounts?: CurrencyAmount<Token>[]
  index: number
  children: (sum: CurrencyAmount<Token>) => ReactNode
}

const _SLPBalance: FC<_SLPBalanceProps> = ({ sum, amounts, children, index }) => {
  const usdcValue = useUSDCValue(amounts?.[index])

  if (index === 0 && usdcValue) {
    return <>{children(usdcValue)}</>
  }

  return (
    <_SLPBalance index={index - 1} amounts={amounts} sum={sum}>
      {(sum) => (usdcValue ? children(usdcValue?.add(sum)) : <></>)}
    </_SLPBalance>
  )
}

interface SLPBalanceUSDCValueProps {
  chainId: ChainId
  pool?: ConstantProductPool
  children: (sum: CurrencyAmount<Token>) => ReactNode
}

const SLPBalanceUSDCValue: FC<SLPBalanceUSDCValueProps> = ({ chainId, pool, children }) => {
  const totalSupply = useTotalSupply(pool?.liquidityToken)
  const balance = useTokenBalance(chainId, pool?.liquidityToken.address)
  const liquidityValues =
    pool && totalSupply && balance && pool.assets.map((asset) => pool.getLiquidityValue(asset, totalSupply, balance))

  if (!liquidityValues || !chainId) return <></>

  return (
    <_SLPBalance
      sum={CurrencyAmount.fromRawAmount(USDC[chainId ?? ChainId.FANTOM], '0')}
      amounts={liquidityValues}
      index={liquidityValues.length}
    >
      {(sum) => children(sum)}
    </_SLPBalance>
  )
}

export default SLPBalanceUSDCValue