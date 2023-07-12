import React, { useCallback, useState } from 'react'
import { Currency, Percent, Token } from 'sdk'
import { classNames, formatNumber } from 'functions'
import { Button } from 'components/Button'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import Input from 'components/Input'
import { useSummonerPoolInfo } from 'hooks/useAPI'

interface FarmInputPanelProps {
  pid: string
  value?: string
  balance: string
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
  token0, 
  token1,
  value,
  onUserInput,
  onMax,
  id,
//   fiatValue,
//   renderBalance,
//   hideBalance = false,
}: FarmInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
//   const [fiatValue, setFiatValue ] = useState('0')
  // const { account } = useActiveWeb3React()

  const { summonerPoolInfo } = useSummonerPoolInfo(pid)
  const assetPrice = summonerPoolInfo.lpPrice
//   const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  // const handleDismissSearch = useCallback(() => {
  //   setModalOpen(false)
  // }, [setModalOpen])

  return (
    <div id={id} className={classNames('p-1 rounded bg-dark-1000')}>
      <div className="flex flex-row items-center">
        <div className={classNames('w-5/5 sm:w-1/4 mx-4 sm:mx-12 sm:ml-6')}>

            {/* CURRENCY LOGO */}
            <div className="hidden sm:flex sm:items-center">
                <DoubleCurrencyLogo currency0={token0} currency1={token1} size={48} margin={true} />
            </div>

        </div>
          <div
            className={classNames(
              'flex items-center w-full rounded bg-dark-1200 p-2 sm:w-3/5'
            )}
          >
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
                    {formatNumber(balance, false, true) || 0} {' '}
                    {/* {pairSymbol} */}
                    MAX
                  <br/>
                  ≈${formatNumber(Number(value) * Number(assetPrice), false)}
                  </div>
                </div>
                </Button>
            </>
          </div>
      </div>
    </div>
  )
}
