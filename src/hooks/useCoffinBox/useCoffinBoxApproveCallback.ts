import { useCallback, useMemo, useState } from 'react'
import { Signature, splitSignature } from '@ethersproject/bytes'
import { AddressZero, HashZero } from '@ethersproject/constants'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  // useDeprecatedContractWrite,
  useNetwork,
  UserRejectedRequestError,
  useSignTypedData,
} from 'wagmi'

import { COFFINBOX_ADDRESS, getCoffinBoxContractConfig } from './useCoffinBoxContract'
import { ApprovalState } from 'hooks/useERC20/useERC20ApproveCallback'
import { NotificationData } from 'components/Toast'

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useCoffinBoxApproveCallback({
  masterContract,
  watch,
  onSignature,
  onSuccess,
}: {
  masterContract?: string
  watch: boolean
  onSignature?(payload: Signature): void
  onSuccess?(data: NotificationData): void
}): [ApprovalState, Signature | undefined, () => Promise<void>] {
  const { address } = useAccount()
  const { chain } = useNetwork()

  // const { writeAsync } = useDeprecatedContractWrite({
  const { writeAsync } = useContractWrite({
    ...getCoffinBoxContractConfig(chain?.id),
    functionName: 'setMasterContractApproval',
    args: [address, masterContract, true, 0, HashZero, HashZero],
  })

  const { data: isCoffinBoxApproved, isLoading } = useContractRead({
    ...getCoffinBoxContractConfig(chain?.id),
    functionName: 'masterContractApproved',
    args: [masterContract, address],
    // This should probably always be true anyway...
    watch,
    enabled: Boolean(address && masterContract !== AddressZero),
  })

  const { refetch: getNonces } = useContractRead({
    ...getCoffinBoxContractConfig(chain?.id),
    functionName: 'nonces',
    args: [address ? address : AddressZero],
    enabled: false,
  })

  const [signature, setSignature] = useState<Signature>()

  const { signTypedDataAsync } = useSignTypedData()

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (isLoading || isCoffinBoxApproved === undefined) return ApprovalState.UNKNOWN
    if (signature && !isCoffinBoxApproved) return ApprovalState.PENDING
    return isCoffinBoxApproved ? ApprovalState.APPROVED : ApprovalState.NOT_APPROVED
  }, [isCoffinBoxApproved, signature, isLoading])

  const approveCoffinBox = useCallback(async (): Promise<void> => {
    if (!address) {
      console.error('no account connected')
      return
    }

    if (!chain) {
      console.error('no active chain')
      return
    }

    if (!(chain.id in COFFINBOX_ADDRESS)) {
      console.error(`no coffinbox for active chain ${chain.id}`)
      return
    }

    if (!masterContract) {
      console.error('no master contract')
      return
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    const { data: nonces } = await getNonces()
    try {
      const data = await signTypedDataAsync({
        domain: {
          name: 'CoffinBox V1',
          chainId: chain.id,
          // @ts-ignore
          verifyingContract: COFFINBOX_ADDRESS[chain.id],
        },
        types: {
          SetMasterContractApproval: [
            { name: 'warning', type: 'string' },
            { name: 'user', type: 'address' },
            { name: 'masterContract', type: 'address' },
            { name: 'approved', type: 'bool' },
            { name: 'nonce', type: 'uint256' },
          ],
        },
        value: {
          warning: 'Give FULL access to funds in (and approved to) CoffinBox?',
          user: address,
          // @ts-ignore
          masterContract,
          approved: true,
          nonce: nonces,
        },
      })
      setSignature(splitSignature(data))
      onSignature && onSignature(splitSignature(data))
    } catch (e: unknown) {
      if (e instanceof UserRejectedRequestError) return
      console.error('Error approving CoffinBox, attempting regular approval instead', e)
      // Regular approval as fallback
      const data = await writeAsync()
      if (onSuccess) {
        const ts = new Date().getTime()
        onSuccess({
          type: 'approval',
          chainId: chain?.id,
          txHash: data.hash,
          promise: data.wait(),
          summary: {
            pending: `Approving CoffinBox Master Contract`,
            completed: `Successfully approved the master contract`,
            failed: 'Something went wrong approving the master contract',
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    }
  }, [address, chain, masterContract, approvalState, getNonces, signTypedDataAsync, onSignature, writeAsync, onSuccess])

  return useMemo(() => [approvalState, signature, approveCoffinBox], [approvalState, approveCoffinBox, signature])
}
