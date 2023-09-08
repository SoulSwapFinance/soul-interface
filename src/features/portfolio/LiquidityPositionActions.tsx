import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { CoffinboxIcon } from 'components/Icon'
import Typography from 'components/Typography'
import ActionItem from 'features/portfolio/ActionsModal/ActionItem'
import { setBalancesActiveModal } from 'features/portfolio/portfolioSlice'
import { useBalancesSelectedCurrency } from 'features/portfolio/useBalancesDerivedState'
import { ActiveModal } from 'features/trident/types'
import { useAppDispatch } from 'state/hooks'
import { useRouter } from 'next/router'
import React, { FC, useCallback } from 'react'
import { ChainId, NATIVE } from 'sdk'
import { useActiveWeb3React } from 'services/web3'

const WalletActions: FC = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const router = useRouter()

  const swapActionHandler = useCallback(async () => {
    if (currency?.isNative) return router.push('/exchange/swap')
    return router.push(`/exchange/swap?inputCurrency=${NATIVE[chainId ?? ChainId.FANTOM].symbol}&tokens=${currency?.wrapped.address}`)
  }, [currency?.isNative, currency?.wrapped.address, router])

  return (
    <div className="flex flex-col bg-dark-900 p-5 pt-7 gap-5">
      <div className="flex flex-col gap-3">
        <Typography variant="lg" weight={700} className="text-high-emphesis">
          {`Available Actions`}
        </Typography>
        <ActionItem svg={<ArrowsRightLeftIcon width={24} />} label={`Swap`} onClick={swapActionHandler} />
        <ActionItem
          svg={<CoffinboxIcon width={20} height={20} />}
          label={`Deposit to CoffinBox`}
          onClick={() => dispatch(setBalancesActiveModal(ActiveModal.DEPOSIT))}
        />
        <Typography variant="sm" className="text-blue text-center mb-5 mt-2 cursor-pointer">
          What is CoffinBox?
        </Typography>
      </div>
    </div>
  )
}

export default WalletActions
