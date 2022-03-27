import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { isMobile } from 'react-device-detect'
import { CurrencyLogo, CurrencyLogoArray } from 'components/CurrencyLogo'
// import QuestionHelper from 'components/QuestionHelper'
import Typography from 'components/Typography'
import { TABLE_TBODY_TD_CLASSNAME, TABLE_TBODY_TR_CLASSNAME } from 'features/trident/constants'
import { classNames, formatNumber } from 'functions'
import { useCurrency } from 'hooks/Tokens'
import React, { FC, ReactNode } from 'react'

// HOOKS //
// import { useV2PairsWithPrice } from 'hooks/useV2Pairs'
import { useSingleCallResult } from 'state/multicall/hooks'
import { usePendingSoul } from 'features/mines/hooks'

// FETCH PENDING REWARDS //

// import { useSoulPositions } from './hooks'
import usePriceApi from 'hooks/usePriceApi'
import { useHarvestHelperContract } from 'hooks/useContract'
import { SOUL } from '../../constants'

import { useActiveWeb3React } from 'services/web3/hooks'
import { useBinancePrice, useFantomPrice, useSoulPrice, useTokenPrice, useWrappedBtcPrice } from 'hooks/getPrices'
import { usePairPrice } from 'hooks/usePairData'

// const HideOnMobile = styled.div`
// @media screen and (max-width: 500px) {
//   display: none;
// }
// `;

interface MineListItem {
  farm: any
  onClick(x: ReactNode): void
}

const MineListItem: FC<MineListItem> = ({ farm, onClick }) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const token0 = useCurrency(farm.pair?.token0?.id) ?? undefined
  const token1 = useCurrency(farm.pair?.token1?.id) ?? undefined

  const harvestHelperContract = useHarvestHelperContract()
  const soulPrice = useSoulPrice() // to avoid RPC call
  const tokenPrice 
    = farm.pair?.token0.symbol == "SOUL" ? useSoulPrice()
    : farm.pair?.token0.symbol == "WBTC" ? useWrappedBtcPrice()
    : farm.pair?.token0.symbol == "FTM" ? useFantomPrice()
    : farm.pair?.token0.symbol == "BNB" ? useBinancePrice()
    : farm.pair?.token0.symbol == "DAI" ? 1
    : usePriceApi(farm?.pair?.token0?.id)

  const pairPrice
    = usePairPrice(farm?.pair?.address)
  const pendingSoul = usePendingSoul(farm)

  const rewardValue =
  (farm?.rewards?.[0]?.rewardPrice ?? 0) * Number(pendingSoul?.toExact() ?? 0)
  // + (farm?.rewards?.[1]?.rewardPrice ?? 0) * Number(pendingReward ?? 0)
  // const pairs = useSoulPairs({ chainId, variables: { where: { lpToken } }, shouldFetch: !!chainId })?.[0]

  // function usePositions() {
  //   return useSoulPositions(useSoulSummonerContract())
  // }

  // const positions = usePositions()
  // const farmingPools = Object.keys(POOLS[chainId]).map((key) => {
  //   return { ...POOLS[chainId][key], lpToken: key }
  // })

  // BALANCES AND TVL //

  const lpBalance = useSingleCallResult(harvestHelperContract, 'fetchBals', [farm?.id])?.result
  // const lpBalance = usePairBalance(SOUL_SUMMONER_ADDRESS[chainId], farm?.id)?.[0]
  // console.log('lpBal:%s', Number(lpBalance) | 0)
  
  const tvl 
  = farm.pair?.token1 && farm.pair?.type !== "underworld"
    // ? Number(usePairPrice(farm.pair.id))
    ? Number(pairPrice) * Number(lpBalance) / 1e18
    : Number(tokenPrice) * Number(lpBalance) / 1e18

  return (
    <div className={classNames(TABLE_TBODY_TR_CLASSNAME, 'grid grid-cols-3 sm:grid-cols-3')} onClick={onClick}>
      {/* <div className={classNames('flex gap-2', TABLE_TBODY_TD_CLASSNAME(0, 4))}> */}
      <div className="flex gap-2 text-items-center">

        { /* TOKEN-LOGO */}
        {token1 && farm.pair.type !== "underworld" ? <CurrencyLogoArray currencies={[token0, token1]} dense size={36} />
          : <CurrencyLogo currency={token0} size={48} />
        }

        { /* LP-TOKEN */}
        <div className="flex flex-col items-start">
          <Typography weight={700} className="hidden sm:flex sm:gap-1 sm:text-high-emphesis">
             { farm.pair.type !== "underworld" && farm?.pair?.token0?.symbol }
            {farm.pair.token1 && farm.pair.type !== "underworld" &&
              <span className="text-low-emphesis">/</span>
            }
            {farm.pair.token1 && farm.pair.type !== "underworld" &&
              farm?.pair?.token1?.symbol
            }
            {farm.pair.type == "underworld" &&
              farm?.pair?.token0?.symbol
            }
          </Typography>
          {/* {farm?.rewards?.map((reward, i) => ( */}
            <Typography variant="xs" className="text-blue text-bold text-high-emphesis">
              {/* Claimable: {' '} */}
              {formatNumber(rewardValue, true)}
            </Typography>
          {/* ))} */}

          { /* DAILY REWARDS (SUBTITLE) */}
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
      {/* <div className={TABLE_TBODY_TD_CLASSNAME(1, 4)}> */}
      <div className="flex justify-center items-center">
      {/* <div className="flex flex-col items-start sm:items-center justify-center"> */}
      {/* {farm?.rewards?.map((reward, i) => ( */}
        <Typography weight={700} className="text-high-emphesis">
          {formatNumber(
            // PRICE PER TOKEN * TOKEN BALANCE
            tvl,
            true)
          }
        </Typography>
      {/* ))} */}
      </div>
      {/* </div> */}
      {/* <div className={classNames('hidden sm:flex flex-col !items-end !justify-center', TABLE_TBODY_TD_CLASSNAME(2, 4))}> */}
      <div className={classNames('hidden', TABLE_TBODY_TD_CLASSNAME(2, 4))}>
      {farm?.rewards?.map((reward, i) => (
          <Typography
            variant="sm"
            weight={700}
            key={i}
            className="flex gap-1.5 text-high-emphesis justify-center items-center"
            component="span"
          >
            {formatNumber(reward.rewardPerDay)}
            <CurrencyLogo currency={SOUL[chainId]} size={isMobile ? 32 : 50} />
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
          {/* {!!farm?.feeApyPerYear && (
          <QuestionHelper
            text={
              <div className="flex flex-col">
                <div>
                  Reward APR:{' '}
                  {farm?.rewards?.map((reward, i) => (
                    <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                      {
                        reward?.rewardPerDay > 0
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
                Fee APR: {getApy(volume, tvl)}
                </div>
              </div>
            }
          />
          )} */}
        </Typography>
        <Typography variant="xs" className="text-low-emphesis">
          {i18n._(t`annualized`)}
        </Typography>
      </div>
    </div>
  )
}

export default MineListItem