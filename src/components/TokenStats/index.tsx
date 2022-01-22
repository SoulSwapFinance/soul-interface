import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'

import Image from 'next/image'
// import NetworkModel from '../../modals/NetworkModal'
import TokensStatsModal, { formatCurrency } from '../../modals/TokensStatsModal'
import React from 'react'
import { useModalOpen, useToggleTokenStatsModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { usePriceHelperContract } from '../../features/bond/hooks/useContract'
import styled from 'styled-components'
import { useActiveWeb3React } from 'services/web3'

const HideOnMobile = styled.div`
@media screen and (max-width: 500px) {
  display: none;
}
`;

function TokenStats(): JSX.Element | null {

  const { chainId } = useActiveWeb3React()
  const toggleTokenStatsModal = useToggleTokenStatsModal()
  // const open = useModalOpen(ApplicationModal.SOUL_STATS)

  const priceHelperContract = usePriceHelperContract()

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  // console.log(Number(rawSoulPrice))
  const soulPrice = formatCurrency(Number(rawSoulPrice) / 1E18, 3)
  // console.log(soulPrice)

  const rawSeancePrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0x124B06C5ce47De7A6e9EFDA71a946717130079E6'])?.result
  // console.log(Number(rawSeancePrice))
  const seancePrice = formatCurrency(Number(rawSeancePrice) / 1E18, 3)
  // console.log(seancePrice)

  if (!chainId) return null

  return (
    <div
      className="flex items-center md:space-x-2 rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleTokenStatsModal()}
    >

      <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        <Image
          src="/images/tokens/seance.png"
          alt="SEANCE"
          width="28px"
          height="28px"
          objectFit="contain"
          className="rounded-md"
        />
        <HideOnMobile>
          <div className="text-primary">{ seancePrice }</div>
        </HideOnMobile>
      </div>

      <div className="grid items-center grid-flow-col px-1.5 py-1 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
        <Image
          src="/images/tokens/soul.png"
          alt="SOUL"
          width="28px"
          height="28px"
          objectFit="contain"
          className="rounded-md"
        />
          <div className="text-primary">{ soulPrice }</div>
      </div>
      <TokensStatsModal />
    </div>
  )
}

export default TokenStats
