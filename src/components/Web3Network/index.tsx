import React, { useCallback, useState } from 'react'
import { NETWORK_ICON, NETWORK_LABEL } from 'config/networks'
import NetworkModel from 'modals/NetworkModal'
import { switchToNetwork } from 'functions/network'

import { useActiveWeb3React } from 'services/web3'
import { useModalOpen, useNetworkModalToggle } from 'state/application/hooks'
import Image from 'next/image'
import { useRouter } from 'next/router'
// import useIsWindowVisible from 'hooks/useIsWindowVisible'
// import usePrevious from 'hooks/usePrevious'
import { ApplicationModal } from 'state/application/reducer'
import { getChainColor, getChainColorCode } from 'constants/chains'

function Web3Network() {
  const { chainId, library } = useActiveWeb3React()
  const toggleNetworkModal = useNetworkModalToggle()
  const [attemptingSwitchFromUrl, setAttemptingSwitchFromUrl] = useState(false)

  // const [switchedFromUrl, setSwitchedFromUrl] = useState(false)
  // const isWindowVisible = useIsWindowVisible()
  // const prevChainId = usePrevious(chainId)
  // const queryChainId = Number(router.query.chainId)
  const router = useRouter()

  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)

  const handleChainSwitch = useCallback(
    (targetChain) => {
      if (!library || !library?.provider) {
        setAttemptingSwitchFromUrl(false)
        return
      }

      switchToNetwork({ provider: library.provider, chainId: targetChain })
        .then(() => {
          return router.replace(
            {
              pathname: router.pathname,
              query: { ...router.query, chainId: targetChain },
            },
            undefined,
            { shallow: true }
          )
        })
        .finally(() => {
          if (networkModalOpen) {
            toggleNetworkModal()
          }
        })
    },
    [library, router, toggleNetworkModal, networkModalOpen]
  )



  if (!chainId) return null

  return (
    <div
    className={`flex items-center rounded-md bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-md justify-center font-bold cursor-pointer select-none pointer-events-auto`}
    onClick={() => toggleNetworkModal()}
    >
      <div className={`grid items-center grid-flow-col justify-center h-[24px] w-[24px] text-sm rounded pointer-events-auto auto-cols-max text-secondary`}>
        <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className={``}width={24} height={24} />
      <NetworkModel 
        switchNetwork={(targetChain) => {
          handleChainSwitch(targetChain)
        }}
      />
      </div>
      {/* { NETWORK_LABEL[chainId] } */}
    </div>
  )
}

export default Web3Network