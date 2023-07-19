import { ChainId, Percent } from '../../sdk'
import React, { useCallback, useRef, useState } from 'react'
import {
  // useCrossChainModeManager,
  // useUserArcherUseRelay,
  useUserSingleHopOnly,
} from '../../state/user/hooks'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'

import  { ApplicationModal } from 'state/application/reducer'
import QuestionHelper from 'components/QuestionHelper'
import { Toggle } from 'components/Toggle'
import Typography from 'components/Typography'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useActiveWeb3React } from 'services/web3'
import TransactionSettings from 'components/TransactionSettings'
import { getChainColor } from 'constants/chains'
import { classNames } from 'functions'
import CogIcon from 'components/Icons/exchange/CogIcon'

// import Image from '../../components/Image'
// import { Button } from 'components/Button'
// import Modal from 'components/DefaultModal'
// import ModalHeader from 'components/Modal/Header'

export default function SettingsTab({ placeholderSlippage }: { placeholderSlippage?: Percent }) {
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  // const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  // const [ttl, setTtl] = useUserTransactionTTL()
  const WHITE = `#FFFFFF`
  // const chainColor = getChainColor(chainId)
  // const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay()
  const COG_ICON = <CogIcon
    fillPrimary={open ? getChainColor(chainId) : WHITE}
    fillSecondary={open ? WHITE : getChainColor(chainId)}
    className={classNames([ChainId.ETHEREUM, ChainId.AVALANCHE, ChainId.FANTOM].includes(chainId) ? `cursor-pointer rounded-md w-7 h-7` : `hidden`)}
  />
  
  return (
    <div className="relative flex" ref={node}>
      <div
        className={
          `flex items-center justify-center
          w-5 h-5 sm:w-6 sm:h-6 rounded cursor-pointer sm:absolute sm:bottom-36 sm:mb-7 sm:right-1.5
          `
        }
        onClick={toggle}
        id="open-settings-dialog-button"
      >
        {COG_ICON}
        {/* <CogIcon className="w-[36px] h-[46px] transform rotate-90 hover:text-white" /> */}
      </div>
      {open && (
        <div className="absolute top-14 right-0 z-50 -mr-2.5 min-w-20 md:m-w-22 md:-mr-5 bg-dark-900 border-2 border-dark-800 rounded w-80 shadow-lg">
          <div className="p-4 space-y-4">
            {/* <Typography weight={700} className="text-high-emphesis">
              {`Transaction Settings`}
            </Typography> */}

            <TransactionSettings placeholderSlippage={placeholderSlippage} />

            {/* <Typography className="text-high-emphesis" weight={700}>
              {`Settings`}
            </Typography> */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Typography variant="sm" className="text-primary">
                  {`Disable Multihops`}
                </Typography>
                <QuestionHelper text={`Restricts swaps to direct pairs only.`} />
              </div>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
