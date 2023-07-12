import { ACTION_ACCRUE } from 'sdk'
import React, { useMemo } from 'react'

import { Button } from 'components/Button'
import QuestionHelper from 'components/QuestionHelper'
import { UnderworldCooker } from 'entities'
import { formatPercent } from 'functions'
import useUnderworldApproveCallback from 'hooks/useUnderworldApproveCallback'
import { useMarketUpdater } from 'hooks/useContract'

export default function PairTools({ pair }) {
  const [, , , , onCook] = useUnderworldApproveCallback()
  const MarketUpdater = useMarketUpdater()

  async function onUpdatePrice() {
    await MarketUpdater.updateAll()
    return `${`Update Price`} ${pair.asset.tokenInfo.symbol}/${pair.collateral.tokenInfo.symbol}`

  }
  async function onAccrue(cooker: UnderworldCooker): Promise<string> {
    cooker.add(ACTION_ACCRUE, '0x00')
    return `${`Accrue`} ${pair.asset.tokenInfo.symbol}/${pair.collateral.tokenInfo.symbol}`
  }

  const priceChange = useMemo(() => {
    const currentPrice = pair?.currentExchangeRate / 1e18
    const oraclePrice = pair?.oracleExchangeRate / 1e18

    const difference = Math.abs(currentPrice - oraclePrice)

    return (difference / currentPrice) * 100
  }, [pair])

  return (
    <div className="grid grid-row-2 gap-2 lg:gap-6">

      {/* COLUMN [1]: ACCRUE */}
      <div className={`grid grid-cols-1 border border-2 border-green rounded rounded-2xl p-1`}>
        {/* BUTTON [1]: ACCRUE */}
        <div className={`flex w-full`}>
          <Button
            variant="filled"
            size="md"
            className={`w-full font-bold`} onClick={() => onCook(pair, onAccrue)}>
            Sync APR
          </Button>
          {/* QUESTION HELPER [1] */}
          <div className={`absolute right-0 sm:right-4 xl:right-2 xl:top-52 bottom-24 lg:top-56 lg:flex sm:bottom-24 mb-4 sm:mb-8 lg:mt-4 w-[1/4] justify-end`}>
            <QuestionHelper text={'Sync Supply APR'} />
          </div>


        </div>
      </div>

      {/* COLUMN [2]: UPDATE */}
      <div className={`grid grid-cols-1 border border-2 border-purple rounded rounded-2xl p-1`}>
        {/* BUTTON [2]: UPDATE PRICES */}
        <div className={`flex w-full`}>
          <Button
            variant="filled"
            size="md"
            className={`w-full font-bold`}
            onClick={() => onUpdatePrice()}
          // onClick={() => onCook(pair, onUpdatePrice)}
          >
            Update Prices
          </Button>
          {/* QUESTION HELPER [2] */}
          <div className={`absolute right-0 sm:right-4 xl:right-2 xl:top-64 xl:mt-6 bottom-12 lg:top-72 lg:flex sm:bottom-18 mb-4 sm:mb-6 lg:mt-4 w-[1/4] justify-end`}>
            <QuestionHelper
              text={
                <div>
                  {/* <div>Update Exchange Rate</div> */}
                  <div>Current Delta: {formatPercent(priceChange)}</div>

                </div>
              }
            />
          </div>

        </div>
      </div>
    </div>
  )
}