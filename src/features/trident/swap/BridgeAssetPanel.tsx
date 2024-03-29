import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { ChainId, Currency, Percent, ZERO } from 'sdk'
import { Button } from 'components/Button'
import { CurrencyLogo } from 'components/CurrencyLogo'
import NumericalInput from 'components/Input/Numeric'
import QuestionHelper from 'components/QuestionHelper'
import Typography from 'components/Typography'
import { classNames, formatNumber, halfAmountSpend, maxAmountSpend, tryParseAmount, warningSeverity } from 'functions'
import { useCoffinOrWalletBalance } from 'hooks/useCoffinOrWalletBalance'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// import CoffinBoxFundingSourceModal from '../add/CoffinBoxFundingSourceModal'
import { getChainColorCode, getChainInfo, getChainLogo } from 'constants/chains'
import Image from 'next/image'

interface BridgeAssetPanel {
  error?: boolean
  header: (x) => React.ReactNode
  walletToggle?: (x) => React.ReactNode
  currency?: Currency
  currencies?: string[]
  value?: string
  onChange(x?: string): void
  onSelect?(x: Currency): void
  spendFromWallet?: boolean
  selected?: boolean
  priceImpact?: Percent
  priceImpactCss?: string
  disabled?: boolean
  hideBalance?: boolean
  showInput?: boolean
  network?: ChainId
  showSelect?: boolean
}

const BridgeAssetPanel = ({
  error,
  header,
  walletToggle,
  currency,
  value,
  onChange,
  selected,
  onSelect,
  spendFromWallet,
  priceImpact,
  priceImpactCss,
  disabled,
  currencies,
  hideBalance,
  showInput = true,
  network,
  showSelect = true,
}: BridgeAssetPanel) => {
  return (
    // hover:border-${getChainColorCode(chainId)}
    <div className={`rounded-[14px] border border-dark-700
    bg-dark-900 
    p-3 flex flex-col gap-4`}>
      {header({
        disabled,
        onChange,
        value,
        currency,
        currencies,
        onSelect,
        walletToggle,
        spendFromWallet,
        showInput,
        network,
        showSelect,
      })}
      <div className={showInput ? `flex gap-1 justify-between items-baseline px-1.5` : 'hidden'}>
        <InputPanel
          {...{
            selected,
            error,
            currency,
            currencies,
            value,
            onChange,
            disabled,
            onSelect,
            priceImpact,
            priceImpactCss,
            spendFromWallet,
            network,
            showSelect,
          }}
        />
        {!hideBalance && <BalancePanel {...{ disabled, currency, onChange, spendFromWallet }} />}
      </div>
    </div>
  )
}

const WalletSwitch: FC<
  Pick<BridgeAssetPanel, 'spendFromWallet' | 'disabled'> & {
    label: string
    onChange(x: boolean): void
    id?: string
  }
> = ({ label, onChange, id, spendFromWallet, disabled }) => {

  const content = (
    <Typography
      variant="xs"
      weight={700}
      component="span"
      className={classNames(disabled ? 'pointer-events-none opacity-40' : '', 'flex items-center gap-2')}
    >
      {label}
      <Typography
        id={id}
        role="button"
        onClick={() => onChange(!spendFromWallet)}
        variant="sm"
        weight={700}
        component="span"
        className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer text-high-emphesis hover:text-white hover:shadow bg-dark-800 hover:bg-dark-700"
      >
        {spendFromWallet ? `Wallet` : `Coffin`}
      </Typography>
      {/* <CoffinBoxFundingSourceModal /> */}
    </Typography>
  )

  if (disabled) {
    return <QuestionHelper text={`Not available for legacy route`}>{content}</QuestionHelper>
  }

  return content
}

const InputPanel: FC<
  Pick<BridgeAssetPanel, 'currency' | 'value' | 'onChange' | 'disabled' | 'priceImpact'> & { priceImpactCss?: string }
> = ({ currency, value, onChange, disabled, priceImpact, priceImpactCss }) => {
  const { chainId } = useActiveWeb3React()
  const usdcValue = [ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? useUSDCValue(tryParseAmount(value, currency)) : tryParseAmount(value, currency)
  const span = useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = useState(0)

  const priceImpactClassName = useMemo(() => {
    if (!priceImpact) return undefined
    if (priceImpact.lessThan('0')) return 'text-green'
    const severity = warningSeverity(priceImpact)
    if (severity < 1) return 'text-green'
    if (severity < 2) return 'text-yellow'
    if (severity < 3) return 'text-red'
    return 'text-red'
  }, [priceImpact])

  useEffect(() => {
    if (span.current) {
      setWidth(value ? span?.current?.clientWidth + 8 : 60)
    }
  }, [value])

  return (
    <Typography weight={700} variant="h3" className="relative flex items-baseline flex-grow gap-3 overflow-hidden">
      <NumericalInput
        disabled={disabled}
        value={value || ''}
        onUserInput={onChange}
        placeholder="0.00"
        className="leading-[36px] focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
        autoFocus
      />
      <Typography
        variant="xs"
        className="text-secondary absolute bottom-1.5 pointer-events-none"
        component="span"
        style={{ left: width }}
      >
        {usdcValue?.greaterThan(ZERO) && <>~{formatNumber(usdcValue?.toFixed(), true, true, 2)} </>}
        {priceImpact && (
          <span className={priceImpactCss || priceImpactClassName}>({priceImpact?.toSignificant(2)}%)</span>
        )}
      </Typography>
      {/*This acts as a reference to get input width*/}
      <Typography variant="h3" weight={700} className="relative flex flex-row items-baseline">
        <span ref={span} className="opacity-0 absolute pointer-events-none tracking-[0]">
          {`${value ? value : '0.00'}`}
        </span>
      </Typography>
    </Typography>
  )
}

const BalancePanel: FC<Pick<BridgeAssetPanel, 'disabled' | 'currency' | 'onChange' | 'spendFromWallet'>> = ({
  disabled,
  currency,
  onChange,
  spendFromWallet,
}) => {
  const { account, chainId } = useActiveWeb3React()
  const balance = useCoffinOrWalletBalance(chainId, account ? account : undefined, currency, spendFromWallet)

  const handleHalfClick = useCallback(() => {
    if (disabled || !balance || !onChange) return
    onChange(halfAmountSpend(balance)?.toExact())
  }, [balance, disabled, onChange])

  const handleMaxClick = useCallback(() => {
    if (disabled || !balance || !onChange) return
    onChange(maxAmountSpend(balance)?.toExact())
  }, [balance, disabled, onChange])

  return (
    <>
      <Typography role="button" onClick={handleHalfClick} variant="sm" className="flex text-secondary whitespace-nowrap">
        {balance ? '50%' : '0'}
      </Typography>
      <Typography role="button" onClick={handleMaxClick} variant="sm" className="flex text-primary whitespace-nowrap">
        {balance ? balance.toSignificant(6) : '0.00'}
      </Typography>
    </>
  )
}

const BridgeAssetPanelHeader: FC<
  Pick<
    BridgeAssetPanel,
    'currency' | 'network' | 'showSelect' | 'currencies' | 'onSelect' | 'walletToggle' | 'spendFromWallet' | 'disabled' | 'onChange' | 'value'
  > & { label: string; id?: string }
> = ({ walletToggle, network, showSelect, currency, onSelect, spendFromWallet, id, currencies }) => {
  const { chainId } = useActiveWeb3React()
  const triggerA = currency && showSelect ? (
    <div
      id={id}
      className="flex items-center gap-2 px-2 py-1 rounded-full shadow-md cursor-pointer text-high-emphesis bg-dark-800 hover:bg-dark-700"
    >
      <CurrencyLogo currency={currency} className="!rounded-full overflow-hidden" size={20} />
      <Typography variant="sm" className="!text-xl" weight={700}>
        {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
      </Typography>
      <ChevronDownIcon width={18} />
    </div>
  ) : showSelect && (
    <Button color={getChainColorCode(chainId)} variant="flexed" size="sm" id={id} className="!rounded-full !px-2 !py-0 !h-[32px] !pl-3">
      <div className="flex items-center mt-1">
        {`Select Token`}
        <ChevronDownIcon width={18} />
      </div>
    </Button>
  )

  return (
    <div>

        <div
          className={network ? `flex justify-center gap-8 mb-3 mt-3 max-h-[36px] border ${`border-${getChainColorCode(network)}`} rounded-[14px] bg-dark-900 p-2` : 'hidden'}
        >
          <Image
            src={getChainLogo(network)}
            height={16}
            width={16}
            alt={'chain logo'}
          />
          <Typography variant="sm" className={'text-md -my-0.5 sm:-my-1 sm:text-xl'} weight={700}>
            {getChainInfo(network, 'NETWORK')}
          </Typography>
      </div>
      <div className={`flex items-end justify-between gap-2`}>
        { showSelect ? (
        <CurrencySearchModal
          chainId={chainId}
          selectedCurrency={currency}
          onCurrencySelect={(currency) => onSelect && onSelect(currency)}
          trigger={triggerA}
          currencyList={currencies}
          showSearch={false}
          // includeNativeCurrency={false}
        />
        ) : (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-full shadow-md cursor-pointer text-high-emphesis bg-dark-800 hover:bg-dark-700"
          >
          <CurrencyLogo currency={currency} className="!rounded-full overflow-hidden" size={20} />
          <Typography variant="sm" className="!text-xl" weight={700}>
            { currency.symbol }
          </Typography>
          {/* <ChevronDownIcon width={18} /> */}
        </div>
          // <div className={`flex p-2 bg-dark-800`}>
          // <CurrencyLogo currency={currency} size={20} className="!rounded-full overflow-hidden" />
          // <Typography variant="sm" className="!text-xl" weight={700}>
          //   {`${currency.symbol}`}
          // </Typography>
          // </div>
        )}
        </div>
    </div>
  )
}


BridgeAssetPanel.Header = BridgeAssetPanelHeader
BridgeAssetPanel.Switch = WalletSwitch

export default BridgeAssetPanel