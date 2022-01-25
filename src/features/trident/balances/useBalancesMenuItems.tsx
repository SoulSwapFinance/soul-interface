import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoboxIcon, WalletIcon } from 'components/Icon'
import React from 'react'

const useBalancesMenuItems = () => {
  const { i18n } = useLingui()
  return [
    {
      key: 'wallet',
      label: i18n._(t`Wallet Assets`),
      icon: <WalletIcon width={20} height={20} />,
      link: '/trident/balances/wallet',
    },
    // {
    //   key: 'bentobox',
    //   label: i18n._(t`BentoBox`),
    //   icon: <BentoboxIcon width={20} height={20} />,
    //   link: '/trident/balances/bentobox',
    // },
    {
      key: 'liquidity',
      label: i18n._(t`Deposited Assets`),
      icon: <BentoboxIcon width={20} height={20} />,
      link: '/trident/balances/liquidity',
    },
  ]
}

export default useBalancesMenuItems