import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { Field, MeowshiState } from '../../pages/tools/meowshi'
import React, { FC, useMemo, useState } from 'react'
import { SOUL, SPELL } from '../../constants'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'

import Button from '../../components/Button'
import { ChainId } from '@soulswap/sdk'
import Dots from '../../components/Dots'
import { ethers } from 'ethers'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions'
import { useLingui } from '@lingui/react'
import useMeowshi from '../../hooks/useMeowshi'
import { useTokenBalance } from '../../state/wallet/hooks'

interface MeowshiButtonProps {
  meowshiState: MeowshiState
}

const MeowshiButton: FC<MeowshiButtonProps> = ({ meowshiState }) => {
  const { currencies, meow: doMeow, fields } = meowshiState
  const { i18n } = useLingui()
  const [modalState, setModalState] = useState({
    attemptingTxn: false,
    txHash: '',
    open: false,
  })
  const { account, chainId } = useActiveWeb3React()
  const soulBalance = useTokenBalance(account, SOUL[ChainId.MAINNET])
  const spellBalance = useTokenBalance(account, SPELL)
  const { approvalState, approve, meow, unmeow, meowSoul, unmeowSoul } = useMeowshi(
    currencies[Field.INPUT] === SOUL[ChainId.MAINNET]
  )
  const balance = useTokenBalance(account, currencies[Field.INPUT])
  const parsedInputAmount = tryParseAmount(fields[Field.INPUT], currencies[Field.INPUT])
  const parsedOutputAmount = tryParseAmount(fields[Field.OUTPUT], currencies[Field.OUTPUT])

  const closeModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      open: false,
    }))
  }

  const handleSubmit = async () => {
    setModalState({
      attemptingTxn: true,
      open: true,
      txHash: '',
    })

    let tx
    if (doMeow) {
      if (currencies[Field.INPUT]?.symbol === 'SOUL') {
        tx = await meowSoul({
          value: ethers.utils.parseUnits(fields[Field.INPUT], soulBalance.currency.decimals),
          decimals: soulBalance.currency.decimals,
        })
      }
      if (currencies[Field.INPUT]?.symbol === 'SPELL') {
        tx = await meow({
          value: ethers.utils.parseUnits(fields[Field.INPUT], soulBalance.currency.decimals),
          decimals: spellBalance.currency.decimals,
        })
      }
    } else {
      if (currencies[Field.OUTPUT]?.symbol === 'SOUL') {
        tx = await unmeowSoul({
          value: ethers.utils.parseUnits(fields[Field.INPUT], soulBalance.currency.decimals),
          decimals: spellBalance.currency.decimals,
        })
      }
      if (currencies[Field.OUTPUT]?.symbol === 'SPELL') {
        tx = await unmeow({
          value: ethers.utils.parseUnits(fields[Field.INPUT], soulBalance.currency.decimals),
          decimals: spellBalance.currency.decimals,
        })
      }
    }

    if (tx?.hash) {
      setModalState((prevState) => ({
        ...prevState,
        attemptingTxn: false,
        txHash: tx.hash,
      }))
    } else {
      closeModal()
    }
  }

  const buttonDisabledText = useMemo(() => {
    if (!balance) return i18n._(t`Loading Balance`)
    if (parsedInputAmount?.greaterThan(balance)) return i18n._(t`Insufficient Balance`)
    if (!parsedInputAmount?.greaterThan(0)) return i18n._(t`Please enter an amount`)
    return null
  }, [balance, i18n, parsedInputAmount])

  if (!account)
    return (
      <Button onClick={approve} color="gradient" disabled={true}>
        {i18n._(t`Connect to wallet`)}
      </Button>
    )

  if (chainId !== ChainId.MAINNET)
    return (
      <Button onClick={approve} color="gradient" disabled={true}>
        {i18n._(t`Network not supported yet`)}
      </Button>
    )

  if (approvalState === ApprovalState.PENDING)
    return (
      <Button color="gradient" disabled={true}>
        <Dots>{i18n._(t`Approving`)}</Dots>
      </Button>
    )

  if (approvalState === ApprovalState.NOT_APPROVED)
    return (
      <Button onClick={approve} color="gradient" disabled={!!buttonDisabledText}>
        {buttonDisabledText || i18n._(t`Approve`)}
      </Button>
    )

  if (approvalState === ApprovalState.APPROVED)
    return (
      <>
        <TransactionConfirmationModal
          isOpen={modalState.open}
          onDismiss={closeModal}
          attemptingTxn={modalState.attemptingTxn}
          hash={modalState.txHash}
          content={() => (
            <ConfirmationModalContent
              title={i18n._(t`Confirm convert`)}
              onDismiss={closeModal}
              topContent={() => <span />}
              bottomContent={() => <span />}
            />
          )}
          pendingText={i18n._(
            t`Converting ${parsedInputAmount?.toSignificant(6, { groupSeparator: ',' })} ${
              meowshiState.currencies[Field.INPUT]?.symbol
            } for ${parsedOutputAmount?.toSignificant(6, { groupSeparator: ',' })} ${
              meowshiState.currencies[Field.OUTPUT]?.symbol
            }`
          )}
        />
        <Button onClick={handleSubmit} disabled={!!buttonDisabledText} color="gradient">
          {buttonDisabledText || i18n._(t`Convert`)}
        </Button>
      </>
    )
}

export default MeowshiButton
