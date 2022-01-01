import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'

import Image from 'next/image'
// import NetworkModel from '../../modals/NetworkModal'
import TokenStatsModal, { formatCurrency } from '../../modals/TokenStatsModal'
import React from 'react'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useModalOpen, useToggleTokenStatsModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { usePriceHelperContract } from '../../features/bond/hooks/useContract'
import styled from 'styled-components'

const HideOnMobile = styled.div`
@media screen and (max-width: 550px) {
  display: none;
}
`;

function TokenStats(): JSX.Element | null {

  const { chainId } = useActiveWeb3React()
  const toggleTokenStatsModal = useToggleTokenStatsModal()
  const open = useModalOpen(ApplicationModal.SOUL_STATS)
  const priceHelperContract = usePriceHelperContract()

  if (!chainId) return null
  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  console.log(Number(rawSoulPrice))
  const soulPrice = formatCurrency(Number(rawSoulPrice) / 1E18, 3)
  console.log(soulPrice)

  const rawLuxPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'])?.result
  console.log(Number(rawLuxPrice))
  const luxPrice = formatCurrency(Number(rawLuxPrice) / 1E18, 2)
  console.log(luxPrice)
  
  return (
    <div
      className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleTokenStatsModal()} // todo
    >
        <HideOnMobile>
      <div className="grid items-center grid-flow-col px-1 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        {/* <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" /> */}
        <Image
            src="/images/tokens/LUXOR.svg"
            alt="LUX"
            width="25px"
            height="25px"
            objectFit="contain"
            className="rounded-md"
            />
        <div className="text-primary">{luxPrice}</div>
        </div>
        </HideOnMobile>
      
      <div className="grid items-center grid-flow-col px-1 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        <Image
            src="/images/tokens/soul.png"
            alt="SOUL"
            width="25px"
            height="25px"
            objectFit="contain"
            className="rounded-md"
        />   
        <HideOnMobile>     
          <div className="text-primary">{soulPrice}</div>
        </HideOnMobile>
      </div>
      <TokenStatsModal />
    </div>
  )
}

export default TokenStats
