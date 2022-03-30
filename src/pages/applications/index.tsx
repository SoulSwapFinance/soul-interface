import React, { useMemo } from 'react'
// import { ArrowRightIcon } from '@heroicons/react/outline'
import Container from '../../components/Container'
import Head from 'next/head'
import { I18n } from '@lingui/core'
// import Link from 'next/link'
import Typography from '../../components/Typography'
import Image from 'next/image'
// import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import Calculator from 'components/Calculator'
import { useToggleCalculatorModal, useToggleModal } from 'state/application/hooks'
import CalculatorModal from 'modals/CalculatorModal'
import { ApplicationModal } from 'state/application/actions'
import StakeModal from 'modals/StakeModal'
import LuxorBondsModal from 'modals/LuxorBondsModal'
import SorModal from 'modals/SorModal'

const APPLICATIONS = (i18n: I18n) => [
]

export default function Applications() {
  const { i18n } = useLingui()
  const features = useMemo(() => APPLICATIONS(i18n), [i18n])
  const toggleCalculatorModal = useToggleCalculatorModal()
  const toggleStakeModal = useToggleModal(ApplicationModal.STAKE)
  const toggleSorModal = useToggleModal(ApplicationModal.SOR)
  const toggleLuxorBondsModal = useToggleModal(ApplicationModal.LUXOR_BONDS)

  return (
    <Container id="features-page" className="py-4 space-y-5 md:py-8 lg:py-12" maxWidth="xl">
      <Head>
        <title>Applications | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tools..." />
      </Head>
      <Typography variant="h1" className="text-center text-yellow" component="h1">
        LUXOR APPLICATIONS
      </Typography>
  <div className="grid grid-cols-3 items-center gap-2">
    <div className="flex items-center ml-1 mr-1 md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleCalculatorModal()}>
        <div className="grid items-center text-center grid-flow-cols-2 px-[17%] py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
          <Image
              src="/images/calculator.png"
              width="116px"
              height="116px"
              objectFit="contain"
              className="rounded-md"
              />
        </div>
        <CalculatorModal />
    </div>
      <div className="flex items-center ml-1 mr-1 md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
        onClick={() => toggleStakeModal()}>
          <div className="grid items-center text-center grid-flow-cols-2 px-[17%] py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
              <Image
                  src="https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0x4290b33158F429F40C0eDc8f9b9e5d8C5288800c/logo.png"
                  width="116px"
                  height="116px"
                  objectFit="contain"
                  className="rounded-md"
                  />
            </div>
            <StakeModal />
      </div>
      <div className="flex items-center ml-1 mr-1 md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
        onClick={() => toggleLuxorBondsModal()}>
          <div className="grid items-center text-center grid-flow-cols-2 px-[17%] py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
              <Image
                  src="https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b/logo.png"
                  width="116px"
                  height="116px"
                  objectFit="contain"
                  className="rounded-md"
                  />
            </div>
            <LuxorBondsModal />
      </div>
      <div className="flex items-center ml-1 mr-1 md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
        onClick={() => toggleSorModal()}>
          <div className="grid items-center text-center grid-flow-cols-2 px-[17%] py-6 text-sm rounded-lg pointer-events-auto bg-dark-1000 text-primary border border-yellow">
              <Image
                  src="https://raw.githubusercontent.com/SoulSwapFinance/assets/master/blockchains/fantom/assets/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b/logo.png"
                  width="116px"
                  height="116px"
                  objectFit="contain"
                  className="rounded-md"
                  />
            </div>
            <SorModal />
      </div>
  </div>
    </Container>
  )
}