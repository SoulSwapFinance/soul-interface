import Image from 'next/image'
import LuxorStatsModal, { formatCurrency } from 'modals/LuxorStatsModal'
import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { useModalOpen, useToggleLuxorStatsModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/actions'
import { useSingleCallResult } from 'state/multicall/hooks'
import { usePriceHelperContract } from 'features/bond/hooks/useContract'
import styled from 'styled-components'

const HideOnMobile = styled.div`
@media screen and (max-width: 500px) {
  display: none;
}
`;

function LuxorStats(): JSX.Element | null {

  const { chainId } = useActiveWeb3React()
  const toggleTokenStatsModal = useToggleLuxorStatsModal()
  const open = useModalOpen(ApplicationModal.LUXOR_STATS)

  const priceHelperContract = usePriceHelperContract()

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  // console.log(Number(rawLuxPrice))
  const luxPrice = formatCurrency(Number(rawLuxPrice) / 1E18, 0)
  // console.log(luxPrice)
  
  const rawWrappedLumPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208'])?.result
  // console.log(Number(rawWrappedLumPrice))
  const wLumPrice = formatCurrency(Number(rawWrappedLumPrice) / 1E18, 0)
  // console.log(wLumPrice)

  if (!chainId) return null

  return (
    <div
      className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleTokenStatsModal()}
    >
      <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        <Image
          src="/images/tokens/wlum.png"
          alt="WLUM"
          width="28px"
          height="28px"
          objectFit="contain"
          className="rounded-md"
        />
          <HideOnMobile>
          <div className="text-primary">{ wLumPrice }</div>
          </HideOnMobile>
      </div>
      <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        <Image
          src="/images/tokens/lux.png"
          alt="LUX"
          width="28px"
          height="28px"
          objectFit="contain"
          className="rounded-md"
        />
          <HideOnMobile>
          <div className="text-primary">{ luxPrice }</div>
          </HideOnMobile>
      </div>
      <LuxorStatsModal />
    </div>
  )
}

export default LuxorStats
