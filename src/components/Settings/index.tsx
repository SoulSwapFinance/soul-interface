import { ChainId, Percent } from '../../sdk'
import React, { useCallback, useRef, useState } from 'react'
import { CheckIcon, CogIcon } from '@heroicons/react/outline'
import {
  // useCrossChainModeManager,
  // useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
} from '../../state/user/hooks'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
// import Image from '../../components/Image'

// import { AdjustmentsIcon } from '@heroicons/react/outline'
import  { ApplicationModal } from 'state/application/reducer'
import { Button } from 'components/Button'
import Modal from 'components/DefaultModal'
import QuestionHelper from 'components/QuestionHelper'
import { Toggle } from 'components/Toggle'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useActiveWeb3React } from 'services/web3'
import TransactionSettings from 'components/TransactionSettings'
import ModalHeader from 'components/Modal/Header'

export default function SettingsTab({ placeholderSlippage }: { placeholderSlippage?: Percent }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  const [ttl, setTtl] = useUserTransactionTTL()

  // const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay()

  return (
    <div className="relative flex" ref={node}>
      <div
        className="flex items-center justify-center w-6 h-6 rounded cursor-pointer"
        onClick={toggle}
        id="open-settings-dialog-button"
      >
        <CogIcon className="w-[36px] h-[46px] transform rotate-90 hover:text-white" />
      </div>
      {open && (
        <div className="absolute top-14 right-0 z-50 -mr-2.5 min-w-20 md:m-w-22 md:-mr-5 bg-dark-900 border-2 border-dark-800 rounded w-80 shadow-lg">
          <div className="p-4 space-y-4">
            {/* <Typography weight={700} className="text-high-emphesis">
              {i18n._(t`Transaction Settings`)}
            </Typography> */}

            <TransactionSettings placeholderSlippage={placeholderSlippage} />

            {/* <Typography className="text-high-emphesis" weight={700}>
              {i18n._(t`Settings`)}
            </Typography> */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Typography variant="sm" className="text-primary">
                  {i18n._(t`Disable Multihops`)}
                </Typography>
                <QuestionHelper text={i18n._(t`Restricts swaps to direct pairs only.`)} />
              </div>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
              />
            </div>
            {/* {chainId == ChainId.ETHEREUM && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {i18n._(t`MEV Shield by Archer DAO`)}
                  </Typography>
                  <QuestionHelper
                    text={i18n._(
                      t`Send transaction privately to avoid front-running and sandwich attacks. Requires a miner tip to incentivize miners`
                    )}
                  />
                </div>
                <Toggle
                  id="toggle-use-archer"
                  isActive={userUseArcher}
                  toggle={() => setUserUseArcher(!userUseArcher)}
                />
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  )
}
