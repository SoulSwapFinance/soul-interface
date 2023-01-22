import Search from 'components/Search'
import { getChainColor, getChainColorCode } from 'constants/chains'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import useTokensAnalytics from 'features/analytics/hooks/useTokensAnalytics'
import TokenList from 'features/analytics/Tokens/TokenList'
import useFuse from 'hooks/useFuse'
import Link from 'next/link'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import SwapDropdown from 'features/swap/SwapDropdown'
import { SwapLayoutCard } from 'layouts/SwapLayout'
import ExchangeAnalyticsHeader from 'features/analytics/ExchangeAnalyticsHeader'

export default function Tokens() {
  const tokens = useTokensAnalytics()
  const { chainId } = useActiveWeb3React()

  const {
    result: tokensSearched,
    term,
    search,
  } = useFuse({
    data: tokens,
    options: {
      keys: ['token.id', 'token.symbol', 'token.name'],
      threshold: 0.4,
    },
  })

  return (
      <Container id="exchange-analytics-tokens-page" maxWidth="2xl" className="space-y-4 mt-4">
      <DoubleGlowShadowV2>
        <SwapLayoutCard>
        <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>
          <SwapDropdown 
          // inputCurrency={currency0} outputCurrency={currency1} 
          />
        <div className={`my-2 border border-2 border-[${getChainColor(chainId)}]`}/>
          <AnalyticsContainer>
            <ExchangeAnalyticsHeader />
      <Background background="tokens">
        <div className="grid items-center justify-between grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-high-emphesis">Tokens</div>
            <div>Click headers to sort by price, liquidity, or volume.</div>
          </div>
          <Search term={term} search={search} />
        </div>
      </Background>
      <div className="px-4 pt-4 lg:px-14">
        <TokenList tokens={tokensSearched} />
      </div>
          </AnalyticsContainer>
        </SwapLayoutCard>
      </DoubleGlowShadowV2>
    </Container>
  )
}