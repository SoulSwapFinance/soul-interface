import React, { FC, ReactNode, useCallback, useState } from 'react'
import { useLingui } from '@lingui/react'
import { Currency, Percent, Token } from 'sdk'
import { classNames, formatNumber } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { Button } from 'components/Button'
import Input from 'components/Input'
import { usePairInfo, useSummonerPoolInfo } from 'hooks/useAPI'

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
  token0: Token
  token1: Token
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
  // token0, 
  // token1,
  value,
  onUserInput,
  onMax,
  id,
}: FarmInputPanelProps) {
  const { i18n } = useLingui()
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const { summonerPoolInfo } = useSummonerPoolInfo(pid)
  const assetPrice = summonerPoolInfo.lpPrice

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

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
