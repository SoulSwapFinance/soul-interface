import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { network } from 'config/wallets'
import { NetworkContextName } from '../../constants'
import useEagerConnect from 'hooks/useEagerConnect'
import useInactiveListener from 'hooks/useInactiveListener'
// import dynamic from 'next/dynamic'

import Loader from '../Loader'
// import { useRouter } from 'next/router'

// const GnosisManagerNoSSR = dynamic(() => import('./GnosisManager'), {
//   ssr: false,
// })

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork, chainId: chainId } = useWeb3React(NetworkContextName)
  const isMobile = window.innerWidth <= 460
  // const router = useRouter()
  // try to eagerly connect to an injected provider, if it exists and has granted access already
  // note: removed to allow always and prevent blank screen...
  const triedEager = isMobile ? useEagerConnect() : true

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate it
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-secondary">
          {'Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device'}
        </div>
      </div>
    )
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <div className="flex items-center justify-center h-80">
        <Loader />
      </div>
    ) : null
  }

  return (
    <>
      {/* <GnosisManagerNoSSR /> */}
      {children}
    </>
  )
}
