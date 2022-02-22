import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, SOUL_ADDRESS, Token } from 'sdk'
import selectCoinAnimation from 'animation/select-coin.json'
import { Button } from 'components/Button'
import Chip from 'components/Chip'
import { CurrencyLogo } from 'components/CurrencyLogo'
import { CoffinboxIcon, WalletIcon } from 'components/Icon'
import NumericalInput from 'components/Input/Numeric'
import Switch from 'components/Switch'
import Typography from 'components/Typography'
import CoffinBoxFundingSourceModal from 'features/trident/add/CoffinBoxFundingSourceModal'
import { classNames, formatNumber, maxAmountSpend, maxAmountWithdraw, tryParseAmount } from 'functions'
import { useCoffinOrWalletBalance } from 'hooks/useCoffinOrWalletBalance'
import useDesktopMediaQuery from 'hooks/useDesktopMediaQuery'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import CurrencySearchModal from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import Lottie from 'lottie-react'

import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePrice } from 'hooks/usePrice'
import { FiatValue } from './FiatValue'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'
import { useCurrency } from 'hooks/Tokens'
import { formatCurrency } from 'modals/TokensStatsModal'

interface AssetInputProps {
  value?: string
  currency?: Currency
  currencyAddress?: string
  token0?: string,
  token1?: string,
  onChange: (x: string | undefined, max?: boolean) => void
  spendFromWallet?: boolean
  title?: string
  onSelect?: (x: Token) => void
  headerRight?: ReactNode
  chip?: string
  disabled?: boolean
  currencies?: string[]
  id?: string
  className?: string
  currencyLogo?: boolean
  size?: 'sm' | 'md'
  balance?: number
  showMax?: boolean
}

type AssetInput<P> = FC<P> & {
  WalletSwitch: FC<AssetInputWalletSwitchProps>
  Panel: FC<AssetInputPanelProps>
}

const AssetInputContext = createContext<boolean>(false)
const useAssetInputContextError = () => useContext(AssetInputContext)

// AssetInput exports its children so if you need a child component of this component,
// for example if you want this component without the title, take a look at the components this file exports
const AssetInput: AssetInput<AssetInputProps> = ({
  spendFromWallet = true,
  currencyLogo = true,
  className,
  size = 'md',
  balance: balanceProp,
  showMax = true,
  ...props
}) => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  const coffinOrWalletBalance = useCoffinOrWalletBalance(
    account && !balanceProp ? account : undefined,
    props.currency,
    spendFromWallet
  )
  const balance = balanceProp || Number(coffinOrWalletBalance)
  
  // const halfSpend =
  //   halfAmountSpend(balance)?.toExact()
  // const halfSpendAsFraction = maxAmountSpend(balance.divide(2))?.asFraction
  
  const maxSpend = maxAmountWithdraw(Number(balance)) //?.toExact()
  const maxSpendAsFraction = maxAmountWithdraw(balance) //?.asFraction
  
  const parsedInput = tryParseAmount(props.value, props.currency)
  const error = balance ? parsedInput?.greaterThan(balance) : false

  let header = (
    <Typography variant="h3" weight={700} className="text-high-emphesis">
      {props.title ? props.title : i18n._(t`Choose an Asset`)}
    </Typography>
  )

  if (props.currency) {
    header = (
      <div
        className={classNames(props.onSelect ? 'cursor-pointer ' : '', 'flex gap-2.5 items-center')}
        onClick={() => setOpen(true)}
      >
        <div className="flex gap-0.5 items-center">
          <Typography id={props.id} variant="h3" weight={700} className="text-high-emphesis">
            {props.currency.symbol}
          </Typography>
          {props.onSelect && (
            <>
              <ChevronDownIcon width={24} height={24} className="text-secondary" />
              <CurrencySearchModal.Controlled
                open={open}
                selectedCurrency={props.currency}
                onCurrencySelect={props.onSelect}
                onDismiss={() => setOpen(false)}
                currencyList={props.currencies}
              />
            </>
          )}
        </div>
        {props.chip && <Chip color="white" label={props.chip} />}
      </div>
    )
  }

  return (
    <AssetInputContext.Provider value={useMemo(() => (error ? error : false), [error])}>
      <div className={classNames(className, 'flex flex-col gap-4 mt-4 lg:mt-0')}>
        {(props.title || props.headerRight) && (
          <div className="flex justify-between px-2">
            {props.title !== '' && header}
            {!isDesktop && props.headerRight && props.headerRight}
          </div>
        )}
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-0">
          <AssetInputPanel
          onHalf={function (): void {
            throw new Error('Function not implemented.')
          } } {...props}
          size={size}
          currencyLogo={currencyLogo}
          spendFromWallet={spendFromWallet}
          onMax={() => props.onChange(maxSpend.toString())}
          showMax={showMax && balance && maxSpendAsFraction && balance > 0
            ? !parsedInput?.equalTo(maxSpendAsFraction)
            : false}
          footer={<AssetInputPanel.Balance
            balance={balance}
            onMaxClick={() => props.onChange(maxSpend.toString())}
            spendFromWallet={spendFromWallet}
            id={props.id + '-balance'} />}          />
          {isDesktop && props.headerRight}
        </div>
      </div>
    </AssetInputContext.Provider>
  )
}

interface AssetInputPanelProps extends AssetInputProps {
  onHalf: () => void
  onMax: () => void
  footer?: ReactNode
  showMax?: boolean
  error?: boolean
}

const AssetInputPanel = ({
  value,
  currency,
  currencyAddress,
  token0,
  token1,
  onChange,
  onSelect,
  onHalf,
  onMax,
  footer,
  disabled,
  showMax = true,
  currencies = [],
  headerRight,
  currencyLogo,
  size,
}: AssetInputPanelProps) => {
  const error = useAssetInputContextError()
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()

  let tokenA = useCurrency(token0)
  let tokenB = useCurrency(token1)

  // console.log('token0: ', token0)

  let [data] = useV2PairsWithPrice([[tokenA, tokenB]])
  let [state, pair, pairPrice] = data

  // const pairValue = useUSDCValue(tryParseAmount(Number(value) === 0 ? '1' : value, currency))
  const usdcValue = useUSDCValue(tryParseAmount(Number(value) === 0 ? '1' : value, currency))
  const tokenPrice = usePrice(currencyAddress)
 
  // const usdValue = usePrice(currency.toString())
  const span = useRef<HTMLSpanElement | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isDesktop && span.current) {
      setWidth(value ? span?.current?.clientWidth + 6 : 60)
    }
  }, [isDesktop, value])

  let content = (
    <div className="flex flex-row gap-3 py-2.5 px-2 flex-grow items-center">
      <div className="w-12 h-12 rounded-full">
        <Lottie animationData={selectCoinAnimation} autoplay loop />
      </div>
      {onSelect && (
        <>
          <CurrencySearchModal
            trigger={
              <div className="inline-flex items-center">
                <Button
                  disabled={disabled}
                  color="blue"
                  size="sm"
                  variant="filled"
                  className="!rounded-full"
                  endIcon={<ChevronDownIcon width={24} height={24} />}
                >
                  {i18n._(t`Select Token`)}
                </Button>
              </div>
            }
            selectedCurrency={currency}
            onCurrencySelect={onSelect}
            currencyList={currencies}
          />
        </>
      )}
    </div>
  )

  if (currency) {
    content = (
      <div
        className={classNames(
          error ? 'border-red border-opacity-40' : 'border-dark-800',
          size === 'md' ? 'py-4' : 'py-2',
          'flex gap-3 py-4 px-3 items-center border-b'
        )}
      >
        {currencyLogo && (
          <div>
            <CurrencyLogo currency={currency} size={size === 'md' ? 48 : 40} className="!rounded-full" />
          </div>
        )}
        <div className="flex flex-col flex-grow">
          <Typography variant="h3" weight={700} className="relative flex flex-row items-baseline overflow-hidden">
            <NumericalInput
              disabled={disabled}
              value={value || ''}
              onUserInput={onChange}
              placeholder="0.00"
              className="bg-transparent"
              autoFocus
            />

            {isDesktop && (
              <span className="absolute leading-7 pointer-events-none text-low-emphesis" style={{ left: width }}>
                {currency?.symbol}
              </span>
            )}
          </Typography>
          <Typography
            id={currency.symbol + '-usdc-value'}
            variant="xs"
            className={error ? 'text-red' : value ? 'text-green' : 'text-low-emphesis'}
          >
            ≈{usdcValue ? usdcValue.toSignificant(4) : ( 
              currency.symbol == 'SOUL' ? formatCurrency(tokenPrice * Number(value), 2) :
              formatCurrency(pairPrice * Number(value), 2))            
            }
          </Typography>
        </div>
        {error ? (
          <ExclamationCircleIcon className="w-8 h-8 mr-2 text-red" />
        ) : (
          showMax && (
            <Button size="xs" variant="outlined" color="gray" className="!border" onClick={() => onMax()}>
              Max
            </Button>
          )
        )}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'border',
        error ? 'border-red border-opacity-40' : 'border-dark-800',
        headerRight ? 'lg:rounded-l lg:rounded-r-[0px]' : 'lg:rounded',
        'flex-1 rounded bg-dark-900 flex flex-col overflow-hidden'
      )}
    >
      {/* Acts as a reference to get input width */}
      <Typography variant="h3" weight={700} className="relative flex flex-row items-baseline">
        <span ref={span} className="opacity-0 absolute pointer-events-none tracking-[0]">
          {`${maxAmountSpend ? maxAmountSpend : '0.00'}`}
        </span>
      </Typography>
      {content}
      {footer && footer}
    </div>
  )
}

interface AssetInputPanelBalanceProps {
  balance?: number
  manu?: number
  onMaxClick: (x: number | undefined) => void
  spendFromWallet?: boolean
  id?: string
}

// This component seems to occur quite frequently which is why I gave it it's own component.
// It's a child of AssetInputPanel so only use together with an AssetInputPanel
const AssetInputPanelBalance: FC<AssetInputPanelBalanceProps> = ({ 
  balance, 
  onMaxClick, 
  spendFromWallet = true, id }) => {
  const { i18n } = useLingui()
  const error = useAssetInputContextError()

  let icon = (
    <WalletIcon width={16} height={14} className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')} />
  )
  if (!spendFromWallet) {
    icon = (
      <CoffinboxIcon
        width={16}
        height={16}
        className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis', 'truncate')}
      />
    )
  }

  return (
    <div className={classNames(error ? 'bg-red/10' : '', 'flex justify-between py-2 px-3')}>
      {/* <div className="flex items-center gap-2.5 mr-1">
        {icon}
        <Typography variant="sm" className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis')}>
          {i18n._(t`Balance:`)}
        </Typography>
      </div> */}
      {/* <div className="flex items-center">
      <Typography
        variant="sm"
        weight={700}
        className={classNames(balance ? 'text-high-emphesis' : 'text-low-emphesis', 'truncate')}
        onClick={() => onMaxClick(balance)}
        id={id}
      >
        {balance ? `${balance}` : '0.00'}
      </Typography>
      </div> */}
    </div>
  )
}

interface AssetInputWalletSwitchProps {
  checked: boolean
  onChange: (x: boolean) => void
  label?: string
  id?: string
}

const AssetInputWalletSwitch: FC<AssetInputWalletSwitchProps> = ({ checked, onChange, label, id }) => {
  const error = useAssetInputContextError()

  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()

  const helper = <CoffinBoxFundingSourceModal />

  return (
    <div
      className={classNames(
        error ? 'lg:border-red/40' : 'lg:border-dark-800',
        'lg:p-4 flex gap-1.5 items-center lg:border-r lg:border-t lg:border-b lg:bg-dark-900 lg:rounded-r lg:justify-center lg:min-w-[120px]'
      )}
    >
      <div className="flex items-center gap-3 lg:flex-col">
        <div className="flex flex-col order-1 lg:order-2">
          <Typography variant="xxs" weight={700} className="text-right text-secondary lg:text-center">
            {/* {label || i18n._(t`Funding source:`)} */}
          </Typography>
          <Typography
            variant="sm"
            weight={700}
            className="text-right text-high-emphesis lg:text-center lg:flex lg:gap-1 lg:items-center lg:justify-center"
          >
            {checked ? i18n._(t`Wallet`) : i18n._(t`CoffinBox`)} {isDesktop && helper}
          </Typography>
        </div>
        <div className="order-2 lg:order-1">
          <Switch
            id={id}
            checked={checked}
            onChange={onChange}
            checkedIcon={
              <div className="flex items-center justify-center w-full h-full text-dark-700">
                <WalletIcon width={16} height={14} />
              </div>
            }
            uncheckedIcon={
              <div className="flex items-center justify-center w-full h-full text-dark-700">
                <CoffinboxIcon width={16} height={16} />
              </div>
            }
          />
        </div>
      </div>

      {!isDesktop && helper}
    </div>
  )
}

AssetInputPanel.Balance = AssetInputPanelBalance
AssetInput.Panel = AssetInputPanel
AssetInput.WalletSwitch = AssetInputWalletSwitch

export default AssetInput