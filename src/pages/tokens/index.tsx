import Container from '../../components/Container'
import Head from 'next/head'

const Tokens = () => {
  return (
    <Container id="tokens-page" className="py-4 md:py-8 lg:py-12" maxWidth="full">
      <Head>
        <title>Tokens | Soul</title>
        <meta key="description" name="description" content="SoulSwap Tokens." />
      </Head>
    </Container>
  )
}

export default Tokens
