import { getChainColorCode } from "constants/chains";
import { useActiveWeb3React } from "hooks";
import Link from "next/link";
import { useRouter } from "next/router";

const ExchangeAnalyticsHeader = () => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const isTokensActive = router.pathname.startsWith('/exchange/analytics/tokens')
  const isPairsActive = router.pathname.startsWith('/exchange/analytics/pairs')
  const isDashboardActive = router.pathname.startsWith('/exchange/analytics/dashboard')
  const activeStyle = `text-xs font-bold text-high-emphesis m-1 text-${getChainColorCode(chainId)}`
  const inactiveStyle = `text-xs font-medium text-secondary m-1`
  return (
    <div className="relative h-8">
      <div className="absolute w-full h-full bg-gradient-to-r from-blue to-purple opacity-5" />
      <div className="absolute flex items-center w-full p-2 lg:pl-14">
        <div className={isDashboardActive ? activeStyle : inactiveStyle}>
          <Link href="/exchange/analytics/dashboard">Dashboard</Link>&nbsp;
        </div>
        <div className={isPairsActive ? activeStyle : inactiveStyle}>
          <Link href="/exchange/analytics/pairs">Pairs</Link>&nbsp;
        </div>
        <div className={isTokensActive ? activeStyle : inactiveStyle}>
        <Link href="/exchange/analytics/tokens">Tokens</Link>&nbsp;
        </div>
      </div>
    </div>
  )
}

export default ExchangeAnalyticsHeader