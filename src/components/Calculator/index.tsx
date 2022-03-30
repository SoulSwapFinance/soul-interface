import React from 'react'
import Image from 'next/image'
import CalculatorModal from 'modals/CalculatorModal'
import { useModalOpen, useToggleCalculatorModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { useActiveWeb3React } from 'services/web3'

function Calculator(): JSX.Element | null {

  const { chainId } = useActiveWeb3React()
  const toggleCalculatorModal = useToggleCalculatorModal()
  const open = useModalOpen(ApplicationModal.CALCULATOR)

  if (!chainId) return null

  return (
    <div
    className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
    onClick={() => toggleCalculatorModal()}
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
