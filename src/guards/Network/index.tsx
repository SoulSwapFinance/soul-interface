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
import { getChainColor, getChainColorCode } from 'constants/chains'
import { ArrowLeft } from 'react-feather'
import { Button } from 'components/Button'

interface NetworkGuardProps {
  children?: React.ReactChild
  feature: Feature
}

const Component: FC<NetworkGuardProps> = ({ children, feature }) => {
  const { chainId, library, account } = useActiveWeb3React()

  const link = (
    <NavLink href="/swap">
      <Typography className={`text-${getChainColorCode(chainId)} focus:outline-none`}>{`Return`}</Typography>
    </NavLink>
  )

  const supportedNetworks = Object.entries(features).reduce<string[]>((acc, [k, v]) => {
    if (v.includes(feature)) {
      acc.push(k)
    } else { return acc }

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
        <div
          className={
            `flex flex-col bg-dark-800 rounded-2xl border border-[${getChainColor(chainId)}] gap-2 justify-center p-4 mt-10 lg:mt-0`
          }
        >
          <Typography
            className={`uppercase text-white bg-dark-900 p-3 rounded-2xl text-center text-lg mb-4 tracking-[.2rem]`}
            weight={700}
          >
            {`SWITCH CHAIN`}
          </Typography>
          <div className="flex gap-5 md:gap-10 justify-center">
            {supportedNetworks.map((key: string, idx: number) => (
              <Button
                className={`text-primary hover:text-white flex items-center flex-col gap-2 justify-start`}
                key={idx}
                // onClick={() => switchNetwork(key)}

                onClick={() => {
                  const params = SUPPORTED_NETWORKS[key]
                  cookie.set('chainId', key)
                  if (key === '0xFA') {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0xFA' }, account])
                  } else if (key === '0x28') {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x28' }, account])
                  } else if (key === '0xA86A') {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0xA86A' }, account])
                  } else if (key === '0x1') {
                    library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
                  } else {
                    library?.send('wallet_addEthereumChain', [params, account])
                  }
                }}
              >
                <div className="flex flex-row w-full h-full justify-center">
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className={
                      `rounded-2xl p-3 m-3 filter drop-shadow-currencyLogo
                        border hover:border-${getChainColorCode(Number(key))}
                        bg-${getChainColorCode(Number(key))}`
                    }
                    width={64}
                    height={64}
                  />
                </div>
              </Button>
            ))}
          </div>
          <NavLink
            href='/swap'
          >
            {/* <ArrowLeft /> */}
            <div
              className={
                `flex  gap-4 p-2 rounded-2xl border hover:border-${getChainColorCode(chainId)} bg-${getChainColorCode(chainId)} text-white mt-1 text-sm font-bold justify-center`
              }>
              <div className={'flex justify-end'}>
                {`←`}
              </div>
              <div className={
                'flex justify-left'
              }>
                {`Return to Exchange`}
              </div>
            </div>
          </NavLink>
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