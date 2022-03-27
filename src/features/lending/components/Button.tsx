import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { COFFIN_BOX_ADDRESS, WNATIVE_ADDRESS } from 'sdk'
import Alert from 'components/Alert'
import { Button } from 'components/Button'
import Dots from 'components/Dots'
import { tryParseAmount } from 'functions/parse'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useUnderworldApproveCallback, { CoffinApprovalState } from 'hooks/useUnderworldApproveCallback'
import { useActiveWeb3React } from 'services/web3'
import React from 'react'

export function UnderworldApproveButton({ content, color }: any): any {
  const { i18n } = useLingui()
  const [underworldApprovalState, approveUnderworldFallback, underworldPermit, onApprove, onCook] = useUnderworldApproveCallback()
  const showApprove =
    (underworldApprovalState === CoffinApprovalState.NOT_APPROVED || underworldApprovalState === CoffinApprovalState.PENDING) &&
    !underworldPermit
  const showChildren = underworldApprovalState === CoffinApprovalState.APPROVED || underworldPermit

  return (
    <>
      {approveUnderworldFallback && (
        <Alert
          message={i18n._(
            t`Something went wrong during signing of the approval. This is expected for hardware wallets, such as Trezor and Ledger. Click again and the fallback method will be used`
          )}
          className="mb-4"
        />
      )}

      {showApprove && (
        <Button color={color} onClick={onApprove} className="mb-4" fullWidth={true}>
          {i18n._(t`Approve Underworld`)}
        </Button>
      )}

      {showChildren && React.cloneElement(content(onCook), { color })}
    </>
  )
}

export function TokenApproveButton({ children, value, token, needed, color }: any): any {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const [approvalState, approve] = useApproveCallback(
    tryParseAmount(value, token),
    chainId ? COFFIN_BOX_ADDRESS[chainId] : undefined
  )

  const showApprove =
    chainId &&
    token &&
    token.address !== WNATIVE_ADDRESS[chainId] &&
    needed &&
    value &&
    (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)

  return showApprove ? (
    <Button color={color} onClick={approve} className="mb-4" fullWidth={true}>
      {approvalState === ApprovalState.PENDING ? (
        <Dots>{`Approving ${token.symbol}`}</Dots>
      ) : (
        <>
          {i18n._(t`Approve`)} {token.symbol}
        </>
      )}
    </Button>
  ) : (
    React.cloneElement(children, { color })
  )
}