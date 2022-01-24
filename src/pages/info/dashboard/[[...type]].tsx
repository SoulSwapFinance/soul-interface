import Container from '../../../components/Container'
import Head from 'next/head'
import AnalyticsHeader from '../../../features/analytics/Header'
import { useActiveWeb3React } from 'services/web3'

export default function Dashboard() {
  const { account } = useActiveWeb3React()

  return (
    <>
      <Head>
        <title>SoulSwap Liquidity Pair (SLP) Analytics | Soul</title>
        <meta name="description" content="SoulSwap Liquidity Pair (SLP) Analytics by Soul" />
      </Head>
      <AnalyticsHeader />   
      <Container maxWidth="full" className="grid h-full grid-flow-col grid-cols-5 mx-auto gap-9">
        <div className="col-span-6 space-y-6 lg:col-span-6">
      <iframe 
  			frameBorder={"none"}
    		title={"INFO"}
    		src={"https://info.soulswap.finance/account/" + `${account}`}
    		height={"100%" }
    		width={"100%"}
      />
        </div>
      </Container>
    </>
  )
}
