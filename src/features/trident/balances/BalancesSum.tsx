import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, NATIVE, ZERO } from 'sdk'
import Typography from 'components/Typography'
import SumUSDCValues from 'features/trident/SumUSDCValues'
// import { useTridentLiquidityPositions } from 'services/graph'
import { useActiveWeb3React } from 'services/web3'
import { useBentoBalancesV2 } from 'state/bentobox/hooks'
import { useAllTokenBalances, useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useMemo } from 'react'
import { usePositions, useSoulPositions } from 'hooks/usePositions'
import { useSoulSummonerContract } from 'hooks/useContract'
import { formatNumberScale } from 'functions'
import { POOLS } from 'constants/farms'
import { getAddress } from 'ethers/lib/utils'
import { useTVL } from 'hooks/useV2Pairs'

export const LiquidityPositionsBalancesSum = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const positions = usePositions()
  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
  })

  const tvlInfo = useTVL()

  const valueStaked = positions.reduce((previousValue, currentValue) => {
    const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
    const poolTvl = tvlInfo.find((r) => getAddress(r.lpToken) == getAddress(pool?.lpToken))
    return previousValue + (currentValue.amount / 1e18) * poolTvl?.lpPrice
  }, 0)

  return (
    <div className="flex gap-14">
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {/* ${sum?.toFixed(2) || '0.00'} */}
          { formatNumberScale(valueStaked, true) }
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <Typography variant="sm">{i18n._(t`Number of Farms`)}</Typography>
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {positions?.length}
        </Typography>
      </div>
    </div>
  )
}

export const BentoBalancesSum = () => {
  const balances = useBentoBalancesV2()
  return <_BalancesSum amounts={balances} />
}

export const WalletBalancesSum = () => {
  const { chainId, account } = useActiveWeb3React()
  const tokenBalances = useAllTokenBalances()
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)
  const amounts = useMemo(() => {
    const res: CurrencyAmount<Currency>[] = Object.values(tokenBalances).filter((cur) => cur.greaterThan(ZERO))

    if (ethBalance) {
      res.push(ethBalance)
    }
    return res
  }, [tokenBalances, ethBalance])

  return <_BalancesSum amounts={amounts} />
}

interface BalancesSumProps {
  amounts: (CurrencyAmount<Currency> | undefined)[]
}

const _BalancesSum: FC<BalancesSumProps> = ({ amounts }) => {
  const { i18n } = useLingui()
    //   icon: <BentoboxIcon width={20} height={20} />,

  return (
    <SumUSDCValues amounts={ amounts }>
      {({ amount }) => (
        <div className="flex gap-14">
          <div className="flex flex-col gap-1">
            <Typography variant="sm">{i18n._(t`Total Value`)}</Typography>
            <Typography variant="lg" weight={700} className="text-high-emphesis">
             { amount ? amount.toSignificant(6, { groupSeparator: ',' }) : '$0.00' }
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="sm">{i18n._(t`Total Assets`)}</Typography>
            <Typography variant="lg" weight={ 700 } className="text-high-emphesis">
              { amounts.length }
            </Typography>
          </div>
        </div>
      )}
    </SumUSDCValues>
  )
}