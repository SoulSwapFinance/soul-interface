import React, { useCallback, useEffect, useState } from 'react'
import { LiquidityMiningCampaign, Percent, SingleSidedLiquidityMiningCampaign } from 'sdk'
import { CurrencyAmount, Token } from 'sdk'
import { Card, Flex } from 'rebass'
import styled from 'styled-components'

// import { ReactComponent as ClockSvg } from 'assets/svg/clock.svg'
// import { ReactComponent as LockSvg } from 'assets/svg/lock.svg'
import { TYPE } from 'theme'
// import { unwrappedToken } from 'utils/wrappedCurrency'
// import SimpleTextBadge from 'components/Badge/SimpleText'
// import Countdown from 'components/Countdown'
import { CurrencyLogo } from 'components/CurrencyLogo'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { formatCurrencyAmount } from 'functions/format'

const SizedCard = styled(Card)<{ cardColor: string }>`
  /* width: 260px; */
  height: 147px;
  padding: 16px;
  border-radius: 12px;

  background: ${props => `${props.cardColor}, linear-gradient(${props.theme.bg6}, ${props.theme.bg6})`};
  border: solid 1px #44416380;

  ${props => props.theme.mediaWidth.upToMedium`
    width: 100%;
  `}
  ${props => props.theme.mediaWidth.upToExtraSmall`
    height: initial;
    padding: 22px 16px;
  `}
`

const EllipsizedText = styled(TYPE.Body)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const PercentageBar = styled.div`
  width: 100%;
  height: 3px;
  position: relative;
  background: ${props => props.theme.bg3};
  border-radius: 6px;
  margin-top: 7px;
`

const Loaded = styled(TYPE.Body)`
  background: ${props => props.theme.red1};
  border-radius: 6px;
  height: 100%;
`
const RelativePercentage = styled.div`
  position: absolute;
  right: 0;
  bottom: 9px;
  font-weight: 600;
  font-size: 10px;
  color: ${props => props.theme.red1};
`
const RightSection = styled(Flex)`
  gap: 8px;
  align-items: flex-end;
  flex-direction: column;
`
enum StatusKeys {
  ACTIVE,
  UPCOMING,
  ENDED,
}

const STATUS = {
  [StatusKeys.ACTIVE]: {
    key: 'ACTIVE',
    color: '#0E9F6E',
    cardColor: 'linear-gradient(226.13deg, rgba(15, 152, 106, 0.2) -7.71%, rgba(15, 152, 106, 0) 85.36%)',
  },
  [StatusKeys.UPCOMING]: {
    key: 'UPCOMING',
    color: '#F2994A',
    cardColor: 'linear-gradient(226.13deg, rgba(191, 125, 65, 0.2) -7.71%, rgba(191, 125, 65, 0) 85.36%)',
  },
  [StatusKeys.ENDED]: {
    key: 'ENDED',
    color: '#F02E51',
    cardColor: 'linear-gradient(226.13deg, rgba(190, 42, 70, 0.2) -7.71%, rgba(190, 42, 70, 0) 85.36%)',
  },
}

interface PairProps {
  token0?: Token
  token1?: Token
  apy: Percent
  usdLiquidity: CurrencyAmount<Token>
  usdLiquidityText?: string
  containsKpiToken?: boolean
  isSingleSidedStakingCampaign?: boolean
  staked?: boolean
  campaign: LiquidityMiningCampaign | SingleSidedLiquidityMiningCampaign
}

export function CampaignCard({
  token0,
  token1,
  usdLiquidity,
  apy,
  containsKpiToken,
  usdLiquidityText,
  isSingleSidedStakingCampaign,
  campaign,
  staked,
  ...rest
}: PairProps) {
  const [status, setStatus] = useState<StatusKeys | undefined>(undefined)
  const isLimitedCampaign = campaign.stakingCap != 0
  const percentage = useCallback(() => {
    return (campaign.staked * 100 / campaign.stakingCap).toFixed(0)
  }, [campaign])

  useEffect(() => {
    if (campaign.ended) setStatus(StatusKeys.ENDED)
    else if (Date.now() < parseInt(campaign.startsAt.toString()) * 1000) setStatus(StatusKeys.UPCOMING)
    else setStatus(StatusKeys.ACTIVE)
  }, [campaign.ended, campaign.startsAt])

  return (
    <SizedCard
      cardColor={status !== undefined ? STATUS[status].cardColor : 'transperent'}
      {...rest}
      data-testid="reward-card"
    >
      <Flex flexDirection="column" height={'100%'} data-testid={'reward-starting-at-' + campaign.startsAt}>
        <Flex justifyContent="space-between" flexGrow={1}>
          <Flex flexDirection="column">
            {isSingleSidedStakingCampaign ? (
              <CurrencyLogo 
              size={30}
            //   marginRight={14} 
            //   currency={token0} 
              />
            ) : (
              <DoubleCurrencyLogo
            //    spaceBetween={-5} 
            //    currency0={token0} 
            //    currency1={token1} 
               size={30} />
            )}
            <EllipsizedText marginTop="10px" marginBottom="6px" color="purple2" fontWeight="700" fontSize="16px">
              {/* {unwrappedToken(token0)?.symbol} */}
              {/* {!isSingleSidedStakingCampaign && `/${unwrappedToken(token1)?.symbol}`} */}
            </EllipsizedText>
            <EllipsizedText fontWeight="bold" fontSize="18px" color="#EBE9F8" letterSpacing="0.02em">
              {apy.toFixed(2)}% APY
            </EllipsizedText>
          </Flex>
          <RightSection>
            <Flex width="max-content" alignItems="center">
              {/* <ClockSvg width={'10px'} height={'10px'} /> */}
              <TYPE.Body marginLeft="4px" fontSize="10px" fontWeight="500">
                {/* <Countdown
                  to={
                    status === StatusKeys.UPCOMING
                      ? parseInt(campaign.startsAt.toString())
                      : status === StatusKeys.ENDED
                      ? 0
                      : parseInt(campaign.endsAt.toString())
                  }
                  excludeSeconds
                /> */}
              </TYPE.Body>
            </Flex>
            {status !== undefined && (
              <Flex>
                {/* <SimpleTextBadge text={STATUS[status].key} color={STATUS[status].color} /> */}
              </Flex>
            )}
          </RightSection>
        </Flex>
        <Flex flexDirection="column" marginTop="6px">
          <Flex justifyContent="space-between">
            <Flex>
              {/* {campaign.locked && <LockSvg />} */}
              <TYPE.Body
                alignSelf={'center'}
                marginLeft={campaign.locked ? '4px' : '0'}
                fontSize="10px"
                fontWeight="600"
              >
                ${formatCurrencyAmount(usdLiquidity, 4)} {usdLiquidityText?.toUpperCase() || 'LIQUIDITY'}
              </TYPE.Body>
            </Flex>
            {staked && (
              <Flex>
                {/* <SimpleTextBadge text={'STAKING'} color="#C7C0FF" /> */}
              </Flex>
            )}
          </Flex>
          {isLimitedCampaign && (
            <Flex>
              <PercentageBar>
                {!staked && <RelativePercentage>{percentage()}%</RelativePercentage>}
                <Loaded width={percentage() + '%'} />
              </PercentageBar>
            </Flex>
          )}
        </Flex>
      </Flex>
    </SizedCard>
  )
}