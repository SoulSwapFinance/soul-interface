import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
// import { classNames } from 'functions'
import { useWalletModalToggle } from 'state/application/hooks'
import React from 'react'
import { Activity } from 'react-feather'

import { Button, ButtonProps } from '../Button'
// import useDesktopHeaderMediaQuery from 'hooks/useDesktopHeaderMediaQuery'
import WalletIcon from 'components/Icons/header/WalletIcon'
// import { useUserInfo } from 'hooks/useAPI'
// import { getWalletColor } from 'components/Web3Status'

export default function Web3Connect({ color = 'purple', size = 'sm', className = '', ...rest }: ButtonProps) {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const { error } = useWeb3React()
  // const isDesktop = useDesktopHeaderMediaQuery()

  // const { userInfo } = useUserInfo()
  // const votingPower = Number(userInfo?.votingPower)


  return error ? (
    <div
      className="flex items-center justify-center px-4 py-2 font-semibold text-white border rounded bg-opacity-80 border-red bg-red hover:bg-opacity-100"
      onClick={toggleWalletModal}
    >
      <div className="mr-1">
        <Activity className="w-4 h-4" />
      </div>
      {error instanceof UnsupportedChainIdError ? i18n._(t`You are on the wrong network`) : i18n._(t`Error`)}
    </div>
  ) : ( 
    // isDesktop ?
    <div 
      onClick={toggleWalletModal}
      className={`flex ml-2 mt-1.5`}
    >
      <WalletIcon
        fillPrimary={`#E84142`} // avaxRed
        fillSecondary={'#FFFFFF'} 
        className={'w-7 h-7'}
      />
  </div>
    // <Button
    //   id="connect-wallet"
      // onClick={toggleWalletModal}
    //   variant="outlined"
    //   color={color}
    //   className={classNames(className, '!border-none')}
    //   size={size}
    //   {...rest}
    // >
    //   {/* {i18n._(t`Connect Wallet`)} */}
    //   {i18n._(t`Connect`)}
    // </Button>
  //  :
  //   <Button
  //   id="connect-wallet"
  //   onClick={toggleWalletModal}
  //   variant="outlined"
  //   color={color}
  //   className={classNames(className, '!border-none')}
  //   size={size}
  //   {...rest}
  // >
  //   {i18n._(t`Connect`)}
  // </Button>
  )
}
