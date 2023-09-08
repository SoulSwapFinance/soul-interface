import { ChainId, Currency, NATIVE, Percent } from '../sdk'
import React, { FC, useState } from 'react'
import Settings from './Settings'
import { useRouter } from 'next/router'
import Typography from '../components/Typography'
// import { useActiveWeb3React } from 'services/web3'

// const getQuery = (input, output) => {
//   const { chainId } = useActiveWeb3React()
//   if (!input && !output) return

//   if (input && !output) {
//     return { inputCurrency: input.address || NATIVE[chainId ?? ChainId.FANTOM].symbol }
//   } else if (input && output) {
//     return { inputCurrency: input.address, outputCurrency: output.address }
//   }
// }

interface ExchangeHeaderProps {
  input?: Currency
  output?: Currency
  allowedSlippage?: Percent
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({ input, output, allowedSlippage }) => {
  const router = useRouter()
  const isRemove = router.asPath.startsWith('/exchange/remove')
  const isAdd = router.asPath.startsWith('/exchange/add')

  return (
    <>
      <div className="flex justify-between mb-4 space-x-3 items-center">
        <div className="flex items-center">
          <Typography component="h1" variant="base">
            {isAdd ? `Add Liquidity` : isRemove ? `Remove Liquidity` : `Remove Liquidity`}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="grid grid-flow-col gap-1">             
            <div className="relative w-full h-full rounded hover:bg-dark-800 flex items-center">
              <Settings placeholderSlippage={allowedSlippage} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExchangeHeader
