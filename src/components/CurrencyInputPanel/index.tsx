import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ChainId, Currency, CurrencyAmount, Pair, Percent, Token } from 'sdk'
import selectCoinAnimation from 'animation/select-coin.json'
import { classNames } from 'functions'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import { useCurrencyBalance } from 'state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { ReactNode, useCallback, useState } from 'react'

import { CurrencyLogo } from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import Input from '../Input'
import { FiatValue } from './FiatValue'

interface CurrencyInputPanelProps {
  value?: string
  chainId: ChainId
  onUserInput?: (value: string) => void
  onHalf?: () => void
  onMax?: () => void
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  showCurrencySelect?: boolean
  disableCurrencySelect?: boolean
  hideBalance?: boolean
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

export default function CurrencyInputPanel({
  value,
  chainId,
  onUserInput,
  onHalf,
  onMax,
  label = '',
  onCurrencySelect,
  // showCurrencySelect = true,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  // locked = false,
  // customBalanceText,
  allowManageTokenList = true,
  showSearch = true,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(chainId, account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div id={id} className={classNames(hideInput ? 'p-4' : 'p-5', 'rounded bg-dark-800')}>
      {/* <div className={classNames(disableCurrencySelect ? "flex justify-center" : "flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row")}> */}
      <div className={classNames("flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row")}>
        <div className={classNames('w-full sm:w-2/5')}>
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
            <div className={classNames("flex")}>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={54} margin={true} />
              ) : currency ? (
                <div className="flex items-center">
                  <CurrencyLogo currency={currency} size={54} />
                </div>
              ) : (
                <div className="rounded bg-dark-700" style={{ maxWidth: 54, maxHeight: 54 }}>
                  <div className={classNames(disableCurrencySelect ? 'hidden' : '')} style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )
              }
              {pair ? (
                <span
                  className={classNames(
                    'pair-name-container',
                    Boolean(currency && currency.symbol) ? 'text-2xl' : 'text-xs'
                  )}
                >
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </span>
              ) : (
                <div className={classNames(disableCurrencySelect ? "flex" : "flex flex-1 flex-col items-start justify-center mx-3.5")}>
                  {label && <div className={disableCurrencySelect ? "flex justify-center text-xl font-bold" : "text-xs font-medium text-secondary whitespace-nowrap"}>{label}</div>}
                  <div className="flex items-center">
                  <div className="text-lg font-bold token-symbol-container md:text-2xl">
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                          '...' +
                          currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) || (
                        <div className={classNames(disableCurrencySelect ? "hidden" : "px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap")}>
                          {`Select Token`}
                        </div>
                      )}
                    </div>

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
            className={classNames(
              'flex items-center w-full space-x-3 rounded bg-dark-900 focus:bg-dark-700 p-3 sm:w-3/5'
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
              {!hideBalance && currency && selectedCurrencyBalance && (
                <div className="flex flex-cols-2">
                  {/* <div onClick={onHalf} className="text-xs font-medium text-right cursor-pointer text-low-emphesis">
                    {renderBalance ? (
                      renderBalance(selectedCurrencyBalance)
                    ) : (           

                      <>
                        {`50%`} 
                      </>
                    )}
                  </div> 
                  <br/> */}
                  <div onClick={onMax} className="text-xs font-medium text-right cursor-pointer text-low-emphesis mr-2">
                    {renderBalance ? (
                      renderBalance(selectedCurrencyBalance)
                    ) : (           

                      <>
                        {`MAX: ${selectedCurrencyBalance?.toSignificant(2, { groupSeparator: ',' })} ` || '0'} 
                        {/* {`MAX`} */}
                        {/* {currency?.symbol} */}
                      </>
                    )}
                <div>
                  <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
                </div>
                  </div>
                </div>
              )}
            </>
          </div>
        )}
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal.Controlled
          chainId={chainId}
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
