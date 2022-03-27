import { Signature, splitSignature } from '@ethersproject/bytes'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { signMasterContractApproval } from 'entities/UnderworldCooker'
import { useActiveWeb3React } from 'services/web3'
import { USER_REJECTED_TX } from 'services/web3/WalletError'
import { useCoffinMasterContractAllowed } from 'state/coffinbox/hooks'
import { useAllTransactions, useTransactionAdder } from 'state/transactions/hooks'
import { useCallback, useMemo, useState } from 'react'

import { useCoffinBoxContract } from './useContract'

export enum CoffinApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED,
}

export enum CoffinApproveOutcome {
  SUCCESS,
  REJECTED,
  FAILED,
  NOT_READY,
}

const useCoffinHasPendingApproval = (masterContract?: string, account?: string, contractName?: string) => {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof masterContract === 'string' &&
      typeof account === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const summary = tx.summary
          if (!summary) return false
          return summary === `Approving ${contractName} Master Contract`
        }
      }),
    [allTransactions, account, masterContract, contractName]
  )
}

export interface CoffinPermit {
  outcome: CoffinApproveOutcome
  signature?: Signature
  data?: string
}

export interface CoffinMasterApproveCallback {
  approvalState: CoffinApprovalState
  approve: () => Promise<void>
  getPermit: () => Promise<CoffinPermit | undefined>
  permit: CoffinPermit | undefined
}

export interface CoffinMasterApproveCallbackOptions {
  otherCoffinBoxContract?: Contract | null
  contractName?: string
  functionFragment?: string
}

const useCoffinMasterApproveCallback = (
  masterContract: string | undefined,
  { otherCoffinBoxContract, contractName, functionFragment }: CoffinMasterApproveCallbackOptions
): CoffinMasterApproveCallback => {
  const { i18n } = useLingui()
  const { account, chainId, library } = useActiveWeb3React()
  const coffinBoxContract = useCoffinBoxContract()
  const addTransaction = useTransactionAdder()
  const currentAllowed = useCoffinMasterContractAllowed(masterContract, account || AddressZero)
  const pendingApproval = useCoffinHasPendingApproval(masterContract, account ? account : undefined, contractName)
  const [permit, setPermit] = useState<CoffinPermit | undefined>()

  const approvalState: CoffinApprovalState = useMemo(() => {
    if (permit) return CoffinApprovalState.APPROVED
    if (pendingApproval) return CoffinApprovalState.PENDING

    // We might not have enough data to know whether or not we need to approve
    if (currentAllowed === undefined) return CoffinApprovalState.UNKNOWN
    if (!masterContract || !account) return CoffinApprovalState.UNKNOWN
    if (!currentAllowed) return CoffinApprovalState.NOT_APPROVED

    return CoffinApprovalState.APPROVED
  }, [account, currentAllowed, masterContract, pendingApproval, permit])

  const getPermit = useCallback(async () => {
    if (approvalState !== CoffinApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!masterContract) {
      console.error('masterContract is null')
      return
    }

    if (!account) {
      console.error('no account')
      return
    }

    try {
      const signatureString = await signMasterContractApproval(
        coffinBoxContract,
        masterContract,
        account,
        library,
        true,
        chainId
      )

      const signature = splitSignature(signatureString)
      const permit = {
        outcome: CoffinApproveOutcome.SUCCESS,
        signature: splitSignature(signature),
        data: (otherCoffinBoxContract || coffinBoxContract)?.interface?.encodeFunctionData(
          functionFragment || 'setMasterContractApproval',
          [account, masterContract, true, signature.v, signature.r, signature.s]
        ),
      }

      setPermit(permit)
      return permit
    } catch (e) {
      return {
        // @ts-ignore TYPE NEEDS FIXING
        outcome: e.code === USER_REJECTED_TX ? CoffinApproveOutcome.REJECTED : CoffinApproveOutcome.FAILED,
        signature: undefined,
        data: undefined,
      }
    }
  }, [
    account,
    approvalState,
    coffinBoxContract,
    chainId,
    functionFragment,
    library,
    masterContract,
    otherCoffinBoxContract,
  ])

  const approve = useCallback(async () => {
    try {
      const tx = await (otherCoffinBoxContract || coffinBoxContract)?.setMasterContractApproval(
        account,
        masterContract,
        true,
        0,
        HashZero,
        HashZero
      )

      return addTransaction(tx, {
        summary: contractName
          ? i18n._(t`Approving ${contractName} Master Contract`)
          : i18n._(t`Approving Master Contract`),
      })
    } catch (e) {}
  }, [account, addTransaction, coffinBoxContract, contractName, i18n, masterContract, otherCoffinBoxContract])

  return {
    approvalState,
    approve,
    getPermit,
    permit,
  }
}

export default useCoffinMasterApproveCallback