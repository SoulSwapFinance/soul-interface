import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from 'sdk'
import HeadlessUIModal from 'components/Modal/HeadlessUIModal'
import NavLink from 'components/NavLink'
import Typography from 'components/Typography'
import features from 'config/features'
import { NETWORK_ICON } from 'config/networks'
import { Feature } from 'enums'
import { SUPPORTED_NETWORKS } from 'modals/NetworkModal'
import { useActiveWeb3React } from 'services/web3'
import cookie from 'cookie-cutter'
import Image from 'next/image'
import React, { FC } from 'react'
import { getChainColorCode } from 'constants/chains'

interface NetworkGuardProps {
  children?: React.ReactChild
  feature: Feature
}

const Component: FC<NetworkGuardProps> = ({ children, feature }) => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()

  const link = (
    <NavLink href="/swap">
      <a className={`text-${getChainColorCode(chainId)} focus:outline-none`}>{i18n._(t`Return`)}</a>
    </NavLink>
  )

  const supportedNetworks = Object.entries(features).reduce<string[]>((acc, [k, v]) => {
    if (v.includes(feature)) {
      acc.push(k)
    }

    return acc
  }, [])

  return (
    <>
      <HeadlessUIModal.Controlled
        isOpen={!!account && !features[chainId].includes(feature)}
        chainId={chainId}
        onDismiss={() => null}
        transparent={true}
      >
        <div className="flex flex-col gap-2 justify-center p-4 mt-10 lg:mt-0">
          {/* <Typography className="max-w-2xl text-lg sm:text-2xl text-white text-center" weight={700}>            {
          i18n._(t`Unavailable on ${NETWORK_LABEL[chainId]}.`)}
          </Typography>
          <Typography className="text-center">
            <Trans
              id="{link} or change network."
              values={{ link }}
              components={Fragment}
            />
          </Typography> */}
          <Typography className="uppercase text-white text-center text-lg mb-4 tracking-[.2rem]" weight={700}>
            {i18n._(t`SWITCH CHAIN`)}
          </Typography>
          <div className="flex gap-5 md:gap-10 justify-center">
            {supportedNetworks.map((key: string, idx: number) => (
              <button
                className={`text-primary hover:text-white flex items-center flex-col gap-2 justify-start`}
                key={idx}
                onClick={() => {
                  const params = SUPPORTED_NETWORKS[key]
                  cookie.set('chainId', key)
                  if (key === ChainId.FANTOM.toString()) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0xFA' }, account])
                  } else if (key === ChainId.TELOS.toString()) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x28' }, account])
                  } else if (key === ChainId.AVALANCHE.toString()) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: 'A86A' }, account])
                  } else if (key === ChainId.ETHEREUM.toString()) {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account])
                  }
                }}
              >
                <div className="w-[70px] h-[70px]">
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className={`rounded-sm filter drop-shadow-currencyLogo bg-${getChainColorCode(Number(key))}`}
                    width="60px"
                    height="60px"
                  />
                </div>
                <NavLink
                  href='/swap'
                >
                  <div className={`flex mt-1 text-sm font-bold text-${getChainColorCode(Number(key))} justify-center`}>
                    {`Return to Exchange`}
                  </div>
                </NavLink>
              </button>
            ))}
          </div>
        </div>
        {/* <Typography className="text-xl">{NETWORK_LABEL[key]}</Typography> */}
      </HeadlessUIModal.Controlled>
      {children}
    </>
  )
}

const NetworkGuard = (feature: Feature) => {
  // @ts-ignore TYPE NEEDS FIXING
  return ({ children }) => <Component feature={feature}>{children}</Component>
}

export default NetworkGuard