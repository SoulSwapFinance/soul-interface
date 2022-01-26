import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { isMobile } from 'react-device-detect'
import { CurrencyLogo, CurrencyLogoArray } from 'components/CurrencyLogo'
import QuestionHelper from 'components/QuestionHelper'
import Typography from 'components/Typography'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'features/trident/constants'
import { aprToApy, classNames, formatNumber, formatPercent } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import React, { FC, ReactNode } from 'react'

// HOOKS //
import { useTVL } from 'hooks/useV2Pairs'
import { useV2PairsWithPrice } from 'hooks/useV2Pairs'
import { useSingleCallResult } from 'state/multicall/hooks'
import { usePendingSoul } from 'features/mines/hooks'
  
// FETCH PENDING REWARDS //

import usePendingReward from 'features/mines/hooks/usePendingReward'
import { useSoulPositions } from './hooks'
import { usePrice } from 'hooks/usePrice'
import useFarms from 'hooks/useFarmRewards'
import { useHarvestHelperContract, useSoulSummonerContract } from 'hooks/useContract'
import { getAddress } from 'ethers/lib/utils'

import { PairType } from './enum'

import { SOUL, SOUL_ADDRESS } from '../../constants'
import { POOLS } from 'constants/farms'

import styled from 'styled-components'

const HideOnMobile = styled.div`
@media screen and (max-width: 500px) {
  display: none;
}
`;

interface MineListItem {
  farm: any
  onClick(x: ReactNode): void
}

// @ts-ignore TYPE NEEDS FIXING
const MineListItem: FC<MineListItem> = ({ farm, onClick }) => {
  const { i18n } = useLingui()
  const token0 = useCurrency(farm.pair?.token0?.id) ?? undefined
  const token1 = useCurrency(farm.pair.token1?.id) ?? undefined
  // const tvlInfo = useTVL()
  const harvestHelperContract = useHarvestHelperContract()
  const soulPrice = usePrice(SOUL_ADDRESS[250]) // to avoid RPC call

  const rewards = useFarms()
  const pendingReward = usePendingReward(farm)
  
  const pendingSoul = usePendingSoul(farm)

  let [data] = useV2PairsWithPrice([[token0, token1]])
  let [state, pair, pairPrice] = data

  // function usePositions() {
  //   return useSoulPositions(useSoulSummonerContract())
  // }

  // const positions = usePositions()
  // const farmingPools = Object.keys(POOLS[250]).map((key) => {
  //   return { ...POOLS[250][key], lpToken: key }
  // })

// BALANCES AND TVL //

  const lpBalance = useSingleCallResult(harvestHelperContract, 'fetchBals', [farm?.id])?.result

  const tvl = farm.pair?.token1
    ? Number(pairPrice) * Number(lpBalance) / 1e18
    : Number(soulPrice) * Number(lpBalance) / 1e18

  // REWARD RATE CALCULATIONS //
  const rewardPerSecond =
    farm?.rewards?.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.rewardPerSecond
    }, 0)

  const rewardPerDay = rewardPerSecond * 86_400
  const rewardPerYear = rewardPerDay * 365

  // ROI CALCULATIONS //

  const roiPerYear  // = roiPerMonth * 12
    = rewardPerYear
    * soulPrice // value of the rewards
    / tvl // div by liq. balance (TVL)

  const roiPerMonth = roiPerYear / 12
  const roiPerDay = roiPerMonth / 30
  const roiPerHour = roiPerDay / 24

  return (
    <div className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-4')} onClick={onClick}>
      <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 4))}>
      
        { /* TOKEN-LOGO */ }
        
        {token1 ? <CurrencyLogoArray currencies={[token0, token1]} dense size={32} />
          : <CurrencyLogo currency={token0} size={54} />
        }
        
        { /* LP-TOKEN */ }
        <div className="flex flex-col items-start">
     <Typography weight={700} className="flex gap-1 text-high-emphesis">
            {farm.pair.token1 ?
              farm?.pair?.token0?.symbol
              : farm?.pair?.token0?.symbol
            }
            {farm.pair.token1 &&
              <span className="text-low-emphesis">/</span>
            }
            {farm?.pair?.token1?.symbol}
            
            { /* PENDING REWARDS (SUBTITLE) */ }

          </Typography>
          {farm?.rewards?.map((reward, i) => (
  <Typography variant="xs" className="text-low-emphesis">
              {formatNumber(pendingSoul?.toSignificant(4) ?? 0)}
              CLAIMABLE
            </Typography>
          ))}
          
          { /* DAILY REWARDS (SUBTITLE) */ }
            
      {/*
          </Typography>
          {farm?.rewards?.map((reward, i) => (
  <Typography variant="xs" className="text-low-emphesis">
              {formatNumber(reward.rewardPerDay)} DAILY
            </Typography>
          ))}
          
          */}

        </div>
      </div>
      <div className={TABLE_TBODY_TD_CLASSNAME(1, 4)}>
        <Typography weight={700} className="text-high-emphesis">
          {/* @ts-ignore TYPE NEEDS FIXING */}
          {formatNumber(
            // PRICE PER TOKEN * TOKEN BALANCE
            tvl,
            true)
          }
        </Typography>
      </div>
      <div className={classNames('flex flex-col !items-end !justify-center', TABLE_TBODY_TD_CLASSNAME(2, 4))}>
        {farm?.rewards?.map((reward, i) => (
          <Typography
            variant="sm"
            weight={700}
            key={i}
            className="flex gap-1.5 text-high-emphesis justify-center items-center"
            component="span"
          >
            {formatNumber(reward.rewardPerDay)}
            <CurrencyLogo currency={SOUL[250]} size={isMobile ? 32 : 50} />
          </Typography>
        ))}
      </div>
      <div className={classNames('flex flex-col !items-end', TABLE_TBODY_TD_CLASSNAME(3, 4))}>
        <Typography weight={700} className="flex gap-0.5 items-center text-high-emphesis">
          {farm?.rewards?.map((reward, i) => (
            <div key={i} className="text-xs md:text-sm whitespace-nowrap">
              {
                reward.rewardPerDay > 0
                  ? formatNumber(
                    reward?.rewardPerDay * 365 // rewards per year (annualized)
                    * soulPrice // value of the rewards
                    / tvl // div by liq. balance (TVL)
                    * 100, // to convert into %
                    false,
                    true
                  ) + '%'
                  : 'ZERO'
              }
            </div>
          ))}
          {/* {!!farm?.feeApyPerYear && ( */}
          {/* <QuestionHelper
            text={
              <div className="flex flex-col">
                <div>
                  Reward APR:{' '}
                  {farm?.rewards?.map((reward, i) => (
                    <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                      {
                        reward.rewardPerDay > 0
                          ? formatNumber(
                            reward?.rewardPerDay * 365 // rewards per year (annualized)
                            * soulPrice // value of the rewards
                            / tvl // div by liq. balance (TVL)
                            * 100, // to convert into %
                            false,
                            true
                          ) + '%'
                          : 'ZERO'
                      }
                    </div>
                  ))}
                </div>
                <div>
                  Fee APR: {farm?.feeApyPerYear < 10000 ? formatPercent(farm?.feeApyPerYear * 100) : '>10,000%'}
                </div>
              </div>
            }
          /> */}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`annualized`)}
        </Typography>
      </div>
    </div>
  )
}

export default MineListItem