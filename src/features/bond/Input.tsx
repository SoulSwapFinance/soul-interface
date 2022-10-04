import React, { FC, ReactNode, useCallback, useState } from 'react'
import { useLingui } from '@lingui/react'
import { Currency, Percent, Token } from 'sdk'
import { classNames, formatNumber } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { Button } from 'components/Button'
import Input from 'components/Input'
import { usePairInfo, useBondUserInfo } from 'hooks/useAPI'

interface BondInputPanelProps {
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

export default function BondInputPanel({
  pid,
  balance,
  isNative,
  value,
  onUserInput,
  onMax,
  id,
}: BondInputPanelProps) {
  const { i18n } = useLingui()
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const { soulBondUserInfo } = useBondUserInfo(pid, account)
  const assetAddress = soulBondUserInfo.address
  const temporaryBoost = pid == '4'
  const assetPrice 
  = temporaryBoost 
    ? Number(soulBondUserInfo.pairPrice) * 4 
    : Number(soulBondUserInfo.pairPrice) 
  // const assetPrice = Number(usePairInfo(assetAddress).pairInfo.lpPrice)

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
                    ? formatNumber(Number(value) * assetPrice, false)
                    : formatNumber(Number(value) * assetPrice, false)
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
