import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '../../sdk'
import React from 'react'
import { formatNumber, formatNumberScale, formatPercent } from '../../functions'
import { useActiveWeb3React } from 'services/web3'
import { useCurrency } from '../../hooks/Tokens'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen } from '../../state/application/hooks'
import { CurrencyLogo } from '../CurrencyLogo'
import DoubleLogo from '../DoubleLogo'
import Typography from '../Typography'
import { HeadlessUiModal } from 'components/Modal'
import ModalHeader from 'components/Modal/Header'

interface YieldDetailsProps {
  isOpen: boolean
  // chainId: number
  onDismiss: () => void
  token0: Currency
  token1?: Currency
  roiPerHour: number
  roiPerDay: number
  roiPerMonth: number
  roiPerYear: number
  lpPrice: number
  soulPrice: number
}

const YieldDetails: React.FC<YieldDetailsProps> = ({
  isOpen,
  onDismiss,
  token0,
  token1,
  roiPerHour,
  roiPerDay,
  roiPerMonth,
  roiPerYear,
  lpPrice,
  soulPrice,
}) => {
  const { chainId } = useActiveWeb3React()

  const { i18n } = useLingui()

  const roiPerWeek: number = roiPerDay * 7

  const perHour: number = Number((1000 * roiPerHour) / soulPrice)
  const perDay: number = Number((1000 * roiPerDay) / soulPrice)
  const perWeek: number = Number((1000 * roiPerWeek) / soulPrice)
  const perMonth: number = Number((1000 * roiPerMonth) / soulPrice)
  const perYear: number = Number((1000 * roiPerYear) / soulPrice)

  const getRoiEntry = (period: string, percent: number, value: Number) => {
    return (
      <div className="flex flex-row flex-nowrap gap-1 bg-dark-800 rounded py-2">
        <div className="flex flex-row px-2 w-full">
          <div className="flex items-center justify-between">{period}</div>
        </div>

        <div className="flex flex-row px-2 w-full">
          <div className="flex items-center justify-between">{formatPercent(percent * 100)}</div>
        </div>

        <div className="flex flex-row px-2 w-full">
          <div className="flex items-center justify-between">{formatNumberScale(value, false)}</div>
        </div>
      </div>
    )
}

  const getModalContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <ModalHeader header={i18n._(t`Yield Details`)} onClose={onDismiss} />
        <div className="grid grid-cols-2">
          <div className="flex flex-row w-full py-4 gap-2">
            <div className="flex col-span-1 space-x-4">
              {token1 ? (
                <DoubleLogo currency0={token0} currency1={token1} size={50} />
              ) : (
                <div className="flex items-center">
                  <CurrencyLogo currency={token0} size={50} />
                </div>
              )}
            </div>

            <div className="flex flex-col col-span-1 justify-center space-x-2">
              <div>
                <span className="font-bold text-2xl">{token0?.symbol}</span>
                {token1 && <span className="font-bold text-2xl">{`/${token1?.symbol}`}</span>}
              </div>
                { 'OVERVIEW' }
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2 flex flex-col">
        <div className="flex flex-row flex-nowrap gap-1 font-bold">
          <div className="flex flex-row py-1 px-2 w-full">
            <div className="flex items-center justify-between uppercase">{i18n._(t`TIMEFRAME`)}</div>
          </div>

          <div className="flex flex-row py-1 px-2 w-full">
            <div className="flex items-center justify-between uppercase">{i18n._(t`RETURNS`)}</div>
          </div>

          <div className="flex flex-row py-1 px-2 w-full">
            <div className="flex items-center justify-between uppercase">{i18n._(t`SOUL / $1K`)}</div>
          </div>
        </div>
        {getRoiEntry('Hourly', roiPerHour, perHour)}
        {getRoiEntry('Daily', roiPerDay, perDay)}
        {getRoiEntry('Weekly', roiPerWeek, perWeek)}
        {getRoiEntry('Monthly', roiPerMonth, perMonth)}
        {getRoiEntry('Annually', roiPerYear, perYear)}
      </div>
      <div className="space-y-2">
        <div className="text-s">
          {i18n._(t`Calculated based on current rates. Rates are estimates for your convenience, they do not represent guaranteed returns.`)}
        </div>
      </div>
    </div>
  )

  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} chainId={chainId} onDismiss={onDismiss}>
      {getModalContent()}
    </HeadlessUiModal.Controlled>
  )
}

export default React.memo(YieldDetails)
