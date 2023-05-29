import React from 'react'
import Image from 'next/image'
import TokensStatsModal from 'modals/TokensStatsModal'
import { useModalOpen, useToggleTokenStatsModal } from 'state/application/hooks'
// import styled from 'styled-components'
import { useActiveWeb3React } from 'services/web3'
// import { useSoulPrice } from 'hooks/getPrices'
import { formatNumber } from 'functions/format'
import { SOUL_ADDRESS } from 'sdk'
import { useTokenInfo } from 'hooks/useAPI'
// import { ApplicationModal } from 'state/application/reducer'

// const HideOnMobile = styled.div`
// @media screen and (max-width: 500px) {
//   display: none;
// }
// `;

function TokenStats(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()
  const toggleTokenStatsModal = useToggleTokenStatsModal()
  // const open = useModalOpen(ApplicationModal.SOUL_STATS)
  const soulPrice = Number(useTokenInfo(SOUL_ADDRESS[chainId]).tokenInfo.price)
  // const seancePrice = useSeancePrice()

  if (!chainId) return null

  return (
    <div
      className="flex items-center md:space-x-2 rounded-2xl m-1 justify-center bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleTokenStatsModal()}
    >
      <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        <Image
          src="/images/tokens/soul.png"
          alt="SOUL"
          width={28}
          height={28}
          objectFit="contain"
          className="rounded-md"
        />
          {/* <div className="text-primary">{ formatNumber(soulPrice, true, true) }</div> */}
      </div>
      <TokensStatsModal />
    </div>
  )
}

export default TokenStats
