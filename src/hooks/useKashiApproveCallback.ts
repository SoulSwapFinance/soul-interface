import KashiCooker, { signMasterContractApproval } from '../entities/KashiCooker'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { UNDERWORLD_ADDRESS } from '../constants/kashi'
import { ethers } from 'ethers'
import { setKashiApprovalPending } from '../state/application/actions'
import { useActiveWeb3React } from 'services/web3'
import { useCoffinBoxContract } from '../hooks/useContract'
import { useCoffinMasterContractAllowed } from '../state/coffinbox/hooks'
import { useDispatch } from 'react-redux'
import { useKashiApprovalPending } from '../state/application/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'

export enum CoffinApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  FAILED,
  APPROVED,
}

export interface KashiPermit {
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
  permit?: KashiPermit
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
function useKashiApproveCallback(): [
  CoffinApprovalState,
  boolean,
  KashiPermit | undefined,
  () => void,
  (pair: any, execute: (cooker: KashiCooker) => Promise<string>) => void
] {
  const { account, library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const [approveKashiFallback, setApproveKashiFallback] = useState<boolean>(false)
  const [kashiPermit, setKashiPermit] = useState<KashiPermit | undefined>(undefined)

  useEffect(() => {
    setKashiPermit(undefined)
  }, [account, chainId])

  const masterContract = chainId && UNDERWORLD_ADDRESS[chainId]

  const pendingApproval = useKashiApprovalPending()
  const currentAllowed = useCoffinMasterContractAllowed(masterContract, account || ethers.constants.AddressZero)
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
      const { v, r, s } = ethers.utils.splitSignature(signature)
      return {
        outcome: CoffinApproveOutcome.SUCCESS,
        permit: { account, masterContract, v, r, s },
      }
    } catch (e) {
      return {
        outcome: e.code === 4001 ? CoffinApproveOutcome.REJECTED : CoffinApproveOutcome.FAILED,
      }
    }
  }, [approvalState, account, library, chainId, coffinBoxContract, masterContract])

  const onApprove = async function () {
    if (!approveKashiFallback) {
      const result = await approve()
      if (result.outcome === CoffinApproveOutcome.SUCCESS) {
        setKashiPermit(result.permit)
      } else if (result.outcome === CoffinApproveOutcome.FAILED) {
        setApproveKashiFallback(true)
      }
    } else {
      const tx = await coffinBoxContract?.setMasterContractApproval(
        account,
        masterContract,
        true,
        0,
        ethers.constants.HashZero,
        ethers.constants.HashZero
      )
      dispatch(setKashiApprovalPending('Approve Kashi'))
      await tx.wait()
      dispatch(setKashiApprovalPending(''))
    }
  }

  const onCook = async function (pair: any, execute: (cooker: KashiCooker) => Promise<string>) {
    const cooker = new KashiCooker(pair, account, library, chainId)
    let summary
    if (approvalState === CoffinApprovalState.NOT_APPROVED && kashiPermit) {
      cooker.approve(kashiPermit)
      summary = 'Approve Kashi and ' + (await execute(cooker))
    } else {
      summary = await execute(cooker)
    }
    const result = await cooker.cook()
    if (result.success) {
      addTransaction(result.tx, { summary })
      setKashiPermit(undefined)
      await result.tx.wait()
    }
  }

  return [approvalState, approveKashiFallback, kashiPermit, onApprove, onCook]
}

export default useKashiApproveCallback
