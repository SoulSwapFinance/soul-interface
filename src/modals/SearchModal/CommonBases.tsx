import { ChainId, Currency, CurrencyAmount, NATIVE, ZERO } from 'sdk'
import { COMMON_BASES } from 'constants/routing'
import { currencyId } from 'functions'
import { useCurrencyModalContext } from 'modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'services/web3'
import React, { FC } from 'react'
import { getChainColorCode } from 'constants/chains'
import { CurrencyRow } from './CurrencyList'

const CommonBases: FC = () => {
  const { chainId } = useActiveWeb3React()

  // const tokenBalance = useCurrencyBalance(chainId, account, selectedCurrency)
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId ?? ChainId.FANTOM] ?? [] : []
  // const balance = useCurrencyBalance(chainId, account ?? undefined, selectedCurrency)
  if (bases.length === 0) return <></>

  return (
    <div className="flex items-center flex-col space-y-2 mb-2">
      {/* <div className={`flex flex-row font-bold border border-purple p-1.5 w-full justify-center rounded-2xl mt-2`}>
        {`Popular Tokens`}
      </div> */}
      <div
        className={`bg-dark-900 w-full rounded-2xl p-2 border border-${getChainColorCode(chainId)}`}
      >
        <CurrencyRow 
          chainId={chainId} 
          // currency={selectedCurrency} 
          currency={NATIVE[chainId ?? ChainId.FANTOM]} 
          style={undefined}
        />
      </div>

      <div
        className={`bg-dark-900 w-full rounded-2xl p-2 border border-purple`}
      >
        {bases.map((currency: Currency) => {
          // const isSelected = selectedCurrency?.equals(currency)
          // const { userTokenInfo } = useUserTokenInfo(account, currencyId(currency))
          // const balance = formatNumber(Number(userTokenInfo?.balance) / 10 ** currency.decimals, false, true)

          return (
            <CurrencyRow 
            chainId={chainId} 
            // currency={selectedCurrency} 
            currency={currency}
            key={currencyId(currency)}
            style={undefined}
          />
            // <Button
            //   variant="empty"
            //   type="button"
            //   onClick={() => !isSelected && onSelect(currency)}
            //   disabled={isSelected}
            //   key={currencyId(currency)}
            //   // className="flex items-center p-0.5 m-0.5 sm:p-.8 sm:m-1.5 space-x-2 rounded bg-dark-800 hover:bg-dark-700 disabled:bg-dark-1000 disabled:cursor-not-allowed"
            //   className="flex flex-cols justify-between text-center w-full mt-2 p-0.5 rounded-2xl bg-dark-800 hover:bg-dark-700 disabled:bg-dark-1000 disabled:cursor-not-allowed"
            // >
            //   <div
            //     className={'grid grid-cols-3 sm:grid-cols-3 w-full p-2 sm:p-0 items-center justify-center'}
            //   >
            //     <div className="flex items-center justify-center">
            //       <CurrencyLogo
            //         className={`flex`}
            //         currency={currency}
            //         size={36}
            //       />
            //     </div>
            //     <Typography className="hidden sm:grid sm:text-sm font-semibold">
            //       {currency.name}
            //     </Typography>
            //     <Typography className="hidden sm:grid sm:text-sm font-semibold">
            //       {`${balance} ${currency.symbol}`}
            //     </Typography>
            //     <Typography className="text-sm sm:hidden font-semibold">
            //       {`${currency.symbol}`}
            //     </Typography>
            //     <Typography className="text-sm sm:hidden font-semibold">
            //       {`${balance} ${currency.symbol}`}
            //     </Typography>
            //   </div>
            // </Button>
          )
        })}
      </div>
    </div>
  )
}

export default CommonBases
