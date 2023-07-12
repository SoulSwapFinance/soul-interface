import { CheckIcon, CogIcon } from '@heroicons/react/24/outline'
import { Percent } from 'sdk'
import { Button } from 'components/Button'
import CloseIcon from 'components/CloseIcon'
import Popover from 'components/Popover'
import QuestionHelper from 'components/QuestionHelper'
import Switch from 'components/Switch'
import TransactionSettings from 'components/TransactionSettings'
import Typography from 'components/Typography'
import { classNames } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useToggleSettingsMenu } from 'state/application/hooks'
import { useCrossChainModeManager, useUserOpenMev, useUserSingleHopOnly } from 'state/user/hooks'
import React, { FC, useState } from 'react'

// import { OPENMEV_ENABLED, OPENMEV_SUPPORTED_NETWORKS } from '../../config/openmev'

interface SettingsTabProps {
  placeholderSlippage?: Percent
  className?: string
}

const SettingsTab: FC<SettingsTabProps> = ({ placeholderSlippage, className }) => {
  const { chainId } = useActiveWeb3React()

  const toggle = useToggleSettingsMenu()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [userUseOpenMev, setUserUseOpenMev] = useUserOpenMev()

  return (
    <>
      <Popover
        placement="bottom-end"
        content={
          <div className="flex flex-col gap-3 p-3 border rounded shadow-xl bg-dark-900 w-80 border-dark-700">
            <div className="flex flex-col gap-4 p-3 border rounded border-dark-800/60">
              <Typography variant="xxs" weight={700} className="text-secondary">
                {`Transaction Settings`}
              </Typography>
              <TransactionSettings placeholderSlippage={placeholderSlippage} 
              />
            </div>
            <div className="flex flex-col gap-3 p-3 border rounded border-dark-800/60">
              <Typography variant="xxs" weight={700} className="text-secondary">
                {`Settings`}
              </Typography>
              {/* {!trident && ( */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Typography variant="xs" className="text-high-emphesis" weight={700}>
                      {`Disable multihops`}
                    </Typography>
                    <QuestionHelper text={`Restricts swaps to direct pairs only.`} />
                  </div>
                  <Switch
                    // color="gradient"
                    size="sm"
                    id="toggle-disable-multihop-button"
                    checked={singleHopOnly}
                    onChange={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                    checkedIcon={<CheckIcon className="text-dark-700" />}
                    uncheckedIcon={<CloseIcon />}
                  />
                </div>
              {/* )} */}
              {/* {OPENMEV_ENABLED && OPENMEV_SUPPORTED_NETWORKS.includes(chainId) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Typography variant="xs" className="text-high-emphesis" weight={700}>
                      {`OpenMEV Gas Refunder`}
                    </Typography>
                    <QuestionHelper text={`OpenMEV refunds up to 95% of transaction costs in 35 blocks.`} />
                  </div>
                  <Switch
                    size="sm"
                    id="toggle-use-openmev"
                    checked={userUseOpenMev}
                    onChange={() => (userUseOpenMev ? setUserUseOpenMev(false) : setUserUseOpenMev(true))}
                    checkedIcon={<CheckIcon className="text-dark-700" />}
                    uncheckedIcon={<CloseIcon />}
                    color="gradient"
                  />
                </div>
              )} */}
            </div>
          </div>
        }
      >
        <div
          className={classNames(className, 'flex items-center justify-center w-10 h-10 rounded-full cursor-pointer')}
        >
          <CogIcon className="w-[26px] h-[26px] transform rotate-90 hover:text-white" />
        </div>
      </Popover>
    </>
  )
}

export default SettingsTab