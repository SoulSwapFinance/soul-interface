import { ChevronDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Pair, Percent, Token } from 'sdk'
import selectCoinAnimation from 'animation/select-coin.json'
import { classNames } from 'functions'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import { useCurrencyBalance } from 'state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { ReactNode, useCallback, useState } from 'react'

// import { Button } from '../Button'
import { CurrencyLogo } from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import Input from '../Input'
import { FiatValue } from './FiatValue'

interface StableInputPanelProps {
  value?: string
  onUserInput?: (value: string) => void
  onHalf?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  showLogo?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: CurrencyAmount<Token> | null
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  allowManageTokenList?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  customBalanceText?: string
  showSearch?: boolean
}

export default function StableInputPanel({
  value,
  onUserInput,
  onHalf,
  onMax,
  // showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  showLogo,
  pair = null, // used for double token logo
  hideInput = false,
  // locked = false,
  // customBalanceText,
  allowManageTokenList = true,
  showSearch = true,
}: StableInputPanelProps) {
  const { i18n } = useLingui()
  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(chainId, account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div id={id} className={classNames(hideInput ? 'p-4' : 'p-5', 'rounded bg-dark-1000 border border-dark-700 border hover:border-yellow')}>
      <div className="flex flex-row justify-between space-y-0 sm:space-y-0 sm:flex-row">
        <div className={classNames(showLogo ? 'w-3/4' : 'hidden')}>
          <button
            type="button"
            className={classNames(
              !!currency ? 'text-primary' : 'text-high-emphesis',
              'open-currency-select-button h-full outline-none select-none cursor-pointer border-none text-xl font-medium items-center'
            )}
            onClick={() => {
              if (onCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <div className="flex">
              {pair && showLogo ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={54} margin={true} />
              ) : currency && showLogo ? (
                <div className="flex items-center bg-dark-1000">
                  <CurrencyLogo currency={currency} size={'54px'} />
                </div>
              ) : showLogo && (
                <div className="rounded bg-dark-1000 max-w-[54px] max-h-[54px]">
                  <div className={"w-[54px] h-[54px]"}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}
              {pair && showLogo ? (
                <span
                  className={classNames(
                    'pair-name-container',
                    Boolean(currency && currency.symbol) ? 'text-2xl' : 'text-xs'
                  )}
                >
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </span>
              ) : (
                showLogo && <div className="flex flex-1 flex-col items-center justify-center mx-3.5">
                  {label && <div className="text-xs font-medium text-secondary whitespace-nowrap">{label}</div>}
                  <div className="flex items-center">
                    { showLogo && (
                    <div className="text-lg font-bold token-symbol-container md:text-2xl">
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                          '...' +
                          currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) 
                        || (
                        <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap ">
                          {i18n._(t`Select Token`)}
                        </div>
                      )}
                    </div>
                    )}

                    {!disableCurrencySelect && currency && (
                      <ChevronDownIcon width={16} height={16} className="ml-2 stroke-current" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </button>
        </div>
        {!hideInput && (
          <div
            className={classNames(showLogo &&
              'flex w-full space-x-3 rounded bg-dark-1000 focus:bg-dark-800 p-3 sm:w-3/5',
              !showLogo && 
              'flex w-full rounded bg-dark-1000 focus:bg-dark-800 p-0',
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
              {!hideBalance && currency && selectedCurrencyBalance ? (
                <div className="flex items-center flex-cols-1">
                  <div onClick={onMax} className="text-xs text-center hover:text-yellow font-medium text-center cursor-pointer text-low-emphesis">
                    {renderBalance ? (
                      renderBalance(selectedCurrencyBalance)
                    ) : (           

                      <>
                        {selectedCurrencyBalance?.toSignificant(3, { groupSeparator: ',' }) || '0'} {currency?.symbol}
                      </>
                    )}
                  </div>
                  <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
                </div>
              ) : null}
            </>
          </div>
        )}
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal.Controlled
          open={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency ?? undefined}
          otherSelectedCurrency={otherCurrency ?? undefined}
          showCommonBases={showCommonBases}
          allowManageTokenList={allowManageTokenList}
          showSearch={showSearch}
        />
      )}
    </div>
  )
}
