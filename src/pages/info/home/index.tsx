import Container from '../../../components/Container'
import Head from 'next/head'
import AnalyticsHeader from '../../../features/analytics/Header'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'

export default function Home() {
const { chainId } = useActiveWeb3React()
const blockchainPrefix = chainId 
    == ChainId.AVALANCHE ? 'avax-info' : 'info' 

  return (
    <>
      <Head>
        <title>Analytics | Home</title>
        <meta name="description" content="SoulSwap Analytics" />
      </Head>
      <AnalyticsHeader />   
      <Container maxWidth="full" className="grid h-full grid-flow-col grid-cols-5 mx-auto gap-9">
        <div className="col-span-6 space-y-6 lg:col-span-6">
      <iframe 
  			frameBorder={"none"}
    		title={"INFO"}
    		src={`https://${blockchainPrefix}.soulswap.finance/home`}
    		height={"800px"}
    		width={"100%"}
      />
        </div>
      </Container>
    </>
  )
}
