import React from 'react'
import { useModalOpen, useToggleCalculatorModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import Image from 'next/image'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import ExternalLink from 'components/ExternalLink'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { useWrappedLumensContract, useLuxorContract } from 'hooks'
import { formatNumberScale } from 'functions'
import { LUX_ADDRESS, WLUM_ADDRESS } from 'constants/addresses'
// import QuestionHelper from '../../components/QuestionHelper'
import { useLuxTVL, useTVL, useVaultTVL } from 'hooks/useV2Pairs'
// import { Wrapper } from 'features/swap/styleds'
import { Button } from 'components/Button'
import { useActiveWeb3React } from 'services/web3'
import QuestionHelper from 'components/QuestionHelper'
import ModalHeader from 'components/Modal/Header'
import { concat } from 'lodash'
import { useLuxorPrice, useWrappedLumPrice } from 'hooks/getPrices'
import NavLink from 'components/NavLink'
import Calculator from 'pages/luxor/calculator'

const cache: { [key: string]: number } = {};

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export default function CalculatorModal(): JSX.Element | null {

  const { chainId, library } = useActiveWeb3React()
  const calculatorModalOpen = useModalOpen(ApplicationModal.CALCULATOR)
  const toggleCalculatorModal = useToggleCalculatorModal()
  let tokenInfo = useTokenInfo(useLuxorContract())
  let wrappedLumensInfo = useTokenInfo(useWrappedLumensContract())
  const luxorPrice = useLuxorPrice()
  const wLumPrice = useWrappedLumPrice()

  const farmInfo = useTVL()
  const vaultInfo = useVaultTVL()
  const luxInfo = useLuxTVL()

  let luxTvl = luxInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let vaultsTvl = vaultInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let farmsTvl = farmInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  let tvl = farmsTvl

  function getSummaryLine(title, value) {
    return (
      <div className="flex flex-col gap-2 bg-dark-800 rounded py-1 px-3 w-full">
        <div className="flex items-center justify-between">
          {title}
          <Typography variant="sm" className="flex items-center font-bold py-0.5">
            {value}
          </Typography>
        </div>
      </div>
    )
  }
  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled isOpen={calculatorModalOpen} onDismiss={toggleCalculatorModal}
      maxWidth={'md'}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex flex-col w-full">
            <ModalHeader header={''} onClose={toggleCalculatorModal} />
            <Calculator/>
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}


