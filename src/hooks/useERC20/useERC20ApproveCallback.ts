import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { CurrencyAmount, Currency } from 'sdk'
import { useCallback, useMemo } from 'react'
import ERC20ABI from 'constants/abis/bridge/erc20.json'

import { calculateGasMargin } from 'utils/swap/calculateGasMargin'
// import { useERC20Allowance } from './useERC20Allowance'
import { Contract } from '@ethersproject/contracts'
import useSendTransaction from 'hooks/useSendTransaction'
import { NotificationData } from 'components/Toast'
import { useActiveWeb3React } from 'services/web3'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { useTokenContract } from 'hooks/useTokenContract'
import { loadERC20Contract } from 'utils/wallet'
import { getSigner } from 'sdk'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useERC20ApproveCallback(
  watch: boolean,
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
  onSuccess?: (data: NotificationData) => void
): [ApprovalState, () => Promise<void>] {
  const { chainId, account, library } = useActiveWeb3React()

  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const TokenContract =  useTokenContract(token.address, true)

  const allowance = async (
    contractAddress: string,
    approvedAddress: string
  ) => {
    const contract = await loadERC20Contract(
      contractAddress,
      getSigner(library, account)
    );

    return contract.allowance(
      account,
      approvedAddress
    );
  }

  const currentAllowance = allowance(TokenContract.address, spender)[0]

  // useERC20Allowance(watch, token, account ?? undefined, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // if (isWritePending) return ApprovalState.PENDING

    // We might not have enough data to know whether we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance?.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, spender]) // isWritePending

  // @ts-ignore
  const tokenContract = useContract<Contract>({
  // const tokenContract = useContract<Contract>({
    addressOrName: token?.address ?? AddressZero,
    contractInterface: ERC20ABI,
    signerOrProvider: library.getSigner(),
  })

  const approve = useCallback(async (): Promise<void> => {
    if (!chainId) {
      console.error('Not connected')
      return
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // General fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    try {
      const data = await useSendTransaction(() => ({
        request: {
          from: account,
          to: tokenContract?.address,
          data: tokenContract.interface.encodeFunctionData('approve', [
            spender,
            useExact ? amountToApprove.quotient.toString() : MaxUint256,
          ]),
          gasLimit: calculateGasMargin(estimatedGas),
        },
      }))

      if (onSuccess) {
        const ts = new Date().getTime()
        onSuccess({
          type: 'approval',
          chainId: chainId,
          txHash: data.hash,
          promise: data?.hash, // data.await()
          summary: {
            pending: `Approving ${amountToApprove.currency.symbol}`,
            completed: `Successfully approved ${amountToApprove.currency.symbol}`,
            failed: `Something went wrong approving ${amountToApprove.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    } catch (e: unknown) {
      if (e instanceof UserRejectedRequestError) return
      console.error(e)
    }
  }, [
    chainId,
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    // sendTransactionAsync,
    account,
    onSuccess,
  ])

  return [approvalState, approve]
}
