import Search from 'components/Search'
import AnalyticsContainer from 'features/analytics/AnalyticsContainer'
import Background from 'features/analytics/Background'
import useTokensAnalytics from 'features/analytics/hooks/useTokensAnalytics'
import TokenList from 'features/analytics/Tokens/TokenList'
import useFuse from 'hooks/useFuse'

export default function Tokens() {
  const tokens = useTokensAnalytics()

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