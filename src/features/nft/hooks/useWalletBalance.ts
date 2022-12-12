import { BigNumber } from '@ethersproject/bignumber'
import type { Web3Provider } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useETHBalances } from 'state/wallet/hooks'
// import { useNativeCurrencyBalances } from 'state/connection/hooks'

interface WalletBalanceProps {
  address: string
  balance: string
  weiBalance: BigNumber
  provider: Web3Provider | undefined
}

export function useWalletBalance(): WalletBalanceProps {
  const { account, library } = useActiveWeb3React()
  const provider = library.provider
  const balanceString = useETHBalances(account ? [account] : [])?.[account ?? '']?.toSignificant(3) || '0'
  let address = account

  return account == null
    ? {
        address: '',
        balance: '0',
        weiBalance: parseEther('0'),
        provider: undefined,
      }
    : {
        // @ts-ignore
        account,
        balance: balanceString,
        weiBalance: parseEther(balanceString),
        provider,
      }
}