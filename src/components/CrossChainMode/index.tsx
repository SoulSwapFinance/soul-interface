import { ChainId, Percent } from '../../sdk'
import React, { useCallback, useRef, useState } from 'react'
import {
  useCrossChainModeManager,
} from '../../state/user/hooks'
import  { ApplicationModal } from 'state/application/reducer'

import { useModalOpen, useToggleCrossChainMode } from '../../state/application/hooks'

import { CrossChainToggle } from 'components/Toggle'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

export default function CrossChainTab({ placeholderSlippage }: { placeholderSlippage?: Percent }) {

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
      className="items-center justify-end sm:w-20 w-16 h-8 rounded cursor-pointer"
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
