import Search from 'components/Search'
import { getChainColorCode } from 'constants/chains'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import useTokensAnalytics from 'features/analytics/hooks/useTokensAnalytics'
import TokenList from 'features/analytics/Tokens/TokenList'
import useFuse from 'hooks/useFuse'
import Link from 'next/link'
import React from 'react'
import { useActiveWeb3React } from 'services/web3'

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
    <AnalyticsContainer>
      <div className="relative h-8 mt-4">
        <div className="absolute w-full h-full bg-gradient-to-r from-blue to-purple opacity-5" />
        <div className="absolute flex items-center w-full p-2 lg:pl-14">
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics">Dashboard</Link>&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/coffinbox">CoffinBox</Link>&nbsp;
          </div>
          <div className="text-xs font-medium text-secondary m-1">
            <Link href="/analytics/pairs">Pairs</Link>&nbsp;
          </div>
          <div className={`text-xs font-bold text-high-emphesis m-1 text-${getChainColorCode(chainId)}`}>
            Tokens&nbsp;
          </div>
        </div>
      </div>
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
  )
}