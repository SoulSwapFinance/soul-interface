/* eslint-disable */
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRedirectOnChainId = (address: string) => {
  const router = useRouter()

  useEffect(() => {
    const { chainId } = useWeb3React()
    // const { ethereum } = window
    // if (ethereum && ethereum.on) {
    if (chainId && chainId == 1) {
      const onChainChange = () => router.push(address)

      // ethereum.on('chainChanged', onChainChange)
      return () => {
        // if (ethereum.removeListener) {
        //   ethereum.removeListener('chainChanged', onChainChange)
        // }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}