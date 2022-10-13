import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from 'sdk'
import { CoffinboxIcon, WalletIcon } from 'components/Icon'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import { Feature } from 'enums/Feature'
import ActionItem from 'features/portfolio/ActionsModal/ActionItem'
import { setBalancesActiveModal } from 'features/portfolio/portfolioSlice'
import { useBalancesSelectedCurrency } from 'features/portfolio/useBalancesDerivedState'
import { ActiveModal } from 'features/trident/types'
import { featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useAppDispatch } from 'state/hooks'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'

interface ActionViewProps {
  onClose(): void
}

const ActionView: FC<ActionViewProps> = ({ onClose }) => {
  const { chainId } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const dispatch = useAppDispatch()
  const { i18n } = useLingui()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    // @ts-ignore TYPE NEEDS FIXING
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      if (currency?.isNative) return router.push('/trident/swap')
      // @ts-ignore TYPE NEEDS FIXING
      return router.push(`/exchange/swap?&tokens=${NATIVE[chainId].symbol}&tokens=${currency?.wrapped.address}`)
    }

    if (currency?.isNative) return router.push('/swap')

    return router.push(`/swap?inputCurrency=${currency?.wrapped.address}`)
  }, [chainId, currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Available Actions`)} onClose={onClose} />
      <ActionItem
        svg={<SwitchHorizontalIcon width={24} />}
        label={i18n._(t`Swap ${currency?.isNative ? NATIVE[chainId].symbol : currency?.symbol}`)}
        onClick={swapActionHandler}
      />
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {featureEnabled(Feature.COFFINBOX, chainId) && (
        <>
          <ActionItem
            svg={<CoffinboxIcon width={20} height={20} />}
            label={i18n._(t`Deposit to CoffinBox`)}
            onClick={() => dispatch(setBalancesActiveModal(ActiveModal.DEPOSIT))}
          />
          <ActionItem
            svg={<WalletIcon width={20} height={20} />}
            label={i18n._(t`Withdraw ${currency?.isNative ? NATIVE[chainId].symbol : currency?.wrapped.symbol} to Wallet`)}
            onClick={() => dispatch(setBalancesActiveModal(ActiveModal.WITHDRAW))}
          />
        </>
      )}
    </div>
  )
}

export default ActionView