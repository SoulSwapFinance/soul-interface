import Container from 'components/Container'
import Head from 'next/head'

export default function Dashboard() {
  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      {/* <Head>
        <title>Dashboard | Soul</title>
        <meta name="description" content="Soul" />
      </Head> */}
      <iframe 
			frameBorder={"none"}
    		title={"INFO"}
    		src="https://info.soulswap.finance/account"
    		height={"100%" }
    		width={"100%"}
    />
    </Container>
  )
}
