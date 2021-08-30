import Container from '../../components/Container'
import Head from 'next/head'
import BridgeContainer from '../../features/bridge/BridgeContainer'

function Bridge() {
  return (
    <>
      <Container id="bridge-page">
        <Head>
          <title>Bridge | Soul</title>
          <meta key="description" name="description" content="bridge tokens" />
        </Head>

        <BridgeContainer />
      </Container>
    </>
  )
}

export default Bridge