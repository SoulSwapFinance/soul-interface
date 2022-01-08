import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, JSBI, Token, USD, ZERO } from 'sdk'
import Button from 'components/Button'
import CurrencyLogo from 'components/CurrencyLogo'
import Typography from 'components/Typography'
import { easyAmount, formatNumber } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import { useActiveWeb3React } from 'services/web3'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { PairType } from '../enum'
import { usePendingSoul, useUserInfo } from '../hooks'
import useMasterChef from '../hooks/useMasterChef'
import usePendingReward from '../hooks/usePendingReward'
import { SOUL } from '../../../constants'

const InvestmentDetails = ({ farm }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const { harvest } = useMasterChef()
  const router = useRouter()
  const addTransaction = useTransactionAdder()
  const [pendingTx, setPendingTx] = useState(false)

  let token0 = useCurrency(farm.pair.token0?.id)
  let token1 = useCurrency(farm.pair.token1?.id)

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    farm.pair.token1 ? 18 : farm.pair.token0 ? farm.pair.token0.decimals : 18,
    farm.pair.token1 ? farm.pair.symbol : farm.pair.token0.symbol,
    farm.pair.token1 ? farm.pair.name : farm.pair.token0.name
  )

  const stakedAmount = useUserInfo(farm, liquidityToken)

  const pendingSoul = usePendingSoul(farm)
  const pendingReward = usePendingReward(farm)

  const positionFiatValue = CurrencyAmount.fromRawAmount(
    USD[chainId],
      JSBI.BigInt(
          ((Number(stakedAmount?.toExact() ?? '0') * farm.pair.reserveUSD) / farm.pair.totalSupply)
            .toFixed(USD[chainId].decimals)
            .toBigNumber(USD[chainId].decimals)
        )
  )

  const rewardValue =
    (farm?.rewards?.[0]?.rewardPrice ?? 0) * Number(pendingSoul?.toExact() ?? 0) +
    (farm?.rewards?.[1]?.rewardPrice ?? 0) * Number(pendingReward ?? 0)

  async function onHarvest() {
    setPendingTx(true)
    try {
      const tx = await harvest(farm.id)
      addTransaction(tx, {
        summary: i18n._(t`Harvest ${farm.pair.token0.name}/${farm.pair.token1.name}`),
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between font-bold">
          <div className="text-lg cursor-pointer">{i18n._(t`Your Deposits`)}:</div>
          <Typography className="font-bold">
            {formatNumber(stakedAmount?.toSignificant(6) ?? 0)} {farm.pair.token0?.symbol}-{farm.pair.token1?.symbol}{' '}
            {liquidityToken?.symbol}
          </Typography>
        </div>
        <div className="w-full h-0 font-bold bg-transparent border border-b-0 border-transparent rounded text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex items-center space-x-2">
              <CurrencyLogo currency={token0} size="30px" />
              {(
                <Typography>
                  {formatNumber((farm.pair.reserve0 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
                </Typography>
              )}
              <Typography>{token0?.symbol}</Typography>
            </div>
            {farm.pair.type === PairType.SWAP && (
              <div className="flex items-center space-x-2">
                <CurrencyLogo currency={token1} size="30px" />
                <Typography>
                  {formatNumber((farm.pair.reserve1 * Number(stakedAmount?.toExact() ?? 0)) / farm.pair.totalSupply)}
                </Typography>
                <Typography>{token1?.symbol}</Typography>
              </div>
            )}
          </div>
          <Typography>{formatNumber(positionFiatValue?.toSignificant(4) ?? 0, true)}</Typography>
        </div>
      </div>
      <div className="flex flex-col w-full space-y-4">
        <div className="flex items-end justify-between">
          <div className="text-lg font-bold cursor-pointer">{i18n._(t`Your Rewards`)}:</div>
          {((pendingSoul && pendingSoul.greaterThan(ZERO)) || (pendingReward && Number(pendingReward) > 0)) && (
            <button
              className="py-0.5 px-4 font-bold bg-transparent border border-transparent rounded cursor-pointer border-gradient-r-blue-pink-dark-800 whitespace-nowrap text-md"
              disabled={pendingTx}
              onClick={onHarvest}
            >
              {i18n._(t`Harvest Rewards`)}
            </button>
          )}
        </div>
        <div className="w-full bg-transparent border border-b-0 border-transparent rounded h-0font-bold text-high-emphesis border-gradient-r-blue-pink-dark-800 opacity-20" />
        <div className="flex justify-between">
          <div className="flex flex-col space-y-2">
            {farm?.rewards?.map((reward, i) => (
              <div key={i} className="flex items-center space-x-2">
                <CurrencyLogo currency={SOUL[chainId]} size="30px" className="rounded-md" />
                {i === 0 && <Typography>{formatNumber(pendingSoul?.toSignificant(4) ?? 0)}</Typography>}
                {i === 1 && <Typography>{formatNumber(pendingReward)}</Typography>}
                <Typography>{reward.token}</Typography>
              </div>
            ))}
          </div>
          <Typography>{formatNumber(rewardValue / 1e18, true)}</Typography>
        </div>
      </div>
    </div>
  )
}

export default InvestmentDetails
