import { ArrowsRightLeftIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import { ChainId, NATIVE } from 'sdk'
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
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    if (currency?.isNative) return router.push('/exchange/swap')

    return router.push(`/exchange/swap?inputCurrency=${currency?.wrapped.address}`)
  }, [chainId, currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={`Available Actions`} onClose={onClose} />
      <ActionItem
        svg={<ArrowsRightLeftIcon width={24} />}
        label={`Swap ${currency?.isNative ? NATIVE[chainId ?? ChainId.FANTOM].symbol : currency?.symbol}`}
        onClick={swapActionHandler}
      />
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {featureEnabled(Feature.COFFINBOX, chainId) && (
        <>
          <ActionItem
            svg={<CoffinboxIcon width={20} height={20} />}
            label={`Deposit to CoffinBox`}
            onClick={() => dispatch(setBalancesActiveModal(ActiveModal.DEPOSIT))}
          />
          <ActionItem
            svg={<WalletIcon width={20} height={20} />}
            label={`Withdraw ${currency?.isNative ? NATIVE[chainId ?? ChainId.FANTOM].symbol : currency?.wrapped.symbol} to Wallet`}
            onClick={() => dispatch(setBalancesActiveModal(ActiveModal.WITHDRAW))}
          />
        </>
      )}
    </div>
  )
}

export default ActionView