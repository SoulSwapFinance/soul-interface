import React, { useRef, useState } from 'react'
import Container from 'components/Container'
import Typography from 'components/Typography'
import { useTokenInfo, useTotalSupply, useUnderworldPairInfo, } from 'hooks/useAPI'
import usePriceApi from 'hooks/usePriceApi'
import { useWeb3React } from '@web3-react/core'
import { formatNumber } from 'functions/format'
import { ChainId, SOUL_ADDRESS, UNDERWORLD_PAIRS } from 'sdk'
import { getPrice } from 'hooks/useParaswap'
import styled from 'styled-components'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
// import { useTokenBalances } from 'services/api/hooks'
// import { ChainId } from 'sdk'
// import capitalize from 'lodash/capitalize'

export default function Data() {
  const { chainId, account } = useWeb3React()
  // const soulPrice = usePriceApi(SOUL_ADDRESS[ChainId.FANTOM])
  // const { tokenInfo } = useTokenInfo(SOUL_ADDRESS[ChainId.FANTOM])
  const addresses = UNDERWORLD_PAIRS[chainId]
  
  const [ address, setAddress ] = useState(addresses[0])
  const a0 = useUnderworldPairInfo(addresses[0]).underworldPairInfo?.address
  const t0 = useUnderworldPairInfo(addresses[0]).underworldPairInfo.assetTicker
  const ad0 = Number(useUnderworldPairInfo(addresses[0]).underworldPairInfo.aDivisor)
  const _b0 = Number(useUnderworldPairInfo(addresses[0]).underworldPairInfo.borrowTotalBase)
  const b0 = formatNumber(_b0 / ad0)
  const _s0 = Number(useUnderworldPairInfo(addresses[0]).underworldPairInfo.assetTotalBase)
  const s0 = formatNumber(_s0 / ad0)

  const a1 = useUnderworldPairInfo(addresses[1]).underworldPairInfo?.address
  const t1 = useUnderworldPairInfo(addresses[1]).underworldPairInfo.assetTicker
  const ad1 = Number(useUnderworldPairInfo(addresses[1]).underworldPairInfo.aDivisor)
  const _b1 = Number(useUnderworldPairInfo(addresses[1]).underworldPairInfo.borrowTotalBase)
  const b1 = formatNumber(_b1 / ad1)
  const _s1 = Number(useUnderworldPairInfo(addresses[1]).underworldPairInfo.assetTotalBase)
  const s1 = formatNumber(_s1 / ad1)

  const a2 = useUnderworldPairInfo(addresses[2]).underworldPairInfo?.address
  const t2 = useUnderworldPairInfo(addresses[2]).underworldPairInfo.assetTicker
  const ad2 = Number(useUnderworldPairInfo(addresses[2]).underworldPairInfo.aDivisor)
  const _b2 = Number(useUnderworldPairInfo(addresses[2]).underworldPairInfo.borrowTotalBase)
  const b2 = formatNumber(_b2 / ad2)
  const _s2 = Number(useUnderworldPairInfo(addresses[2]).underworldPairInfo.assetTotalBase)
  const s2 = formatNumber(_s2 / ad2)

  const a3 = useUnderworldPairInfo(addresses[5]).underworldPairInfo?.address
  const t3 = useUnderworldPairInfo(addresses[5]).underworldPairInfo.assetTicker
  const ad3 = Number(useUnderworldPairInfo(addresses[5]).underworldPairInfo.aDivisor)
  const _b3 = Number(useUnderworldPairInfo(addresses[5]).underworldPairInfo.borrowTotalBase)
  const b3 = formatNumber(_b3 / ad3)

  const _s3 = Number(useUnderworldPairInfo(addresses[5]).underworldPairInfo.assetTotalBase)
  const s3 = formatNumber(_s3 / ad3)

  // function getAsset(address) {
  //   let ticker = useUnderworldPairInfo(address)?.underworldPairInfo.assetTicker
  //   return ticker
  // }

  const StyledDropDown = styled.div<{
    width?: number;
    top?: number;
    left?: number;
    right?: number;
  }>`
    position: absolute;
    width: ${(props) => (props.width ? `${props.width}px` : `100%`)};
    top: ${(props) => props.top}px;
    left: ${(props) => props.left && `${props.left}px`};
    right: ${(props) => props.right && `${props.right}px`};
    z-index: 10;
  `;

  // const [asset, setAsset] = useState(a0)
  // console.log('asset:%s', asset)
  return (
    <Container id="chains-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="6xl">
      <div className="w-full max-w-6xl mx-auto">
        <Typography component="h1" variant="h1" className="w-full text-center mb-4">
          Pair Information
        </Typography>

        <Typography component="h3" variant="h3" className="w-full text-center mb-4">
          <div className="grid gap-3 grid-row-2 m-3 mt-6 bg-dark-900 p-2 rounded">
            <label>Choose Underworld Asset </label>
          </div>
        </Typography>

        <div className="grid ml-2 mr-2 grid-cols gap-2">

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={ ()=> setAddress(a0) }>
            {t0}
          </Button>

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={ ()=> setAddress(a1) }>
            {t1}
          </Button>

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={ ()=> setAddress(a2) }>
            {t2}
          </Button>

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={ ()=> setAddress(a3) }>
            {t3}
          </Button>
        </div>
      </div>
        <div className="flex flex-cols-4 ml-2 mr-2 justify-center gap-6">
          <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t0} Market
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {b0} Borrowed
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {s0} Supply
          </Typography>
          </div>
          <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t1} Market
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {b1} Borrowed
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {s1} Supply
          </Typography>
          </div>
          <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t2} Market
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {b2} Borrowed
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {s2} Supply
          </Typography>
          </div>
          <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t3} Market
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {b3} Borrowed
          </Typography>
          <Typography className="font-bold text-sm sm:text-md">
            {s3} Supply
          </Typography>
          </div>
        </div>
    </Container>
  )
}
