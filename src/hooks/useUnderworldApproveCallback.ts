import { splitSignature } from '@ethersproject/bytes'
import { AddressZero, HashZero } from '@ethersproject/constants'
import { ChainId, UNDERWORLD_ADDRESS } from 'sdk'
import UnderworldCooker, { signMasterContractApproval } from 'entities/UnderworldCooker'
import { useActiveWeb3React } from 'services/web3'
import { USER_REJECTED_TX } from 'services/web3/WalletError'
import { setUnderworldApprovalPending } from 'state/application/actions'
import { useUnderworldApprovalPending } from 'state/application/hooks'
import { useCoffinMasterContractAllowed } from 'state/coffinbox/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useCoffinBoxContract } from './useContract'

export enum CoffinApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED,
}

export interface UnderworldPermit {
  account: string
  masterContract: string
  v: number
  r: string
  s: string
}

export enum CoffinApproveOutcome {
  SUCCESS,
  REJECTED,
  FAILED,
  NOT_READY,
}

export type CoffinApproveResult = {
  outcome: CoffinApproveOutcome
  permit?: UnderworldPermit
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useUnderworldApproveCallback(): [
  CoffinApprovalState,
  boolean,
  UnderworldPermit | undefined,
  () => void,
  (pair: any, execute: (cooker: UnderworldCooker) => Promise<string>) => void
] {
  const { account, library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const [approveUnderworldFallback, setApproveUnderworldFallback] = useState<boolean>(false)
  const [underworldPermit, setUnderworldPermit] = useState<UnderworldPermit | undefined>(undefined)

  useEffect(() => {
    setUnderworldPermit(undefined)
  }, [account, chainId])

  const masterContract = chainId && UNDERWORLD_ADDRESS[chainId ?? ChainId.FANTOM]

  const pendingApproval = useUnderworldApprovalPending()
  const currentAllowed = useCoffinMasterContractAllowed(masterContract, account || AddressZero)
  const addTransaction = useTransactionAdder()

  // check the current approval status
  const approvalState: CoffinApprovalState = useMemo(() => {
    if (!masterContract) return CoffinApprovalState.UNKNOWN
    if (!currentAllowed && pendingApproval) return CoffinApprovalState.PENDING

    return currentAllowed ? CoffinApprovalState.APPROVED : CoffinApprovalState.NOT_APPROVED
  }, [masterContract, currentAllowed, pendingApproval])

  const coffinBoxContract = useCoffinBoxContract()

  const approve = useCallback(async (): Promise<CoffinApproveResult> => {
    if (approvalState !== CoffinApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return { outcome: CoffinApproveOutcome.NOT_READY }
    }
    if (!masterContract) {
      console.error('no token')
      return { outcome: CoffinApproveOutcome.NOT_READY }
    }

    if (!coffinBoxContract) {
      console.error('no coffinbox contract')
      return { outcome: CoffinApproveOutcome.NOT_READY }
    }

    if (!account) {
      console.error('no account')
      return { outcome: CoffinApproveOutcome.NOT_READY }
    }
    if (!library) {
      console.error('no library')
      return { outcome: CoffinApproveOutcome.NOT_READY }
    }

    try {
      const signature = await signMasterContractApproval(
        coffinBoxContract,
        masterContract,
        account,
        library,
        true,
        chainId
      )
      const { v, r, s } = splitSignature(signature)
      return {
        outcome: CoffinApproveOutcome.SUCCESS,
        permit: { account, masterContract, v, r, s },
      }
    } catch (e) {
      return {
        // @ts-ignore TYPE NEEDS FIXING
        outcome: e.code === USER_REJECTED_TX ? CoffinApproveOutcome.REJECTED : CoffinApproveOutcome.FAILED,
      }
    }
  }, [approvalState, account, library, chainId, coffinBoxContract, masterContract])

  const onApprove = async function () {
    if (!approveUnderworldFallback) {
      const result = await approve()
      if (result.outcome === CoffinApproveOutcome.SUCCESS) {
        setUnderworldPermit(result.permit)
      } else if (result.outcome === CoffinApproveOutcome.FAILED) {
        setApproveUnderworldFallback(true)
      }
    } else {
      const tx = await coffinBoxContract?.setMasterContractApproval(account, masterContract, true, 0, HashZero, HashZero)
      dispatch(setUnderworldApprovalPending('Approve Underworld'))
      await tx.wait()
      dispatch(setUnderworldApprovalPending(''))
    }
  }

  const onCook = async function (pair: any, execute: (cooker: UnderworldCooker) => Promise<string>) {
    const cooker = new UnderworldCooker(pair, account, library, chainId)
    let summary
    if (approvalState === CoffinApprovalState.NOT_APPROVED && underworldPermit) {
      cooker.approve(underworldPermit)
      summary = 'Approve Underworld and ' + (await execute(cooker))
    } else {
      summary = await execute(cooker)
    }
    const result = await cooker.cook()
    if (result.success) {
      addTransaction(result.tx, { summary })
      setUnderworldPermit(undefined)
      await result.tx.wait()
    }
  }

  return [approvalState, approveUnderworldFallback, underworldPermit, onApprove, onCook]
}

export default useUnderworldApproveCallback