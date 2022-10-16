import { Pair } from 'sdk'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'react-use'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
// import { useActiveWeb3React } from 'services/web3'
// import { useBestAPY } from 'hooks/useBestAPY'
// import { usePairCampaignIndicatorAndLiquidityUSD } from 'hooks/usePairCampaignIndicatorAndLiquidityUSD'
// import { usePair24hVolumeUSD } from 'hooks/usePairVolume24hUSD'
import { useRouter } from 'hooks/useRouter'
// import { useIsSwitchingToCorrectChain } from 'state/multi-chain-links/hooks'
// import { formatCurrencyAmount } from 'utils'
import { ButtonExternalLink } from 'components/Pool/Button'
// import { DimBlurBgBox } from '../../DimBlurBgBox/styleds'
import { InfoGrid } from './InfoGrid/InfoGrid.styles'
// import { ValueWithLabel } from './ValueWithLabel'
import { useActiveWeb3React } from 'services/web3'
// import { formatCurrencyAmount } from 'functions/format'
import { gradients } from 'utils/theme'

interface PairViewProps {
  loading: boolean
  pair?: Pair | null
}

export const DimBlurBgBox = styled(Box)`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.purple5};
  background: ${gradients.purpleDimDark};
  background-blend-mode: normal, overlay, normal;
  backdrop-filter: blur(25px);
`

export function PoolStats({ pair }: PairViewProps) {
  const { navigate } = useRouter()
  const { chainId } = useActiveWeb3React()
  const previousChainId = usePrevious(chainId)
  // todo: fix below
  // const { volume24hUSD } = usePair24hVolumeUSD(pair?.liquidityToken.address)
//   const { liquidityUSD } = usePairCampaignIndicatorAndLiquidityUSD(pair)
  // const { bestAPY } = useBestAPY(pair)
//   const switchingToCorrectChain = useIsSwitchingToCorrectChain()
  const { t } = useTranslation()

  const statsLink = pair?.liquidityToken.address
    ? `https://dxstats.eth.limo/#/pair/${pair?.liquidityToken.address}?chainId=${chainId}`
    : `https://dxstats.eth.limo/#/pairs?chainId=${chainId}`

  useEffect(() => {
    // when the chain is switched, and not as a reaction to following a multi chain link
    // (which might require changing chains), redirect to generic pools page
    if (chainId && previousChainId && chainId !== previousChainId) { // && !switchingToCorrectChain
      navigate('/pools')
    }
  }, [chainId, navigate, previousChainId]) // switchingToCorrectChain

  return (
    <DimBlurBgBox padding={'24px'}>
      <Flex flexDirection={['column', 'row']} alignItems="center" justifyContent="space-between">
        <Text fontSize="16px" mb="16px">
          {t('poolStats')}
        </Text>
        <Box>
          <ButtonExternalLink link={statsLink}>{t('stats')}</ButtonExternalLink>
        </Box>
      </Flex>
      <Box marginTop={4}>
        <InfoGrid>
          {/* <ValueWithLabel title={t('TVL')} value={`$${formatCurrencyAmount(liquidityUSD, 4)}`} /> */}
         {/* <ValueWithLabel title={t('24hVolume')} value={`$${formatCurrencyAmount(volume24hUSD, 4)}`} /> */}
          {/* <ValueWithLabel title={t('APY')} value={`${bestAPY?.toFixed(2) || 0}%`} big /> */}
        </InfoGrid>
      </Box>
    </DimBlurBgBox>
  )
}