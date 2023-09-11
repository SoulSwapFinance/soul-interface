import { Currency, CurrencyAmount } from 'sdk'
import { BAD_RECIPIENT_ADDRESSES } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import useENS from 'hooks/useENS'
import { isAddress } from 'functions/validate'

type Args = {
  typedValue: string
  recipient: string | null | undefined
  parsedAmountFromTypedValue: CurrencyAmount<Currency> | undefined
  currencyIn: Currency | undefined
  currencyOut: Currency | undefined
  balanceIn: CurrencyAmount<Currency> | undefined
}
const useGetInputError = (args: Args): string | undefined => {
  const { typedValue, recipient, currencyIn, currencyOut, parsedAmountFromTypedValue: parsedAmount, balanceIn } = args
  const { account, chainId } = useActiveWeb3React()

  const recipientLookup = useENS(recipient ?? undefined)
  const to = (recipient === null || recipient === '' ? account : recipientLookup.address) ?? null

  let inputError: string | undefined
  if (!account) {
    inputError = `Connect Wallet`
  }

  if (!parsedAmount) {
    if (typedValue) inputError = inputError ?? `Invalid Amount`
    else inputError = inputError ?? `Enter Amount`
  }

  if (!currencyIn || !currencyOut) {
    inputError = inputError ?? `Select Token`
  }

  const formattedTo = isAddress(chainId, to)
  if (!to || !formattedTo) {
    inputError = inputError ?? `Enter Recipient`
  } else {
    if (BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1) {
      inputError = inputError ?? `Invalid Recipient`
    }
  }

  if (parsedAmount && ((balanceIn && balanceIn.lessThan(parsedAmount)) || !balanceIn)) {
    inputError = `Insufficient ${parsedAmount.currency.symbol} Balance`
  }

  return inputError
}

export default useGetInputError
