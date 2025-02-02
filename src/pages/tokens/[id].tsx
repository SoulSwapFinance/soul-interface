import Container from '../../components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Token = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <Container id={`token-${id}-page`} className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Token {id} | Soul</title>
        <meta key="description" name="description" content="SoulSwap tokens." />
      </Head>
    </Container>
  )
}


export default Token
