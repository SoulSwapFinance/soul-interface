import React, { FC, useCallback } from 'react'
import { AddressZero } from '@ethersproject/constants'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/solid'
import chain from 'soulswap-chain'
import { Token, Type } from 'soulswap-currency'
import { FundSource } from 'packages/hooks'
import { Fraction } from 'soulswap-math'

// import { BalanceMap } from 'hooks/useBalance/types'
import { TokenListFilterByQuery } from '../TokenListFilterByQuery'
import { TokenSelectorProps } from './TokenSelector'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { TokenSelectorRow } from './TokenSelectorRow'
import { classNames } from 'functions/styling'
import Loader from 'components/Loader'
import Typography from 'components/Typography'
import { NetworkIcon } from 'components/Icons/NetworkIcon'
import { SlideIn } from 'components/Animated/SlideIn'
import { Currency } from '../Currency'
import { Overlay } from 'components/Overlay'
import { Address } from '../CrossInput/Address'
import { DEFAULT_INPUT_PADDING, DEFAULT_INPUT_UNSTYLED } from 'features/crosschain/constants'

type TokenSelectorOverlay = Omit<TokenSelectorProps, 'variant' | 'tokenMap'> & {
  account?: string
  balancesMap?: any // BalanceMap
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction> | undefined
  fundSource: FundSource
  includeNative?: boolean
}

export const TokenSelectorOverlay: FC<TokenSelectorOverlay> = ({
  account,
  open,
  onClose,
  tokenMap,
  chainId,
  onSelect,
  onAddToken,
  balancesMap,
  pricesMap,
  fundSource,
  includeNative,
}) => {
  const handleSelect = useCallback(
    (currency: Type) => {
      onSelect && onSelect(currency)
      onClose()
    },
    [onClose, onSelect]
  )

  const handleImport = useCallback(
    (currency: Token) => {
      onAddToken && onAddToken(currency)
      onSelect && onSelect(currency)
      onClose()
    },
    [onAddToken, onClose, onSelect]
  )

  return (
    <TokenListFilterByQuery
      tokenMap={tokenMap}
      chainId={chainId}
      pricesMap={pricesMap}
      balancesMap={balancesMap}
      fundSource={fundSource}
      includeNative={includeNative}
    >
      {({ currencies, inputRef, query, onInput, searching, queryToken }) => (
        <SlideIn>
          <SlideIn.FromLeft show={open} onClose={onClose} afterEnter={() => inputRef.current?.focus()}>
            <Overlay.Content className="bg-slate-700 !px-0 !pb-[88px]">
              <Overlay.Header onClose={onClose} title="Select Token" />
              <div className="p-3">
                <div
                  className={classNames(
                    'ring-offset-2 ring-offset-slate-700 flex gap-2 bg-slate-800 pr-3 w-full relative flex items-center justify-between gap-1 rounded-xl focus-within:ring-2 text-primary ring-blue'
                  )}
                >
                  <Address
                    variant="unstyled"
                    id="token-search"
                    ref={inputRef}
                    placeholder="Search token by address"
                    value={query}
                    onChange={onInput}
                    className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
                  />
                  {searching ? (
                    <div className="relative left-[-2px]">
                      <Loader 
                        // size={14} 
                        strokeWidth={3} 
                        className="animate-spin-slow text-slate-500" 
                      />
                    </div>
                  ) : query ? (
                    <XCircleIcon
                      width={20}
                      height={20}
                      className="cursor-pointer text-slate-500 hover:text-slate-300"
                      onClick={() => onInput('')}
                    />
                  ) : (
                    <MagnifyingGlassIcon className="text-slate-500" strokeWidth={2} width={20} height={20} />
                  )}
                </div>
              </div>
              <Typography className="px-4 pb-1 text-slate-300" variant="xs">
                {fundSource === FundSource.WALLET ? 'Wallet' : 'BentoBox'} Balances
              </Typography>
              <div className="relative h-full pt-5">
                <div className="w-full border-t border-slate-200/5" />
                <div className="absolute inset-0 h-full rounded-t-none bg-slate-800 rounded-xl">
                  {queryToken[0] && (
                    <TokenSelectorImportRow
                      className="!px-4"
                      currencies={queryToken}
                      onImport={() => queryToken[0] && handleImport(queryToken[0])}
                    />
                  )}
                  <Currency.List
                    className="divide-y hide-scrollbar divide-slate-700"
                    currencies={currencies}
                    rowRenderer={({ currency, style }) => (
                      <TokenSelectorRow
                        account={account}
                        currency={currency}
                        style={style}
                        onCurrency={handleSelect}
                        className="!px-4"
                        fundSource={fundSource}
                        balance={balancesMap?.[currency.isNative ? AddressZero : currency.wrapped.address]}
                        price={pricesMap?.[currency.wrapped.address]}
                      />
                    )}
                  />
                  {currencies.length === 0 && !queryToken && chainId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Typography variant="xs" className="flex italic text-slate-500">
                          No tokens found on
                        </Typography>
                        <Typography variant="xs" weight={500} className="flex gap-1 italic text-slate-500">
                          <NetworkIcon
                            width={14} 
                            height={14}
                            chainId={chainId} 
                          /> 
                          {chain[chainId].name}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Overlay.Content>
          </SlideIn.FromLeft>
        </SlideIn>
      )}
    </TokenListFilterByQuery>
  )
}
