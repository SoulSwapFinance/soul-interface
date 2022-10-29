import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
import React, { FC, ReactNode } from 'react'
import { useActiveWeb3React } from 'services/web3'

import SwapCallbackError from './SwapCallbackError'

interface SwapModalFooter {
  onConfirm: () => void
  swapErrorMessage?: ReactNode
  disabledConfirm: boolean
}

const SwapModalFooter: FC<SwapModalFooter> = ({ onConfirm, swapErrorMessage, disabledConfirm }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  return (
    <div className="flex flex-col gap-4">
      <Button onClick={onConfirm} disabled={disabledConfirm} id="confirm-swap-or-send" color={getChainColorCode(chainId)}>
        {i18n._(t`Confirm Swap`)}
      </Button>

      {swapErrorMessage && <SwapCallbackError error={swapErrorMessage} />}
    </div>
  )
}

export default SwapModalFooter
