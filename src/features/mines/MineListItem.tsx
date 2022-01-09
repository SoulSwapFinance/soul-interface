import React from 'react'
import { isMobile } from 'react-device-detect'
import { Disclosure } from '@headlessui/react'
import CurrencyLogo from 'components/CurrencyLogo'
import DoubleLogo from 'components/DoubleLogo'
import QuestionHelper from 'components/QuestionHelper'
import { classNames, formatNumber, formatPercent } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import MineListItemDetails from './MineListItemDetails'
import { SOUL } from '../../constants'
import {
  useActiveWeb3React,
  useHarvestHelperContract,
  usePriceHelperContract
} from 'hooks'
import { useTVL } from 'hooks/useV2Pairs'
import { useMultipleContractSingleData, useSingleCallResult } from 'state/multicall/hooks'
import { POOLS } from 'constants/farms'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'

const MineListItem = ({ farm, ...rest }) => {
  const { chainId } = useActiveWeb3React()

  const token0 = useCurrency(farm.pair.token0?.id)
  const token1 = useCurrency(farm.pair.token1?.id)
  const priceHelperContract = usePriceHelperContract()
  const harvestHelperContract = useHarvestHelperContract()

  const rawSoulPrice = useSingleCallResult(priceHelperContract, 'currentTokenUsdcPrice', ['0xe2fb177009FF39F52C0134E8007FA0e4BaAcBd07'])?.result
  console.log(Number(rawSoulPrice))
  const soulPrice = Number(rawSoulPrice) / 1E18
  console.log(soulPrice)

  const tvlInfo = useTVL()

  let [data] = useV2PairsWithPrice([[token0, token1]])
  let [state, pair, pairPrice] = data

  const lpBalance = useSingleCallResult(harvestHelperContract, 'fetchBals', [farm?.id])?.result
  console.log('lpBalance: %s', Number(lpBalance))

  let tvl = tvlInfo.map((previousValue, currentValue) => {
    return previousValue.tvl + currentValue
  }, 0)

  let summTvl = tvlInfo.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.tvl
  }, 0)

  // let lpPrice = tvlInfo.reduce((previousValue, currentValue) => {
  //   return previousValue + currentValue.lpPrice
  // }, 0)

  const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
    return { ...POOLS[chainId][key], lpToken: key }
  })

  // const roiPerSecond =
  // farm?.rewards?.reduce((previousValue, currentValue) => {
  //   return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
  // }, 0) / summTvl

  // const roiPerSecond =
  //   farm?.rewards?.reduce((previousValue, currentValue) => {
  //     return previousValue + currentValue.rewardPerBlock * currentValue.rewardPrice
  //   }, 0) / summTvl

  const balanceUSD = Number(pairPrice) * Number(lpBalance) / 1e18

  const secsPerHour = 60 * 60

  // const roiPerHour = rewardAprPerHour
  // const roiPerMonth = rewardAprPerMonth
  // const roiPerDay = rewardAprPerDay
  // const roiPerYear = rewardAprPerYear
  const dailyRewards = farm?.reward?.rewardPerDay
  const rewardPerSecond = dailyRewards / 86_400

  const roiPerSecond = (rewardPerSecond * soulPrice) / balanceUSD
  const roiPerHour = roiPerSecond * secsPerHour
  const roiPerDay = roiPerHour * 24
  const roiPerMonth = roiPerDay * 30
  const roiPerYear = roiPerMonth * 12
  
  const rewardAprPerHour = roiPerSecond * secsPerHour
  const rewardAprPerDay = rewardAprPerHour * 24
  const rewardAprPerMonth = rewardAprPerDay * 30
  const rewardAprPerYear = rewardAprPerMonth * 12

  // const roiPerSecond = 1E1000
  // const roiPerHour = roiPerSecond * 60 * 60
  // const roiPerDay = roiPerHour * 24
  // const roiPerMonth = roiPerDay * 30
  // const roiPerYear = roiPerDay * 365

  return (
    <Disclosure {...rest}>
      {({ open }) => (
        <div>
          {token1 ?
            <Disclosure.Button
              className={classNames(
                open && 'rounded-b-none',
                'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
              )}
            >
              <div className="grid grid-cols-4">
                <div className="flex col-span-2 space-x-4 md:col-span-1">
                  {token1 ?
                    <DoubleLogo currency0={token0} currency1={token1} size={40} />
                    : <CurrencyLogo currency={token0} size={54} />
                  }
                  <div className="flex flex-col justify-center">
                    <div>
                      <span className="font-bold">{farm?.pair?.token0?.symbol}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center font-bold">{
                  formatNumber(
                    // PRICE PER TOKEN * TOKEN BALANCE
                    Number(pairPrice) * Number(lpBalance) / 1e18,
                    true)
                }</div>
                <div className="flex-row items-center hidden space-x-4 md:flex">
                  <div className="flex items-center space-x-2">
                    {farm?.rewards?.map((reward, i) => (
                      <div key={i} className="flex items-center">
                        <CurrencyLogo currency={SOUL[chainId]} size={isMobile ? 32 : 50} />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-1">
                    {farm?.rewards?.map((reward, i) => (
                      <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                        {reward.rewardPerDay > 0 ?
                          formatNumber(reward.rewardPerDay) + ' / DAY'
                          : 'ZERO'
                        }
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <div className="flex flex-row items-center font-bold text-right text-high-emphesis">

                    {farm?.rewards?.map((reward, i) => (
                      <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                        {
                          reward.rewardPerDay > 0 
                          ? formatNumber(
                            reward?.rewardPerDay * 365 // rewards per year (annualized)
                            * soulPrice // value of the rewards
                            / balanceUSD // div by liq. balance (TVL)
                            * 100 // to convert into %
                            ) + '%'
                          : 'ZERO'
                        }
                      </div>
                    ))}

                  </div>


                  {/* <div className="flex flex-row items-center font-bold text-right text-high-emphesis">
                  {farm?.tvl !== 0
                    ? farm?.roiPerYear > 10000
                      ? '>10,000%'
                      : formatPercent(farm?.roiPerYear * 100)
                    : 'Infinite'}
                  {!!farm?.feeApyPerYear && (
                    <QuestionHelper
                      text={
                        <div className="flex flex-col">
                          <div>
                            Reward APR:{' '}
                            {farm?.tvl !== 0
                              ? farm?.rewardAprPerYear > 10000
                                ? '>10,000%'
                                : formatPercent(farm?.rewardAprPerYear * 100)
                              : 'Infinite'}
                          </div>
                          <div>
                            Fee APR:{' '}
                            {farm?.feeApyPerYear < 10000 ? formatPercent(farm?.feeApyPerYear * 100) : '>10,000%'}
                          </div>
                        </div>
                      }
                    />
                  )}
                </div> */}

                  <div className="text-xs text-right md:text-base text-secondary">annualized</div>
                </div>
              </div>
            </Disclosure.Button>
            : ''}
          {open && <MineListItemDetails farm={farm} />}
        </div>
      )}
    </Disclosure>
  )
}

export default MineListItem