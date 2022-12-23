import React, { useCallback, useState } from 'react'
import { Currency, Percent, Token } from 'sdk'
import { classNames, formatNumber } from 'functions'
import { Button } from 'components/Button'
import Input from 'components/Input'
import { useSummonerPoolInfo } from 'hooks/useAPI'

interface FarmInputPanelProps {
  pid: string
  value?: string
  balance: string
  isNative?: boolean
  onUserInput?: (value: string) => void
  onMax?: (max: string) => void
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  disableCurrencySelect?: boolean
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  allowManageTokenList?: boolean
  locked?: boolean
  customBalanceText?: string
  showSearch?: boolean
}

export default function FarmInputPanel({
  pid,
  balance,
  isNative,
  value,
  onUserInput,
  onMax,
  id,
}: FarmInputPanelProps) {
  const { summonerPoolInfo } = useSummonerPoolInfo(pid)
  const assetPrice = summonerPoolInfo.lpPrice

  return (
    <div id={id} className={classNames('p-1 rounded bg-dark-1000')}>
      <div className="flex flex-row items-center ml-2">
            {/* CURRENCY LOGO */}
          <div className={classNames('flex items-center w-full rounded bg-dark-1200 p-1')}>
            <>
              <Input.Numeric
                id="token-amount-input"
                value={value}
                onUserInput={(val) => {
                    onUserInput(val)
                }}
                />
                <Button onClick={() => onMax(balance)}>
                <div className="flex flex-cols-2">
                  <div className="text-xs font-medium text-right cursor-pointer text-high-emphesis">
                    {formatNumber(balance, false, true) || 0} {' '} MAX
                  <br/>
                  ≈${isNative 
                    ? formatNumber(Number(value) * Number(assetPrice), false)
                    : formatNumber(Number(value) * Number(assetPrice), false)
                  }
                  </div>
                </div>
                </Button>
            </>
          </div>
      </div>
    </div>
  )
}
