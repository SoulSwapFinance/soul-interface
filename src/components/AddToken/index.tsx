import { FC } from 'react'
import useToggle from '../../hooks/useToggle'
import Image from 'next/image'
import { useActiveWeb3React } from 'services/web3';
import { getAddress } from '@ethersproject/address';
import { getChainLogoURL } from 'constants/chains';
import { Currency } from 'sdk';

const AddToken: FC = (tokenToAdd: Currency) => {
  const [state, toggle] = useToggle();
  const { chainId, library } = useActiveWeb3React()
  const csAddress = getAddress(tokenToAdd.wrapped.address)

  const BASE_URL = getChainLogoURL(chainId)
  const LOGO_URL = `${BASE_URL}/${csAddress}/logo.png`
  const SYMBOL = tokenToAdd.wrapped.symbol

  if(!state) {
    return (
      <div
      className="rounded-md border border-purple cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
      onClick={() => {
        const params: any = {
          type: 'ERC20',
          options: {
            address: csAddress,
            symbol: SYMBOL,
            decimals: 18,
            image: LOGO_URL,
          },
        }
        if (library && library.provider.isMetaMask && library.provider.request) {
          library.provider
            .request({
              method: 'wallet_watchAsset',
              params,
            })
            .then((success) => {
              if (success) {
                console.log(`Successfully added ${SYMBOL}`)
              } else {
                throw new Error('Something went wrong.')
              }
            })
            .catch(console.error)
        }
      }}
    >
      <Image
        src={ LOGO_URL }
        alt={ `${SYMBOL}` }
        width={1600}
        height={1600}
        objectFit="contain"
        className="rounded-md"
      />
    </div>
    )
  } else {
    return null;
  }

}

export default AddToken
