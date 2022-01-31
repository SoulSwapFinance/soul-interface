import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CoffinboxIcon, WalletIcon } from 'components/Icon'
import React from 'react'

const useBalancesMenuItems = () => {
  const { i18n } = useLingui()
  return [
    {
      key: 'wallet',
      label: i18n._(t`Wallet Assets`),
      icon: <WalletIcon width={20} height={20} />,
      link: '/balances',
    },
    {
      key: 'coffinbox',
      label: i18n._(t`CoffinBox`),
      icon: <CoffinboxIcon width={20} height={20} />,
      link: '/coffinbox',
    },
    // {
    //   key: 'liquidity',
    //   label: i18n._(t`Deposited Assets`),
    //   icon: <CoffinboxIcon width={20} height={20} />,
    //   link: '/trident/balances/liquidity',
    // },
  ]
}

export default useBalancesMenuItems