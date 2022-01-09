import React from 'react'
import { isMobile } from 'react-device-detect'
import { Disclosure } from '@headlessui/react'
import CurrencyLogo from 'components/CurrencyLogo'
import DoubleLogo from 'components/DoubleLogo'
import QuestionHelper from 'components/QuestionHelper'
import { classNames, formatNumber, formatPercent } from 'functions'
import { useCurrency } from 'hooks/Tokens'

import { PairType } from './enum'
import MineListItemDetails from './MineListItemDetails'
import { SOUL } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import Logo from 'components/Logo'

const MineListItem = ({ farm, ...rest }) => {
  const { chainId } = useActiveWeb3React()
  
  const token0 = useCurrency(farm.pair.token0?.id)
  const token1 = useCurrency(farm.pair.token1?.id)

  return (
    <Disclosure {...rest}>
      {({ open }) => (
        <div>
        { token1 ? 
          <Disclosure.Button
            className={classNames(
              open && 'rounded-b-none',
              'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
            )}
          >
            <div className="grid grid-cols-4">
              <div className="flex col-span-2 space-x-4 md:col-span-1">
              { token1 ?
                <DoubleLogo currency0={ token0 } currency1={ token1 } size={40} />
                : <CurrencyLogo currency={ token0 } size={54}/> 
              }
                <div className="flex flex-col justify-center">
                  <div>
                    <span className="font-bold">{farm?.pair?.token0?.symbol}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center font-bold">{formatNumber(farm.tvl, true)}</div>
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
                </div>
                <div className="text-xs text-right md:text-base text-secondary">annualized</div>
              </div>
            </div>
          </Disclosure.Button>
          : '' }
          {open && <MineListItemDetails farm={farm} />}
        </div>
      )}
    </Disclosure>
  )
}

export default MineListItem