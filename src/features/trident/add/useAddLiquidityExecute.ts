import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount, toHex, Token } from 'sdk'
import { approveMasterContractAction, batchAction, getAsEncodedAction } from 'features/trident/actions'
import { setAddAttemptingTxn, setAddCoffinPermit } from 'features/trident/add/addSlice'
import { usePoolContext } from 'features/trident/PoolContext'
import { LiquidityInput } from 'features/trident/types'
import { toShareJSBI } from 'functions'
import { useTridentRouterContract } from 'hooks/useContract'
import { useActiveWeb3React } from 'services/web3'
import { USER_REJECTED_TX } from 'services/web3/WalletError'
import { useAppDispatch } from 'state/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCallback } from 'react'
import ReactGA from 'react-ga'

type ExecutePayload = {
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[]
  spendFromWallet: [boolean, boolean]
  liquidityMinted?: CurrencyAmount<Token>
  coffinPermit?: Signature
}

type UseAddLiquidityExecute = () => (x: ExecutePayload) => Promise<TransactionResponse | undefined>

export const useAddLiquidityExecute: UseAddLiquidityExecute = () => {
  const { poolWithState, rebases } = usePoolContext()
  const { chainId, library, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()

  return useCallback(
    async ({ parsedAmounts, spendFromWallet, liquidityMinted, coffinPermit }) => {
      const [parsedAmountA, parsedAmountB] = parsedAmounts
      const [nativeA, nativeB] = spendFromWallet

      if (!poolWithState?.pool || !chainId || !library || !account || !router || !liquidityMinted || !rebases) return
      const { pool } = poolWithState

      let value = '0x0'
      const liquidityInput: LiquidityInput[] = []
      const encoded = defaultAbiCoder.encode(['address'], [account])

      if (parsedAmountA) {
        if (parsedAmountA.currency.isNative && nativeA) {
          value = toHex(parsedAmountA)
        }

        liquidityInput.push({
          token: parsedAmountA.currency.isNative && nativeA ? AddressZero : parsedAmountA.currency.wrapped.address,
          native: nativeA,
          amount: nativeA
            ? parsedAmountA.quotient.toString()
            // @ts-ignore TYPE NEEDS FIXING
            : toShareJSBI(rebases[parsedAmountA.wrapped.currency.address], parsedAmountA.quotient).toString(),
        })
      }

      if (parsedAmountB) {
        if (parsedAmountB.currency.isNative && nativeB) {
          value = toHex(parsedAmountB)
        }

        liquidityInput.push({
          token: parsedAmountB.currency.isNative && nativeB ? AddressZero : parsedAmountB.currency.wrapped.address,
          native: nativeB,
          amount: nativeB
            ? parsedAmountB.quotient.toString()
          // @ts-ignore TYPE NEEDS FIXING
            : toShareJSBI(rebases[parsedAmountB.wrapped.currency.address], parsedAmountB.quotient).toString(),
        })
      }

      if (liquidityInput.length === 0) return

      try {
        dispatch(setAddAttemptingTxn(true))
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: router.address,
          data: batchAction({
            contract: router,
            actions: [
              approveMasterContractAction({ router, signature: coffinPermit }),
              getAsEncodedAction({
                contract: router,
                fn: 'addLiquidity',
                args: [liquidityInput, pool.liquidityToken.address, liquidityMinted.quotient.toString(), encoded],
              }),
            ],
          }),
          value,
        })

        await tx.wait()

        addTransaction(tx, {
          summary: `Add ${parsedAmountA?.toSignificant(3)} ${
              parsedAmountA?.currency.symbol
            } and ${parsedAmountB?.toSignificant(3)} ${parsedAmountB?.currency.symbol} into ${pool.token0.symbol}/${
              pool.token1.symbol
            }`
          ,
        })

        dispatch(setAddAttemptingTxn(false))

        ReactGA.event({
          category: 'Liquidity',
          action: 'Add',
          label: [pool.token0.symbol, pool.token1.symbol].join('/'),
        })

        dispatch(setAddCoffinPermit(undefined))
        return tx
      } catch (error) {
        dispatch(setAddAttemptingTxn(false))
        // we only care if the error is something _other_ than the user rejected the tx
        // @ts-ignore TYPE NEEDS FIXING
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error)
        }
      }
    },
    [poolWithState, chainId, library, account, router, rebases, dispatch, addTransaction]
  )
}