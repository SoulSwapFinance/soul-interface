import React, { useEffect, useRef, useState } from 'react'
import { LiquidityMiningCampaign, SingleSidedLiquidityMiningCampaign } from 'sdk'

import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

// import { useNativeCurrencyUSDPrice } from 'hooks/useNativeCurrencyUSDPrice'
import { usePage } from 'hooks/usePage'
import { useWindowSize } from 'hooks/useWindowSize'
// import { getStakedAmountUSD } from 'utils/liquidityMining'
import Pagination from 'components/Pagination'
import { Empty } from 'components/Pool/Empty'
import { LoadingGrid } from 'components/Pool/LoadingGrid'
import { CampaignCard } from 'components/Pool/PairsList/CampaignCard'
import NavLink from 'components/NavLink'
import { CurrencyAmount, USDC } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
import { useNativePrice } from 'services/graph/hooks'

const MEDIA_WIDTHS = {
    upToExtraSmall: 500,
    upToSmall: 720,
    upToMedium: 960,
    upToLarge: 1280,
}

const ListLayout = styled.div`
  display: grid;
  grid-gap: 12px 10px;
  grid-template-columns: 1fr 1fr 1fr;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr 1fr;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: auto;
    grid-gap: 8px;
  `};
`

interface LiquidityMiningCampaignsListProps {
  items?: {
    campaign: LiquidityMiningCampaign | SingleSidedLiquidityMiningCampaign
    staked: boolean
    containsKpiToken: boolean
  }[]
  loading?: boolean
  loadingItems?: number
}

const { upToMedium, upToExtraSmall } = MEDIA_WIDTHS

export default function List({ loading, items = [], loadingItems }: LiquidityMiningCampaignsListProps) {
  const { width } = useWindowSize()
  const [page, setPage] = useState(1)
  const prevItemsCt = useRef(items.length)
  const [responsiveItemsPerPage, setResponsiveItemsPerPage] = useState(9)
  const itemsPage = usePage(items, responsiveItemsPerPage, page, 0)
  const { chainId } = useActiveWeb3React()
  const { loading: loadingNativeCurrencyUsdPrice, nativeCurrencyUSDPrice } = useNativePrice[chainId]
  const CURRENCY_AMOUNT = CurrencyAmount.fromRawAmount(USDC[chainId], 100_000e6)

  useEffect(() => {
    if (!width) return

    let itemsPerPage = 9

    if (width <= upToExtraSmall) {
      itemsPerPage = 1
    } else if (width <= upToMedium) {
      itemsPerPage = 6
    }

    setResponsiveItemsPerPage(itemsPerPage)
  }, [width])

  useEffect(() => {
    if (items.length !== prevItemsCt.current) {
      setPage(1)
    }
  }, [items.length])

  const overallLoading = loading || loadingNativeCurrencyUsdPrice || !items

  return (
    <>
      <Flex flexDirection="column">
        <Box mb="8px">
          {overallLoading ? (
            <LoadingGrid itemsAmount={loadingItems || responsiveItemsPerPage} />
          ) : itemsPage.length > 0 ? (
            <ListLayout>
              {itemsPage.map(item => {
                if (item.campaign instanceof SingleSidedLiquidityMiningCampaign) {
                  return (
                    <NavLink
                      key={item.campaign.address}
                      to={`/rewards/single-sided-campaign/${item.campaign.stakeToken.address}/${item.campaign.address}`}
                    >
                      <CampaignCard
                        // token0={item.campaign.stakeToken}
                        usdLiquidity={
                            CURRENCY_AMOUNT
                        // TODO: FIX BELOW //
                        // getStakedAmountUSD
                        // (
                        //   item.campaign.staked.nativeCurrencyAmount,
                        //   nativeCurrencyUSDPrice
                        // )
                        }
                        apy={item.campaign.apy}
                        isSingleSidedStakingCampaign={true}
                        usdLiquidityText={item.campaign.locked ? 'LOCKED' : 'STAKED'}
                        staked={item.staked}
                        campaign={item.campaign}
                      />
                    </NavLink>
                  )
                } else {
                  const token0 = item.campaign?.targetedPair.token0
                  const token1 = item.campaign?.targetedPair.token1

                  return (
                    <NavLink
                      key={item.campaign.address}
                      to={`/rewards/campaign/${token0?.address}/${token1?.address}/${item.campaign.address}`}
                    >
                      <CampaignCard
                        // token0={token0}
                        // token1={token1}
                        usdLiquidity={
                        // TODO: FIX BELOW //
                       CURRENCY_AMOUNT
                        // getStakedAmountUSD
                        // (
                        //   item.campaign.staked.nativeCurrencyAmount,
                        //   nativeCurrencyUSDPrice
                        // )
                        }
                        apy={item.campaign.apy}
                        containsKpiToken={item.containsKpiToken}
                        usdLiquidityText={item.campaign.locked ? 'LOCKED' : 'STAKED'}
                        staked={item.staked}
                        campaign={item.campaign}
                      />
                    </NavLink>
                  )
                }
              })}
            </ListLayout>
          ) : (
            <Empty>
              <Text fontSize="12px" fontWeight="700" lineHeight="15px" letterSpacing="0.08em">
                NO REWARD POOLS HERE YET
              </Text>
            </Empty>
          )}
        </Box>
        <Box alignSelf="flex-end" mt="16px">
          {!overallLoading && itemsPage.length > 0 && (
            <Pagination 
            currentPage={page} 
            onChange={setPage} 
            totalPages={items?.length ?? 0} 
            pageNeighbours={responsiveItemsPerPage ?? 0} 
            canNextPage={false} 
            canPreviousPage={false}
            />
          )}
        </Box>
      </Flex>
    </>
  )
}