import { ChainId } from '../../sdk'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { useActiveWeb3React } from 'services/web3'
import { useCallback } from 'react'

const DEFAULT_NETWORK = {
  [ChainId.ETHEREUM]: 'ethereum'
}

const DEFAULT_CRYPTO_CURRENCY = {
  [ChainId.ETHEREUM]: 'ETH'
}

export default function Buy() {
  const { account, chainId } = useActiveWeb3React()
  const onClick = useCallback(() => {
    if (!(chainId in DEFAULT_NETWORK)) {
      return
    }

    const widget = new RampInstantSDK({
      userAddress: account,
      hostAppName: 'SOUL',
      hostLogoUrl: 'http://soulswap-interface.vercel.app/_next/image?url=%2Flogo.png&w=32&q=75',
      defaultAsset: DEFAULT_CRYPTO_CURRENCY[chainId ?? ChainId.FANTOM],
    })

    widget.show()
  }, [account, chainId])

  return (
    <a
      id={`buy-link`}
      onClick={onClick}
      className="p-2 cursor-pointer text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
    >
      {`Buy`}
    </a>
  )
}
