// import { CurrencyAmount, JSBI, Token } from '../sdk'

// import { t } from '@lingui/macro'
// import { tryParseAmount } from '../../functions'
// import { useActiveWeb3React } from 'services/web3'

// // based on typed value
// export function useDerivedStakeInfo(
//   typedValue: string,
//   stakingToken: Token | undefined,
//   userLiquidityUnstaked: CurrencyAmount<Token> | undefined
// ): {
//   parsedAmount?: CurrencyAmount<Token>
//   error?: string
// } {
//   const { account } = useActiveWeb3React()

//   const parsedInput: CurrencyAmount<Token> | undefined = tryParseAmount(typedValue, stakingToken)

//   const parsedAmount =
//     parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.quotient, userLiquidityUnstaked.quotient)
//       ? parsedInput
//       : undefined

//   let error: string | undefined

//   if (!account) {
//     error = t`Connect Wallet`
//   }
//   if (!parsedAmount) {
//     error = error ?? t`Enter Amount`
//   }

//   return {
//     parsedAmount,
//     error,
//   }
// }

// // based on typed value
// export function useDerivedUnstakeInfo(
//   typedValue: string,
//   stakingAmount: CurrencyAmount<Token>
// ): {
//   parsedAmount?: CurrencyAmount<Token>
//   error?: string
// } {
//   const { account } = useActiveWeb3React()

//   const parsedInput: CurrencyAmount<Token> | undefined = tryParseAmount(typedValue, stakingAmount.currency)

//   const parsedAmount =
//     parsedInput && JSBI.lessThanOrEqual(parsedInput.quotient, stakingAmount.quotient) ? parsedInput : undefined

//   let error: string | undefined

//   if (!account) {
//     error = t`Connect Wallet`
//   }
//   if (!parsedAmount) {
//     error = error ?? t`Enter Amount`
//   }

//   return {
//     parsedAmount,
//     error,
//   }
// }

export {}
