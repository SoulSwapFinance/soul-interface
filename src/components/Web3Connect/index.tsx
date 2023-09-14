import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
// import { classNames } from 'functions'
import { useWalletModalToggle } from 'state/application/hooks'
import React from 'react'
import { Activity } from 'react-feather'

import { Button, ButtonProps } from '../Button'
import useDesktopHeaderMediaQuery from 'hooks/useDesktopHeaderMediaQuery'
import WalletIcon from 'components/Icons/header/WalletIcon'
import { classNames } from 'functions/styling'
// import { useUserInfo } from 'hooks/useAPI'
// import { getWalletColor } from 'components/Web3Status'

export default function Web3Connect({ color = 'purple', size = 'sm', className = '', ...rest }: ButtonProps) {
  const toggleWalletModal = useWalletModalToggle()
  const { account, error } = useWeb3React()
  const isDesktop = useDesktopHeaderMediaQuery()
  // const { userInfo } = useUserInfo()
  // const votingPower = Number(userInfo?.votingPower)

  return (
    (account && error) && (
      <div
        className="flex items-center justify-center px-4 py-2 font-semibold text-white border rounded bg-opacity/80 border-red bg-red hover:bg-opacity/100"
        onClick={toggleWalletModal}
      >
        <div className="mr-1">
          <Activity className="w-4 h-4" />
        </div>
        {error instanceof UnsupportedChainIdError ? `You are on the wrong network` : `Error`}
      </div>
    ) || ( !account &&
      isDesktop ?
      <Button
        id="connect-wallet"
        onClick={toggleWalletModal}
        variant="outlined"
        color={'avaxRed'}
        className={classNames(className, '!border-none')}
        size={size}
        {...rest}
      >
        {`Connect`}
        </Button>
       : (
        <div
          onClick={toggleWalletModal}
          className={`flex ml-3 mt-2`}
        >
          <WalletIcon
            fillPrimary={`#E84142`} // avaxRed
            fillSecondary={'#FFFFFF'}
            className={'w-7 h-7'}
          />
        </div>
      )
    )
  )
}
