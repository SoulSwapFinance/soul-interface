import Image from 'next/image'
import CalculatorModal, { formatCurrency } from 'modals/CalculatorModal'
import React from 'react'
import { useModalOpen, useToggleCalculatorModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import styled from 'styled-components'
import { useActiveWeb3React } from 'services/web3'
import { useLuxorPrice, useWrappedLumPrice } from 'hooks/getPrices'

const HideOnMobile = styled.div`
@media screen and (max-width: 500px) {
  display: none;
}
`;

function Calculator(): JSX.Element | null {

  const { chainId } = useActiveWeb3React()
  const toggleTokenStatsModal = useToggleCalculatorModal()
  const open = useModalOpen(ApplicationModal.CALCULATOR)
  const wLumPrice = useWrappedLumPrice()
  const luxPrice = useLuxorPrice()

  if (!chainId) return null

  return (
    <div
    className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
    onClick={() => toggleTokenStatsModal()}
    >
    <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
       <Image
          src="/images/calculator.png"
          width="48px"
          height="28px"
          objectFit="contain"
          className="rounded-md"
        />
    </div>
      <CalculatorModal />
    </div>
  )
}

export default Calculator
