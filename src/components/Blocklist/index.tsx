import config from 'config'
import { useActiveWeb3React } from 'services/web3'
import React, { ReactNode, useMemo } from 'react'

export default function Blocklist({ children }: { children: ReactNode }) {
  const { account } = useActiveWeb3React()
  const blocked: boolean = useMemo(() => Boolean(account && config.blockedAddresses.indexOf(account) !== -1), [account])
  if (blocked) {
    return <div>Blocked Address</div>
  }
  return <>{children}</>
}