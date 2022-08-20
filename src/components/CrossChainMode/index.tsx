import { ChainId, Percent } from '../../sdk'
import React, { useCallback, useRef, useState } from 'react'
import { CheckIcon, CogIcon } from '@heroicons/react/outline'
import {
  useCrossChainModeManager,
  // useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
} from '../../state/user/hooks'
import { useModalOpen, useToggleCrossChainMode } from '../../state/application/hooks'
import Image from '../../components/Image'

// import { AdjustmentsIcon } from '@heroicons/react/outline'
import { ApplicationModal } from '../../state/application/actions'
// import {Toggle} from 'components/Toggle'
import { CrossChainToggle } from 'components/Toggle'
import { useLingui } from '@lingui/react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useActiveWeb3React } from 'services/web3'
import CROSSCHAIN from "assets/icons/cross-chain.png"

export default function CrossChainTab({ placeholderSlippage }: { placeholderSlippage?: Percent }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.CROSSCHAIN)
  const toggle = useToggleCrossChainMode()
  const [crosschainMode, toggleCrossChainMode] = useCrossChainModeManager()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  // const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay()

  return (
    <div
      className="items-center justify-end w-20 h-8 rounded cursor-pointer"
      onClick={toggle}
      id="open-settings-dialog-button"
    >
      {/* <div className="flex" ref={node}> */}
        <CrossChainToggle
          id="toggle-cross-chain-mode-button"
          isActive={crosschainMode}
          toggle={() => {
            toggleCrossChainMode()
          }}
        />
      </div>
    // </div>
  )
}
