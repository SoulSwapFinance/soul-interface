import { ChainId, Currency, CurrencyAmount, ZERO } from 'sdk'
import Chip from 'components/Chip'
import { CurrencyLogo } from 'components/CurrencyLogo'
import Loader from 'components/Loader'
import { MouseoverTooltip } from 'components/Tooltip'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import { isTokenOnList } from 'functions/validate'
import { useIsUserAddedToken } from 'hooks/Tokens'
import { useCurrencyModalContext } from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import { useCombinedActiveList } from 'state/lists/hooks'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'
import { useCurrencyBalance } from 'state/wallet/hooks'
import React, { CSSProperties, FC, useMemo } from 'react'
// import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER'
}

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <Typography
      weight={balance.greaterThan(ZERO) ? 700 : 400}
      className={classNames(
        balance.greaterThan(ZERO) ? 'text-high-emphesis' : 'text-low-emphesis',
        'whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis'
      )}
      title={balance.toExact()}
    >
      {balance.greaterThan(ZERO) ? balance.toSignificant(4) : '0.00'}
    </Typography>
  )
}

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <div className="flex justify-end">
      <MouseoverTooltip text={tag.description}>
        <Chip color="purple" key={tag.id} label={tag.name} />
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Chip color="purple" key={tag.id} label="..." />
        </MouseoverTooltip>
      ) : null}
    </div>
  )
}

interface CurrencyRow {
  chainId: ChainId
  currency: Currency
  style: CSSProperties
}

export const CurrencyRow: FC<CurrencyRow> = ({ chainId, currency, style }) => {
  const { account } = useActiveWeb3React()
  const { onSelect, currency: selectedCurrency } = useCurrencyModalContext()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency.isToken ? currency : undefined)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(chainId, account ?? undefined, currency)

  return (
    <div
      id={`token-item-${key}`}
      className={classNames(
        currency === selectedCurrency ? 'opacity-20 pointer-events-none' : '',
        `flex items-center w-full hover:bg-dark-800/40 px-4 py-2 token-${currency?.symbol}`
      )}
      style={style}
      {...(currency !== selectedCurrency && { onClick: () => onSelect(currency) })}
    >
      <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
        <div className="flex flex-row items-center flex-grow gap-3">
          <CurrencyLogo currency={currency} size={32} className="!rounded-full overflow-hidden" />
          <div className="flex flex-col">
            <Typography variant="xxs" className="text-secondary">
              {currency.name} {!isOnSelectedList && customAdded && '• Added by user'}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {currency.symbol}
            </Typography>
          </div>
          <TokenTags currency={currency} />
        </div>
        <div className="flex items-center">{balance ? <Balance balance={balance} /> : account ? <Loader /> : null}</div>
      </div>
    </div>
  )
}


const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

// const widthSize = 
//   Number(screen.width) <= 320 ? 230
//   : Number(screen.width) <= 348 ? 248
//   : Number(screen.width) <= 375 ? 286
//   : 360

const BreakLineComponent: FC<{ style: CSSProperties }> = ({ style }) => {

  return (
    <div className="flex w-full px-4 border-t border-dark-800" style={style}>
      <div className="flex flex-col gap-0.5 justify-center">
        <Typography variant="xs" weight={700}>
          {`Expanded results from inactive token lists`}
        </Typography>
        <Typography variant="xxs">
          {`Tokens from inactive lists: import specific tokens below or
            click manage to activate more lists.`}
        </Typography>
      </div>
    </div>
  )
}

interface CurrencyList {
  chainId: ChainId
  currencies: Currency[]
  otherListTokens?: WrappedTokenInfo[]
  selectedCurrency?: Currency | null
  otherCurrency?: Currency | null
}

const CurrencyList: FC<CurrencyList> = ({ chainId, currencies, otherListTokens }) => {
  const itemData: (Currency | BreakLine)[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, BREAK_LINE, ...otherListTokens]
    }
    return currencies

  }, [currencies.length, otherListTokens])

  const Row = ({ index, key, style }) => {
    const currency = itemData[index]
    if (isBreakLine(currency)) {
      return <BreakLineComponent style={style} key={key} />
    }

    return <CurrencyRow chainId={chainId} currency={currency} style={style} key={key} />
  }

  return (
    <div 
      id="all-currencies-list" 
      // className="flex flex-col flex-1 flex-grow h-full divide-y divide-dark-800"
      className="flex flex-col w-full"
      >
      {/* <AutoSizer> */}
        {/* {({ height, width }) => ( */}
          <List 
            className={'flex sm:w-full'}
            height={324}
            // width={324} 
            itemCount={itemData.length} itemSize={48}>
            {Row}
          </List>
          {/* )} */}
       {/* </AutoSizer> */}
    </div>
  )
}

export default CurrencyList
