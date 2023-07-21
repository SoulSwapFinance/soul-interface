import Image from 'next/image'
import LuxorStatsModal from 'modals/LuxorStatsModal'
import React from 'react'
import { useModalOpen, useToggleLuxorStatsModal } from 'state/application/hooks'
import  { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components'
import { useActiveWeb3React } from 'services/web3'
import { useLuxorPrice } from 'hooks/getPrices'
import { formatNumber } from 'functions/format'

const HideOnMobile = styled.div`
@media screen and (max-width: 500px) {
  display: none;
}
`;

function LuxorStats(): JSX.Element | null {

  const { chainId } = useActiveWeb3React()
  const toggleTokenStatsModal = useToggleLuxorStatsModal()
  const open = useModalOpen(ApplicationModal.LUXOR_STATS)
  const luxPrice = useLuxorPrice()

  if (!chainId) return null

  return (
    <div
      // className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      className="flex items-center md:space-x-2 rounded bg-dark-900 border border-dark-800 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleTokenStatsModal()}
    >
      {/* <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary"> */}
      <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max text-secondary">
        <Image
          src="/images/tokens/lux.png"
          alt="LUX"
          width={28}
          height={28}
          // objectFit="contain"
          className="rounded-md"
        />
          <HideOnMobile>
          <div className="text-primary">{ formatNumber(luxPrice, true, true) }</div>
          </HideOnMobile>
      </div>
      <LuxorStatsModal />
    </div>
  )
}

export default LuxorStats
