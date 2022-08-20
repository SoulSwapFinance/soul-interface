import { Token } from 'sdk'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import React, { FC } from 'react'

import { ImportToken } from '../SearchModal/ImportToken'
import { useActiveWeb3React } from 'services/web3'

interface TokenWarningModal {
  isOpen: boolean
  // chainId: number
  tokens: Token[]
  onConfirm: () => void
}

const TokenWarningModal: FC<TokenWarningModal> = ({ isOpen, tokens, onConfirm }) => {
  const { chainId } = useActiveWeb3React() 
  return (
    <HeadlessUiModal.Controlled 
      isOpen={isOpen}
      chainId={chainId}
      onDismiss={onConfirm}>
      <ImportToken tokens={tokens} />
    </HeadlessUiModal.Controlled>
  )
}

export default TokenWarningModal
